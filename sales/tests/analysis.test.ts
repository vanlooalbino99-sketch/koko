import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { eq } from 'drizzle-orm';
import { AnalyzerError, type Analyzer } from '../lib/analysis/claude.ts';
import { strictJsonSchema } from '../lib/analysis/json-schema.ts';
import { analysisPrompt } from '../lib/analysis/prompt.ts';
import type { AnalysisResult, ClaudeAnalysis } from '../lib/analysis/schema.ts';
import { ClaudeAnalysisSchema } from '../lib/analysis/schema.ts';
import { analyzeSimulation, hasEnoughSpeech } from '../lib/analysis/service.ts';
import type { Db } from '../lib/db/client.ts';
import { simulations, type TranscriptTurn } from '../lib/db/schema.ts';
import type { Skill } from '../lib/domain.ts';
import { ScenarioMetaSchema } from '../lib/scenarios/content.ts';
import { getPlayableVersion, listScenarios } from '../lib/scenarios/service.ts';
import { newUser, testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

const TRANSCRIPT: TranscriptTurn[] = [
  { role: 'prospect', text: 'Allô, oui ?', at: 0 },
  { role: 'seller', text: "Bonjour Monsieur Lefèvre, Albino de Blackstart. Je vous appelle au sujet des appels manqués, vous avez deux minutes ?", at: 2 },
  { role: 'prospect', text: 'Deux minutes, pas plus, je suis sur un chantier.', at: 9, interrupted: true },
  { role: 'seller', text: "Combien d'appels pensez-vous rater par semaine quand vous êtes en intervention ?", at: 13 },
  { role: 'prospect', text: 'Une dizaine, peut-être plus.', at: 18 },
  { role: 'seller', text: 'Je vous propose une démo de vingt minutes jeudi à 18 heures, ça vous va ?', at: 22 },
];

// Faux Claude : renvoie l'analyse fournie, compte les appels, peut échouer à la demande.
function fakeAnalyzer(build: (prompt: string) => ClaudeAnalysis | Error) {
  const calls: string[] = [];
  const analyzer: Analyzer = {
    async analyze(prompt) {
      calls.push(prompt);
      const out = build(prompt);
      if (out instanceof Error) throw out;
      return { analysis: ClaudeAnalysisSchema.parse(out), model: 'claude-test', inputTokens: 1200, outputTokens: 800 };
    },
  };
  return { analyzer, calls };
}

function analysisFor(weights: Partial<Record<Skill, number>>, overrides: Partial<ClaudeAnalysis> = {}): ClaudeAnalysis {
  const skills = (Object.keys(weights) as Skill[]).map((skill, i) => ({
    skill,
    score: 40 + i * 10,
    justification: 'Justification liée à l’appel.',
    evidence:
      i === 0
        ? [
            { turn: 3, quote: "Combien d'appels pensez-vous rater par semaine" },
            { turn: 3, quote: 'Citation inventée qui ne figure nulle part' },
            { turn: 4, quote: 'Une dizaine' },
          ]
        : [],
  }));
  return {
    summary: 'Bon début, conclusion trop rapide.',
    outcome: 'postponed',
    skills,
    successCriteria: [{ criterion: 'Date de démo', met: false, evidence: 'Proposée mais pas acceptée.' }],
    hiddenFacts: [{ fact: 'Une dizaine d’appels', uncovered: true, howToUncover: 'Déjà découvert.' }],
    objections: [{ objection: 'Pas le temps', handling: 'partly', comment: 'Reconnue, pas traitée.' }],
    strengths: ['Question chiffrée'],
    improvements: [
      { turn: 5, said: 'Je vous propose une démo de vingt minutes jeudi', better: 'Qu’est-ce qui vous arrangerait…', why: 'Laisser choisir.' },
      { turn: 1, said: 'Phrase jamais prononcée', better: '…', why: '…' },
    ],
    focusSkills: ['closing'],
    ...overrides,
  };
}

async function completedSimulation(name: string, transcript = TRANSCRIPT) {
  const { auth } = await newUser(db, name);
  const [scenario] = await listScenarios(db, auth, { scope: 'catalog', language: 'fr', family: 'cold_call' });
  const playable = (await getPlayableVersion(db, auth, scenario.id))!;
  const [sim] = await db
    .insert(simulations)
    .values({
      organizationId: auth.organization.id,
      userId: auth.user.id,
      scenarioVersionId: playable.versionId,
      status: 'completed',
      transcript,
      durationSeconds: 30,
    })
    .returning();
  return { auth, sim, playable, weights: playable.content.skillWeights as Partial<Record<Skill, number>> };
}

test('analyse : score global pondéré calculé par le serveur, citations inventées écartées', async () => {
  const { sim, playable, weights } = await completedSimulation('Anaïs');
  const { analyzer, calls } = fakeAnalyzer(() => analysisFor(weights));
  const row = await analyzeSimulation(db, analyzer, sim.id);
  assert.equal(row?.status, 'completed');
  const result = row!.result as AnalysisResult;
  const skills = Object.keys(weights) as Skill[];
  const expected = Math.round(
    skills.reduce((n, s, i) => n + (40 + i * 10) * weights[s]!, 0) / skills.reduce((n, s) => n + weights[s]!, 0),
  );
  assert.equal(result.overallScore, expected);
  const [stored] = await db.select().from(simulations).where(eq(simulations.id, sim.id));
  assert.equal(stored.overallScore, expected, 'le score alimente le tableau de bord');
  // Seule la citation réelle d'une réplique du vendeur est gardée (pas l'inventée, pas celle du prospect).
  assert.deepEqual(result.skills.find((x) => x.skill === skills[0])?.evidence, [{ turn: 3, quote: "Combien d'appels pensez-vous rater par semaine" }]);
  assert.equal(result.improvements.length, 1);
  assert.equal(row!.inputTokens, 1200);
  // Exercices recommandés : d'autres scénarios, dans la langue de l'appel.
  assert.ok(result.recommendedScenarioIds.length > 0);
  assert.ok(!result.recommendedScenarioIds.includes(playable.scenario.id));
  // Une deuxième demande ne relance pas Claude.
  await analyzeSimulation(db, analyzer, sim.id);
  assert.equal(calls.length, 1);
});

test('analyse : la consigne place les règles avant les données et inclut ce que le vendeur ne voyait pas', async () => {
  const { playable, weights } = await completedSimulation('Bruno');
  const prompt = analysisPrompt({
    meta: ScenarioMetaSchema.parse(playable.scenario),
    content: playable.content,
    weights,
    transcript: TRANSCRIPT,
    feedbackLocale: 'fr',
  });
  assert.match(prompt, /Write all your feedback in French/);
  assert.match(prompt, /\[3\] SELLER: Combien/);
  assert.match(prompt, /\[2\] PROSPECT \(cut off by the seller\)/);
  for (const fact of playable.content.hiddenFacts) assert.ok(prompt.includes(fact));
  assert.ok(prompt.indexOf('<skills_to_score>') > prompt.indexOf('</scenario>'));
});

test('analyse : réponse incomplète enregistrée en échec puis retentée', async () => {
  const { sim, weights } = await completedSimulation('Chloé');
  let attempt = 0;
  const { analyzer } = fakeAnalyzer(() =>
    ++attempt === 1 ? analysisFor(weights, { skills: [] }) : attempt === 2 ? new AnalyzerError('refusal') : analysisFor(weights),
  );
  const first = await analyzeSimulation(db, analyzer, sim.id);
  assert.equal(first?.status, 'failed');
  assert.match(first?.error ?? '', /missing_skills/);
  assert.equal((await analyzeSimulation(db, analyzer, sim.id))?.status, 'failed');
  const third = await analyzeSimulation(db, analyzer, sim.id);
  assert.equal(third?.status, 'completed');
  assert.equal(third?.attempts, 3);
});

test('analyse : appel trop court, Claude n\'est pas appelé', async () => {
  const short: TranscriptTurn[] = [
    { role: 'prospect', text: 'Allô ?', at: 0 },
    { role: 'seller', text: 'Bonjour, je rappelle plus tard.', at: 2 },
  ];
  assert.equal(hasEnoughSpeech(short), false);
  assert.equal(hasEnoughSpeech(TRANSCRIPT), true);
  const { sim } = await completedSimulation('Denis', short);
  const { analyzer, calls } = fakeAnalyzer(() => new Error('ne doit pas être appelé'));
  assert.equal((await analyzeSimulation(db, analyzer, sim.id))?.status, 'insufficient');
  assert.equal(calls.length, 0);
});

test('analyse : une simulation non terminée n\'est pas analysée', async () => {
  const { sim, weights } = await completedSimulation('Emma');
  await db.update(simulations).set({ status: 'processing' }).where(eq(simulations.id, sim.id));
  const { analyzer, calls } = fakeAnalyzer(() => analysisFor(weights));
  assert.equal(await analyzeSimulation(db, analyzer, sim.id), null);
  assert.equal(calls.length, 0);
});

test('sortie structurée : schéma accepté par l\'API (énumérations gardées, bornes retirées)', () => {
  const schema = JSON.stringify(strictJsonSchema(ClaudeAnalysisSchema));
  assert.equal(/"(minimum|maximum|maxItems|minLength|maxLength|\$schema)"/.test(schema), false);
  assert.match(schema, /"enum":\["next_step_won","postponed","lost","unclear"\]/);
  assert.ok(!schema.includes('"additionalProperties":true'));
});
