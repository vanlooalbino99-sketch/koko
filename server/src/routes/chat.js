// /api/chat : messagerie interne de l'équipe (conversation « Équipe », groupes, messages directs) et visio.
// - Les messages sont en base ; le temps réel passe par un flux SSE par onglet (/api/chat/flux).
// - La visio est en WebRTC de navigateur à navigateur (maillage, petites équipes) ; le serveur ne fait que
//   relayer la mise en relation (offres, réponses, candidats ICE) et tenir la liste des participants, en mémoire.
import express, { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { tx } from '../db.js';

export const EQUIPE = 'equipe';
const MAX_BODY = 4000;
const MAX_NAME = 60;
const MAX_SIGNAL = 64 * 1024;
export const MAX_FILE = 10 * 1024 * 1024;
// Affichés dans le navigateur ; tout le reste est proposé au téléchargement (jamais exécuté dans la page).
const INLINE = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']);
const PAGE = 50;
const HEARTBEAT_MS = 20000;
const GRACE_MS = 15000;
const now = () => new Date().toISOString();

/** Connexions temps réel par membre, participants des visios, et diffusion d'événements. */
export function chatHub() {
  const conns = new Map(); // userId -> Set<res>
  const calls = new Map(); // conversationId -> { started, people: Set<userId> }
  const leaveTimers = new Map();
  return {
    conns,
    calls,
    online: () => [...conns.keys()],
    send(userIds, event, data) {
      const line = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      for (const id of new Set(userIds)) for (const res of conns.get(id) || []) res.write(line);
    },
    add(userId, res) {
      clearTimeout(leaveTimers.get(userId));
      leaveTimers.delete(userId);
      const set = conns.get(userId) || new Set();
      const first = set.size === 0;
      set.add(res);
      conns.set(userId, set);
      return first;
    },
    remove(userId, res, onGone) {
      const set = conns.get(userId);
      if (!set) return;
      set.delete(res);
      if (set.size) return;
      conns.delete(userId);
      // Onglet rechargé ou réseau coupé un instant : on attend un peu avant de le dire absent.
      leaveTimers.set(userId, setTimeout(() => { leaveTimers.delete(userId); if (!conns.has(userId)) onGone(); }, GRACE_MS));
    },
    close() {
      leaveTimers.forEach(clearTimeout);
      for (const set of conns.values()) for (const res of set) res.end();
      conns.clear();
    },
  };
}

export function chatRoutes({ db, hub = chatHub() }) {
  const r = Router();

  const users = () => db.prepare(`SELECT u.id, u.name, u.role, p.updated_at AS photo FROM users u LEFT JOIN user_photos p ON p.user_id = u.id
                                   ORDER BY u.name COLLATE NOCASE`).all();
  const userName = (id) => db.prepare('SELECT name FROM users WHERE id = ?').get(id)?.name || 'Ancien membre';
  const conv = (id) => db.prepare('SELECT * FROM chat_conversations WHERE id = ?').get(id);
  const memberIds = (c) => (c.kind === 'equipe'
    ? db.prepare('SELECT id FROM users').all().map((x) => x.id)
    : db.prepare('SELECT user_id FROM chat_members WHERE conversation_id = ?').all(c.id).map((x) => x.user_id));
  const canSee = (c, userId) => !!c && (c.kind === 'equipe' || !!db.prepare('SELECT 1 FROM chat_members WHERE conversation_id = ? AND user_id = ?').get(c.id, userId));
  const lastRead = (cid, uid) => db.prepare('SELECT last_read FROM chat_reads WHERE conversation_id = ? AND user_id = ?').get(cid, uid)?.last_read || 0;
  const fileOf = (id) => id && db.prepare('SELECT id, name, mime, size FROM chat_files WHERE id = ?').get(id);
  const toMsg = (m) => m && { id: m.id, conversationId: m.conversation_id, userId: m.user_id, author: m.author, kind: m.kind, body: m.body, at: m.created_at, file: fileOf(m.file_id) || null };
  const callOf = (cid) => [...(hub.calls.get(cid)?.people || [])];

  function view(c, userId) {
    const last = db.prepare('SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 1').get(c.id);
    const unread = db.prepare('SELECT COUNT(*) AS n FROM chat_messages WHERE conversation_id = ? AND id > ? AND kind = ? AND (user_id IS NULL OR user_id != ?)')
      .get(c.id, lastRead(c.id, userId), 'texte', userId).n;
    return {
      id: c.id, kind: c.kind, name: c.name, createdBy: c.created_by, createdAt: c.created_at,
      members: c.kind === 'equipe' ? null : memberIds(c),
      last: toMsg(last), unread, lastRead: lastRead(c.id, userId), call: callOf(c.id),
    };
  }
  function visible(userId) {
    return db.prepare(`SELECT c.* FROM chat_conversations c WHERE c.kind = 'equipe'
                         OR EXISTS (SELECT 1 FROM chat_members m WHERE m.conversation_id = c.id AND m.user_id = ?)`).all(userId);
  }
  function post(c, user, body, kind = 'texte', fileId = null) {
    const info = db.prepare('INSERT INTO chat_messages (conversation_id, user_id, author, kind, body, created_at, file_id) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(c.id, user ? user.id : null, user ? user.name : 'Blackstart', kind, body, now(), fileId);
    const msg = toMsg(db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(Number(info.lastInsertRowid)));
    if (user) db.prepare(`INSERT INTO chat_reads (conversation_id, user_id, last_read) VALUES (?, ?, ?)
                          ON CONFLICT(conversation_id, user_id) DO UPDATE SET last_read = MAX(last_read, excluded.last_read)`).run(c.id, user.id, msg.id);
    hub.send(memberIds(c), 'message', msg);
    return msg;
  }
  const announce = (c, ids = memberIds(c)) => ids.forEach((id) => hub.send([id], 'conversation', view(c, id)));
  const cleanIds = (list) => [...new Set((Array.isArray(list) ? list : []).map(String))]
    .filter((id) => db.prepare('SELECT 1 FROM users WHERE id = ?').get(id));
  const cleanName = (s) => String(s || '').trim().replace(/\s+/g, ' ').slice(0, MAX_NAME);

  function leaveCall(cid, userId) {
    const call = hub.calls.get(cid);
    if (!call || !call.people.has(userId)) return;
    call.people.delete(userId);
    const c = conv(cid);
    if (!call.people.size) {
      hub.calls.delete(cid);
      if (c) post(c, null, `Visio terminée (${Math.max(1, Math.round((Date.now() - call.started) / 60000))} min)`, 'info');
    }
    if (c) hub.send(memberIds(c), 'call', { conversationId: cid, participants: callOf(cid), left: userId });
  }
  const leaveAllCalls = (userId) => [...hub.calls.keys()].forEach((cid) => leaveCall(cid, userId));

  // ---------------------------------------------------------------- lecture
  r.get('/', (req, res) => {
    res.json({
      me: req.user.id,
      users: users(),
      online: hub.online(),
      conversations: visible(req.user.id).map((c) => view(c, req.user.id)),
    });
  });

  r.get('/conversations/:id/messages', (req, res) => {
    const c = conv(req.params.id);
    if (!canSee(c, req.user.id)) return res.status(404).json({ error: 'Conversation introuvable.' });
    const before = Number(req.query.before) || Number.MAX_SAFE_INTEGER;
    const rows = db.prepare('SELECT * FROM chat_messages WHERE conversation_id = ? AND id < ? ORDER BY id DESC LIMIT ?').all(c.id, before, PAGE);
    res.json({ messages: rows.reverse().map(toMsg), more: rows.length === PAGE });
  });

  // ---------------------------------------------------------------- écriture
  r.post('/conversations/:id/messages', (req, res) => {
    const c = conv(req.params.id);
    if (!canSee(c, req.user.id)) return res.status(404).json({ error: 'Conversation introuvable.' });
    const body = String(req.body?.body ?? '').replace(/\r\n/g, '\n').trim();
    if (!body) return res.status(400).json({ error: 'Message vide.' });
    if (body.length > MAX_BODY) return res.status(400).json({ error: `Message trop long (${MAX_BODY} caractères au plus).` });
    res.status(201).json({ message: post(c, req.user, body) });
  });

  // Pièce jointe : le fichier brut dans le corps, son nom et son type dans l'adresse ; un message l'accompagne.
  r.post('/conversations/:id/fichiers', express.raw({ type: () => true, limit: MAX_FILE }), (req, res) => {
    const c = conv(req.params.id);
    if (!canSee(c, req.user.id)) return res.status(404).json({ error: 'Conversation introuvable.' });
    const data = Buffer.isBuffer(req.body) ? req.body : null;
    if (!data || !data.length) return res.status(400).json({ error: 'Fichier vide.' });
    const name = String(req.query.nom || 'fichier').replace(/[\u0000-\u001f\\/]/g, '').trim().slice(0, 120) || 'fichier';
    const mime = /^[\w.+-]+\/[\w.+-]+$/.test(String(req.query.type || '')) ? String(req.query.type).toLowerCase() : 'application/octet-stream';
    const body = String(req.query.texte ?? '').replace(/\r\n/g, '\n').trim().slice(0, MAX_BODY);
    const id = randomUUID();
    db.prepare('INSERT INTO chat_files (id, conversation_id, user_id, name, mime, size, data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, c.id, req.user.id, name, mime, data.length, data, now());
    res.status(201).json({ message: post(c, req.user, body, 'texte', id) });
  });

  r.get('/fichiers/:id', (req, res) => {
    const f = db.prepare('SELECT * FROM chat_files WHERE id = ?').get(req.params.id);
    if (!f || !canSee(conv(f.conversation_id), req.user.id)) return res.status(404).json({ error: 'Fichier introuvable.' });
    const inline = INLINE.has(f.mime) && req.query.telecharger === undefined;
    res.set({
      'Content-Type': inline ? f.mime : 'application/octet-stream',
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(f.name)}`,
      'X-Content-Type-Options': 'nosniff',
      ...(f.mime === 'application/pdf' && inline ? {} : { 'Content-Security-Policy': "default-src 'none'; img-src 'self'; sandbox" }),
      'Cache-Control': 'private, max-age=31536000, immutable',
    }).send(Buffer.from(f.data));
  });

  // « En train d'écrire » : rien en base, juste un signal aux autres membres (le navigateur le renvoie toutes les 2–3 s).
  r.post('/conversations/:id/ecrit', (req, res) => {
    const c = conv(req.params.id);
    if (!canSee(c, req.user.id)) return res.status(404).json({ error: 'Conversation introuvable.' });
    hub.send(memberIds(c).filter((id) => id !== req.user.id), 'ecrit', { conversationId: c.id, userId: req.user.id });
    res.json({ ok: true });
  });

  r.post('/conversations/:id/lu', (req, res) => {
    const c = conv(req.params.id);
    if (!canSee(c, req.user.id)) return res.status(404).json({ error: 'Conversation introuvable.' });
    const max = db.prepare('SELECT MAX(id) AS m FROM chat_messages WHERE conversation_id = ?').get(c.id).m || 0;
    const upTo = Math.min(Number(req.body?.jusqua) || max, max);
    db.prepare(`INSERT INTO chat_reads (conversation_id, user_id, last_read) VALUES (?, ?, ?)
                ON CONFLICT(conversation_id, user_id) DO UPDATE SET last_read = MAX(last_read, excluded.last_read)`).run(c.id, req.user.id, upTo);
    const v = view(c, req.user.id);
    hub.send([req.user.id], 'conversation', v); // les autres onglets de la même personne
    res.json({ conversation: v });
  });

  // Nouveau groupe : son nom et ses membres (le créateur en fait toujours partie).
  r.post('/groupes', (req, res) => {
    const name = cleanName(req.body?.name);
    if (!name) return res.status(400).json({ error: 'Donnez un nom au groupe.' });
    const ids = cleanIds([...(req.body?.members || []), req.user.id]);
    const c = tx(db, () => {
      const id = randomUUID();
      db.prepare('INSERT INTO chat_conversations (id, kind, name, created_by, created_at) VALUES (?, ?, ?, ?, ?)').run(id, 'groupe', name, req.user.id, now());
      ids.forEach((u) => db.prepare('INSERT INTO chat_members (conversation_id, user_id) VALUES (?, ?)').run(id, u));
      return conv(id);
    });
    post(c, null, `${req.user.name} a créé le groupe « ${name} »`, 'info');
    announce(c);
    res.status(201).json({ conversation: view(c, req.user.id) });
  });

  // Message direct : une seule conversation par paire de membres.
  r.post('/directs', (req, res) => {
    const other = String(req.body?.userId || '');
    if (other === req.user.id || !db.prepare('SELECT 1 FROM users WHERE id = ?').get(other)) return res.status(400).json({ error: 'Membre introuvable.' });
    const key = [req.user.id, other].sort().join(':');
    let c = db.prepare('SELECT * FROM chat_conversations WHERE direct_key = ?').get(key);
    if (!c) {
      c = tx(db, () => {
        const id = randomUUID();
        db.prepare('INSERT INTO chat_conversations (id, kind, direct_key, created_by, created_at) VALUES (?, ?, ?, ?, ?)').run(id, 'direct', key, req.user.id, now());
        [req.user.id, other].forEach((u) => db.prepare('INSERT INTO chat_members (conversation_id, user_id) VALUES (?, ?)').run(id, u));
        return conv(id);
      });
      announce(c);
    }
    res.json({ conversation: view(c, req.user.id) });
  });

  // Groupe : renommer, ajouter ou retirer des membres. Retirer quelqu'un d'autre : créateur ou administrateur.
  r.patch('/groupes/:id', (req, res) => {
    const c = conv(req.params.id);
    if (!canSee(c, req.user.id) || c.kind !== 'groupe') return res.status(404).json({ error: 'Groupe introuvable.' });
    const before = memberIds(c);
    const { name, add, remove } = req.body || {};
    const boss = req.user.role === 'admin' || c.created_by === req.user.id;
    const out = cleanIds(remove).filter((id) => id === req.user.id || boss);
    if (Array.isArray(remove) && remove.length && !out.length) return res.status(403).json({ error: 'Seul le créateur du groupe ou un administrateur peut retirer un membre.' });
    const notes = [];
    tx(db, () => {
      if (name !== undefined) {
        const n = cleanName(name);
        if (!n) throw Object.assign(new Error('Donnez un nom au groupe.'), { status: 400 });
        if (n !== c.name) { db.prepare('UPDATE chat_conversations SET name = ? WHERE id = ?').run(n, c.id); notes.push(`${req.user.name} a renommé le groupe en « ${n} »`); }
      }
      cleanIds(add).filter((id) => !before.includes(id)).forEach((id) => {
        db.prepare('INSERT INTO chat_members (conversation_id, user_id) VALUES (?, ?)').run(c.id, id);
        notes.push(`${req.user.name} a ajouté ${userName(id)}`);
      });
      out.filter((id) => before.includes(id)).forEach((id) => {
        db.prepare('DELETE FROM chat_members WHERE conversation_id = ? AND user_id = ?').run(c.id, id);
        notes.push(id === req.user.id ? `${req.user.name} a quitté le groupe` : `${req.user.name} a retiré ${userName(id)}`);
      });
    });
    const fresh = conv(c.id);
    notes.forEach((t) => post(fresh, null, t, 'info'));
    out.forEach((id) => leaveCall(c.id, id));
    const now_ = memberIds(fresh);
    announce(fresh, now_);
    before.filter((id) => !now_.includes(id)).forEach((id) => hub.send([id], 'retire', { conversationId: c.id }));
    res.json({ conversation: now_.includes(req.user.id) ? view(fresh, req.user.id) : null });
  });

  // ---------------------------------------------------------------- visio
  r.post('/conversations/:id/visio', (req, res) => {
    const c = conv(req.params.id);
    if (!canSee(c, req.user.id)) return res.status(404).json({ error: 'Conversation introuvable.' });
    const join = req.body?.action !== 'quitter';
    if (!join) { leaveCall(c.id, req.user.id); return res.json({ participants: callOf(c.id) }); }
    if (!hub.conns.has(req.user.id)) return res.status(409).json({ error: 'Connexion temps réel absente : rechargez la page.' });
    let call = hub.calls.get(c.id);
    const first = !call;
    if (!call) { call = { started: Date.now(), people: new Set() }; hub.calls.set(c.id, call); }
    const others = callOf(c.id).filter((id) => id !== req.user.id);
    call.people.add(req.user.id);
    if (first) post(c, req.user, `${req.user.name} a lancé une visio`, 'visio');
    hub.send(memberIds(c), 'call', { conversationId: c.id, participants: callOf(c.id), joined: req.user.id });
    res.json({ participants: callOf(c.id), others, iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] });
  });

  // Relais de mise en relation WebRTC, seulement entre deux participants de la même visio.
  r.post('/signal', (req, res) => {
    const { to, conversationId, data } = req.body || {};
    const call = hub.calls.get(String(conversationId || ''));
    if (!call || !call.people.has(req.user.id) || !call.people.has(String(to))) return res.status(409).json({ error: 'Cette personne n’est plus dans la visio.' });
    if (JSON.stringify(data ?? null).length > MAX_SIGNAL) return res.status(413).json({ error: 'Signal trop volumineux.' });
    hub.send([String(to)], 'signal', { from: req.user.id, conversationId, data });
    res.json({ ok: true });
  });

  // ---------------------------------------------------------------- temps réel
  r.get('/flux', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write('retry: 3000\n\n');
    const uid = req.user.id;
    if (hub.add(uid, res)) hub.send(users().map((u) => u.id), 'presence', { online: hub.online() });
    res.write(`event: pret\ndata: ${JSON.stringify({ online: hub.online() })}\n\n`);
    const beat = setInterval(() => res.write(': ping\n\n'), HEARTBEAT_MS);
    req.on('close', () => {
      clearInterval(beat);
      hub.remove(uid, res, () => {
        leaveAllCalls(uid);
        hub.send(users().map((u) => u.id), 'presence', { online: hub.online() });
      });
    });
  });

  r.use((err, _req, res, next) => {
    if (err.status === 413) return res.status(413).json({ error: `Fichier trop lourd (${MAX_FILE / 1024 / 1024} Mo au plus).` });
    return err.status === 400 ? res.status(400).json({ error: err.message }) : next(err);
  });
  return r;
}
