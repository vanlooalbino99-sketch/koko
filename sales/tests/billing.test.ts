import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { getAuthContext } from '../lib/auth/service.ts';
import { creditStatus } from '../lib/billing/credits.ts';
import {
  applySubscription,
  BillingError,
  changeSubscription,
  confirmCheckout,
  handleWebhook,
  openPortal,
  startCheckout,
} from '../lib/billing/service.ts';
import {
  stripeProvider,
  WebhookSignatureError,
  type BillingProvider,
  type CheckoutSnapshot,
  type PlanPrice,
  type SubscriptionSnapshot,
  type WebhookEvent,
} from '../lib/billing/stripe.ts';
import { PAID_PLANS, type Currency, type PaidPlan } from '../lib/billing/plans.ts';
import { syncUnlimited } from '../lib/billing/unlimited.ts';
import type { Db } from '../lib/db/client.ts';
import { auditLog, billingAccounts, organizations, simulations } from '../lib/db/schema.ts';
import { ScenarioInputSchema } from '../lib/scenarios/content.ts';
import { createScenario, getPlayableVersion, listScenarios, PlanLimitError } from '../lib/scenarios/service.ts';
import { joinOrg, newUser, testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

const AMOUNTS: Record<PaidPlan, number> = { standard: 2999, advanced: 5999, premium: 7999 };
function PRICES(currency: Currency): Record<PaidPlan, PlanPrice> {
  const price = (plan: PaidPlan): PlanPrice => ({
    plan,
    priceId: `price_${plan}_${currency}`,
    productId: `prod_${plan}`,
    amount: AMOUNTS[plan],
    currency,
    interval: 'month',
  });
  return { standard: price('standard'), advanced: price('advanced'), premium: price('premium') };
}

// Faux Stripe : garde les clients, sessions et abonnements en mémoire, au format des instantanés.
let fakes = 0;
class FakeStripe implements BillingProvider {
  async paidInvoices() {
    return [];
  }
  readonly prefix = `f${++fakes}`;
  customers: { name: string; email: string; organizationId: string }[] = [];
  checkouts: Parameters<BillingProvider['createCheckout']>[0][] = [];
  sessions = new Map<string, CheckoutSnapshot>();
  subscriptions = new Map<string, SubscriptionSnapshot>();
  failSubscription = false;
  async prices(currency: Currency) {
    return PRICES(currency);
  }
  async createCustomer(input: { name: string; email: string; organizationId: string }) {
    this.customers.push(input);
    return `cus_${this.prefix}_${this.customers.length}`;
  }
  async createCheckout(input: Parameters<BillingProvider['createCheckout']>[0]) {
    this.checkouts.push(input);
    return `https://checkout.stripe.test/${this.checkouts.length}`;
  }
  async getCheckout(id: string) {
    return (
      this.sessions.get(id) ?? {
        organizationId: null,
        customerId: null,
        subscriptionId: null,
      }
    );
  }
  async createPortal() {
    return 'https://billing.stripe.test/portal';
  }
  async getSubscription(id: string) {
    if (this.failSubscription) throw new Error('Stripe indisponible');
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`no such subscription ${id}`);
    return sub;
  }
  async updateSubscription(id: string, _itemId: string, priceId: string) {
    const sub = {
      ...(await this.getSubscription(id)),
      priceId,
      plan: PAID_PLANS.find((p) => priceId.startsWith(`price_${p}_`)) ?? null,
    };
    this.subscriptions.set(id, sub);
    return sub;
  }
  parseWebhook(body: string, signature: string): WebhookEvent {
    if (signature !== 'signature-valide') throw new WebhookSignatureError('invalid');
    return JSON.parse(body) as WebhookEvent;
  }
  // Ce que Stripe crée au paiement : un abonnement actif rattaché au client.
  subscribe(customerId: string, plan: PaidPlan, status = 'active', currency: Currency = 'eur') {
    const id = `sub_${this.prefix}_${this.subscriptions.size + 1}`;
    this.subscriptions.set(id, {
      id,
      customerId,
      status,
      priceId: PRICES(currency)[plan].priceId,
      plan,
      currency,
      itemId: `si_${id}`,
      seats: 1,
      currentPeriodEnd: new Date(Date.now() + 30 * 86_400_000),
      cancelAtPeriodEnd: false,
      organizationId: null,
    });
    return id;
  }
}

