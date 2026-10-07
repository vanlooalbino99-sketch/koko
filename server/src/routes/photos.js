// /api/photos : photo de profil de chaque membre (une petite image recadrée par le navigateur, gardée en base).
// L'adresse d'une photo porte sa date (?v=…) : le navigateur la garde en cache tant qu'elle ne change pas.
import { Router } from 'express';

const MAX_BYTES = 400 * 1024;
const TYPES = { 'image/jpeg': [0xff, 0xd8, 0xff], 'image/png': [0x89, 0x50, 0x4e, 0x47], 'image/webp': [0x52, 0x49, 0x46, 0x46] };

export function photosRoutes({ db, hub }) {
  const r = Router();
  const everyone = () => db.prepare('SELECT id FROM users').all().map((u) => u.id);
  const announce = (userId, photo) => hub && hub.send(everyone(), 'profil', { userId, photo });

  r.get('/:id', (req, res) => {
    const p = db.prepare('SELECT mime, data FROM user_photos WHERE user_id = ?').get(req.params.id);
    if (!p) return res.status(404).json({ error: 'Pas de photo.' });
    res.set('Cache-Control', 'private, max-age=31536000, immutable').type(p.mime).send(Buffer.from(p.data));
  });

  r.put('/moi', (req, res) => {
    const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(req.body?.image || ''));
    if (!m) return res.status(400).json({ error: 'Choisissez une image JPEG, PNG ou WebP.' });
    const data = Buffer.from(m[2], 'base64');
    if (!data.length || data.length > MAX_BYTES) return res.status(400).json({ error: 'Image trop lourde (400 Ko au plus).' });
    if (!TYPES[m[1]].every((b, i) => data[i] === b)) return res.status(400).json({ error: 'Ce fichier n’est pas une image valide.' });
    const at = new Date().toISOString();
    db.prepare(`INSERT INTO user_photos (user_id, mime, data, updated_at) VALUES (?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET mime = excluded.mime, data = excluded.data, updated_at = excluded.updated_at`).run(req.user.id, m[1], data, at);
    announce(req.user.id, at);
    res.json({ photo: at });
  });

  r.delete('/moi', (req, res) => {
    db.prepare('DELETE FROM user_photos WHERE user_id = ?').run(req.user.id);
    announce(req.user.id, null);
    res.json({ photo: null });
  });

  return r;
}
