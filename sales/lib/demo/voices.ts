import { eq } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import { demoVoices } from '../db/schema.ts';
import type { Locale } from '../domain.ts';
import type { AccountVoice, DemoVoiceApi, SharedVoice } from './eleven.ts';
import { DEMO_CALL } from './script.ts';

// Voix de la démo publique. Ordre de choix, pour chaque rôle :
// 1. la variable d'environnement (identifiant ou nom exact d'une voix du compte) ;
// 2. la voix déjà retenue et enregistrée en base (table demo_voices) ;
// 3. vendeur : un clone de l'extrait de voix fourni par l'équipe (rangé en base, jamais dans le dépôt public) ;
//    prospect : une voix masculine grave de la bibliothèque ElevenLabs, dans la langue de l'appel, ajoutée au compte ;
// 4. la voix du compte qui ressemble le plus à ce qu'on cherche.
export type DemoVoiceSource = 'env' | 'saved' | 'clone' | 'design' | 'library' | 'account';
export type DemoVoice = { id: string; name: string; source: DemoVoiceSource };
export type DemoVoices = { seller: DemoVoice; prospect: DemoVoice };

const VOICE_ID = /^[A-Za-z0-9_-]{8,64}$/;
const DEEP = /\b(deep|gravelly|husky|raspy|rough|low|resonant|grave|rauque|profonde?|gruff|mature)\b/i;
const WARM = /\b(warm|friendly|conversational|natural|confident|casual|pleasant|clear|chaleureuse?|naturelle?)\b/i;

type Want = { gender: 'male' | 'female'; deep: boolean; language: Locale };

// Note d'une voix du compte pour un rôle : genre d'abord, puis timbre, âge et langue.
export function scoreVoice(v: AccountVoice, want: Want): number {
  const labels = Object.values(v.labels).join(' ');
  const text = `${labels} ${v.description}`;
  const gender = v.labels.gender?.toLowerCase();
  let score = 0;
  if (gender === want.gender) score += 10;
  else if (gender) score -= 10;
  if (want.deep && DEEP.test(text)) score += 5;
  if (!want.deep && WARM.test(text)) score += 3;
  const age = v.labels.age?.toLowerCase() ?? '';
  if (want.deep && /middle|old/.test(age)) score += 2;
  if (!want.deep && /young|middle/.test(age)) score += 1;
  const accent = v.labels.accent?.toLowerCase() ?? '';
  if (want.language === 'fr' && /french|fran|parisian/.test(accent)) score += 4;
  if (want.language === 'en' && /american|british|english/.test(accent)) score += 2;
  if (v.languages.includes(want.language)) score += 2;
  return score;
}

export function pickAccountVoice(voices: AccountVoice[], want: Want): AccountVoice | null {
  let best: AccountVoice | null = null;
  let top = -Infinity;
  for (const v of voices) {
    const s = scoreVoice(v, want);
    if (s > top) [best, top] = [v, s];
  }
  return best;
}

// Voix de la bibliothèque pour le prospect : grave d'après sa description, la plus utilisée d'abord (les voix
// très utilisées sont en général les plus propres). Les voix de célébrités sont écartées.
export function pickSharedVoice(voices: SharedVoice[]): SharedVoice | null {
  const ok = voices.filter((v) => v.category !== 'famous' && v.gender.toLowerCase() === 'male');
  const deep = ok.filter((v) => DEEP.test(`${v.descriptive} ${v.description}`));
  const pool = deep.length ? deep : [];
  pool.sort((a, b) => Number(b.freeUsersAllowed) - Number(a.freeUsersAllowed) || b.usage - a.usage);
  return pool[0] ?? null;
}

function fromEnv(value: string | undefined, voices: AccountVoice[]): DemoVoice | null {
  const v = value?.trim();
  if (!v) return null;
  const found = voices.find((x) => x.id === v) ?? voices.find((x) => x.name.toLowerCase() === v.toLowerCase());
  if (found) return { id: found.id, name: found.name, source: 'env' };
  return VOICE_ID.test(v) ? { id: v, name: v, source: 'env' } : null;
}

