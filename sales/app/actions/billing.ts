'use server';

import { redirect } from 'next/navigation';
import { BillingError, changeSubscription, openPortal, startCheckout } from '@/lib/billing/service';
import { PAID_PLANS } from '@/lib/billing/plans';
import { billingProviderFromEnv } from '@/lib/billing/stripe';
import { getDb } from '@/lib/server/db';
import { isOneOf } from '@/lib/domain';
import { getI18n, refuseInDemo, requireAuth } from '@/lib/server/context';
import { appUrl } from '@/lib/server/url';

// Chaque action renvoie vers Stripe ou vers la page Abonnement avec un code d'erreur lisible.
async function run(task: () => Promise<string>): Promise<never> {
  let target: string;
  try {
    target = await task();
  } catch (error) {
    if (error instanceof BillingError) target = `/billing?error=${error.code}`;
    else {
      console.error('[billing] Stripe', error instanceof Error ? error.message : error);
      target = '/billing?error=stripe';
    }
  }
  redirect(target);
}

function seatsFrom(formData: FormData) {
  return Number(formData.get('seats') ?? 1);
}

export async function startCheckoutAction(formData: FormData) {
  await refuseInDemo();
  const auth = await requireAuth();
  const provider = billingProviderFromEnv();
  const plan = formData.get('plan');
  if (!provider) redirect('/billing?error=not_configured');
  if (!isOneOf(PAID_PLANS, plan)) redirect('/billing');
  const { locale } = await getI18n();
  const base = await appUrl();
  await run(async () =>
    startCheckout(
      await getDb(),
      provider,
      auth,
      plan,
      seatsFrom(formData),
      {
        success: `${base}/billing?checkout={CHECKOUT_SESSION_ID}`,
        cancel: `${base}/billing?canceled=1`,
      },
      locale,
    ),
  );
}

export async function changeSubscriptionAction(formData: FormData) {
  await refuseInDemo();
  const auth = await requireAuth();
  const provider = billingProviderFromEnv();
  const plan = formData.get('plan');
  if (!provider) redirect('/billing?error=not_configured');
  if (!isOneOf(PAID_PLANS, plan)) redirect('/billing');
  await run(async () => {
    await changeSubscription(await getDb(), provider, auth, plan, seatsFrom(formData));
    return '/billing?updated=1';
  });
}

export async function openPortalAction() {
  await refuseInDemo();
  const auth = await requireAuth();
  const provider = billingProviderFromEnv();
  if (!provider) redirect('/billing?error=not_configured');
  const { locale } = await getI18n();
  const base = await appUrl();
  await run(async () => openPortal(await getDb(), provider, auth, `${base}/billing`, locale));
}
