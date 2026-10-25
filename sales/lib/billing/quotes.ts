import { desc } from 'drizzle-orm';
import { z } from 'zod';
import { audit } from '../audit.ts';
import type { AuthContext } from '../auth/service.ts';
import type { Db } from '../db/client.ts';
import { quoteRequests, type QuoteRequest } from '../db/schema.ts';

// Offre Entreprise : pas de paiement en ligne, une demande de devis que l'éditeur traite à la main.
export const QuoteSchema = z.object({
  company: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().pipe(z.email()).pipe(z.string().max(254)),
  seats: z.coerce.number().int().min(2).max(100_000),
  message: z.string().trim().max(2000).default(''),
});

export async function requestQuote(db: Db, auth: AuthContext, input: z.infer<typeof QuoteSchema>): Promise<QuoteRequest> {
  const [row] = await db
    .insert(quoteRequests)
    .values({ ...input, organizationId: auth.organization.id, userId: auth.user.id })
    .returning();
  await audit(db, {
    action: 'billing.quote_requested',
    organizationId: auth.organization.id,
    actorUserId: auth.user.id,
    metadata: { seats: input.seats },
  });
  return row;
}

export async function recentQuoteRequests(db: Db, limit = 20): Promise<QuoteRequest[]> {
  return db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt)).limit(limit);
}
