// Rubriques Téléphone (Ringover) et Entraînement (Pitchbase) : accès, vérification d'affichage de Pitchbase
// dans le CRM, branchements dans l'application.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { testApp } from './helpers.js';
import { integrable } from '../src/routes/integrations.js';
import { ACCES } from '../src/acces.js';

const JSONH = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
let server, base, made, admin, entetes = {}, appels = 0;
const call = (c, path) => fetch(base + path, { headers: { ...JSONH, Cookie: c } });

before(async () => {
  made = await testApp({ integrations: { fetch: async (url) => { appels++; assert.equal(url, 'https://pitchbase.app/app'); return new Response('<html></html>', { status: 200, headers: entetes }); } } });
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Albino', email: 'albino@exemple.fr', password: 'motdepasse-solide-1' }) });
  admin = r.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); await made.cleanup(); });

test('Pitchbase : affiché dans le CRM seulement si le site l’accepte', () => {
  const H = (o) => new Headers(o);
  assert.equal(integrable(H({}), 'crm.exemple.fr'), true);
  assert.equal(integrable(H({ 'x-frame-options': 'SAMEORIGIN' }), 'crm.exemple.fr'), false);
  assert.equal(integrable(H({ 'content-security-policy': "default-src 'self'; frame-ancestors 'self'" }), 'crm.exemple.fr'), false);
  assert.equal(integrable(H({ 'content-security-policy': "frame-ancestors 'none'" }), 'crm.exemple.fr'), false);
  assert.equal(integrable(H({ 'content-security-policy': 'frame-ancestors https:' }), 'crm.exemple.fr'), true);
  assert.equal(integrable(H({ 'content-security-policy': 'frame-ancestors https://crm.exemple.fr' }), 'crm.exemple.fr'), true);
});

test('Pitchbase : le serveur vérifie une fois, puis garde la réponse', async () => {
  entetes = { 'x-frame-options': 'DENY' };
  let r = await call(admin, '/api/integrations/cadre/pitchbase');
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { integrable: false });
  r = await call(admin, '/api/integrations/cadre/pitchbase');
  assert.deepEqual(await r.json(), { integrable: false });
  assert.equal(appels, 1);
  assert.equal((await call(admin, '/api/integrations/cadre/autre')).status, 404, 'pas d’adresse libre');
});

test('Téléphone et Entraînement suivent les accès choisis par l’administrateur', async () => {
  assert.ok(ACCES.includes('telephone') && ACCES.includes('entrainement'));
  await fetch(base + '/api/users', { method: 'POST', headers: { ...JSONH, Cookie: admin }, body: JSON.stringify({ name: 'Marie', email: 'marie@exemple.fr', password: 'motdepasse-solide-2', role: 'membre' }) });
  const id = (await (await call(admin, '/api/users')).json()).users.find((u) => u.email === 'marie@exemple.fr').id;
  await fetch(base + `/api/users/${id}`, { method: 'PATCH', headers: { ...JSONH, Cookie: admin }, body: JSON.stringify({ acces: ['today', 'telephone'] }) });
  const r0 = await fetch(base + '/api/auth/login', { method: 'POST', headers: JSONH, body: JSON.stringify({ email: 'marie@exemple.fr', password: 'motdepasse-solide-2' }) });
  const marie = r0.headers.get('set-cookie').split(';')[0];
  assert.equal((await call(marie, '/api/integrations/cadre/pitchbase')).status, 403);
  await fetch(base + `/api/users/${id}`, { method: 'PATCH', headers: { ...JSONH, Cookie: admin }, body: JSON.stringify({ acces: ['today', 'entrainement'] }) });
  assert.equal((await call(marie, '/api/integrations/cadre/pitchbase')).status, 200);
});

test('les deux rubriques sont branchées dans le CRM (menu, pages, outils)', () => {
  const app = readFileSync(new URL('../../app/core/app.min.js', import.meta.url), 'utf8');
  const html = readFileSync(new URL('../../app/index.html', import.meta.url), 'utf8');
  for (const bout of ['"visio","entrainement","telephone","mail"', '{id:"telephone",label:"Téléphone",icon:"phoneCall"}', '{id:"today",label:"Aujourd\'hui",icon:"phone"},{id:"entrainement",label:"Simulations IA",icon:"target"}',
    'window.bsTelephone.monter(bsEl)', 'window.bsEntrainement.monter(bsEl)', 'url:"#/entrainement"', 'url:"#/telephone"']) assert.ok(app.includes(bout), bout);
  assert.match(html, /modules\/bs-telephone\.js/);
  assert.match(html, /modules\/bs-entrainement\.js/);
});
