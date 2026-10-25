import Stripe from 'stripe';
import { CURRENCIES, DEFAULT_PRICES, lookupKey, PAID_PLANS, type Currency, type PaidPlan } from './plans.ts';

// Ce dont l'application a besoin de Stripe. Les tests utilisent un faux fournisseur.
export type PlanPrice = {
  plan: PaidPlan;
  priceId: string;
  productId: string;
  amount: number;
  currency: string;
  interval: string;
};

export type SubscriptionSnapshot = {
  id: string;
  customerId: string;
  status: string;
  priceId: string | null;
  plan: PaidPlan | null;
  currency: string | null;
  itemId: string | null;
  seats: number;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  organizationId: string | null;
};

export type CheckoutSnapshot = {
  organizationId: string | null;
  customerId: string | null;
  subscriptionId: string | null;
};

// Événement Stripe vérifié, réduit à ce qui sert : de quoi relire l'abonnement concerné.
export type WebhookEvent = {
  id: string;
  type: string;
  subscriptionId: string | null;
};

// Facture payée, réduite à ce que le cockpit de l'éditeur affiche.
export type PaidInvoice = { amount: number; currency: string; paidAt: Date };

export class WebhookSignatureError extends Error {}

export interface BillingProvider {
  // Prix des offres dans une monnaie : euros pour l'interface en français, dollars en anglais.
  prices(currency: Currency): Promise<Record<PaidPlan, PlanPrice>>;
  createCustomer(input: { name: string; email: string; organizationId: string }): Promise<string>;
  createCheckout(input: {
    customerId: string;
    price: PlanPrice;
    organizationId: string;
    successUrl: string;
    cancelUrl: string;
    locale: 'fr' | 'en';
  }): Promise<string>;
  getCheckout(sessionId: string): Promise<CheckoutSnapshot>;
  createPortal(input: { customerId: string; returnUrl: string; locale: 'fr' | 'en' }): Promise<string>;
  getSubscription(subscriptionId: string): Promise<SubscriptionSnapshot>;
  // Change l'offre (prix) d'un abonnement en cours, au prorata.
  updateSubscription(subscriptionId: string, itemId: string, priceId: string): Promise<SubscriptionSnapshot>;
  parseWebhook(body: string, signature: string): WebhookEvent;
  // Factures payées depuis une date (2 000 au plus), pour le chiffre d'affaires encaissé.
  paidInvoices(since: Date): Promise<PaidInvoice[]>;
}

const PORTAL_TAG = 'blackstart-sales';

function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === 'string' ? value : value.id;
}

function planOfPrice(price: Stripe.Price | null | undefined, known: Record<PaidPlan, PlanPrice>[]): PaidPlan | null {
  if (!price) return null;
  for (const plan of PAID_PLANS) {
    if (known.some((k) => k[plan].priceId === price.id)) return plan;
    if (CURRENCIES.some((c) => price.lookup_key === lookupKey(plan, c)) || price.metadata?.bs_plan === plan) return plan;
  }
  return null;
}

