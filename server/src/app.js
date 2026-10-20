// Application Express : API, page de connexion et CRM (le même fichier HTML que la version autonome,
// assemblé depuis app/, avec la configuration du serveur injectée en tête).
import express from 'express';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openStore } from './store.js';
import { localIdentity, supabaseIdentity } from './identity.js';
import { attachUser, csrfGuard, requireUser, requireAdmin, loginLimiter } from './auth.js';
import { authRoutes } from './routes/auth.js';
import { usersRoutes } from './routes/users.js';
import { dataRoutes } from './routes/data.js';
import { ambianceStore, ambianceApi, ambianceFiles } from './routes/ambiance.js';
import { formationRoutes } from './routes/formation.js';
import { siteRoutes } from './routes/site.js';
import { chatRoutes, chatHub } from './routes/chat.js';
import { photosRoutes } from './routes/photos.js';
import { sonsRoutes } from './routes/sons.js';
import { enregistrementsRoutes } from './routes/enregistrements.js';
import { mailRoutes } from './routes/mail.js';
import { integrationsRoutes } from './routes/integrations.js';
import { iaRoutes } from './routes/ia.js';
import { loginPage, safeReturn } from './pages.js';
import { assemble } from '../../scripts/build.mjs';
import { osmRoutes } from './osm.js';
import { contactsRoutes } from './contacts.js';
import { requireAcces, peut } from './acces.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const VERSION = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;

// Base : PostgreSQL (Supabase) si databaseUrl est donné, sinon SQLite dans dataDir.
// Mots de passe : Supabase Auth si supabase = { url, serviceKey } est donné, sinon vérifiés par le serveur.
export async function createApp({ dataDir, databaseUrl = null, supabase = null, dev = false, secureCookies = false, trustProxy = false, siteApiKey = null, siteTimeZone, googleMapsKey = null, contacts = {}, mail = {}, integrations = {}, ia = {} } = {}) {
  const db = await openStore({ dataDir, databaseUrl });
  const identity = supabase ? supabaseIdentity(supabase) : localIdentity();
  const app = express();
  const limiter = loginLimiter();
  const store = ambianceStore({ db, dataDir });
  const hub = chatHub();
  app.disable('x-powered-by');
  if (trustProxy) app.set('trust proxy', trustProxy);

  app.use((_req, res, next) => {
    res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'X-Frame-Options': 'SAMEORIGIN' });
    next();
  });
  app.get('/healthz', (_req, res) => res.json({ ok: true, version: VERSION }));
  // Voix off de la formation (fichiers MP3 nommés par l'empreinte du texte : jamais modifiés, cache long).
  app.use('/voix', express.static(join(ROOT, 'app', 'voix'), { immutable: true, maxAge: '30d', fallthrough: false, index: false }));
  // Logo en verre 3D de la page de connexion (Three.js assemblé par npm run build:verre).
  // Outils PDF du navigateur (devis et factures joints aux mails), servis par le CRM plutôt que par un CDN.
  const VENDOR = { 'jspdf.umd.min.js': 'jspdf/dist/jspdf.umd.min.js', 'html2canvas.min.js': 'html2canvas/dist/html2canvas.min.js' };
  app.get('/vendor/:f', (req, res) => {
    const f = VENDOR[req.params.f];
    if (!f) return res.status(404).end();
    res.set('Cache-Control', 'public, max-age=604800').sendFile(join(ROOT, 'node_modules', f));
  });
  app.use('/verre', express.static(join(ROOT, 'app', 'verre'), { maxAge: '7d', fallthrough: false, index: false }));
  // Captures de la vraie interface pour les tutos de la formation (régénérées par scripts/formation/ecrans.mjs).
  app.use('/formation', express.static(join(ROOT, 'app', 'formation'), { maxAge: '7d', fallthrough: false, index: false }));
  app.use(attachUser(db));

  // API
  // Passerelle du site internet : appelée de serveur à serveur avec une clé, donc hors cookies et hors garde CSRF.
  app.use('/api/site', express.json({ limit: '50kb' }), siteRoutes({ db, apiKey: siteApiKey, timeZone: siteTimeZone }));
  app.use('/api', csrfGuard);
  app.use('/api/auth', express.json({ limit: '100kb' }), authRoutes({ db, identity, limiter, secureCookies }));
  app.use('/api/users', requireAdmin, express.json({ limit: '100kb' }), usersRoutes({ db, identity, hub }));
  app.use('/api/data', requireUser, express.json({ limit: '25mb' }), dataRoutes({ db }));
  app.use('/api/ambiance', requireUser, express.json({ limit: '40mb' }), ambianceApi({ db, store }));
  app.use('/api/osm', requireAcces('leads'), express.json({ limit: '40kb' }), osmRoutes());
  app.use('/api/contacts', requireAcces('leads'), express.json({ limit: '40kb' }), contactsRoutes(contacts));
  app.use('/api/formation', requireAcces('formations'), express.json({ limit: '10kb' }), formationRoutes({ db }));
  app.use('/api/chat', requireUser, express.json({ limit: '100kb' }), chatRoutes({ db, hub }));
  app.use('/api/photos', requireUser, express.json({ limit: '700kb' }), photosRoutes({ db, hub }));
  app.use('/api/sons', requireUser, sonsRoutes({ db }));
  app.use('/api/enregistrements', requireUser, enregistrementsRoutes({ db }));
  app.use('/api/mail', requireAcces('mail'), mailRoutes({ db, dataDir, ...mail }));
  app.use('/api/integrations', requireAcces('entrainement'), integrationsRoutes(integrations));
  app.use('/api/ia', requireUser, iaRoutes({ db, dataDir, ...ia }));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Adresse inconnue.' }));
  app.use('/ambiance', ambianceFiles({ store }));

  // Pages
  app.get('/connexion', async (req, res) => {
    if (req.user) return res.redirect(safeReturn(req.query.retour));
    const needsSetup = (await db.get('SELECT COUNT(*) AS n FROM users')).n === 0;
    res.set('Cache-Control', 'no-store').type('html').send(loginPage({ needsSetup, retour: safeReturn(req.query.retour) }));
  });

  // Le CRM : assemblé une fois au démarrage (à chaque requête en développement, pour voir ses modifications).
  let html = dev ? null : assemble();
  app.get('/', (req, res) => {
    if (!req.user) return res.redirect('/connexion');
    const page = html || assemble();
    const conf = JSON.stringify({ user: req.user, version: VERSION, ...(googleMapsKey && peut(req.user, 'carte') ? { carte: { google: googleMapsKey } } : {}) }).replace(/</g, '\\u003c');
    res.set('Cache-Control', 'no-store').type('html')
      .send(page.replace('<head>', `<head>\n<script id="bs-serveur-conf">window.BS_SERVER=${conf};</script>`));
  });

  app.use((req, res) => (req.accepts('html') ? res.redirect('/') : res.status(404).end()));
  // Erreurs : message lisible en JSON (corps trop gros, JSON illisible…).
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status === 413 ? 'Envoi trop volumineux.' : status === 400 ? 'Requête illisible.' : 'Erreur du serveur.' });
  });

  return { app, db, hub, identity };
}
