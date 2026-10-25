import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { eq } from 'drizzle-orm';
import type { Db } from '../lib/db/client.ts';
import { demoAudio, demoVoices } from '../lib/db/schema.ts';
import { demoClip, speechRequest } from '../lib/demo/audio.ts';
import type { AccountVoice, DemoVoiceApi, SharedVoice } from '../lib/demo/eleven.ts';
import { DEMO_CALL } from '../lib/demo/script.ts';
import { forgetDemoVoices, pickAccountVoice, pickSharedVoice, premadeFallback, resolveDemoVoices } from '../lib/demo/voices.ts';
import { isOpenQuestion, isQuestion, sentences } from '../lib/live/speech.ts';
import { testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());
beforeEach(async () => {
  await db.delete(demoVoices);
  await db.delete(demoAudio);
  delete process.env.ELEVENLABS_DEMO_SELLER_VOICE;
  delete process.env.ELEVENLABS_DEMO_PROSPECT_VOICE;
});

const voice = (id: string, name: string, labels: Record<string, string>, description = ''): AccountVoice => ({
  id,
  name,
  category: 'premade',
  labels,
  description,
  languages: [],
});

const ACCOUNT = [
  voice('voixSarah0001', 'Sarah', { gender: 'female', age: 'young', description: 'soft' }),
  voice('voixMatilda01', 'Matilda', { gender: 'female', age: 'middle_aged', description: 'warm' }),
  voice('voixBrian0001', 'Brian', { gender: 'male', age: 'middle_aged', description: 'deep' }),
  voice('voixWill00001', 'Will', { gender: 'male', age: 'young', description: 'friendly' }),
];

const shared = (id: string, descriptive: string, usage: number, extra: Partial<SharedVoice> = {}): SharedVoice => ({
  ownerId: `owner_${id}`,
  id,
  name: `Voix ${id}`,
  gender: 'male',
  age: 'middle_aged',
  descriptive,
  useCase: 'conversational',
  category: 'professional',
  description: '',
  usage,
  freeUsersAllowed: true,
  ...extra,
});

function fakeApi(over: Partial<DemoVoiceApi> = {}) {
  const calls: string[] = [];
  const api: DemoVoiceApi = {
    async voices() {
      calls.push('voices');
      return ACCOUNT;
    },
    async cloneVoice(name, sample) {
      calls.push(`clone:${name}:${sample.length}`);
      return 'voixCloneVendeur';
    },
    async sharedVoices(query) {
      calls.push(`shared:${query.language}:${query.descriptives ?? '-'}`);
      return [shared('libCalme01', 'calm', 900), shared('libGrave01', 'deep', 500), shared('libGrave02', 'gravelly', 800), shared('libStar01', 'deep', 9999, { category: 'famous' })];
    },
    async addSharedVoice(ownerId, voiceId) {
      calls.push(`add:${ownerId}:${voiceId}`);
      return `ajout_${voiceId}`;
    },
    async speech(voiceId, body) {
      calls.push(`speech:${voiceId}:${body.text.slice(0, 12)}`);
      return { mime: 'audio/mpeg', audio: new Uint8Array([1, 2, 3, voiceId.length]) };
    },
    async designVoice() {
      throw new Error('ElevenLabs → 404');
    },
    async saveDesignedVoice() {
      throw new Error('ElevenLabs → 404');
    },
    ...over,
  };
  return { api, calls };
}

test('le script de démo existe en français et en anglais, réplique pour réplique', () => {
  const fr = DEMO_CALL.fr.lines;
  const en = DEMO_CALL.en.lines;
  assert.equal(fr.length, en.length);
  fr.forEach((line, i) => {
    assert.equal(line.role, en[i].role, `réplique ${i}`);
    assert.ok(line.text.trim() && en[i].text.trim());
  });
  assert.equal(fr[0].role, 'prospect', 'le prospect décroche');
  // Le vendeur de la démo pose de vraies questions : c'est ce que l'écran met en avant.
  for (const locale of ['fr', 'en'] as const) {
    const questions = DEMO_CALL[locale].lines.filter((l) => l.role === 'seller').flatMap((l) => sentences(l.text)).filter(isQuestion);
    assert.ok(questions.length >= 4, `${locale} : ${questions.length} questions`);
    assert.ok(questions.filter((q) => isOpenQuestion(q, locale)).length >= 4, `${locale} : questions ouvertes`);
  }
});

