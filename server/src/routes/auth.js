// /api/auth : premier compte (administrateur), connexion, déconnexion, profil, mot de passe.
import { Router } from 'express';
import { createSession, destroySession, setSessionCookie, clearSessionCookie,
  requireUser, validateUserInput, insertUser, publicUser } from '../auth.js';

export function authRoutes({ db, identity, limiter, secureCookies }) {
  const r = Router();
  const userCount = async () => (await db.get('SELECT COUNT(*) AS n FROM users')).n;

  r.get('/state', async (req, res) => res.json({ needsSetup: (await userCount()) === 0, user: req.user || null }));

  // Premier lancement : la première personne crée le compte administrateur.
  r.post('/setup', async (req, res) => {
    const { name, email, password } = req.body || {};
    const errors = validateUserInput({ name, email, password });
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });
    const taken = () => res.status(409).json({ error: 'Le compte administrateur existe déjà : connectez-vous.' });
    if (await userCount()) return taken();
    const creds = await identity.create(db, { name, email, password });
    const user = await db.tx(async () => ((await userCount()) === 0 ? insertUser(db, { name, email, role: 'admin' }, creds) : null));
    if (!user) { await identity.remove({ auth_id: creds.authId }); return taken(); }
    setSessionCookie(req, res, await createSession(db, user.id), secureCookies);
    res.status(201).json({ user });
  });

  r.post('/login', async (req, res) => {
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    const password = String((req.body || {}).password || '');
    if (limiter.blocked(req.ip, email)) return res.status(429).json({ error: 'Trop d’essais : réessayez dans un quart d’heure.' });
    const row = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (!row || !(await identity.check(db, row, password))) {
      limiter.fail(req.ip, email);
      return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
    }
    limiter.ok(req.ip, email);
    setSessionCookie(req, res, await createSession(db, row.id), secureCookies);
    res.json({ user: publicUser(row) });
  });

  r.post('/logout', async (req, res) => {
    await destroySession(db, req.sessionToken);
    clearSessionCookie(res);
    res.status(204).end();
  });

  r.get('/me', requireUser, (req, res) => res.json({ user: req.user }));

  r.post('/password', requireUser, async (req, res) => {
    const { current, next } = req.body || {};
    const row = await db.get('SELECT * FROM users WHERE id = ?', req.user.id);
    if (!(await identity.check(db, row, String(current || '')))) return res.status(400).json({ error: 'Mot de passe actuel incorrect.' });
    const errors = validateUserInput({ password: next }, { partial: true });
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });
    await identity.setPassword(db, await db.get('SELECT * FROM users WHERE id = ?', req.user.id), next);
    res.status(204).end();
  });

  return r;
}
