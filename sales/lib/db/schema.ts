import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  customType,
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
    // Forfait en vigueur, tenu à jour par les webhooks Stripe (lib/billing). free tant qu'aucun abonnement n'est actif.
    plan: text('plan').notNull().default('free'),
    // Accès sans limite offert par l'éditeur (son propre compte, un partenaire) : recopié au démarrage depuis
    // UNLIMITED_EMAILS (lib/billing/unlimited.ts). Aucun écran ne permet de le modifier.
    unlimited: boolean('unlimited').notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check('organizations_kind_check', sql`${t.kind} in ('personal', 'team')`),
    check('organizations_plan_check', sql`${t.plan} in ('free', 'standard', 'advanced', 'premium')`),
  ],
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

// Un prospect vocal ElevenLabs par version de scénario, créé côté serveur à la première simulation.
// config_hash change quand le modèle de consigne évolue : l'agent est alors recréé.
export const voiceAgents = pgTable('voice_agents', {
  scenarioVersionId: uuid('scenario_version_id')
    .primaryKey()
    .references(() => scenarioVersions.id, { onDelete: 'restrict' }),
  agentId: text('agent_id').notNull().unique(),
  configHash: text('config_hash').notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// Une réplique de la transcription, normalisée depuis la réponse d'ElevenLabs.
export type TranscriptTurn = {
  role: 'seller' | 'prospect';
  text: string;
  // Secondes depuis le début de l'appel.
  at: number;
  // Réplique du prospect coupée par le vendeur.
  interrupted?: boolean;
};

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
    // created → connecting → in_progress → processing (transcription en cours chez ElevenLabs) → completed.
    status: text('status').notNull().default('created'),
    providerConversationId: text('provider_conversation_id'),
    // Agent ElevenLabs utilisé pour cet appel (il peut être recréé ensuite si la consigne évolue).
    providerAgentId: text('provider_agent_id'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    durationSeconds: integer('duration_seconds'),
    // Qui a mis fin à l'appel : user (vendeur), agent (prospect), error, timeout.
    endReason: text('end_reason'),
    transcript: jsonb('transcript').$type<TranscriptTurn[]>(),
    // Coût facturé par ElevenLabs pour cet appel (crédits ElevenLabs), pour le suivi des coûts.
    providerCost: integer('provider_cost'),
    errorMessage: text('error_message'),
    lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
    overallScore: integer('overall_score'),
    // Moments marqués par le vendeur pendant l'appel (secondes depuis le début), repris dans le rapport.
    markers: integer('markers').array().notNull().default(sql`'{}'::integer[]`),
    createdAt: createdAt(),
  },
  (t) => [
    index('simulations_org_user_idx').on(t.organizationId, t.userId, t.createdAt),
    uniqueIndex('simulations_provider_key').on(t.providerConversationId),
    check(
      'simulations_status_check',
      sql`${t.status} in ('created', 'connecting', 'in_progress', 'processing', 'completed', 'failed', 'cancelled')`,
    ),
    check('simulations_end_reason_check', sql`${t.endReason} is null or ${t.endReason} in ('user', 'agent', 'error', 'timeout')`),
    check('simulations_score_check', sql`${t.overallScore} is null or ${t.overallScore} between 0 and 100`),
    check('simulations_duration_check', sql`${t.durationSeconds} is null or ${t.durationSeconds} >= 0`),
  ],
);

// Analyse d'un appel par Claude : une par simulation terminée. result suit AnalysisResult (lib/analysis).
export const simulationAnalyses = pgTable(
  'simulation_analyses',
  {
    simulationId: uuid('simulation_id')
      .primaryKey()
      .references(() => simulations.id, { onDelete: 'cascade' }),
    // running → completed | failed ; insufficient : appel trop court, Claude n'est pas appelé.
    status: text('status').notNull(),
    model: text('model'),
    result: jsonb('result').$type<unknown>(),
    inputTokens: integer('input_tokens'),
    outputTokens: integer('output_tokens'),
    error: text('error'),
    attempts: integer('attempts').notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [check('simulation_analyses_status_check', sql`${t.status} in ('running', 'completed', 'failed', 'insufficient')`)],
);

// Débit de crédits : 1 crédit = 1 minute de simulation, analyse comprise. Une seule ligne par simulation
// (index unique) : un appel ne peut pas être débité deux fois, même si deux synchronisations se croisent.
export const creditDebits = pgTable(
  'credit_debits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    simulationId: uuid('simulation_id')
      .notNull()
      .references(() => simulations.id, { onDelete: 'cascade' }),
    credits: integer('credits').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('credit_debits_simulation_key').on(t.simulationId),
    index('credit_debits_org_idx').on(t.organizationId, t.createdAt),
    check('credit_debits_credits_check', sql`${t.credits} >= 0`),
  ],
);

// Abonnement Stripe d'une organisation. Recopié depuis Stripe à chaque webhook : Stripe fait foi.
export const billingAccounts = pgTable(
  'billing_accounts',
  {
    organizationId: uuid('organization_id')
      .primaryKey()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    stripeCustomerId: text('stripe_customer_id').notNull(),
    stripeSubscriptionId: text('stripe_subscription_id'),
    plan: text('plan'),
    // Statut Stripe tel quel : active, trialing, past_due, canceled, unpaid, incomplete…
    status: text('status'),
    seats: integer('seats').notNull().default(1),
    // Monnaie de l'abonnement : eur (interface en français) ou usd (en anglais).
    currency: text('currency'),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('billing_accounts_customer_key').on(t.stripeCustomerId),
    uniqueIndex('billing_accounts_subscription_key').on(t.stripeSubscriptionId),
    check('billing_accounts_plan_check', sql`${t.plan} is null or ${t.plan} in ('standard', 'advanced', 'premium')`),
    check('billing_accounts_seats_check', sql`${t.seats} >= 1`),
  ],
);

// Invitation à rejoindre une organisation. Seule l'empreinte du jeton est stockée ; le lien est donné une
// fois, à la création. Une invitation en attente occupe un siège.
export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: text('role').notNull(),
    tokenHash: text('token_hash').notNull(),
    invitedBy: uuid('invited_by').references(() => users.id, { onDelete: 'set null' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    acceptedBy: uuid('accepted_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('invitations_token_key').on(t.tokenHash),
    uniqueIndex('invitations_pending_key').on(t.organizationId, t.email).where(sql`${t.acceptedAt} is null`),
    check('invitations_email_lower', sql`${t.email} = lower(${t.email})`),
    check('invitations_role_check', sql`${t.role} in ('admin', 'manager', 'member')`),
  ],
);

// Mission : un scénario qu'un responsable demande à un membre de travailler. Elle est remplie dès que le
// membre termine un appel sur ce scénario après l'avoir reçue.
export const missions = pgTable(
  'missions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    scenarioId: uuid('scenario_id')
      .notNull()
      .references(() => scenarios.id, { onDelete: 'cascade' }),
    assigneeId: uuid('assignee_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assignedBy: uuid('assigned_by').references(() => users.id, { onDelete: 'set null' }),
    dueAt: timestamp('due_at', { withTimezone: true }),
    note: text('note'),
    createdAt: createdAt(),
  },
  (t) => [index('missions_assignee_idx').on(t.organizationId, t.assigneeId, t.createdAt)],
);

// Webhooks Stripe déjà traités : Stripe peut renvoyer le même événement plusieurs fois.
// Demandes de devis pour l'offre Entreprise, lues par l'éditeur dans son cockpit.
export const quoteRequests = pgTable(
  'quote_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    company: text('company').notNull(),
    email: text('email').notNull(),
    seats: integer('seats').notNull(),
    message: text('message').notNull().default(''),
    createdAt: createdAt(),
  },
  (t) => [index('quote_requests_created_idx').on(t.createdAt)],
);

export type QuoteRequest = typeof quoteRequests.$inferSelect;

export const stripeEvents = pgTable('stripe_events', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  createdAt: createdAt(),
});

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

