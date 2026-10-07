// Comptes et sessions : mots de passe hachés (scrypt), jeton de session aléatoire dans un cookie HttpOnly
// (seule son empreinte SHA-256 est en base), protection CSRF par en-tête, limitation des essais de connexion.
import { randomBytes, scryptSync, timingSafeEqual, createHash, randomUUID } from 'node:crypto';

export const COOKIE = 'bs_session';
const SESSION_DAYS = 30;
const SCRYPT = { N: 16384, r: 8, p: 1 };

export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(String(password), salt, 64, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, N, r, p, salt, hash] = parts;
  const expected = Buffer.from(hash, 'base64');
  const got = scryptSync(String(password), Buffer.from(salt, 'base64'), expected.length, { N: +N, r: +r, p: +p });
  return got.length === expected.length && timingSafeEqual(got, expected);
}

const sha = (s) => createHash('sha256').update(s).digest('hex');
const now = () => new Date().toISOString();

export async function createSession(db, userId) {
  const token = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
  await db.run('INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)', sha(token), userId, now(), expires);
  await db.run('UPDATE users SET last_login = ? WHERE id = ?', now(), userId);
  // Ménage : sessions expirées.
  await db.run('DELETE FROM sessions WHERE expires_at < ?', now());
  return token;
}

export async function destroySession(db, token) {
  if (token) await db.run('DELETE FROM sessions WHERE token_hash = ?', sha(token));
}

export async function sessionUser(db, token) {
  if (!token) return null;
  const row = await db.get(`SELECT u.id, u.email, u.name, u.role, u.poste, s.expires_at, p.updated_at AS photo FROM sessions s JOIN users u ON u.id = s.user_id
                            LEFT JOIN user_photos p ON p.user_id = u.id WHERE s.token_hash = ? AND s.expires_at > ?`, sha(token), now());
  if (!row) return null;
  // Session glissante : prolongée quand on s'en sert, si elle a plus de la moitié de son âge.
  if (Date.parse(row.expires_at) - Date.now() < (SESSION_DAYS / 2) * 864e5) {
    await db.run('UPDATE sessions SET expires_at = ? WHERE token_hash = ?', new Date(Date.now() + SESSION_DAYS * 864e5).toISOString(), sha(token));
  }
  return { id: row.id, email: row.email, name: row.name, role: row.role, poste: row.poste || null, photo: row.photo || null };
}

export function parseCookies(header) {
  const out = {};
  String(header || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i > 0) {
      const k = part.slice(0, i).trim();
      try { out[k] = decodeURIComponent(part.slice(i + 1).trim()); } catch { /* cookie illisible : ignoré */ }
    }
  });
  return out;
}

export function setSessionCookie(req, res, token, secureCookies) {
  const secure = secureCookies || req.secure;
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure ? '; Secure' : ''}`);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

// ---------------------------------------------------------------- intergiciels
export function attachUser(db) {
  return async (req, _res, next) => {
    req.sessionToken = parseCookies(req.headers.cookie)[COOKIE] || '';
    req.user = await sessionUser(db, req.sessionToken);
    next();
  };
}

export function requireUser(req, res, next) {
  if (req.user) return next();
  res.status(401).json({ error: 'Session expirée : reconnectez-vous.' });
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Session expirée : reconnectez-vous.' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Réservé aux administrateurs.' });
  next();
}

// Toute écriture sur l'API doit porter l'en-tête X-Requested-With: blackstart. Un formulaire ou une image
// d'un autre site ne peut pas l'ajouter : c'est la protection contre les requêtes intersites (CSRF).
export function csrfGuard(req, res, next) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  if (req.get('X-Requested-With') === 'blackstart') return next();
  res.status(403).json({ error: 'Requête refusée (en-tête de sécurité manquant).' });
}

// Limitation des essais de connexion : 10 échecs par quart d'heure, par adresse IP et par e-mail.
export function loginLimiter({ max = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const hits = new Map();
  const key = (k) => {
    const t = Date.now(), h = hits.get(k);
    if (!h || h.reset < t) { const n = { count: 0, reset: t + windowMs }; hits.set(k, n); return n; }
    return h;
  };
  return {
    blocked(ip, email) { return key('ip:' + ip).count >= max || key('mail:' + email).count >= max; },
    fail(ip, email) { key('ip:' + ip).count++; key('mail:' + email).count++; },
    ok(ip, email) { hits.delete('ip:' + ip); hits.delete('mail:' + email); },
  };
}

// ---------------------------------------------------------------- comptes
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUserInput({ name, email, password, role }, { partial = false } = {}) {
  const errors = [];
  if (!partial || name !== undefined) if (!String(name || '').trim() || String(name).trim().length > 80) errors.push('Nom requis (80 caractères au plus).');
  if (!partial || email !== undefined) if (!EMAIL_RE.test(String(email || '').trim())) errors.push('Adresse e-mail invalide.');
  if (!partial || password !== undefined) if (String(password || '').length < 8) errors.push('Mot de passe : 8 caractères au moins.');
  if (role !== undefined && !['admin', 'membre'].includes(role)) errors.push('Rôle inconnu.');
  return errors;
}

// identity : mots de passe vérifiés ici ou par Supabase Auth (voir identity.js). Sans lui, empreinte locale.
export async function createUser(db, input, identity) {
  const creds = identity ? await identity.create(db, input) : { pass: hashPassword(input.password), authId: null };
  return insertUser(db, input, creds);
}

export async function insertUser(db, { name, email, role }, { pass, authId }) {
  const id = randomUUID();
  await db.run('INSERT INTO users (id, email, name, role, pass, created_at, auth_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    id, String(email).trim().toLowerCase(), String(name).trim(), role || 'membre', pass, now(), authId || null);
  return publicUser(await db.get('SELECT * FROM users WHERE id = ?', id));
}

export function publicUser(u) {
  return u && { id: u.id, email: u.email, name: u.name, role: u.role, poste: u.poste || null, managerId: u.manager_id || null, createdAt: u.created_at, lastLogin: u.last_login || null };
}
