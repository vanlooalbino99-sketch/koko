// /api/formation : progression des formations (modules vus, score au quiz), par membre.
// Chacun voit la sienne ; les administrateurs voient aussi celle de toute l'équipe.
import { Router } from 'express';

const MODULE_RE = /^\d{2}-[a-z0-9-]{1,60}$/;

export function formationRoutes({ db }) {
  const r = Router();
  const rowsOf = (userId) => db.prepare('SELECT module, vu_at, quiz FROM formation WHERE user_id = ?').all(userId);
  const toMap = (rows) => Object.fromEntries(rows.map((x) => [x.module, { vu: !!x.vu_at, vuLe: x.vu_at, quiz: x.quiz }]));

  r.get('/', (req, res) => {
    const out = { mine: toMap(rowsOf(req.user.id)) };
    if (req.user.role === 'admin') {
      const users = db.prepare('SELECT id, name FROM users ORDER BY created_at').all();
      out.equipe = users.map((u) => ({ id: u.id, name: u.name, modules: toMap(rowsOf(u.id)) }));
    }
    res.json(out);
  });

  r.put('/:module', (req, res) => {
    const mod = req.params.module;
    if (!MODULE_RE.test(mod)) return res.status(400).json({ error: 'Module inconnu.' });
    const { vu, quiz } = req.body || {};
    const q = quiz === undefined || quiz === null ? null : Number(quiz);
    if (q !== null && !(Number.isInteger(q) && q >= 0 && q <= 10)) return res.status(400).json({ error: 'Score invalide.' });
    const now = new Date().toISOString();
    // Le meilleur score est gardé ; « vu » ne se perd pas.
    db.prepare(`INSERT INTO formation (user_id, module, vu_at, quiz) VALUES (?, ?, ?, ?)
                ON CONFLICT(user_id, module) DO UPDATE SET
                  vu_at = COALESCE(formation.vu_at, excluded.vu_at),
                  quiz = CASE WHEN excluded.quiz IS NULL THEN formation.quiz WHEN formation.quiz IS NULL THEN excluded.quiz ELSE MAX(formation.quiz, excluded.quiz) END`)
      .run(req.user.id, mod, vu ? now : null, q);
    res.json({ module: mod, ...toMap(rowsOf(req.user.id))[mod] });
  });

  return r;
}
