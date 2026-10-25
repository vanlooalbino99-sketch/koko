import { join } from 'node:path';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import * as schema from './schema.ts';
import { syncCatalog } from '../scenarios/catalog-sync.ts';

// Même type pour Postgres (production) et PGlite (développement local et tests).
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export const MIGRATIONS_FOLDER = join(process.cwd(), 'drizzle');

// Production : DATABASE_URL (Supabase, pooler en mode session). Supabase signe ses certificats avec sa
// propre autorité : DATABASE_CA (le certificat téléchargé depuis Supabase) permet de la vérifier.
export async function connectPostgres(url: string, max = Number(process.env.DATABASE_POOL_MAX ?? 5)): Promise<{ db: Db; close: () => Promise<void> }> {
  const { Pool } = await import('pg');
  const { drizzle } = await import('drizzle-orm/node-postgres');
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  const ca = process.env.DATABASE_CA?.replace(/\\n/g, '\n');
  const pool = new Pool({
    connectionString: url,
    max,
    ssl: local ? false : ca ? { ca } : { rejectUnauthorized: false },
  });
  return { db: drizzle(pool, { schema }), close: () => pool.end() };
}

// Production : applique les migrations SQL versionnées puis synchronise le catalogue public.
export async function migratePostgres(url: string) {
  const { db, close } = await connectPostgres(url);
  const { migrate } = await import('drizzle-orm/node-postgres/migrator');
  try {
    await migrate(db as Parameters<typeof migrate>[0], { migrationsFolder: MIGRATIONS_FOLDER });
    return await syncCatalog(db);
  } finally {
    await close();
  }
}

// Développement et tests : Postgres en WebAssembly, en mémoire ou dans un dossier local.
export async function connectPglite(dataDir?: string): Promise<{ db: Db; close: () => Promise<void> }> {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const client = new PGlite(dataDir);
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  await syncCatalog(db);
  return { db, close: () => client.close() };
}

// Next.js charge ce module une fois par route : la connexion est rangée sur globalThis pour qu'il n'y
// en ait qu'une par processus. Sinon chaque route ouvrirait sa propre base PGlite sur le même dossier
// et ne verrait pas les écritures des autres.
const holder = globalThis as typeof globalThis & { __blackstartDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  holder.__blackstartDb ??= (async () => {
    const url = process.env.DATABASE_URL;
    if (url) return (await connectPostgres(url)).db;
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_LOCAL_DB) {
      throw new Error('DATABASE_URL manquant en production.');
    }
    return (await connectPglite(process.env.PGLITE_DIR ?? join(process.cwd(), '.data', 'pglite'))).db;
  })();
  return holder.__blackstartDb;
}
