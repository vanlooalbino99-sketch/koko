// Copie SQLite → PostgreSQL (Supabase) : tout est recopié, et le CRM repart sur PostgreSQL sans rien perdre.
// Nécessite un serveur PostgreSQL de test (BS_TEST_PG) ; sinon le test est sauté.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../src/app.js';
import { testApp } from './helpers.js';
import { copySqliteToPg, countRows } from '../src/copie.js';

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

function client(base) {
  let cookie = '';
  return async (method, path, body, raw) => {
    const headers = { 'X-Requested-With': 'blackstart' };
    if (body !== undefined) headers['Content-Type'] = raw ? 'application/octet-stream' : 'application/json';
    if (cookie) headers.Cookie = cookie;
    const r = await fetch(base + path, { method, headers, body: body === undefined ? undefined : raw ? body : JSON.stringify(body) });
    const set = r.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    const buf = Buffer.from(await r.arrayBuffer());
    let json = null; try { json = JSON.parse(buf.toString()); } catch { /* binaire */ }
    return { status: r.status, body: json, buf };
  };
}
const listen = (app) => new Promise((res) => { const s = app.listen(0, () => res(s)); });

test('copie complète de SQLite vers PostgreSQL, puis reprise du CRM sur PostgreSQL', { skip: !process.env.BS_TEST_PG && 'BS_TEST_PG non défini' }, async () => {
  // 1. Un CRM sur SQLite, avec un peu de tout.
  const dir = mkdtempSync(join(tmpdir(), 'bs-copie-'));
  const lite = await createApp({ dataDir: dir });
  const s1 = await listen(lite.app);
  const b1 = `http://127.0.0.1:${s1.address().port}`;
  const admin = client(b1);
  await admin('POST', '/api/auth/setup', { name: 'Albino', email: 'albino@exemple.fr', password: 'motdepasse1' });
  const marie = (await admin('POST', '/api/users', { name: 'Marie', email: 'marie@exemple.fr', password: 'marie-123456' })).body.user;
  await admin('PATCH', `/api/users/${marie.id}`, { poste: 'Commercial', managerId: (await admin('GET', '/api/auth/me')).body.user.id });
  await admin('PUT', '/api/data/blackstart-data-v1', { value: JSON.stringify({ prospects: [{ id: 'p1', entreprise: 'Plomberie Durand' }] }), baseVersion: 0 });
  await admin('PUT', '/api/data/blackstart-data-v1', { value: JSON.stringify({ prospects: [{ id: 'p1', entreprise: 'Plomberie Durand SARL' }] }), baseVersion: 1 });
  await admin('POST', '/api/chat/conversations/equipe/messages', { body: 'Bonjour l’équipe' });
  const fichier = Buffer.from('%PDF-1.4 devis');
  const f = (await admin('POST', '/api/chat/conversations/equipe/fichiers?nom=devis.pdf&type=application/pdf', fichier, true)).body.message.file;
  await admin('PUT', '/api/photos/moi', { image: PNG });
  await admin('PUT', '/api/formation/01-accueil', { vu: true, quiz: 8 });
  const sqliteCounts = await countRows(lite.db);
  s1.close();
  lite.hub.close();
  await lite.db.close();

  // 2. Copie vers une base PostgreSQL neuve.
  const pgApp = await testApp();
  try {
    const copied = await copySqliteToPg(join(dir, 'blackstart.db'), pgApp.db);
    assert.deepEqual(copied, sqliteCounts);
    assert.deepEqual(await countRows(pgApp.db), sqliteCounts);
    await assert.rejects(copySqliteToPg(join(dir, 'blackstart.db'), pgApp.db), /déjà 2 compte/); // jamais par-dessus des données

    // 3. Le CRM sur PostgreSQL : même session, mêmes comptes, mêmes données.
    const s2 = await listen(pgApp.app);
    const b2 = `http://127.0.0.1:${s2.address().port}`;
    const again = client(b2);
    assert.equal((await again('POST', '/api/auth/login', { email: 'marie@exemple.fr', password: 'marie-123456' })).status, 200);
    const chat = (await again('GET', '/api/chat')).body;
    const m = chat.users.find((u) => u.id === marie.id);
    assert.equal(m.poste, 'Commercial');
    assert.ok(m.managerId);
    assert.ok(chat.users.find((u) => u.name === 'Albino').photo);
    const data = (await again('GET', '/api/data/blackstart-data-v1')).body;
    assert.equal(data.version, 2);
    assert.equal(JSON.parse(data.value).prospects[0].entreprise, 'Plomberie Durand SARL');
    const msgs = (await again('GET', '/api/chat/conversations/equipe/messages')).body.messages;
    assert.equal(msgs[0].body, 'Bonjour l’équipe');
    const dl = await again('GET', `/api/chat/fichiers/${f.id}`);
    assert.deepEqual(dl.buf, fichier);
    // Les nouveaux messages suivent les anciens.
    const next = (await again('POST', '/api/chat/conversations/equipe/messages', { body: 'Me voilà sur Supabase' })).body.message;
    assert.ok(next.id > msgs[msgs.length - 1].id);
    s2.close();
  } finally {
    await pgApp.cleanup();
    rmSync(dir, { recursive: true, force: true });
  }
});
