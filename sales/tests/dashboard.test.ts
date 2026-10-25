import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { and, eq } from 'drizzle-orm';
import { scenarioVersions, scenarios, simulationAnalyses, simulations } from '../lib/db/schema.ts';
import { getDashboard } from '../lib/dashboard/service.ts';
import { periodOf, sessionsCsv, trainingPulse } from '../lib/dashboard/pulse.ts';
import { getProfile, OnboardingSchema, saveProfile } from '../lib/profile/service.ts';
import { getAuthContext } from '../lib/auth/service.ts';
import type { Db } from '../lib/db/client.ts';
import { newUser, testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

test('dashboard : zéro partout pour un nouveau compte, aucun chiffre inventé', async () => {
  const { auth } = await newUser(db, 'Nina');
  const d = await getDashboard(db, auth);
  assert.equal(d.completedSimulations, 0);
  assert.equal(d.practiceMinutes, 0);
  assert.equal(d.averageScore, null);
  assert.deepEqual(d.recent, []);
  assert.deepEqual(d.scoreHistory, []);
  assert.equal(d.catalogScenarios, 16);
  assert.equal(d.members, 1);
});

test('dashboard : ne compte que les simulations de l\'utilisateur dans son organisation', async () => {
  const a = await newUser(db, 'Ali');
  const b = await newUser(db, 'Bea');
  const [scenario] = await db.select().from(scenarios).where(eq(scenarios.slug, 'closing-sales-training-fr'));
  const [version] = await db
    .select()
    .from(scenarioVersions)
    .where(and(eq(scenarioVersions.scenarioId, scenario.id), eq(scenarioVersions.version, scenario.currentVersion)));
  const base = { scenarioVersionId: version.id, status: 'completed' };
  await db.insert(simulations).values([
    { ...base, organizationId: a.auth.organization.id, userId: a.auth.user.id, durationSeconds: 300, overallScore: 60 },
    { ...base, organizationId: a.auth.organization.id, userId: a.auth.user.id, durationSeconds: 420, overallScore: 71 },
    { ...base, organizationId: b.auth.organization.id, userId: b.auth.user.id, durationSeconds: 999, overallScore: 10 },
  ]);
  const d = await getDashboard(db, a.auth);
  assert.equal(d.completedSimulations, 2);
  assert.equal(d.practiceMinutes, 12);
  assert.equal(d.averageScore, 66);
  assert.equal(d.recent.length, 2);
  assert.equal(d.recent[0].title, scenario.title);
  assert.deepEqual(d.scoreHistory.map((h) => h.score).sort(), [60, 71]);
});

test('tableau de bord : période, période précédente, compétences et issues lues dans les analyses', async () => {
  const { auth } = await newUser(db, 'Lena');
  const other = await newUser(db, 'Omar');
  const [scenario] = await db.select().from(scenarios).where(eq(scenarios.slug, 'closing-sales-training-fr'));
  const [version] = await db
    .select()
    .from(scenarioVersions)
    .where(and(eq(scenarioVersions.scenarioId, scenario.id), eq(scenarioVersions.version, scenario.currentVersion)));
  const DAY = 86_400_000;
  const now = new Date();
  const at = (daysAgo: number) => new Date(now.getTime() - daysAgo * DAY);
  const mine = { organizationId: auth.organization.id, userId: auth.user.id, scenarioVersionId: version.id };
  const sims = await db
    .insert(simulations)
    .values([
      { ...mine, status: 'completed', durationSeconds: 600, overallScore: 40, createdAt: at(10) },
      { ...mine, status: 'completed', durationSeconds: 300, overallScore: 80, createdAt: at(2) },
      { ...mine, status: 'failed', durationSeconds: null, overallScore: null, createdAt: at(1) },
      // Période précédente (entre 30 et 60 jours) : sert seulement à la comparaison.
      { ...mine, status: 'completed', durationSeconds: 120, overallScore: 50, createdAt: at(45) },
      // Un autre utilisateur : jamais compté.
      { organizationId: other.auth.organization.id, userId: other.auth.user.id, scenarioVersionId: version.id, status: 'completed', durationSeconds: 900, overallScore: 99, createdAt: at(3) },
    ])
    .returning({ id: simulations.id });
  await db.insert(simulationAnalyses).values([
    {
      simulationId: sims[0].id,
      status: 'completed',
      result: { outcome: 'lost', focusSkills: ['closing'], skills: [{ skill: 'closing', score: 30 }, { skill: 'opening', score: 70 }] },
    },
    {
      simulationId: sims[1].id,
      status: 'completed',
      result: { outcome: 'next_step_won', focusSkills: ['opening'], skills: [{ skill: 'closing', score: 50 }, { skill: 'opening', score: 90 }] },
    },
  ]);

  const p = await trainingPulse(db, auth, { days: 30, now });
  assert.equal(p.calls.value, 2);
  assert.equal(p.calls.previous, 1);
  assert.equal(p.calls.byDay.length, 30);
  assert.equal(p.calls.byDay.reduce((a, b) => a + b, 0), 2);
  assert.equal(p.minutes.value, 15);
  assert.equal(p.minutes.previous, 2);
  assert.equal(p.score.value, 60);
  assert.equal(p.score.previous, 50);
  assert.deepEqual(p.score.series, [40, 80], 'scores du plus ancien au plus récent');
  assert.equal(p.best, 80);
  assert.equal(p.activeDays.value, 2);
  assert.deepEqual(p.funnel, { started: 3, completed: 2, scored: 2, nextStep: 1 });
  assert.deepEqual(p.outcomes, [{ key: 'next_step_won', n: 1 }, { key: 'lost', n: 1 }]);
  assert.equal(p.weakest?.skill, 'closing');
  assert.equal(p.weakest?.value, 40);
  assert.deepEqual(p.weakest?.history, [30, 50]);
  assert.equal(p.weakest?.state, 'weak');
  assert.equal(p.skills.find((s) => s.skill === 'opening')?.state, 'mastered');
  assert.equal(p.topScenarios[0].n, 2);
  assert.equal(p.families[0].minutes, 15);
  assert.equal(p.sessions[0].status, 'failed');
  assert.equal(p.sessions[1].focus, 'opening');

  // Sur 7 jours, l'appel d'il y a 10 jours passe dans la période précédente.
  const week = await trainingPulse(db, auth, { days: 7, now });
  assert.equal(week.calls.value, 1);
  assert.equal(week.calls.previous, 1);
  assert.equal(periodOf('90'), 90);
  assert.equal(periodOf('365'), 30);

  // Nouveau compte : rien d'inventé.
  const empty = await trainingPulse(db, other.auth, { days: 7, now: at(30) });
  assert.equal(empty.score.value, null);
  assert.equal(empty.best, null);
  assert.equal(empty.weakest, null);

  const csv = sessionsCsv([{ ...p.sessions[1], title: '=HYPERLINK("x")' }], ['Date', 'Scénario', 'Statut', 'Durée', 'Score', 'Issue', 'Point'], () => ({
    status: 'Terminée',
    outcome: '',
    focus: '',
  }));
  assert.match(csv, /"'=HYPERLINK\(""x""\)"/, 'formule neutralisée dans le tableur');
});

test('onboarding : profil enregistré, une équipe renomme son espace', async () => {
  const { auth, token } = await newUser(db, 'Theo');
  const input = OnboardingSchema.parse({
    persona: 'team',
    experience: 'intermediate',
    goals: ['closing', 'objection_handling'],
    offerName: 'Logiciel RH',
    offerDescription: '',
    idealCustomer: 'PME de 50 à 200 salariés',
    averageDeal: '12 000 €',
    organizationName: 'Acme Ventes',
  });
  assert.equal(input.offerDescription, null);
  await saveProfile(db, auth, input);
  const profile = await getProfile(db, auth.user.id);
  assert.deepEqual(profile?.goals, ['closing', 'objection_handling']);
  const after = await getAuthContext(db, token);
  assert.equal(after?.organization.name, 'Acme Ventes');
  assert.equal(after?.organization.kind, 'team');
  assert.equal(OnboardingSchema.safeParse({ ...input, goals: [] }).success, false);
  assert.equal(OnboardingSchema.safeParse({ ...input, goals: ['hacking'] }).success, false);
});
