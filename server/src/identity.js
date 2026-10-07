// Mots de passe : vérifiés par le serveur lui-même (empreinte scrypt en base) ou par Supabase Auth.
// Avec Supabase, chaque membre a un compte Supabase Auth (users.auth_id) ; le serveur garde ses propres
// sessions (cookie HttpOnly), Supabase ne sert qu'à vérifier et changer les mots de passe.
// Les comptes créés avant le passage à Supabase y sont recopiés à leur première connexion réussie.
import { hashPassword, verifyPassword } from './auth.js';

export const SUPABASE_PASS = 'supabase'; // users.pass d'un compte dont le mot de passe est chez Supabase

export function localIdentity() {
  return {
    kind: 'local',
    async check(_db, row, password) { return verifyPassword(password, row.pass); },
    async create(_db, { password }) { return { pass: hashPassword(password), authId: null }; },
    async setPassword(db, row, password) { await db.run('UPDATE users SET pass = ? WHERE id = ?', hashPassword(password), row.id); },
    async remove() {},
  };
}

export function supabaseIdentity({ url, serviceKey, fetch: f = fetch }) {
  const base = String(url).replace(/\/+$/, '') + '/auth/v1';
  async function call(method, path, body) {
    const res = await f(base + path, {
      method,
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }
  const fail = (what, r) => Object.assign(new Error(`Supabase Auth (${what}) : ${r.data?.msg || r.data?.message || r.data?.error_description || r.status}`), { status: 502 });
  const signIn = (email, password) => call('POST', '/token?grant_type=password', { email, password });

  async function createAuth(email, password, name) {
    const r = await call('POST', '/admin/users', { email, password, email_confirm: true, user_metadata: { name } });
    if (r.ok) return r.data.id;
    // Déjà inscrit chez Supabase (copie précédente) : on le retrouve en se connectant avec ce mot de passe.
    if (r.status === 422 || r.status === 409) {
      const s = await signIn(email, password);
      if (s.ok && s.data.user?.id) {
        await call('PUT', `/admin/users/${s.data.user.id}`, { password });
        return s.data.user.id;
      }
    }
    throw fail('création du compte', r);
  }

  return {
    kind: 'supabase',
    async check(db, row, password) {
      if (row.auth_id) {
        const r = await signIn(row.email, password);
        if (r.ok) return true;
        if (r.status === 400 || r.status === 401 || r.status === 422) return false;
        throw fail('connexion', r);
      }
      // Compte d'avant Supabase : mot de passe vérifié ici, puis compte recopié chez Supabase.
      if (!verifyPassword(password, row.pass)) return false;
      const id = await createAuth(row.email, password, row.name);
      await db.run('UPDATE users SET auth_id = ?, pass = ? WHERE id = ?', id, SUPABASE_PASS, row.id);
      return true;
    },
    async create(_db, { email, password, name }) {
      return { pass: SUPABASE_PASS, authId: await createAuth(String(email).trim().toLowerCase(), password, String(name).trim()) };
    },
    async setPassword(db, row, password) {
      if (!row.auth_id) {
        const id = await createAuth(row.email, password, row.name);
        await db.run('UPDATE users SET auth_id = ?, pass = ? WHERE id = ?', id, SUPABASE_PASS, row.id);
        return;
      }
      const r = await call('PUT', `/admin/users/${row.auth_id}`, { password });
      if (!r.ok) throw fail('mot de passe', r);
    },
    async remove(row) {
      if (!row.auth_id) return;
      const r = await call('DELETE', `/admin/users/${row.auth_id}`);
      if (!r.ok && r.status !== 404) console.error(fail('suppression du compte', r).message);
    },
  };
}
