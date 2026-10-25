import { and, desc, eq, gte, lte } from 'drizzle-orm';
import type { AuthContext } from '../auth/service.ts';
import { PERIODS, type Period } from '../billing/cockpit.ts';
import { toCsv } from '../csv.ts';
import type { Db } from '../db/client.ts';
import { scenarios, scenarioVersions, simulationAnalyses, simulations } from '../db/schema.ts';
import { SKILLS, type Skill } from '../domain.ts';

// Tableau de bord du vendeur sur une période (7, 30 ou 90 jours), comparée à la période précédente de même
// durée. Uniquement ses appels dans son espace actif, et uniquement ce que la base contient : rien n'est estimé.

export { PERIODS, type Period };

const DAY = 86_400_000;
const GRID = 91;
// Issue d'un appel selon son analyse (« next_step_won » : le prospect a accepté une prochaine étape).
const OUTCOMES = ['next_step_won', 'postponed', 'lost', 'unclear'] as const;
export type Outcome = (typeof OUTCOMES)[number];
// Seuils d'état d'une compétence (score moyen sur 100).
const MASTERED = 75;
const WEAK = 50;

type StoredResult = { outcome?: string; skills?: { skill: string; score: number }[]; focusSkills?: string[] };

export type SkillRow = {
  skill: Skill;
  value: number;
  n: number;
  // Scores de cette compétence, appel après appel (du plus ancien au plus récent).
  history: number[];
  last: Date;
  state: 'weak' | 'progress' | 'mastered';
};

export type PulseSession = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  durationSeconds: number | null;
  overallScore: number | null;
  outcome: Outcome | null;
  focus: Skill | null;
};

export function periodOf(requested: unknown): Period {
  const n = Number(requested);
  return (PERIODS as readonly number[]).includes(n) ? (n as Period) : 30;
}

const isSkill = (s: unknown): s is Skill => (SKILLS as readonly unknown[]).includes(s);
const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);

