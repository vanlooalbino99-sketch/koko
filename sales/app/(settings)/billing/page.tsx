import type { Metadata } from 'next';
import { CircleCheck, CreditCard, Gauge, PhoneCall, ReceiptText, Sparkles, Users } from 'lucide-react';
import { changeSubscriptionAction, openPortalAction, startCheckoutAction } from '@/app/actions/billing';
import { SettingsPanel } from '@/components/settings/settings-panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/field';
import { Select } from '@/components/ui/input';
import { DEFAULT_PRICES, PLANS, planLimits, grantsAccess, TEAM_MAX_SEATS, TEAM_MIN_SEATS, type PaidPlan, type Plan } from '@/lib/billing/plans';
import { billingOverview, confirmCheckout } from '@/lib/billing/service';
import { billingProviderFromEnv, type PlanPrice } from '@/lib/billing/stripe';
import { getDb } from '@/lib/server/db';
import type { Locale } from '@/lib/domain';
import { format, formatDate, type Dictionary } from '@/lib/i18n';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { cn } from '@/lib/utils';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.billing.heading };
}

// En-tête de chaque offre, comme sur la maquette : gris, bleu lumineux, pêche et bleu.
const HEADER_BG: Record<Plan, string> = {
  free: 'bg-[#ededef]',
  pro: 'bg-[radial-gradient(55%_85%_at_38%_42%,#4f86ff_0%,#9dbcff_42%,#e2ebff_78%,#eef3ff_100%)]',
  team: 'bg-[radial-gradient(80%_130%_at_0%_100%,#f4cdb6_0%,transparent_62%),radial-gradient(70%_110%_at_100%_100%,#adc6f6_0%,transparent_68%),linear-gradient(90deg,#f7e4d7,#e4ebfb)]',
};

