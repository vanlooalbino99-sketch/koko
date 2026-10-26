import { and, eq, inArray, notInArray, sql } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import { memberships, organizations, users } from '../db/schema.ts';

// Accès illimité offert : UNLIMITED_EMAILS (e-mails séparés par des virgules) désigne les comptes dont les espaces
// (ceux qu'ils possèdent) n'ont pas de plafond. Recopié dans organizations.unlimited à chaque démarrage : retirer un
// e-mail de la liste retire l'accès au démarrage suivant.
export function unlimitedEmails(): string[] {
  return (process.env.UNLIMITED_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function syncUnlimited(db: Db, emails: string[]): Promise<{ granted: number; revoked: number }> {
  const list = emails.map((e) => e.trim().toLowerCase()).filter(Boolean);
  const owned = db
    .select({ id: memberships.organizationId })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(and(eq(memberships.role, 'owner'), inArray(sql`lower(${users.email})`, list.length ? list : [''])));
  const granted = await db
    .update(organizations)
    .set({ unlimited: true, updatedAt: new Date() })
    .where(and(eq(organizations.unlimited, false), inArray(organizations.id, owned)))
    .returning({ id: organizations.id });
  const revoked = await db
    .update(organizations)
    .set({ unlimited: false, updatedAt: new Date() })
    .where(and(eq(organizations.unlimited, true), notInArray(organizations.id, owned)))
    .returning({ id: organizations.id });
  return { granted: granted.length, revoked: revoked.length };
}