export function stripeProvider(secretKey: string, webhookSecret: string | null): BillingProvider {
  const stripe = new Stripe(secretKey, {
    maxNetworkRetries: 2,
    timeout: 20_000,
  });
  const cachedPrices = new Map<Currency, { at: number; value: Record<PaidPlan, PlanPrice> }>();
  let portalConfiguration: string | null = null;

  const toPlanPrice = (plan: PaidPlan, price: Stripe.Price): PlanPrice => ({
    plan,
    priceId: price.id,
    productId: idOf(price.product)!,
    amount: price.unit_amount ?? 0,
    currency: price.currency,
    interval: price.recurring?.interval ?? 'month',
  });

  // Prix d'une offre dans une monnaie : l'identifiant fourni (STRIPE_PRICE_STANDARD_EUR, …_USD, etc.), sinon
  // celui créé par l'application sous sa clé de recherche, au premier besoin. Un produit par offre.
  async function priceFor(plan: PaidPlan, currency: Currency): Promise<PlanPrice> {
    const configured = process.env[`STRIPE_PRICE_${plan.toUpperCase()}_${currency.toUpperCase()}`]?.trim();
    if (configured) return toPlanPrice(plan, await stripe.prices.retrieve(configured));
    const spec = DEFAULT_PRICES[plan];
    const found = await stripe.prices.list({ lookup_keys: [lookupKey(plan, currency)], active: true, limit: 1 });
    if (found.data[0]) return toPlanPrice(plan, found.data[0]);
    const products = await stripe.products.search({ query: `metadata['bs_plan']:'${plan}' AND active:'true'`, limit: 1 });
    const product = products.data[0] ?? (await stripe.products.create({ name: spec.name, metadata: { bs_plan: plan } }));
    const price = await stripe.prices.create({
      product: product.id,
      currency,
      unit_amount: spec.amount,
      recurring: { interval: 'month' },
      lookup_key: lookupKey(plan, currency),
      tax_behavior: 'inclusive',
      metadata: { bs_plan: plan },
    });
    return toPlanPrice(plan, price);
  }

  async function prices(currency: Currency) {
    const cached = cachedPrices.get(currency);
    if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.value;
    const value = {
      standard: await priceFor('standard', currency),
      advanced: await priceFor('advanced', currency),
      premium: await priceFor('premium', currency),
    };
    cachedPrices.set(currency, { at: Date.now(), value });
    return value;
  }

  async function snapshot(sub: Stripe.Subscription): Promise<SubscriptionSnapshot> {
    const item = sub.items.data[0];
    return {
      id: sub.id,
      customerId: idOf(sub.customer)!,
      status: sub.status,
      priceId: item?.price.id ?? null,
      currency: item?.price.currency ?? null,
      plan: planOfPrice(item?.price, [...cachedPrices.values()].map((c) => c.value)),
      itemId: item?.id ?? null,
      seats: item?.quantity ?? 1,
      currentPeriodEnd: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      organizationId: sub.metadata?.organizationId ?? null,
    };
  }

  // Portail client : factures, moyen de paiement, coordonnées et résiliation en fin de période.
  async function portalConfigurationId() {
    if (portalConfiguration) return portalConfiguration;
    const list = await stripe.billingPortal.configurations.list({
      limit: 20,
      active: true,
    });
    const existing = list.data.find((c) => c.metadata?.app === PORTAL_TAG);
    portalConfiguration =
      existing?.id ??
      (
        await stripe.billingPortal.configurations.create({
          features: {
            invoice_history: { enabled: true },
            payment_method_update: { enabled: true },
            customer_update: {
              enabled: true,
              allowed_updates: ['email', 'name', 'address', 'tax_id'],
            },
            subscription_cancel: { enabled: true, mode: 'at_period_end' },
          },
          metadata: { app: PORTAL_TAG },
        })
      ).id;
    return portalConfiguration;
  }

  return {
    prices,
    async paidInvoices(since) {
      const invoices = await stripe.invoices
        .list({ status: 'paid', created: { gte: Math.floor(since.getTime() / 1000) }, limit: 100 })
        .autoPagingToArray({ limit: 2000 });
      return invoices.map((invoice) => ({
        amount: invoice.amount_paid,
        currency: invoice.currency,
        paidAt: new Date((invoice.status_transitions?.paid_at ?? invoice.created) * 1000),
      }));
    },
    async createCustomer({ name, email, organizationId }) {
      const customer = await stripe.customers.create({
        name,
        email,
        metadata: { organizationId },
      });
      return customer.id;
    },
    async createCheckout({ customerId, price, organizationId, successUrl, cancelUrl, locale }) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        client_reference_id: organizationId,
        line_items: [{ price: price.priceId, quantity: 1 }],
        subscription_data: { metadata: { organizationId } },
        metadata: { organizationId },
        allow_promotion_codes: true,
        customer_update: { address: 'auto', name: 'auto' },
        success_url: successUrl,
        cancel_url: cancelUrl,
        locale,
      });
      if (!session.url) throw new Error('checkout_without_url');
      return session.url;
    },
    async getCheckout(sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return {
        organizationId: session.client_reference_id ?? session.metadata?.organizationId ?? null,
        customerId: idOf(session.customer),
        subscriptionId: idOf(session.subscription),
      };
    },
    async createPortal({ customerId, returnUrl, locale }) {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
        configuration: await portalConfigurationId(),
        locale,
      });
      return session.url;
    },
    async getSubscription(subscriptionId) {
      return snapshot(await stripe.subscriptions.retrieve(subscriptionId));
    },
    async updateSubscription(subscriptionId, itemId, priceId) {
      return snapshot(
        await stripe.subscriptions.update(subscriptionId, {
          items: [{ id: itemId, price: priceId, quantity: 1 }],
          proration_behavior: 'create_prorations',
        }),
      );
    },
    parseWebhook(body, signature) {
      if (!webhookSecret) throw new WebhookSignatureError('webhook_secret_missing');
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (error) {
        throw new WebhookSignatureError(error instanceof Error ? error.message : 'invalid_signature');
      }
      const object = event.data.object as {
        object?: string;
        id?: string;
        subscription?: unknown;
        mode?: string;
      };
      let subscriptionId: string | null = null;
      if (object.object === 'subscription') subscriptionId = object.id ?? null;
      else if (object.object === 'checkout.session' && object.mode === 'subscription') subscriptionId = idOf(object.subscription as string | null);
      return { id: event.id, type: event.type, subscriptionId };
    },
  };
}

// Un client par processus (Next charge ce module une fois par route) : les prix restent en cache.
const holder = globalThis as typeof globalThis & {
  __blackstartBilling?: { key: string; provider: BillingProvider };
};

export function billingProviderFromEnv(): BillingProvider | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() || null;
  const cacheKey = `${key}:${webhookSecret ?? ''}`;
  if (holder.__blackstartBilling?.key !== cacheKey) {
    holder.__blackstartBilling = {
      key: cacheKey,
      provider: stripeProvider(key, webhookSecret),
    };
  }
  return holder.__blackstartBilling.provider;
}