export async function trainingPulse(db: Db, auth: AuthContext, opts: { days: Period; now?: Date }) {
  const now = opts.now ?? new Date();
  const days = opts.days;
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - (days - 1) * DAY);
  const before = new Date(since.getTime() - days * DAY);

  const rows = await db
    .select({
      id: simulations.id,
      status: simulations.status,
      createdAt: simulations.createdAt,
      durationSeconds: simulations.durationSeconds,
      overallScore: simulations.overallScore,
      scenarioId: scenarios.id,
      title: scenarios.title,
      family: scenarios.family,
      analysisStatus: simulationAnalyses.status,
      result: simulationAnalyses.result,
    })
    .from(simulations)
    .innerJoin(scenarioVersions, eq(scenarioVersions.id, simulations.scenarioVersionId))
    .innerJoin(scenarios, eq(scenarios.id, scenarioVersions.scenarioId))
    .leftJoin(simulationAnalyses, eq(simulationAnalyses.simulationId, simulations.id))
    .where(and(eq(simulations.organizationId, auth.organization.id), eq(simulations.userId, auth.user.id), gte(simulations.createdAt, before), lte(simulations.createdAt, now)))
    .orderBy(desc(simulations.createdAt))
    .limit(5000);

  const current = rows.filter((r) => r.createdAt >= since);
  const previous = rows.filter((r) => r.createdAt < since);
  const done = (list: typeof rows) => list.filter((r) => r.status === 'completed');
  const minutesOf = (list: typeof rows) => Math.round(done(list).reduce((n, r) => n + (r.durationSeconds ?? 0), 0) / 60);
  const scored = (list: typeof rows) => list.filter((r) => r.overallScore !== null).map((r) => r.overallScore as number);
  const activeDays = (list: typeof rows) => new Set(done(list).map((r) => r.createdAt.toISOString().slice(0, 10))).size;
  const resultOf = (r: (typeof rows)[number]): StoredResult | null =>
    r.analysisStatus === 'completed' && r.result && typeof r.result === 'object' ? (r.result as StoredResult) : null;
  const outcomeOf = (r: (typeof rows)[number]): Outcome | null => {
    const o = resultOf(r)?.outcome;
    return (OUTCOMES as readonly unknown[]).includes(o) ? (o as Outcome) : null;
  };

  // Une case par jour de la période, du plus ancien au plus récent.
  const callsByDay = Array.from({ length: days }, () => 0);
  const minutesByDay = Array.from({ length: days }, () => 0);
  // Grille de la maquette : la période découpée en 91 tranches égales (13 colonnes de 7 points).
  const callsGrid = Array.from({ length: GRID }, () => 0);
  const span = now.getTime() - since.getTime();
  for (const r of done(current)) {
    const elapsed = r.createdAt.getTime() - since.getTime();
    const i = Math.min(days - 1, Math.floor(elapsed / DAY));
    callsByDay[i] += 1;
    minutesByDay[i] += (r.durationSeconds ?? 0) / 60;
    callsGrid[Math.min(GRID - 1, Math.floor((elapsed / Math.max(span, 1)) * GRID))] += 1;
  }

  const chronological = [...current].reverse();
  const currentScores = scored(chronological);
  const previousScores = scored(previous);

  // Compétences : moyenne des notes de Claude sur la période, historique appel par appel.
  const bySkill = new Map<Skill, { scores: number[]; last: Date }>();
  for (const r of chronological) {
    for (const s of resultOf(r)?.skills ?? []) {
      if (!isSkill(s.skill) || typeof s.score !== 'number') continue;
      const entry = bySkill.get(s.skill) ?? { scores: [], last: r.createdAt };
      entry.scores.push(s.score);
      entry.last = r.createdAt;
      bySkill.set(s.skill, entry);
    }
  }
  const skills: SkillRow[] = [...bySkill.entries()]
    .map(([skill, e]) => {
      const value = avg(e.scores) ?? 0;
      return { skill, value, n: e.scores.length, history: e.scores, last: e.last, state: value >= MASTERED ? 'mastered' : value < WEAK ? 'weak' : 'progress' } as SkillRow;
    })
    .sort((a, b) => a.value - b.value || b.n - a.n);

  const count = <K extends string>(keys: K[]) => {
    const m = new Map<K, number>();
    for (const k of keys) m.set(k, (m.get(k) ?? 0) + 1);
    return m;
  };
  const scenarioCounts = new Map<string, { id: string; title: string; n: number }>();
  for (const r of done(current)) {
    const e = scenarioCounts.get(r.scenarioId) ?? { id: r.scenarioId, title: r.title, n: 0 };
    e.n += 1;
    scenarioCounts.set(r.scenarioId, e);
  }
  const familyMinutes = new Map<string, number>();
  for (const r of done(current)) familyMinutes.set(r.family, (familyMinutes.get(r.family) ?? 0) + (r.durationSeconds ?? 0) / 60);
  const outcomes = count(current.map(outcomeOf).filter((o): o is Outcome => o !== null));

  const sessions: PulseSession[] = current.map((r) => {
    const focus = resultOf(r)?.focusSkills?.[0];
    return {
      id: r.id,
      title: r.title,
      status: r.status,
      createdAt: r.createdAt,
      durationSeconds: r.durationSeconds,
      overallScore: r.overallScore,
      outcome: outcomeOf(r),
      focus: isSkill(focus) ? focus : null,
    };
  });

  return {
    days,
    since,
    minutes: { value: minutesOf(current), previous: minutesOf(previous), byDay: minutesByDay.map((m) => Math.round(m * 10) / 10) },
    calls: { value: done(current).length, previous: done(previous).length, byDay: callsByDay, grid: callsGrid },
    score: { value: avg(currentScores), previous: avg(previousScores), n: currentScores.length, series: currentScores },
    best: currentScores.length ? Math.max(...currentScores) : null,
    activeDays: { value: activeDays(current), previous: activeDays(previous) },
    funnel: {
      started: current.length,
      completed: done(current).length,
      scored: currentScores.length,
      nextStep: outcomes.get('next_step_won') ?? 0,
    },
    outcomes: OUTCOMES.map((key) => ({ key, n: outcomes.get(key) ?? 0 })).filter((o) => o.n > 0),
    families: [...familyMinutes.entries()].map(([family, m]) => ({ family, minutes: Math.round(m) })).sort((a, b) => b.minutes - a.minutes),
    topScenarios: [...scenarioCounts.values()].sort((a, b) => b.n - a.n).slice(0, 5),
    skills,
    weakest: skills[0] ?? null,
    sessions,
  };
}

export type Pulse = Awaited<ReturnType<typeof trainingPulse>>;

// Export CSV des appels de la période (cellules protégées contre l'injection de formules).
export function sessionsCsv(sessions: PulseSession[], header: string[], label: (s: PulseSession) => { status: string; outcome: string; focus: string }) {
  return toCsv([
    header,
    ...sessions.map((s) => {
      const l = label(s);
      return [s.createdAt.toISOString().slice(0, 16).replace('T', ' '), s.title, l.status, s.durationSeconds === null ? '' : Math.round(s.durationSeconds / 60), s.overallScore ?? '', l.outcome, l.focus];
    }),
  ]);
}
