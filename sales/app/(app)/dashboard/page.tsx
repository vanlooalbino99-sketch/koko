import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, Library, Mic, Target, Trophy } from 'lucide-react';
import { ScoreRing, ScoreTrend } from '@/components/charts/score-trend';
import { ScenarioCard } from '@/components/scenarios/scenario-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboard } from '@/lib/dashboard/service';
import { getDb } from '@/lib/db/client';
import { can, type Skill } from '@/lib/domain';
import { format, formatDate } from '@/lib/i18n';
import { recommendScenarios } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { syncPendingSimulations } from '@/lib/simulations/service';
import { voiceProviderFromEnv } from '@/lib/voice/provider';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.nav.dashboard };
}

function Kpi({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: React.ReactNode; detail?: React.ReactNode }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {label}
        <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-primary">{icon}</span>
      </div>
      <div className="text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      {detail && <div className="text-xs text-muted-foreground">{detail}</div>}
    </Card>
  );
}

export default async function DashboardPage() {
  const { auth, profile } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const db = await getDb();
  const provider = voiceProviderFromEnv();
  // Appels restés sans transcription (onglet fermé pendant l'appel) : rattrapés avant d'afficher les chiffres.
  if (provider) await syncPendingSimulations(db, provider, auth).catch(() => undefined);
  const [data, picks] = await Promise.all([getDashboard(db, auth), recommendScenarios(db, auth, profile, locale)]);
  const d = t.dashboard;
  const firstName = auth.user.name.split(' ')[0];

  return (
    <div className="grid gap-6">
      <div className="glow -mx-4 -mt-6 flex flex-wrap items-end justify-between gap-4 px-4 pt-6 pb-2 sm:-mx-6 sm:-mt-8 sm:px-6 sm:pt-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{format(d.greeting, { name: firstName })}</h1>
          <p className="mt-1 text-muted-foreground">{d.subtitle}</p>
        </div>
        <p className="text-sm text-muted-foreground">{formatDate(new Date(), locale)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={<Mic className="size-4" />} label={d.kpiSimulations} value={data.completedSimulations} />
        <Kpi icon={<Clock className="size-4" />} label={d.kpiMinutes} value={data.practiceMinutes} />
        <Kpi
          icon={<Trophy className="size-4" />}
          label={d.kpiScore}
          value={
            data.averageScore === null ? (
              <span className="text-base font-normal text-muted-foreground">{d.noScore}</span>
            ) : (
              <span className="flex items-center gap-3">
                <ScoreRing score={data.averageScore} size={40} />
                {data.averageScore}
                <span className="text-base text-muted-foreground">/100</span>
              </span>
            )
          }
        />
        <Kpi
          icon={<Library className="size-4" />}
          label={d.kpiScenarios}
          value={data.catalogScenarios + data.privateScenarios}
          detail={format(d.kpiScenariosDetail, { catalog: data.catalogScenarios, private: data.privateScenarios })}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{d.progressTitle}</CardTitle>
          </CardHeader>
          {data.scoreHistory.length >= 2 ? (
            <ScoreTrend
              label={d.progressTitle}
              points={data.scoreHistory.map((p) => ({ date: formatDate(p.date, locale), score: p.score }))}
            />
          ) : (
            <div className="grid h-44 place-items-center rounded-xl border border-dashed border-border text-center">
              <p className="max-w-xs text-sm text-muted-foreground">{d.progressEmpty}</p>
            </div>
          )}
        </Card>
        <div className="grid gap-4">
          <Card>
            <CardHeader className="mb-3">
              <CardTitle className="flex items-center gap-2">
                <Target className="size-4 text-teal" aria-hidden="true" /> {d.focusTitle}
              </CardTitle>
            </CardHeader>
            <div className="flex flex-wrap gap-2">
              {profile.goals.map((g) => (
                <Badge key={g} variant="outline" className="border-teal/30 bg-teal/10 text-foreground">
                  {t.enums.skill[g as Skill]}
                </Badge>
              ))}
            </div>
            <Link href="/onboarding" className="mt-4 inline-flex text-sm text-primary hover:underline">
              {d.completeProfile}
            </Link>
          </Card>
          <Card>
            <CardHeader className="mb-3">
              <CardTitle>{d.workspaceTitle}</CardTitle>
            </CardHeader>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">{t.settings.organizationTitle}</dt>
              <dd className="truncate text-right">{auth.organization.name}</dd>
              <dt className="text-muted-foreground">{d.plan}</dt>
              <dd className="text-right">{t.enums.plan[auth.organization.plan as 'free'] ?? auth.organization.plan}</dd>
              <dt className="text-muted-foreground">{d.members}</dt>
              <dd className="text-right tabular-nums">{data.members}</dd>
              <dt className="text-muted-foreground">{d.role}</dt>
              <dd className="text-right">{t.enums.role[auth.role]}</dd>
            </dl>
          </Card>
        </div>
      </div>

      <section aria-labelledby="reco" className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="reco" className="text-lg font-semibold tracking-tight">
              {d.recommendedTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{d.recommendedSubtitle}</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/scenarios">
              {d.seeAll} <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
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

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{d.recentTitle}</CardTitle>
            <CardDescription className="mt-1">{provider ? d.voiceReady : d.voiceSoon}</CardDescription>
          </div>
          {data.recent.length > 0 ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/simulations">{d.seeHistory}</Link>
            </Button>
          ) : (
            can(auth.role, 'scenario:create') && (
              <Button asChild variant="outline" size="sm">
                <Link href="/scenarios/new">{d.createScenario}</Link>
              </Button>
            )
          )}
        </CardHeader>
        {data.recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{d.recentEmpty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {data.recent.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="py-3 pr-4">
                      <Link href={`/simulations/${s.id}`} className="hover:text-primary">
                        {s.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatDate(s.createdAt, locale)}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{t.enums.status[s.status as 'completed']}</td>
                    <td className="py-3 text-right tabular-nums">{s.overallScore ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