const URLS = {
  success: 'https://app.test/billing?checkout={CHECKOUT_SESSION_ID}',
  cancel: 'https://app.test/billing?canceled=1',
};

async function orgPlan(id: string) {
  const [org] = await db.select({ plan: organizations.plan, kind: organizations.kind }).from(organizations).where(eq(organizations.id, id));
  return org;
}

function webhook(fake: FakeStripe, event: WebhookEvent, signature = 'signature-valide') {
  return handleWebhook(db, fake, JSON.stringify(event), signature);
}

test("essai gratuit : 2 appels de 5 minutes en tout et 3 scénarios privés au plus", async () => {
  const { auth } = await newUser(db, 'Gaspard');
  const credits = await creditStatus(db, auth.organization);
  assert.equal(credits.plan, 'free');
  assert.equal(credits.trialCalls, 2);
  assert.equal(credits.trialCallsLeft, 2);
  assert.equal(credits.maxCallMinutes, 5);
  assert.equal(credits.monthlyCredits, 10);
  assert.equal(credits.concurrentCalls, 1);
  const input = ScenarioInputSchema.parse({
    meta: {
      title: 'Relance d’un devis',
      summary: 'Relancer un devis envoyé la semaine dernière.',
      industry: 'BTP',
      family: 'follow_up',
      difficulty: 'beginner',
      language: 'fr',
      channel: 'phone',
      estimatedMinutes: 5,
    },
    content: {
      objective: 'Obtenir une date de décision.',
      context: 'Devis envoyé il y a huit jours.',
      offer: {
        name: 'Standard IA',
        description: 'Répond aux appels manqués.',
        price: '49 € / mois',
      },
      prospect: {
        name: 'Sophie Martin',
        role: 'Gérante',
        company: 'Martin Rénovation',
        companySize: '8 salariés',
        personality: 'busy',
        decisionPower: 'decider',
        publicProfile: '',
      },
      need: 'Ne plus rater d’appels.',
      budget: '50 € par mois',
      objections: ['Pas le temps'],
      constraints: [],
      hiddenFacts: ['A déjà un devis concurrent'],
      successCriteria: ['Date de décision obtenue'],
      endConditions: [],
      skillWeights: { closing: 3 },
    },
  });
  for (let i = 0; i < 3; i++) await createScenario(db, auth, input);
  await assert.rejects(createScenario(db, auth, input), PlanLimitError);
});

test("essai gratuit : épuisé après deux appels aboutis, même s'il reste des minutes ; un appel échoué ne compte pas", async () => {
  const { auth } = await newUser(db, 'Gilles');
  const [scenario] = await listScenarios(db, auth, { scope: 'catalog', language: 'fr', family: 'cold_call' });
  const playable = (await getPlayableVersion(db, auth, scenario.id))!;
  const call = (status: 'completed' | 'failed', durationSeconds: number) =>
    db.insert(simulations).values({
      organizationId: auth.organization.id,
      userId: auth.user.id,
      scenarioVersionId: playable.versionId,
      status,
      durationSeconds,
    });
  await call('failed', 0);
  await call('completed', 60);
  let credits = await creditStatus(db, auth.organization);
  assert.equal(credits.trialCallsLeft, 1);
  assert.equal(credits.remaining, 10, 'aucun débit enregistré : les minutes restent entières');
  await call('completed', 90);
  credits = await creditStatus(db, auth.organization);
  assert.equal(credits.trialCallsUsed, 2);
  assert.equal(credits.trialCallsLeft, 0);
  assert.equal(credits.remaining, 0);
});

