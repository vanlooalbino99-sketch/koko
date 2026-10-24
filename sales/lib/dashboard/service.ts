import { and, count, desc, eq, isNull, isNotNull, or, sql } from 'drizzle-orm';
import type { AuthContext } from '../auth/service.ts';
import type { Db } from '../db/client.ts';
import { memberships, scenarioVersions, scenarios, simulations } from '../db/schema.ts';

export type DashboardData = {
  completedSimulations: number;
  practiceMinutes: number;
  averageScore: number | null;
  scoredSimulations: number;
  catalogScenarios: number;
  privateScenarios: number;
  members: number;
  recent: { id: string; title: string; status: string; createdAt: Date; durationSeconds: number | null; overallScore: number | null }[];
  scoreHistory: { date: Date; score: number }[];
};

// Uniquement des chiffres lus en base, pour l'utilisateur dans son organisation active.
export async function getDashboard(db: Db, auth: AuthContext): Promise<DashboardData> {
  const mine = and(eq(simulations.organizationId, auth.organization.id), eq(simulations.userId, auth.user.id));
  const [totals] = await db
    .select({
      completed: sql<number>`count(*) filter (where ${simulations.status} = 'completed')`.mapWith(Number),
      seconds: sql<number>`coalesce(sum(${simulations.durationSeconds}) filter (where ${simulations.status} = 'completed'), 0)`.mapWith(Number),
      average: sql<number | null>`round(avg(${simulations.overallScore}))`.mapWith((v) => (v === null ? null : Number(v))),
      scored: count(simulations.overallScore),
    })
    .from(simulations)
    .where(mine);
  const [scenarioCounts] = await db
    .select({
      catalog: sql<number>`count(*) filter (where ${scenarios.organizationId} is null)`.mapWith(Number),
      private: sql<number>`count(*) filter (where ${scenarios.organizationId} is not null)`.mapWith(Number),
    })
    .from(scenarios)
    .where(and(eq(scenarios.status, 'active'), or(isNull(scenarios.organizationId), eq(scenarios.organizationId, auth.organization.id))));
  const [memberCount] = await db
    .select({ n: count() })
    .from(memberships)
    .where(eq(memberships.organizationId, auth.organization.id));
  const recent = await db
    .select({
      id: simulations.id,
      title: scenarios.title,
      status: simulations.status,
      createdAt: simulations.createdAt,
      durationSeconds: simulations.durationSeconds,
      overallScore: simulations.overallScore,
    })
    .from(simulations)
    .innerJoin(scenarioVersions, eq(scenarioVersions.id, simulations.scenarioVersionId))
    .innerJoin(scenarios, eq(scenarios.id, scenarioVersions.scenarioId))
    .where(mine)
    .orderBy(desc(simulations.createdAt))
    .limit(6);
  const history = await db
    .select({ date: simulations.createdAt, score: simulations.overallScore })
    .from(simulations)
    .where(and(mine, isNotNull(simulations.overallScore)))
    .orderBy(desc(simulations.createdAt))
    .limit(20);
  return {
    completedSimulations: totals.completed,
    practiceMinutes: Math.round(totals.seconds / 60),
    averageScore: totals.average,
    scoredSimulations: totals.scored,
    catalogScenarios: scenarioCounts.catalog,
    privateScenarios: scenarioCounts.private,
    members: memberCount.n,
    recent,
    scoreHistory: history.reverse().map((h) => ({ date: h.date, score: h.score ?? 0 })),
  };
}
