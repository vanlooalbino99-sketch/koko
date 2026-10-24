import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import type { ScenarioContent } from '../scenarios/content.ts';

// Toutes les dates sont stockées en UTC (timestamptz).
const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = () => timestamp('updated_at', { withTimezone: true }).notNull().defaultNow();

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Toujours en minuscules (normalisé à l'écriture), d'où l'unicité simple.
    email: text('email').notNull(),
    name: text('name').notNull(),
    passwordHash: text('password_hash').notNull(),
    locale: text('locale').notNull().default('fr'),
    isPlatformAdmin: boolean('is_platform_admin').notNull().default(false),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('users_email_key').on(t.email),
    check('users_email_lower', sql`${t.email} = lower(${t.email})`),
    check('users_locale_check', sql`${t.locale} in ('fr', 'en')`),
  ],
);

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    // personal : l'espace d'un indépendant ; team : une entreprise avec plusieurs membres.
    kind: text('kind').notNull().default('personal'),
    plan: text('plan').notNull().default('free'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [check('organizations_kind_check', sql`${t.kind} in ('personal', 'team')`)],
);

export const memberships = pgTable(
  'memberships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('memberships_org_user_key').on(t.organizationId, t.userId),
    index('memberships_user_idx').on(t.userId),
    check('memberships_role_check', sql`${t.role} in ('owner', 'admin', 'manager', 'member')`),
  ],
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Seule l'empreinte SHA-256 du jeton est stockée : une fuite de la base ne donne aucune session.
    tokenHash: text('token_hash').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // Organisation active de la session (un membre peut appartenir à plusieurs).
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('sessions_token_hash_key').on(t.tokenHash),
    index('sessions_user_idx').on(t.userId),
    index('sessions_expires_idx').on(t.expiresAt),
  ],
);

export const userProfiles = pgTable(
  'user_profiles',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    persona: text('persona').notNull(),
    experience: text('experience').notNull(),
    goals: text('goals').array().notNull().default(sql`'{}'::text[]`),
    offerName: text('offer_name'),
    offerDescription: text('offer_description'),
    idealCustomer: text('ideal_customer'),
    averageDeal: text('average_deal'),
    onboardedAt: timestamp('onboarded_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check('user_profiles_persona_check', sql`${t.persona} in ('freelance', 'closer', 'team', 'agency')`),
    check('user_profiles_experience_check', sql`${t.experience} in ('beginner', 'intermediate', 'expert')`),
  ],
);

export const scenarios = pgTable(
  'scenarios',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Renseigné pour les scénarios du catalogue public, synchronisés à chaque déploiement.
    slug: text('slug'),
    // null = scénario public du catalogue ; sinon scénario privé de l'organisation.
    organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    family: text('family').notNull(),
    difficulty: text('difficulty').notNull(),
    language: text('language').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    industry: text('industry').notNull(),
    channel: text('channel').notNull().default('phone'),
    estimatedMinutes: integer('estimated_minutes').notNull(),
    status: text('status').notNull().default('active'),
    currentVersion: integer('current_version').notNull().default(1),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('scenarios_slug_key').on(t.slug),
    index('scenarios_org_idx').on(t.organizationId),
    index('scenarios_catalog_idx').on(t.status, t.language),
    check('scenarios_difficulty_check', sql`${t.difficulty} in ('beginner', 'intermediate', 'expert')`),
    check('scenarios_language_check', sql`${t.language} in ('fr', 'en')`),
    check('scenarios_channel_check', sql`${t.channel} in ('phone', 'video')`),
    check('scenarios_status_check', sql`${t.status} in ('active', 'archived')`),
    check('scenarios_minutes_check', sql`${t.estimatedMinutes} between 2 and 30`),
    // Un scénario du catalogue n'appartient à personne ; un scénario privé n'a pas de slug.
    check('scenarios_public_slug', sql`(${t.organizationId} is null) = (${t.slug} is not null)`),
  ],
);

export const scenarioVersions = pgTable(
  'scenario_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    scenarioId: uuid('scenario_id')
      .notNull()
      .references(() => scenarios.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    // Contenu figé, validé par ScenarioContentSchema avant l'écriture. Une version n'est jamais modifiée.
    content: jsonb('content').$type<ScenarioContent>().notNull(),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('scenario_versions_key').on(t.scenarioId, t.version)],
);

export const simulations = pgTable(
  'simulations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // restrict : on archive un scénario, on ne supprime jamais l'historique de ses simulations.
    scenarioVersionId: uuid('scenario_version_id')
      .notNull()
      .references(() => scenarioVersions.id, { onDelete: 'restrict' }),
    status: text('status').notNull().default('created'),
    providerConversationId: text('provider_conversation_id'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    durationSeconds: integer('duration_seconds'),
    overallScore: integer('overall_score'),
    createdAt: createdAt(),
  },
  (t) => [
    index('simulations_org_user_idx').on(t.organizationId, t.userId, t.createdAt),
    uniqueIndex('simulations_provider_key').on(t.providerConversationId),
    check(
      'simulations_status_check',
      sql`${t.status} in ('created', 'connecting', 'in_progress', 'completed', 'failed', 'cancelled')`,
    ),
    check('simulations_score_check', sql`${t.overallScore} is null or ${t.overallScore} between 0 and 100`),
    check('simulations_duration_check', sql`${t.durationSeconds} is null or ${t.durationSeconds} >= 0`),
  ],
);

export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // set null : le journal survit à la suppression de l'organisation ou du compte.
    organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    targetType: text('target_type'),
    targetId: text('target_id'),
    metadata: jsonb('metadata').$type<Record<string, string | number | boolean | null>>().notNull().default({}),
    createdAt: createdAt(),
  },
  (t) => [index('audit_log_org_idx').on(t.organizationId, t.createdAt)],
);

export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Membership = typeof memberships.$inferSelect;
export type Scenario = typeof scenarios.$inferSelect;
export type ScenarioVersion = typeof scenarioVersions.$inferSelect;
export type Simulation = typeof simulations.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
