import { z } from 'zod';
import { SKILLS } from '../domain.ts';

// Ce que Claude renvoie pour un appel (sortie structurée, validée à la réception).
// Les numéros de réplique (turn) renvoient à la transcription numérotée envoyée dans la demande.
export const ClaudeAnalysisSchema = z.object({
  summary: z.string().describe('Two or three sentences: how the call went and the main lesson.'),
  outcome: z
    .enum(['next_step_won', 'postponed', 'lost', 'unclear'])
    .describe('next_step_won: the prospect agreed to a concrete next step; postponed: vague follow-up; lost: refusal or hang-up.'),
  skills: z
    .array(
      z.object({
        skill: z.enum(SKILLS),
        score: z.number().int().min(0).max(100).describe('Integer from 0 to 100.'),
        justification: z.string().describe('Why this score, tied to what the seller actually said or failed to do.'),
        evidence: z
          .array(z.object({ turn: z.number().int().min(0), quote: z.string().describe('Exact words copied from that turn.') }))
          .max(3),
      }),
    )
    .describe('Exactly one entry per skill listed in <skills_to_score>.'),
  successCriteria: z.array(z.object({ criterion: z.string(), met: z.boolean(), evidence: z.string() })),
  hiddenFacts: z.array(
    z.object({ fact: z.string(), uncovered: z.boolean(), howToUncover: z.string().describe('A question that would have revealed it.') }),
  ),
  objections: z.array(
    z.object({
      objection: z.string(),
      handling: z.enum(['well', 'partly', 'poorly', 'not_raised']),
      comment: z.string(),
    }),
  ),
  strengths: z.array(z.string()).max(3),
  improvements: z
    .array(
      z.object({
        turn: z.number().int().min(0),
        said: z.string().describe('Exact words the seller said at that turn.'),
        better: z.string().describe('What the seller could have said instead, ready to reuse.'),
        why: z.string(),
      }),
    )
    .max(4),
  focusSkills: z.array(z.enum(SKILLS)).max(3).describe('The skills the seller should practice next, weakest first.'),
});
export type ClaudeAnalysis = z.infer<typeof ClaudeAnalysisSchema>;

// Résultat enregistré : la réponse de Claude, nettoyée, plus ce que le serveur calcule lui-même.
export type AnalysisResult = ClaudeAnalysis & {
  // Moyenne des scores pondérée par les poids du scénario : calculée par le serveur, pas par le modèle.
  overallScore: number;
  weights: Record<string, number>;
  recommendedScenarioIds: string[];
  locale: 'fr' | 'en';
};
