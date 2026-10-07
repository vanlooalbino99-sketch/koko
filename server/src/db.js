// Base SQLite (module node:sqlite intégré à Node 22) : comptes, sessions, données du CRM et ambiances.
// Un seul fichier, sauvegardable tel quel ; mode WAL pour lire pendant qu'une écriture a lieu.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const MIGRATIONS = [
  `CREATE TABLE users (
     id TEXT PRIMARY KEY,
     email TEXT NOT NULL UNIQUE COLLATE NOCASE,
     name TEXT NOT NULL,
     role TEXT NOT NULL CHECK (role IN ('admin', 'membre')),
     pass TEXT NOT NULL,
     created_at TEXT NOT NULL,
     last_login TEXT
   );
   CREATE TABLE sessions (
     token_hash TEXT PRIMARY KEY,
     user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     created_at TEXT NOT NULL,
     expires_at TEXT NOT NULL
   );
   CREATE INDEX sessions_user ON sessions(user_id);
   -- Données du CRM (une clé = un document JSON, versionné) et leur historique.
   CREATE TABLE kv (
     key TEXT PRIMARY KEY,
     value TEXT NOT NULL,
     version INTEGER NOT NULL,
     updated_at TEXT NOT NULL,
     updated_by TEXT
   );
   CREATE TABLE kv_history (
     key TEXT NOT NULL,
     version INTEGER NOT NULL,
     value TEXT NOT NULL,
     updated_at TEXT NOT NULL,
     updated_by TEXT,
     PRIMARY KEY (key, version)
   );
   CREATE TABLE ambiance_images (
     id TEXT PRIMARY KEY,
     nom TEXT NOT NULL,
     largeur INTEGER,
     hauteur INTEGER,
     couleur TEXT,
     created TEXT NOT NULL,
     created_by TEXT
   );
   CREATE TABLE settings (
     key TEXT PRIMARY KEY,
     value TEXT NOT NULL
   );`,
  // v2 : progression des formations, par membre.
  `CREATE TABLE formation (
     user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     module TEXT NOT NULL,
     vu_at TEXT,
     quiz INTEGER,
     PRIMARY KEY (user_id, module)
   );`,
  // v3 : demandes reçues du site internet (contact, rendez-vous) ; l'identifiant évite les doublons.
  `CREATE TABLE site_requests (
     id TEXT PRIMARY KEY,
     kind TEXT NOT NULL CHECK (kind IN ('contact', 'rdv')),
     prospect_id TEXT NOT NULL,
     rdv_date TEXT,
     rdv_time TEXT,
     created_at TEXT NOT NULL
   );
   CREATE INDEX site_requests_rdv ON site_requests(rdv_date) WHERE kind = 'rdv';`,
  // v4 : messagerie interne (conversation « Équipe » pour tous, groupes, messages directs) et lecture par membre.
  `CREATE TABLE chat_conversations (
     id TEXT PRIMARY KEY,
     kind TEXT NOT NULL CHECK (kind IN ('equipe', 'groupe', 'direct')),
     name TEXT,
     direct_key TEXT UNIQUE,
     created_by TEXT,
     created_at TEXT NOT NULL
   );
   CREATE TABLE chat_members (
     conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
     user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     PRIMARY KEY (conversation_id, user_id)
   );
   CREATE INDEX chat_members_user ON chat_members(user_id);
   CREATE TABLE chat_messages (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
     user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
     author TEXT NOT NULL,
     kind TEXT NOT NULL DEFAULT 'texte' CHECK (kind IN ('texte', 'visio', 'info')),
     body TEXT NOT NULL,
     created_at TEXT NOT NULL
   );
   CREATE INDEX chat_messages_conv ON chat_messages(conversation_id, id);
   CREATE TABLE chat_reads (
     conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
     user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     last_read INTEGER NOT NULL DEFAULT 0,
     PRIMARY KEY (conversation_id, user_id)
   );
   INSERT INTO chat_conversations (id, kind, name, created_at) VALUES ('equipe', 'equipe', 'Équipe', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));`,
];

export function openDb(dataDir) {
  mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(join(dataDir, 'blackstart.db'));
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  const { user_version: current } = db.prepare('PRAGMA user_version').get();
  for (let v = current; v < MIGRATIONS.length; v++) {
    db.exec('BEGIN');
    try {
      db.exec(MIGRATIONS[v]);
      db.exec(`PRAGMA user_version = ${v + 1}`);
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
  }
  return db;
}

// Exécute fn dans une transaction (annulée si fn lève une erreur).
export function tx(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const r = fn();
    db.exec('COMMIT');
    return r;
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

export function getSetting(db, key, fallback) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  if (!row) return fallback;
  try { return JSON.parse(row.value); } catch { return fallback; }
}

export function setSetting(db, key, value) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .run(key, JSON.stringify(value));
}
