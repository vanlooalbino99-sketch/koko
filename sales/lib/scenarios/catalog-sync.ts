import { and, eq } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import * as schema from '../db/schema.ts';
import { CATALOG } from './catalog.ts';
import { ScenarioInputSchema } from './content.ts';

const { scenarios, scenarioVersions } = schema;

// jsonb réordonne les clés : on compare une forme triée, sinon chaque démarrage créerait une version.
function canonical(value: unknown): string {
  return JSON.stringify(value, (_key, v: unknown) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)))
      : v,
  );
}
type AnyDb = PgDatabase<PgQueryResultHKT, typeof schema>;

// Aligne le catalogue public de la base sur lib/scenarios/catalog.ts. Idempotent : une entrée inchangée
// ne crée rien ; une entrée modifiée crée une nouvelle version (les simulations passées gardent la leur).
export async function syncCatalog(db: AnyDb): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;
  for (const entry of CATALOG) {
    const { meta, content } = ScenarioInputSchema.parse({ meta: entry.meta, content: entry.content });
    await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(scenarios).where(eq(scenarios.slug, entry.slug)).limit(1);
      if (!existing) {
        const [row] = await tx
          .insert(scenarios)
          .values({ ...meta, slug: entry.slug, organizationId: null, currentVersion: 1 })
          .returning({ id: scenarios.id });
        await tx.insert(scenarioVersions).values({ scenarioId: row.id, version: 1, content });
        created++;
        return;
      }
      const [current] = await tx
        .select({ content: scenarioVersions.content })
        .from(scenarioVersions)
        .where(and(eq(scenarioVersions.scenarioId, existing.id), eq(scenarioVersions.version, existing.currentVersion)))
        .limit(1);
      const metaChanged = (Object.keys(meta) as (keyof typeof meta)[]).some((k) => existing[k] !== meta[k]);
      const contentChanged = canonical(current?.content) !== canonical(content);
      if (!metaChanged && !contentChanged) return;
      const version = contentChanged ? existing.currentVersion + 1 : existing.currentVersion;
      if (contentChanged) await tx.insert(scenarioVersions).values({ scenarioId: existing.id, version, content });
      await tx
        .update(scenarios)
        .set({ ...meta, currentVersion: version, status: 'active', updatedAt: new Date() })
        .where(eq(scenarios.id, existing.id));
      updated++;
    });
  }
  return { created, updated };
}
