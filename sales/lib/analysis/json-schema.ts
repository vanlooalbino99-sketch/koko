import { z } from 'zod';

// Mots-clés JSON Schema refusés par les sorties structurées de l'API Claude. Les contraintes retirées
// restent vérifiées par Zod à la réception de la réponse.
const UNSUPPORTED = ['$schema', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf', 'maxItems', 'minLength', 'maxLength'];

function strict(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(strict);
  if (!node || typeof node !== 'object') return node;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (UNSUPPORTED.includes(key)) continue;
    if (key === 'minItems' && typeof value === 'number' && value > 1) continue;
    out[key] = key === 'enum' || key === 'required' ? value : strict(value);
  }
  if (out.type === 'object') out.additionalProperties = false;
  return out;
}

// Schéma accepté par output_config.format, énumérations comprises (elles sont appliquées par l'API).
export function strictJsonSchema(schema: z.ZodType): Record<string, unknown> {
  return strict(z.toJSONSchema(schema, { target: 'draft-2020-12', io: 'output' })) as Record<string, unknown>;
}
