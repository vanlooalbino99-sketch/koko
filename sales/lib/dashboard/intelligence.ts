import { and, desc, eq, gte, isNull, lte, or } from 'drizzle-orm';
import type { AuthContext } from '../auth/service.ts';
import type { Db } from '../db/client.ts';
import { scenarios, scenarioVersions, simulationAnalyses, simulations } from '../db/schema.ts';
import { DIFFICULTIES, SKILLS, type Difficulty, type Locale, type Personality, type Skill } from '../domain.ts';
import type { ScenarioContent } from '../scenarios/content.ts';

// « Intelligence IA » du tableau de bord : ce que les analyses de Claude disent de la semaine du vendeur.
// Tout est calculé à partir des appels réellement analysés (scores, objections, conseils de Claude) : sans
// appel analysé, la section le dit et ne montre aucun chiffre.

const DAY = 86_400_000;
const WEEK = 7;
// Sans appel analysé cette semaine : les derniers appels analysés, en le disant.
const RECENT = 5;

// Familles d'objections, reconnues dans le texte de l'objection (celui du scénario, repris par l'analyse).
export const OBJECTION_KINDS = ['price', 'authority', 'timing', 'competition', 'brush_off', 'trust', 'other'] as const;
export type ObjectionKind = (typeof OBJECTION_KINDS)[number];
const KIND_PATTERNS: [Exclude<ObjectionKind, 'other'>, RegExp][] = [
  ['price', /€|\$|£|\d\s?%|\bprix|\bcher\b|\bco[uû]t|budget|tarif|remise|rabais|montant|abonnement|\bpayer|\bgeste\b|\bprice|expensive|\bcost|discount|\bamount|subscription|\bpaying|upfront/],
  ['authority', /d[ée]cid|directeur|associ[ée]|\bp[eè]re\b|patron|comit[ée]|propri[ée]taires|\bdecide|\bcfo\b|partner|father|\bboss|committee|\bowners/],
  ['timing', /\btemps\b|\bmoment\b|mois prochain|rappelez|plus tard|pour l'instant|me renseigne|\btime\b|next month|call me back|\blater\b|for now|just looking/],
  ['competition', /concurrent|d[ée]j[aà]|essay[ée]|competitor|already|\btried\b/],
  ['brush_off', /\bmail\b|e-mail|whatsapp|\bemail|montrer directement|show me/],
  ['trust', /\bs[uû]r\b|\bmarch|robot|humain|adh[ée]rer|si [cç]a ne|pour l'europe|how do i know|what if|not sure|\bhuman|built for|buy into/],
];

export function objectionKind(text: string): ObjectionKind {
  const s = text.toLowerCase().replace(/[’`]/g, "'");
  return KIND_PATTERNS.find(([, re]) => re.test(s))?.[0] ?? 'other';
}

// Ce que l'on relit dans le résultat enregistré (voir lib/analysis/schema.ts) : tout est vérifié, rien n'est supposé.
type Stored = {
  summary?: unknown;
  outcome?: unknown;
  skills?: unknown;
  weights?: unknown;
  objections?: unknown;
  strengths?: unknown;
  improvements?: unknown;
  hiddenFacts?: unknown;
  successCriteria?: unknown;
};
const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const arr = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object') : []);
const isSkill = (s: unknown): s is Skill => (SKILLS as readonly unknown[]).includes(s);
const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);

export type AnalyzedCall = {
  id: string;
  scenarioId: string;
  title: string;
  difficulty: string;
  createdAt: Date;
  overallScore: number | null;
  result: Stored;
};

export type CandidateScenario = {
  id: string;
  title: string;
  difficulty: Difficulty;
  personality: Personality;
  weights: Partial<Record<Skill, number>>;
  objections: string[];
};

export type SkillInsight = { skill: Skill; value: number; previous: number | null; n: number; cost: number };
export type ObjectionInsight = {
  kind: ObjectionKind;
  raised: number;
  well: number;
  partly: number;
  poorly: number;
  // Écart de score global entre les appels où ce type d'objection a été mal traité et les autres.
  gap: number | null;
  example: string;
  comment: string | null;
};
export type Improvement = { simulationId: string; scenarioId: string; title: string; moment: number; said: string; better: string; why: string };
export type Exercise = { scenarioId: string; title: string; personality: Personality; difficulty: Difficulty; level: number; reason: 'objection' | 'skill' };
export type FocusItem = { kind: 'objection' | 'question' | 'criterion'; text: string; detail: string | null };

export type Intelligence = {
  scope: 'week' | 'recent';
  since: Date;
  calls: number;
  score: number | null;
  previousScore: number | null;
  nextSteps: number;
  latest: { simulationId: string; title: string; summary: string } | null;
  skills: SkillInsight[];
  weakest: SkillInsight | null;
  strongest: SkillInsight[];
  objections: ObjectionInsight[];
  losing: ObjectionInsight | null;
  strengths: string[];
  improvements: Improvement[];
  focus: FocusItem[];
  exercise: Exercise | null;
};

// Points de score global perdus par une compétence sur un appel : son poids dans la note × ce qui manque pour 100.
function skillRows(calls: AnalyzedCall[]) {
  const rows = new Map<Skill, { scores: number[]; costs: number[] }>();
  for (const c of calls) {
    const scored = arr(c.result.skills).filter((s) => isSkill(s.skill) && typeof s.score === 'number') as { skill: Skill; score: number }[];
    const stored = c.result.weights && typeof c.result.weights === 'object' ? (c.result.weights as Record<string, unknown>) : {};
    const weight = (s: Skill) => (typeof stored[s] === 'number' ? (stored[s] as number) : Object.keys(stored).length ? 0 : 1);
    const total = scored.reduce((n, s) => n + weight(s.skill), 0);
    for (const s of scored) {
      const e = rows.get(s.skill) ?? { scores: [], costs: [] };
      e.scores.push(s.score);
      e.costs.push(total ? (weight(s.skill) * (100 - s.score)) / total : 0);
      rows.set(s.skill, e);
    }
  }
  return rows;
}

export function computeIntelligence(input: {
  calls: AnalyzedCall[];
  previous: AnalyzedCall[];
  scope: 'week' | 'recent';
  since: Date;
  candidates: CandidateScenario[];
  experience: Difficulty | null;
}): Intelligence {
  // Du plus récent au plus ancien.
  const calls = [...input.calls].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const scoreOf = (c: AnalyzedCall) => c.overallScore;
  const scores = calls.map(scoreOf).filter((s): s is number => s !== null);
  const previousScores = input.previous.map(scoreOf).filter((s): s is number => s !== null);

  const current = skillRows(calls);
  const before = skillRows(input.previous);
  const skills: SkillInsight[] = [...current.entries()]
    .map(([skill, e]) => ({
      skill,
      value: avg(e.scores)!,
      previous: before.has(skill) ? avg(before.get(skill)!.scores) : null,
      n: e.scores.length,
      cost: Math.round((e.costs.reduce((a, b) => a + b, 0) / e.costs.length) * 10) / 10,
    }))
    .sort((a, b) => b.cost - a.cost || a.value - b.value);
  const weakest = skills.find((s) => s.value < 100 && s.cost > 0) ?? null;
  const strongest = [...skills].filter((s) => s.value >= 70).sort((a, b) => b.value - a.value || b.n - a.n).slice(0, 3);

  // Objections : comptées par famille, avec l'écart de score des appels où elles ont été mal traitées.
  const byKind = new Map<ObjectionKind, ObjectionInsight & { missedIn: Set<string> }>();
  for (const c of calls) {
    for (const o of arr(c.result.objections)) {
      const text = str(o.objection);
      const handling = o.handling;
      if (!text || !(handling === 'well' || handling === 'partly' || handling === 'poorly')) continue;
      const kind = objectionKind(text);
      const e = byKind.get(kind) ?? { kind, raised: 0, well: 0, partly: 0, poorly: 0, gap: null, example: text, comment: null, missedIn: new Set<string>() };
      e.raised += 1;
      e[handling] += 1;
      if (handling !== 'well') {
        e.missedIn.add(c.id);
        // Le conseil de Claude sur la plus récente objection ratée de ce type.
        if (!e.comment) {
          e.comment = str(o.comment);
          e.example = text;
        }
      }
      byKind.set(kind, e);
    }
  }
  const objections: ObjectionInsight[] = [...byKind.values()]
    .map(({ missedIn, ...e }) => {
      const missed = calls.filter((c) => missedIn.has(c.id)).map(scoreOf).filter((s): s is number => s !== null);
      const others = calls.filter((c) => !missedIn.has(c.id)).map(scoreOf).filter((s): s is number => s !== null);
      return { ...e, gap: missed.length && others.length ? avg(others)! - avg(missed)! : null };
    })
    .sort((a, b) => b.poorly + b.partly / 2 - (a.poorly + a.partly / 2) || a.well / a.raised - b.well / b.raised);
  const losing = objections.find((o) => o.poorly + o.partly > 0) ?? null;

  const unique = (xs: string[], n: number) => [...new Set(xs)].slice(0, n);
  const strengths = unique(
    calls.flatMap((c) => (Array.isArray(c.result.strengths) ? c.result.strengths.map(str).filter((s): s is string => !!s) : [])),
    5,
  );
  const improvements: Improvement[] = calls
    .flatMap((c) =>
      arr(c.result.improvements).map((i, moment) => ({
        simulationId: c.id,
        scenarioId: c.scenarioId,
        title: c.title,
        moment,
        said: str(i.said) ?? '',
        better: str(i.better) ?? '',
        why: str(i.why) ?? '',
      })),
    )
    .filter((i) => i.said && i.better)
    .slice(0, 4);

  // Focus du prochain appel : l'objection qui coûte des points, puis ce que le dernier appel a laissé de côté.
  const focus: FocusItem[] = [];
  if (losing) focus.push({ kind: 'objection', text: losing.example, detail: losing.comment });
  const last = calls[0];
  if (last) {
    const fact = arr(last.result.hiddenFacts).find((f) => f.uncovered === false && str(f.howToUncover));
    if (fact) focus.push({ kind: 'question', text: str(fact.howToUncover)!, detail: str(fact.fact) });
    for (const c of arr(last.result.successCriteria).filter((c) => c.met === false && str(c.criterion))) {
      if (focus.length >= 3) break;
      focus.push({ kind: 'criterion', text: str(c.criterion)!, detail: null });
    }
  }

  const latest = calls.find((c) => str(c.result.summary));

  return {
    scope: input.scope,
    since: input.since,
    calls: calls.length,
    score: avg(scores),
    previousScore: avg(previousScores),
    nextSteps: calls.filter((c) => c.result.outcome === 'next_step_won').length,
    latest: latest ? { simulationId: latest.id, title: latest.title, summary: str(latest.result.summary)! } : null,
    skills,
    weakest,
    strongest,
    objections,
    losing,
    strengths,
    improvements,
    focus: focus.slice(0, 3),
    exercise: pickExercise(calls, scores, weakest, losing, input.candidates, input.experience),
  };
}

// Exercice conseillé : le scénario qui travaille le point faible (ou l'objection ratée), au bon niveau. Le niveau
// part de celui des appels de la période et monte d'un cran au-dessus de 75 de moyenne, descend sous 50.
function pickExercise(
  calls: AnalyzedCall[],
  scores: number[],
  weakest: SkillInsight | null,
  losing: ObjectionInsight | null,
  candidates: CandidateScenario[],
  experience: Difficulty | null,
): Exercise | null {
  if (!weakest && !losing) return null;
  const levels = calls.map((c) => DIFFICULTIES.indexOf(c.difficulty as Difficulty)).filter((i) => i >= 0);
  const base = levels.length ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) : Math.max(0, DIFFICULTIES.indexOf(experience ?? 'beginner'));
  const mean = avg(scores);
  const target = Math.min(2, Math.max(0, base + (mean === null ? 0 : mean >= 75 ? 1 : mean < 50 ? -1 : 0)));
  const played = new Set(calls.map((c) => c.scenarioId));
  const ranked = candidates
    .map((s) => {
      const kinds = new Set(s.objections.map(objectionKind));
      const objectionFit = losing && kinds.has(losing.kind) ? 3 + (losing.kind === 'price' && s.personality === 'price_sensitive' ? 1 : 0) : 0;
      const skillFit = weakest ? (s.weights[weakest.skill] ?? 0) * 2 : 0;
      const gap = Math.abs(DIFFICULTIES.indexOf(s.difficulty) - target);
      const score = objectionFit + skillFit + (gap === 0 ? 3 : gap === 1 ? 1 : -2) + (played.has(s.id) ? 0 : 0.5);
      return { s, score, reason: objectionFit > 0 ? ('objection' as const) : ('skill' as const) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.s.title.localeCompare(b.s.title));
  const best = ranked[0];
  if (!best) return null;
  return {
    scenarioId: best.s.id,
    title: best.s.title,
    personality: best.s.personality,
    difficulty: best.s.difficulty,
    level: DIFFICULTIES.indexOf(best.s.difficulty) + 1,
    reason: losing && best.reason === 'objection' ? 'objection' : 'skill',
  };
}

export async function aiIntelligence(db: Db, auth: AuthContext, opts: { locale: Locale; experience: Difficulty | null; now?: Date }): Promise<Intelligence | null> {
  const now = opts.now ?? new Date();
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - (WEEK - 1) * DAY);
  const analyzed = (from?: Date, to?: Date, limit = 200) =>
    db
      .select({
        id: simulations.id,
        scenarioId: scenarios.id,
        title: scenarios.title,
        difficulty: scenarios.difficulty,
        createdAt: simulations.createdAt,
        overallScore: simulations.overallScore,
        result: simulationAnalyses.result,
      })
      .from(simulations)
      .innerJoin(simulationAnalyses, eq(simulationAnalyses.simulationId, simulations.id))
      .innerJoin(scenarioVersions, eq(scenarioVersions.id, simulations.scenarioVersionId))
      .innerJoin(scenarios, eq(scenarios.id, scenarioVersions.scenarioId))
      .where(
        and(
          eq(simulations.organizationId, auth.organization.id),
          eq(simulations.userId, auth.user.id),
          eq(simulationAnalyses.status, 'completed'),
          from ? gte(simulations.createdAt, from) : undefined,
          to ? lte(simulations.createdAt, to) : undefined,
        ),
      )
      .orderBy(desc(simulations.createdAt))
      .limit(limit);
  const asCalls = (rows: Awaited<ReturnType<typeof analyzed>>): AnalyzedCall[] =>
    rows.map((r) => ({ ...r, result: r.result && typeof r.result === 'object' ? (r.result as Stored) : {} }));

  let scope: 'week' | 'recent' = 'week';
  let calls = asCalls(await analyzed(since, now));
  let previous = asCalls(await analyzed(new Date(since.getTime() - WEEK * DAY), new Date(since.getTime() - 1)));
  if (!calls.length) {
    scope = 'recent';
    calls = asCalls(await analyzed(undefined, now, RECENT));
    previous = [];
  }
  if (!calls.length) return null;

  const rows = await db
    .select({ id: scenarios.id, title: scenarios.title, difficulty: scenarios.difficulty, content: scenarioVersions.content })
    .from(scenarios)
    .innerJoin(scenarioVersions, and(eq(scenarioVersions.scenarioId, scenarios.id), eq(scenarioVersions.version, scenarios.currentVersion)))
    .where(
      and(
        or(isNull(scenarios.organizationId), eq(scenarios.organizationId, auth.organization.id)),
        eq(scenarios.status, 'active'),
        eq(scenarios.language, opts.locale),
      ),
    );
  const candidates: CandidateScenario[] = rows.map((r) => {
    const content = r.content as ScenarioContent;
    return {
      id: r.id,
      title: r.title,
      difficulty: r.difficulty as Difficulty,
      personality: content.prospect.personality,
      weights: content.skillWeights,
      objections: content.objections,
    };
  });
  return computeIntelligence({ calls, previous, scope, since: scope === 'week' ? since : calls[calls.length - 1].createdAt, candidates, experience: opts.experience });
}
