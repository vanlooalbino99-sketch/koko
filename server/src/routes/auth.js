// /api/auth : premier compte (administrateur), connexion, déconnexion, profil, mot de passe.
import { Router } from 'express';
import { tx } from '../db.js';
import { createSession, destroySession, setSessionCookie, clearSessionCookie, verifyPassword, hashPassword,
  requireUser, validateUserInput, createUser, publicUser } from '../auth.js';

export function authRoutes({ db, limiter, secureCookies }) {
  const r = Router();
  const userCount = () => db.prepare('SELECT COUNT(*) AS n FROM users').get().n;

  r.get('/state', (req, res) => res.json({ needsSetup: userCount() === 0, user: req.user || null }));

  // Premier lancement : la première personne crée le compte administrateur.
  r.post('/setup', (req, res) => {
    const { name, email, password } = req.body || {};
    const errors = validateUserInput({ name, email, password });
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });
    const user = tx(db, () => (userCount() === 0 ? createUser(db, { name, email, password, role: 'admin' }) : null));
    if (!user) return res.status(409).json({ error: 'Le compte administrateur existe déjà : connectez-vous.' });
    setSessionCookie(req, res, createSession(db, user.id), secureCookies);
    res.status(201).json({ user });
  });

  r.post('/login', (req, res) => {
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    const password = String((req.body || {}).password || '');
    if (limiter.blocked(req.ip, email)) return res.status(429).json({ error: 'Trop d’essais : réessayez dans un quart d’heure.' });
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!row || !verifyPassword(password, row.pass)) {
      limiter.fail(req.ip, email);
      return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
    }
    limiter.ok(req.ip, email);
    setSessionCookie(req, res, createSession(db, row.id), secureCookies);
    res.json({ user: publicUser(row) });
  });

  r.post('/logout', (req, res) => {
    destroySession(db, req.sessionToken);
    clearSessionCookie(res);
    res.status(204).end();
  });

  r.get('/me', requireUser, (req, res) => res.json({ user: req.user }));

  r.post('/password', requireUser, (req, res) => {
    const { current, next } = req.body || {};
    const row = db.prepare('SELECT pass FROM users WHERE id = ?').get(req.user.id);
    if (!verifyPassword(String(current || ''), row.pass)) return res.status(400).json({ error: 'Mot de passe actuel incorrect.' });
    const errors = validateUserInput({ password: next }, { partial: true });
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });
    db.prepare('UPDATE users SET pass = ? WHERE id = ?').run(hashPassword(next), req.user.id);
    res.status(204).end();
  });

  return r;
}
