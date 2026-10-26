import type { Metadata } from 'next';
import { Building2, CircleCheck, CreditCard, Gauge, PhoneCall, ReceiptText, Sparkles, Users } from 'lucide-react';
import { changeSubscriptionAction, openPortalAction, startCheckoutAction } from '@/app/actions/billing';
import { SettingsPanel } from '@/components/settings/settings-panel';
import { Badge } from '@/components/ui/badge';
import { FormAlert } from '@/components/ui/field';
import { currencyFor, DEFAULT_PRICES, grantsAccess, PLANS, planLimits, RECOMMENDED_PLAN, type PaidPlan, type Plan } from '@/lib/billing/plans';
import { billingOverview, confirmCheckout } from '@/lib/billing/service';
import { billingProviderFromEnv, type PlanPrice } from '@/lib/billing/stripe';
import { getDb } from '@/lib/server/db';
import type { Locale } from '@/lib/domain';
import { format, formatDate, type Dictionary } from '@/lib/i18n';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { cn } from '@/lib/utils';
import { QuoteForm } from './quote-form';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.billing.heading };
}

// En-tête de chaque offre, comme sur la maquette : gris, bleu pâle, bleu lumineux (recommandée), pêche et bleu.
const HEADER_BG: Record<Plan, string> = {
  free: 'bg-[#ededef]',
  standard: 'bg-[radial-gradient(70%_100%_at_30%_40%,#c9dafe_0%,#e4ecff_60%,#f1f5ff_100%)]',
  advanced: 'bg-[radial-gradient(55%_85%_at_38%_42%,#4f86ff_0%,#9dbcff_42%,#e2ebff_78%,#eef3ff_100%)]',
  premium:
    'bg-[radial-gradient(80%_130%_at_0%_100%,#f4cdb6_0%,transparent_62%),radial-gradient(70%_110%_at_100%_100%,#adc6f6_0%,transparent_68%),linear-gradient(90deg,#f7e4d7,#e4ebfb)]',
};

