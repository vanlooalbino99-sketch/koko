import { and, count, eq, gte, inArray, sql } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import { billingAccounts, creditDebits, simulationAnalyses, simulations, type Simulation } from '../db/schema.ts';
import { isOneOf } from '../domain.ts';
import { PLANS, planLimits, platformLimits, type Plan, type PlanLimits } from './plans.ts';

type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

// Les crédits se renouvellent le 1er de chaque mois (UTC).
export function monthStart(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export function dayStart(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// Crédits d'un appel : la durée réelle mesurée par ElevenLabs, arrondie à la minute supérieure.
export function creditsFor(durationSeconds: number | null | undefined): number {
  return Math.max(0, Math.ceil((durationSeconds ?? 0) / 60));
}

export type CreditStatus = PlanLimits & {
  plan: Plan;
  used: number;
  remaining: number;
  activeCalls: number;
};

export async function orgLimits(db: Db | Tx, org: { id: string; plan: string }): Promise<{ plan: Plan; limits: PlanLimits }> {
  const plan: Plan = isOneOf(PLANS, org.plan) ? org.plan : 'free';
  if (plan !== 'team') return { plan, limits: planLimits(plan) };
  const [account] = await db
    .select({ seats: billingAccounts.seats })
    .from(billingAccounts)
    .where(eq(billingAccounts.organizationId, org.id))
    .limit(1);
  return { plan, limits: planLimits(plan, account?.seats ?? 1) };
}

export async function creditStatus(db: Db | Tx, org: { id: string; plan: string }, now = new Date()): Promise<CreditStatus> {
  const { plan, limits } = await orgLimits(db, org);
  const [[used], [active]] = await Promise.all([
    db
      .select({
        credits: sql<number>`coalesce(sum(${creditDebits.credits}), 0)`.mapWith(Number),
      })
      .from(creditDebits)
      .where(and(eq(creditDebits.organizationId, org.id), gte(creditDebits.createdAt, monthStart(now)))),
    db
      .select({ n: count() })
      .from(simulations)
      .where(and(eq(simulations.organizationId, org.id), inArray(simulations.status, ['connecting', 'in_progress']))),
  ]);
  return {
    ...limits,
    plan,
    used: used.credits,
    remaining: Math.max(0, limits.monthlyCredits - used.credits),
    activeCalls: active.n,
  };
}

// Débit unique d'un appel terminé, dans la transaction qui le marque terminé. L'index unique sur la
// simulation rend un second débit impossible.
export async function debitSimulation(tx: Db | Tx, sim: Pick<Simulation, 'id' | 'organizationId' | 'userId' | 'durationSeconds'>) {
  await tx
    .insert(creditDebits)
    .values({
      organizationId: sim.organizationId,
      userId: sim.userId,
      simulationId: sim.id,
      credits: creditsFor(sim.durationSeconds),
    })
    .onConflictDoNothing({ target: creditDebits.simulationId });
}

// Consommation de toute la plateforme, comparée aux garde-fous de l'éditeur.
export async function platformUsage(db: Db, now = new Date()) {
  const limits = platformLimits();
  const [[minutes], [analyses]] = await Promise.all([
    db
      .select({
        credits: sql<number>`coalesce(sum(${creditDebits.credits}), 0)`.mapWith(Number),
      })
      .from(creditDebits)
      .where(gte(creditDebits.createdAt, monthStart(now))),
    db
      .select({ n: count() })
      .from(simulationAnalyses)
      .where(gte(simulationAnalyses.createdAt, dayStart(now))),
  ]);
  return {
    minutesThisMonth: minutes.credits,
    monthlyMinutes: limits.monthlyMinutes,
    analysesToday: analyses.n,
    dailyAnalyses: limits.dailyAnalyses,
    voiceSaturated: minutes.credits >= limits.monthlyMinutes,
    analysisSaturated: analyses.n >= limits.dailyAnalyses,
  };
}
