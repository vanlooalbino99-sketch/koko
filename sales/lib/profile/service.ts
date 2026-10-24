import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { audit } from '../audit.ts';
import type { AuthContext } from '../auth/service.ts';
import type { Db } from '../db/client.ts';
import { organizations, userProfiles, type UserProfile } from '../db/schema.ts';
import { EXPERIENCES, PERSONAS, SKILLS } from '../domain.ts';

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === '' ? null : v))
    .nullable()
    .optional()
    .transform((v) => v ?? null);

export const OnboardingSchema = z.object({
  persona: z.enum(PERSONAS),
  experience: z.enum(EXPERIENCES),
  goals: z.array(z.enum(SKILLS)).min(1).max(5),
  offerName: optional(120),
  offerDescription: optional(600),
  idealCustomer: optional(300),
  averageDeal: optional(80),
  organizationName: optional(80),
});
export type OnboardingInput = z.infer<typeof OnboardingSchema>;

export async function getProfile(db: Db, userId: string): Promise<UserProfile | null> {
  const [row] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return row ?? null;
}

export async function saveProfile(db: Db, auth: AuthContext, input: OnboardingInput) {
  const { organizationName, ...profile } = input;
  await db.transaction(async (tx) => {
    await tx
      .insert(userProfiles)
      .values({ userId: auth.user.id, ...profile })
      .onConflictDoUpdate({ target: userProfiles.userId, set: { ...profile, updatedAt: new Date() } });
    // Une équipe ou une agence renomme son espace ; seul le propriétaire peut le faire.
    if ((profile.persona === 'team' || profile.persona === 'agency') && auth.role === 'owner') {
      await tx
        .update(organizations)
        .set({ kind: 'team', ...(organizationName ? { name: organizationName } : {}), updatedAt: new Date() })
        .where(and(eq(organizations.id, auth.organization.id)));
    }
    await audit(tx, {
      action: 'profile.saved',
      organizationId: auth.organization.id,
      actorUserId: auth.user.id,
      metadata: { persona: profile.persona, experience: profile.experience },
    });
  });
}
