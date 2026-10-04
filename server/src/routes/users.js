// /api/users (administrateurs) : membres de l'équipe.
import { Router } from 'express';
import { tx } from '../db.js';
import { createUser, publicUser, validateUserInput, hashPassword } from '../auth.js';

export function usersRoutes({ db }) {
  const r = Router();
  const admins = () => db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'").get().n;
  const byId = (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id);

  r.get('/', (_req, res) => {
    res.json({ users: db.prepare('SELECT * FROM users ORDER BY created_at').all().map(publicUser) });
  });

  r.post('/', (req, res) => {
    const { name, email, password, role = 'membre' } = req.body || {};
    const errors = validateUserInput({ name, email, password, role });
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });
    if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(String(email).trim().toLowerCase()))
      return res.status(409).json({ error: 'Un compte existe déjà avec cet e-mail.' });
    res.status(201).json({ user: createUser(db, { name, email, password, role }) });
  });

  r.patch('/:id', (req, res) => {
    const { name, role, password } = req.body || {};
    const errors = validateUserInput({ name, role, password }, { partial: true });
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });
    const out = tx(db, () => {
      const u = byId(req.params.id);
      if (!u) return { status: 404, error: 'Compte introuvable.' };
      if (role && u.role === 'admin' && role !== 'admin' && admins() <= 1) return { status: 400, error: 'Il faut garder au moins un administrateur.' };
      if (name !== undefined) db.prepare('UPDATE users SET name = ? WHERE id = ?').run(String(name).trim(), u.id);
      if (role !== undefined) db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, u.id);
      if (password !== undefined) {
        db.prepare('UPDATE users SET pass = ? WHERE id = ?').run(hashPassword(password), u.id);
        // Nouveau mot de passe : ses autres sessions sont fermées.
        if (u.id !== req.user.id) db.prepare('DELETE FROM sessions WHERE user_id = ?').run(u.id);
      }
      return { user: publicUser(byId(u.id)) };
    });
    if (out.error) return res.status(out.status).json({ error: out.error });
    res.json(out);
  });

  r.delete('/:id', (req, res) => {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte.' });
    const out = tx(db, () => {
      const u = byId(req.params.id);
      if (!u) return { status: 404, error: 'Compte introuvable.' };
      if (u.role === 'admin' && admins() <= 1) return { status: 400, error: 'Il faut garder au moins un administrateur.' };
      db.prepare('DELETE FROM users WHERE id = ?').run(u.id);
      return {};
    });
    if (out.error) return res.status(out.status).json({ error: out.error });
    res.status(204).end();
  });

  return r;
}
