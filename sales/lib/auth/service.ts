import { createHash, randomBytes } from 'node:crypto';
import { and, asc, desc, eq, gt, lt, sql } from 'drizzle-orm';
import { z } from 'zod';
import { audit } from '../audit.ts';
import type { Db } from '../db/client.ts';
import { memberships, organizations, sessions, users } from '../db/schema.ts';
import { LOCALES, isOneOf, type Locale, type Role } from '../domain.ts';
import { DUMMY_HASH, hashPassword, verifyPassword } from './password.ts';

export const SESSION_DAYS = 30;
const DAY = 24 * 60 * 60 * 1000;

export const SignUpSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().pipe(z.email()).pipe(z.string().max(254)),
  password: z.string().min(10).max(200),
  locale: z.enum(LOCALES),
});
export type SignUpInput = z.infer<typeof SignUpSchema>;

export const LogInSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(200),
});

export type AuthContext = {
  sessionId: string;
  user: { id: string; name: string; email: string; locale: Locale; isPlatformAdmin: boolean };
  organization: { id: string; name: string; kind: string; plan: string };
  role: Role;
};

// Comptes de l'éditeur (page des coûts de la plateforme) : PLATFORM_ADMIN_EMAILS, séparés par des virgules.
function platformAdminEmails(): string[] {
  return (process.env.PLATFORM_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

async function createSession(db: Db | Tx, userId: string, organizationId: string): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  await db.insert(sessions).values({
    tokenHash: hashToken(token),
    userId,
    organizationId,
    expiresAt: new Date(Date.now() + SESSION_DAYS * DAY),
  });
  return token;
}

type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

export async function signUp(
  db: Db,
  input: SignUpInput,
): Promise<{ ok: true; token: string; userId: string } | { ok: false; error: 'email_taken' }> {
  const passwordHash = await hashPassword(input.password);
  try {
    return await db.transaction(async (tx) => {
      const [taken] = await tx.select({ id: users.id }).from(users).where(eq(users.email, input.email)).limit(1);
      if (taken) return { ok: false as const, error: 'email_taken' as const };
      const [user] = await tx
        .insert(users)
        .values({ email: input.email, name: input.name, passwordHash, locale: input.locale })
        .returning({ id: users.id });
      const [org] = await tx
        .insert(organizations)
        .values({ name: input.name, kind: 'personal' })
        .returning({ id: organizations.id });
      await tx.insert(memberships).values({ organizationId: org.id, userId: user.id, role: 'owner' });
      const token = await createSession(tx, user.id, org.id);
      await audit(tx, { action: 'user.signup', organizationId: org.id, actorUserId: user.id, targetType: 'user', targetId: user.id });
      return { ok: true as const, token, userId: user.id };
    });
  } catch (err) {
    // Deux inscriptions simultanées avec le même e-mail : la contrainte d'unicité tranche.
    if (err instanceof Error && /users_email_key/.test(err.message + String((err as { cause?: unknown }).cause))) {
      return { ok: false, error: 'email_taken' };
    }
    throw err;
  }
}

export async function logIn(db: Db, email: string, password: string): Promise<{ token: string; userId: string } | null> {
  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) return null;
  // Espace actif : celui d'une équipe s'il y en a un (on y a été invité pour s'y entraîner), sinon le premier rejoint.
  const [membership] = await db
    .select({ organizationId: memberships.organizationId })
    .from(memberships)
    .innerJoin(organizations, eq(organizations.id, memberships.organizationId))
    .where(eq(memberships.userId, user.id))
    .orderBy(desc(sql`${organizations.kind} = 'team'`), asc(memberships.createdAt))
    .limit(1);
  if (!membership) return null;
  const token = await createSession(db, user.id, membership.organizationId);
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  await audit(db, { action: 'user.login', organizationId: membership.organizationId, actorUserId: user.id });
  return { token, userId: user.id };
}

export async function getAuthContext(db: Db, token: string | undefined): Promise<AuthContext | null> {
  if (!token || token.length > 100) return null;
  const now = new Date();
  const [row] = await db
    .select({
      sessionId: sessions.id,
      user: { id: users.id, name: users.name, email: users.email, locale: users.locale, isPlatformAdmin: users.isPlatformAdmin },
      organization: { id: organizations.id, name: organizations.name, kind: organizations.kind, plan: organizations.plan },
      role: memberships.role,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .innerJoin(organizations, eq(organizations.id, sessions.organizationId))
    // La session ne vaut que si le compte est toujours membre de l'organisation.
    .innerJoin(memberships, and(eq(memberships.userId, sessions.userId), eq(memberships.organizationId, sessions.organizationId)))
    .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, now)))
    .limit(1);
  if (!row) return null;
  return {
    sessionId: row.sessionId,
    user: {
      ...row.user,
      locale: isOneOf(LOCALES, row.user.locale) ? row.user.locale : 'fr',
      isPlatformAdmin: row.user.isPlatformAdmin || platformAdminEmails().includes(row.user.email),
    },
    organization: row.organization,
    role: row.role as Role,
  };
}

export async function logOut(db: Db, token: string | undefined) {
  if (!token) return;
  await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
}

export async function purgeExpiredSessions(db: Db) {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}

export async function setUserLocale(db: Db, userId: string, locale: Locale) {
  await db.update(users).set({ locale, updatedAt: new Date() }).where(eq(users.id, userId));
}
