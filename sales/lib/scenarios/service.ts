import { and, desc, eq, ilike, inArray, isNull, or, sql, type SQL } from 'drizzle-orm';
import { audit } from '../audit.ts';
import { orgLimits } from '../billing/credits.ts';
import type { AuthContext } from '../auth/service.ts';
import type { Db } from '../db/client.ts';
import { scenarioVersions, scenarios, type Scenario, type UserProfile } from '../db/schema.ts';
import { can, DIFFICULTIES, type Difficulty, type Family, type Locale } from '../domain.ts';
import { publicContent, ScenarioInputSchema, type ScenarioContent, type ScenarioInput } from './content.ts';

export type ScenarioFilters = {
  q?: string;
  family?: Family;
  difficulty?: Difficulty;
  language?: Locale;
  scope?: 'all' | 'catalog' | 'private';
};

export class ForbiddenError extends Error {
  constructor() {
    super('forbidden');
  }
}

// L'offre de l'organisation ne permet pas un scénario privé de plus.
export class PlanLimitError extends Error {
  readonly limit: number;
  constructor(limit: number) {
    super('plan_limit');
    this.limit = limit;
  }
}

// Un scénario est visible s'il est public ou s'il appartient à l'organisation active. Toute lecture passe ici.
function visibleTo(auth: AuthContext): SQL {
  return or(isNull(scenarios.organizationId), eq(scenarios.organizationId, auth.organization.id))!;
}

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export async function listScenarios(db: Db, auth: AuthContext, filters: ScenarioFilters = {}): Promise<Scenario[]> {
  const conditions: SQL[] = [visibleTo(auth), eq(scenarios.status, 'active')];
  if (filters.scope === 'catalog') conditions.push(isNull(scenarios.organizationId));
  if (filters.scope === 'private') conditions.push(eq(scenarios.organizationId, auth.organization.id));
  if (filters.family) conditions.push(eq(scenarios.family, filters.family));
  if (filters.difficulty) conditions.push(eq(scenarios.difficulty, filters.difficulty));
  if (filters.language) conditions.push(eq(scenarios.language, filters.language));
  const q = filters.q?.trim().slice(0, 80);
  if (q) {
    const pattern = `%${escapeLike(q)}%`;
    conditions.push(or(ilike(scenarios.title, pattern), ilike(scenarios.summary, pattern), ilike(scenarios.industry, pattern))!);
  }
  return db
    .select()
    .from(scenarios)
    .where(and(...conditions))
    .orderBy(sql`${scenarios.organizationId} is null`, desc(scenarios.updatedAt))
    .limit(200);
}

export type ScenarioDetail = {
  scenario: Scenario;
  version: number;
  isPrivate: boolean;
  canEdit: boolean;
  // Contenu complet pour les auteurs d'un scénario privé, sinon la version apprenant sans infos cachées.
  content: ScenarioContent | ReturnType<typeof publicContent>;
  showsHidden: boolean;
};

export async function getScenario(db: Db, auth: AuthContext, id: string): Promise<ScenarioDetail | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db
    .select({ scenario: scenarios, content: scenarioVersions.content })
    .from(scenarios)
    .innerJoin(
      scenarioVersions,
      and(eq(scenarioVersions.scenarioId, scenarios.id), eq(scenarioVersions.version, scenarios.currentVersion)),
    )
    .where(and(eq(scenarios.id, id), visibleTo(auth)))
    .limit(1);
  if (!row) return null;
  const isPrivate = row.scenario.organizationId === auth.organization.id;
  const showsHidden = isPrivate && can(auth.role, 'scenario:view_hidden');
  return {
    scenario: row.scenario,
    version: row.scenario.currentVersion,
    isPrivate,
    canEdit: isPrivate && can(auth.role, 'scenario:edit') && row.scenario.status === 'active',
    content: showsHidden ? row.content : publicContent(row.content),
    showsHidden,
  };
}

// Scénarios recommandés par une analyse, dans l'ordre donné, en ne gardant que ceux encore visibles et actifs.
export async function listScenariosByIds(db: Db, auth: AuthContext, ids: string[]): Promise<Scenario[]> {
  const valid = ids.filter((id) => /^[0-9a-f-]{36}$/i.test(id));
  if (!valid.length) return [];
  const rows = await db
    .select()
    .from(scenarios)
    .where(and(inArray(scenarios.id, valid), eq(scenarios.status, 'active'), visibleTo(auth)));
  return valid.flatMap((id) => rows.filter((r) => r.id === id));
}

// Version jouable d'un scénario actif, avec son contenu complet : réservé au serveur, qui en fait la
// consigne du prospect vocal. Ce contenu n'est jamais renvoyé au navigateur.
export type PlayableVersion = { scenario: Scenario; versionId: string; versionNumber: number; content: ScenarioContent };

