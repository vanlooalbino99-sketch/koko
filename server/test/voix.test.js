// Voix off de la Formation par ElevenLabs : enregistrée une fois, gardée sur le disque, repli sur la voix du projet.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { testApp } from './helpers.js';
import { phrasesFormation } from '../../scripts/formation/phrases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const JSONH = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
const [[H, TEXTE], [H2]] = [...phrasesFormation(ROOT)];
let server, base, made, admin, sansFormation, appels = [], reponse = 'ok';

// Faux ElevenLabs : enregistre les appels, répond un MP3 factice ou une erreur.
async function faux(url, opts) {
  appels.push({ url, opts, body: JSON.parse(opts.body) });
  if (reponse === 'quota') return new Response('{"detail":"quota_exceeded"}', { status: 401 });
  return new Response(Buffer.alloc(4000, 7), { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });
}

before(async () => {
  made = await testApp({ voix: { apiKey: 'cle-test', voiceId: 'voixFR', fetchImpl: faux, log: { warn() {} } } });
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  let r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Admin', email: 'admin@exemple.fr', password: 'motdepasse-solide-1' }) });
  admin = r.headers.get('set-cookie').split(';')[0];
  r = await fetch(base + '/api/users', { method: 'POST', headers: { ...JSONH, Cookie: admin }, body: JSON.stringify({ name: 'Paul', email: 'paul@exemple.fr', password: 'motdepasse-solide-2', role: 'membre' }) });
  const id = (await r.json()).user.id;
  await fetch(base + `/api/users/${id}`, { method: 'PATCH', headers: { ...JSONH, Cookie: admin }, body: JSON.stringify({ acces: ['today'] }) });
  r = await fetch(base + '/api/auth/login', { method: 'POST', headers: JSONH, body: JSON.stringify({ email: 'paul@exemple.fr', password: 'motdepasse-solide-2' }) });
  sansFormation = r.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); await made.cleanup(); });

const get = (path, cookie) => fetch(base + path, { headers: cookie ? { Cookie: cookie } : {}, redirect: 'manual' });

test('la page du CRM indique la voix ElevenLabs aux comptes qui ont la Formation', async () => {
  assert.match(await (await get('/', admin)).text(), /"voix":"voix\/el\/"/);
  assert.doesNotMatch(await (await get('/', sansFormation)).text(), /"voix":/);
});

test('connexion et accès à la Formation exigés', async () => {
  assert.equal((await get(`/voix/el/${H}.mp3`)).status, 401);
  assert.equal((await get(`/voix/el/${H}.mp3`, sansFormation)).status, 403);
  assert.equal(appels.length, 0);
});

test('une phrase est enregistrée une seule fois puis servie depuis le disque', async () => {
  let r = await get(`/voix/el/${H}.mp3`, admin);
  assert.equal(r.status, 200);
  assert.equal((await r.arrayBuffer()).byteLength, 4000);
  assert.equal(appels.length, 1);
  assert.match(appels[0].url, /\/v1\/text-to-speech\/voixFR\?output_format=mp3_44100_128$/);
  assert.equal(appels[0].opts.headers['xi-api-key'], 'cle-test');
  assert.deepEqual(appels[0].body, { text: TEXTE, model_id: 'eleven_multilingual_v2' });
  r = await get(`/voix/el/${H}.mp3`, admin);
  assert.equal(r.status, 200);
  assert.equal(appels.length, 1);
});

test('texte libre impossible : seules les phrases de la Formation existent', async () => {
  assert.equal((await get('/voix/el/00000000.mp3', admin)).status, 404);
  assert.equal((await get('/voix/el/..%2Fsecret.mp3', admin)).status, 404);
  assert.equal(appels.length, 1);
});

test('refus d’ElevenLabs : renvoi vers la voix du projet, sans réessayer à chaque phrase', async () => {
  reponse = 'quota';
  let r = await get(`/voix/el/${H2}.mp3`, admin);
  assert.equal(r.status, 302);
  assert.equal(r.headers.get('location'), `/voix/${H2}.mp3`);
  const n = appels.length;
  r = await get(`/voix/el/${H2}.mp3`, admin);
  assert.equal(r.status, 302);
  assert.equal(appels.length, n);
  assert.equal((await get(`/voix/${H2}.mp3`)).status, 200);
});

test('sans clé ElevenLabs, rien ne change', async () => {
  const sans = await testApp();
  const s = await new Promise((res) => { const x = sans.app.listen(0, () => res(x)); });
  const b = `http://127.0.0.1:${s.address().port}`;
  assert.equal((await fetch(`${b}/voix/el/${H}.mp3`)).status, 404);
  assert.equal((await fetch(`${b}/voix/${H}.mp3`)).status, 200);
  s.close(); await sans.cleanup();
});
