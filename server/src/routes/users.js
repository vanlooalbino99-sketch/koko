// /api/users (administrateurs) : membres de l'équipe.
import { Router } from 'express';
import { createUser, publicUser, validateUserInput } from '../auth.js';

export function usersRoutes({ db, identity, hub }) {
  const r = Router();
  const admins = async () => (await db.get("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'")).n;
  const byId = (id) => db.get('SELECT * FROM users WHERE id = ?', id);

  r.get('/', async (_req, res) => {
    res.json({ users: (await db.all('SELECT * FROM users ORDER BY created_at')).map(publicUser) });
  });

  r.post('/', async (req, res) => {
    const { name, email, password, role = 'membre' } = req.body || {};
    const errors = validateUserInput({ name, email, password, role });
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });
    if (await db.get('SELECT 1 FROM users WHERE email = ?', String(email).trim().toLowerCase()))
      return res.status(409).json({ error: 'Un compte existe déjà avec cet e-mail.' });
    res.status(201).json({ user: await createUser(db, { name, email, password, role }, identity) });
  });

  r.patch('/:id', async (req, res) => {
    const { name, role, password, poste, managerId } = req.body || {};
    const errors = validateUserInput({ name, role, password }, { partial: true });
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });
    const out = await db.tx(async () => {
      const u = await byId(req.params.id);
      if (!u) return { status: 404, error: 'Compte introuvable.' };
      if (role && u.role === 'admin' && role !== 'admin' && (await admins()) <= 1) return { status: 400, error: 'Il faut garder au moins un administrateur.' };
      if (name !== undefined) await db.run('UPDATE users SET name = ? WHERE id = ?', String(name).trim(), u.id);
      if (role !== undefined) await db.run('UPDATE users SET role = ? WHERE id = ?', role, u.id);
      if (poste !== undefined) await db.run('UPDATE users SET poste = ? WHERE id = ?', String(poste || '').trim().replace(/\s+/g, ' ').slice(0, 60) || null, u.id);
      if (managerId !== undefined) {
        const m = managerId ? await byId(String(managerId)) : null;
        if (managerId && !m) return { status: 400, error: 'Responsable introuvable.' };
        // Pas de boucle : le responsable choisi ne peut pas être sous cette personne.
        for (let x = m; x; x = x.manager_id ? await byId(x.manager_id) : null) if (x.id === u.id) return { status: 400, error: 'Ce responsable fait déjà partie de son équipe.' };
        await db.run('UPDATE users SET manager_id = ? WHERE id = ?', m ? m.id : null, u.id);
      }
      return { user: u };
    });
    if (out.error) return res.status(out.status).json({ error: out.error });
    // Mot de passe changé hors transaction (Supabase Auth est appelé par le réseau).
    if (password !== undefined) {
      await identity.setPassword(db, await byId(out.user.id), password);
      // Nouveau mot de passe : ses autres sessions sont fermées.
      if (out.user.id !== req.user.id) await db.run('DELETE FROM sessions WHERE user_id = ?', out.user.id);
    }
    // Organigramme et messagerie des autres membres à jour sans recharger.
    if (hub) hub.send((await db.all('SELECT id FROM users')).map((x) => x.id), 'equipe', {});
    res.json({ user: publicUser(await byId(out.user.id)) });
  });

  r.delete('/:id', async (req, res) => {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte.' });
    const out = await db.tx(async () => {
      const u = await byId(req.params.id);
      if (!u) return { status: 404, error: 'Compte introuvable.' };
      if (u.role === 'admin' && (await admins()) <= 1) return { status: 400, error: 'Il faut garder au moins un administrateur.' };
      await db.run('DELETE FROM users WHERE id = ?', u.id);
      return { user: u };
    });
    if (out.error) return res.status(out.status).json({ error: out.error });
    await identity.remove(out.user);
    res.status(204).end();
  });

  return r;
}
