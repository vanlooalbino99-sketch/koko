import { and, count, eq, isNull } from 'drizzle-orm';
import { audit } from '../audit.ts';
import type { AuthContext } from '../auth/service.ts';
import type { Db } from '../db/client.ts';
import { billingAccounts, invitations, memberships, organizations, stripeEvents, type BillingAccount } from '../db/schema.ts';
import { can } from '../domain.ts';
import { creditStatus, type CreditStatus } from './credits.ts';
import { grantsAccess, TEAM_MAX_SEATS, TEAM_MIN_SEATS, type PaidPlan, type Plan } from './plans.ts';
import type { BillingProvider, SubscriptionSnapshot } from './stripe.ts';

type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

export type BillingErrorCode = 'forbidden' | 'already_subscribed' | 'no_subscription' | 'invalid_seats';

export class BillingError extends Error {
  readonly code: BillingErrorCode;
  constructor(code: BillingErrorCode) {
    super(code);
    this.code = code;
  }
}

export async function getBillingAccount(db: Db, organizationId: string): Promise<BillingAccount | null> {
  const [row] = await db.select().from(billingAccounts).where(eq(billingAccounts.organizationId, organizationId)).limit(1);
  return row ?? null;
}

export type BillingOverview = {
  plan: Plan;
  account: BillingAccount | null;
  credits: CreditStatus;
  canManage: boolean;
  seatsInUse: number;
};

// Sièges occupés : les membres plus les invitations encore valables.
export async function seatsInUse(db: Db | Tx, organizationId: string, now = new Date()): Promise<number> {
  const [[members], pending] = await Promise.all([
    db.select({ n: count() }).from(memberships).where(eq(memberships.organizationId, organizationId)),
    db
      .select({ expiresAt: invitations.expiresAt })
      .from(invitations)
      .where(and(eq(invitations.organizationId, organizationId), isNull(invitations.acceptedAt))),
  ]);
  return members.n + pending.filter((i) => i.expiresAt > now).length;
}

export async function billingOverview(db: Db, auth: AuthContext): Promise<BillingOverview> {
  const [account, credits, used] = await Promise.all([
    getBillingAccount(db, auth.organization.id),
    creditStatus(db, auth.organization),
    seatsInUse(db, auth.organization.id),
  ]);
  return {
    plan: credits.plan,
    account,
    credits,
    canManage: can(auth.role, 'billing:manage'),
    seatsInUse: used,
  };
}

// Client Stripe de l'organisation, créé au premier passage en caisse. L'e-mail est celui de la personne
// qui souscrit : Stripe y envoie les factures.
async function ensureCustomer(db: Db, provider: BillingProvider, auth: AuthContext): Promise<string> {
  const existing = await getBillingAccount(db, auth.organization.id);
  if (existing) return existing.stripeCustomerId;
  const customerId = await provider.createCustomer({
    name: auth.organization.name,
    email: auth.user.email,
    organizationId: auth.organization.id,
  });
  await db
    .insert(billingAccounts)
    .values({
      organizationId: auth.organization.id,
      stripeCustomerId: customerId,
    })
    .onConflictDoNothing();
  return (await getBillingAccount(db, auth.organization.id))!.stripeCustomerId;
}

function validSeats(plan: PaidPlan, seats: number, inUse: number): number | null {
  if (plan === 'pro') return 1;
  if (!Number.isInteger(seats) || seats < Math.max(TEAM_MIN_SEATS, inUse) || seats > TEAM_MAX_SEATS) return null;
  return seats;
}

export async function startCheckout(
  db: Db,
  provider: BillingProvider,
  auth: AuthContext,
  plan: PaidPlan,
  requestedSeats: number,
  urls: { success: string; cancel: string },
  locale: 'fr' | 'en',
): Promise<string> {
  if (!can(auth.role, 'billing:manage')) throw new BillingError('forbidden');
  const account = await getBillingAccount(db, auth.organization.id);
  if (account && grantsAccess(account.status)) throw new BillingError('already_subscribed');
  const seats = validSeats(plan, requestedSeats, await seatsInUse(db, auth.organization.id));
  if (seats === null) throw new BillingError('invalid_seats');
  const prices = await provider.prices();
  const customerId = await ensureCustomer(db, provider, auth);
  const url = await provider.createCheckout({
    customerId,
    price: prices[plan],
    seats,
    organizationId: auth.organization.id,
    successUrl: urls.success,
    cancelUrl: urls.cancel,
    locale,
  });
  await audit(db, {
    action: 'billing.checkout_started',
    organizationId: auth.organization.id,
    actorUserId: auth.user.id,
    metadata: { plan, seats },
  });
  return url;
}

export async function openPortal(db: Db, provider: BillingProvider, auth: AuthContext, returnUrl: string, locale: 'fr' | 'en') {
  if (!can(auth.role, 'billing:manage')) throw new BillingError('forbidden');
  const account = await getBillingAccount(db, auth.organization.id);
  if (!account) throw new BillingError('no_subscription');
  return provider.createPortal({
    customerId: account.stripeCustomerId,
    returnUrl,
    locale,
  });
}

