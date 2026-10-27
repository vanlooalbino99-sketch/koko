import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { and, eq } from 'drizzle-orm';
import { scenarioVersions, scenarios, simulationAnalyses, simulations } from '../lib/db/schema.ts';
import { aiIntelligence, objectionKind } from '../lib/dashboard/intelligence.ts';
import type { Db } from '../lib/db/client.ts';
import { newUser, testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

const DAY = 86_400_000;

async function versionOf(slug: string) {
  const [scenario] = await db.select().from(scenarios).where(eq(scenarios.slug, slug));
  const [version] = await db
    .select()
    .from(scenarioVersions)
    .where(and(eq(scenarioVersions.scenarioId, scenario.id), eq(scenarioVersions.version, scenario.currentVersion)));
  return { scenario, version };
}

test('objections : familles reconnues dans le texte', () => {
  assert.equal(objectionKind("C'est trop cher, un freelance m'a proposé 2 000 €."), 'price');
  assert.equal(objectionKind('Vous pouvez faire un geste ?'), 'price');
  assert.equal(objectionKind('Il faut que j’en parle au directeur financier.'), 'authority');
  assert.equal(objectionKind('Rappelez-moi le mois prochain.'), 'timing');
  assert.equal(objectionKind('We already have a website and it works.'), 'competition');
  assert.equal(objectionKind('Just send me an email.'), 'brush_off');
  assert.equal(objectionKind('What if it does not sell more?'), 'trust');
  assert.equal(objectionKind('Le support a été lent cet été.'), 'other');
});

test('Intelligence IA : rien sans appel analysé, puis point faible, objections prix et exercice tirés des analyses', async () => {
  const { auth } = await newUser(db, 'Yasmine');
  const now = new Date();
  assert.equal(await aiIntelligence(db, auth, { locale: 'fr', experience: 'beginner', now }), null, 'aucun chiffre inventé');

  const { version } = await versionOf('closing-sales-training-fr');
  const at = (days: number) => new Date(now.getTime() - days * DAY);
  const mine = { organizationId: auth.organization.id, userId: auth.user.id, scenarioVersionId: version.id, status: 'completed' as const };
  const sims = await db
    .insert(simulations)
    .values([
      { ...mine, overallScore: 48, createdAt: at(1) },
      { ...mine, overallScore: 70, createdAt: at(3) },
      // Semaine précédente : seulement pour la comparaison.
      { ...mine, overallScore: 40, createdAt: at(9) },
    ])
    .returning({ id: simulations.id });
  const weights = { closing: 5, objection_handling: 4, opening: 1 };
  await db.insert(simulationAnalyses).values([
    {
      simulationId: sims[0].id,
      status: 'completed',
      result: {
        summary: 'Bonne ouverture, mais le prix a été défendu trop vite.',
        outcome: 'lost',
        weights,
        skills: [{ skill: 'closing', score: 40 }, { skill: 'objection_handling', score: 30 }, { skill: 'opening', score: 90 }],
        objections: [
          { objection: 'Un concurrent propose une formation en ligne à 7 000 €.', handling: 'poorly', comment: 'Comparez la valeur avant le prix.' },
          { objection: 'Il faut que j’en parle au directeur financier.', handling: 'well', comment: '' },
        ],
        strengths: ['Accroche courte.'],
        improvements: [{ turn: 3, said: 'On peut baisser le prix.', better: 'Qu’est-ce qui compte le plus pour vous ?', why: 'Ne cédez pas avant de qualifier.' }],
        hiddenFacts: [{ fact: 'Budget validé', uncovered: false, howToUncover: 'Quel budget avez-vous prévu ?' }],
        successCriteria: [{ criterion: 'Obtenir un rendez-vous', met: false, evidence: '' }],
      },
    },
    {
      simulationId: sims[1].id,
      status: 'completed',
      result: {
        outcome: 'next_step_won',
        weights,
        skills: [{ skill: 'closing', score: 80 }, { skill: 'objection_handling', score: 60 }, { skill: 'opening', score: 80 }],
        objections: [{ objection: 'Sans 20 % de remise, on passe chez votre concurrent.', handling: 'partly', comment: 'Demandez une contrepartie.' }],
        strengths: ['Accroche courte.', 'Rendez-vous reformulé.'],
      },
    },
    { simulationId: sims[2].id, status: 'completed', result: { weights, skills: [{ skill: 'closing', score: 40 }] } },
  ]);

  const intel = (await aiIntelligence(db, auth, { locale: 'fr', experience: 'beginner', now }))!;
  assert.equal(intel.scope, 'week');
  assert.equal(intel.calls, 2);
  assert.equal(intel.score, 59);
  assert.equal(intel.previousScore, 40);
  assert.equal(intel.nextSteps, 1);
  // Points perdus par appel (poids / 10) : objections (70 × 4 + 40 × 4) / 2 / 10 = 22 ; closing (60 × 5 + 20 × 5) / 2 / 10 = 20.
  assert.equal(intel.weakest?.skill, 'objection_handling');
  assert.equal(intel.weakest?.cost, 22);
  assert.equal(intel.weakest?.value, 45);
  assert.equal(intel.weakest?.previous, null);
  assert.equal(intel.skills.find((s) => s.skill === 'closing')?.previous, 40);
  assert.equal(intel.losing?.kind, 'price');
  assert.equal(intel.losing?.raised, 2);
  assert.equal(intel.losing?.poorly, 1);
  assert.equal(intel.losing?.partly, 1);
  assert.equal(intel.losing?.comment, 'Comparez la valeur avant le prix.');
  assert.equal(intel.objections.find((o) => o.kind === 'authority')?.well, 1);
  assert.deepEqual(intel.strengths, ['Accroche courte.', 'Rendez-vous reformulé.']);
  assert.equal(intel.improvements[0].better, 'Qu’est-ce qui compte le plus pour vous ?');
  assert.deepEqual(intel.focus.map((f) => f.kind), ['objection', 'question', 'criterion']);
  assert.equal(intel.strongest[0].skill, 'opening');
  // Exercice : un scénario français qui oppose des objections prix, proche du niveau joué (expert, moyenne 59).
  assert.ok(intel.exercise);
  const [picked] = await db.select().from(scenarios).where(eq(scenarios.id, intel.exercise.scenarioId));
  const { version: pickedVersion } = await versionOf(picked.slug!);
  assert.equal(picked.language, 'fr');
  assert.ok(pickedVersion.content.objections.some((o) => objectionKind(o) === 'price'));
  assert.equal(intel.exercise.reason, 'objection');
  assert.ok(intel.exercise.level >= 2);
  assert.equal(intel.latest?.summary, 'Bonne ouverture, mais le prix a été défendu trop vite.');

  // Plus d'appel cette semaine : les derniers appels analysés, en le disant.
  const later = await aiIntelligence(db, auth, { locale: 'fr', experience: 'beginner', now: new Date(now.getTime() + 20 * DAY) });
  assert.equal(later?.scope, 'recent');
  assert.equal(later?.calls, 3);
  assert.equal(later?.previousScore, null);
});
