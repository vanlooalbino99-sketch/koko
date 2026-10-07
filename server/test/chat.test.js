// Tests de la messagerie : conversations, droits, temps réel (SSE) et relais de la visio.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../src/app.js';

let server, base, dir, db, hub;
before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-chat-'));
  const made = createApp({ dataDir: dir });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => { hub.close(); server.close(); db.close(); rmSync(dir, { recursive: true, force: true }); });

function client() {
  let cookie = '';
  const call = async (method, path, body) => {
    const headers = { 'X-Requested-With': 'blackstart' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (cookie) headers.Cookie = cookie;
    const r = await fetch(base + path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
    const set = r.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    return { status: r.status, body: await r.json().catch(() => null) };
  };
  // Flux temps réel : garde les événements reçus, et attend celui qu'on veut.
  call.flux = async () => {
    const ctrl = new AbortController();
    const r = await fetch(base + '/api/chat/flux', { headers: { Cookie: cookie }, signal: ctrl.signal });
    const events = [], waiters = [];
    const reader = r.body.getReader(), dec = new TextDecoder();
    let buf = '';
    (async () => {
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i;
          while ((i = buf.indexOf('\n\n')) >= 0) {
            const block = buf.slice(0, i); buf = buf.slice(i + 2);
            const ev = /^event: (.+)$/m.exec(block)?.[1], data = /^data: (.+)$/m.exec(block)?.[1];
            if (!ev) continue;
            events.push({ ev, data: JSON.parse(data) });
            waiters.slice().forEach((w) => w());
          }
        }
      } catch { /* flux fermé */ }
    })();
    const wait = (ev, pred = () => true) => new Promise((res, rej) => {
      const t = setTimeout(() => rej(new Error('pas reçu : ' + ev)), 3000);
      const check = () => {
        const hit = events.find((e) => e.ev === ev && pred(e.data) && !e.used);
        if (hit) { hit.used = true; clearTimeout(t); waiters.splice(waiters.indexOf(check), 1); res(hit.data); }
      };
      waiters.push(check); check();
    });
    await wait('pret');
    return { wait, close: () => ctrl.abort() };
  };
  return call;
}

const admin = client(), marie = client(), paul = client();
let ids = {};

test('mise en place : trois membres', async () => {
  assert.equal((await admin('POST', '/api/auth/setup', { name: 'Albino', email: 'albino@exemple.fr', password: 'motdepasse1' })).status, 201);
  for (const [n, e] of [['Marie', 'marie@exemple.fr'], ['Paul', 'paul@exemple.fr']]) {
    assert.equal((await admin('POST', '/api/users', { name: n, email: e, password: 'motdepasse1', role: 'membre' })).status, 201);
  }
  assert.equal((await marie('POST', '/api/auth/login', { email: 'marie@exemple.fr', password: 'motdepasse1' })).status, 200);
  assert.equal((await paul('POST', '/api/auth/login', { email: 'paul@exemple.fr', password: 'motdepasse1' })).status, 200);
  const st = await admin('GET', '/api/chat');
  assert.equal(st.status, 200);
  ids = Object.fromEntries(st.body.users.map((u) => [u.name, u.id]));
  assert.deepEqual(st.body.conversations.map((c) => c.id), ['equipe']);
});

test('sans session : refusé', async () => {
  assert.equal((await client()('GET', '/api/chat')).status, 401);
});

test('conversation Équipe : message en direct, non lus, lecture', async () => {
  const fm = await marie.flux();
  const sent = await admin('POST', '/api/chat/conversations/equipe/messages', { body: '  Bonjour l’équipe  ' });
  assert.equal(sent.status, 201);
  assert.equal(sent.body.message.body, 'Bonjour l’équipe');
  const got = await fm.wait('message', (m) => m.conversationId === 'equipe');
  assert.equal(got.author, 'Albino');
  let st = await marie('GET', '/api/chat');
  assert.equal(st.body.conversations[0].unread, 1);
  assert.equal((await admin('GET', '/api/chat')).body.conversations[0].unread, 0, 'ses propres messages ne comptent pas');
  await marie('POST', '/api/chat/conversations/equipe/lu', {});
  st = await marie('GET', '/api/chat');
  assert.equal(st.body.conversations[0].unread, 0);
  assert.equal((await marie('POST', '/api/chat/conversations/equipe/messages', { body: '   ' })).status, 400);
  assert.equal((await marie('POST', '/api/chat/conversations/equipe/messages', { body: 'x'.repeat(4001) })).status, 400);
  fm.close();
});

test('« en train d’écrire » : signal aux autres membres seulement', async () => {
  const fm = await marie.flux();
  assert.equal((await admin('POST', '/api/chat/conversations/equipe/ecrit', {})).status, 200);
  const x = await fm.wait('ecrit');
  assert.deepEqual(x, { conversationId: 'equipe', userId: ids.Albino });
  assert.equal((await admin('POST', '/api/chat/conversations/inconnue/ecrit', {})).status, 404);
  fm.close();
});

