import { and, count, desc, eq, gte, inArray, sql } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import { billingAccounts, creditDebits, organizations, simulationAnalyses, simulations } from '../db/schema.ts';
import { monthStart, platformUsage } from './credits.ts';

// Tableau de bord de l'éditeur : consommation et coûts de toute la plateforme pour le mois en cours.
export async function platformReport(db: Db, now = new Date()) {
  const since = monthStart(now);
  const [usage, [calls], [analyses], plans, [subscriptions], top] = await Promise.all([
    platformUsage(db, now),
    db
      .select({
        n: count(),
        providerCost: sql<number>`coalesce(sum(${simulations.providerCost}), 0)`.mapWith(Number),
      })
      .from(simulations)
      .where(and(eq(simulations.status, 'completed'), gte(simulations.createdAt, since))),
    db
      .select({
        completed: sql<number>`count(*) filter (where ${simulationAnalyses.status} = 'completed')`.mapWith(Number),
        failed: sql<number>`count(*) filter (where ${simulationAnalyses.status} = 'failed')`.mapWith(Number),
        inputTokens: sql<number>`coalesce(sum(${simulationAnalyses.inputTokens}), 0)`.mapWith(Number),
        outputTokens: sql<number>`coalesce(sum(${simulationAnalyses.outputTokens}), 0)`.mapWith(Number),
      })
      .from(simulationAnalyses)
      .where(gte(simulationAnalyses.createdAt, since)),
    db.select({ plan: organizations.plan, n: count() }).from(organizations).groupBy(organizations.plan),
    db
      .select({ n: count() })
      .from(billingAccounts)
      .where(inArray(billingAccounts.status, ['active', 'trialing', 'past_due'])),
    db
      .select({
        id: organizations.id,
        name: organizations.name,
        plan: organizations.plan,
        credits: sql<number>`sum(${creditDebits.credits})`.mapWith(Number),
        calls: count(),
      })
      .from(creditDebits)
      .innerJoin(organizations, eq(organizations.id, creditDebits.organizationId))
      .where(gte(creditDebits.createdAt, since))
      .groupBy(organizations.id)
      .orderBy(desc(sql`sum(${creditDebits.credits})`))
      .limit(10),
  ]);
  return {
    usage,
    calls: calls.n,
    providerCost: calls.providerCost,
    analyses,
    plans: Object.fromEntries(plans.map((p) => [p.plan, p.n])) as Record<string, number>,
    paidSubscriptions: subscriptions.n,
    top,
  };
}