test('les voix du compte : grave et masculine pour le prospect, féminine pour la vendeuse', () => {
  assert.equal(pickAccountVoice(ACCOUNT, { gender: 'male', deep: true, language: 'fr' })?.name, 'Brian');
  assert.equal(pickAccountVoice(ACCOUNT, { gender: 'female', deep: false, language: 'fr' })?.name, 'Matilda');
  assert.equal(pickAccountVoice([], { gender: 'male', deep: true, language: 'fr' }), null);
});

test('bibliothèque : une voix grave, la plus utilisée, jamais une célébrité', () => {
  assert.equal(pickSharedVoice([shared('a', 'deep', 10), shared('b', 'gravelly', 50), shared('c', 'deep', 999, { category: 'famous' })])?.id, 'b');
  assert.equal(pickSharedVoice([shared('a', 'calm', 10)]), null);
  assert.equal(pickSharedVoice([shared('a', 'deep', 10, { gender: 'female' })]), null);
});

test("la vendeuse prend la voix clonée de l'extrait en base, le prospect une voix grave de la bibliothèque, une seule fois", async () => {
  await db.insert(demoVoices).values({ role: 'seller', sample: new Uint8Array(2048) });
  const { api, calls } = fakeApi();
  const first = await resolveDemoVoices(db, api, 'fr');
  assert.deepEqual(first, {
    seller: { id: 'voixCloneVendeur', name: 'Blackstart démo · vendeur', source: 'clone' },
    prospect: { id: 'ajout_libGrave02', name: 'Blackstart démo · prospect (Voix libGrave02)', source: 'library' },
  });
  assert.ok(calls.includes('clone:Blackstart démo · vendeur:2048'));
  assert.ok(calls.includes('add:owner_libGrave02:libGrave02'));

  // Les voix ajoutées apparaissent ensuite dans le compte : la deuxième fois, rien n'est recréé.
  const { api: api2, calls: calls2 } = fakeApi({
    async voices() {
      return [...ACCOUNT, voice('voixCloneVendeur', 'Blackstart démo · vendeur', {}), voice('ajout_libGrave02', 'Prospect', {})];
    },
  });
  const second = await resolveDemoVoices(db, api2, 'fr');
  assert.equal(second?.seller.source, 'saved');
  assert.equal(second?.prospect.source, 'saved');
  assert.equal(calls2.filter((c) => c.startsWith('clone') || c.startsWith('add')).length, 0);
  // L'extrait reste en base à côté de la voix retenue.
  const [row] = await db.select().from(demoVoices).where(eq(demoVoices.role, 'seller'));
  assert.equal(row.voiceId, 'voixCloneVendeur');
  assert.equal(row.sample?.length, 2048);
});

test('sans clonage ni bibliothèque possibles, la démo garde des voix du compte', async () => {
  await db.insert(demoVoices).values({ role: 'seller', sample: new Uint8Array(10) });
  const refuse = async () => {
    throw new Error('ElevenLabs → 403');
  };
  const { api } = fakeApi({ cloneVoice: refuse, sharedVoices: refuse });
  const voices = await resolveDemoVoices(db, api, 'en');
  assert.deepEqual(voices, {
    seller: { id: 'voixMatilda01', name: 'Matilda', source: 'account' },
    prospect: { id: 'voixBrian0001', name: 'Brian', source: 'account' },
  });
  assert.equal((await db.select().from(demoVoices)).filter((r) => r.voiceId).length, 0, 'un repli ne fige rien en base');
});

test("les variables d'environnement imposent les voix, par nom ou par identifiant", async () => {
  process.env.ELEVENLABS_DEMO_SELLER_VOICE = 'sarah';
  process.env.ELEVENLABS_DEMO_PROSPECT_VOICE = 'voixHorsCompte42';
  const { api, calls } = fakeApi();
  const voices = await resolveDemoVoices(db, api, 'fr');
  assert.deepEqual(voices, {
    seller: { id: 'voixSarah0001', name: 'Sarah', source: 'env' },
    prospect: { id: 'voixHorsCompte42', name: 'voixHorsCompte42', source: 'env' },
  });
  assert.deepEqual(calls, ['voices']);
});

