'use server';

import { redirect } from 'next/navigation';
import { hit } from '@/lib/auth/rate-limit';
import { QuoteSchema, requestQuote } from '@/lib/billing/quotes';
import { BillingError, changeSubscription, openPortal, startCheckout } from '@/lib/billing/service';
import { PAID_PLANS } from '@/lib/billing/plans';
import { billingProviderFromEnv } from '@/lib/billing/stripe';
import { getDb } from '@/lib/server/db';
import { isOneOf } from '@/lib/domain';
import { demoFormError, getI18n, refuseInDemo, requireAuth } from '@/lib/server/context';
import { echo, type FormState } from '@/lib/forms';
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
  const { locale } = await getI18n();
  await run(async () => {
    await changeSubscription(await getDb(), provider, auth, plan, locale);
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

// Offre Entreprise : demande de devis, enregistrée pour l'éditeur.
export async function requestQuoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const blocked = await demoFormError(formData);
  if (blocked) return blocked;
  const auth = await requireAuth();
  const { t } = await getI18n();
  const parsed = QuoteSchema.safeParse({
    company: formData.get('company'),
    email: formData.get('email'),
    seats: formData.get('seats'),
    message: formData.get('message') ?? undefined,
  });
  if (!parsed.success) return { error: t.billing.quote.invalid, values: echo(formData) };
  if (!hit(`quote:${auth.user.id}`, 3, 60 * 60 * 1000)) return { error: t.billing.quote.tooMany, values: echo(formData) };
  await requestQuote(await getDb(), auth, parsed.data);
  return { ok: t.billing.quote.sent };
}