async function saved(db: Db, role: string, voices: AccountVoice[], only?: (source: string | null) => boolean) {
  const [row] = await db.select().from(demoVoices).where(eq(demoVoices.role, role));
  // Une voix enregistrée puis supprimée du compte ne sert plus : on en cherche une autre.
  const usable = row?.voiceId && (!only || only(row.source)) && (voices.length === 0 || voices.some((v) => v.id === row.voiceId));
  return { row, voice: usable ? ({ id: row.voiceId!, name: row.name ?? row.voiceId!, source: 'saved' } as DemoVoice) : null };
}

async function remember(db: Db, role: string, voice: DemoVoice) {
  await db
    .insert(demoVoices)
    .values({ role, voiceId: voice.id, name: voice.name, source: voice.source })
    .onConflictDoUpdate({ target: demoVoices.role, set: { voiceId: voice.id, name: voice.name, source: voice.source, updatedAt: new Date() } });
}

const quiet = (what: string, error: unknown) => console.error(`[demo] ${what}`, error instanceof Error ? error.message : error);

// Voix françaises à l'accent parisien, créées une fois avec Voice Design puis gardées en base.
const PARISIAN = {
  seller:
    'French woman around 30 with a native Parisian accent. Warm, clear, confident and friendly voice of a professional sales rep making a phone call. Natural conversational pace, close-mic studio recording.',
  prospect:
    'French man in his fifties with a native Parisian accent. Deep, low, slightly gravelly voice of a busy small-business owner, direct and a little impatient but polite. Natural conversational delivery, clear recording.',
};

function sampleText(role: 'seller' | 'prospect') {
  const text = DEMO_CALL.fr.lines
    .filter((l) => l.role === role)
    .map((l) => l.say ?? l.text)
    .join(' ');
  if (text.length > 1000) return text.slice(0, 1000).replace(/\s+\S*$/, '');
  return text.length >= 100 ? text : `${text} ${text}`;
}

async function parisianVoice(db: Db, api: DemoVoiceApi, voices: AccountVoice[], role: 'seller' | 'prospect'): Promise<DemoVoice | null> {
  const key = role === 'seller' ? 'seller' : 'prospect:fr';
  const { voice } = await saved(db, key, voices, (source) => source === 'design');
  if (voice) return voice;
  try {
    const previews = await api.designVoice(PARISIAN[role], sampleText(role), role === 'seller' ? 301 : 302);
    const pick = previews.find((p) => p.language === 'fr') ?? previews[0];
    if (!pick) return null;
    const name = role === 'seller' ? 'Blackstart démo · vendeuse parisienne' : 'Blackstart démo · prospect parisien';
    const id = await api.saveDesignedVoice(name, PARISIAN[role], pick.generatedId);
    const designed: DemoVoice = { id, name, source: 'design' };
    await remember(db, key, designed);
    return designed;
  } catch (error) {
    quiet(`voix parisienne (${role}) impossible à créer`, error);
    return null;
  }
}

async function sellerVoice(db: Db, api: DemoVoiceApi, voices: AccountVoice[], locale: Locale): Promise<DemoVoice | null> {
  const env = fromEnv(process.env.ELEVENLABS_DEMO_SELLER_VOICE, voices);
  if (env) return env;
  if (locale === 'fr') {
    const parisian = await parisianVoice(db, api, voices, 'seller');
    if (parisian) return parisian;
  }
  // La voix parisienne de la vendeuse ne sert qu'en français.
  const { row, voice } = await saved(db, 'seller', voices, (source) => source !== 'design');
  if (voice) return voice;
  if (row?.sample && row.sample.length > 0) {
    try {
      const name = 'Blackstart démo · vendeur';
      const id = await api.cloneVoice(name, row.sample, "Voix du vendeur de la démo publique, d'après l'extrait fourni par l'équipe.");
      const cloned: DemoVoice = { id, name, source: 'clone' };
      await remember(db, 'seller', cloned);
      return cloned;
    } catch (error) {
      quiet('clone de la voix du vendeur impossible', error);
    }
  }
  // L'extrait fourni est une voix féminine (hauteur médiane mesurée autour de 200 Hz).
  const best = pickAccountVoice(voices, { gender: 'female', deep: false, language: locale });
  return best ? { id: best.id, name: best.name, source: 'account' } : null;
}

