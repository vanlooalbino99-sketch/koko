import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Mic, Trophy, Users } from 'lucide-react';
import { changeRoleAction, deleteMissionAction, removeMemberAction, revokeInvitationAction } from '@/app/actions/team';
import { SkillRadar } from '@/components/charts/skill-radar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormAlert } from '@/components/ui/field';
import { Select } from '@/components/ui/input';
import { Kpi } from '@/components/ui/kpi';
import { orgLimits } from '@/lib/billing/credits';
import { seatsInUse } from '@/lib/billing/service';
import { getDb } from '@/lib/db/client';
import { can } from '@/lib/domain';
import { format, formatDate } from '@/lib/i18n';
import { INVITATION_DAYS, listInvitations } from '@/lib/organization/invitations';
import { assignableRoles, canManageMember, type TeamErrorCode } from '@/lib/organization/service';
import { listScenarios } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { listTeamMissions, TEAM_PERIOD_DAYS, teamOverview, type MissionStatus } from '@/lib/team/service';
import { cn } from '@/lib/utils';
import { InviteForm } from './invite-form';
import { MissionForm } from './mission-form';

type Props = { searchParams: Promise<{ done?: string; error?: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.team.title };
}

const STATUS_TONE: Record<MissionStatus, string> = {
  todo: 'border-border text-muted-foreground',
  overdue: 'border-destructive/30 bg-destructive/10 text-destructive',
  done: 'border-success/30 bg-success/10 text-success',
};

