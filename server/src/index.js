// Démarrage du serveur : variables d'environnement, premier administrateur facultatif, arrêt propre.
import { resolve } from 'node:path';
import { createApp } from './app.js';
import { createUser, validateUserInput } from './auth.js';

const env = process.env;
const port = Number(env.PORT) || 3000;
const dataDir = resolve(env.DATA_DIR || 'data');
const { app, db } = createApp({
  dataDir,
  dev: env.BS_DEV === '1' || process.argv.includes('--dev'),
  secureCookies: env.COOKIE_SECURE === '1',
  trustProxy: env.TRUST_PROXY ? (/^\d+$/.test(env.TRUST_PROXY) ? Number(env.TRUST_PROXY) : env.TRUST_PROXY) : false,
});

// Déploiement sans écran : ADMIN_EMAIL + ADMIN_PASSWORD créent le premier administrateur au démarrage.
if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD && db.prepare('SELECT COUNT(*) AS n FROM users').get().n === 0) {
  const input = { name: env.ADMIN_NAME || 'Administrateur', email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD, role: 'admin' };
  const errors = validateUserInput(input);
  if (errors.length) console.error('ADMIN_* ignorés :', errors.join(' '));
  else console.log('Administrateur créé :', createUser(db, input).email);
}

const server = app.listen(port, () => {
  console.log(`Blackstart CRM — http://localhost:${port} (données : ${dataDir})`);
});
function stop() {
  server.close(() => { db.close(); process.exit(0); });
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
