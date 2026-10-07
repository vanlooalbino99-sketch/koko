// /api/chat : messagerie interne de l'équipe (conversation « Équipe », groupes, messages directs) et visio.
// - Les messages sont en base ; le temps réel passe par un flux SSE par onglet (/api/chat/flux).
// - La visio est en WebRTC de navigateur à navigateur (maillage, petites équipes) ; le serveur ne fait que
//   relayer la mise en relation (offres, réponses, candidats ICE) et tenir la liste des participants, en mémoire.
import express, { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { getSetting, setSetting } from '../store.js';

export const EQUIPE = 'equipe';
export const POSTES = ['CEO', 'Directeur commercial', 'Manager', 'Commercial', 'Seller', 'Prospecteur (SDR)', 'Assistant(e)', 'Support client'];
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

  const users = () => db.all(`SELECT u.id, u.name, u.role, u.poste, u.manager_id AS "managerId", p.updated_at AS photo FROM users u LEFT JOIN user_photos p ON p.user_id = u.id
                              ORDER BY lower(u.name)`);
  const allIds = async () => (await db.all('SELECT id FROM users')).map((x) => x.id);
  const userName = async (id) => (await db.get('SELECT name FROM users WHERE id = ?', id))?.name || 'Ancien membre';
  const conv = (id) => db.get('SELECT * FROM chat_conversations WHERE id = ?', id);
  const memberIds = async (c) => (c.kind === 'equipe'
    ? allIds()
    : (await db.all('SELECT user_id FROM chat_members WHERE conversation_id = ?', c.id)).map((x) => x.user_id));
  const canSee = async (c, userId) => !!c && (c.kind === 'equipe' || !!(await db.get('SELECT 1 AS ok FROM chat_members WHERE conversation_id = ? AND user_id = ?', c.id, userId)));
  const lastRead = async (cid, uid) => (await db.get('SELECT last_read FROM chat_reads WHERE conversation_id = ? AND user_id = ?', cid, uid))?.last_read || 0;
  const fileOf = (id) => (id ? db.get('SELECT id, name, mime, size FROM chat_files WHERE id = ?', id) : null);
  const toMsg = async (m) => m && { id: Number(m.id), conversationId: m.conversation_id, userId: m.user_id, author: m.author, kind: m.kind, body: m.body, at: m.created_at, file: (await fileOf(m.file_id)) || null };
  const callOf = (cid) => [...(hub.calls.get(cid)?.people || [])];
  const readUpTo = (cid, uid, upTo) => db.run(`INSERT INTO chat_reads (conversation_id, user_id, last_read) VALUES (?, ?, ?)
    ON CONFLICT(conversation_id, user_id) DO UPDATE SET last_read = CASE WHEN excluded.last_read > chat_reads.last_read THEN excluded.last_read ELSE chat_reads.last_read END`, cid, uid, upTo);

  async function view(c, userId) {
    const last = await db.get('SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 1', c.id);
    const read = await lastRead(c.id, userId);
    const unread = (await db.get('SELECT COUNT(*) AS n FROM chat_messages WHERE conversation_id = ? AND id > ? AND kind = ? AND (user_id IS NULL OR user_id != ?)',
      c.id, read, 'texte', userId)).n;
    return {
      id: c.id, kind: c.kind, name: c.name, createdBy: c.created_by, createdAt: c.created_at,
      members: c.kind === 'equipe' ? null : await memberIds(c),
      last: await toMsg(last), unread, lastRead: Number(read), call: callOf(c.id),
    };
  }
  function visible(userId) {
    return db.all(`SELECT c.* FROM chat_conversations c WHERE c.kind = 'equipe'
                     OR EXISTS (SELECT 1 FROM chat_members m WHERE m.conversation_id = c.id AND m.user_id = ?)`, userId);
  }
  async function post(c, user, body, kind = 'texte', fileId = null) {
    const { id } = await db.get('INSERT INTO chat_messages (conversation_id, user_id, author, kind, body, created_at, file_id) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id',
      c.id, user ? user.id : null, user ? user.name : 'Blackstart', kind, body, now(), fileId);
    const msg = await toMsg(await db.get('SELECT * FROM chat_messages WHERE id = ?', id));
    if (user) await readUpTo(c.id, user.id, msg.id);
    hub.send(await memberIds(c), 'message', msg);
    return msg;
  }
  const announce = async (c, ids) => {
    for (const id of ids || await memberIds(c)) hub.send([id], 'conversation', await view(c, id));
  };
  const cleanIds = async (list) => {
    const known = new Set(await allIds());
    return [...new Set((Array.isArray(list) ? list : []).map(String))].filter((id) => known.has(id));
  };
  const cleanName = (s) => String(s || '').trim().replace(/\s+/g, ' ').slice(0, MAX_NAME);

  async function leaveCall(cid, userId) {
    const call = hub.calls.get(cid);
    if (!call || !call.people.has(userId)) return;
    call.people.delete(userId);
    const ended = !call.people.size;
    if (ended) hub.calls.delete(cid);
    const c = await conv(cid);
    if (!c) return;
    if (ended) await post(c, null, `Visio terminée (${Math.max(1, Math.round((Date.now() - call.started) / 60000))} min)`, 'info');
    hub.send(await memberIds(c), 'call', { conversationId: cid, participants: callOf(cid), left: userId });
  }
  const leaveAllCalls = async (userId) => { for (const cid of [...hub.calls.keys()]) await leaveCall(cid, userId); };

  // ---------------------------------------------------------------- lecture
  r.get('/', async (req, res) => {
    const list = await visible(req.user.id);
    res.json({
      me: req.user.id,
      users: await users(),
      online: hub.online(),
      conversations: await Promise.all(list.map((c) => view(c, req.user.id))),
      postes: await getSetting(db, 'postes', POSTES),
    });
  });

  // Postes proposés dans l'organigramme : modifiables par un administrateur.
  r.put('/postes', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Réservé aux administrateurs.' });
    const list = [...new Set((Array.isArray(req.body?.postes) ? req.body.postes : []).map((x) => String(x).trim().replace(/\s+/g, ' ').slice(0, 60)).filter(Boolean))].slice(0, 40);
    if (!list.length) return res.status(400).json({ error: 'Gardez au moins un poste.' });
    await setSetting(db, 'postes', list);
    hub.send(await allIds(), 'equipe', { postes: list });
    res.json({ postes: list });
  });

  r.get('/conversations/:id/messages', async (req, res) => {
    const c = await conv(req.params.id);
    if (!(await canSee(c, req.user.id))) return res.status(404).json({ error: 'Conversation introuvable.' });
    const before = Number(req.query.before) || Number.MAX_SAFE_INTEGER;
    const rows = await db.all('SELECT * FROM chat_messages WHERE conversation_id = ? AND id < ? ORDER BY id DESC LIMIT ?', c.id, before, PAGE);
    res.json({ messages: await Promise.all(rows.reverse().map(toMsg)), more: rows.length === PAGE });
  });

  // ---------------------------------------------------------------- écriture
  r.post('/conversations/:id/messages', async (req, res) => {
    const c = await conv(req.params.id);
    if (!(await canSee(c, req.user.id))) return res.status(404).json({ error: 'Conversation introuvable.' });
    const body = String(req.body?.body ?? '').replace(/\r\n/g, '\n').trim();
    if (!body) return res.status(400).json({ error: 'Message vide.' });
    if (body.length > MAX_BODY) return res.status(400).json({ error: `Message trop long (${MAX_BODY} caractères au plus).` });
    res.status(201).json({ message: await post(c, req.user, body) });
  });

  // Pièce jointe : le fichier brut dans le corps, son nom et son type dans l'adresse ; un message l'accompagne.
  r.post('/conversations/:id/fichiers', express.raw({ type: () => true, limit: MAX_FILE }), async (req, res) => {
    const c = await conv(req.params.id);
    if (!(await canSee(c, req.user.id))) return res.status(404).json({ error: 'Conversation introuvable.' });
    const data = Buffer.isBuffer(req.body) ? req.body : null;
    if (!data || !data.length) return res.status(400).json({ error: 'Fichier vide.' });
    const name = String(req.query.nom || 'fichier').replace(/[\u0000-\u001f\\/]/g, '').trim().slice(0, 120) || 'fichier';
    const mime = /^[\w.+-]+\/[\w.+-]+$/.test(String(req.query.type || '')) ? String(req.query.type).toLowerCase() : 'application/octet-stream';
    const body = String(req.query.texte ?? '').replace(/\r\n/g, '\n').trim().slice(0, MAX_BODY);
    const id = randomUUID();
    await db.run('INSERT INTO chat_files (id, conversation_id, user_id, name, mime, size, data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      id, c.id, req.user.id, name, mime, data.length, data, now());
    res.status(201).json({ message: await post(c, req.user, body, 'texte', id) });
  });

  r.get('/fichiers/:id', async (req, res) => {
    const f = await db.get('SELECT * FROM chat_files WHERE id = ?', req.params.id);
    if (!f || !(await canSee(await conv(f.conversation_id), req.user.id))) return res.status(404).json({ error: 'Fichier introuvable.' });
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
  r.post('/conversations/:id/ecrit', async (req, res) => {
    const c = await conv(req.params.id);
    if (!(await canSee(c, req.user.id))) return res.status(404).json({ error: 'Conversation introuvable.' });
    hub.send((await memberIds(c)).filter((id) => id !== req.user.id), 'ecrit', { conversationId: c.id, userId: req.user.id });
    res.json({ ok: true });
  });

  r.post('/conversations/:id/lu', async (req, res) => {
    const c = await conv(req.params.id);
    if (!(await canSee(c, req.user.id))) return res.status(404).json({ error: 'Conversation introuvable.' });
    const max = Number((await db.get('SELECT MAX(id) AS m FROM chat_messages WHERE conversation_id = ?', c.id)).m) || 0;
    const upTo = Math.min(Number(req.body?.jusqua) || max, max);
    await readUpTo(c.id, req.user.id, upTo);
    const v = await view(c, req.user.id);
    hub.send([req.user.id], 'conversation', v); // les autres onglets de la même personne
    res.json({ conversation: v });
  });

  // Nouveau groupe : son nom et ses membres (le créateur en fait toujours partie).
  r.post('/groupes', async (req, res) => {
    const name = cleanName(req.body?.name);
    if (!name) return res.status(400).json({ error: 'Donnez un nom au groupe.' });
    const ids = await cleanIds([...(req.body?.members || []), req.user.id]);
    const c = await db.tx(async () => {
      const id = randomUUID();
      await db.run('INSERT INTO chat_conversations (id, kind, name, created_by, created_at) VALUES (?, ?, ?, ?, ?)', id, 'groupe', name, req.user.id, now());
      for (const u of ids) await db.run('INSERT INTO chat_members (conversation_id, user_id) VALUES (?, ?)', id, u);
      return conv(id);
    });
    await post(c, null, `${req.user.name} a créé le groupe « ${name} »`, 'info');
    await announce(c);
    res.status(201).json({ conversation: await view(c, req.user.id) });
  });

  // Message direct : une seule conversation par paire de membres.
  r.post('/directs', async (req, res) => {
    const other = String(req.body?.userId || '');
    if (other === req.user.id || !(await db.get('SELECT 1 AS ok FROM users WHERE id = ?', other))) return res.status(400).json({ error: 'Membre introuvable.' });
    const key = [req.user.id, other].sort().join(':');
    let c = await db.get('SELECT * FROM chat_conversations WHERE direct_key = ?', key);
    if (!c) {
      let created = false;
      c = await db.tx(async () => {
        const again = await db.get('SELECT * FROM chat_conversations WHERE direct_key = ?', key);
        if (again) return again;
        const id = randomUUID();
        await db.run('INSERT INTO chat_conversations (id, kind, direct_key, created_by, created_at) VALUES (?, ?, ?, ?, ?)', id, 'direct', key, req.user.id, now());
        for (const u of [req.user.id, other]) await db.run('INSERT INTO chat_members (conversation_id, user_id) VALUES (?, ?)', id, u);
        created = true;
        return conv(id);
      });
      if (created) await announce(c);
    }
    res.json({ conversation: await view(c, req.user.id) });
  });

  // Groupe : renommer, ajouter ou retirer des membres. Retirer quelqu'un d'autre : administrateur.
  r.patch('/groupes/:id', async (req, res) => {
    const c = await conv(req.params.id);
    if (!(await canSee(c, req.user.id)) || c.kind !== 'groupe') return res.status(404).json({ error: 'Groupe introuvable.' });
    const before = await memberIds(c);
    const { name, add, remove } = req.body || {};
    const boss = req.user.role === 'admin';
    const out = (await cleanIds(remove)).filter((id) => id === req.user.id || boss);
    if (Array.isArray(remove) && remove.length && !out.length) return res.status(403).json({ error: 'Seul un administrateur peut retirer un membre.' });
    const toAdd = (await cleanIds(add)).filter((id) => !before.includes(id));
    const notes = [];
    await db.tx(async () => {
      if (name !== undefined) {
        const n = cleanName(name);
        if (!n) throw Object.assign(new Error('Donnez un nom au groupe.'), { status: 400 });
        if (n !== c.name) { await db.run('UPDATE chat_conversations SET name = ? WHERE id = ?', n, c.id); notes.push(`${req.user.name} a renommé le groupe en « ${n} »`); }
      }
      for (const id of toAdd) {
        await db.run('INSERT INTO chat_members (conversation_id, user_id) VALUES (?, ?)', c.id, id);
        notes.push(`${req.user.name} a ajouté ${await userName(id)}`);
      }
      for (const id of out.filter((x) => before.includes(x))) {
        await db.run('DELETE FROM chat_members WHERE conversation_id = ? AND user_id = ?', c.id, id);
        notes.push(id === req.user.id ? `${req.user.name} a quitté le groupe` : `${req.user.name} a retiré ${await userName(id)}`);
      }
    });
    const fresh = await conv(c.id);
    for (const t of notes) await post(fresh, null, t, 'info');
    for (const id of out) await leaveCall(c.id, id);
    const now_ = await memberIds(fresh);
    await announce(fresh, now_);
    before.filter((id) => !now_.includes(id)).forEach((id) => hub.send([id], 'retire', { conversationId: c.id }));
    res.json({ conversation: now_.includes(req.user.id) ? await view(fresh, req.user.id) : null });
  });

  // ---------------------------------------------------------------- visio
  r.post('/conversations/:id/visio', async (req, res) => {
    const c = await conv(req.params.id);
    if (!(await canSee(c, req.user.id))) return res.status(404).json({ error: 'Conversation introuvable.' });
    const join = req.body?.action !== 'quitter';
    if (!join) { await leaveCall(c.id, req.user.id); return res.json({ participants: callOf(c.id) }); }
    if (!hub.conns.has(req.user.id)) return res.status(409).json({ error: 'Connexion temps réel absente : rechargez la page.' });
    let call = hub.calls.get(c.id);
    const first = !call;
    if (!call) { call = { started: Date.now(), people: new Set() }; hub.calls.set(c.id, call); }
    const others = callOf(c.id).filter((id) => id !== req.user.id);
    call.people.add(req.user.id);
    if (first) await post(c, req.user, `${req.user.name} a lancé une visio`, 'visio');
    hub.send(await memberIds(c), 'call', { conversationId: c.id, participants: callOf(c.id), joined: req.user.id });
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
  r.get('/flux', async (req, res) => {
    const everyone = await allIds();
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write('retry: 3000\n\n');
    const uid = req.user.id;
    if (hub.add(uid, res)) hub.send(everyone, 'presence', { online: hub.online() });
    res.write(`event: pret\ndata: ${JSON.stringify({ online: hub.online() })}\n\n`);
    const beat = setInterval(() => res.write(': ping\n\n'), HEARTBEAT_MS);
    req.on('close', () => {
      clearInterval(beat);
      hub.remove(uid, res, () => {
        (async () => {
          await leaveAllCalls(uid);
          hub.send(await allIds(), 'presence', { online: hub.online() });
        })().catch((e) => console.error('Messagerie :', e.message));
      });
    });
  });

  r.use((err, _req, res, next) => {
    if (err.status === 413) return res.status(413).json({ error: `Fichier trop lourd (${MAX_FILE / 1024 / 1024} Mo au plus).` });
    return err.status === 400 ? res.status(400).json({ error: err.message }) : next(err);
  });
  return r;
}
