import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { and, eq } from 'drizzle-orm';
import { scenarioVersions, scenarios, simulations } from '../lib/db/schema.ts';
import { getDashboard } from '../lib/dashboard/service.ts';
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
