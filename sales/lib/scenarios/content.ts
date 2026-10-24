import { z } from 'zod';
import {
  CHANNELS,
  DECISION_POWERS,
  DIFFICULTIES,
  FAMILIES,
  LOCALES,
  PERSONALITIES,
  SKILLS,
} from '../domain.ts';

const line = (max: number) => z.string().trim().min(1).max(max);
const list = (max: number, min = 0) => z.array(line(300)).min(min).max(max);

// Contenu figé d'une version de scénario : c'est ce que le prospect IA recevra à l'étape 2.
export const ScenarioContentSchema = z.object({
  objective: line(600),
  context: z.string().trim().max(1500),
  offer: z.object({
    name: line(120),
    description: z.string().trim().max(800),
    price: z.string().trim().max(120),
  }),
  prospect: z.object({
    name: line(80),
    role: line(120),
    company: line(120),
    companySize: z.string().trim().max(80),
    personality: z.enum(PERSONALITIES),
    decisionPower: z.enum(DECISION_POWERS),
    // Ce que le vendeur sait avant l'appel (visible par l'apprenant).
    publicProfile: z.string().trim().max(800),
  }),
  need: line(800),
  budget: line(300),
  objections: list(10, 1),
  constraints: list(10),
  // Révélé seulement si le vendeur pose les bonnes questions : jamais affiché à l'apprenant.
  hiddenFacts: list(10),
  successCriteria: list(10, 1),
  endConditions: list(10),
  // Pondération de chaque compétence dans le score global (0 = non évaluée).
  skillWeights: z
    .partialRecord(z.enum(SKILLS), z.number().int().min(0).max(5))
    .refine((weights) => Object.values(weights).some((w) => (w ?? 0) > 0), 'skill_weights_empty'),
});
export type ScenarioContent = z.infer<typeof ScenarioContentSchema>;

export const ScenarioMetaSchema = z.object({
  title: line(120),
  summary: line(400),
  industry: line(80),
  family: z.enum(FAMILIES),
  difficulty: z.enum(DIFFICULTIES),
  language: z.enum(LOCALES),
  channel: z.enum(CHANNELS),
  estimatedMinutes: z.number().int().min(2).max(30),
});
export type ScenarioMeta = z.infer<typeof ScenarioMetaSchema>;

export const ScenarioInputSchema = z.object({ meta: ScenarioMetaSchema, content: ScenarioContentSchema });
export type ScenarioInput = z.infer<typeof ScenarioInputSchema>;

// Le formulaire envoie les listes sous forme de texte, une entrée par ligne.
export function splitLines(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string') return [];
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

// Version vue par l'apprenant : les informations cachées et les conditions de fin restent côté serveur.
export function publicContent(content: ScenarioContent): Omit<ScenarioContent, 'hiddenFacts' | 'endConditions'> {
  const rest: Partial<ScenarioContent> = { ...content };
  delete rest.hiddenFacts;
  delete rest.endConditions;
  return rest as Omit<ScenarioContent, 'hiddenFacts' | 'endConditions'>;
}
