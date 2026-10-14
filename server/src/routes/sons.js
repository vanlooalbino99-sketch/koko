// /api/sons : sons personnels de chaque membre (un MP3 choisi sur son ordinateur), pour la visio entrante,
// le message reçu et le message envoyé. Gardés en base : ils suivent le compte sur tous ses appareils.
import express, { Router } from 'express';

export const SORTES = ['visio', 'recu', 'envoye'];
const MAX = 3 * 1024 * 1024;
const TYPES = /^audio\/(mpeg|mp3|mp4|x-m4a|aac|ogg|wav|x-wav|wave|webm|flac)$/;

export function sonsRoutes({ db }) {
  const r = Router();
  const sorte = (req, res) => {
    if (SORTES.includes(req.params.sorte)) return req.params.sorte;
    res.status(404).json({ error: 'Son inconnu.' });
    return null;
  };

  r.get('/', async (req, res) => {
    const rows = await db.all('SELECT kind, name, updated_at FROM user_sons WHERE user_id = ?', req.user.id);
    res.json({ sons: rows.map((x) => ({ sorte: x.kind, nom: x.name, maj: x.updated_at })) });
  });

  // L'adresse porte la date du son (?v=…) : le navigateur le garde en cache tant qu'il ne change pas.
  r.get('/:sorte', async (req, res) => {
    const k = sorte(req, res); if (!k) return;
    const s = await db.get('SELECT mime, data FROM user_sons WHERE user_id = ? AND kind = ?', req.user.id, k);
    if (!s) return res.status(404).json({ error: 'Pas de son personnel.' });
    res.set('Cache-Control', 'private, max-age=31536000, immutable').type(s.mime).send(Buffer.from(s.data));
  });

  r.put('/:sorte', express.raw({ type: () => true, limit: MAX }), async (req, res) => {
    const k = sorte(req, res); if (!k) return;
    const data = Buffer.isBuffer(req.body) ? req.body : null;
    if (!data || !data.length) return res.status(400).json({ error: 'Fichier vide.' });
    let mime = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (mime === 'audio/mp3') mime = 'audio/mpeg';
    if (!TYPES.test(mime)) return res.status(400).json({ error: 'Choisissez un fichier son (MP3, M4A, WAV ou OGG).' });
    const name = String(req.query.nom || 'son').replace(/[\u0000-\u001f\\/]/g, '').trim().slice(0, 120) || 'son';
    const at = new Date().toISOString();
    await db.run(`INSERT INTO user_sons (user_id, kind, name, mime, data, updated_at) VALUES (?, ?, ?, ?, ?, ?)
                  ON CONFLICT(user_id, kind) DO UPDATE SET name = excluded.name, mime = excluded.mime, data = excluded.data, updated_at = excluded.updated_at`,
    req.user.id, k, name, mime, data, at);
    res.json({ son: { sorte: k, nom: name, maj: at } });
  });

  r.delete('/:sorte', async (req, res) => {
    const k = sorte(req, res); if (!k) return;
    await db.run('DELETE FROM user_sons WHERE user_id = ? AND kind = ?', req.user.id, k);
    res.json({ ok: true });
  });

  return r;
}
