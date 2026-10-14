// Démarrage du serveur : variables d'environnement, premier administrateur facultatif, arrêt propre.
//   SUPABASE_DB_URL            base PostgreSQL de Supabase (sinon SQLite dans DATA_DIR)
//   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY   mots de passe vérifiés par Supabase Auth
//   COPIER_SQLITE=1            au premier démarrage sur Supabase, y recopie la base SQLite
//   GOOGLE_MAPS_KEY            facultatif : « Carte clients » en mode réaliste avec l'imagerie Google Maps (Map Tiles API)
//   HERE_API_KEY, GOOGLE_PLACES_KEY, TOMTOM_KEY   facultatifs : plus de téléphones pour le générateur de leads (voir contacts.js)
//   LEADS_BASE_LOCALE=0        ne pas télécharger la base des lieux OpenStreetMap (générateur de leads)
//   CONTACTS_ESSAI=0           pas d'essai réel du générateur de leads au démarrage
import { resolve, join } from 'node:path';
import { existsSync } from 'node:fs';
import { createApp } from './app.js';
import { createUser, validateUserInput } from './auth.js';
import { copySqliteToPg } from './copie.js';
import { baseLieux } from './lieux.js';
import { essaiReel } from './contacts.js';

const env = process.env;
const port = Number(env.PORT) || 3000;
const dataDir = resolve(env.DATA_DIR || 'data');
// Générateur de leads : base locale des lieux OpenStreetMap (téléchargée en arrière-plan) et services à clé facultatifs.
const lieux = env.LEADS_BASE_LOCALE === '0' ? null : baseLieux();
const contacts = { lieux, googleKey: env.GOOGLE_PLACES_KEY || null, hereKey: env.HERE_API_KEY || null, tomtomKey: env.TOMTOM_KEY || null };
const supabase = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY ? { url: env.SUPABASE_URL, serviceKey: env.SUPABASE_SERVICE_ROLE_KEY } : null;
const { app, db, hub, identity } = await createApp({
  dataDir,
  databaseUrl: env.SUPABASE_DB_URL || env.DATABASE_URL || null,
  supabase,
  dev: env.BS_DEV === '1' || process.argv.includes('--dev'),
  secureCookies: env.COOKIE_SECURE === '1',
  trustProxy: env.TRUST_PROXY ? (/^\d+$/.test(env.TRUST_PROXY) ? Number(env.TRUST_PROXY) : env.TRUST_PROXY) : false,
  siteApiKey: env.SITE_API_KEY || null,
  siteTimeZone: env.SITE_TIMEZONE || 'Europe/Paris',
  googleMapsKey: env.GOOGLE_MAPS_KEY || null,
  contacts,
});
// Passage à Supabase : COPIER_SQLITE=1 recopie la base SQLite de DATA_DIR dans Supabase, une seule fois
// (seulement si Supabase n'a encore aucun compte). Le fichier SQLite reste intact, en secours.
if (db.kind === 'pg' && env.COPIER_SQLITE === '1' && (await db.get('SELECT COUNT(*) AS n FROM users')).n === 0) {
  const src = join(dataDir, 'blackstart.db');
  if (existsSync(src)) {
    console.log('Copie de SQLite vers Supabase…');
    const n = await copySqliteToPg(src, db, { log: (l) => console.log('  ' + l) });
    console.log(`Copie terminée : ${n.users} compte(s), ${n.chat_messages} message(s).`);
  }
}
if (env.SITE_API_KEY && env.SITE_API_KEY.length < 24) console.warn('SITE_API_KEY est courte : utilisez au moins 24 caractères aléatoires.');

// Déploiement sans écran : ADMIN_EMAIL + ADMIN_PASSWORD créent le premier administrateur au démarrage.
if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD && (await db.get('SELECT COUNT(*) AS n FROM users')).n === 0) {
  const input = { name: env.ADMIN_NAME || 'Administrateur', email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD, role: 'admin' };
  const errors = validateUserInput(input);
  if (errors.length) console.error('ADMIN_* ignorés :', errors.join(' '));
  else console.log('Administrateur créé :', (await createUser(db, input, identity)).email);
}

const server = app.listen(port, () => {
  const where = db.kind === 'pg' ? 'PostgreSQL (Supabase)' : dataDir;
  console.log(`Blackstart CRM — http://localhost:${port} (données : ${where}, mots de passe : ${identity.kind === 'supabase' ? 'Supabase Auth' : 'serveur'})`);
  if (lieux) {
    lieux.demarrer()
      .then(() => (env.CONTACTS_ESSAI !== '0' ? essaiReel(contacts) : null))
      .catch((e) => console.warn('[contacts] essai impossible :', e && e.message));
  }
});
function stop() {
  hub.close(); // les flux temps réel de la messagerie gardent sinon le serveur ouvert
  if (lieux) lieux.fermer();
  server.close(() => { db.close().finally(() => process.exit(0)); });
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