test('accès illimité offert : ni essai ni plafond de minutes, droits de Premium, appel toujours borné à 15 minutes', async () => {
  const { auth } = await newUser(db, 'Hector');
  await db.update(organizations).set({ unlimited: true }).where(eq(organizations.id, auth.organization.id));
  const [scenario] = await listScenarios(db, auth, { scope: 'catalog', language: 'fr', family: 'cold_call' });
  const playable = (await getPlayableVersion(db, auth, scenario.id))!;
  for (let i = 0; i < 3; i++) {
    await db.insert(simulations).values({
      organizationId: auth.organization.id,
      userId: auth.user.id,
      scenarioVersionId: playable.versionId,
      status: 'completed',
      durationSeconds: 600,
    });
  }
  const credits = await creditStatus(db, auth.organization);
  assert.equal(credits.plan, 'free');
  assert.equal(credits.unlimited, true);
  assert.equal(credits.trialCalls, null);
  assert.equal(credits.trialCallsLeft, null);
  assert.ok(credits.remaining > 100_000);
  assert.equal(credits.maxCallMinutes, 15);
  assert.equal(credits.privateScenarios, null);
  assert.equal(credits.teamSpace, true);
  // Un espace ordinaire n'en profite pas.
  const other = await newUser(db, 'Inès');
  assert.equal((await creditStatus(db, other.auth.organization)).unlimited, false);
});

test('accès illimité : recopié depuis la liste des e-mails pour les espaces possédés, retiré quand l’e-mail sort de la liste', async () => {
  const owner = await newUser(db, 'Jules');
  const member = await joinOrg(db, owner.auth.organization.id, 'member', 'Katia');
  const unlimited = async (id: string) => (await db.select({ u: organizations.unlimited }).from(organizations).where(eq(organizations.id, id)))[0].u;
  // Simple membre de l'espace : sa présence dans la liste n'ouvre rien.
  await syncUnlimited(db, [member.user.email]);
  assert.equal(await unlimited(owner.auth.organization.id), false);
  await syncUnlimited(db, [owner.email.toUpperCase()]);
  assert.equal(await unlimited(owner.auth.organization.id), true);
  await syncUnlimited(db, []);
  assert.equal(await unlimited(owner.auth.organization.id), false);
});

test('paiement : seuls propriétaire et administrateurs passent en caisse ; une offre solo refuse un espace à plusieurs', async () => {
  const fake = new FakeStripe();
  const owner = await newUser(db, 'Hélène');
  const member = await joinOrg(db, owner.auth.organization.id, 'member', 'Igor');
  const manager = await joinOrg(db, owner.auth.organization.id, 'manager', 'Jade');
  for (const auth of [member, manager]) {
    await assert.rejects(startCheckout(db, fake, auth, 'standard', URLS, 'fr'), (e) => e instanceof BillingError && e.code === 'forbidden');
  }
  // Trois personnes dans l'espace : seule l'offre Premium (espace équipe) convient.
  for (const plan of ['standard', 'advanced'] as const) {
    await assert.rejects(startCheckout(db, fake, owner.auth, plan, URLS, 'fr'), (e) => e instanceof BillingError && e.code === 'too_many_members');
  }
  const url = await startCheckout(db, fake, owner.auth, 'premium', URLS, 'fr');
  assert.equal(url, 'https://checkout.stripe.test/1');
  assert.equal(fake.checkouts[0].price.priceId, 'price_premium_eur');
  assert.equal(fake.checkouts[0].organizationId, owner.auth.organization.id);
  // Un seul client Stripe par organisation, même après plusieurs passages en caisse.
  await startCheckout(db, fake, owner.auth, 'premium', URLS, 'fr');
  assert.equal(fake.customers.length, 1);
  assert.equal(fake.customers[0].email, owner.email);
  await assert.rejects(openPortal(db, fake, member, URLS.cancel, 'fr'), (e) => e instanceof BillingError && e.code === 'forbidden');
});