// Octets bruts (bytea) : node-postgres rend un Buffer, PGlite un Uint8Array.
const bytes = customType<{ data: Uint8Array; driverData: Uint8Array }>({ dataType: () => 'bytea' });

// Démo publique de l'appel (page /demo) : voix retenues pour chaque rôle et, pour le vendeur, l'extrait de voix
// fourni par l'équipe (jamais dans le dépôt, qui est public). Rempli par le serveur ou à la main.
export const demoVoices = pgTable(
  'demo_voices',
  {
    role: text('role').primaryKey(),
    voiceId: text('voice_id'),
    name: text('name'),
    source: text('source'),
    sample: bytes('sample'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [check('demo_voices_role_check', sql`${t.role} in ('seller', 'prospect:fr', 'prospect:en')`)],
);

// Répliques de la démo déjà synthétisées : la clé résume la voix, le modèle, les réglages et le texte, si bien
// qu'un changement de voix ou de texte produit un nouvel enregistrement au lieu de servir l'ancien.
export const demoAudio = pgTable('demo_audio', {
  key: text('key').primaryKey(),
  mime: text('mime').notNull(),
  audio: bytes('audio').notNull(),
  createdAt: createdAt(),
});

export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Membership = typeof memberships.$inferSelect;
export type Scenario = typeof scenarios.$inferSelect;
export type ScenarioVersion = typeof scenarioVersions.$inferSelect;
export type Simulation = typeof simulations.$inferSelect;
export type VoiceAgent = typeof voiceAgents.$inferSelect;
export type SimulationAnalysis = typeof simulationAnalyses.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type BillingAccount = typeof billingAccounts.$inferSelect;
export type Invitation = typeof invitations.$inferSelect;
export type Mission = typeof missions.$inferSelect;
