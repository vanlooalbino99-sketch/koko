// Sons personnels de chaque membre (/api/sons) : envoi d'un fichier son, lecture, remplacement, retrait.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp } from './helpers.js';

let server, base, made, cookie;
const h = (extra = {}) => ({ 'X-Requested-With': 'blackstart', Cookie: cookie, ...extra });
before(async () => {
  made = await testApp();
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' },
    body: JSON.stringify({ name: 'Admin', email: 'admin@exemple.fr', password: 'motdepasse-solide-1' }) });
  cookie = r.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); await made.cleanup(); });

test('un membre envoie, retrouve, remplace et retire son son de message reçu', async () => {
  assert.deepEqual((await (await fetch(base + '/api/sons', { headers: h() })).json()).sons, []);
  const mp3 = Buffer.concat([Buffer.from('ID3'), Buffer.alloc(500, 7)]);
  let r = await fetch(base + '/api/sons/recu?nom=ding.mp3', { method: 'PUT', headers: h({ 'Content-Type': 'audio/mpeg' }), body: mp3 });
  assert.equal(r.status, 200);
  const liste = (await (await fetch(base + '/api/sons', { headers: h() })).json()).sons;
  assert.equal(liste.length, 1);
  assert.equal(liste[0].sorte, 'recu');
  assert.equal(liste[0].nom, 'ding.mp3');
  r = await fetch(base + '/api/sons/recu', { headers: h() });
  assert.equal(r.headers.get('content-type'), 'audio/mpeg');
  assert.deepEqual(Buffer.from(await r.arrayBuffer()), mp3);
  r = await fetch(base + '/api/sons/recu?nom=autre.wav', { method: 'PUT', headers: h({ 'Content-Type': 'audio/wav' }), body: Buffer.alloc(100, 1) });
  assert.equal(r.status, 200);
  assert.equal((await (await fetch(base + '/api/sons', { headers: h() })).json()).sons[0].nom, 'autre.wav');
  assert.equal((await fetch(base + '/api/sons/recu', { method: 'DELETE', headers: h() })).status, 200);
  assert.equal((await fetch(base + '/api/sons/recu', { headers: h() })).status, 404);
});

test('refus : pas connecté, sorte inconnue, pas un son, trop lourd', async () => {
  assert.equal((await fetch(base + '/api/sons', { headers: { 'X-Requested-With': 'blackstart' } })).status, 401);
  assert.equal((await fetch(base + '/api/sons/autre', { method: 'PUT', headers: h({ 'Content-Type': 'audio/mpeg' }), body: Buffer.alloc(10) })).status, 404);
  assert.equal((await fetch(base + '/api/sons/visio', { method: 'PUT', headers: h({ 'Content-Type': 'image/png' }), body: Buffer.alloc(10) })).status, 400);
  assert.equal((await fetch(base + '/api/sons/visio', { method: 'PUT', headers: h({ 'Content-Type': 'audio/mpeg' }), body: Buffer.alloc(3 * 1024 * 1024 + 10) })).status, 413);
});
