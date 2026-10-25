import { randomBytes } from 'node:crypto';
import { and, asc, eq, gt, isNull, sql } from 'drizzle-orm';
import { z } from 'zod';
import { audit } from '../audit.ts';
import { hashToken, type AuthContext } from '../auth/service.ts';
import { orgLimits } from '../billing/credits.ts';
import { seatsInUse } from '../billing/service.ts';
import type { Db } from '../db/client.ts';
import { invitations, memberships, organizations, sessions, users } from '../db/schema.ts';
import { can, type Role } from '../domain.ts';
import { assignableRoles, TeamError } from './service.ts';

export const INVITATION_DAYS = 7;
const DAY = 24 * 60 * 60 * 1000;

export const InvitationSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()).pipe(z.string().max(254)),
  role: z.enum(['admin', 'manager', 'member']),
});
export type InvitationInput = z.infer<typeof InvitationSchema>;

// Jeton de 32 octets en base64url : 43 caractères.
const TOKEN_FORMAT = /^[\w-]{43}$/;

// Crée une invitation et renvoie le jeton à mettre dans le lien. Il n'est montré qu'une fois : la base
// n'en garde que l'empreinte. Une nouvelle invitation pour la même adresse remplace la précédente.
export async function createInvitation(db: Db, auth: AuthContext, input: InvitationInput, now = new Date()): Promise<string> {
  if (!can(auth.role, 'members:manage')) throw new TeamError('forbidden');
  if (!assignableRoles(auth.role).includes(input.role)) throw new TeamError('invalid_role');
  const token = randomBytes(32).toString('base64url');
  const organizationId = auth.organization.id;
  const invitationId = await db.transaction(async (tx) => {
    // Deux invitations simultanées ne doivent pas occuper le même dernier siège.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${organizationId}, 2))`);
    const [org] = await tx.select({ id: organizations.id, plan: organizations.plan }).from(organizations).where(eq(organizations.id, organizationId));
    const { limits } = await orgLimits(tx, org);
    if (!limits.teamSpace) throw new TeamError('plan_required');
    const [member] = await tx
      .select({ id: memberships.id })
      .from(memberships)
      .innerJoin(users, eq(users.id, memberships.userId))
      .where(and(eq(memberships.organizationId, organizationId), eq(users.email, input.email)))
      .limit(1);
    if (member) throw new TeamError('already_member');
    await tx
      .delete(invitations)
      .where(and(eq(invitations.organizationId, organizationId), eq(invitations.email, input.email), isNull(invitations.acceptedAt)));
    if ((await seatsInUse(tx, organizationId, now)) >= limits.seats) throw new TeamError('no_seat');
    const [row] = await tx
      .insert(invitations)
      .values({
        organizationId,
        email: input.email,
        role: input.role,
        tokenHash: hashToken(token),
        invitedBy: auth.user.id,
        expiresAt: new Date(now.getTime() + INVITATION_DAYS * DAY),
      })
      .returning({ id: invitations.id });
    return row.id;
  });
  await audit(db, {
    action: 'invitation.created',
    organizationId,
    actorUserId: auth.user.id,
    targetType: 'invitation',
    targetId: invitationId,
    metadata: { role: input.role },
  });
  return token;
}

// Invitations encore valables, pour les responsables de l'espace.
export async function listInvitations(db: Db, auth: AuthContext, now = new Date()) {
  if (!can(auth.role, 'members:view')) return [];
  return db
    .select({ id: invitations.id, email: invitations.email, role: invitations.role, expiresAt: invitations.expiresAt, createdAt: invitations.createdAt })
    .from(invitations)
    .where(and(eq(invitations.organizationId, auth.organization.id), isNull(invitations.acceptedAt), gt(invitations.expiresAt, now)))
    .orderBy(asc(invitations.createdAt));
}

export async function revokeInvitation(db: Db, auth: AuthContext, invitationId: string) {
  if (!can(auth.role, 'members:manage')) throw new TeamError('forbidden');
  const deleted = await db
    .delete(invitations)
    .where(and(eq(invitations.id, invitationId), eq(invitations.organizationId, auth.organization.id), isNull(invitations.acceptedAt)))
    .returning({ id: invitations.id });
  if (deleted.length === 0) throw new TeamError('not_found');
  await audit(db, { action: 'invitation.revoked', organizationId: auth.organization.id, actorUserId: auth.user.id, targetType: 'invitation', targetId: invitationId });
}

export type InvitationView = {
  status: 'valid' | 'expired' | 'used';
  organizationName: string;
  email: string;
  role: Role;
  inviterName: string | null;
};

// Ce que la page d'invitation montre à la personne qui a le lien.
export async function inspectInvitation(db: Db, token: string, now = new Date()): Promise<InvitationView | null> {
  if (!TOKEN_FORMAT.test(token)) return null;
  const [row] = await db
    .select({
      email: invitations.email,
      role: invitations.role,
      expiresAt: invitations.expiresAt,
      acceptedAt: invitations.acceptedAt,
      organizationName: organizations.name,
      inviterName: users.name,
    })
    .from(invitations)
    .innerJoin(organizations, eq(organizations.id, invitations.organizationId))
    .leftJoin(users, eq(users.id, invitations.invitedBy))
    .where(eq(invitations.tokenHash, hashToken(token)))
    .limit(1);
  if (!row) return null;
  return {
    status: row.acceptedAt ? 'used' : row.expiresAt <= now ? 'expired' : 'valid',
    organizationName: row.organizationName,
    email: row.email,
    role: row.role as Role,
    inviterName: row.inviterName,
  };
}

// Accepte une invitation avec le compte connecté, qui doit porter l'adresse invitée. La session passe
// dans l'espace rejoint. Renvoie l'organisation.
export async function acceptInvitation(db: Db, auth: AuthContext, token: string, now = new Date()): Promise<string> {
  if (!TOKEN_FORMAT.test(token)) throw new TeamError('not_found');
  const result = await db.transaction(async (tx) => {
    const [invitation] = await tx
      .select()
      .from(invitations)
      .where(eq(invitations.tokenHash, hashToken(token)))
      .limit(1)
      .for('update');
    if (!invitation) throw new TeamError('not_found');
    if (invitation.acceptedAt) throw new TeamError('used');
    if (invitation.expiresAt <= now) throw new TeamError('expired');
    if (invitation.email !== auth.user.email) throw new TeamError('wrong_account');
    const [org] = await tx
      .select({ id: organizations.id, plan: organizations.plan })
      .from(organizations)
      .where(eq(organizations.id, invitation.organizationId));
    // L'équipe a quitté l'offre Équipe depuis l'envoi du lien.
    if (!(await orgLimits(tx, org)).limits.teamSpace) throw new TeamError('plan_required');
    await tx
      .insert(memberships)
      .values({ organizationId: org.id, userId: auth.user.id, role: invitation.role })
      .onConflictDoNothing({ target: [memberships.organizationId, memberships.userId] });
    await tx.update(invitations).set({ acceptedAt: now, acceptedBy: auth.user.id }).where(eq(invitations.id, invitation.id));
    await tx.update(sessions).set({ organizationId: org.id }).where(eq(sessions.id, auth.sessionId));
    return { organizationId: org.id, invitationId: invitation.id, role: invitation.role };
  });
  await audit(db, {
    action: 'invitation.accepted',
    organizationId: result.organizationId,
    actorUserId: auth.user.id,
    targetType: 'invitation',
    targetId: result.invitationId,
    metadata: { role: result.role },
  });
  return result.organizationId;
}
