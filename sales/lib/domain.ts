// Vocabulaire métier partagé par la base, la validation et l'interface. Les libellés sont dans lib/i18n.

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const ROLES = ['owner', 'admin', 'manager', 'member'] as const;
export type Role = (typeof ROLES)[number];

// Les 12 axes de la grille de notation (étape 3). L'ordre est celui de l'affichage.
export const SKILLS = [
  'opening',
  'active_listening',
  'questioning',
  'needs_discovery',
  'qualification',
  'reformulation',
  'value_proposition',
  'objection_handling',
  'silence_management',
  'negotiation',
  'closing',
  'clarity',
] as const;
export type Skill = (typeof SKILLS)[number];

export const FAMILIES = [
  'cold_call',
  'discovery',
  'qualification',
  'demo',
  'objection_handling',
  'closing',
  'follow_up',
  'negotiation',
  'renewal',
] as const;
export type Family = (typeof FAMILIES)[number];

export const DIFFICULTIES = ['beginner', 'intermediate', 'expert'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const PERSONALITIES = [
  'friendly',
  'busy',
  'skeptical',
  'undecided',
  'analytical',
  'price_sensitive',
  'loyal_to_competitor',
] as const;
export type Personality = (typeof PERSONALITIES)[number];

export const DECISION_POWERS = ['decider', 'influencer', 'committee'] as const;
export type DecisionPower = (typeof DECISION_POWERS)[number];

export const CHANNELS = ['phone', 'video'] as const;
export type Channel = (typeof CHANNELS)[number];

export const PERSONAS = ['freelance', 'closer', 'team', 'agency'] as const;
export type Persona = (typeof PERSONAS)[number];

export const EXPERIENCES = DIFFICULTIES;
export type Experience = Difficulty;

// Qui peut faire quoi dans une organisation. Le serveur est la seule source de vérité.
const PERMISSIONS = {
  'scenario:create': ['owner', 'admin', 'manager'],
  'scenario:edit': ['owner', 'admin', 'manager'],
  'scenario:view_hidden': ['owner', 'admin', 'manager'],
  'members:view': ['owner', 'admin', 'manager'],
  'members:manage': ['owner', 'admin'],
  'organization:edit': ['owner', 'admin'],
  'billing:manage': ['owner', 'admin'],
  'team:view': ['owner', 'admin', 'manager'],
  'missions:assign': ['owner', 'admin', 'manager'],
} as const satisfies Record<string, readonly Role[]>;
export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

export function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (values as readonly string[]).includes(value);
}
