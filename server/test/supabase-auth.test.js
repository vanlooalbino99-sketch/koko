// Mots de passe vérifiés par Supabase Auth (simulé ici avec ses vraies adresses et réponses).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { testApp } from './helpers.js';
import { hashPassword } from '../src/auth.js';

// Faux Supabase Auth : comptes en mémoire, mêmes chemins que GoTrue.
const accounts = new Map(); // id -> { email, password }
const KEY = 'cle-service-de-test';
async function fakeFetch(url, { method, headers, body }) {
  const json = (status, data) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
  if (headers.apikey !== KEY) return json(401, { msg: 'Invalid API key' });
  const u = new URL(url), b = body ? JSON.parse(body) : {};
  const byEmail = (e) => [...accounts].find(([, a]) => a.email === e);
  if (method === 'POST' && u.pathname === '/auth/v1/token') {
    const hit = byEmail(b.email);
    if (!hit || hit[1].password !== b.password) return json(400, { error: 'invalid_grant', error_description: 'Invalid login credentials' });
    return json(200, { access_token: 'x', user: { id: hit[0], email: b.email } });
  }
  if (method === 'POST' && u.pathname === '/auth/v1/admin/users') {
    if (byEmail(b.email)) return json(422, { msg: 'A user with this email address has already been registered' });
    const id = randomUUID();
    accounts.set(id, { email: b.email, password: b.password });
    return json(200, { id, email: b.email });
  }
  const m = /^\/auth\/v1\/admin\/users\/(.+)$/.exec(u.pathname);
  if (m && accounts.has(m[1])) {
    if (method === 'PUT') { accounts.get(m[1]).password = b.password; return json(200, { id: m[1] }); }
    if (method === 'DELETE') { accounts.delete(m[1]); return json(200, {}); }
  }
  return json(404, { msg: 'User not found' });
}

let server, base, made;
before(async () => {
  made = await testApp({ supabase: { url: 'https://projet.supabase.co/', serviceKey: KEY, fetch: fakeFetch } });
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { server.close(); await made.cleanup(); });

function client() {
  let cookie = '';
  return async (method, path, body) => {
    const headers = { 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json' };
    if (cookie) headers.Cookie = cookie;
    const r = await fetch(base + path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
    const set = r.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    return { status: r.status, body: await r.json().catch(() => null) };
  };
}
const admin = client(), marie = client(), ancien = client();
const row = (email) => made.db.get('SELECT * FROM users WHERE email = ?', email);

test('Supabase : l’administrateur et les membres sont créés chez Supabase Auth', async () => {
  assert.equal((await admin('POST', '/api/auth/setup', { name: 'Albino', email: 'albino@exemple.fr', password: 'motdepasse1' })).status, 201);
  const a = await row('albino@exemple.fr');
  assert.ok(accounts.has(a.auth_id));
  assert.equal(a.pass, 'supabase'); // aucun mot de passe gardé par le serveur
  const m = await admin('POST', '/api/users', { name: 'Marie', email: 'marie@exemple.fr', password: 'marie-123456' });
  assert.equal(m.status, 201);
  assert.equal(accounts.get((await row('marie@exemple.fr')).auth_id).password, 'marie-123456');
});

test('Supabase : connexion vérifiée par Supabase Auth', async () => {
  assert.equal((await marie('POST', '/api/auth/login', { email: 'marie@exemple.fr', password: 'mauvais-mdp' })).status, 401);
  assert.equal((await marie('POST', '/api/auth/login', { email: 'marie@exemple.fr', password: 'marie-123456' })).status, 200);
  assert.equal((await marie('GET', '/api/auth/me')).body.user.email, 'marie@exemple.fr');
});

test('Supabase : changement de mot de passe (par soi-même et par un administrateur)', async () => {
  assert.equal((await marie('POST', '/api/auth/password', { current: 'faux-faux-faux', next: 'nouveau-1234' })).status, 400);
  assert.equal((await marie('POST', '/api/auth/password', { current: 'marie-123456', next: 'nouveau-1234' })).status, 204);
  const id = (await row('marie@exemple.fr')).id;
  assert.equal((await admin('PATCH', `/api/users/${id}`, { password: 'parlechef-99' })).status, 200);
  assert.equal(accounts.get((await row('marie@exemple.fr')).auth_id).password, 'parlechef-99');
  assert.equal((await marie('GET', '/api/auth/me')).status, 401); // ses sessions sont fermées
  assert.equal((await marie('POST', '/api/auth/login', { email: 'marie@exemple.fr', password: 'parlechef-99' })).status, 200);
});

test('Supabase : un compte d’avant Supabase y est recopié à sa première connexion', async () => {
  await made.db.run("INSERT INTO users (id, email, name, role, pass, created_at) VALUES ('ancien', 'ancien@exemple.fr', 'Ancien', 'membre', ?, '2026-01-01')", hashPassword('ancien-mdp-1'));
  assert.equal((await ancien('POST', '/api/auth/login', { email: 'ancien@exemple.fr', password: 'mauvais-1234' })).status, 401);
  assert.equal((await row('ancien@exemple.fr')).auth_id, null);
  assert.equal((await ancien('POST', '/api/auth/login', { email: 'ancien@exemple.fr', password: 'ancien-mdp-1' })).status, 200);
  const r = await row('ancien@exemple.fr');
  assert.equal(r.pass, 'supabase');
  assert.equal(accounts.get(r.auth_id).password, 'ancien-mdp-1');
  assert.equal((await client()('POST', '/api/auth/login', { email: 'ancien@exemple.fr', password: 'ancien-mdp-1' })).status, 200);
});

test('Supabase : un compte supprimé disparaît aussi de Supabase Auth', async () => {
  const r = await row('ancien@exemple.fr');
  assert.equal((await admin('DELETE', `/api/users/${r.id}`)).status, 204);
  assert.equal(accounts.has(r.auth_id), false);
});
