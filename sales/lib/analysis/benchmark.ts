import { and, desc, eq, ne } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import { scenarioVersions, simulationAnalyses, simulations } from '../db/schema.ts';

// En dessous de ce nombre d'autres appels analysés sur le même scénario, on ne situe pas le vendeur :
// un centile ou une moyenne sur trois appels ne voudrait rien dire.
export const BENCHMARK_MIN = 5;

export type Benchmark = {
  n: number;
  // Part des autres appels du scénario qui ont obtenu un score global inférieur (null si trop peu d'appels).
  percentile: number | null;
  // Moyenne de chaque compétence sur les autres appels du scénario (seulement les compétences assez notées).
  skillAverages: Record<string, number>;
};

type StoredResult = { overallScore?: number; skills?: { skill: string; score: number }[] };

// Comparaison avec les autres appels analysés du même scénario (toutes versions). Seuls des scores
// agrégés sortent d'ici : ni nom, ni transcription. Un scénario privé n'est joué que par son organisation.
export async function scenarioBenchmark(db: Db, scenarioId: string, simulationId: string, score: number): Promise<Benchmark> {
  const rows = await db
    .select({ result: simulationAnalyses.result })
    .from(simulationAnalyses)
    .innerJoin(simulations, eq(simulations.id, simulationAnalyses.simulationId))
    .innerJoin(scenarioVersions, eq(scenarioVersions.id, simulations.scenarioVersionId))
    .where(and(eq(scenarioVersions.scenarioId, scenarioId), eq(simulationAnalyses.status, 'completed'), ne(simulations.id, simulationId)))
    .orderBy(desc(simulationAnalyses.updatedAt))
    .limit(500);
  const results = rows.map((r) => r.result as StoredResult).filter((r) => typeof r?.overallScore === 'number');
  const n = results.length;
  const sums = new Map<string, { total: number; count: number }>();
  for (const r of results) {
    for (const s of r.skills ?? []) {
      const acc = sums.get(s.skill) ?? { total: 0, count: 0 };
      acc.total += s.score;
      acc.count += 1;
      sums.set(s.skill, acc);
    }
  }
  const skillAverages: Record<string, number> = {};
  for (const [skill, acc] of sums) if (acc.count >= BENCHMARK_MIN) skillAverages[skill] = Math.round(acc.total / acc.count);
  return {
    n,
    percentile: n >= BENCHMARK_MIN ? Math.round((100 * results.filter((r) => r.overallScore! < score).length) / n) : null,
    skillAverages,
  };
}

// Paliers de score utilisés dans le rapport.
export type Tier = 'excellent' | 'good' | 'average' | 'poor';
export const TIERS: { key: Tier; min: number; max: number }[] = [
  { key: 'excellent', min: 80, max: 100 },
  { key: 'good', min: 60, max: 79 },
  { key: 'average', min: 40, max: 59 },
  { key: 'poor', min: 0, max: 39 },
];
export function tierOf(score: number): Tier {
  return TIERS.find((t) => score >= t.min)!.key;
}
