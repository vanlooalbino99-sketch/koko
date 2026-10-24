import Anthropic from '@anthropic-ai/sdk';
import { strictJsonSchema } from './json-schema.ts';
import { ClaudeAnalysisSchema, type ClaudeAnalysis } from './schema.ts';
import { SYSTEM_PROMPT } from './prompt.ts';

export type AnalyzerOutput = { analysis: ClaudeAnalysis; model: string; inputTokens: number; outputTokens: number };

// Ce dont le service a besoin pour analyser un appel. Les tests utilisent un faux analyseur.
export interface Analyzer {
  analyze(prompt: string): Promise<AnalyzerOutput>;
}

export class AnalyzerError extends Error {}

const OUTPUT_SCHEMA = strictJsonSchema(ClaudeAnalysisSchema);

// Claude, appelé uniquement depuis le serveur. La clé vient de l'environnement et n'est jamais renvoyée.
export function claudeAnalyzer(apiKey: string, model = 'claude-opus-5-5'): Analyzer {
  const client = new Anthropic({ apiKey, maxRetries: 2, timeout: 5 * 60 * 1000 });
  return {
    async analyze(prompt) {
      const response = await client.messages.create({
        model,
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
        output_config: { effort: 'medium', format: { type: 'json_schema', schema: OUTPUT_SCHEMA } },
      });
      if (response.stop_reason === 'refusal') throw new AnalyzerError('refusal');
      if (response.stop_reason === 'max_tokens') throw new AnalyzerError('max_tokens');
      const text = response.content.flatMap((block) => (block.type === 'text' ? [block.text] : [])).join('');
      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        throw new AnalyzerError('invalid_json');
      }
      // Les contraintes que l'API n'applique pas (bornes des scores, tailles de listes) sont vérifiées ici.
      const parsed = ClaudeAnalysisSchema.safeParse(json);
      if (!parsed.success) throw new AnalyzerError(`invalid_output:${parsed.error.issues[0]?.path.join('.')}`);
      return {
        analysis: parsed.data,
        model: response.model,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      };
    },
  };
}

export function analyzerFromEnv(): Analyzer | null {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return null;
  return claudeAnalyzer(key, process.env.ANALYSIS_MODEL?.trim() || undefined);
}
