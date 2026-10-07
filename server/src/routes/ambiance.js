// Images d'ambiance partagées par l'équipe (Réglages › Ambiance) : réglages, envoi, suppression, lecture.
// Les fichiers sont rangés dans DATA_DIR/ambiance/, les informations dans la base.
// Lecture pour tout membre connecté ; modification réservée aux administrateurs.
import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { getSetting, setSetting } from '../store.js';
import { requireAdmin } from '../auth.js';

const MAX_IMAGES = 60;
const MAX_BYTES = 12 * 1024 * 1024;
const TYPES = { jpeg: 'jpg', png: 'png', webp: 'webp' };
const MAGIC = { jpg: [0xff, 0xd8, 0xff], png: [0x89, 0x50, 0x4e, 0x47], webp: [0x52, 0x49, 0x46, 0x46] };

function decodeImage(dataUrl) {
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=\s]+)$/.exec(String(dataUrl || ''));
  if (!m) return null;
  const ext = TYPES[m[1]], buf = Buffer.from(m[2], 'base64');
  if (!buf.length || buf.length > MAX_BYTES) return null;
  if (!MAGIC[ext].every((b, i) => buf[i] === b)) return null;
  return { ext, buf };
}

export function ambianceStore({ db, dataDir }) {
  const dir = join(dataDir, 'ambiance');
  mkdirSync(dir, { recursive: true });
  const meta = (r) => ({ id: r.id, nom: r.nom, largeur: r.largeur, hauteur: r.hauteur, couleur: r.couleur, created: r.created });
  const list = async () => (await db.all('SELECT * FROM ambiance_images ORDER BY created')).map(meta);
  const config = () => getSetting(db, 'ambiance', {});
  // Fichier d'une image (pleine taille ou miniature), quelle que soit son extension.
  function file(id, mini) {
    if (!/^[0-9a-f-]{36}$/.test(id)) return null;
    for (const ext of Object.values(TYPES)) {
      const p = join(dir, id + (mini ? '.mini.' : '.') + ext);
      if (existsSync(p)) return p;
    }
    return null;
  }
  return { dir, list, config, file };
}

export function ambianceApi({ db, store }) {
  const r = Router();

  r.get('/', async (req, res) => res.json({ config: await store.config(), images: await store.list(), canEdit: req.user.role === 'admin' }));

  r.put('/config', requireAdmin, async (req, res) => {
    const cfg = req.body;
    if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) return res.status(400).json({ error: 'Réglages invalides.' });
    if (JSON.stringify(cfg).length > 64 * 1024) return res.status(413).json({ error: 'Réglages trop volumineux.' });
    await setSetting(db, 'ambiance', cfg);
    res.json({ config: cfg });
  });

  r.post('/images', requireAdmin, async (req, res) => {
    const b = req.body || {};
    if ((await store.list()).length >= MAX_IMAGES) return res.status(400).json({ error: `Maximum ${MAX_IMAGES} images.` });
    const full = decodeImage(b.image), mini = decodeImage(b.mini);
    if (!full || !mini) return res.status(400).json({ error: 'Image illisible (JPG, PNG ou WebP, 12 Mo au plus).' });
    const id = randomUUID();
    writeFileSync(join(store.dir, `${id}.${full.ext}`), full.buf);
    writeFileSync(join(store.dir, `${id}.mini.${mini.ext}`), mini.buf);
    const row = {
      id, nom: String(b.nom || 'Image').slice(0, 80),
      largeur: Number(b.largeur) || null, hauteur: Number(b.hauteur) || null,
      couleur: /^#[0-9a-f]{6}$/i.test(b.couleur || '') ? b.couleur : null, created: new Date().toISOString(),
    };
    await db.run('INSERT INTO ambiance_images (id, nom, largeur, hauteur, couleur, created, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      row.id, row.nom, row.largeur, row.hauteur, row.couleur, row.created, req.user.id);
    res.status(201).json(row);
  });

  r.delete('/images/:id', requireAdmin, async (req, res) => {
    const info = await db.run('DELETE FROM ambiance_images WHERE id = ?', req.params.id);
    if (!info.changes) return res.status(404).json({ error: 'Image introuvable.' });
    for (const mini of [false, true]) { const p = store.file(req.params.id, mini); if (p) unlinkSync(p); }
    res.status(204).end();
  });

  return r;
}

// Fichiers image : /ambiance/images/:id (membres connectés) et /ambiance/connexion (fond de la page de connexion).
export function ambianceFiles({ store }) {
  const r = Router();
  r.get('/images/:id', (req, res) => {
    if (!req.user) return res.status(401).end();
    const p = store.file(req.params.id, req.query.taille === 'mini');
    if (!p) return res.status(404).end();
    res.set('Cache-Control', 'private, max-age=31536000, immutable');
    res.sendFile(p);
  });
  // Visible sans compte : seulement si l'administrateur l'a permis (Réglages › Ambiance › Page de connexion).
  r.get('/connexion', async (_req, res) => {
    const cfg = await store.config(), imgs = await store.list();
    if (cfg.connexion === false || !imgs.length) return res.status(404).end();
    const id = imgs.some((i) => i.id === cfg.vedette) ? cfg.vedette : imgs[imgs.length - 1].id;
    const p = store.file(id, false);
    if (!p) return res.status(404).end();
    res.set('Cache-Control', 'no-cache');
    res.sendFile(p);
  });
  return r;
}
