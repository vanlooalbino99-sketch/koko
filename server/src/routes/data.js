// /api/data/:clé : données du CRM, partagées par l'équipe, versionnées.
// Le navigateur envoie la version sur laquelle il s'appuie ; si quelqu'un a enregistré entre-temps,
// le serveur fusionne (voir merge.js) et renvoie le résultat pour que l'écran se mette à jour.
import { Router } from 'express';
import { requireAdmin } from '../auth.js';
import { merge3, deepEqual, keepDeleted } from '../merge.js';

const KEY_RE = /^[a-zA-Z0-9._-]{1,64}$/;
const HISTORY_KEEP = 100;
const MAX_VALUE = 20 * 1024 * 1024;

function parse(s) { try { return JSON.parse(s); } catch { return undefined; } }

/** Clé des données du CRM (prospects, devis, tâches…) utilisée par l'application. */
export const DATA_KEY = 'blackstart-data-v1';

/** Enregistre une nouvelle version d'une clé et la garde dans l'historique (à appeler dans une transaction). */
export async function writeKv(db, key, value, version, userId) {
  const at = new Date().toISOString();
  await db.run(`INSERT INTO kv (key, value, version, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value, version = excluded.version, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
  key, value, version, at, userId);
  await db.run('INSERT INTO kv_history (key, version, value, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)', key, version, value, at, userId);
  await db.run('DELETE FROM kv_history WHERE key = ? AND version <= ?', key, version - HISTORY_KEEP);
}

export function dataRoutes({ db }) {
  const r = Router();
  const get = (key) => db.get('SELECT * FROM kv WHERE key = ?', key);
  const nameOf = async (id) => (id && (await db.get('SELECT name FROM users WHERE id = ?', id))?.name) || null;

  r.param('key', (req, res, next, key) => (KEY_RE.test(key) ? next() : res.status(400).json({ error: 'Clé invalide.' })));

  const write = (key, value, version, userId) => writeKv(db, key, value, version, userId);

  r.get('/:key', async (req, res) => {
    const row = await get(req.params.key);
    const version = row ? row.version : 0;
    if (req.query.since !== undefined && Number(req.query.since) === version) return res.json({ changed: false, version });
    res.json({ changed: true, value: row ? row.value : null, version, updatedAt: row?.updated_at || null, updatedBy: await nameOf(row?.updated_by) });
  });

  r.put('/:key', async (req, res) => {
    const { value, baseVersion } = req.body || {};
    if (typeof value !== 'string') return res.status(400).json({ error: 'Valeur attendue (texte).' });
    if (value.length > MAX_VALUE) return res.status(413).json({ error: 'Données trop volumineuses.' });
    const key = req.params.key, base = Number(baseVersion) || 0;
    const out = await db.tx(async () => {
      const cur = await get(key), curVersion = cur ? cur.version : 0;
      const mine = parse(value);
      if (cur && (cur.value === value || (mine !== undefined && deepEqual(mine, parse(cur.value))))) return { version: curVersion, merged: false };
      const theirs = cur ? parse(cur.value) : undefined;
      // Ce qui serait enregistré : la valeur envoyée, ou sa fusion si quelqu'un a enregistré entre-temps.
      let next = value, merged = false;
      if (cur && base !== curVersion && mine !== undefined && theirs !== undefined) {
        const baseRow = base > 0 ? await db.get('SELECT value FROM kv_history WHERE key = ? AND version = ?', key, base) : null;
        next = merge3(baseRow ? parse(baseRow.value) : undefined, mine, theirs);
        merged = true;
      } else if (mine !== undefined) next = mine;
      // Les suppressions sont réservées aux administrateurs : ce qu'un membre a retiré est remis à sa place.
      let refused = 0;
      if (req.user.role !== 'admin' && theirs !== undefined && typeof next !== 'string') {
        const kept = keepDeleted(theirs, next);
        if (kept.restored) { next = kept.value; refused = kept.restored; merged = true; }
      }
      if (merged && deepEqual(next, theirs)) return { version: curVersion, merged: true, value: cur.value, ...(refused && { refused }) };
      const text = !merged ? value : JSON.stringify(next);
      await write(key, text, curVersion + 1, req.user.id);
      return merged ? { version: curVersion + 1, merged: true, value: text, ...(refused && { refused }) } : { version: curVersion + 1, merged: false };
    });
    res.json(out);
  });

  // Historique des sauvegardes et restauration (administrateurs).
  r.get('/:key/history', requireAdmin, async (req, res) => {
    const rows = await db.all(`SELECT h.version, h.updated_at, length(h.value) AS size, u.name FROM kv_history h LEFT JOIN users u ON u.id = h.updated_by
                             WHERE h.key = ? ORDER BY h.version DESC LIMIT 60`, req.params.key);
    res.json({ history: rows.map((x) => ({ version: x.version, updatedAt: x.updated_at, updatedBy: x.name, size: x.size })) });
  });

  r.post('/:key/restore', requireAdmin, async (req, res) => {
    const version = Number((req.body || {}).version);
    const out = await db.tx(async () => {
      const old = await db.get('SELECT value FROM kv_history WHERE key = ? AND version = ?', req.params.key, version);
      if (!old) return null;
      const cur = await get(req.params.key);
      const next = (cur ? cur.version : 0) + 1;
      await write(req.params.key, old.value, next, req.user.id);
      return { version: next, value: old.value };
    });
    if (!out) return res.status(404).json({ error: 'Version introuvable.' });
    res.json(out);
  });

  return r;
}
