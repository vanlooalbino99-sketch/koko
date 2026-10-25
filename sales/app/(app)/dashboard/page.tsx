import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ClipboardList, Mic, Target } from 'lucide-react';
import { Change } from '@/components/cockpit/change';
import { AreaWave, Bars, Bubbles, buckets, Donut, DotMatrix, DottedLine, FunnelFlow, Gauge, HEX_COLORS, HexHealth, SERIES_COLORS, TrendLine } from '@/components/cockpit/charts';
import { GlassTorus } from '@/components/cockpit/glass-torus';
import { card, CardTitle, KpiCard, LiveBadge, ViewAll } from '@/components/cockpit/panel';
import { ParticleWave } from '@/components/cockpit/particle-wave';
import { PeriodMenu } from '@/components/cockpit/period-menu';
import { InsightSpark } from '@/components/cockpit/insight-spark';
import { ScenarioCard } from '@/components/scenarios/scenario-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { creditStatus } from '@/lib/billing/credits';
import { getDashboard } from '@/lib/dashboard/service';
import { PERIODS, periodOf, trainingPulse, type SkillRow } from '@/lib/dashboard/pulse';
import { getDb } from '@/lib/db/client';
import { can, SKILLS, type Family, type Skill } from '@/lib/domain';
import { format, formatDate, timeAgo } from '@/lib/i18n';
import { recommendScenarios } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { syncPendingSimulations } from '@/lib/simulations/service';
import { listMyMissions } from '@/lib/team/service';
import { cn } from '@/lib/utils';
import { voiceProviderFromEnv } from '@/lib/voice/provider';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.nav.overview };
}

type Props = { searchParams: Promise<{ period?: string }> };

const DAY = 86_400_000;

// Étiquettes colorées du tableau, comme sur la maquette : fond sombre teinté, texte vif.
const STATE_TONE: Record<SkillRow['state'], string> = {
  weak: 'bg-[#f0506e]/15 text-[#ff5a76]',
  progress: 'border border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#ff9f2e]',
  mastered: 'bg-[#2fd07a]/12 text-[#3fdc85]',
};