test('webhook : un abonnement test ouvre réellement les droits, une seule fois, puis la résiliation les retire', async () => {
  const fake = new FakeStripe();
  const { auth } = await newUser(db, 'Karim');
  await startCheckout(db, fake, auth, 'standard', URLS, 'fr');
  const [account] = await db.select().from(billingAccounts).where(eq(billingAccounts.organizationId, auth.organization.id));
  const subId = fake.subscribe(account.stripeCustomerId, 'standard');

  await assert.rejects(
    webhook(
      fake,
      {
        id: 'evt_1',
        type: 'customer.subscription.created',
        subscriptionId: subId,
      },
      'fausse',
    ),
    WebhookSignatureError,
  );
  assert.equal((await orgPlan(auth.organization.id)).plan, 'free', 'signature invalide : aucun droit ouvert');

  assert.equal(
    await webhook(fake, {
      id: 'evt_1',
      type: 'customer.subscription.created',
      subscriptionId: subId,
    }),
    'applied',
  );
  assert.equal((await orgPlan(auth.organization.id)).plan, 'standard');
  const fresh = (await getAuthContext(db, (await newSessionToken(auth)) ?? ''))!;
  assert.equal((await creditStatus(db, fresh.organization)).monthlyCredits, 60);
  assert.equal(
    await webhook(fake, {
      id: 'evt_1',
      type: 'customer.subscription.created',
      subscriptionId: subId,
    }),
    'duplicate',
  );

  // Stripe en panne au moment du webhook : l'événement est rejoué plus tard et traité.
  fake.subscriptions.set(subId, {
    ...fake.subscriptions.get(subId)!,
    status: 'canceled',
  });
  fake.failSubscription = true;
  await assert.rejects(
    webhook(fake, {
      id: 'evt_2',
      type: 'customer.subscription.deleted',
      subscriptionId: subId,
    }),
  );
  fake.failSubscription = false;
  assert.equal(
    await webhook(fake, {
      id: 'evt_2',
      type: 'customer.subscription.deleted',
      subscriptionId: subId,
    }),
    'applied',
  );
  assert.equal((await orgPlan(auth.organization.id)).plan, 'free');
  const logs = await db.select().from(auditLog).where(eq(auditLog.organizationId, auth.organization.id));
  assert.ok(logs.some((l) => l.action === 'billing.subscription_synced'));
});

// Session neuve du même compte : le contexte relit l'offre en base.
async function newSessionToken(auth: { user: { email: string } }) {
  const { logIn } = await import('../lib/auth/service.ts');
  return (await logIn(db, auth.user.email, 'motdepasse-solide'))?.token;
}

test("webhook : la fin d'un ancien abonnement ne retire pas les droits du nouveau", async () => {
  const fake = new FakeStripe();
  const { auth } = await newUser(db, 'Léon');
  await startCheckout(db, fake, auth, 'standard', URLS, 'fr');
  const [account] = await db.select().from(billingAccounts).where(eq(billingAccounts.organizationId, auth.organization.id));
  const oldSub = fake.subscribe(account.stripeCustomerId, 'standard', 'canceled');
  const newSub = fake.subscribe(account.stripeCustomerId, 'standard');
  await webhook(fake, {
    id: `evt_${newSub}`,
    type: 'customer.subscription.created',
    subscriptionId: newSub,
  });
  assert.equal(
    await webhook(fake, {
      id: `evt_${oldSub}`,
      type: 'customer.subscription.deleted',
      subscriptionId: oldSub,
    }),
    'ignored',
  );
  assert.equal((await orgPlan(auth.organization.id)).plan, 'standard');
});

