import { and, asc, count, desc, eq, gte, inArray, isNull, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { audit } from '../audit.ts';
import type { AuthContext } from '../auth/service.ts';
import { orgLimits } from '../billing/credits.ts';
import type { Db } from '../db/client.ts';
import { memberships, missions, scenarioVersions, scenarios, simulationAnalyses, simulations, users } from '../db/schema.ts';
import { can, isOneOf, SKILLS, type Role, type Skill } from '../domain.ts';
import { listMembers, TeamError } from '../organization/service.ts';

const DAY = 24 * 60 * 60 * 1000;
// Période du tableau d'équipe.
export const TEAM_PERIOD_DAYS = 30;

// ─── Missions ────────────────────────────────────────────────────────────────

export const MissionSchema = z.object({
  scenarioId: z.uuid(),
  // Un membre précis, ou toute l'équipe sauf la personne qui attribue.
  assignee: z.union([z.uuid(), z.literal('all')]),
  // Date du formulaire (AAAA-MM-JJ) : la mission est due à la fin de ce jour (UTC).
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  note: z.string().trim().max(300).optional(),
});
export type MissionInput = z.infer<typeof MissionSchema>;

export type MissionStatus = 'todo' | 'overdue' | 'done';

export type MissionView = {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  assigneeId: string;
  assigneeName: string;
  assignedByName: string | null;
  dueAt: Date | null;
  note: string | null;
  createdAt: Date;
  status: MissionStatus;
  // Premier appel terminé sur ce scénario après l'attribution.
  completedAt: Date | null;
  score: number | null;
};

function dueAtFrom(dueDate: string | undefined, now: Date): Date | null | 'invalid' {
  if (!dueDate) return null;
  const due = new Date(`${dueDate}T23:59:59.999Z`);
  if (Number.isNaN(due.getTime()) || due < now || due.getTime() > now.getTime() + 366 * DAY) return 'invalid';
  return due;
}

// Attribue un scénario à un membre (ou à toute l'équipe). Renvoie le nombre de missions créées.
export async function createMissions(db: Db, auth: AuthContext, input: MissionInput, now = new Date()): Promise<number> {
  if (!can(auth.role, 'missions:assign')) throw new TeamError('forbidden');
  if (!(await orgLimits(db, auth.organization)).limits.teamSpace) throw new TeamError('plan_required');
  const dueAt = dueAtFrom(input.dueDate, now);
  if (dueAt === 'invalid') throw new TeamError('invalid_date');
  const [scenario] = await db
    .select({ id: scenarios.id })
    .from(scenarios)
    .where(
      and(
        eq(scenarios.id, input.scenarioId),
        eq(scenarios.status, 'active'),
        or(isNull(scenarios.organizationId), eq(scenarios.organizationId, auth.organization.id)),
      ),
    )
    .limit(1);
  if (!scenario) throw new TeamError('not_found');
  const members = await db
    .select({ id: memberships.userId })
    .from(memberships)
    .where(eq(memberships.organizationId, auth.organization.id));
  const assignees =
    input.assignee === 'all' ? members.map((m) => m.id).filter((id) => id !== auth.user.id) : members.some((m) => m.id === input.assignee) ? [input.assignee] : [];
  if (assignees.length === 0) throw new TeamError('not_found');
  await db.insert(missions).values(
    assignees.map((assigneeId) => ({
      organizationId: auth.organization.id,
      scenarioId: scenario.id,
      assigneeId,
      assignedBy: auth.user.id,
      dueAt,
      note: input.note || null,
    })),
  );
  await audit(db, {
    action: 'mission.assigned',
    organizationId: auth.organization.id,
    actorUserId: auth.user.id,
    targetType: 'scenario',
    targetId: scenario.id,
    metadata: { assignees: assignees.length },
  });
  return assignees.length;
}

export async function deleteMission(db: Db, auth: AuthContext, missionId: string) {
  if (!can(auth.role, 'missions:assign')) throw new TeamError('forbidden');
  if (!/^[0-9a-f-]{36}$/i.test(missionId)) throw new TeamError('not_found');
  const deleted = await db
    .delete(missions)
    .where(and(eq(missions.id, missionId), eq(missions.organizationId, auth.organization.id)))
    .returning({ id: missions.id });
  if (deleted.length === 0) throw new TeamError('not_found');
}

const assigner = sql<string | null>`(select ${users.name} from ${users} where ${users.id} = ${missions.assignedBy})`;

async function missionRows(db: Db, organizationId: string, assigneeId?: string, limit = 100) {
  return db
    .select({
      id: missions.id,
      scenarioId: missions.scenarioId,
      scenarioTitle: scenarios.title,
      assigneeId: missions.assigneeId,
      assigneeName: users.name,
      assignedByName: assigner,
      dueAt: missions.dueAt,
      note: missions.note,
      createdAt: missions.createdAt,
    })
    .from(missions)
    .innerJoin(scenarios, eq(scenarios.id, missions.scenarioId))
    .innerJoin(users, eq(users.id, missions.assigneeId))
    .where(and(eq(missions.organizationId, organizationId), assigneeId ? eq(missions.assigneeId, assigneeId) : undefined))
    .orderBy(desc(missions.createdAt))
    .limit(limit);
}

// Une mission est remplie par le premier appel terminé du membre sur ce scénario après l'attribution.
async function withProgress(db: Db, organizationId: string, rows: Awaited<ReturnType<typeof missionRows>>, now: Date): Promise<MissionView[]> {
  if (rows.length === 0) return [];
  const since = new Date(Math.min(...rows.map((r) => r.createdAt.getTime())));
  const calls = await db
    .select({
      userId: simulations.userId,
      scenarioId: scenarioVersions.scenarioId,
      createdAt: simulations.createdAt,
      score: simulations.overallScore,
    })
    .from(simulations)
    .innerJoin(scenarioVersions, eq(scenarioVersions.id, simulations.scenarioVersionId))
    .where(
      and(
        eq(simulations.organizationId, organizationId),
        eq(simulations.status, 'completed'),
        gte(simulations.createdAt, since),
        inArray(simulations.userId, [...new Set(rows.map((r) => r.assigneeId))]),
        inArray(scenarioVersions.scenarioId, [...new Set(rows.map((r) => r.scenarioId))]),
      ),
    )
    .orderBy(asc(simulations.createdAt));
  return rows.map((r) => {
    const call = calls.find((c) => c.userId === r.assigneeId && c.scenarioId === r.scenarioId && c.createdAt >= r.createdAt);
    const status: MissionStatus = call ? 'done' : r.dueAt && r.dueAt < now ? 'overdue' : 'todo';
    return { ...r, status, completedAt: call?.createdAt ?? null, score: call?.score ?? null };
  });
}

export async function listTeamMissions(db: Db, auth: AuthContext, now = new Date()): Promise<MissionView[]> {
  if (!can(auth.role, 'team:view')) return [];
  return withProgress(db, auth.organization.id, await missionRows(db, auth.organization.id), now);
}

export async function listMyMissions(db: Db, auth: AuthContext, now = new Date()): Promise<MissionView[]> {
  return withProgress(db, auth.organization.id, await missionRows(db, auth.organization.id, auth.user.id, 30), now);
}

// ─── Tableau d'équipe ────────────────────────────────────────────────────────

export type MemberStats = {
  id: string;
  name: string;
  email: string;
  role: Role;
  joinedAt: Date;
  calls: number;
  minutes: number;
  averageScore: number | null;
  lastActivity: Date | null;
  weakestSkill: { skill: Skill; score: number } | null;
};

export type TeamOverview = {
  since: Date;
  members: MemberStats[];
  totals: { calls: number; minutes: number; averageScore: number | null; activeMembers: number };
  // Moyenne de l'équipe par compétence, sur les appels analysés de la période.
  skills: { skill: Skill; score: number }[];
};

// Chiffres agrégés seulement : un responsable ne lit jamais les transcriptions de ses membres.
export async function teamOverview(db: Db, auth: AuthContext, now = new Date()): Promise<TeamOverview | null> {
  if (!can(auth.role, 'team:view')) return null;
  const since = new Date(now.getTime() - TEAM_PERIOD_DAYS * DAY);
  const inPeriod = and(eq(simulations.organizationId, auth.organization.id), gte(simulations.createdAt, since));
  const [members, activity, skillRows] = await Promise.all([
    listMembers(db, auth),
    db
      .select({
        userId: simulations.userId,
        calls: sql<number>`count(*) filter (where ${simulations.status} = 'completed')`.mapWith(Number),
        seconds: sql<number>`coalesce(sum(${simulations.durationSeconds}) filter (where ${simulations.status} = 'completed'), 0)`.mapWith(Number),
        scoreSum: sql<number>`coalesce(sum(${simulations.overallScore}), 0)`.mapWith(Number),
        scored: count(simulations.overallScore),
        lastActivity: sql<Date | null>`max(${simulations.createdAt})`.mapWith((v) => (v === null ? null : new Date(v))),
      })
      .from(simulations)
      .where(inPeriod)
      .groupBy(simulations.userId),
    db
      .select({
        userId: simulations.userId,
        skill: sql<string>`skill.value ->> 'skill'`,
        total: sql<number>`sum((skill.value ->> 'score')::int)`.mapWith(Number),
        n: sql<number>`count(*)`.mapWith(Number),
      })
      .from(simulationAnalyses)
      .innerJoin(simulations, eq(simulations.id, simulationAnalyses.simulationId))
      .innerJoin(sql`jsonb_array_elements(${simulationAnalyses.result} -> 'skills') as skill`, sql`true`)
      .where(and(inPeriod, eq(simulationAnalyses.status, 'completed')))
      .groupBy(simulations.userId, sql`skill.value ->> 'skill'`),
  ]);
  const team = new Map<Skill, { total: number; n: number }>();
  const weakest = new Map<string, { skill: Skill; score: number }>();
  for (const row of skillRows) {
    if (!isOneOf(SKILLS, row.skill) || row.n === 0) continue;
    const t = team.get(row.skill) ?? { total: 0, n: 0 };
    team.set(row.skill, { total: t.total + row.total, n: t.n + row.n });
    const score = Math.round(row.total / row.n);
    const current = weakest.get(row.userId);
    if (!current || score < current.score) weakest.set(row.userId, { skill: row.skill, score });
  }
  const byUser = new Map(activity.map((a) => [a.userId, a]));
  const stats: MemberStats[] = (members ?? []).map((m) => {
    const a = byUser.get(m.id);
    return {
      ...m,
      role: m.role as Role,
      calls: a?.calls ?? 0,
      minutes: Math.round((a?.seconds ?? 0) / 60),
      averageScore: a && a.scored > 0 ? Math.round(a.scoreSum / a.scored) : null,
      lastActivity: a?.lastActivity ?? null,
      weakestSkill: weakest.get(m.id) ?? null,
    };
  });
  // Les anciens membres comptent dans les totaux de l'équipe, pas dans la liste.
  const scored = activity.reduce((s, a) => s + a.scored, 0);
  return {
    since,
    members: stats,
    totals: {
      calls: activity.reduce((s, a) => s + a.calls, 0),
      minutes: Math.round(activity.reduce((s, a) => s + a.seconds, 0) / 60),
      averageScore: scored > 0 ? Math.round(activity.reduce((s, a) => s + a.scoreSum, 0) / scored) : null,
      activeMembers: stats.filter((m) => m.calls > 0).length,
    },
    skills: SKILLS.filter((s) => team.has(s)).map((s) => {
      const t = team.get(s)!;
      return { skill: s, score: Math.round(t.total / t.n) };
    }),
  };
}
