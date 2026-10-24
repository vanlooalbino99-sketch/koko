import { asc, eq } from 'drizzle-orm';
import type { AuthContext } from '../auth/service.ts';
import type { Db } from '../db/client.ts';
import { memberships, users } from '../db/schema.ts';
import { can } from '../domain.ts';

// Les membres d'une organisation ne sont visibles que par ses responsables.
export async function listMembers(db: Db, auth: AuthContext) {
  if (!can(auth.role, 'members:view')) return null;
  return db
    .select({ id: users.id, name: users.name, email: users.email, role: memberships.role, joinedAt: memberships.createdAt })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(eq(memberships.organizationId, auth.organization.id))
    .orderBy(asc(memberships.createdAt));
}
