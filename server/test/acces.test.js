// Rubriques ouvertes à chaque membre : choisies par l'administrateur, appliquées par le serveur.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { testApp } from './helpers.js';
import { ACCES } from '../src/acces.js';

let server, base, made, admin, marie, marieId;
const JSONH = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
const h = (cookie, extra = {}) => ({ ...JSONH, Cookie: cookie, ...extra });
const call = (cookie, method, path, body) => fetch(base + path, { method, headers: h(cookie), body: body === undefined ? undefined : JSON.stringify(body) });

before(async () => {
  made = await testApp({ googleMapsKey: 'cle-carte' });
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  let r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Admin', email: 'admin@exemple.fr', password: 'motdepasse-solide-1' }) });
  admin = r.headers.get('set-cookie').split(';')[0];
  r = await call(admin, 'POST', '/api/users', { name: 'Marie Curie', email: 'marie@exemple.fr', password: 'motdepasse-solide-2', role: 'membre' });
  marieId = (await r.json()).user.id;
  r = await fetch(base + '/api/auth/login', { method: 'POST', headers: JSONH, body: JSON.stringify({ email: 'marie@exemple.fr', password: 'motdepasse-solide-2' }) });
  marie = r.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); await made.cleanup(); });

const me = async (c) => (await (await call(c, 'GET', '/api/auth/me')).json()).user;

test('par défaut un membre a tout le CRM', async () => {
  assert.equal((await me(marie)).acces, null);
  const page = await (await fetch(base + '/', { headers: { Cookie: marie } })).text();
  assert.match(page, /"acces":null/);
  assert.match(page, /cle-carte/);
});

test("l'administrateur choisit les rubriques, appliquées sans reconnexion", async () => {
  let r = await call(admin, 'PATCH', `/api/users/${marieId}`, { acces: ['prospects', 'today', 'today'] });
  assert.equal(r.status, 200);
  assert.deepEqual((await r.json()).user.acces, ['today', 'prospects']);
  assert.deepEqual((await me(marie)).acces, ['today', 'prospects']);
  const page = await (await fetch(base + '/', { headers: { Cookie: marie } })).text();
  assert.doesNotMatch(page, /cle-carte/, 'pas de clé de carte sans la rubrique Carte');

  // Refusé par le serveur : générateur de leads, formations, messagerie, groupes, visio.
  r = await call(marie, 'POST', '/api/osm', { q: 'x' });
  assert.equal(r.status, 403);
  assert.equal((await r.json()).code, 'acces');
  assert.equal((await call(marie, 'POST', '/api/contacts', {})).status, 403);
  assert.equal((await call(marie, 'GET', '/api/formation')).status, 403);
  const chat = await (await call(marie, 'GET', '/api/chat')).json();
  assert.equal(chat.conversations.length, 0, 'conversation Équipe masquée');
  assert.ok(chat.users.length >= 2, "la liste de l'équipe reste lisible");
  assert.equal((await call(marie, 'POST', '/api/chat/conversations/equipe/messages', { body: 'coucou' })).status, 404);
  assert.equal((await call(marie, 'POST', '/api/chat/groupes', { name: 'G' })).status, 403);

  // Validation.
  assert.equal((await call(admin, 'PATCH', `/api/users/${marieId}`, { acces: 'today' })).status, 400);
  assert.equal((await call(admin, 'PATCH', `/api/users/${marieId}`, { acces: ['inconnu'] })).status, 400);
  assert.equal((await call(marie, 'PATCH', `/api/users/${marieId}`, { acces: null })).status, 403);

  // Retour à tout le CRM.
  assert.equal((await call(admin, 'PATCH', `/api/users/${marieId}`, { acces: null })).status, 200);
  assert.equal((await me(marie)).acces, null);
  assert.equal((await call(marie, 'POST', '/api/chat/conversations/equipe/messages', { body: 'coucou' })).status, 201);
});

test('un administrateur a toujours tout, même avec une liste enregistrée', async () => {
  assert.equal((await call(admin, 'PATCH', `/api/users/${marieId}`, { acces: [], role: 'admin' })).status, 200);
  assert.equal((await me(marie)).acces, null);
  assert.equal((await call(marie, 'GET', '/api/formation')).status === 403, false);
  assert.equal((await call(admin, 'PATCH', `/api/users/${marieId}`, { role: 'membre' })).status, 200);
  assert.deepEqual((await me(marie)).acces, []);
  assert.equal((await call(admin, 'PATCH', `/api/users/${marieId}`, { acces: null })).status, 200);
});

test('même liste de rubriques côté navigateur et côté serveur, menus du CRM branchés', () => {
  const src = readFileSync(new URL('../../app/modules/bs-acces.js', import.meta.url), 'utf8');
  const cles = [...src.matchAll(/\{ id: '([\w.]+)', label:/g)].map((m) => m[1]);
  assert.deepEqual(cles, ACCES);
  const app = readFileSync(new URL('../../app/core/app.min.js', import.meta.url), 'utf8');
  assert.ok(app.includes('__bsOk(') && app.includes('__bsNav($t)'), 'les branchements du menu sont toujours là');
});
