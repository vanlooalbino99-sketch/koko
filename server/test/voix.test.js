// Voix off ElevenLabs de la formation (/api/formation/voix) : clé collée par un administrateur (chiffrée),
// phrases lues une seule fois et gardées en base, arrêt propre quand le crédit du mois est épuisé.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp } from './helpers.js';
import { empreinte } from '../src/routes/voix.js';

const JSONH = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
const CLE = 'sk_' + 'a'.repeat(40);
let server, base, made, admin, marie;
const lus = [];
let epuise = false;
const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } });
async function faux(url, opts) {
  const u = new URL(url);
  if (opts.headers['xi-api-key'] !== CLE) return json({ detail: { status: 'invalid_api_key', message: 'Invalid API key' } }, 401);
  if (u.pathname === '/v1/voices') return json({ voices: [{ voice_id: 'premadeSarah01', name: 'Sarah', category: 'premade', labels: { gender: 'female' } }, { voice_id: 'frAmelie00001', name: 'Amélie', category: 'cloned', labels: { language: 'fr', gender: 'female' } }] });
  if (u.pathname === '/v1/user/subscription') return json({ character_count: 1200, character_limit: 10000, tier: 'free', next_character_count_reset_unix: 1790000000 });
  if (u.pathname.includes('/v1/text-to-speech/')) {
    const b = JSON.parse(opts.body);
    if (epuise) return json({ detail: { status: 'quota_exceeded', message: 'quota' } }, 401);
    lus.push({ voix: u.pathname.split('/')[3], texte: b.text, modele: b.model_id });
    return json({ audio_base64: Buffer.from('ID3' + b.text).toString('base64'), alignment: { character_end_times_seconds: [0.5, 1.25, 2.4] } });
  }
  return json({}, 404);
}
const call = (c, method, path, body) => fetch(base + path, { method, headers: { ...JSONH, Cookie: c }, body: body ? JSON.stringify(body) : undefined });
const attendre = async (fn) => { for (let i = 0; i < 100; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 20)); } throw new Error('délai dépassé'); };

before(async () => {
  delete process.env.ELEVENLABS_API_KEY;
  made = await testApp({ voix: { appel: faux } });
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Albino', email: 'albino@exemple.fr', password: 'motdepasse-solide-1' }) });
  admin = r.headers.get('set-cookie').split(';')[0];
  await call(admin, 'POST', '/api/users', { name: 'Marie', email: 'marie@exemple.fr', password: 'motdepasse-solide-2', role: 'membre' });
  const r0 = await fetch(base + '/api/auth/login', { method: 'POST', headers: JSONH, body: JSON.stringify({ email: 'marie@exemple.fr', password: 'motdepasse-solide-2' }) });
  marie = r0.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); await made.cleanup(); });

test('la clé : réservée aux administrateurs, vérifiée, chiffrée, jamais renvoyée', async () => {
  let e = await (await call(admin, 'GET', '/api/formation/voix/etat')).json();
  assert.equal(e.cle, false);
  assert.equal((await call(marie, 'PUT', '/api/formation/voix/cle', { cle: CLE })).status, 403);
  let r = await call(admin, 'PUT', '/api/formation/voix/cle', { cle: 'sk_' + 'b'.repeat(40) });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /refusée/);
  assert.equal((await call(admin, 'PUT', '/api/formation/voix/cle', { cle: ' ' + CLE + '\n' })).status, 200);
  const row = await made.db.get('SELECT value FROM settings WHERE key = ?', 'voix_eleven');
  assert.ok(!row.value.includes(CLE));
  e = await (await call(admin, 'GET', '/api/formation/voix/etat')).json();
  assert.equal(e.cle, true);
  assert.deepEqual(e.credits, { utilises: 1200, limite: 10000, plan: 'free', renouvellement: 1790000000 });
  assert.ok(!JSON.stringify(e).includes(CLE));
  const em = await (await call(marie, 'GET', '/api/formation/voix/etat')).json();
  assert.equal(em.credits, undefined);
});

test('génération : voix française du compte par défaut, une seule lecture par phrase, fichier servi aux membres', async () => {
  const phrases = ['Bonjour et bienvenue !', 'Exemple : Sarah appelle la boulangerie Martin.'].map((t) => ({ h: empreinte(t), t }));
  // Empreinte qui ne correspond pas au texte : ignorée.
  let r = await (await call(admin, 'POST', '/api/formation/voix/generer', { phrases: [...phrases, { h: 'deadbeef', t: 'autre' }] })).json();
  assert.equal(r.ajout, 2);
  await attendre(async () => Object.keys((await (await call(marie, 'GET', '/api/formation/voix/index')).json()).voix).length === 2);
  assert.deepEqual(lus.map((x) => x.voix), ['frAmelie00001', 'frAmelie00001']);
  assert.equal(lus[0].modele, 'eleven_flash_v2_5');
  const idx = (await (await call(marie, 'GET', '/api/formation/voix/index')).json()).voix;
  const [ms, fichier] = idx[phrases[1].h];
  assert.equal(ms, 2400);
  const mp3 = await fetch(base + '/api/formation/voix/' + fichier + '.mp3', { headers: { Cookie: marie } });
  assert.equal(mp3.headers.get('content-type'), 'audio/mpeg');
  assert.equal(Buffer.from(await mp3.arrayBuffer()).toString(), 'ID3' + phrases[1].t);
  r = await (await call(admin, 'POST', '/api/formation/voix/generer', { phrases })).json();
  assert.equal(r.ajout, 0);
  assert.equal(lus.length, 2);
  assert.equal((await call(marie, 'POST', '/api/formation/voix/generer', { phrases })).status, 403);
});

test('crédit épuisé : la file s’arrête et le dit, puis reprend sur demande', async () => {
  epuise = true;
  const phrases = ['Phrase un.', 'Phrase deux.', 'Phrase trois.'].map((t) => ({ h: empreinte(t), t }));
  await call(admin, 'POST', '/api/formation/voix/generer', { phrases });
  await attendre(async () => (await (await call(admin, 'GET', '/api/formation/voix/etat')).json()).travail.erreur);
  const e = await (await call(admin, 'GET', '/api/formation/voix/etat')).json();
  assert.match(e.travail.erreur, /Crédit ElevenLabs du mois épuisé/);
  assert.equal(e.travail.reste, 0);
  epuise = false;
  await call(admin, 'POST', '/api/formation/voix/generer', { phrases, reprendre: true });
  await attendre(async () => (await (await call(admin, 'GET', '/api/formation/voix/etat')).json()).generees === 5);
});
