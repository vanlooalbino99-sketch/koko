import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ClipboardList, Mic, Sparkles, Target, Upload } from 'lucide-react';
import { Change } from '@/components/cockpit/change';
import { AreaWave, Bubbles, DayBars, DotGrid, DotWave, Donut, FunnelFlow, GlassRing, HalfGauge, HealthRing, SERIES_COLORS, TrendLine } from '@/components/cockpit/charts';
import { PeriodMenu } from '@/components/cockpit/period-menu';
import { ScenarioCard } from '@/components/scenarios/scenario-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { creditStatus } from '@/lib/billing/credits';
import { getDashboard } from '@/lib/dashboard/service';
import { PERIODS, periodOf, trainingPulse, type SkillRow } from '@/lib/dashboard/pulse';
import { getDb } from '@/lib/db/client';
import { can, type Family, type Skill } from '@/lib/domain';
import { format, formatDate, timeAgo } from '@/lib/i18n';
import { recommendScenarios } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { syncPendingSimulations } from '@/lib/simulations/service';
import { listMyMissions } from '@/lib/team/service';
import { cn } from '@/lib/utils';
import { voiceProviderFromEnv } from '@/lib/voice/provider';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.nav.dashboard };
}

type Props = { searchParams: Promise<{ period?: string }> };

const STATE_TONE: Record<SkillRow['state'], string> = {
  weak: 'bg-[#f06b8f]/15 text-[#ff8fab]',
  progress: 'bg-[#f5a524]/15 text-[#ffc15e]',
  mastered: 'bg-[#3fe0b5]/15 text-[#5ff0c6]',
};

function scoreTone(score: number) {
  return score >= 75 ? 'bg-[#3fe0b5]/15 text-[#5ff0c6]' : score >= 50 ? 'bg-[#f5a524]/15 text-[#ffc15e]' : 'bg-[#f06b8f]/15 text-[#ff8fab]';
}

