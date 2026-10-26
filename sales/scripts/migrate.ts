// Lancé avant « next start » : migrations de la base de production et catalogue public à jour.
import { connectPostgres, migratePostgres } from '../lib/db/client.ts';
import { syncUnlimited, unlimitedEmails } from '../lib/billing/unlimited.ts';
import { demoDatabaseUrl, refreshDemoSchema } from '../lib/demo/space.ts';

const url = process.env.DATABASE_URL;
if (!url) {
  console.log('[migrate] DATABASE_URL absent : la base locale PGlite est migrée au premier accès.');
} else {
  const result = await migratePostgres(url);
  console.log(`[migrate] migrations appliquées ; catalogue : ${result.created} créés, ${result.updated} mis à jour.`);
  const { db, close } = await connectPostgres(url, 1);
  try {
    const { granted, revoked } = await syncUnlimited(db, unlimitedEmails());
    console.log(`[migrate] accès illimité : ${unlimitedEmails().length} compte(s) listé(s), ${granted} espace(s) ouvert(s), ${revoked} retiré(s).`);
  } finally {
    await close();
  }
}

// Espace démo dans le schéma demo : reconstruit si besoin. Un échec ne bloque pas le démarrage du site.
if (url && demoDatabaseUrl()) {
  const { db, close } = await connectPostgres(url, 1);
  try {
    console.log(`[migrate] espace démo ${(await refreshDemoSchema(db)) ? 'reconstruit' : 'à jour'}.`);
  } catch (error) {
    console.error('[migrate] espace démo non reconstruit', error instanceof Error ? error.message : error);
  } finally {
    await close();
  }
}
