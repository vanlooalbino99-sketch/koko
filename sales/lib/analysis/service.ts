import { and, eq, isNull, lt, or, sql } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import {
  scenarioVersions,
  scenarios,
  simulationAnalyses,
  simulations,
  users,
  type SimulationAnalysis,
  type TranscriptTurn,
} from '../db/schema.ts';
import { DIFFICULTIES, isOneOf, LOCALES, SKILLS, type Locale, type Skill } from '../domain.ts';
import { ScenarioMetaSchema, type ScenarioContent } from '../scenarios/content.ts';
import { AnalyzerError, type Analyzer } from './claude.ts';
import { analysisPrompt } from './prompt.ts';
import type { AnalysisResult, ClaudeAnalysis } from './schema.ts';

const MAX_ATTEMPTS = 3;
// Une analyse « en cours » depuis plus longtemps a été interrompue (redémarrage du serveur) : on la relance.
const STALE_MS = 5 * 60 * 1000;

// En dessous, il n'y a pas assez de matière pour juger : on n'appelle pas Claude (ni ne paie l'appel).
export function hasEnoughSpeech(transcript: TranscriptTurn[]): boolean {
  const seller = transcript.filter((t) => t.role === 'seller');
  const words = seller.reduce((n, t) => n + t.text.split(/\s+/).filter(Boolean).length, 0);
  return seller.length >= 2 && words >= 12;
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

// Une citation n'est gardée que si elle figure vraiment dans la réplique du vendeur indiquée.
function quoteMatches(transcript: TranscriptTurn[], turn: number, quote: string): boolean {
  const line = transcript[turn];
  const q = normalize(quote);
  return Boolean(line && line.role === 'seller' && q.length > 0 && normalize(line.text).includes(q));
}

// Nettoie la réponse du modèle et calcule le score global à partir des poids du scénario.
export function finalizeAnalysis(
  analysis: ClaudeAnalysis,
  weights: Partial<Record<Skill, number>>,
  transcript: TranscriptTurn[],
): Omit<AnalysisResult, 'recommendedScenarioIds' | 'locale'> {
  const weighted = SKILLS.filter((s) => (weights[s] ?? 0) > 0);
  const bySkill = new Map(analysis.skills.map((s) => [s.skill, s]));
  const missing = weighted.filter((s) => !bySkill.has(s));
  if (missing.length) throw new AnalyzerError(`missing_skills:${missing.join(',')}`);
  const skills = weighted.map((skill) => {
    const entry = bySkill.get(skill)!;
    return { ...entry, evidence: entry.evidence.filter((e) => quoteMatches(transcript, e.turn, e.quote)) };
  });
  const totalWeight = weighted.reduce((n, s) => n + (weights[s] ?? 0), 0);
  const overallScore = Math.round(skills.reduce((n, s) => n + s.score * (weights[s.skill] ?? 0), 0) / totalWeight);
  return {
    ...analysis,
    skills,
    improvements: analysis.improvements.filter((i) => quoteMatches(transcript, i.turn, i.said)),
    overallScore,
    weights: Object.fromEntries(weighted.map((s) => [s, weights[s]!])),
  };
}

// Exercices suivants : les scénarios visibles par l'organisation qui pèsent le plus sur les compétences à
// travailler (la plus faible compte triple), dans la langue de l'appel, sans rejouer le même scénario.
export async function scenariosForSkills(
  db: Db,
  organizationId: string,
  focus: Skill[],
  language: string,
  excludeScenarioId: string,
  difficulty: string,
  limit = 3,
): Promise<string[]> {
  if (!focus.length) return [];
  const rows = await db
    .select({ id: scenarios.id, language: scenarios.language, difficulty: scenarios.difficulty, content: scenarioVersions.content })
    .from(scenarios)
    .innerJoin(scenarioVersions, and(eq(scenarioVersions.scenarioId, scenarios.id), eq(scenarioVersions.version, scenarios.currentVersion)))
    .where(and(eq(scenarios.status, 'active'), or(isNull(scenarios.organizationId), eq(scenarios.organizationId, organizationId))))
    .limit(300);
  const level = DIFFICULTIES.indexOf(difficulty as (typeof DIFFICULTIES)[number]);
  return rows
    .filter((r) => r.id !== excludeScenarioId && r.language === language)
    .map((r) => {
      const w = r.content.skillWeights as Partial<Record<Skill, number>>;
      const fit = focus.reduce((n, skill, i) => n + (w[skill] ?? 0) * (3 - i), 0);
      const gap = Math.abs(DIFFICULTIES.indexOf(r.difficulty as (typeof DIFFICULTIES)[number]) - level);
      return { id: r.id, score: fit * 10 - gap };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.id);
}

type Loaded = {
  sim: typeof simulations.$inferSelect;
  scenario: typeof scenarios.$inferSelect;
  content: ScenarioContent;
  userLocale: string;
};

async function load(db: Db, simulationId: string): Promise<Loaded | null> {
  const [row] = await db
    .select({ sim: simulations, scenario: scenarios, content: scenarioVersions.content, userLocale: users.locale })
    .from(simulations)
    .innerJoin(scenarioVersions, eq(scenarioVersions.id, simulations.scenarioVersionId))
    .innerJoin(scenarios, eq(scenarios.id, scenarioVersions.scenarioId))
    .innerJoin(users, eq(users.id, simulations.userId))
    .where(eq(simulations.id, simulationId))
    .limit(1);
  return row ?? null;
}

export async function getAnalysis(db: Db, simulationId: string): Promise<SimulationAnalysis | null> {
  const [row] = await db.select().from(simulationAnalyses).where(eq(simulationAnalyses.simulationId, simulationId)).limit(1);
  return row ?? null;
}

// Analyse un appel terminé, une seule fois : la ligne « running » sert de verrou entre requêtes concurrentes.
// Les échecs sont enregistrés (jamais levés) et retentés au plus MAX_ATTEMPTS fois.
export async function analyzeSimulation(db: Db, analyzer: Analyzer, simulationId: string, now = new Date()): Promise<SimulationAnalysis | null> {
  const loaded = await load(db, simulationId);
  if (!loaded || loaded.sim.status !== 'completed') return null;
  const { sim, scenario, content } = loaded;
  const transcript = sim.transcript ?? [];

  const [claimed] = await db
    .insert(simulationAnalyses)
    .values({ simulationId, status: 'running', attempts: 1 })
    .onConflictDoUpdate({
      target: simulationAnalyses.simulationId,
      set: { status: 'running', attempts: sql`${simulationAnalyses.attempts} + 1`, error: null, updatedAt: now },
      setWhere: or(
        and(eq(simulationAnalyses.status, 'failed'), lt(simulationAnalyses.attempts, MAX_ATTEMPTS)),
        and(eq(simulationAnalyses.status, 'running'), lt(simulationAnalyses.updatedAt, new Date(now.getTime() - STALE_MS))),
      ),
    })
    .returning();
  if (!claimed) return getAnalysis(db, simulationId);

  const finish = async (values: Partial<SimulationAnalysis>) => {
    const [row] = await db
      .update(simulationAnalyses)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(simulationAnalyses.simulationId, simulationId))
      .returning();
    return row;
  };

  if (!hasEnoughSpeech(transcript)) return finish({ status: 'insufficient' });

  const weights = content.skillWeights as Partial<Record<Skill, number>>;
  const feedbackLocale: Locale = isOneOf(LOCALES, loaded.userLocale) ? loaded.userLocale : 'fr';
  try {
    const meta = ScenarioMetaSchema.parse(scenario);
    const output = await analyzer.analyze(analysisPrompt({ meta, content, weights, transcript, feedbackLocale }));
    const final = finalizeAnalysis(output.analysis, weights, transcript);
    // Compétences à travailler : celles citées par Claude, sinon les deux plus faibles de l'appel.
    const focus = final.focusSkills.length
      ? final.focusSkills
      : [...final.skills].sort((a, b) => a.score - b.score).slice(0, 2).map((s) => s.skill);
    const recommendedScenarioIds = await scenariosForSkills(db, sim.organizationId, focus, scenario.language, scenario.id, scenario.difficulty);
    const result: AnalysisResult = { ...final, focusSkills: focus, recommendedScenarioIds, locale: feedbackLocale };
    const row = await db.transaction(async (tx) => {
      await tx.update(simulations).set({ overallScore: result.overallScore }).where(eq(simulations.id, simulationId));
      const [saved] = await tx
        .update(simulationAnalyses)
        .set({
          status: 'completed',
          result,
          model: output.model,
          inputTokens: output.inputTokens,
          outputTokens: output.outputTokens,
          updatedAt: new Date(),
        })
        .where(eq(simulationAnalyses.simulationId, simulationId))
        .returning();
      return saved;
    });
    return row;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[analyse] échec', simulationId, message.slice(0, 300));
    // Une nouvelle analyse demandée qui échoue laisse le rapport précédent en place.
    if (claimed.result) return finish({ status: 'completed', error: message.slice(0, 500) });
    return finish({ status: 'failed', error: message.slice(0, 500) });
  }
}

// Nouvelle analyse demandée par le vendeur : possible tant que le plafond de tentatives n'est pas atteint
// (chaque analyse compte aussi dans le plafond quotidien de la plateforme). L'analyse repart à la visite suivante.
export async function requestReanalysis(db: Db, simulationId: string): Promise<boolean> {
  const rows = await db
    .update(simulationAnalyses)
    .set({ status: 'failed', error: 'regenerate', updatedAt: new Date() })
    .where(
      and(
        eq(simulationAnalyses.simulationId, simulationId),
        eq(simulationAnalyses.status, 'completed'),
        lt(simulationAnalyses.attempts, MAX_ATTEMPTS),
      ),
    )
    .returning({ id: simulationAnalyses.simulationId });
  return rows.length > 0;
}

export function canReanalyze(analysis: SimulationAnalysis | null): boolean {
  return analysis?.status === 'completed' && analysis.attempts < MAX_ATTEMPTS;
}
