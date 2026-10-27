// /api/equipe : les simulations IA de chacun (envoyées par la page Simulations IA) et la vue d'ensemble de
// l'équipe affichée sur l'accueil des administrateurs : membres, simulations, formation, messages, requêtes Claude.
// Rien que des chiffres et des titres : ni le contenu des messages ni les transcriptions des appels.
import { Router } from 'express';

const FAMILLES = ['prospection', 'decouverte', 'objections', 'closing', 'relance', 'autre'];
const JOUR = 86400000;

export function equipeRoutes({ db }) {
  const r = Router();

  // Une simulation terminée, note sur 100. L'identifiant (membre + moment) évite les doublons quand
  // l'historique de l'appareil est envoyé une deuxième fois.
  r.post('/simulations', async (req, res) => {
    const b = req.body || {};
    const note = Number(b.note), duree = Math.round(Number(b.duree) || 0);
    if (!Number.isInteger(note) || note < 0 || note > 100) return res.status(400).json({ error: 'Note invalide.' });
    const at = b.at ? new Date(b.at) : new Date();
    if (isNaN(at) || at.getTime() > Date.now() + 60000 || at.getTime() < Date.now() - 400 * JOUR) return res.status(400).json({ error: 'Date invalide.' });
    const famille = FAMILLES.includes(b.famille) ? b.famille : 'autre';
    const titre = String(b.titre || '').replace(/\s+/g, ' ').trim().slice(0, 120) || 'Simulation';
    const iso = at.toISOString();
    await db.run(`INSERT INTO simulations (id, user_id, famille, titre, note, duree, ia, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                  ON CONFLICT (id) DO NOTHING`,
      req.user.id + ':' + iso, req.user.id, famille, titre, note, Math.max(0, Math.min(7200, duree)), b.ia ? 1 : 0, iso);
    res.status(201).json({ ok: true });
  });

  // Vue d'ensemble : 60 derniers jours (la période et la précédente, pour les évolutions).
  r.get('/apercu', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Réservé aux administrateurs.' });
    const depuis = new Date(Date.now() - 60 * JOUR).toISOString();
    const mois = new Date(); mois.setUTCDate(1); mois.setUTCHours(0, 0, 0, 0);
    const moisAvant = new Date(mois); moisAvant.setUTCMonth(moisAvant.getUTCMonth() - 1);
    const [users, photos, sims, formation, msgs, ia] = await Promise.all([
      db.all('SELECT id, name, role, poste, manager_id, created_at, last_login FROM users ORDER BY created_at'),
      db.all('SELECT user_id, updated_at FROM user_photos'),
      db.all('SELECT user_id, famille, titre, note, duree, ia, created_at FROM simulations WHERE created_at >= ? ORDER BY created_at DESC LIMIT 5000', depuis),
      db.all('SELECT user_id, module, vu_at, quiz FROM formation'),
      db.all("SELECT user_id, substr(created_at, 1, 10) AS jour, COUNT(*) AS n FROM chat_messages WHERE kind = 'texte' AND user_id IS NOT NULL AND created_at >= ? GROUP BY user_id, substr(created_at, 1, 10)", depuis),
      db.all('SELECT created_at FROM ia_usage WHERE created_at >= ?', moisAvant.toISOString()),
    ]);
    const photo = Object.fromEntries(photos.map((p) => [p.user_id, '/api/photos/' + encodeURIComponent(p.user_id) + '?v=' + encodeURIComponent(p.updated_at)]));
    const debutMois = mois.toISOString();
    res.json({
      membres: users.map((u) => ({ id: u.id, name: u.name, role: u.role, poste: u.poste || '', managerId: u.manager_id || null, creeLe: u.created_at, connexion: u.last_login || null, photo: photo[u.id] || null })),
      simulations: sims.map((s) => ({ userId: s.user_id, famille: s.famille, titre: s.titre, note: Number(s.note), duree: Number(s.duree), ia: !!Number(s.ia), at: s.created_at })),
      formation: formation.map((f) => ({ userId: f.user_id, module: f.module, vuLe: f.vu_at || null, quiz: f.quiz == null ? null : Number(f.quiz) })),
      messages: msgs.map((m) => ({ userId: m.user_id, jour: m.jour, n: Number(m.n) })),
      ia: { mois: ia.filter((x) => x.created_at >= debutMois).length, moisPrecedent: ia.filter((x) => x.created_at < debutMois).length },
    });
  });

  return r;
}
