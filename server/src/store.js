// Accès à la base, le même pour SQLite (fichier sur le disque du serveur) et PostgreSQL (Supabase).
//   db.get(sql, ...params) → une ligne (ou undefined)     db.all(sql, ...params) → toutes les lignes
//   db.run(sql, ...params) → { changes }                  db.tx(async () => …)   → transaction
// Les requêtes s'écrivent avec des « ? » ; elles sont traduites en $1, $2… pour PostgreSQL.
// Dans db.tx, toutes les requêtes passent par la transaction en cours (AsyncLocalStorage), et les
// transactions s'exécutent l'une après l'autre (comme BEGIN IMMEDIATE avec SQLite).
import { AsyncLocalStorage } from 'node:async_hooks';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { SQLITE_MIGRATIONS, PG_MIGRATIONS } from './schema.js';

/** Ouvre la base : PostgreSQL si databaseUrl est fourni, sinon SQLite dans dataDir. */
export async function openStore({ dataDir, databaseUrl } = {}) {
  return databaseUrl ? openPg(databaseUrl) : openSqlite(dataDir);
}

// ---------------------------------------------------------------- SQLite
export function openSqlite(dataDir) {
  mkdirSync(dataDir, { recursive: true });
  const raw = new DatabaseSync(join(dataDir, 'blackstart.db'));
  raw.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  const { user_version: current } = raw.prepare('PRAGMA user_version').get();
  for (let v = current; v < SQLITE_MIGRATIONS.length; v++) {
    raw.exec('BEGIN');
    try {
      raw.exec(SQLITE_MIGRATIONS[v]);
      raw.exec(`PRAGMA user_version = ${v + 1}`);
      raw.exec('COMMIT');
    } catch (e) {
      raw.exec('ROLLBACK');
      throw e;
    }
  }

  // Une seule connexion : pendant une transaction, les requêtes venues d'ailleurs attendent qu'elle finisse.
  const als = new AsyncLocalStorage();
  let queue = Promise.resolve(), active = 0;
  const wait = async () => { while (active && !als.getStore()) await queue; };
  const prep = (sql) => raw.prepare(sql);
  return {
    kind: 'sqlite',
    raw,
    async get(sql, ...p) { await wait(); return prep(sql).get(...p) ?? undefined; },
    async all(sql, ...p) { await wait(); return prep(sql).all(...p); },
    async run(sql, ...p) { await wait(); const i = prep(sql).run(...p); return { changes: Number(i.changes) }; },
    async exec(sql) { await wait(); raw.exec(sql); },
    tx(fn) {
      if (als.getStore()) return fn();
      active++;
      const run = queue.then(() => als.run(true, async () => {
        raw.exec('BEGIN IMMEDIATE');
        try {
          const r = await fn();
          raw.exec('COMMIT');
          return r;
        } catch (e) {
          raw.exec('ROLLBACK');
          throw e;
        }
      })).finally(() => { active--; });
      queue = run.catch(() => {});
      return run;
    },
    async close() { raw.close(); },
  };
}

// ---------------------------------------------------------------- PostgreSQL (Supabase)
/** « ? » → $1, $2… (en ignorant ceux écrits entre apostrophes). */
export function toPg(sql) {
  let n = 0, out = '', q = false;
  for (const ch of sql) {
    if (ch === "'") q = !q;
    out += ch === '?' && !q ? '$' + ++n : ch;
  }
  return out;
}

export async function openPg(databaseUrl, { pool: given } = {}) {
  const pg = (await import('pg')).default;
  pg.types.setTypeParser(20, (v) => (v === null ? null : Number(v))); // COUNT(*), identifiants : nombres JS
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(databaseUrl);
  const pool = given || new pg.Pool({
    connectionString: databaseUrl,
    max: 8,
    ssl: local ? false : { rejectUnauthorized: false },
  });
  pool.on('error', (e) => console.error('PostgreSQL :', e.message));
  const als = new AsyncLocalStorage();
  const q = (sql, p) => (als.getStore() || pool).query(toPg(sql), p);

  // Schéma : version courante dans schema_version ; un verrou évite deux migrations en même temps.
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    await c.query('SELECT pg_advisory_xact_lock(4242)');
    await c.query('CREATE TABLE IF NOT EXISTS schema_version (version INTEGER NOT NULL)');
    await c.query('ALTER TABLE schema_version ENABLE ROW LEVEL SECURITY');
    const cur = (await c.query('SELECT version FROM schema_version')).rows[0];
    if (!cur) await c.query('INSERT INTO schema_version (version) VALUES (0)');
    for (let v = cur ? cur.version : 0; v < PG_MIGRATIONS.length; v++) {
      await c.query(PG_MIGRATIONS[v]);
      await c.query('UPDATE schema_version SET version = $1', [v + 1]);
    }
    await c.query('COMMIT');
  } catch (e) {
    await c.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    c.release();
  }

  return {
    kind: 'pg',
    pool,
    async get(sql, ...p) { return (await q(sql, p)).rows[0]; },
    async all(sql, ...p) { return (await q(sql, p)).rows; },
    async run(sql, ...p) { return { changes: (await q(sql, p)).rowCount || 0 }; },
    async exec(sql) { await q(sql, []); },
    async tx(fn) {
      if (als.getStore()) return fn();
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        // Une transaction à la fois, comme avec SQLite (les versions des données se suivent sans trou).
        await client.query('SELECT pg_advisory_xact_lock(4243)');
        const r = await als.run(client, fn);
        await client.query('COMMIT');
        return r;
      } catch (e) {
        await client.query('ROLLBACK').catch(() => {});
        throw e;
      } finally {
        client.release();
      }
    },
    async close() { if (!given) await pool.end(); },
  };
}

// ---------------------------------------------------------------- réglages (table settings)
export async function getSetting(db, key, fallback) {
  const row = await db.get('SELECT value FROM settings WHERE key = ?', key);
  if (!row) return fallback;
  try { return JSON.parse(row.value); } catch { return fallback; }
}

export async function setSetting(db, key, value) {
  await db.run('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', key, JSON.stringify(value));
}
