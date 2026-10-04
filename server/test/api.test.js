// Tests de l'API : serveur réel sur un port libre, base dans un dossier temporaire.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../src/app.js';

let server, base, dir, db;
before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-test-'));
  const made = createApp({ dataDir: dir });
  db = made.db;
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => { server.close(); db.close(); rmSync(dir, { recursive: true, force: true }); });

// Petit client avec cookie de session.
function client() {
  let cookie = '';
  return async function call(method, path, body, { csrf = true } = {}) {
    const headers = {};
    if (csrf) headers['X-Requested-With'] = 'blackstart';
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (cookie) headers.Cookie = cookie;
    const r = await fetch(base + path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined, redirect: 'manual' });
    const set = r.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    const text = await r.text();
    let json = null; try { json = JSON.parse(text); } catch { /* page HTML */ }
    return { status: r.status, body: json, text, headers: r.headers };
  };
}

const admin = client(), marie = client(), anon = client();
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

test('premier lancement : page de création du compte administrateur', async () => {
  const st = await anon('GET', '/api/auth/state');
  assert.equal(st.body.needsSetup, true);
  const page = await anon('GET', '/');
  assert.equal(page.status, 302);
  assert.equal(page.headers.get('location'), '/connexion');
  const login = await anon('GET', '/connexion');
  assert.match(login.text, /Créez le compte administrateur/);
});

test('création de l’administrateur, puis plus jamais', async () => {
  const bad = await admin('POST', '/api/auth/setup', { name: 'Al', email: 'pas-un-mail', password: '123' });
  assert.equal(bad.status, 400);
  const ok = await admin('POST', '/api/auth/setup', { name: 'Albino', email: 'Albino@Exemple.fr', password: 'motdepasse1' });
  assert.equal(ok.status, 201);
  assert.equal(ok.body.user.role, 'admin');
  assert.equal(ok.body.user.email, 'albino@exemple.fr');
  const again = await anon('POST', '/api/auth/setup', { name: 'X', email: 'x@x.fr', password: 'motdepasse2' });
  assert.equal(again.status, 409);
});

