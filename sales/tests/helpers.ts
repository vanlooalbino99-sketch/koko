import { connectPglite, type Db } from '../lib/db/client.ts';
import { getAuthContext, signUp, type AuthContext } from '../lib/auth/service.ts';

// Base Postgres en mémoire, migrée et avec le catalogue, propre à chaque fichier de test.
export async function testDb(): Promise<{ db: Db; close: () => Promise<void> }> {
  return connectPglite();
}

let n = 0;
export async function newUser(db: Db, name = 'Alice'): Promise<{ auth: AuthContext; token: string; email: string }> {
  const email = `${name.toLowerCase()}.${++n}.${process.pid}@example.com`;
  const res = await signUp(db, { name, email, password: 'motdepasse-solide', locale: 'fr' });
  if (!res.ok) throw new Error(res.error);
  const auth = await getAuthContext(db, res.token);
  if (!auth) throw new Error('session introuvable');
  return { auth, token: res.token, email };
}
