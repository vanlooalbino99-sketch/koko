// Copie complète de la base SQLite (fichier du serveur) vers PostgreSQL (Supabase), en une transaction.
// Comptes, sessions (personne n'est déconnecté), données du CRM et leur historique, messagerie, fichiers,
// photos, formation, demandes du site. Refuse d'écrire dans une base qui a déjà des comptes, sauf « remplacer ».
import { DatabaseSync } from 'node:sqlite';
import { existsSync } from 'node:fs';

// Ordre d'insertion (les tables référencées d'abord).
export const TABLES = ['users', 'sessions', 'kv', 'kv_history', 'ambiance_images', 'settings', 'formation', 'site_requests',
  'chat_conversations', 'chat_members', 'chat_files', 'chat_messages', 'chat_reads', 'user_photos'];

/** Compte les lignes de chaque table (pour comparer avant et après la copie). */
export async function countRows(db) {
  const out = {};
  for (const t of TABLES) out[t] = Number((await db.get(`SELECT COUNT(*) AS n FROM ${t}`)).n);
  return out;
}

export async function copySqliteToPg(sqlitePath, pg, { replace = false, log = () => {} } = {}) {
  if (!existsSync(sqlitePath)) throw new Error(`Base SQLite introuvable : ${sqlitePath}`);
  const src = new DatabaseSync(sqlitePath, { readOnly: true });
  try {
    const cols = async (t) => (await pg.all('SELECT column_name AS c FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = ?', t)).map((x) => x.c);
    const have = Number((await pg.get('SELECT COUNT(*) AS n FROM users')).n);
    if (have && !replace) throw new Error(`La base Supabase a déjà ${have} compte(s) : rien n'a été copié.`);
    const before = {};
    await pg.tx(async () => {
      if (replace) await pg.exec(`TRUNCATE ${TABLES.join(', ')} CASCADE`);
      await pg.run("DELETE FROM chat_conversations WHERE id = 'equipe'"); // recréée telle qu'elle est dans SQLite
      for (const t of TABLES) {
        const names = new Set(src.prepare(`PRAGMA table_info(${t})`).all().map((x) => x.name));
        const common = (await cols(t)).filter((c) => names.has(c));
        const rows = src.prepare(`SELECT ${common.join(', ')} FROM ${t}`).all();
        before[t] = rows.length;
        // Responsable (users.manager_id) : posé après coup, une fois tous les comptes copiés.
        const insertCols = t === 'users' ? common.filter((c) => c !== 'manager_id') : common;
        const sql = `INSERT INTO ${t} (${insertCols.join(', ')}) VALUES (${insertCols.map(() => '?').join(', ')})`;
        for (const r of rows) await pg.run(sql, ...insertCols.map((c) => (r[c] instanceof Uint8Array ? Buffer.from(r[c]) : r[c])));
        if (t === 'users') for (const r of rows) if (r.manager_id) await pg.run('UPDATE users SET manager_id = ? WHERE id = ?', r.manager_id, r.id);
        log(`${t} : ${rows.length}`);
      }
      // Les nouveaux messages continuent la numérotation.
      await pg.exec("SELECT setval(pg_get_serial_sequence('chat_messages', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM chat_messages");
      const after = await countRows(pg);
      const diff = TABLES.filter((t) => after[t] !== before[t]);
      if (diff.length) throw new Error(`Comptes différents après copie (${diff.join(', ')}) : copie annulée.`);
    });
    return before;
  } finally {
    src.close();
  }
}