async function prospectVoice(db: Db, api: DemoVoiceApi, voices: AccountVoice[], locale: Locale, sellerId: string | null): Promise<DemoVoice | null> {
  const env = fromEnv(process.env.ELEVENLABS_DEMO_PROSPECT_VOICE, voices);
  if (env) return env;
  if (locale === 'fr') {
    const parisian = await parisianVoice(db, api, voices, 'prospect');
    if (parisian) return parisian;
  }
  const role = `prospect:${locale}`;
  const { voice } = await saved(db, role, voices);
  if (voice) return voice;
  try {
    const queries = [
      { language: locale, gender: 'male' as const, age: 'middle_aged', descriptives: 'deep' },
      { language: locale, gender: 'male' as const, age: 'middle_aged' },
      { language: locale, gender: 'male' as const },
    ];
    for (const query of queries) {
      const shared = pickSharedVoice(await api.sharedVoices(query));
      if (!shared) continue;
      const name = `Blackstart démo · prospect (${shared.name})`.slice(0, 80);
      const id = await api.addSharedVoice(shared.ownerId, shared.id, name);
      const added: DemoVoice = { id, name, source: 'library' };
      await remember(db, role, added);
      return added;
    }
  } catch (error) {
    quiet('voix de prospect introuvable dans la bibliothèque', error);
  }
  const best = pickAccountVoice(
    voices.filter((v) => v.id !== sellerId),
    { gender: 'male', deep: true, language: locale },
  );
  return best ? { id: best.id, name: best.name, source: 'account' } : null;
}

// Compte ElevenLabs gratuit : l'API refuse les voix de la bibliothèque (402 paid_plan_required). On se rabat sur
// une voix standard du compte pour ce rôle, enregistrée en base pour ne plus retenter la bibliothèque.
export async function premadeFallback(
  db: Db,
  api: DemoVoiceApi,
  locale: Locale,
  role: 'seller' | 'prospect',
  current: DemoVoices,
): Promise<DemoVoices | null> {
  if (current[role].source === 'env') return null;
  const other = role === 'seller' ? current.prospect.id : current.seller.id;
  const premade = (await api.voices()).filter((v) => v.category === 'premade' && v.id !== current[role].id && v.id !== other);
  const want: Want = role === 'seller' ? { gender: 'female', deep: false, language: locale } : { gender: 'male', deep: true, language: locale };
  const best = pickAccountVoice(premade, want);
  if (!best) return null;
  const voice: DemoVoice = { id: best.id, name: best.name, source: 'account' };
  await remember(db, role === 'seller' ? 'seller' : `prospect:${locale}`, voice);
  forgetDemoVoices();
  return { ...current, [role]: voice };
}

export async function resolveDemoVoices(db: Db, api: DemoVoiceApi, locale: Locale): Promise<DemoVoices | null> {
  let voices: AccountVoice[] = [];
  try {
    voices = await api.voices();
  } catch (error) {
    quiet('liste des voix indisponible', error);
  }
  const seller = await sellerVoice(db, api, voices, locale);
  const prospect = await prospectVoice(db, api, voices, locale, seller?.id ?? null);
  const label = (v: DemoVoice | null) => (v ? `${v.name} (${v.source})` : 'aucune');
  console.log(`[demo] voix ${locale} : vendeuse ${label(seller)}, prospect ${label(prospect)}`);
  return seller && prospect ? { seller, prospect } : null;
}

// Une seule recherche à la fois par langue, gardée 10 minutes : la page publique ne relance pas de clonage ni
// d'ajout de voix à chaque visite.
const TTL_MS = 10 * 60 * 1000;
const memo = globalThis as typeof globalThis & { __bsDemoVoices?: Map<string, { at: number; value: Promise<DemoVoices | null> }> };

export function demoVoicesFor(db: Db, api: DemoVoiceApi, locale: Locale): Promise<DemoVoices | null> {
  memo.__bsDemoVoices ??= new Map();
  const cached = memo.__bsDemoVoices.get(locale);
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;
  const value = resolveDemoVoices(db, api, locale).catch((error) => {
    quiet('choix des voix impossible', error);
    return null;
  });
  memo.__bsDemoVoices.set(locale, { at: Date.now(), value });
  void value.then((v) => {
    // Échec : on réessaiera à la prochaine visite plutôt que dans 10 minutes.
    if (!v) memo.__bsDemoVoices?.delete(locale);
  });
  return value;
}

export function forgetDemoVoices() {
  memo.__bsDemoVoices?.clear();
}