test("retour de paiement : seule la session de sa propre organisation active l'offre", async () => {
  const fake = new FakeStripe();
  const a = await newUser(db, 'Manon');
  const b = await newUser(db, 'Nils');
  await startCheckout(db, fake, a.auth, 'standard', URLS, 'fr');
  const [account] = await db.select().from(billingAccounts).where(eq(billingAccounts.organizationId, a.auth.organization.id));
  const subId = fake.subscribe(account.stripeCustomerId, 'standard');
  fake.sessions.set('cs_test_a', {
    organizationId: a.auth.organization.id,
    customerId: account.stripeCustomerId,
    subscriptionId: subId,
  });
  assert.equal(await confirmCheckout(db, fake, b.auth, 'cs_test_a'), false);
  assert.equal((await orgPlan(b.auth.organization.id)).plan, 'free');
  assert.equal(await confirmCheckout(db, fake, a.auth, 'cs_test_a'), true);
  assert.equal((await orgPlan(a.auth.organization.id)).plan, 'standard');
});

test('monnaie : euros pour l’interface en français, dollars en anglais', async () => {
  const fake = new FakeStripe();
  const fr = await newUser(db, 'Quentin');
  const en = await newUser(db, 'Rose');
  await startCheckout(db, fake, fr.auth, 'premium', URLS, 'fr');
  await startCheckout(db, fake, en.auth, 'premium', URLS, 'en');
  assert.deepEqual(
    fake.checkouts.map((c) => [c.price.priceId, c.price.amount, c.locale]),
    [
      ['price_premium_eur', 7999, 'fr'],
      ['price_premium_usd', 7999, 'en'],
    ],
  );
});

test("changement d'offre : Standard vers Premium au prorata dans la monnaie de l'abonnement, retour refusé tant que l'équipe compte plusieurs membres", async () => {
  const fake = new FakeStripe();
  const owner = await newUser(db, 'Oscar');
  await startCheckout(db, fake, owner.auth, 'standard', URLS, 'en');
  const [account] = await db.select().from(billingAccounts).where(eq(billingAccounts.organizationId, owner.auth.organization.id));
  const subId = fake.subscribe(account.stripeCustomerId, 'standard', 'active', 'usd');
  await applySubscription(db, fake.subscriptions.get(subId)!);
  // Interface passée en français entre-temps : l'abonnement reste en dollars.
  await changeSubscription(db, fake, owner.auth, 'premium', 'fr');
  assert.equal(fake.subscriptions.get(subId)!.priceId, 'price_premium_usd');
  const org = await orgPlan(owner.auth.organization.id);
  assert.deepEqual(org, { plan: 'premium', kind: 'team' });
  const credits = await creditStatus(db, {
    id: owner.auth.organization.id,
    plan: org.plan,
  });
  assert.equal(credits.seats, 10);
  assert.equal(credits.monthlyCredits, 300);
  await joinOrg(db, owner.auth.organization.id, 'member', 'Pia');
  await assert.rejects(changeSubscription(db, fake, owner.auth, 'advanced', 'fr'), (e) => e instanceof BillingError && e.code === 'too_many_members');
});

test('vrai client Stripe : la signature du webhook est vérifiée sur le corps brut', () => {
  const secret = 'whsec_test_secret';
  const provider = stripeProvider('sk_test_fake', secret);
  const stripe = new Stripe('sk_test_fake');
  const payload = JSON.stringify({
    id: 'evt_test_1',
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        object: 'checkout.session',
        id: 'cs_test_1',
        mode: 'subscription',
        subscription: 'sub_123',
      },
    },
  });
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
  assert.deepEqual(provider.parseWebhook(payload, header), {
    id: 'evt_test_1',
    type: 'checkout.session.completed',
    subscriptionId: 'sub_123',
  });
  assert.throws(() => provider.parseWebhook(payload.replace('sub_123', 'sub_999'), header), WebhookSignatureError);
  const other = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: 'whsec_autre',
  });
  assert.throws(() => provider.parseWebhook(payload, other), WebhookSignatureError);
});
