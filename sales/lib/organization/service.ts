import { and, asc, count, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { audit } from '../audit.ts';
import type { AuthContext } from '../auth/service.ts';
import type { Db } from '../db/client.ts';
import { memberships, missions, organizations, sessions, users } from '../db/schema.ts';
import { can, type Role } from '../domain.ts';

export type TeamErrorCode =
  | 'forbidden'
  | 'plan_required'
  | 'no_seat'
  | 'already_member'
  | 'invalid_role'
  | 'invalid_date'
  | 'not_found'
  | 'expired'
  | 'used'
  | 'wrong_account';

export class TeamError extends Error {
  readonly code: TeamErrorCode;
  constructor(code: TeamErrorCode) {
    super(code);
    this.code = code;
  }
}

// Rôles qu'un membre peut donner. Seul le propriétaire nomme des administrateurs ; personne ne devient
// propriétaire par l'application.
export function assignableRoles(actor: Role): Role[] {
  if (actor === 'owner') return ['admin', 'manager', 'member'];
  if (actor === 'admin') return ['manager', 'member'];
  return [];
}

// Un membre peut-il modifier le rôle d'un autre ou le retirer de l'équipe ?
export function canManageMember(actor: { id: string; role: Role }, target: { id: string; role: Role }): boolean {
  if (actor.id === target.id || !can(actor.role, 'members:manage')) return false;
  if (target.role === 'owner') return false;
  return actor.role === 'owner' || target.role !== 'admin';
}

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

// Espaces dont la personne est membre, pour passer de l'un à l'autre.
export async function listMyOrganizations(db: Db, userId: string) {
  return db
    .select({ id: organizations.id, name: organizations.name, kind: organizations.kind, role: memberships.role })
    .from(memberships)
    .innerJoin(organizations, eq(organizations.id, memberships.organizationId))
    .where(eq(memberships.userId, userId))
    .orderBy(desc(sql`${organizations.kind} = 'team'`), asc(memberships.createdAt));
}

// Change l'espace actif de la session en cours, si la personne en est membre.
export async function switchOrganization(db: Db, auth: AuthContext, organizationId: string): Promise<boolean> {
  const [membership] = await db
    .select({ id: memberships.id })
    .from(memberships)
    .where(and(eq(memberships.userId, auth.user.id), eq(memberships.organizationId, organizationId)))
    .limit(1);
  if (!membership) return false;
  await db.update(sessions).set({ organizationId }).where(eq(sessions.id, auth.sessionId));
  return true;
}

export const OrganizationNameSchema = z.string().trim().min(2).max(80);

export async function renameOrganization(db: Db, auth: AuthContext, name: string) {
  if (!can(auth.role, 'organization:edit')) throw new TeamError('forbidden');
  await db.update(organizations).set({ name, updatedAt: new Date() }).where(eq(organizations.id, auth.organization.id));
  await audit(db, { action: 'organization.renamed', organizationId: auth.organization.id, actorUserId: auth.user.id });
}

async function memberOf(db: Db, organizationId: string, userId: string) {
  const [row] = await db
    .select({ id: memberships.userId, role: memberships.role })
    .from(memberships)
    .where(and(eq(memberships.organizationId, organizationId), eq(memberships.userId, userId)))
    .limit(1);
  return row ? { id: row.id, role: row.role as Role } : null;
}

export async function changeMemberRole(db: Db, auth: AuthContext, userId: string, role: Role) {
  const target = await memberOf(db, auth.organization.id, userId);
  if (!target) throw new TeamError('not_found');
  if (!canManageMember({ id: auth.user.id, role: auth.role }, target)) throw new TeamError('forbidden');
  if (!assignableRoles(auth.role).includes(role)) throw new TeamError('invalid_role');
  await db
    .update(memberships)
    .set({ role })
    .where(and(eq(memberships.organizationId, auth.organization.id), eq(memberships.userId, userId)));
  await audit(db, {
    action: 'member.role_changed',
    organizationId: auth.organization.id,
    actorUserId: auth.user.id,
    targetType: 'user',
    targetId: userId,
    metadata: { from: target.role, to: role },
  });
}

// Retire un membre : ses sessions dans cet espace et ses missions en cours disparaissent, son historique
// d'appels reste rattaché à l'organisation.
export async function removeMember(db: Db, auth: AuthContext, userId: string) {
  const target = await memberOf(db, auth.organization.id, userId);
  if (!target) throw new TeamError('not_found');
  if (!canManageMember({ id: auth.user.id, role: auth.role }, target)) throw new TeamError('forbidden');
  await detach(db, auth.organization.id, userId);
  await audit(db, {
    action: 'member.removed',
    organizationId: auth.organization.id,
    actorUserId: auth.user.id,
    targetType: 'user',
    targetId: userId,
  });
}

// Quitter un espace d'équipe. Le propriétaire ne peut pas partir, et personne ne quitte son seul espace.
export async function leaveOrganization(db: Db, auth: AuthContext): Promise<string> {
  if (auth.role === 'owner') throw new TeamError('forbidden');
  const others = (await listMyOrganizations(db, auth.user.id)).filter((o) => o.id !== auth.organization.id);
  if (others.length === 0) throw new TeamError('forbidden');
  await detach(db, auth.organization.id, auth.user.id, auth.sessionId);
  await db.update(sessions).set({ organizationId: others[0].id }).where(eq(sessions.id, auth.sessionId));
  await audit(db, { action: 'member.left', organizationId: auth.organization.id, actorUserId: auth.user.id });
  return others[0].id;
}

async function detach(db: Db, organizationId: string, userId: string, keepSession?: string) {
  await db.transaction(async (tx) => {
    await tx.delete(memberships).where(and(eq(memberships.organizationId, organizationId), eq(memberships.userId, userId)));
    await tx.delete(missions).where(and(eq(missions.organizationId, organizationId), eq(missions.assigneeId, userId)));
    const mine = and(eq(sessions.organizationId, organizationId), eq(sessions.userId, userId));
    await tx.delete(sessions).where(keepSession ? and(mine, sql`${sessions.id} <> ${keepSession}`) : mine);
  });
}

export async function memberCount(db: Db, organizationId: string): Promise<number> {
  const [row] = await db.select({ n: count() }).from(memberships).where(eq(memberships.organizationId, organizationId));
  return row.n;
}
