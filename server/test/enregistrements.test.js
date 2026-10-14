// Enregistrements d'appels envoyés au serveur : chaque membre envoie les siens, l'administrateur écoute toute l'équipe.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp } from './helpers.js';

let server, base, made, admin, marie, marieId;
const JSONH = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
const h = (cookie, extra = {}) => ({ 'X-Requested-With': 'blackstart', Cookie: cookie, ...extra });

before(async () => {
  made = await testApp();
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  let r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Admin', email: 'admin@exemple.fr', password: 'motdepasse-solide-1' }) });
  admin = r.headers.get('set-cookie').split(';')[0];
  r = await fetch(base + '/api/users', { method: 'POST', headers: { ...JSONH, Cookie: admin }, body: JSON.stringify({ name: 'Marie Curie', email: 'marie@exemple.fr', password: 'motdepasse-solide-2', role: 'membre' }) });
  marieId = (await r.json()).user.id;
  r = await fetch(base + '/api/auth/login', { method: 'POST', headers: JSONH, body: JSON.stringify({ email: 'marie@exemple.fr', password: 'motdepasse-solide-2' }) });
  marie = r.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); await made.cleanup(); });

const liste = async (c, q = '') => (await (await fetch(base + '/api/enregistrements' + q, { headers: h(c) })).json()).enregistrements;

test("l'enregistrement d'un membre arrive chez l'administrateur, qui l'écoute et le supprime", async () => {
  const son = Buffer.alloc(3000, 9);
  let r = await fetch(base + '/api/enregistrements?id=rec-abc123&nom=appel-Boulangerie&prospect=Boulangerie%20Martin&duree=42',
    { method: 'POST', headers: h(marie, { 'Content-Type': 'audio/webm;codecs=opus' }), body: son });
  assert.equal(r.status, 201);
  // Même envoi deux fois : pas de doublon.
  r = await fetch(base + '/api/enregistrements?id=rec-abc123', { method: 'POST', headers: h(marie, { 'Content-Type': 'audio/webm' }), body: son });
  assert.equal(r.status, 200);
  const siens = await liste(marie);
  assert.equal(siens.length, 1);
  assert.equal(siens[0].prospect, 'Boulangerie Martin');
  assert.equal(siens[0].duree, 42);
  const tous = await liste(admin);
  assert.equal(tous.length, 1);
  assert.equal(tous[0].auteur, 'Marie Curie');
  assert.equal((await liste(admin, '?membre=' + marieId)).length, 1);
  assert.equal((await liste(admin, '?membre=personne')).length, 0);
  r = await fetch(base + '/api/enregistrements/rec-abc123', { headers: h(admin, { Range: 'bytes=0-9' }) });
  assert.equal(r.status, 206);
  assert.equal(r.headers.get('content-type'), 'audio/webm');
  assert.equal((await r.arrayBuffer()).byteLength, 10);
  // Un membre ne supprime pas la copie du serveur ; l'administrateur oui.
  assert.equal((await fetch(base + '/api/enregistrements/rec-abc123', { method: 'DELETE', headers: h(marie) })).status, 403);
  assert.equal((await fetch(base + '/api/enregistrements/rec-abc123', { method: 'DELETE', headers: h(admin) })).status, 200);
  assert.equal((await liste(admin)).length, 0);
});

test("un membre ne voit pas les enregistrements des autres", async () => {
  await fetch(base + '/api/enregistrements?id=rec-admin-1', { method: 'POST', headers: h(admin, { 'Content-Type': 'audio/webm' }), body: Buffer.alloc(100, 1) });
  assert.equal((await liste(marie)).length, 0);
  assert.equal((await liste(marie, '?membre=')).length, 0);
  assert.equal((await fetch(base + '/api/enregistrements/rec-admin-1', { headers: h(marie) })).status, 404);
  assert.equal((await fetch(base + '/api/enregistrements?id=rec-x1', { method: 'POST', headers: h(marie, { 'Content-Type': 'image/png' }), body: Buffer.alloc(10) })).status, 400);
  assert.equal((await fetch(base + '/api/enregistrements?id=rec-admin-1', { method: 'POST', headers: h(marie, { 'Content-Type': 'audio/webm' }), body: Buffer.alloc(10) })).status, 409);
});
