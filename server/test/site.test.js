// Passerelle du site internet : contact et rendez-vous deviennent des leads à rappeler dans le CRM.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../src/app.js';
import { DATA_KEY } from '../src/routes/data.js';

const KEY = 'cle-de-test-du-site-0123456789';
let server, base, dir, db, off, offDir;

before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-site-'));
  const made = createApp({ dataDir: dir, siteApiKey: KEY });
  db = made.db;
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  // Même serveur sans clé : passerelle désactivée.
  offDir = mkdtempSync(join(tmpdir(), 'bs-site-off-'));
  const o = createApp({ dataDir: offDir });
  await new Promise((res) => { off = { ...o, server: o.app.listen(0, res) }; });
});
after(() => {
  server.close(); db.close(); rmSync(dir, { recursive: true, force: true });
  off.server.close(); off.db.close(); rmSync(offDir, { recursive: true, force: true });
});

async function call(method, path, body, { key = KEY, url = base } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (key) headers.Authorization = `Bearer ${key}`;
  const r = await fetch(url + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, body: await r.json().catch(() => null) };
}
const crm = () => JSON.parse(db.prepare('SELECT value FROM kv WHERE key = ?').get(DATA_KEY).value);
const uuid = () => crypto.randomUUID();
const rdv = (over = {}) => ({ type: 'rdv', requestId: uuid(), nom: 'Julie Petit', entreprise: 'Cabinet Petit', email: 'julie@petit.fr', telephone: '06 12 34 56 78', service: 'Assistant téléphonique IA', date: '2030-03-12', heure: '10:30', ...over });

test('sans clé valide : refusé ; sans SITE_API_KEY : désactivé', async () => {
  assert.equal((await call('GET', '/api/site/creneaux?from=2030-01-01&to=2030-01-02', null, { key: null })).status, 401);
  assert.equal((await call('GET', '/api/site/creneaux?from=2030-01-01&to=2030-01-02', null, { key: 'mauvaise' })).status, 401);
  const offBase = `http://127.0.0.1:${off.server.address().port}`;
  assert.equal((await call('POST', '/api/site/leads', rdv(), { url: offBase })).status, 503);
});

test('validation des demandes', async () => {
  const r = await call('POST', '/api/site/leads', { type: 'rdv', requestId: uuid(), nom: 'A', email: 'x', telephone: '12', date: '2030-02-31', heure: '25:00' });
  assert.equal(r.status, 400);
  assert.match(r.body.error, /Nom manquant/);
  assert.match(r.body.error, /E-mail invalide/);
  assert.match(r.body.error, /Téléphone invalide/);
  assert.match(r.body.error, /Date ou heure/);
});

test('un message de contact crée un prospect à rappeler aujourd’hui, avec une tâche', async () => {
  const r = await call('POST', '/api/site/leads', { type: 'contact', requestId: uuid(), nom: 'Marc Durand', entreprise: 'Durand BTP', email: 'Marc@Durand.fr', telephone: '+33 6 11 22 33 44', sujet: 'Demande de devis', message: 'Bonjour, je rate des appels.' });
  assert.equal(r.status, 201);
  const data = crm();
  const p = data.prospects.find((x) => x.id === r.body.prospectId);
  assert.equal(p.entreprise, 'Durand BTP');
  assert.equal(p.contact, 'Marc Durand');
  assert.equal(p.email, 'marc@durand.fr');
  assert.equal(p.statut, 'a_appeler');
  assert.equal(p.canal, 'Site internet');
  assert.match(p.prochaineRelance, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(p.notes, /je rate des appels/);
  const t = data.tasks.find((x) => x.prospectId === p.id);
  assert.match(t.title, /Rappeler Marc Durand/);
  assert.equal(t.done, false);
  assert.equal(data.version, 4);
});

test('un rendez-vous arrive dans l’agenda (RDV pris à la date et l’heure) et bloque le créneau', async () => {
  const r = await call('POST', '/api/site/leads', rdv());
  assert.equal(r.status, 201);
  const p = crm().prospects.find((x) => x.id === r.body.prospectId);
  assert.equal(p.statut, 'rdv_pris');
  assert.equal(p.prochaineRelance, '2030-03-12');
  assert.equal(p.prochaineRelanceHeure, '10:30');
  const t = crm().tasks.find((x) => x.prospectId === p.id);
  assert.equal(t.due, '2030-03-12');
  assert.equal(t.heure, '10:30');

  const slots = await call('GET', '/api/site/creneaux?from=2030-03-01&to=2030-03-31');
  assert.deepEqual(slots.body.pris, [{ date: '2030-03-12', heure: '10:30' }]);
  const again = await call('POST', '/api/site/leads', rdv({ email: 'autre@x.fr', telephone: '07 00 00 00 01' }));
  assert.equal(again.status, 409);
});

test('même demande renvoyée : aucun doublon', async () => {
  const body = rdv({ requestId: uuid(), heure: '14:00', email: 'idem@x.fr', telephone: '07 99 99 99 99' });
  const a = await call('POST', '/api/site/leads', body);
  const n = crm().prospects.length;
  const b = await call('POST', '/api/site/leads', body);
  assert.equal(b.status, 200);
  assert.equal(b.body.duplicate, true);
  assert.equal(b.body.prospectId, a.body.prospectId);
  assert.equal(crm().prospects.length, n);
});

test('prospect déjà connu (même e-mail) : complété, pas dupliqué', async () => {
  const n = crm().prospects.length;
  const r = await call('POST', '/api/site/leads', { type: 'contact', requestId: uuid(), nom: 'Julie Petit', email: 'julie@petit.fr', telephone: '06 12 34 56 78', message: 'Une question avant le rendez-vous.' });
  assert.equal(r.status, 201);
  assert.equal(r.body.existing, true);
  assert.equal(crm().prospects.length, n);
  const p = crm().prospects.find((x) => x.id === r.body.prospectId);
  // Le rendez-vous déjà fixé n'est pas écrasé par le message.
  assert.equal(p.statut, 'rdv_pris');
  assert.equal(p.prochaineRelance, '2030-03-12');
  assert.match(p.events[0].text, /Une question avant le rendez-vous/);
});

test('rendez-vous déplacé par l’équipe dans le CRM : l’ancien créneau se libère, le nouveau est pris', async () => {
  const data = crm();
  const p = data.prospects.find((x) => x.email === 'julie@petit.fr');
  p.prochaineRelanceHeure = '11:15';
  const cur = db.prepare('SELECT version FROM kv WHERE key = ?').get(DATA_KEY).version;
  db.prepare('UPDATE kv SET value = ?, version = ? WHERE key = ?').run(JSON.stringify(data), cur + 1, DATA_KEY);
  const slots = await call('GET', '/api/site/creneaux?from=2030-03-12&to=2030-03-12');
  assert.deepEqual(slots.body.pris.map((s) => s.heure), ['11:15', '14:00']);
  // 11:00 chevauche le rendez-vous de 11:15 ; 10:30 est libre à nouveau.
  assert.equal((await call('POST', '/api/site/leads', rdv({ requestId: uuid(), heure: '11:00', email: 'a@x.fr', telephone: '07 11 11 11 12' }))).status, 409);
  assert.equal((await call('POST', '/api/site/leads', rdv({ requestId: uuid(), email: 'nouveau@x.fr', telephone: '07 11 11 11 11' }))).status, 201);
});

test('les données écrites par le site sont versionnées comme celles de l’équipe', async () => {
  const h = db.prepare('SELECT COUNT(*) AS n FROM kv_history WHERE key = ?').get(DATA_KEY).n;
  assert.ok(h >= 4);
});