export async function getPlayableVersion(db: Db, auth: AuthContext, scenarioId: string): Promise<PlayableVersion | null> {
  if (!/^[0-9a-f-]{36}$/i.test(scenarioId)) return null;
  const [row] = await db
    .select({ scenario: scenarios, versionId: scenarioVersions.id, content: scenarioVersions.content })
    .from(scenarios)
    .innerJoin(
      scenarioVersions,
      and(eq(scenarioVersions.scenarioId, scenarios.id), eq(scenarioVersions.version, scenarios.currentVersion)),
    )
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.status, 'active'), visibleTo(auth)))
    .limit(1);
  if (!row) return null;
  return { scenario: row.scenario, versionId: row.versionId, versionNumber: row.scenario.currentVersion, content: row.content };
}

export async function createScenario(db: Db, auth: AuthContext, input: ScenarioInput): Promise<string> {
  if (!can(auth.role, 'scenario:create')) throw new ForbiddenError();
  const { meta, content } = ScenarioInputSchema.parse(input);
  const { limits } = await orgLimits(db, auth.organization);
  return db.transaction(async (tx) => {
    if (limits.privateScenarios !== null) {
      // Verrou sur l'organisation : deux créations simultanées ne dépassent pas la limite.
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${auth.organization.id}, 1))`);
      const [{ n }] = await tx
        .select({ n: sql<number>`count(*)`.mapWith(Number) })
        .from(scenarios)
        .where(and(eq(scenarios.organizationId, auth.organization.id), eq(scenarios.status, 'active')));
      if (n >= limits.privateScenarios) throw new PlanLimitError(limits.privateScenarios);
    }
    const [row] = await tx
      .insert(scenarios)
      .values({ ...meta, organizationId: auth.organization.id, createdBy: auth.user.id, currentVersion: 1 })
      .returning({ id: scenarios.id });
    await tx.insert(scenarioVersions).values({ scenarioId: row.id, version: 1, content, createdBy: auth.user.id });
    await audit(tx, {
      action: 'scenario.created',
      organizationId: auth.organization.id,
      actorUserId: auth.user.id,
      targetType: 'scenario',
      targetId: row.id,
    });
    return row.id;
  });
}

// Modifier un scénario crée une nouvelle version ; les simulations passées restent liées à la leur.
export async function updateScenario(db: Db, auth: AuthContext, id: string, input: ScenarioInput): Promise<number> {
  if (!can(auth.role, 'scenario:edit')) throw new ForbiddenError();
  const { meta, content } = ScenarioInputSchema.parse(input);
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({ version: scenarios.currentVersion })
      .from(scenarios)
      .where(and(eq(scenarios.id, id), eq(scenarios.organizationId, auth.organization.id), eq(scenarios.status, 'active')))
      .for('update')
      .limit(1);
    if (!current) throw new ForbiddenError();
    const version = current.version + 1;
    await tx.insert(scenarioVersions).values({ scenarioId: id, version, content, createdBy: auth.user.id });
    await tx.update(scenarios).set({ ...meta, currentVersion: version, updatedAt: new Date() }).where(eq(scenarios.id, id));
    await audit(tx, {
      action: 'scenario.updated',
      organizationId: auth.organization.id,
      actorUserId: auth.user.id,
      targetType: 'scenario',
      targetId: id,
      metadata: { version },
    });
    return version;
  });
}

export async function archiveScenario(db: Db, auth: AuthContext, id: string) {
  if (!can(auth.role, 'scenario:edit')) throw new ForbiddenError();
  const updated = await db
    .update(scenarios)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(and(eq(scenarios.id, id), eq(scenarios.organizationId, auth.organization.id)))
    .returning({ id: scenarios.id });
  if (!updated.length) throw new ForbiddenError();
  await audit(db, {
    action: 'scenario.archived',
    organizationId: auth.organization.id,
    actorUserId: auth.user.id,
    targetType: 'scenario',
    targetId: id,
  });
}

// Recommandation : les scénarios qui travaillent le plus les objectifs choisis, au niveau de l'utilisateur
// ou juste au-dessus, dans sa langue. Le score des simulations affinera ce choix à l'étape 3.
export async function recommendScenarios(
  db: Db,
  auth: AuthContext,
  profile: Pick<UserProfile, 'goals' | 'experience'> | null,
  locale: Locale,
  limit = 3,
) {
  const rows = await db
    .select({ scenario: scenarios, content: scenarioVersions.content })
    .from(scenarios)
    .innerJoin(
      scenarioVersions,
      and(eq(scenarioVersions.scenarioId, scenarios.id), eq(scenarioVersions.version, scenarios.currentVersion)),
    )
    .where(and(visibleTo(auth), eq(scenarios.status, 'active'), eq(scenarios.language, locale)));
  const level = DIFFICULTIES.indexOf((profile?.experience ?? 'beginner') as Difficulty);
  return rows
    .map(({ scenario, content }) => {
      const weights = content.skillWeights as Record<string, number | undefined>;
      const goalScore = (profile?.goals ?? []).reduce((sum, goal) => sum + (weights[goal] ?? 0), 0);
      const gap = DIFFICULTIES.indexOf(scenario.difficulty as Difficulty) - level;
      const levelScore = gap === 0 ? 4 : gap === 1 ? 2 : gap < 0 ? 1 : -3;
      return { scenario, score: goalScore + levelScore, matchedGoals: (profile?.goals ?? []).filter((g) => (weights[g] ?? 0) >= 3) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
