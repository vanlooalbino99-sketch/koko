// Lancé avant « next start » : migrations de la base de production et catalogue public à jour.
import { migratePostgres } from '../lib/db/client.ts';

const url = process.env.DATABASE_URL;
if (!url) {
  console.log('[migrate] DATABASE_URL absent : la base locale PGlite est migrée au premier accès.');
} else {
  const result = await migratePostgres(url);
  console.log(`[migrate] migrations appliquées ; catalogue : ${result.created} créés, ${result.updated} mis à jour.`);
}