test('groupes : création, visibilité, ajout, départ, droits', async () => {
  const fp = await paul.flux();
  const g = await admin('POST', '/api/chat/groupes', { name: 'Commerciaux', members: [ids.Marie] });
  assert.equal(g.status, 201);
  const gid = g.body.conversation.id;
  assert.deepEqual(g.body.conversation.members.sort(), [ids.Albino, ids.Marie].sort());
  assert.equal((await paul('GET', `/api/chat/conversations/${gid}/messages`)).status, 404, 'Paul n’est pas membre');
  assert.equal((await paul('POST', `/api/chat/conversations/${gid}/messages`, { body: 'intrus' })).status, 404);
  assert.ok(!(await paul('GET', '/api/chat')).body.conversations.some((c) => c.id === gid));
  // Marie (pas créatrice) ne peut pas retirer Albino, mais peut ajouter Paul.
  assert.equal((await marie('PATCH', `/api/chat/groupes/${gid}`, { remove: [ids.Albino] })).status, 403);
  assert.equal((await marie('PATCH', `/api/chat/groupes/${gid}`, { add: [ids.Paul] })).status, 200);
  const annonce = await fp.wait('conversation', (c) => c.id === gid);
  assert.equal(annonce.name, 'Commerciaux');
  const msgs = (await paul('GET', `/api/chat/conversations/${gid}/messages`)).body.messages;
  assert.deepEqual(msgs.map((m) => m.body), ['Albino a créé le groupe « Commerciaux »', 'Marie a ajouté Paul']);
  assert.ok(msgs.every((m) => m.kind === 'info'));
  // Paul quitte le groupe.
  const out = await paul('PATCH', `/api/chat/groupes/${gid}`, { remove: [ids.Paul] });
  assert.equal(out.body.conversation, null);
  await fp.wait('retire', (x) => x.conversationId === gid);
  assert.equal((await admin('PATCH', `/api/chat/groupes/${gid}`, { name: '   ' })).status, 400);
  assert.equal((await admin('PATCH', `/api/chat/groupes/${gid}`, { name: 'Équipe vente' })).body.conversation.name, 'Équipe vente');
  fp.close();
});

test('messages directs : une seule conversation par paire', async () => {
  const a = await admin('POST', '/api/chat/directs', { userId: ids.Paul });
  const b = await paul('POST', '/api/chat/directs', { userId: ids.Albino });
  assert.equal(a.body.conversation.id, b.body.conversation.id);
  assert.equal(a.body.conversation.kind, 'direct');
  assert.equal((await marie('GET', `/api/chat/conversations/${a.body.conversation.id}/messages`)).status, 404);
  assert.equal((await admin('POST', '/api/chat/directs', { userId: ids.Albino })).status, 400);
});

test('visio : participants, relais de signal entre participants seulement, fin', async () => {
  const fa = await admin.flux(), fm = await marie.flux(), fp = await paul.flux();
  const j1 = await admin('POST', '/api/chat/conversations/equipe/visio', {});
  assert.equal(j1.status, 200);
  assert.deepEqual(j1.body.others, []);
  assert.ok(j1.body.iceServers.length);
  await fp.wait('message', (m) => m.kind === 'visio');
  await fm.wait('call', (c) => c.participants.length === 1);
  const j2 = await marie('POST', '/api/chat/conversations/equipe/visio', {});
  assert.deepEqual(j2.body.others, [ids.Albino]);
  // Marie envoie une offre à Albino ; Paul (hors visio) ne peut rien relayer.
  assert.equal((await marie('POST', '/api/chat/signal', { to: ids.Albino, conversationId: 'equipe', data: { sdp: 'offre' } })).status, 200);
  const sig = await fa.wait('signal');
  assert.equal(sig.from, ids.Marie);
  assert.deepEqual(sig.data, { sdp: 'offre' });
  assert.equal((await paul('POST', '/api/chat/signal', { to: ids.Albino, conversationId: 'equipe', data: {} })).status, 409);
  const dir_ = (await admin('POST', '/api/chat/directs', { userId: ids.Paul })).body.conversation.id;
  assert.equal((await marie('POST', `/api/chat/conversations/${dir_}/visio`, {})).status, 404, 'pas de visio dans une conversation dont on n’est pas membre');
  await admin('POST', '/api/chat/conversations/equipe/visio', { action: 'quitter' });
  await marie('POST', '/api/chat/conversations/equipe/visio', { action: 'quitter' });
  const fin = await fp.wait('message', (m) => m.kind === 'info' && /Visio terminée/.test(m.body));
  assert.ok(fin);
  assert.deepEqual((await paul('GET', '/api/chat')).body.conversations.find((c) => c.id === 'equipe').call, []);
  [fa, fm, fp].forEach((f) => f.close());
});
