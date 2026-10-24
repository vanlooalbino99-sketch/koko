import type { Metadata } from 'next';
import { Check, CreditCard } from 'lucide-react';
import { changeSubscriptionAction, openPortalAction, startCheckoutAction } from '@/app/actions/billing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FormAlert } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PLANS, planLimits, grantsAccess, TEAM_MAX_SEATS, TEAM_MIN_SEATS, type Plan } from '@/lib/billing/plans';
import { billingOverview, confirmCheckout } from '@/lib/billing/service';
import { billingProviderFromEnv, type PlanPrice } from '@/lib/billing/stripe';
import { getDb } from '@/lib/db/client';
import type { Locale } from '@/lib/domain';
import { format, formatDate, type Dictionary } from '@/lib/i18n';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { cn } from '@/lib/utils';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.billing.title };
}

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
    format(plan === 'team' ? b.featureMinutesSeat : b.featureMinutes, {
      n: perSeat,
    }),
    b.featureAnalysis,
    limits.privateScenarios === null ? b.featureScenariosUnlimited : format(b.featureScenarios, { n: limits.privateScenarios }),
    ...(plan === 'team' ? [b.featureTeam, format(b.featureConcurrent, { n: '2–5' })] : []),
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

  let prices: Record<'pro' | 'team', PlanPrice> | null = null;
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

  const priceLine = (plan: Plan) => {
    if (plan === 'free') return <span className="text-3xl font-semibold">{b.free}</span>;
    const price = prices?.[plan];
    if (!price) return <span className="text-sm text-muted-foreground">{provider ? b.priceUnavailable : '—'}</span>;
    return (
      <span>
        <span className="text-3xl font-semibold">{money(price.amount, price.currency, locale)}</span>{' '}
        <span className="text-sm text-muted-foreground">{plan === 'team' ? b.perSeat : b.perMonth}</span>
      </span>
    );
  };

  const seatsInput = (id: string, value: number) => (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{b.seatsLabel}</Label>
      <Input id={id} name="seats" type="number" min={minSeats} max={TEAM_MAX_SEATS} defaultValue={value} required className="max-w-32" />
      <p className="text-xs text-muted-foreground">{format(b.seatsHint, { min: minSeats, max: TEAM_MAX_SEATS })}</p>
    </div>
  );

  const action = (plan: Plan) => {
    if (plan === credits.plan || plan === 'free' || !provider || !prices || !canManage) return null;
    if (!subscribed) {
      return (
        <form action={startCheckoutAction} className="grid gap-3">
          <input type="hidden" name="plan" value={plan} />
          {plan === 'team' && seatsInput('seats-new', minSeats)}
          <Button type="submit">{plan === 'pro' ? b.upgradePro : b.upgradeTeam}</Button>
        </form>
      );
    }
    return (
      <form action={changeSubscriptionAction} className="grid gap-3">
        <input type="hidden" name="plan" value={plan} />
        {plan === 'team' && seatsInput('seats-switch', minSeats)}
        <Button type="submit" variant="outline">
          {b.switchTo}
        </Button>
      </form>
    );
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{b.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{b.subtitle}</p>
      </div>

      <FormAlert tone="success" message={notice} />
      <FormAlert message={error} />

      <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="grid content-start gap-3">
          <CardTitle>{b.creditsTitle}</CardTitle>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-3xl font-semibold tabular-nums">{format(b.creditsLeft, { n: credits.remaining })}</span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {format(b.creditsUsed, {
                used: credits.used,
                total: credits.monthlyCredits,
              })}
            </span>
          </div>
          <div
            className="h-2 rounded-full bg-surface-2"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={credits.monthlyCredits}
            aria-valuenow={credits.used}
            aria-label={b.creditsTitle}
          >
            <div
              className={cn('h-2 rounded-full', usedPct >= 90 ? 'bg-destructive' : usedPct >= 70 ? 'bg-warning' : 'bg-teal')}
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{b.creditsHint}</p>
          <p className="text-sm text-muted-foreground">
            {format(b.concurrent, {
              active: credits.activeCalls,
              max: credits.concurrentCalls,
            })}
          </p>
          {credits.plan === 'team' && <p className="text-sm text-muted-foreground">{format(b.seats, { used: seatsInUse, total: credits.seats })}</p>}
        </Card>

        <Card className="grid content-start gap-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle>{b.subscriptionTitle}</CardTitle>
            <Badge variant="outline">{t.enums.plan[credits.plan]}</Badge>
          </div>
          {account?.status && (
            <p className="text-sm">
              <span className={cn('font-medium', account.status === 'active' || account.status === 'trialing' ? 'text-teal' : 'text-warning')}>
                {b.status[account.status as keyof typeof b.status] ?? account.status}
              </span>
              {account.currentPeriodEnd && grantsAccess(account.status) && (
                <span className="text-muted-foreground">
                  {' · '}
                  {format(account.cancelAtPeriodEnd ? b.endsOn : b.renewsOn, {
                    date: formatDate(account.currentPeriodEnd, locale),
                  })}
                </span>
              )}
            </p>
          )}
          {account?.status === 'past_due' && <FormAlert message={b.pastDue} />}
          {!provider && <p className="text-sm text-muted-foreground">{b.notConfigured}</p>}
          {provider && !canManage && <p className="text-sm text-muted-foreground">{b.notManager}</p>}
          {provider && canManage && subscribed && credits.plan === 'team' && (
            <form action={changeSubscriptionAction} className="grid gap-3">
              <input type="hidden" name="plan" value="team" />
              {seatsInput('seats-update', credits.seats)}
              <Button type="submit" variant="outline" className="justify-self-start">
                {b.updateSeats}
              </Button>
            </form>
          )}
          {provider && canManage && account && (
            <form action={openPortalAction}>
              <Button type="submit" variant="outline">
                <CreditCard /> {b.manage}
              </Button>
            </form>
          )}
        </Card>
      </section>

      <section aria-labelledby="plans-title" className="grid gap-4">
        <h2 id="plans-title" className="text-lg font-semibold">
          {b.plansTitle}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => {
            const current = plan === credits.plan;
            return (
              <Card key={plan} className={cn('grid content-start gap-4', current && 'border-primary/50 ring-1 ring-primary/30')}>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{t.enums.plan[plan]}</CardTitle>
                  {current && <Badge className="border-primary/30 bg-primary/15 text-foreground">{b.current}</Badge>}
                </div>
                <CardDescription>{b.planDescription[plan]}</CardDescription>
                {priceLine(plan)}
                <ul className="grid gap-2">
                  {features(plan, t).map((f) => (
                    <li key={f} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" /> {f}
                    </li>
                  ))}
                </ul>
                {action(plan)}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