function scoreTone(score: number) {
  return score >= 75 ? 'bg-[#2fd07a]/12 text-[#3fdc85]' : score >= 50 ? 'bg-[#f59e0b]/12 text-[#ff9f2e]' : 'bg-[#f0506e]/15 text-[#ff5a76]';
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
  const pct = (v: number) => `${new Intl.NumberFormat(tag, { maximumFractionDigits: 1 }).format(v)} %`;
  const short = new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short' });
  // « vs 26 août – 24 sept. » : la période précédente, de même longueur.
  const vs = `vs ${short.format(new Date(pulse.since.getTime() - days * DAY))} – ${short.format(new Date(pulse.since.getTime() - DAY))}`;
  const goals = new Set(profile.goals);
  const periodPill = <PeriodMenu path="/dashboard" current={days} periods={PERIODS} labels={d.periods} short={d.periodsShort} srLabel={d.period} compact />;

  const funnelKeys = ['started', 'completed', 'scored', 'nextStep'] as const;
  const funnelValues = funnelKeys.map((k) => pulse.funnel[k]);
  const familyTotal = pulse.families.reduce((s, f) => s + f.minutes, 0);
  const familySegments = pulse.families.map((f, i) => ({
    label: t.enums.family[f.family as Family] ?? f.family,
    value: f.minutes,
    color: SERIES_COLORS[i % SERIES_COLORS.length],
  }));
  const maxScenario = Math.max(1, ...pulse.topScenarios.map((s) => s.n));
  const maxEvaluations = Math.max(1, ...pulse.skills.map((s) => s.n));
  // Nid d'abeille à cinq tuiles comme la maquette : d'abord les objectifs notés, puis les compétences les plus évaluées.
  const facets = [...pulse.skills]
    .sort((a, b) => Number(goals.has(b.skill)) - Number(goals.has(a.skill)) || b.n - a.n)
    .slice(0, 5)
    .sort((a, b) => a.skill.localeCompare(b.skill));
  // Avant le premier appel noté : les mêmes tuiles, vides (« — »), avec vos objectifs en premier.
  const pending = [...new Set([...(profile.goals as Skill[]), ...SKILLS])].slice(0, 5);
  const facetAverage = facets.length ? Math.round(facets.reduce((s, f) => s + f.value, 0) / facets.length) : null;

  return (
    <div className="grid gap-2.5">
      <h1 className="sr-only">{format(d.greeting, { name: firstName })}</h1>

      {!provider && <p className="rounded-xl border border-[#f5a524]/30 bg-[#f5a524]/10 px-4 py-2.5 text-[13px] text-[#ffc15e]">{d.voiceOff}</p>}

      {/* Indicateurs */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.6fr_1.15fr_1.08fr_0.98fr_0.94fr_0.9fr]">
        <KpiCard
          title={d.kpiMinutes}
          badge={<LiveBadge label={d.live} />}
          value={format(d.minutesValue, { n: n(pulse.minutes.value) })}
          big
          delta={<Change value={pulse.minutes.value} previous={pulse.minutes.previous} label={vs} tag={tag} />}
          bleed
        >
          <ParticleWave values={pulse.minutes.byDay} label={d.minutesChart} />
        </KpiCard>

        <KpiCard title={d.kpiCalls} value={n(pulse.calls.value)} delta={<Change value={pulse.calls.value} previous={pulse.calls.previous} label={vs} tag={tag} />}>
          <DotMatrix values={pulse.calls.grid} label={d.callsChart} />
        </KpiCard>

        <KpiCard title={d.kpiBest} value={pulse.best ?? d.none} delta={<p className="text-[11.5px] text-[#9aa1b2]">{format(d.bestHint, { n: pulse.score.n })}</p>} bleed>
          <AreaWave values={pulse.score.series} label={d.bestChart} />
        </KpiCard>

        <KpiCard
          title={d.kpiActiveDays}
          value={format(d.activeDaysValue, { n: pulse.activeDays.value, days })}
          delta={<p className="text-[11.5px] text-[#9aa1b2]">{d.activeDaysHint}</p>}
        >
          <DottedLine values={pulse.calls.byDay} label={d.activeDaysChart} />
        </KpiCard>

        <KpiCard
          title={d.kpiCredits}
          value={format(d.creditsValue, { n: n(credits.remaining) })}
          delta={<p className="text-[11.5px] text-[#9aa1b2]">{format(d.creditsHint, { total: n(credits.monthlyCredits), plan: t.enums.plan[credits.plan] })}</p>}
        >
          <Bars values={buckets(pulse.minutes.byDay, 7)} label={d.creditsChart} />
        </KpiCard>

        <KpiCard
          title={d.kpiScore}
          value={pulse.score.value === null ? <span className="text-[14px] font-normal text-[#9aa1b2]">{d.noScore}</span> : pulse.score.value}
          delta={<Change value={pulse.score.value} previous={pulse.score.previous} label={format(d.scoreHint, { n: pulse.score.n })} points tag={tag} />}
        >
          <Gauge value={pulse.score.value} label={d.kpiScore} />
        </KpiCard>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[1.15fr_1.45fr_1fr]">
        {/* Temps par type d'appel : anneau épais et légende, comme « Revenue by Product ». */}
        <section className={cn(card, 'bs-rise')}>
          <CardTitle action={periodPill}>{d.familiesTitle}</CardTitle>
          <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <div className="w-[46%] max-w-[230px] shrink-0">
              <Donut segments={familySegments} center={format(d.minutesValue, { n: n(familyTotal) })} caption={d.familiesTotal} />
            </div>
            {familyTotal === 0 ? (
              <p className="text-[13px] text-[#9aa1b2]">{d.familiesEmpty}</p>
            ) : (
              <ul className="grid w-full flex-1 gap-4 text-[13px]">
                {familySegments.slice(0, 4).map((s) => (
                  <li key={s.label} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2.5">
                    <span aria-hidden="true" className="mt-1 size-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="min-w-0">
                      <span className="block truncate text-[#eef0f5]">{s.label}</span>
                      <span className="mt-1 block text-[12px] text-[#9aa1b2] tabular-nums">{format(d.minutesValue, { n: n(s.value) })}</span>
                    </span>
                    <span className="self-end text-[12px] text-[#c9cdd8] tabular-nums">{pct(familyTotal ? (s.value / familyTotal) * 100 : 0)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Parcours des appels : colonnes, pastilles de conversion et bande dégradée, comme « User Acquisition ». */}
        <section className={cn(card, 'bs-rise flex flex-col')}>
          <CardTitle>{d.funnelTitle}</CardTitle>
          <ol className="mt-4 grid grid-cols-4 text-center">
            {funnelKeys.map((key, i) => (
              <li key={key} className="grid min-w-0 justify-items-center gap-1.5 px-1">
                <p className="max-w-full truncate text-[12px] text-[#d3d7e1]">
                  {i + 1}. {d.funnelSteps[key]}
                </p>
                <p className="text-[21px] leading-none font-semibold tabular-nums">{n(funnelValues[i])}</p>
                <span className="mt-1 rounded-md border border-[#c9cdd8]/50 px-2.5 py-1 text-[11.5px] text-[#eef0f5] tabular-nums">
                  {pct(i === 0 ? (funnelValues[0] ? 100 : 0) : funnelValues[i - 1] ? (funnelValues[i] / funnelValues[i - 1]) * 100 : 0)}
                </span>
              </li>
            ))}
          </ol>
          <FunnelFlow values={funnelValues} label={d.funnelTitle} />
          <p className="mt-3 flex items-center justify-between rounded-lg border border-border px-4 py-3 text-[12.5px] text-[#9aa1b2]">
            {d.funnelRate}
            <span className="font-medium text-[#3fe0b5] tabular-nums">{pct(funnelValues[0] ? (funnelValues[3] / funnelValues[0]) * 100 : 0)}</span>
          </p>
        </section>

        {/* Compétences en nid d'abeille, comme « Account Health ». */}
        <section className={cn(card, 'bs-rise')}>
          <CardTitle>{d.skillsTitle}</CardTitle>
          {facets.length === 0 ? (
            <div className="mt-3 grid gap-3">
              <div className="grid justify-items-center">
                <HexHealth facets={pending.map((g) => ({ label: t.enums.skill[g], value: null }))} center={null} caption={d.skillsCenter} />
              </div>
              <p className="text-[13px] text-[#9aa1b2]">{d.skillsEmpty}</p>
              <p className="flex items-center gap-2 text-[12.5px] font-medium">
                <Target className="size-4 text-[#3fe0b5]" aria-hidden="true" /> {d.focusTitle}
              </p>
              <Link href="/onboarding" className="text-[12.5px] text-[#8f88ff] hover:underline">
                {d.completeProfile}
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-2 grid justify-items-center">
                <HexHealth facets={facets.map((f) => ({ label: t.enums.skill[f.skill], value: f.value }))} center={facetAverage} caption={d.skillsCenter} />
              </div>
              <ul className="mt-3 grid gap-1.5 text-[12px]">
                {facets.map((f, i) => (
                  <li key={f.skill} className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2.5 text-[#d3d7e1]">
                      <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ background: HEX_COLORS[i % HEX_COLORS.length] }} />
                      <span className="truncate">{t.enums.skill[f.skill]}</span>
                      {goals.has(f.skill) && <Target className="size-3 shrink-0 text-[#3fe0b5]" aria-label={d.focusTitle} />}
                    </span>
                    <span className="text-[#c9cdd8] tabular-nums">{f.value}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1.07fr_1.27fr]">
        {/* Scénarios les plus joués, comme « Top Acquisition Channels ». */}
        <section className={cn(card, 'bs-rise')}>
          <CardTitle action={periodPill}>{d.topScenarios}</CardTitle>
          {pulse.topScenarios.length === 0 ? (
            <p className="mt-3 text-[13px] text-[#9aa1b2]">{d.topEmpty}</p>
          ) : (
            <>
              <p className="mt-2 text-right text-[11px] text-[#9aa1b2]">{d.callsCol}</p>
              <ul className="mt-1.5 grid gap-3">
                {pulse.topScenarios.map((s, i) => (
                  <li key={s.id} className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_36px] items-center gap-3 text-[12.5px]">
                    <Link href={`/scenarios/${s.id}`} className="truncate text-[#d3d7e1] hover:text-white" title={s.title}>
                      {s.title}
                    </Link>
                    <span aria-hidden="true" className="h-[3px] rounded-full">
                      <span
                        className="bs-grow-x block h-full rounded-full bg-[#5c55f0]"
                        style={{ width: `${(s.n / maxScenario) * 100}%`, animationDelay: `${i * 80}ms` }}
                      />
                    </span>
                    <span className="text-right text-[#d3d7e1] tabular-nums">{n(s.n)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Issue des appels en bulles, comme « Events Breakdown » (titre gris). */}
        <section className={cn(card, 'bs-rise')}>
          <CardTitle muted>{d.outcomesTitle}</CardTitle>
          {pulse.outcomes.length === 0 ? (
            <p className="mt-3 text-[13px] text-[#9aa1b2]">{d.outcomesEmpty}</p>
          ) : (
            <>
              <Bubbles items={pulse.outcomes.map((o) => ({ label: t.report.outcome[o.key], value: o.n }))} />
              <p className="sr-only">{pulse.outcomes.map((o) => `${t.report.outcome[o.key]} : ${o.n}`).join(', ')}</p>
            </>
          )}
        </section>

        {/* Dernières simulations, comme « Recent Account Activity ». */}
        <section className={cn(card, 'bs-rise')}>
          <CardTitle
            action={
              data.recent.length > 0 ? (
                <ViewAll href="/simulations">{d.viewAll}</ViewAll>
              ) : (
                can(auth.role, 'scenario:create') && <ViewAll href="/scenarios/new">{d.createScenario}</ViewAll>
              )
            }
          >
            {d.recentTitle}
          </CardTitle>
          {data.recent.length === 0 ? (
            <p className="mt-3 text-[13px] text-[#9aa1b2]">{d.recentEmpty}</p>
          ) : (
            <ul className="mt-4 grid gap-4">
              {data.recent.slice(0, 5).map((s) => (
                <li key={s.id} className="flex min-w-0 items-center justify-between gap-3 text-[12px]">
                  <Link href={`/simulations/${s.id}`} className="min-w-0 truncate text-[#d3d7e1] hover:text-white">
                    {s.title} · {t.enums.status[s.status as 'completed']}
                    {s.overallScore !== null && ` · ${s.overallScore}/100`}
                  </Link>
                  <span className="shrink-0 text-[11.5px] text-[#9aa1b2]">{timeAgo(s.createdAt, now, tag)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* À retenir, comme « AI Insight » : carte violette et anneau de verre qui tourne. */}
        <section className={cn(card, 'bs-rise relative flex min-h-[200px] overflow-hidden border-[#3a3b7a]/50 bg-[linear-gradient(135deg,#25274d,#222448_60%,#272a55)]')}>
          <div className="relative z-10 flex min-w-0 flex-1 flex-col pr-2">
            <h2 className="flex items-center gap-2.5 text-[15px] font-medium">
              <InsightSpark /> {d.insightTitle}
            </h2>
            <p className="mt-5 max-w-[34ch] text-[12.5px] leading-relaxed text-[#cfd2e6]">
              {pulse.weakest
                ? format(d.insightText, { skill: t.enums.skill[pulse.weakest.skill], score: pulse.weakest.value, n: pulse.weakest.n })
                : d.insightWaiting}
              {pulse.weakest && goals.has(pulse.weakest.skill) && ` ${d.insightGoal}`}
            </p>
            <Link
              href={practice ? `/scenarios/${practice.scenario.id}` : '/scenarios'}
              className="mt-auto block pt-4 pl-3 text-[12.5px] text-[#d9d6ff] hover:text-white"
            >
              {practice ? d.insightLink : d.insightStart}
              {'\u00a0'}
              <ArrowRight className="inline size-3.5 align-[-2px]" aria-hidden="true" />
            </Link>
          </div>
          <GlassTorus className="w-[40%] max-w-[170px] shrink-0 self-center" />
        </section>
      </div>

      {/* Compétences à surveiller, comme « Accounts at Risk ». */}
      <section aria-labelledby="skills-title" className={cn(card, 'bs-rise overflow-x-auto')}>
        <CardTitle id="skills-title" action={pulse.skills.length > 0 && <ViewAll href="/simulations">{d.viewAll}</ViewAll>}>
          {d.skillsTable}
        </CardTitle>
        {pulse.skills.length === 0 ? (
          <p className="mt-3 text-[13px] text-[#9aa1b2]">{d.skillsTableEmpty}</p>
        ) : (
          <table className="mt-3 w-full min-w-[760px] text-[12px]">
            <thead className="text-left text-[10.5px] tracking-[0.04em] text-[#c9cdd8] uppercase">
              <tr className="border-b border-[#9aa1b2]/70">
                <th className="px-3 py-2 font-medium">{d.cols.skill}</th>
                <th className="py-2 font-medium">{d.cols.score}</th>
                <th className="py-2 font-medium">{d.cols.trend}</th>
                <th className="py-2 font-medium">{d.cols.last}</th>
                <th className="py-2 font-medium">{d.cols.n}</th>
                <th className="py-2 font-medium">{d.cols.goal}</th>
                <th className="py-2 font-medium">{d.cols.state}</th>
              </tr>
            </thead>
            <tbody>
              {pulse.skills.map((row) => {
                const first = row.history[0];
                const last = row.history[row.history.length - 1];
                return (
                  <tr key={row.skill}>
                    <td className="px-3 py-2.5 text-[#eef0f5]">{t.enums.skill[row.skill]}</td>
                    <td className="py-2.5">
                      <span className={cn('rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums', scoreTone(row.value))}>{row.value}</span>
                    </td>
                    <td className="py-2.5">
                      <TrendLine values={row.history} tone={last > first ? 'up' : last < first ? 'down' : 'flat'} />
                    </td>
                    <td className="py-2.5 text-[#d3d7e1]">{timeAgo(row.last, now, tag)}</td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-2.5">
                        <span aria-hidden="true" className="h-1 w-20 rounded-full bg-[#e9ecf4]">
                          <span className="bs-grow-x block h-full rounded-full bg-[linear-gradient(90deg,#4c7dff,#5ff0d6)]" style={{ width: `${(row.n / maxEvaluations) * 100}%` }} />
                        </span>
                        <span className="text-[#d3d7e1] tabular-nums">{n(row.n)}</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-[#d3d7e1]">{goals.has(row.skill) ? d.yes : d.none}</td>
                    <td className="py-2.5">
                      <span className={cn('rounded px-1.5 py-0.5 text-[11px]', STATE_TONE[row.state])}>{d.states[row.state]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {shownMissions.length > 0 && (
        <section className={card}>
          <CardTitle>
            <span className="flex items-center gap-2">
              <ClipboardList className="size-4 text-[#8f88ff]" aria-hidden="true" /> {d.missionsTitle}
            </span>
          </CardTitle>
          <p className="mt-1 text-[12.5px] text-[#9aa1b2]">{d.missionsText}</p>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border" aria-label={d.missionsTitle}>
            {shownMissions.map((m) => (
              <li key={m.id} className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-3 text-[13px]" data-mission={m.status}>
                <span className="min-w-0">
                  <span className="block font-medium">{m.scenarioTitle}</span>
                  <span className="block text-xs text-[#9aa1b2]">
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

      <section aria-labelledby="reco" className="mt-2 grid gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="reco" className="text-[15px] font-medium tracking-tight">
              {d.recommendedTitle}
            </h2>
            <p className="text-[13px] text-[#9aa1b2]">{d.recommendedSubtitle}</p>
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
