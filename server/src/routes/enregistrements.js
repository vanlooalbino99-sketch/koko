// /api/enregistrements : enregistrements d'appels faits dans le CRM (Outils › Enregistrements).
// Chaque membre envoie les siens ; il retrouve sa liste, les administrateurs écoutent ceux de toute l'équipe.
// Supprimer une copie du serveur : administrateurs seulement.
import express, { Router } from 'express';

const MAX = 60 * 1024 * 1024;
const TYPES = /^audio\/(webm|ogg|mp4|mpeg|mp3|x-m4a|aac|wav|x-wav)$/;
const texte = (v, n) => String(v || '').replace(/[\u0000-\u001f\\/]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);

export function enregistrementsRoutes({ db }) {
  const r = Router();
  const admin = (req) => req.user.role === 'admin';
  const vue = (x) => ({ id: x.id, userId: x.user_id, auteur: x.author, prospectId: x.prospect_id, prospect: x.prospect_name,
    nom: x.name, mime: x.mime, taille: x.size, duree: x.duration, date: x.created_at });
  const COLS = 'id, user_id, author, prospect_id, prospect_name, name, mime, size, duration, created_at';

  r.get('/', async (req, res) => {
    const membre = admin(req) ? String(req.query.membre || '') : req.user.id;
    const rows = membre
      ? await db.all(`SELECT ${COLS} FROM recordings WHERE user_id = ? ORDER BY created_at DESC`, membre)
      : await db.all(`SELECT ${COLS} FROM recordings ORDER BY created_at DESC`);
    res.json({ enregistrements: rows.map(vue), tous: admin(req) });
  });

  r.post('/', express.raw({ type: () => true, limit: MAX }), async (req, res) => {
    const data = Buffer.isBuffer(req.body) ? req.body : null;
    if (!data || !data.length) return res.status(400).json({ error: 'Enregistrement vide.' });
    const mime = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (!TYPES.test(mime)) return res.status(400).json({ error: 'Ce fichier n’est pas un enregistrement audio.' });
    const id = String(req.query.id || '');
    if (!/^[\w-]{6,64}$/.test(id)) return res.status(400).json({ error: 'Identifiant d’enregistrement invalide.' });
    const deja = await db.get('SELECT user_id FROM recordings WHERE id = ?', id);
    if (deja) return deja.user_id === req.user.id ? res.json({ ok: true, deja: true }) : res.status(409).json({ error: 'Identifiant déjà utilisé.' });
    const quand = Date.parse(req.query.date || '');
    await db.run(`INSERT INTO recordings (id, user_id, author, prospect_id, prospect_name, name, mime, size, duration, data, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, req.user.id, req.user.name, texte(req.query.prospectId, 80) || null, texte(req.query.prospect, 120) || null,
      texte(req.query.nom, 160) || 'enregistrement', mime, data.length, Math.max(0, Math.min(86400, Number(req.query.duree) || 0)), data,
      Number.isFinite(quand) ? new Date(quand).toISOString() : new Date().toISOString());
    res.status(201).json({ ok: true });
  });

  r.get('/:id', async (req, res) => {
    const x = await db.get('SELECT * FROM recordings WHERE id = ?', req.params.id);
    if (!x || (x.user_id !== req.user.id && !admin(req))) return res.status(404).json({ error: 'Enregistrement introuvable.' });
    const data = Buffer.from(x.data);
    const ext = (/\/(\w+)/.exec(x.mime) || [, 'webm'])[1].replace('mpeg', 'mp3').replace('x-m4a', 'm4a');
    res.set({
      'Content-Type': x.mime,
      'Content-Disposition': `${req.query.telecharger !== undefined ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(x.name + '.' + ext)}`,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
      'Cache-Control': 'private, max-age=31536000, immutable',
      'Accept-Ranges': 'bytes',
    });
    const m = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || '').trim());
    if (m && (m[1] || m[2])) {
      const n = data.length;
      const a = m[1] ? Number(m[1]) : Math.max(0, n - Number(m[2]));
      const b = m[1] && m[2] ? Math.min(Number(m[2]), n - 1) : n - 1;
      if (!(a <= b && a < n)) return res.status(416).set('Content-Range', `bytes */${n}`).end();
      return res.status(206).set('Content-Range', `bytes ${a}-${b}/${n}`).send(data.subarray(a, b + 1));
    }
    res.send(data);
  });

  r.delete('/:id', async (req, res) => {
    if (!admin(req)) return res.status(403).json({ error: 'Réservé aux administrateurs.' });
    const out = await db.run('DELETE FROM recordings WHERE id = ?', req.params.id);
    if (!out || !out.changes) return res.status(404).json({ error: 'Enregistrement introuvable.' });
    res.json({ ok: true });
  });

  return r;
}
