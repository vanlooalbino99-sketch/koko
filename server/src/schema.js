// Schéma de la base, pour SQLite (fichier local) et pour PostgreSQL (Supabase).
// Chaque migration s'applique une seule fois, dans l'ordre ; on n'en modifie jamais une déjà publiée.

export const SQLITE_MIGRATIONS = [
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
  // v5 : photo de profil de chaque membre.
  `CREATE TABLE user_photos (
     user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
     mime TEXT NOT NULL,
     data BLOB NOT NULL,
     updated_at TEXT NOT NULL
   );`,
  // v6 : pièces jointes de la messagerie (le fichier est gardé en base, lié à son message).
  `CREATE TABLE chat_files (
     id TEXT PRIMARY KEY,
     conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
     user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
     name TEXT NOT NULL,
     mime TEXT NOT NULL,
     size INTEGER NOT NULL,
     data BLOB NOT NULL,
     created_at TEXT NOT NULL
   );
   ALTER TABLE chat_messages ADD COLUMN file_id TEXT REFERENCES chat_files(id) ON DELETE SET NULL;`,
  // v7 : organigramme (poste de chaque membre et son responsable).
  `ALTER TABLE users ADD COLUMN poste TEXT;
   ALTER TABLE users ADD COLUMN manager_id TEXT REFERENCES users(id) ON DELETE SET NULL;`,
  // v8 : lien avec le compte Supabase Auth (quand la connexion passe par Supabase).
  `ALTER TABLE users ADD COLUMN auth_id TEXT;
   CREATE UNIQUE INDEX users_auth_id ON users(auth_id);`,
];

// PostgreSQL : le même schéma que SQLite après toutes ses migrations, en une fois.
// La sécurité au niveau des lignes (RLS) est activée partout sans aucune règle : seules les connexions
// du serveur (rôle propriétaire) lisent et écrivent ; les clés publiques de Supabase ne voient rien.
const TABLES = ['users', 'sessions', 'kv', 'kv_history', 'ambiance_images', 'settings', 'formation', 'site_requests',
  'chat_conversations', 'chat_members', 'chat_messages', 'chat_reads', 'user_photos', 'chat_files'];

export const PG_MIGRATIONS = [
  `CREATE TABLE users (
     id TEXT PRIMARY KEY,
     email TEXT NOT NULL UNIQUE,
     name TEXT NOT NULL,
     role TEXT NOT NULL CHECK (role IN ('admin', 'membre')),
     pass TEXT NOT NULL,
     created_at TEXT NOT NULL,
     last_login TEXT,
     poste TEXT,
     manager_id TEXT REFERENCES users(id) ON DELETE SET NULL,
     auth_id TEXT UNIQUE
   );
   CREATE INDEX users_manager ON users(manager_id);
   CREATE TABLE sessions (
     token_hash TEXT PRIMARY KEY,
     user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     created_at TEXT NOT NULL,
     expires_at TEXT NOT NULL
   );
   CREATE INDEX sessions_user ON sessions(user_id);
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
   );
   CREATE TABLE formation (
     user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     module TEXT NOT NULL,
     vu_at TEXT,
     quiz INTEGER,
     PRIMARY KEY (user_id, module)
   );
   CREATE TABLE site_requests (
     id TEXT PRIMARY KEY,
     kind TEXT NOT NULL CHECK (kind IN ('contact', 'rdv')),
     prospect_id TEXT NOT NULL,
     rdv_date TEXT,
     rdv_time TEXT,
     created_at TEXT NOT NULL
   );
   CREATE INDEX site_requests_rdv ON site_requests(rdv_date) WHERE kind = 'rdv';
   CREATE TABLE chat_conversations (
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
   CREATE TABLE chat_files (
     id TEXT PRIMARY KEY,
     conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
     user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
     name TEXT NOT NULL,
     mime TEXT NOT NULL,
     size INTEGER NOT NULL,
     data BYTEA NOT NULL,
     created_at TEXT NOT NULL
   );
   CREATE INDEX chat_files_conv ON chat_files(conversation_id);
   CREATE TABLE chat_messages (
     id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
     conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
     user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
     author TEXT NOT NULL,
     kind TEXT NOT NULL DEFAULT 'texte' CHECK (kind IN ('texte', 'visio', 'info')),
     body TEXT NOT NULL,
     created_at TEXT NOT NULL,
     file_id TEXT REFERENCES chat_files(id) ON DELETE SET NULL
   );
   CREATE INDEX chat_messages_conv ON chat_messages(conversation_id, id);
   CREATE INDEX chat_messages_user ON chat_messages(user_id);
   CREATE INDEX chat_messages_file ON chat_messages(file_id);
   CREATE TABLE chat_reads (
     conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
     user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     last_read BIGINT NOT NULL DEFAULT 0,
     PRIMARY KEY (conversation_id, user_id)
   );
   CREATE TABLE user_photos (
     user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
     mime TEXT NOT NULL,
     data BYTEA NOT NULL,
     updated_at TEXT NOT NULL
   );
   INSERT INTO chat_conversations (id, kind, name, created_at) VALUES ('equipe', 'equipe', 'Équipe', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
   ${TABLES.map((t) => `ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`).join('\n   ')}`,
];