test('le CRM est servi avec la configuration du serveur', async () => {
  const r = await admin('GET', '/');
  assert.equal(r.status, 200);
  assert.match(r.text, /window\.BS_SERVER=\{"user":\{[^}]*"role":"admin"/);
  assert.match(r.text, /<script id="bs-serveur">/);
  assert.ok(r.text.indexOf('bs-serveur-conf') < r.text.indexOf('<script id="bs-serveur">'));
});

test('sans en-tête de sécurité, une écriture est refusée (CSRF)', async () => {
  const r = await admin('PUT', '/api/data/blackstart-data-v1', { value: '{}', baseVersion: 0 }, { csrf: false });
  assert.equal(r.status, 403);
});

test('équipe : ajout d’un membre, connexion, droits', async () => {
  const add = await admin('POST', '/api/users', { name: 'Marie Curie', email: 'marie@exemple.fr', password: 'radium123', role: 'membre' });
  assert.equal(add.status, 201);
  const dup = await admin('POST', '/api/users', { name: 'Autre', email: 'MARIE@exemple.fr', password: 'radium123' });
  assert.equal(dup.status, 409);
  const wrong = await marie('POST', '/api/auth/login', { email: 'marie@exemple.fr', password: 'mauvais!!' });
  assert.equal(wrong.status, 401);
  const ok = await marie('POST', '/api/auth/login', { email: 'marie@exemple.fr', password: 'radium123' });
  assert.equal(ok.status, 200);
  assert.equal((await marie('GET', '/api/users')).status, 403);
  assert.equal((await marie('PUT', '/api/ambiance/config', { fond: false })).status, 403);
  const me = await marie('GET', '/api/auth/me');
  assert.equal(me.body.user.name, 'Marie Curie');
});

test('on garde toujours au moins un administrateur', async () => {
  const list = await admin('GET', '/api/users');
  const me = list.body.users.find((u) => u.role === 'admin');
  assert.equal((await admin('DELETE', '/api/users/' + me.id)).status, 400);
});

test('données : enregistrement versionné et fusion de deux enregistrements simultanés', async () => {
  const empty = await admin('GET', '/api/data/blackstart-data-v1');
  assert.equal(empty.body.version, 0);
  assert.equal(empty.body.value, null);
  const v1 = { prospects: [{ id: 'p1', entreprise: 'Alpha', statut: 'a_appeler' }], settings: { goal: 50 } };
  const s1 = await admin('PUT', '/api/data/blackstart-data-v1', { value: JSON.stringify(v1), baseVersion: 0 });
  assert.deepEqual(s1.body, { version: 1, merged: false });
  // Les deux partent de la version 1.
  const a = { ...v1, prospects: [{ id: 'p2', entreprise: 'Beta' }, { ...v1.prospects[0], statut: 'rdv_pris' }] };
  const m = { ...v1, prospects: [{ id: 'p3', entreprise: 'Gamma' }, { ...v1.prospects[0], notes: 'rappeler' }] };
  const ra = await admin('PUT', '/api/data/blackstart-data-v1', { value: JSON.stringify(a), baseVersion: 1 });
  assert.equal(ra.body.version, 2);
  const rm = await marie('PUT', '/api/data/blackstart-data-v1', { value: JSON.stringify(m), baseVersion: 1 });
  assert.equal(rm.body.merged, true);
  assert.equal(rm.body.version, 3);
  const merged = JSON.parse(rm.body.value);
  assert.deepEqual(merged.prospects.map((p) => p.id).sort(), ['p1', 'p2', 'p3']);
  const p1 = merged.prospects.find((p) => p.id === 'p1');
  assert.equal(p1.statut, 'rdv_pris');
  assert.equal(p1.notes, 'rappeler');
  // Rien de neuf : pas de nouvelle version.
  const same = await marie('PUT', '/api/data/blackstart-data-v1', { value: rm.body.value, baseVersion: 3 });
  assert.equal(same.body.version, 3);
  const since = await admin('GET', '/api/data/blackstart-data-v1?since=3');
  assert.deepEqual(since.body, { changed: false, version: 3 });
  const latest = await admin('GET', '/api/data/blackstart-data-v1?since=2');
  assert.equal(latest.body.updatedBy, 'Marie Curie');
});

test('sauvegardes : historique et restauration (administrateur)', async () => {
  assert.equal((await marie('GET', '/api/data/blackstart-data-v1/history')).status, 403);
  const h = await admin('GET', '/api/data/blackstart-data-v1/history');
  assert.deepEqual(h.body.history.map((x) => x.version), [3, 2, 1]);
  const r = await admin('POST', '/api/data/blackstart-data-v1/restore', { version: 1 });
  assert.equal(r.body.version, 4);
  assert.equal(JSON.parse(r.body.value).prospects.length, 1);
});

test('ambiances : envoi, liste, image, suppression, page de connexion', async () => {
  assert.equal((await anon('GET', '/ambiance/connexion')).status, 404);
  const bad = await admin('POST', '/api/ambiance/images', { nom: 'x', image: 'data:image/png;base64,AAAA', mini: PNG });
  assert.equal(bad.status, 400);
  const up = await admin('POST', '/api/ambiance/images', { nom: 'Lac', largeur: 1, hauteur: 1, couleur: '#336699', image: PNG, mini: PNG });
  assert.equal(up.status, 201);
  const list = await marie('GET', '/api/ambiance');
  assert.equal(list.body.canEdit, false);
  assert.equal(list.body.images[0].nom, 'Lac');
  const img = await fetch(`${base}/ambiance/images/${up.body.id}?taille=mini`);
  assert.equal(img.status, 401);
  const asMember = await marie('GET', `/ambiance/images/${up.body.id}?taille=mini`);
  assert.equal(asMember.status, 200);
  assert.equal(asMember.headers.get('content-type'), 'image/png');
  assert.equal((await anon('GET', '/ambiance/connexion')).status, 200);
  const cfg = await admin('PUT', '/api/ambiance/config', { connexion: false, iconesStyle: { couleur: 'perso', perso: '#ff0000' } });
  assert.equal(cfg.status, 200);
  assert.equal((await anon('GET', '/ambiance/connexion')).status, 404);
  assert.equal((await marie('GET', '/api/ambiance')).body.config.iconesStyle.perso, '#ff0000');
  assert.equal((await admin('DELETE', '/api/ambiance/images/' + up.body.id)).status, 204);
  assert.equal((await admin('GET', '/api/ambiance')).body.images.length, 0);
});

test('mot de passe : changement, puis déconnexion', async () => {
  assert.equal((await marie('POST', '/api/auth/password', { current: 'faux', next: 'nouveau123' })).status, 400);
  assert.equal((await marie('POST', '/api/auth/password', { current: 'radium123', next: 'nouveau123' })).status, 204);
  assert.equal((await marie('POST', '/api/auth/logout')).status, 204);
  assert.equal((await marie('GET', '/api/auth/me')).status, 401);
  assert.equal((await marie('POST', '/api/auth/login', { email: 'marie@exemple.fr', password: 'nouveau123' })).status, 200);
});

test('trop d’essais de connexion : blocage temporaire', async () => {
  const c = client();
  for (let i = 0; i < 10; i++) await c('POST', '/api/auth/login', { email: 'pirate@exemple.fr', password: 'x' + i });
  assert.equal((await c('POST', '/api/auth/login', { email: 'pirate@exemple.fr', password: 'y' })).status, 429);
});