export default async function TeamPage({ searchParams }: Props) {
  const { auth } = await requireOnboarded();
  if (!can(auth.role, 'team:view')) notFound();
  const { t, locale } = await getI18n();
  const tm = t.team;
  const params = await searchParams;
  const db = await getDb();
  const canAssign = can(auth.role, 'missions:assign');
  const canInvite = can(auth.role, 'members:manage');
  const [overview, { limits }, invitations, missions, scenarios, seats] = await Promise.all([
    teamOverview(db, auth),
    orgLimits(db, auth.organization),
    listInvitations(db, auth),
    listTeamMissions(db, auth),
    canAssign ? listScenarios(db, auth) : Promise.resolve([]),
    seatsInUse(db, auth.organization.id),
  ]);
  if (!overview) notFound();

  const done = params.done && params.done in tm.done ? tm.done[params.done as keyof typeof tm.done] : undefined;
  const error = params.error && params.error in tm.errors ? tm.errors[params.error as TeamErrorCode] : undefined;
  const actor = { id: auth.user.id, role: auth.role };
  const roles = assignableRoles(auth.role);
  const { totals } = overview;

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{tm.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{format(tm.subtitle, { org: auth.organization.name, days: TEAM_PERIOD_DAYS })}</p>
        </div>
        {limits.teamSpace && <p className="text-sm text-muted-foreground tabular-nums">{format(tm.seats, { used: seats, total: limits.seats })}</p>}
      </div>

      <FormAlert tone="success" message={done} />
      <FormAlert message={error} />

      {!limits.teamSpace && (
        <Card className="flex flex-wrap items-center justify-between gap-4 border-primary/30 bg-primary/5">
          <div className="max-w-2xl">
            <CardTitle>{tm.upsellTitle}</CardTitle>
            <CardDescription className="mt-1">{tm.upsellText}</CardDescription>
          </div>
          <Button asChild>
            <Link href="/billing">{tm.upsellCta}</Link>
          </Button>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={<Mic className="size-4" />} label={tm.kpiCalls} value={totals.calls} />
        <Kpi icon={<Clock className="size-4" />} label={tm.kpiMinutes} value={totals.minutes} />
        <Kpi
          icon={<Trophy className="size-4" />}
          label={tm.kpiScore}
          value={totals.averageScore === null ? <span className="text-base font-normal text-muted-foreground">{t.dashboard.noScore}</span> : totals.averageScore}
        />
        <Kpi
          icon={<Users className="size-4" />}
          label={tm.kpiActive}
          value={totals.activeMembers}
          detail={format(tm.kpiActiveDetail, { n: overview.members.length })}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{tm.membersTitle}</CardTitle>
              <CardDescription className="mt-1">{tm.privacy}</CardDescription>
            </div>
          </CardHeader>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {overview.members.map((m) => {
              const editable = canManageMember(actor, m);
              return (
                <li key={m.id} className="grid gap-3 px-4 py-3 text-sm" data-member={m.email}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block font-medium">
                        {m.name} {m.id === auth.user.id && <span className="text-xs font-normal text-muted-foreground">({tm.you})</span>}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">{m.email}</span>
                    </span>
                    {editable && roles.length > 0 ? (
                      <form action={changeRoleAction} className="flex items-center gap-2">
                        <input type="hidden" name="user" value={m.id} />
                        <Select name="role" defaultValue={m.role} aria-label={format(tm.roleLabel, { name: m.name })} className="h-9 w-40">
                          {roles.map((r) => (
                            <option key={r} value={r}>
                              {t.enums.role[r]}
                            </option>
                          ))}
                        </Select>
                        <Button type="submit" variant="outline" size="sm">
                          {tm.saveRole}
                        </Button>
                      </form>
                    ) : (
                      <Badge variant="outline">{t.enums.role[m.role]}</Badge>
                    )}
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-5">
                    <div>
                      <dt className="text-muted-foreground">{tm.colCalls}</dt>
                      <dd className="text-sm tabular-nums">{m.calls}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{tm.colMinutes}</dt>
                      <dd className="text-sm tabular-nums">{m.minutes}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{tm.colScore}</dt>
                      <dd className="text-sm tabular-nums">{m.averageScore ?? '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{tm.colWeakest}</dt>
                      <dd className="text-sm">{m.weakestSkill ? `${t.enums.skill[m.weakestSkill.skill]} (${m.weakestSkill.score})` : '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{tm.colLast}</dt>
                      <dd className="text-sm">{m.lastActivity ? formatDate(m.lastActivity, locale) : tm.never}</dd>
                    </div>
                  </dl>
                  {editable && (
                    <details className="group text-xs">
                      <summary className="cursor-pointer list-none text-muted-foreground hover:text-destructive">{tm.remove}</summary>
                      <form action={removeMemberAction} className="mt-2">
                        <input type="hidden" name="user" value={m.id} />
                        <Button type="submit" variant="outline" size="sm" className="border-destructive/40 text-destructive">
                          {format(tm.removeLabel, { name: m.name })}
                        </Button>
                      </form>
                    </details>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{tm.skillsTitle}</CardTitle>
          </CardHeader>
          {overview.skills.length >= 3 ? (
            <SkillRadar title={tm.skillsTitle} skills={overview.skills.map((s) => ({ label: t.enums.skill[s.skill], score: s.score }))} />
          ) : (
            <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{tm.skillsEmpty}</p>
          )}
        </Card>
      </div>

      {canInvite && limits.teamSpace && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{tm.inviteTitle}</CardTitle>
              <CardDescription className="mt-1">{format(tm.inviteText, { days: INVITATION_DAYS })}</CardDescription>
            </div>
          </CardHeader>
          <InviteForm
            roles={roles.map((r) => ({ value: r, label: t.enums.role[r] }))}
            labels={{ email: tm.inviteEmail, role: tm.inviteRole, submit: tm.inviteSubmit, link: tm.inviteLink, copy: tm.copy, copied: tm.copied }}
          />
          {invitations.length > 0 && (
            <>
              <h3 className="mt-6 mb-3 text-sm font-semibold">{tm.pendingTitle}</h3>
              <ul className="divide-y divide-border rounded-xl border border-border">
                {invitations.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                    <span>
                      <span className="block">{i.email}</span>
                      <span className="block text-xs text-muted-foreground">
                        {t.enums.role[i.role as 'member']} · {format(tm.expires, { date: formatDate(i.expiresAt, locale) })}
                      </span>
                    </span>
                    <form action={revokeInvitationAction}>
                      <input type="hidden" name="invitation" value={i.id} />
                      <Button type="submit" variant="ghost" size="sm" aria-label={format(tm.revokeLabel, { email: i.email })}>
                        {tm.revoke}
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      )}

      {(missions.length > 0 || (canAssign && limits.teamSpace)) && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{tm.missionsTitle}</CardTitle>
              <CardDescription className="mt-1">{tm.missionsText}</CardDescription>
            </div>
          </CardHeader>
          {canAssign && limits.teamSpace && scenarios.length > 0 && (
            <MissionForm
              scenarios={scenarios
                .toSorted((a, b) => Number(a.language !== locale) - Number(b.language !== locale) || a.title.localeCompare(b.title, locale))
                .map((s) => ({ value: s.id, label: `${s.title} (${s.language.toUpperCase()})` }))}
              members={overview.members.filter((m) => m.id !== auth.user.id).map((m) => ({ value: m.id, label: m.name }))}
              minDate={new Date().toISOString().slice(0, 10)}
              labels={{
                scenario: tm.missionScenario,
                assignee: tm.missionAssignee,
                all: tm.missionAll,
                due: tm.missionDue,
                note: tm.missionNote,
                noteHint: tm.missionNoteHint,
                submit: tm.missionSubmit,
              }}
            />
          )}
          {missions.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{tm.missionsEmpty}</p>
          ) : (
            <ul className="mt-6 divide-y divide-border rounded-xl border border-border" aria-label={tm.missionsTitle}>
              {missions.map((m) => (
                <li key={m.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 text-sm" data-mission={m.status}>
                  <span className="min-w-0">
                    <span className="block font-medium">{m.scenarioTitle}</span>
                    <span className="block text-xs text-muted-foreground">
                      {m.assigneeName}
                      {m.assignedByName && ` · ${format(tm.assignedBy, { name: m.assignedByName })}`}
                      {m.dueAt && ` · ${format(tm.dueOn, { date: formatDate(m.dueAt, locale) })}`}
                    </span>
                    {m.note && <span className="mt-1 block text-xs whitespace-pre-line">{m.note}</span>}
                  </span>
                  <span className="flex items-center gap-2">
                    <Badge variant="outline" className={cn(STATUS_TONE[m.status])}>
                      {m.status === 'done' && m.completedAt
                        ? m.score === null
                          ? format(tm.doneOn, { date: formatDate(m.completedAt, locale) })
                          : format(tm.doneScore, { date: formatDate(m.completedAt, locale), score: m.score })
                        : tm.missionStatus[m.status]}
                    </Badge>
                    {canAssign && (
                      <form action={deleteMissionAction}>
                        <input type="hidden" name="mission" value={m.id} />
                        <Button type="submit" variant="ghost" size="sm" aria-label={format(tm.missionDeleteLabel, { title: m.scenarioTitle, name: m.assigneeName })}>
                          {tm.missionDelete}
                        </Button>
                      </form>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