test("compte ElevenLabs gratuit : la voix de bibliothèque refusée est remplacée par une voix standard, une fois pour toutes", async () => {
  const { api } = fakeApi();
  const first = (await resolveDemoVoices(db, api, 'fr'))!;
  assert.equal(first.prospect.source, 'library');
  const next = await premadeFallback(db, api, 'fr', 'prospect', first);
  assert.deepEqual(next?.prospect, { id: 'voixBrian0001', name: 'Brian', source: 'account' });
  assert.deepEqual(next?.seller, first.seller, 'la vendeuse ne change pas');
  forgetDemoVoices();
  const again = await resolveDemoVoices(db, api, 'fr');
  assert.deepEqual(again?.prospect, { id: 'voixBrian0001', name: 'Brian', source: 'saved' });
  // Une voix imposée par l'environnement mais refusée laisse aussi la place à une voix standard : pas d'appel muet.
  const env = await premadeFallback(db, api, 'fr', 'seller', { ...first, seller: { id: 'voixEnv00001', name: 'E', source: 'env' } });
  assert.equal(env?.seller.source, 'account');
  assert.notEqual(env?.seller.id, 'voixEnv00001');
});

test('en français, des voix parisiennes créées une fois avec Voice Design, jamais pour l’anglais', async () => {
  const texts: string[] = [];
  const { api, calls } = fakeApi({
    async designVoice(description, text, seed) {
      texts.push(text);
      calls.push(`design:${seed}:${description.slice(0, 12)}`);
      return [{ generatedId: `gen${seed}en`, language: 'en' }, { generatedId: `gen${seed}fr`, language: 'fr' }];
    },
    async saveDesignedVoice(name, _description, generatedId) {
      calls.push(`save:${generatedId}`);
      return `voix_${generatedId}`;
    },
  });
  const fr = await resolveDemoVoices(db, api, 'fr');
  assert.deepEqual(fr, {
    seller: { id: 'voix_gen301fr', name: 'Blackstart démo · vendeuse parisienne', source: 'design' },
    prospect: { id: 'voix_gen302fr', name: 'Blackstart démo · prospect parisien', source: 'design' },
  });
  assert.ok(texts.every((t) => t.length >= 100 && t.length <= 1000), 'texte d’essai entre 100 et 1 000 caractères');
  const { api: api2, calls: calls2 } = fakeApi({
    async voices() {
      return [...ACCOUNT, voice('voix_gen301fr', 'V', {}), voice('voix_gen302fr', 'P', {})];
    },
  });
  const again = await resolveDemoVoices(db, api2, 'fr');
  assert.equal(again?.seller.id, 'voix_gen301fr');
  assert.equal(again?.prospect.source, 'saved');
  assert.ok(!calls2.some((c) => c.startsWith('design')));
  // En anglais, la vendeuse ne prend pas la voix parisienne.
  const en = await resolveDemoVoices(db, api2, 'en');
  assert.notEqual(en?.seller.id, 'voix_gen301fr');
});

test('chaque réplique est synthétisée une fois puis servie depuis la base', async () => {
  const voices = {
    seller: { id: 'voixVendeur01', name: 'V', source: 'env' as const },
    prospect: { id: 'voixProspect1', name: 'P', source: 'env' as const },
  };
  const { api, calls } = fakeApi();
  const a = await demoClip(db, api, 'fr', 1, voices);
  const b = await demoClip(db, api, 'fr', 1, voices);
  assert.deepEqual(a?.audio, b?.audio);
  assert.equal(calls.filter((c) => c.startsWith('speech')).length, 1);
  assert.equal(await demoClip(db, api, 'fr', 999, voices), null);

  // Le prospect parle avec sa voix ; une autre voix donne un autre enregistrement.
  await demoClip(db, api, 'fr', 0, voices);
  assert.ok(calls.includes('speech:voixProspect1:Plomberie Le'));
  await demoClip(db, api, 'fr', 1, { ...voices, seller: { ...voices.seller, id: 'autreVoix0001' } });
  assert.equal(calls.filter((c) => c.startsWith('speech')).length, 3);
});

test('la synthèse lit le texte prononcé et garde le fil de la conversation', () => {
  const voices = {
    seller: { id: 'voixVendeur01', name: 'V', source: 'env' as const },
    prospect: { id: 'voixProspect1', name: 'P', source: 'env' as const },
  };
  const price = DEMO_CALL.fr.lines.findIndex((l) => l.text.startsWith('149'));
  const req = speechRequest('fr', price, voices)!;
  assert.match(req.body.text, /^Cent quarante-neuf euros/);
  assert.equal(req.voiceId, 'voixVendeur01');
  assert.equal(req.body.previous_text, DEMO_CALL.fr.lines[price - 1].text);
  assert.equal(req.body.next_text, undefined, 'la réplique suivante est celle du prospect');
  const doubled = DEMO_CALL.fr.lines.findIndex((l, i) => l.role === DEMO_CALL.fr.lines[i + 1]?.role);
  assert.ok(speechRequest('fr', doubled, voices)!.body.next_text);
});
