import { and, count, eq, gte, inArray, notInArray, sql } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import { creditDebits, organizations, simulationAnalyses, simulations, type Simulation } from '../db/schema.ts';
import { isOneOf } from '../domain.ts';
import { PLANS, planLimits, platformLimits, unlimitedLimits, type Plan, type PlanLimits } from './plans.ts';

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
  // Accès illimité offert : pas de plafond de minutes affiché.
  unlimited: boolean;
  // Essai : appels déjà passés et appels restants ; null pour les offres payantes.
  trialCallsUsed: number | null;
  trialCallsLeft: number | null;
};

export async function orgLimits(db: Db | Tx, org: { id: string; plan: string }): Promise<{ plan: Plan; limits: PlanLimits; unlimited: boolean }> {
  const plan: Plan = isOneOf(PLANS, org.plan) ? org.plan : 'free';
  const [row] = await db.select({ unlimited: organizations.unlimited }).from(organizations).where(eq(organizations.id, org.id)).limit(1);
  const unlimited = row?.unlimited ?? false;
  return { plan, limits: unlimited ? unlimitedLimits() : planLimits(plan), unlimited };
}

export async function creditStatus(db: Db | Tx, org: { id: string; plan: string }, now = new Date()): Promise<CreditStatus> {
  const { plan, limits, unlimited } = await orgLimits(db, org);
  const trial = limits.trialCalls !== null;
  // Les minutes de l'essai ne se renouvellent pas ; celles des offres payantes, chaque mois.
  const since = trial ? new Date(0) : monthStart(now);
  const [[used], [active], [calls]] = await Promise.all([
    db
      .select({
        credits: sql<number>`coalesce(sum(${creditDebits.credits}), 0)`.mapWith(Number),
      })
      .from(creditDebits)
      .where(and(eq(creditDebits.organizationId, org.id), gte(creditDebits.createdAt, since))),
    db
      .select({ n: count() })
      .from(simulations)
      .where(and(eq(simulations.organizationId, org.id), inArray(simulations.status, ['connecting', 'in_progress']))),
    // Un appel qui n'a jamais abouti (échec de connexion, annulé avant de sonner) ne compte pas dans l'essai.
    trial
      ? db
          .select({ n: count() })
          .from(simulations)
          .where(and(eq(simulations.organizationId, org.id), notInArray(simulations.status, ['failed', 'cancelled'])))
      : Promise.resolve([{ n: 0 }]),
  ]);
  const trialCallsLeft = trial ? Math.max(0, limits.trialCalls! - calls.n) : null;
  return {
    ...limits,
    plan,
    used: used.credits,
    // Essai épuisé (deux appels passés) : plus de minutes, même s'il en reste sur le papier.
    remaining: trialCallsLeft === 0 ? 0 : Math.max(0, limits.monthlyCredits - used.credits),
    activeCalls: active.n,
    unlimited,
    trialCallsUsed: trial ? calls.n : null,
    trialCallsLeft,
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