export default async function DashboardPage({ searchParams }: Props) {
  const { auth, profile } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const days = periodOf((await searchParams).period);
  const db = await getDb();
  const provider = voiceProviderFromEnv();
  // Appels restés sans transcription (onglet fermé pendant l'appel) : rattrapés avant d'afficher les chiffres.
  if (provider) await syncPendingSimulations(db, provider, auth).catch(() => undefined);
  const now = new Date();
  const [data, pulse, credits, picks, missions] = await Promise.all([
    getDashboard(db, auth),
    trainingPulse(db, auth, { days, now }),
    creditStatus(db, auth.organization, now),
    recommendScenarios(db, auth, profile, locale),
    listMyMissions(db, auth),
  ]);
  // Exercice pour la compétence la plus faible : le scénario du catalogue qui la travaille le plus, à son niveau.
  const [practice] = pulse.weakest
    ? await recommendScenarios(db, auth, { goals: [pulse.weakest.skill], experience: profile.experience }, locale, 1)
    : [];
  // Missions à faire d'abord, puis les dernières remplies.
  const shownMissions = [...missions.filter((m) => m.status !== 'done'), ...missions.filter((m) => m.status === 'done').slice(0, 3)];

  const d = t.dashboard;
  const firstName = auth.user.name.split(' ')[0];
  const tag = locale === 'fr' ? 'fr-FR' : 'en-GB';
  const n = (v: number) => new Intl.NumberFormat(tag).format(v);
  const short = new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short' });
  const range = `${short.format(pulse.since)} – ${short.format(now)}`;
  const goals = new Set(profile.goals);
  const card = 'min-w-0 rounded-xl border border-border bg-surface p-4';
  const kpiTitle = 'text-[13px] font-medium text-[#d9dce6]';
  const kpiValue = 'mt-2 text-[22px] leading-none font-semibold tracking-tight tabular-nums';

  const funnelKeys = ['started', 'completed', 'scored', 'nextStep'] as const;
  const funnelValues = funnelKeys.map((k) => pulse.funnel[k]);
  const familyTotal = pulse.families.reduce((s, f) => s + f.minutes, 0);
  const familySegments = pulse.families.map((f, i) => ({
    label: t.enums.family[f.family as Family] ?? f.family,
    value: f.minutes,
    color: SERIES_COLORS[i % SERIES_COLORS.length],
  }));
  const maxScenario = Math.max(1, ...pulse.topScenarios.map((s) => s.n));
  // Anneau : d'abord les objectifs notés, puis les compétences les plus évaluées (six au plus).
  const facets = [...pulse.skills]
    .sort((a, b) => Number(goals.has(b.skill)) - Number(goals.has(a.skill)) || b.n - a.n)
    .slice(0, 6)
    .sort((a, b) => a.skill.localeCompare(b.skill));
  const facetAverage = facets.length ? Math.round(facets.reduce((s, f) => s + f.value, 0) / facets.length) : 0;
  const usedShare = credits.monthlyCredits ? Math.min(100, Math.round((credits.used / credits.monthlyCredits) * 100)) : 0;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{format(d.greeting, { name: firstName })}</h1>
          <p className="text-[13px] text-muted-foreground">{d.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <PeriodMenu path="/dashboard" range={range} current={days} periods={PERIODS} labels={d.periods} srLabel={d.period} />
          <a
            href={`/api/dashboard/export?period=${days}`}
            download
            className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-[13px] font-medium text-white hover:bg-primary/90"
          >
            <Upload className="size-4" aria-hidden="true" /> {d.export}
          </a>
        </div>
      </div>

      {!provider && <p className="rounded-xl border border-[#f5a524]/30 bg-[#f5a524]/10 px-4 py-2.5 text-[13px] text-[#ffc15e]">{d.voiceOff}</p>}

      {/* Indicateurs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.35fr_1fr_1fr_1fr_1fr_0.95fr]">
        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{d.kpiMinutes}</h2>
          <p className={cn(kpiValue, 'text-[26px]')}>{format(d.minutesValue, { n: n(pulse.minutes.value) })}</p>
          <Change value={pulse.minutes.value} previous={pulse.minutes.previous} label={d.vsPrevious} tag={tag} />
          <DotWave values={pulse.minutes.byDay} label={d.minutesChart} />
        </section>

        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{d.kpiCalls}</h2>
          <p className={kpiValue}>{n(pulse.calls.value)}</p>
          <Change value={pulse.calls.value} previous={pulse.calls.previous} label={d.vsPrevious} tag={tag} />
          <DotGrid values={pulse.calls.byDay} label={d.callsChart} />
        </section>

        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{d.kpiBest}</h2>
          <p className={kpiValue}>{pulse.best ?? d.none}</p>
          <p className="text-[11.5px] text-muted-foreground">{format(d.bestHint, { n: pulse.score.n })}</p>
          <AreaWave values={pulse.score.series} label={d.bestChart} />
        </section>

        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{d.kpiActiveDays}</h2>
          <p className={kpiValue}>{format(d.activeDaysValue, { n: pulse.activeDays.value, days })}</p>
          <p className="text-[11.5px] text-muted-foreground">{d.activeDaysHint}</p>
          <DayBars values={pulse.calls.byDay} label={d.activeDaysChart} />
        </section>

        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{d.kpiCredits}</h2>
          <p className={kpiValue}>{format(d.creditsValue, { n: n(credits.remaining) })}</p>
          <p className="text-[11.5px] text-muted-foreground">
            {format(d.creditsHint, { total: n(credits.monthlyCredits), plan: t.enums.plan[credits.plan] })}
          </p>
          <div className="flex h-14 items-end">
            <span className="block h-2 w-full rounded-full bg-white/5" aria-hidden="true">
              <span className="block h-full rounded-full bg-[linear-gradient(90deg,#7b6cff,#3fe0b5)]" style={{ width: `${usedShare}%` }} />
            </span>
          </div>
        </section>

        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{d.kpiScore}</h2>
          {pulse.score.value === null ? (
            <p className="mt-2 text-[14px] text-muted-foreground">{d.noScore}</p>
          ) : (
            <p className={kpiValue}>{pulse.score.value}</p>
          )}
          <Change value={pulse.score.value} previous={pulse.score.previous} label={format(d.scoreHint, { n: pulse.score.n })} points tag={tag} />
          <HalfGauge value={pulse.score.value} label={d.kpiScore} />
        </section>
      </div>

      {shownMissions.length > 0 && (
        <section className={card}>
          <h2 className="flex items-center gap-2 text-[14px] font-semibold">
            <ClipboardList className="size-4 text-primary" aria-hidden="true" /> {d.missionsTitle}
          </h2>
          <p className="mt-1 text-[12.5px] text-muted-foreground">{d.missionsText}</p>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border" aria-label={d.missionsTitle}>
            {shownMissions.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[13px]" data-mission={m.status}>
                <span className="min-w-0">
                  <span className="block font-medium">{m.scenarioTitle}</span>
                  <span className="block text-xs text-muted-foreground">
                    {m.assignedByName && format(t.team.assignedBy, { name: m.assignedByName })}
                    {m.dueAt && ` · ${format(t.team.dueOn, { date: formatDate(m.dueAt, locale) })}`}
                  </span>
                  {m.note && <span className="mt-1 block text-xs whitespace-pre-line">{m.note}</span>}
                </span>
                {m.status === 'done' && m.completedAt ? (
                  <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                    {m.score === null
                      ? format(t.team.doneOn, { date: formatDate(m.completedAt, locale) })
                      : format(t.team.doneScore, { date: formatDate(m.completedAt, locale), score: m.score })}
                  </Badge>
                ) : (
                  <span className="flex items-center gap-2">
                    {m.status === 'overdue' && (
                      <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                        {t.team.missionStatus.overdue}
                      </Badge>
                    )}
                    <Button asChild size="sm">
                      <Link href={`/scenarios/${m.scenarioId}`}>
                        <Mic /> {d.missionStart}
                      </Link>
                    </Button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-3 xl:grid-cols-[1fr_1.45fr_1fr]">
        <section className={card}>
          <h2 className="text-[14px] font-semibold">{d.familiesTitle}</h2>
          {familyTotal === 0 && <p className="mt-3 text-[13px] text-muted-foreground">{d.familiesEmpty}</p>}
          <div className="mt-3 flex items-center gap-4">
            <div className="w-[46%] shrink-0">
              <Donut segments={familySegments} center={format(d.minutesValue, { n: n(familyTotal) })} caption={d.familiesTotal} />
            </div>
            <ul className="grid flex-1 gap-2.5 text-[13px]">
              {familySegments.slice(0, 5).map((s) => (
                <li key={s.label} className="grid grid-cols-[auto_1fr_auto] items-start gap-x-2">
                  <span aria-hidden="true" className="mt-1.5 size-2 rounded-full" style={{ background: s.color }} />
                  <span className="min-w-0">
                    <span className="block truncate">{s.label}</span>
                    <span className="block text-[12px] text-muted-foreground tabular-nums">{format(d.minutesValue, { n: n(s.value) })}</span>
                  </span>
                  <span className="text-muted-foreground tabular-nums">{familyTotal ? Math.round((s.value / familyTotal) * 100) : 0} %</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={card}>
          <h2 className="text-[14px] font-semibold">{d.funnelTitle}</h2>
          <ol className="mt-3 grid grid-cols-4 gap-2">
            {funnelKeys.map((key, i) => (
              <li key={key} className="min-w-0">
                <p className="truncate text-[12px] text-muted-foreground">
                  {i + 1}. {d.funnelSteps[key]}
                </p>
                <p className="mt-0.5 text-[18px] font-semibold tabular-nums">{n(funnelValues[i])}</p>
                <span className="mt-1 inline-block rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] tabular-nums">
                  {n(pulse.funnel.started ? Math.round((funnelValues[i] / pulse.funnel.started) * 1000) / 10 : 0)} %
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-3">
            <FunnelFlow values={funnelValues} label={d.funnelTitle} />
          </div>
          <p className="mt-2 flex justify-between border-t border-border pt-2 text-[12px] text-muted-foreground">
            {d.funnelRate}
            <span className="font-medium text-[#3fe0b5] tabular-nums">
              {n(pulse.funnel.completed ? Math.round((pulse.funnel.nextStep / pulse.funnel.completed) * 1000) / 10 : 0)} %
            </span>
          </p>
        </section>

        <section className={card}>
          <h2 className="text-[14px] font-semibold">{d.skillsTitle}</h2>
          {facets.length === 0 ? (
            <div className="mt-3 grid gap-3">
              <p className="text-[13px] text-muted-foreground">{d.skillsEmpty}</p>
              <p className="flex items-center gap-2 text-[12.5px] font-medium">
                <Target className="size-4 text-teal" aria-hidden="true" /> {d.focusTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.goals.map((g) => (
                  <Badge key={g} variant="outline" className="border-teal/30 bg-teal/10 text-foreground">
                    {t.enums.skill[g as Skill]}
                  </Badge>
                ))}
              </div>
              <Link href="/onboarding" className="text-[12.5px] text-primary hover:underline">
                {d.completeProfile}
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-2 grid justify-items-center">
                <HealthRing facets={facets.map((f) => ({ label: t.enums.skill[f.skill], value: f.value }))} center={facetAverage} caption={d.skillsCenter} />
              </div>
              <ul className="mt-2 grid gap-1.5 text-[12.5px]">
                {facets.map((f) => (
                  <li key={f.skill} className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', f.value >= 85 ? 'bg-[#3fe0b5]' : f.value >= 60 ? 'bg-[#4c7dff]' : 'bg-[#7b6cff]')} />
                      <span className="truncate">{t.enums.skill[f.skill]}</span>
                      {goals.has(f.skill) && <Target className="size-3 shrink-0 text-teal" aria-label={d.focusTitle} />}
                    </span>
                    <span className="tabular-nums">{f.value}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_0.85fr_1fr_1fr]">
        <section className={card}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[14px] font-semibold">{d.topScenarios}</h2>
            <span className="text-[11.5px] text-muted-foreground">{d.callsCol}</span>
          </div>
          {pulse.topScenarios.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted-foreground">{d.topEmpty}</p>
          ) : (
            <ul className="mt-3 grid gap-2.5">
              {pulse.topScenarios.map((s) => (
                <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_88px_32px] items-center gap-2 text-[12.5px]">
                  <Link href={`/scenarios/${s.id}`} className="truncate hover:text-primary" title={s.title}>
                    {s.title}
                  </Link>
                  <span aria-hidden="true" className="h-1.5 rounded-full bg-white/5">
                    <span className="block h-full rounded-full bg-[linear-gradient(90deg,#7b6cff,#4c7dff)]" style={{ width: `${(s.n / maxScenario) * 100}%` }} />
                  </span>
                  <span className="text-right tabular-nums">{n(s.n)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={card}>
          <h2 className="text-[14px] font-semibold">{d.outcomesTitle}</h2>
          {pulse.outcomes.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted-foreground">{d.outcomesEmpty}</p>
          ) : (
            <>
              <Bubbles items={pulse.outcomes.map((o) => ({ label: t.report.outcome[o.key], value: o.n }))} />
              <p className="sr-only">{pulse.outcomes.map((o) => `${t.report.outcome[o.key]} : ${o.n}`).join(', ')}</p>
            </>
          )}
        </section>

        <section className={card}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[14px] font-semibold">{d.recentTitle}</h2>
            {data.recent.length > 0 ? (
              <Link href="/simulations" className="text-[11.5px] text-muted-foreground hover:text-foreground">
                {d.seeHistory}
              </Link>
            ) : (
              can(auth.role, 'scenario:create') && (
                <Link href="/scenarios/new" className="text-[11.5px] text-muted-foreground hover:text-foreground">
                  {d.createScenario}
                </Link>
              )
            )}
          </div>
          {data.recent.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted-foreground">{d.recentEmpty}</p>
          ) : (
            <ul className="mt-3 grid gap-2.5">
              {data.recent.map((s) => (
                <li key={s.id} className="flex min-w-0 items-start justify-between gap-3 text-[12.5px]">
                  <Link href={`/simulations/${s.id}`} className="min-w-0 hover:text-primary">
                    <span className="block truncate font-medium">{s.title}</span>
                    <span className="block truncate text-muted-foreground">
                      {t.enums.status[s.status as 'completed']}
                      {s.overallScore !== null && ` · ${s.overallScore}/100`}
                    </span>
                  </Link>
                  <span className="shrink-0 text-[11.5px] text-muted-foreground">{timeAgo(s.createdAt, now, tag)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={cn(card, 'relative overflow-hidden bg-[radial-gradient(120%_100%_at_100%_100%,#2b2468,#16171d_60%)]')}>
          <h2 className="flex items-center gap-2 text-[14px] font-semibold">
            <Sparkles className="size-4 text-[#a99dff]" aria-hidden="true" /> {d.insightTitle}
          </h2>
          <p className="relative z-10 mt-3 max-w-[64%] text-[13px] leading-relaxed text-[#d9dce6]">
            {pulse.weakest
              ? format(d.insightText, { skill: t.enums.skill[pulse.weakest.skill], score: pulse.weakest.value, n: pulse.weakest.n })
              : d.insightWaiting}
            {pulse.weakest && goals.has(pulse.weakest.skill) && ` ${d.insightGoal}`}
          </p>
          <Link
            href={practice ? `/scenarios/${practice.scenario.id}` : '/scenarios'}
            className="relative z-10 mt-3 inline-block text-[12.5px] text-[#a99dff] hover:underline"
          >
            {practice ? d.insightLink : d.insightStart} →
          </Link>
          <div className="absolute right-2 bottom-1">
            <GlassRing />
          </div>
        </section>
      </div>

      <section aria-labelledby="skills-title" className={cn(card, 'overflow-x-auto')}>
        <h2 id="skills-title" className="text-[14px] font-semibold">
          {d.skillsTable}
        </h2>
        {pulse.skills.length === 0 ? (
          <p className="mt-3 text-[13px] text-muted-foreground">{d.skillsTableEmpty}</p>
        ) : (
          <table className="mt-3 w-full min-w-[720px] text-[12.5px]">
            <thead className="text-left text-[11px] tracking-wide text-muted-foreground uppercase">
              <tr className="border-b border-border">
                <th className="py-2 font-medium">{d.cols.skill}</th>
                <th className="py-2 font-medium">{d.cols.score}</th>
                <th className="py-2 font-medium">{d.cols.trend}</th>
                <th className="py-2 font-medium">{d.cols.last}</th>
                <th className="py-2 text-right font-medium">{d.cols.n}</th>
                <th className="py-2 pl-6 font-medium">{d.cols.goal}</th>
                <th className="py-2 font-medium">{d.cols.state}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pulse.skills.map((row) => {
                const first = row.history[0];
                const last = row.history[row.history.length - 1];
                return (
                  <tr key={row.skill}>
                    <td className="py-2.5 pr-3 font-medium">{t.enums.skill[row.skill]}</td>
                    <td className="py-2.5">
                      <span className={cn('rounded-md px-2 py-0.5 text-[11.5px] font-semibold tabular-nums', scoreTone(row.value))}>{row.value}</span>
                    </td>
                    <td className="py-2.5">
                      <TrendLine values={row.history} tone={last > first ? 'up' : last < first ? 'down' : 'flat'} />
                    </td>
                    <td className="py-2.5 text-muted-foreground">{timeAgo(row.last, now, tag)}</td>
                    <td className="py-2.5 text-right tabular-nums">{n(row.n)}</td>
                    <td className="py-2.5 pl-6 text-muted-foreground">{goals.has(row.skill) ? d.yes : d.none}</td>
                    <td className="py-2.5">
                      <span className={cn('rounded-md px-2 py-0.5 text-[11.5px]', STATE_TONE[row.state])}>{d.states[row.state]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section aria-labelledby="reco" className="mt-2 grid gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="reco" className="text-[15px] font-semibold tracking-tight">
              {d.recommendedTitle}
            </h2>
            <p className="text-[13px] text-muted-foreground">{d.recommendedSubtitle}</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/scenarios">
              {d.seeAll} <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {picks.map(({ scenario, matchedGoals }) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              t={t}
              footer={
                matchedGoals.length > 0 && (
                  <p className="border-t border-border pt-3 text-xs text-teal">
                    {format(d.works, { skills: matchedGoals.map((g) => t.enums.skill[g as Skill]).join(', ') })}
                  </p>
                )
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
