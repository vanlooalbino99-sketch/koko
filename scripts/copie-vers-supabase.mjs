// Copie la base SQLite du CRM vers PostgreSQL (Supabase) : node scripts/copie-vers-supabase.mjs <fichier.db> [--remplacer]
// Adresse de la base cible dans SUPABASE_DB_URL. Le fichier SQLite n'est jamais modifié.
import { openPg } from '../server/src/store.js';
import { copySqliteToPg } from '../server/src/copie.js';

const file = process.argv[2];
const url = process.env.SUPABASE_DB_URL;
if (!file || !url) {
  console.error('Usage : SUPABASE_DB_URL=postgres://… node scripts/copie-vers-supabase.mjs data/blackstart.db [--remplacer]');
  process.exit(1);
}
const db = await openPg(url);
try {
  const n = await copySqliteToPg(file, db, { replace: process.argv.includes('--remplacer'), log: (l) => console.log('  ' + l) });
  console.log(`Copie terminée et vérifiée : ${Object.values(n).reduce((a, b) => a + b, 0)} ligne(s).`);
} catch (e) {
  console.error('Échec :', e.message);
  process.exitCode = 1;
} finally {
  await db.close();
}
