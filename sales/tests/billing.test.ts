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
import type { Db } from '../lib/db/client.ts';
import { auditLog, billingAccounts, organizations } from '../lib/db/schema.ts';
import { ScenarioInputSchema } from '../lib/scenarios/content.ts';
import { createScenario, PlanLimitError } from '../lib/scenarios/service.ts';
import { joinOrg, newUser, testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

const PRICES: Record<'pro' | 'team', PlanPrice> = {
  pro: {
    plan: 'pro',
    priceId: 'price_pro',
    productId: 'prod_pro',
    amount: 2900,
    currency: 'eur',
    interval: 'month',
  },
  team: {
    plan: 'team',
    priceId: 'price_team',
    productId: 'prod_team',
    amount: 2500,
    currency: 'eur',
    interval: 'month',
  },
};

// Faux Stripe : garde les clients, sessions et abonnements en mémoire, au format des instantanés.
let fakes = 0;
class FakeStripe implements BillingProvider {
  readonly prefix = `f${++fakes}`;
  customers: { name: string; email: string; organizationId: string }[] = [];
  checkouts: Parameters<BillingProvider['createCheckout']>[0][] = [];
  sessions = new Map<string, CheckoutSnapshot>();
  subscriptions = new Map<string, SubscriptionSnapshot>();
  failSubscription = false;
  async prices() {
    return PRICES;
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
  async updateSubscription(id: string, _itemId: string, priceId: string, seats: number) {
    const sub = {
      ...(await this.getSubscription(id)),
      priceId,
      plan: priceId === 'price_team' ? ('team' as const) : ('pro' as const),
      seats,
    };
    this.subscriptions.set(id, sub);
    return sub;
  }
  parseWebhook(body: string, signature: string): WebhookEvent {
    if (signature !== 'signature-valide') throw new WebhookSignatureError('invalid');
    return JSON.parse(body) as WebhookEvent;
  }
  // Ce que Stripe crée au paiement : un abonnement actif rattaché au client.
  subscribe(customerId: string, plan: 'pro' | 'team', seats = 1, status = 'active') {
    const id = `sub_${this.prefix}_${this.subscriptions.size + 1}`;
    this.subscriptions.set(id, {
      id,
      customerId,
      status,
      priceId: PRICES[plan].priceId,
      plan,
      itemId: `si_${id}`,
      seats,
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

test('offre gratuite : 15 crédits par mois et 3 scénarios privés au plus', async () => {
  const { auth } = await newUser(db, 'Gaspard');
  const credits = await creditStatus(db, auth.organization);
  assert.equal(credits.plan, 'free');
  assert.equal(credits.monthlyCredits, 15);
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

test('paiement : seuls propriétaire et administrateurs passent en caisse ; sièges contrôlés', async () => {
  const fake = new FakeStripe();
  const owner = await newUser(db, 'Hélène');
  const member = await joinOrg(db, owner.auth.organization.id, 'member', 'Igor');
  const manager = await joinOrg(db, owner.auth.organization.id, 'manager', 'Jade');
  for (const auth of [member, manager]) {
    await assert.rejects(startCheckout(db, fake, auth, 'pro', 1, URLS, 'fr'), (e) => e instanceof BillingError && e.code === 'forbidden');
  }
  // Trois personnes dans l'espace : une équipe de 2 sièges ne suffit pas.
  await assert.rejects(startCheckout(db, fake, owner.auth, 'team', 2, URLS, 'fr'), (e) => e instanceof BillingError && e.code === 'invalid_seats');
  const url = await startCheckout(db, fake, owner.auth, 'team', 3, URLS, 'fr');
  assert.equal(url, 'https://checkout.stripe.test/1');
  assert.equal(fake.checkouts[0].seats, 3);
  assert.equal(fake.checkouts[0].price.priceId, 'price_team');
  assert.equal(fake.checkouts[0].organizationId, owner.auth.organization.id);
  // Un seul client Stripe par organisation, même après plusieurs passages en caisse.
  await startCheckout(db, fake, owner.auth, 'pro', 1, URLS, 'fr');
  assert.equal(fake.customers.length, 1);
  assert.equal(fake.customers[0].email, owner.email);
  await assert.rejects(openPortal(db, fake, member, URLS.cancel, 'fr'), (e) => e instanceof BillingError && e.code === 'forbidden');
});

test('webhook : un abonnement test ouvre réellement les droits, une seule fois, puis la résiliation les retire', async () => {
  const fake = new FakeStripe();
  const { auth } = await newUser(db, 'Karim');
  await startCheckout(db, fake, auth, 'pro', 1, URLS, 'fr');
  const [account] = await db.select().from(billingAccounts).where(eq(billingAccounts.organizationId, auth.organization.id));
  const subId = fake.subscribe(account.stripeCustomerId, 'pro');

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
  assert.equal((await orgPlan(auth.organization.id)).plan, 'pro');
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
  await startCheckout(db, fake, auth, 'pro', 1, URLS, 'fr');
  const [account] = await db.select().from(billingAccounts).where(eq(billingAccounts.organizationId, auth.organization.id));
  const oldSub = fake.subscribe(account.stripeCustomerId, 'pro', 1, 'canceled');
  const newSub = fake.subscribe(account.stripeCustomerId, 'pro');
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
  assert.equal((await orgPlan(auth.organization.id)).plan, 'pro');
});

test("retour de paiement : seule la session de sa propre organisation active l'offre", async () => {
  const fake = new FakeStripe();
  const a = await newUser(db, 'Manon');
  const b = await newUser(db, 'Nils');
  await startCheckout(db, fake, a.auth, 'pro', 1, URLS, 'fr');
  const [account] = await db.select().from(billingAccounts).where(eq(billingAccounts.organizationId, a.auth.organization.id));
  const subId = fake.subscribe(account.stripeCustomerId, 'pro');
  fake.sessions.set('cs_test_a', {
    organizationId: a.auth.organization.id,
    customerId: account.stripeCustomerId,
    subscriptionId: subId,
  });
  assert.equal(await confirmCheckout(db, fake, b.auth, 'cs_test_a'), false);
  assert.equal((await orgPlan(b.auth.organization.id)).plan, 'free');
  assert.equal(await confirmCheckout(db, fake, a.auth, 'cs_test_a'), true);
  assert.equal((await orgPlan(a.auth.organization.id)).plan, 'pro');
});

test("changement d'offre : Pro vers Équipe au prorata, retour en Pro refusé tant que l'équipe compte plusieurs membres", async () => {
  const fake = new FakeStripe();
  const owner = await newUser(db, 'Oscar');
  await startCheckout(db, fake, owner.auth, 'pro', 1, URLS, 'fr');
  const [account] = await db.select().from(billingAccounts).where(eq(billingAccounts.organizationId, owner.auth.organization.id));
  const subId = fake.subscribe(account.stripeCustomerId, 'pro');
  await applySubscription(db, fake.subscriptions.get(subId)!);
  await changeSubscription(db, fake, owner.auth, 'team', 3);
  const org = await orgPlan(owner.auth.organization.id);
  assert.deepEqual(org, { plan: 'team', kind: 'team' });
  const credits = await creditStatus(db, {
    id: owner.auth.organization.id,
    plan: org.plan,
  });
  assert.equal(credits.seats, 3);
  assert.equal(credits.monthlyCredits, 180);
  await joinOrg(db, owner.auth.organization.id, 'member', 'Pia');
  await assert.rejects(changeSubscription(db, fake, owner.auth, 'pro', 1), (e) => e instanceof BillingError && e.code === 'invalid_seats');
  await assert.rejects(changeSubscription(db, fake, owner.auth, 'team', 1), (e) => e instanceof BillingError && e.code === 'invalid_seats');
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
