import { randomBytes } from 'node:crypto';
import { connectPglite, type Db } from '../lib/db/client.ts';
import { getAuthContext, hashToken, signUp, type AuthContext } from '../lib/auth/service.ts';
import { memberships, sessions } from '../lib/db/schema.ts';
import type { Role } from '../lib/domain.ts';

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

// Un nouveau compte qui rejoint une organisation existante avec un rôle donné, et sa session dans celle-ci.
export async function joinOrg(db: Db, organizationId: string, role: Role, name = 'Membre'): Promise<AuthContext> {
  const { auth } = await newUser(db, name);
  await db.insert(memberships).values({ organizationId, userId: auth.user.id, role });
  const token = randomBytes(24).toString('base64url');
  await db.insert(sessions).values({ tokenHash: hashToken(token), userId: auth.user.id, organizationId, expiresAt: new Date(Date.now() + 86_400_000) });
  return (await getAuthContext(db, token))!;
}
