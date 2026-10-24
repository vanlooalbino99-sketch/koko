import { CHANNELS, DECISION_POWERS, DIFFICULTIES, FAMILIES, LOCALES, PERSONALITIES, SKILLS, type Locale } from '@/lib/domain';
import type { Dictionary } from '@/lib/i18n';
import type { Scenario } from '@/lib/db/schema';
import type { ScenarioContent } from '@/lib/scenarios/content';

// Libellés et listes du formulaire de scénario, préparés côté serveur dans la langue de l'utilisateur.
export function scenarioFormProps(t: Dictionary) {
  const e = t.enums;
  return {
    labels: { ...t.form },
    options: {
      family: FAMILIES.map((v) => ({ value: v, label: e.family[v] })),
      difficulty: DIFFICULTIES.map((v) => ({ value: v, label: e.difficulty[v] })),
      language: LOCALES.map((v) => ({ value: v, label: e.language[v] })),
      channel: CHANNELS.map((v) => ({ value: v, label: e.channel[v] })),
      personality: PERSONALITIES.map((v) => ({ value: v, label: e.personality[v] })),
      decisionPower: DECISION_POWERS.map((v) => ({ value: v, label: e.decisionPower[v] })),
    },
    skills: SKILLS.map((v) => ({ value: v, label: e.skill[v] })),
  };
}

// Pondération proposée pour un nouveau scénario : les bases d'un appel, que l'auteur ajuste ensuite.
const DEFAULT_WEIGHTS: Partial<Record<(typeof SKILLS)[number], number>> = {
  opening: 2,
  questioning: 3,
  needs_discovery: 3,
  active_listening: 2,
  objection_handling: 2,
  closing: 2,
};

export function emptyValues(locale: Locale): Record<string, string> {
  return {
    family: 'discovery',
    difficulty: 'intermediate',
    language: locale,
    channel: 'phone',
    estimatedMinutes: '10',
    'prospect.personality': 'skeptical',
    'prospect.decisionPower': 'decider',
    ...Object.fromEntries(SKILLS.map((s) => [`weight.${s}`, String(DEFAULT_WEIGHTS[s] ?? 0)])),
  };
}

// Valeurs initiales du formulaire d'édition à partir de la version courante (contenu complet).
export function valuesFrom(scenario: Scenario, content: ScenarioContent): Record<string, string> {
  const weights = content.skillWeights as Record<string, number | undefined>;
  return {
    title: scenario.title,
    summary: scenario.summary,
    industry: scenario.industry,
    family: scenario.family,
    difficulty: scenario.difficulty,
    language: scenario.language,
    channel: scenario.channel,
    estimatedMinutes: String(scenario.estimatedMinutes),
    objective: content.objective,
    context: content.context,
    'offer.name': content.offer.name,
    'offer.description': content.offer.description,
    'offer.price': content.offer.price,
    'prospect.name': content.prospect.name,
    'prospect.role': content.prospect.role,
    'prospect.company': content.prospect.company,
    'prospect.companySize': content.prospect.companySize,
    'prospect.personality': content.prospect.personality,
    'prospect.decisionPower': content.prospect.decisionPower,
    'prospect.publicProfile': content.prospect.publicProfile,
    need: content.need,
    budget: content.budget,
    objections: content.objections.join('\n'),
    constraints: content.constraints.join('\n'),
    hiddenFacts: content.hiddenFacts.join('\n'),
    successCriteria: content.successCriteria.join('\n'),
    endConditions: content.endConditions.join('\n'),
    ...Object.fromEntries(SKILLS.map((s) => [`weight.${s}`, String(weights[s] ?? 0)])),
  };
}
