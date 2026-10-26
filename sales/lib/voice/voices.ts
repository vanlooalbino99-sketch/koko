import type { Locale } from '../domain.ts';
import { listVoices, type Voice } from './catalog.ts';
import type { Gender } from './gender.ts';

// Voix ElevenLabs par défaut du prospect : « fr », « en », et par genre « fr_female », « en_male »… Sans réglage,
// l'agent garde la voix par défaut d'ElevenLabs, qui parle les deux langues avec le modèle multilingue.
export type VoiceDefaults = Partial<Record<Locale | `${Locale}_${Gender}`, string>>;

const LOCALES: Locale[] = ['fr', 'en'];
const ENV_GENDER: Record<Gender, string> = { female: 'FEMALE', male: 'MALE' };

export function configuredVoices(): VoiceDefaults {
  const voices: VoiceDefaults = {};
  for (const l of LOCALES) {
    const any = process.env[`ELEVENLABS_VOICE_${l.toUpperCase()}`]?.trim();
    if (any) voices[l] = any;
    for (const g of ['female', 'male'] as const) {
      const v = process.env[`ELEVENLABS_VOICE_${l.toUpperCase()}_${ENV_GENDER[g]}`]?.trim();
      if (v) voices[`${l}_${g}`] = v;
    }
  }
  return voices;
}

export function defaultVoice(voices: VoiceDefaults, language: Locale, gender: Gender | null): string | undefined {
  return (gender ? voices[`${language}_${gender}`] : undefined) ?? voices[language];
}

// Voix du compte du bon genre, l'accent de la langue d'abord ; l'ordre alphabétique garde le même choix d'un appel à l'autre.
export function pickGendered(voices: Voice[], language: Locale, gender: Gender): string | undefined {
  const accent = language === 'fr' ? /french|fran|parisian/ : /american|british|english/;
  const ok = voices.filter((v) => v.gender === gender);
  return (ok.find((v) => v.accent && accent.test(v.accent)) ?? ok[0])?.id;
}

// Réglages complétés avec les voix du compte : une prospecte a une voix de femme même si la voix par défaut de la
// langue est masculine, et inversement. Une voix choisie dans l'environnement reste prioritaire.
export function completeVoices(env: VoiceDefaults, account: Voice[]): VoiceDefaults {
  const voices: VoiceDefaults = { ...env };
  for (const l of LOCALES) {
    const base = env[l] ? account.find((v) => v.id === env[l]) : undefined;
    for (const g of ['female', 'male'] as const) {
      if (voices[`${l}_${g}`]) continue;
      // Voix par défaut sans genre connu : on la suppose masculine (voix des prospects avant ce réglage).
      const baseGender = base?.gender ?? (env[l] ? 'male' : null);
      if (baseGender === g) continue;
      // Sans voix par défaut, ElevenLabs prend sa voix masculine : seules les prospectes ont besoin d'une voix.
      if (!env[l] && g === 'male') continue;
      const id = pickGendered(account, l, g);
      if (id) voices[`${l}_${g}`] = id;
    }
  }
  return voices;
}

export async function resolvedVoices(): Promise<VoiceDefaults> {
  return completeVoices(configuredVoices(), await listVoices());
}
