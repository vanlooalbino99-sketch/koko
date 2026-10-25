import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { eq } from 'drizzle-orm';
import { accountsCsv, cockpit } from '../lib/billing/cockpit.ts';
import { DEFAULT_PRICES } from '../lib/billing/plans.ts';
import type { Db } from '../lib/db/client.ts';
import { billingAccounts, organizations, simulations } from '../lib/db/schema.ts';
import { OnboardingSchema, saveProfile } from '../lib/profile/service.ts';
import { getPlayableVersion, listScenarios } from '../lib/scenarios/service.ts';
import { newUser, testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

const DAY = 86_400_000;
const now = new Date();

async function call(auth: Awaited<ReturnType<typeof newUser>>['auth'], daysAgo: number, score: number | null) {
  const [scenario] = await listScenarios(db, auth, { scope: 'catalog', language: 'fr', family: 'cold_call' });
  const playable = (await getPlayableVersion(db, auth, scenario.id))!;
  await db.insert(simulations).values({
    organizationId: auth.organization.id,
    userId: auth.user.id,
    scenarioVersionId: playable.versionId,
    status: 'completed',
    durationSeconds: 120,
    overallScore: score,
    createdAt: new Date(now.getTime() - daysAgo * DAY),
  });
  return scenario;
}

test('cockpit : comptes actifs, MRR, conversion, entonnoir et comptes à risque calculés sur les vraies données', async () => {
  // Un compte Pro actif qui appelle, un compte Équipe en retard de paiement et inactif, un compte gratuit récent.
  const pro = await newUser(db, 'Paula');
  await saveProfile(db, pro.auth, OnboardingSchema.parse({ persona: 'freelance', experience: 'intermediate', goals: ['closing'] }));
  await db.update(organizations).set({ plan: 'standard' }).where(eq(organizations.id, pro.auth.organization.id));
  await db.insert(billingAccounts).values({ organizationId: pro.auth.organization.id, stripeCustomerId: 'cus_pro', stripeSubscriptionId: 'sub_pro', plan: 'standard', status: 'active', seats: 1 });
  const scenario = await call(pro.auth, 1, 70);
  await call(pro.auth, 3, 50);

  const team = await newUser(db, 'Tom');
  await db.update(organizations).set({ plan: 'premium', kind: 'team' }).where(eq(organizations.id, team.auth.organization.id));
  await db.insert(billingAccounts).values({ organizationId: team.auth.organization.id, stripeCustomerId: 'cus_team', stripeSubscriptionId: 'sub_team', plan: 'premium', status: 'past_due', seats: 1 });
  await call(team.auth, 40, 30);

  await newUser(db, 'Fanny');

  const c = await cockpit(db, { days: 30, now, prices: null, invoices: null });
  assert.equal(c.revenue, null, 'sans Stripe, pas de chiffre d’affaires inventé');
  assert.equal(c.activeAccounts.value, 1);
  assert.equal(c.mrr.byPlan.standard, DEFAULT_PRICES.standard.amount);
  assert.equal(c.mrr.byPlan.premium, DEFAULT_PRICES.premium.amount);
  assert.equal(c.mrr.byPlan.advanced, 0);
  assert.equal(c.mrr.subscribers, 2);
  assert.equal(c.score.value, 60);
  assert.equal(c.callsByDay.reduce((a, b) => a + b, 0), 2);
  assert.equal(c.callsByDay.length, 30);
  assert.equal(c.conversion.signups, 3);
  assert.equal(c.conversion.value, 66.7);
  assert.equal(c.funnel.signups, 3);
  assert.equal(c.funnel.onboarded, 1);
  assert.equal(c.funnel.called, 2);
  assert.equal(c.funnel.paying, 2);
  assert.deepEqual(c.topScenarios.map((s) => [s.id, s.n]), [[scenario.id, 2]]);
  assert.equal(c.facets.find((f) => f.key === 'payments')?.value, 50, 'un abonnement sur deux en retard de paiement');

  const [first, second] = c.accounts;
  assert.equal(first.name, team.auth.organization.name, 'le compte le plus fragile en tête');
  assert.equal(first.risk, 'past_due');
  assert.equal(first.health, 25);
  assert.equal(second.risk, 'none');
  assert.equal(second.callsInPeriod, 2);
  assert.equal(c.insight.ready, false, 'trop peu d’espaces pour une tendance');

  // Encaissé : seules les factures payées de la période comptent.
  const withStripe = await cockpit(db, {
    days: 7,
    now,
    prices: null,
    invoices: [
      { amount: 2900, currency: 'eur', paidAt: new Date(now.getTime() - DAY) },
      { amount: 7500, currency: 'eur', paidAt: new Date(now.getTime() - 10 * DAY) },
    ],
  });
  assert.equal(withStripe.revenue?.total, 2900);
  assert.equal(withStripe.revenue?.previous, 7500);
});

test('export CSV : les cellules qui ressemblent à une formule sont neutralisées', () => {
  const csv = accountsCsv(
    [{ id: '1', name: '=HYPERLINK("x")', plan: 'free', health: 60, weekly: [], daily: [], lastActivity: null, usage: 10, mrr: 0, currency: 'eur', callsInPeriod: 0, risk: 'inactive' }],
    ['Compte', 'Offre', 'Santé', 'Dernière activité', 'Appels', 'Usage', 'MRR', 'Risque'],
  );
  assert.match(csv, /^Compte,Offre/);
  assert.match(csv, /\n"'=HYPERLINK\(""x""\)",free,60,,0,10%,0\.00,inactive\n$/);
});