function money(cents: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

function features(plan: Plan, t: Dictionary): string[] {
  const b = t.billing;
  const limits = planLimits(plan, TEAM_MIN_SEATS);
  const perSeat = plan === 'team' ? limits.monthlyCredits / limits.seats : limits.monthlyCredits;
  return [
    format(plan === 'team' ? b.featureMinutesSeat : b.featureMinutes, { n: perSeat }),
    b.featureAnalysis,
    limits.privateScenarios === null ? b.featureScenariosUnlimited : format(b.featureScenarios, { n: limits.privateScenarios }),
    ...(plan === 'team' ? [b.featureTeam, format(b.featureConcurrent, { n: '2–5' })] : [b.featureOneCall, b.featureCatalog]),
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

  let prices: Record<PaidPlan, PlanPrice> | null = null;
  if (provider) {
    prices = await provider.prices().catch((err) => {
      console.error('[billing] prix', err instanceof Error ? err.message : err);
      return null;
    });
  }

  const { credits, account, canManage, seatsInUse } = overview;
  const subscribed = Boolean(account?.stripeSubscriptionId && grantsAccess(account.status));
  const usedPct = credits.monthlyCredits ? Math.min(100, Math.round((credits.used / credits.monthlyCredits) * 100)) : 100;
  const minSeats = Math.max(TEAM_MIN_SEATS, seatsInUse);

  // Prix affiché : celui de Stripe ; sans Stripe, le prix que l'application créera à l'ouverture du paiement
  // (sauf si un identifiant de prix Stripe est imposé, qu'on ne peut pas lire sans clé).
  const priceOf = (plan: PaidPlan): { amount: number; currency: string } | null => {
    if (prices) return prices[plan];
    if (provider) return null;
    if (process.env[plan === 'pro' ? 'STRIPE_PRICE_PRO' : 'STRIPE_PRICE_TEAM']?.trim()) return null;
    return { amount: DEFAULT_PRICES[plan].amount, currency: 'eur' };
  };

  const priceLine = (plan: Plan) => {
    const price = plan === 'free' ? { amount: 0, currency: 'eur' } : priceOf(plan);
    if (!price) return <span className="text-sm font-medium text-[#4a4e57]">{b.priceUnavailable}</span>;
    return (
      <span className="flex items-baseline gap-0.5">
        <span className="text-[27px] leading-none font-bold tracking-tight">{money(price.amount, price.currency, locale)}</span>
        <span className="text-[13px] text-[#4a4e57]">{plan === 'team' ? b.perSeat : b.perMonth}</span>
      </span>
    );
  };

  const pill = 'flex h-9 w-full items-center justify-center gap-2 rounded-lg text-[13px] font-medium';
  const muted = cn(pill, 'bg-[#eef0f3] text-[#6b6f78]');

  const seatsSelect = (id: string, value: number) => (
    <Select id={id} name="seats" defaultValue={value} aria-label={b.seatsLabel} title={format(b.seatsHint, { min: minSeats, max: TEAM_MAX_SEATS })} className="h-9 w-[72px] shrink-0 rounded-lg text-[13px]">
      {Array.from({ length: TEAM_MAX_SEATS - minSeats + 1 }, (_, i) => minSeats + i).map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </Select>
  );

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
    return (
      <form action={switching ? changeSubscriptionAction : startCheckoutAction} className="flex gap-2">
        <input type="hidden" name="plan" value={plan} />
        {plan === 'team' && seatsSelect(`seats-${switching ? 'switch' : 'new'}`, minSeats)}
        <button type="submit" className={cn(pill, switching ? 'bg-[#eef0f3] text-foreground hover:bg-[#e4e7ec]' : 'bg-primary text-white hover:bg-primary/90')}>
          <Sparkles className="size-4" aria-hidden="true" />
          {switching ? b.switchTo : plan === 'pro' ? b.upgradePro : b.upgradeTeam}
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
        <div className="grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <article key={plan} aria-label={t.enums.plan[plan]} className="flex flex-col rounded-[18px] border border-border bg-[#f9fafb]">
              <div className="rounded-[18px] bg-white p-2 shadow-[0_10px_24px_-14px_rgb(20_24_40/0.28)] ring-1 ring-[#eceef2]">
                <div className={cn('relative h-[112px] overflow-hidden rounded-[13px] p-3', HEADER_BG[plan])}>
                  {plan === 'team' && (
                    <span aria-hidden="true" className="absolute inset-y-0 left-[44%] w-12 bg-[linear-gradient(90deg,transparent,#ffb48a,transparent)] opacity-45 blur-[7px]" />
                  )}
                  <span className="relative inline-flex rounded-full border border-[#e3e5ea] bg-white px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
                    {t.enums.plan[plan]}
                  </span>
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
      </section>

      <section aria-labelledby="usage-title" className="grid gap-3">
        <h2 id="usage-title" className="text-sm font-semibold">
          {b.usageTitle}
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className={usageCard}>
            <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <Gauge className="size-4" aria-hidden="true" /> {b.creditsTitle}
            </p>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-2xl font-semibold tabular-nums">{format(b.creditsLeft, { n: credits.remaining })}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{format(b.creditsUsed, { used: credits.used, total: credits.monthlyCredits })}</span>
            </div>
            <div
              className="h-2 rounded-full bg-[#e9ebef]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={credits.monthlyCredits}
              aria-valuenow={credits.used}
              aria-label={b.creditsTitle}
            >
              <div
                className={cn('h-2 rounded-full', usedPct >= 90 ? 'bg-destructive' : usedPct >= 70 ? 'bg-warning' : 'bg-primary')}
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{b.creditsHint}</p>
          </div>

          <div className={usageCard}>
            <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <PhoneCall className="size-4" aria-hidden="true" /> {b.callsTitle}
            </p>
            <p className="text-2xl font-semibold tabular-nums">{format(b.callsValue, { active: credits.activeCalls, max: credits.concurrentCalls })}</p>
            {credits.plan === 'team' && (
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
                {t.enums.plan[credits.plan]}
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
            {!provider && <p className="text-sm text-muted-foreground">{b.notConfigured}</p>}
            {provider && !canManage && <p className="text-sm text-muted-foreground">{b.notManager}</p>}
            {provider && canManage && subscribed && credits.plan === 'team' && (
              <form action={changeSubscriptionAction} className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="plan" value="team" />
                {seatsSelect('seats-update', credits.seats)}
                <Button type="submit" variant="outline" size="sm">
                  {b.updateSeats}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SettingsPanel>
  );
}