// Abonnement en cours : passer de Pro à Équipe (ou l'inverse) ou changer le nombre de sièges, au prorata.
export async function changeSubscription(db: Db, provider: BillingProvider, auth: AuthContext, plan: PaidPlan, requested: number) {
  if (!can(auth.role, 'billing:manage')) throw new BillingError('forbidden');
  const account = await getBillingAccount(db, auth.organization.id);
  if (!account?.stripeSubscriptionId || !grantsAccess(account.status)) throw new BillingError('no_subscription');
  const inUse = await seatsInUse(db, auth.organization.id);
  // Repasser en Pro (un seul siège) suppose de n'avoir plus qu'un membre.
  const seats = plan === 'pro' ? (inUse <= 1 ? 1 : null) : validSeats('team', requested, inUse);
  const current = await provider.getSubscription(account.stripeSubscriptionId);
  if (seats === null || !current.itemId) throw new BillingError('invalid_seats');
  const prices = await provider.prices();
  const updated = await provider.updateSubscription(current.id, current.itemId, prices[plan].priceId, seats);
  await applySubscription(db, updated);
  await audit(db, {
    action: 'billing.subscription_changed',
    organizationId: auth.organization.id,
    actorUserId: auth.user.id,
    metadata: { plan, seats },
  });
}

// Recopie l'état d'un abonnement Stripe et ouvre ou ferme les droits de l'offre en conséquence.
export async function applySubscription(db: Db, snap: SubscriptionSnapshot): Promise<'applied' | 'ignored'> {
  const [byCustomer] = await db.select().from(billingAccounts).where(eq(billingAccounts.stripeCustomerId, snap.customerId)).limit(1);
  let account: BillingAccount | null = byCustomer ?? null;
  if (!account) {
    // Client créé hors de l'application : l'abonnement doit désigner une organisation existante.
    if (!snap.organizationId || !/^[0-9a-f-]{36}$/i.test(snap.organizationId)) return 'ignored';
    const [org] = await db.select({ id: organizations.id }).from(organizations).where(eq(organizations.id, snap.organizationId)).limit(1);
    if (!org) return 'ignored';
    await db.insert(billingAccounts).values({ organizationId: org.id, stripeCustomerId: snap.customerId }).onConflictDoNothing();
    account = await getBillingAccount(db, org.id);
    if (!account || account.stripeCustomerId !== snap.customerId) return 'ignored';
  }
  // La fin d'un ancien abonnement ne retire pas les droits ouverts par le nouveau.
  if (account.stripeSubscriptionId && account.stripeSubscriptionId !== snap.id && !grantsAccess(snap.status)) return 'ignored';

  const effective: Plan = grantsAccess(snap.status) && snap.plan ? snap.plan : 'free';
  const organizationId = account.organizationId;
  await db.transaction(async (tx) => {
    await tx
      .update(billingAccounts)
      .set({
        stripeSubscriptionId: snap.id,
        plan: snap.plan,
        status: snap.status,
        seats: Math.max(1, snap.seats),
        currentPeriodEnd: snap.currentPeriodEnd,
        cancelAtPeriodEnd: snap.cancelAtPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(billingAccounts.organizationId, organizationId));
    await tx
      .update(organizations)
      .set({
        plan: effective,
        ...(effective === 'team' ? { kind: 'team' } : {}),
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, organizationId));
    await audit(tx, {
      action: 'billing.subscription_synced',
      organizationId,
      metadata: { plan: effective, status: snap.status, seats: snap.seats },
    });
  });
  return 'applied';
}

// Retour de Stripe Checkout : active l'offre sans attendre le webhook, si la session est bien la sienne.
export async function confirmCheckout(db: Db, provider: BillingProvider, auth: AuthContext, sessionId: string): Promise<boolean> {
  if (!/^cs_[A-Za-z0-9_]{1,200}$/.test(sessionId)) return false;
  const session = await provider.getCheckout(sessionId);
  if (session.organizationId !== auth.organization.id || !session.subscriptionId) return false;
  return (await applySubscription(db, await provider.getSubscription(session.subscriptionId))) === 'applied';
}

// Webhook Stripe signé. Chaque événement n'est traité qu'une fois ; l'abonnement est toujours relu chez
// Stripe, ce qui rend l'ordre d'arrivée des événements sans importance.
export async function handleWebhook(db: Db, provider: BillingProvider, body: string, signature: string) {
  const event = provider.parseWebhook(body, signature);
  const [fresh] = await db.insert(stripeEvents).values({ id: event.id, type: event.type }).onConflictDoNothing().returning();
  if (!fresh) return 'duplicate' as const;
  if (!event.subscriptionId) return 'ignored' as const;
  try {
    return await applySubscription(db, await provider.getSubscription(event.subscriptionId));
  } catch (error) {
    // Échec : l'événement est oublié pour que la nouvelle tentative de Stripe le traite.
    await db.delete(stripeEvents).where(eq(stripeEvents.id, event.id));
    throw error;
  }
}
