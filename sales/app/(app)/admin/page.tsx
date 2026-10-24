import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { platformReport } from '@/lib/billing/admin';
import { PLANS } from '@/lib/billing/plans';
import { getDb } from '@/lib/db/client';
import { format } from '@/lib/i18n';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { robots: { index: false } };

function Gauge({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 100;
  return (
    <div className="grid gap-2">
      <p className="text-3xl font-semibold tabular-nums">
        {value} <span className="text-base font-normal text-muted-foreground">/ {max}</span>
      </p>
      <div
        className="h-2 rounded-full bg-surface-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      >
        <div className={cn('h-2 rounded-full', pct >= 90 ? 'bg-destructive' : pct >= 70 ? 'bg-warning' : 'bg-teal')} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Page de l'éditeur uniquement : pour tout autre compte, elle n'existe pas.
export default async function AdminPage() {
  const { auth } = await requireOnboarded();
  if (!auth.user.isPlatformAdmin) notFound();
  const { t, locale } = await getI18n();
  const a = t.admin;
  const report = await platformReport(await getDb());
  const n = (value: number) => new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-GB').format(value);
  const stats = [
    { label: a.calls, value: n(report.calls) },
    { label: a.elevenCost, value: n(report.providerCost) },
    { label: a.analyses, value: n(report.analyses.completed) },
    { label: a.failedAnalyses, value: n(report.analyses.failed) },
    {
      label: a.tokens,
      value: `${n(report.analyses.inputTokens)} / ${n(report.analyses.outputTokens)}`,
    },
    { label: a.subscriptions, value: n(report.paidSubscriptions) },
  ];
  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{a.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{a.subtitle}</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="grid content-start gap-3">
          <CardTitle>{a.voiceTitle}</CardTitle>
          <Gauge value={report.usage.minutesThisMonth} max={report.usage.monthlyMinutes} label={a.voiceTitle} />
          <CardDescription>{a.voiceHint}</CardDescription>
        </Card>
        <Card className="grid content-start gap-3">
          <CardTitle>{a.analysesTitle}</CardTitle>
          <Gauge value={report.usage.analysesToday} max={report.usage.dailyAnalyses} label={a.analysesTitle} />
          <CardDescription>{a.analysesHint}</CardDescription>
        </Card>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="grid gap-1">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-[minmax(0,16rem)_1fr]">
        <Card className="grid content-start gap-3">
          <CardTitle>{a.plansTitle}</CardTitle>
          <dl className="grid grid-cols-[1fr_auto] gap-2 text-sm">
            {PLANS.map((plan) => (
              <div key={plan} className="contents">
                <dt className="text-muted-foreground">{t.enums.plan[plan]}</dt>
                <dd className="text-right tabular-nums">{n(report.plans[plan] ?? 0)}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card className="overflow-x-auto">
          <CardTitle>{a.topTitle}</CardTitle>
          {report.top.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">{a.empty}</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr>
                  <th className="py-2 font-medium">{a.organization}</th>
                  <th className="py-2 font-medium">{a.plan}</th>
                  <th className="py-2 text-right font-medium">{a.calls}</th>
                  <th className="py-2 text-right font-medium">{a.credits}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.top.map((org) => (
                  <tr key={org.id}>
                    <td className="py-2">{org.name}</td>
                    <td className="py-2">{t.enums.plan[org.plan as 'free'] ?? org.plan}</td>
                    <td className="py-2 text-right tabular-nums">{n(org.calls)}</td>
                    <td className="py-2 text-right tabular-nums">{n(org.credits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </section>
      <p className="text-xs text-muted-foreground">{format(t.billing.creditsHint, {})}</p>
    </div>
  );
}