function money(cents: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

function features(plan: Plan, t: Dictionary): string[] {
  const b = t.billing;
  const limits = planLimits(plan);
  const minutes =
    limits.trialCalls !== null
      ? format(b.featureTrial, { calls: limits.trialCalls, minutes: limits.maxCallMinutes })
      : format(limits.teamSpace ? b.featureMinutesShared : b.featureMinutes, { n: limits.monthlyCredits });
  return [
    minutes,
    b.featureAnalysis,
    limits.privateScenarios === null ? b.featureScenariosUnlimited : format(b.featureScenarios, { n: limits.privateScenarios }),
    ...(limits.teamSpace
      ? [format(b.featureMembers, { n: limits.seats }), format(b.featureConcurrent, { n: limits.concurrentCalls })]
      : [b.featureOneCall, b.featureCatalog]),
  ];
}

export default async function BillingPage({ searchParams }: Props) {
  const { auth } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const b = t.billing;
  const params = await searchParams;
  const db = await getDb();
  const provider = billingProviderFromEnv();

  // Retour de Stripe Checkout : l'offre est activée tout de suite, sans attendre le webhook.
  const checkout = typeof params.checkout === 'string' ? params.checkout : null;
  let confirmed: boolean | null = null;
  if (checkout && provider) {
    confirmed = await confirmCheckout(db, provider, auth, checkout).catch((error) => {
      console.error('[billing] confirmation', error instanceof Error ? error.message : error);
      return false;
    });
  }
  const overview = await billingOverview(db, auth);
  const notice = params.updated
    ? b.updated
    : params.canceled
      ? b.canceled
      : confirmed === null
        ? undefined
        : confirmed
          ? format(b.success, { plan: t.enums.plan[overview.plan] })
          : b.pending;
  const error = typeof params.error === 'string' ? b.errors[params.error as keyof typeof b.errors] : undefined;

  // Euros en français, dollars américains en anglais.
  const currency = currencyFor(locale);
  let prices: Record<PaidPlan, PlanPrice> | null = null;
  if (provider) {
    prices = await provider.prices(currency).catch((err) => {
      console.error('[billing] prix', err instanceof Error ? err.message : err);
      return null;
    });
  }

  const { credits, account, canManage, seatsInUse } = overview;
  const subscribed = Boolean(account?.stripeSubscriptionId && grantsAccess(account.status));
  const trial = credits.trialCallsLeft !== null;
  // Essai : la jauge compte les appels passés ; offres payantes : les minutes du mois.
  const [usedValue, usedMax] = trial ? [Math.min(credits.trialCallsUsed ?? 0, credits.trialCalls ?? 0), credits.trialCalls ?? 0] : [credits.used, credits.monthlyCredits];
  const usedPct = usedMax ? Math.min(100, Math.round((usedValue / usedMax) * 100)) : 100;

  // Prix affiché : celui de Stripe ; sans Stripe, le prix que l'application créera à l'ouverture du paiement
  // (sauf si un identifiant de prix Stripe est imposé, qu'on ne peut pas lire sans clé).
  const priceOf = (plan: PaidPlan): { amount: number; currency: string } | null => {
    if (prices) return prices[plan];
    if (provider) return null;
    if (process.env[`STRIPE_PRICE_${plan.toUpperCase()}_${currency.toUpperCase()}`]?.trim()) return null;
    return { amount: DEFAULT_PRICES[plan].amount, currency };
  };

  const priceLine = (plan: Plan) => {
    const price = plan === 'free' ? { amount: 0, currency } : priceOf(plan);
    if (!price) return <span className="text-sm font-medium text-[#4a4e57]">{b.priceUnavailable}</span>;
    return (
      <span className="flex items-baseline gap-0.5">
        <span className="text-[27px] leading-none font-bold tracking-tight">{money(price.amount, price.currency, locale)}</span>
        {plan !== 'free' && <span className="text-[13px] text-[#4a4e57]">{b.perMonth}</span>}
      </span>
    );
  };

  const pill = 'flex h-9 w-full items-center justify-center gap-2 rounded-lg text-[13px] font-medium';
  const muted = cn(pill, 'bg-[#eef0f3] text-[#6b6f78]');

  const action = (plan: Plan) => {
    if (plan === credits.plan) {
      return (
        <div className={muted}>
          <CreditCard className="size-4" aria-hidden="true" /> {b.current}
        </div>
      );
    }
    if (!provider) return <div className={muted}>{b.planSoon}</div>;
    if (!canManage) return <div className={muted}>{b.planOwnerOnly}</div>;
    if (plan === 'free') return <div className={muted}>{b.downgradeHint}</div>;
    if (!prices) return <div className={muted}>{b.priceUnavailable}</div>;
    const switching = subscribed;
    const primary = plan === RECOMMENDED_PLAN;
    return (
      <form action={switching ? changeSubscriptionAction : startCheckoutAction}>
        <input type="hidden" name="plan" value={plan} />
        <button
          type="submit"
          className={cn(pill, primary ? 'bg-primary text-white hover:bg-primary/90' : 'bg-[#eef0f3] text-foreground hover:bg-[#e4e7ec]')}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {switching ? b.switchTo : format(b.choose, { plan: t.enums.plan[plan] })}
        </button>
      </form>
    );
  };

  const usageCard = 'grid content-start gap-3 rounded-2xl border border-border bg-[#f9fafb] p-4';

  return (
    <SettingsPanel
      title={b.heading}
      subtitle={b.headingText}
      actions={
        provider &&
        canManage &&
        account && (
          <form action={openPortalAction}>
            <button type="submit" className="flex h-9 items-center gap-2 rounded-lg border border-border bg-[#f6f7f9] px-3 text-[13px] font-medium hover:bg-[#eef0f3]">
              <ReceiptText className="size-4" aria-hidden="true" /> {b.manage}
            </button>
          </form>
        )
      }
    >
      <FormAlert tone="success" message={notice} />
      <FormAlert message={error} />

      <section aria-labelledby="plans-title">
        <h2 id="plans-title" className="sr-only">
          {b.plansTitle}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => (
            <article
              key={plan}
              aria-label={t.enums.plan[plan]}
              className={cn('flex flex-col rounded-[18px] border bg-[#f9fafb]', plan === RECOMMENDED_PLAN ? 'border-primary ring-2 ring-primary/25' : 'border-border')}
            >
              <div className="rounded-[18px] bg-white p-2 shadow-[0_10px_24px_-14px_rgb(20_24_40/0.28)] ring-1 ring-[#eceef2]">
                <div className={cn('relative h-[112px] overflow-hidden rounded-[13px] p-3', HEADER_BG[plan])}>
                  {plan === 'premium' && (
                    <span aria-hidden="true" className="absolute inset-y-0 left-[44%] w-12 bg-[linear-gradient(90deg,transparent,#ffb48a,transparent)] opacity-45 blur-[7px]" />
                  )}
                  <span className="relative inline-flex rounded-full border border-[#e3e5ea] bg-white px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
                    {t.enums.plan[plan]}
                  </span>
                  {plan === RECOMMENDED_PLAN && (
                    <span className="absolute top-3 right-3 inline-flex rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white">{b.recommended}</span>
                  )}
                  <span className="absolute bottom-3 left-3">{priceLine(plan)}</span>
                </div>
                <p className="px-1.5 pt-3 pb-3 text-[13px] text-[#3d4048]">{b.planDescription[plan]}</p>
                {action(plan)}
              </div>
              <ul className="grid gap-2.5 px-4 pt-4 pb-5 text-[13px] text-[#2c2f36]">
                {features(plan, t).map((f) => (
                  <li key={f} className="flex gap-2">
                    <CircleCheck className="mt-px size-4 shrink-0 text-[#6b6f78]" aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <article aria-label={b.enterprise.name} className="mt-4 grid gap-4 rounded-[18px] border border-border bg-[#f9fafb] p-4 md:grid-cols-[1fr_minmax(0,22rem)]">
          <div className="grid content-start gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#e3e5ea] bg-white px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
              <Building2 className="size-3.5" aria-hidden="true" /> {b.enterprise.name}
            </span>
            <p className="text-[27px] leading-none font-bold tracking-tight">{b.enterprise.price}</p>
            <p className="text-[13px] text-[#3d4048]">{b.enterprise.description}</p>
            <ul className="grid gap-2.5 text-[13px] text-[#2c2f36]">
              {b.enterprise.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <CircleCheck className="mt-px size-4 shrink-0 text-[#6b6f78]" aria-hidden="true" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[14px] bg-white p-3 ring-1 ring-[#eceef2]">
            <QuoteForm labels={b.quote} defaults={{ company: auth.organization.name, email: auth.user.email }} />
          </div>
        </article>
        <p className="mt-3 text-xs text-muted-foreground">{b.paymentMethods}</p>
      </section>

      <section aria-labelledby="usage-title" className="grid gap-3">
        <h2 id="usage-title" className="text-sm font-semibold">
          {b.usageTitle}
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className={usageCard}>
            <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <Gauge className="size-4" aria-hidden="true" /> {trial ? b.trialTitle : b.creditsTitle}
            </p>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-2xl font-semibold tabular-nums">
                {credits.unlimited ? b.unlimited : trial ? format(b.trialLeft, { n: credits.trialCallsLeft ?? 0 }) : format(b.creditsLeft, { n: credits.remaining })}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {credits.unlimited ? format(b.unlimitedUsed, { used: credits.used }) : format(trial ? b.trialUsed : b.creditsUsed, { used: usedValue, total: usedMax })}
              </span>
            </div>
            {!credits.unlimited && (
            <div
              className="h-2 rounded-full bg-[#e9ebef]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={usedMax}
              aria-valuenow={usedValue}
              aria-label={trial ? b.trialTitle : b.creditsTitle}
            >
              <div
                className={cn('h-2 rounded-full', usedPct >= 90 ? 'bg-destructive' : usedPct >= 70 ? 'bg-warning' : 'bg-primary')}
                style={{ width: `${usedPct}%` }}
              />
            </div>
            )}
            <p className="text-xs text-muted-foreground">
              {credits.unlimited
                ? format(b.unlimitedHint, { minutes: credits.maxCallMinutes })
                : trial
                  ? format(b.trialHint, { calls: credits.trialCalls ?? 0, minutes: credits.maxCallMinutes })
                  : b.creditsHint}
            </p>
          </div>

          <div className={usageCard}>
            <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <PhoneCall className="size-4" aria-hidden="true" /> {b.callsTitle}
            </p>
            <p className="text-2xl font-semibold tabular-nums">{format(b.callsValue, { active: credits.activeCalls, max: credits.concurrentCalls })}</p>
            {credits.teamSpace && (
              <>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Users className="size-4" aria-hidden="true" /> {b.seatsTitle}
                </p>
                <p className="text-lg font-semibold tabular-nums">{format(b.seatsValue, { used: seatsInUse, total: credits.seats })}</p>
              </>
            )}
          </div>

          <div className={usageCard}>
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <CreditCard className="size-4" aria-hidden="true" /> {b.subscriptionTitle}
              </p>
              <Badge variant="outline" className="border-primary/25 bg-primary/5 text-primary">
                {credits.unlimited ? b.unlimited : t.enums.plan[credits.plan]}
              </Badge>
            </div>
            {account?.status && (
              <p className="text-sm">
                <span className={cn('font-medium', account.status === 'active' || account.status === 'trialing' ? 'text-teal' : 'text-warning')}>
                  {b.status[account.status as keyof typeof b.status] ?? account.status}
                </span>
                {account.currentPeriodEnd && grantsAccess(account.status) && (
                  <span className="text-muted-foreground">
                    {' · '}
                    {format(account.cancelAtPeriodEnd ? b.endsOn : b.renewsOn, { date: formatDate(account.currentPeriodEnd, locale) })}
                  </span>
                )}
              </p>
            )}
            {account?.status === 'past_due' && <FormAlert message={b.pastDue} />}
            {credits.unlimited && <p className="text-sm text-muted-foreground">{format(b.unlimitedHint, { minutes: credits.maxCallMinutes })}</p>}
            {!provider && !credits.unlimited && <p className="text-sm text-muted-foreground">{b.notConfigured}</p>}
            {provider && !canManage && <p className="text-sm text-muted-foreground">{b.notManager}</p>}
          </div>
        </div>
      </section>
    </SettingsPanel>
  );
}
