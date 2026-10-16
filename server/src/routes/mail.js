// /api/mail : chaque membre connecte ses boîtes mail (Gmail, Hostinger, OVH… ou un autre serveur SMTP) et envoie
// ses mails depuis le CRM, avec pièces jointes (fichiers, devis et factures en PDF).
// - Le mot de passe est chiffré en base (AES-256-GCM) ; la clé vient de MAIL_SECRET, sinon d'un fichier du dossier de données.
// - Les mails envoyés (sans les pièces jointes) sont gardés pour l'historique « Envoyés ».
// - Gmail se connecte avec « Se connecter avec Google » (OAuth) et part par l'API Gmail en HTTPS : ça marche même
//   quand l'hébergeur bloque l'envoi de mails (SMTP), comme Railway hors offre Pro. La clé Google (identifiant et
//   secret du client OAuth) vient de GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET, sinon un administrateur la colle
//   dans Mail › Mes boîtes.
import express, { Router } from 'express';
import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import nodemailer from 'nodemailer';
import MailComposer from 'nodemailer/lib/mail-composer/index.js';
import { getSetting, setSetting } from '../store.js';

// Serveurs d'envoi des fournisseurs connus (les mêmes que dans app/modules/bs-mail.js).
export const FOURNISSEURS = {
  gmail: { host: 'smtp.gmail.com', port: 465, secure: true },
  hostinger: { host: 'smtp.hostinger.com', port: 465, secure: true },
  ovh: { host: 'ssl0.ovh.net', port: 465, secure: true },
  ionos: { host: 'smtp.ionos.fr', port: 465, secure: true },
  zoho: { host: 'smtp.zoho.eu', port: 465, secure: true },
  yahoo: { host: 'smtp.mail.yahoo.com', port: 465, secure: true },
  icloud: { host: 'smtp.mail.me.com', port: 587, secure: false },
  gandi: { host: 'mail.gandi.net', port: 465, secure: true },
  autre: null,
};
const MAX_TOTAL = 20 * 1024 * 1024;
const RELAIS_SCRIPT = 'blackstart-relais-mail';
const RELAIS_SOURCE = readFileSync(fileURLToPath(new URL('../relais-worker.js', import.meta.url)), 'utf8');
const EMAIL = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/;
const now = () => new Date().toISOString();
const texte = (v, n) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, n);
const ligne = (v, n) => texte(v, n).replace(/[\r\n]+/g, ' ');
const adresses = (v) => String(v || '').split(/[,;\s]+/).map((x) => x.trim()).filter(Boolean);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function cleDe(dataDir) {
  if (process.env.MAIL_SECRET) return createHash('sha256').update(process.env.MAIL_SECRET).digest();
  const f = join(dataDir || 'data', 'mail.key');
  if (!existsSync(f)) { mkdirSync(dataDir || 'data', { recursive: true }); writeFileSync(f, randomBytes(32).toString('base64'), { mode: 0o600 }); }
  return Buffer.from(readFileSync(f, 'utf8').trim(), 'base64');
}

// Erreur de connexion → phrase claire. reseau = le serveur mail n'a pas pu être joint (et non un refus du mot de passe).
// Réponse d'erreur de l'API Gmail → message en français (+ lien vers la page Google à ouvrir quand il y en a une).
export function erreurGmail(status, e) {
  const msg = String(e.message || ''), details = Array.isArray(e.details) ? e.details : [];
  const info = details.find((d) => d && d.reason) || {};
  if (info.reason === 'SERVICE_DISABLED' || /has not been used in project|is disabled/i.test(msg)) {
    const projet = String((info.metadata && info.metadata.consumer) || '').replace(/^projects\//, '') || ((/project (\d+)/.exec(msg) || [])[1] || '');
    return Object.assign(new Error('L’envoi Gmail n’est pas encore activé dans votre projet Google (étape 2 du guide). Ouvrez la page ci-dessous, cliquez sur « Activer », attendez 2 à 3 minutes puis renvoyez le mail.'),
      { code: 'GAPI', lien: 'https://console.cloud.google.com/apis/library/gmail.googleapis.com' + (/^\d+$/.test(projet) ? '?project=' + projet : ''), lienTexte: 'Activer l’envoi Gmail' });
  }
  if (/insufficient.*scope/i.test(msg) || info.reason === 'ACCESS_TOKEN_SCOPE_INSUFFICIENT')
    return Object.assign(new Error('Google n’a pas donné l’autorisation d’envoyer : déconnectez Gmail dans Mail › Mes boîtes, reconnectez-le et cochez « Envoyer des e-mails ».'), { code: 'GAPI' });
  if (status === 429 || /rate limit|quota/i.test(msg)) return Object.assign(new Error('Gmail limite les envois pour le moment : réessayez dans quelques minutes.'), { code: 'GAPI' });
  return Object.assign(new Error('Gmail a refusé l’envoi' + (msg ? ' : ' + msg.slice(0, 200) : ` (${status}).`)), { code: 'GAPI' });
}

export function expliquer(err, relais = false) {
  const code = String(err && (err.code || '')), msg = String(err && err.message || '');
  if (/^G(AUTH|CONF|API)$/.test(code) || code === 'ERELAIS') return { reseau: false, error: msg, ...(err.lien ? { lien: err.lien, lienTexte: err.lienTexte } : {}) };
  if (relais && code === 'ESMTP') return { reseau: false, error: 'Envoi refusé par le serveur mail : ' + msg.slice(0, 200) };
  if (relais && code !== 'EAUTH') return { reseau: false, error: 'Le serveur mail ne répond pas au relais : vérifiez le serveur d’envoi (SMTP) et le port de la boîte. ' + msg.slice(0, 120) };
  if (code === 'EAUTH' || /auth|credentials|password|login|535|534/i.test(msg) && !/timeout/i.test(msg))
    return { reseau: false, error: 'Adresse ou mot de passe refusé par le serveur mail. Pour Gmail, Yahoo et iCloud, il faut un « mot de passe d’application » (voir l’aide sous le champ).' };
  if (['ETIMEDOUT', 'ECONNECTION', 'ESOCKET', 'ECONNREFUSED', 'ENOTFOUND', 'EDNS', 'ECONNRESET', 'EHOSTUNREACH'].includes(code) || /timeout|ECONN|getaddrinfo/i.test(msg))
    return { reseau: true, error: 'Le serveur mail ne répond pas depuis l’hébergement du CRM. Sur Railway, l’envoi de mails demande l’offre Pro.' };
  return { reseau: false, error: 'Envoi refusé par le serveur mail : ' + msg.slice(0, 200) };
}

export function mailRoutes({ db, dataDir, transport = (o) => nodemailer.createTransport(o), sonde = sondeSmtp, fetch: web = globalThis.fetch }) {
  const r = Router();
  const cle = cleDe(dataDir);
  const chiffrer = (t) => {
    const iv = randomBytes(12), c = createCipheriv('aes-256-gcm', cle, iv);
    const data = Buffer.concat([c.update(String(t), 'utf8'), c.final()]);
    return [iv, c.getAuthTag(), data].map((b) => b.toString('base64')).join('.');
  };
  const dechiffrer = (s) => {
    const [iv, tag, data] = String(s).split('.').map((b) => Buffer.from(b, 'base64'));
    const d = createDecipheriv('aes-256-gcm', cle, iv); d.setAuthTag(tag);
    return Buffer.concat([d.update(data), d.final()]).toString('utf8');
  };
  const vue = (c) => ({ id: c.id, fournisseur: c.provider, email: c.email, nom: c.display_name || '', signature: c.signature || '',
    google: c.smtp_host === 'oauth:google', serveur: c.smtp_host, port: Number(c.smtp_port), ssl: !!Number(c.smtp_secure), identifiant: c.username, creeLe: c.created_at });
  const options = (c, pass) => ({ host: c.smtp_host, port: Number(c.smtp_port), secure: !!Number(c.smtp_secure), auth: { user: c.username, pass },
    connectionTimeout: 15000, greetingTimeout: 12000, socketTimeout: 60000 });
  const compteDe = (req, id) => db.get('SELECT * FROM mail_accounts WHERE id = ? AND user_id = ?', String(id || ''), req.user.id);

  // ---------------------------------------------------------------- Google (Gmail par OAuth)
  const SCOPES = 'openid email https://www.googleapis.com/auth/gmail.send';
  async function googleConf() {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) return { id: process.env.GOOGLE_CLIENT_ID, secret: process.env.GOOGLE_CLIENT_SECRET, env: true };
    const g = await getSetting(db, 'mail_google', null);
    if (!g || !g.id || !g.secret) return null;
    try { return { id: g.id, secret: dechiffrer(g.secret), env: false }; } catch { return null; }
  }
  const retourUrl = (req) => {
    const proto = String(req.get('x-forwarded-proto') || req.protocol || 'https').split(',')[0].trim();
    return `${proto}://${req.get('host')}/api/mail/google/retour`;
  };
  const etats = new Map(); // état OAuth → { userId, at }
  const jetons = new Map(); // compte → { token, exp }
  async function jetonGoogle(c) {
    const j = jetons.get(c.id);
    if (j && j.exp > Date.now() + 60000) return j.token;
    const conf = await googleConf();
    if (!conf) throw Object.assign(new Error('Clé Google absente : un administrateur doit la renseigner dans Mail › Mes boîtes.'), { code: 'GCONF' });
    const r = await web('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: conf.id, client_secret: conf.secret, refresh_token: dechiffrer(c.secret), grant_type: 'refresh_token' }) });
    const b = await r.json().catch(() => ({}));
    if (!r.ok || !b.access_token) throw Object.assign(new Error('Accès Google expiré ou retiré : reconnectez Gmail dans Mail › Mes boîtes.'), { code: 'GAUTH' });
    jetons.set(c.id, { token: b.access_token, exp: Date.now() + (Number(b.expires_in) || 3600) * 1000 });
    return b.access_token;
  }
  async function envoyerGmail(c, message) {
    const brut = await new MailComposer(message).compile().build();
    const r = await web('https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=media', {
      method: 'POST', headers: { Authorization: `Bearer ${await jetonGoogle(c)}`, 'Content-Type': 'message/rfc822' }, body: brut });
    const b = await r.json().catch(() => ({}));
    if (r.status === 401) { jetons.delete(c.id); throw Object.assign(new Error('Accès Google expiré ou retiré : reconnectez Gmail dans Mail › Mes boîtes.'), { code: 'GAUTH' }); }
    if (!r.ok) throw erreurGmail(r.status, b.error || {});
    return { messageId: b.id };
  }

  // ---------------------------------------------------------------- relais d'envoi (Cloudflare Worker)
  async function relaisConf() {
    if (process.env.RELAIS_URL && process.env.RELAIS_SECRET) return { url: process.env.RELAIS_URL.replace(/\/$/, ''), secret: process.env.RELAIS_SECRET, env: true };
    const g = await getSetting(db, 'mail_relais', null);
    if (!g || !g.url || !g.secret) return null;
    try { return { url: g.url, secret: dechiffrer(g.secret), env: false, compte: g.compte || '' }; } catch { return null; }
  }
  async function cf(jeton, method, path, body) {
    const o = { method, headers: { Authorization: `Bearer ${jeton}` } };
    if (body instanceof FormData) o.body = body;
    else if (body !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(body); }
    const r = await web('https://api.cloudflare.com/client/v4' + path, o);
    const b = await r.json().catch(() => ({}));
    if (!r.ok || b.success === false) {
      const m = (b.errors && b.errors[0] && b.errors[0].message) || `erreur ${r.status}`;
      throw Object.assign(new Error(r.status === 401 || r.status === 403 ? 'Jeton Cloudflare refusé : recréez-le avec le modèle « Modifier Cloudflare Workers ».' : 'Cloudflare : ' + m), { status: r.status });
    }
    return b.result;
  }
  // Installe (ou met à jour) le relais sur le compte Cloudflare du jeton, puis garde son adresse et sa clé.
  async function installerRelais(jeton) {
    const comptes = await cf(jeton, 'GET', '/accounts?per_page=5');
    const compte = Array.isArray(comptes) && comptes[0];
    if (!compte) throw new Error('Aucun compte Cloudflare trouvé avec ce jeton.');
    let sous = null;
    try { sous = (await cf(jeton, 'GET', `/accounts/${compte.id}/workers/subdomain`))?.subdomain || null; } catch { sous = null; }
    if (!sous) {
      const nom = 'blackstart-' + randomBytes(3).toString('hex');
      sous = (await cf(jeton, 'PUT', `/accounts/${compte.id}/workers/subdomain`, { subdomain: nom }))?.subdomain || nom;
    }
    const secret = randomBytes(24).toString('base64url');
    const fd = new FormData();
    fd.append('metadata', new Blob([JSON.stringify({ main_module: 'relais.js', compatibility_date: '2025-06-01',
      bindings: [{ type: 'secret_text', name: 'RELAIS_SECRET', text: secret }] })], { type: 'application/json' }));
    fd.append('relais.js', new Blob([RELAIS_SOURCE], { type: 'application/javascript+module' }), 'relais.js');
    await cf(jeton, 'PUT', `/accounts/${compte.id}/workers/scripts/${RELAIS_SCRIPT}`, fd);
    await cf(jeton, 'POST', `/accounts/${compte.id}/workers/scripts/${RELAIS_SCRIPT}/subdomain`, { enabled: true, previews_enabled: false });
    const url = `https://${RELAIS_SCRIPT}.${sous}.workers.dev`;
    await setSetting(db, 'mail_relais', { url, secret: chiffrer(secret), jeton: chiffrer(jeton), compte: compte.name || compte.id, le: now() });
    return { url, compte: compte.name || compte.id };
  }
  if (process.env.RELAIS_CLOUDFLARE_TOKEN) {
    relaisConf().then((c) => c || installerRelais(process.env.RELAIS_CLOUDFLARE_TOKEN).then((x) => console.log(`Relais d'envoi des mails installé : ${x.url}`)))
      .catch((e) => console.error('Relais d’envoi des mails :', e.message));
  }
  // Le mail au format SMTP : lignes en CRLF, points doublés en début de ligne, terminé par « . ».
  async function brutSmtp(message) {
    const buf = await new MailComposer(message).compile().build();
    let t = buf.toString('latin1').replace(/\r?\n/g, '\r\n').replace(/\r\n\./g, '\r\n..');
    if (t.startsWith('.')) t = '.' + t;
    if (!t.endsWith('\r\n')) t += '\r\n';
    return Buffer.from(t + '.\r\n', 'latin1');
  }
  async function viaRelais(conf, c, pass, envoi) {
    const params = Buffer.from(JSON.stringify({ host: c.smtp_host, port: Number(c.smtp_port), user: c.username, pass,
      from: envoi ? envoi.from : undefined, to: envoi ? envoi.to : undefined })).toString('base64');
    const r = await web(conf.url + (envoi ? '/envoyer' : '/verifier'), { method: 'POST', signal: AbortSignal.timeout(75000),
      headers: { Authorization: `Bearer ${conf.secret}`, 'X-Relais': params, 'Content-Type': 'application/octet-stream' }, body: envoi ? envoi.brut : '' });
    const b = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(r.status === 401 ? 'Le relais d’envoi refuse la clé du CRM : réinstallez-le dans Mail › Mes boîtes.' : (b.error || `Relais : erreur ${r.status}`)),
      { code: r.status === 401 ? 'ERELAIS' : (b.code || 'ESOCKET') });
    return { messageId: null };
  }
  // Chemin d'envoi d'une boîte SMTP : directement si l'hébergeur le permet, sinon par le relais s'il est installé.
  async function chemin() {
    if (await sonde()) return { relais: null };
    return { relais: await relaisConf() };
  }

  r.get('/relais', async (req, res) => {
    const c = await relaisConf();
    res.json({ pret: !!c, parEnv: !!(c && c.env), compte: c ? c.compte || '' : '', adresse: c ? c.url.replace(/^https:\/\//, '') : '', admin: req.user.role === 'admin' });
  });
  r.put('/relais', express.json({ limit: '10kb' }), async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Réservé aux administrateurs.' });
    const jeton = ligne(req.body?.jeton, 400);
    if (jeton.length < 20) return res.status(400).json({ error: 'Collez le jeton Cloudflare en entier.' });
    try {
      const x = await installerRelais(jeton);
      res.json({ ok: true, compte: x.compte, adresse: x.url.replace(/^https:\/\//, '') });
    } catch (e) { res.status(400).json({ error: e.message }); }
  });

  r.get('/google', async (req, res) => {
    const conf = await googleConf();
    res.json({ pret: !!conf, parEnv: !!(conf && conf.env), retour: retourUrl(req), admin: req.user.role === 'admin' });
  });
  r.put('/google', express.json({ limit: '10kb' }), async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Réservé aux administrateurs.' });
    const id = ligne(req.body?.clientId, 300), secret = ligne(req.body?.clientSecret, 300);
    if (!/^[\w.-]+\.apps\.googleusercontent\.com$/.test(id)) return res.status(400).json({ error: 'L’ID client se termine par .apps.googleusercontent.com.' });
    if (secret.length < 10) return res.status(400).json({ error: 'Collez le code secret du client.' });
    await setSetting(db, 'mail_google', { id, secret: chiffrer(secret), par: req.user.name, le: now() });
    res.json({ ok: true });
  });
  // Bouton « Se connecter avec Google » : page de Google, puis retour ici avec un code.
  r.get('/google/debut', async (req, res) => {
    const conf = await googleConf();
    if (!conf) return res.redirect('/?mail=sans-cle#/mail');
    const etat = randomBytes(18).toString('base64url');
    for (const [k, v] of etats) if (Date.now() - v.at > 600000) etats.delete(k);
    etats.set(etat, { userId: req.user.id, at: Date.now() });
    const q = new URLSearchParams({ client_id: conf.id, redirect_uri: retourUrl(req), response_type: 'code', scope: SCOPES,
      access_type: 'offline', prompt: 'consent', include_granted_scopes: 'true', state: etat });
    res.redirect('https://accounts.google.com/o/oauth2/v2/auth?' + q);
  });
  r.get('/google/retour', async (req, res) => {
    const fin = (code) => res.redirect(`/?mail=${code}#/mail`);
    const e = etats.get(String(req.query.state || ''));
    etats.delete(String(req.query.state || ''));
    if (!e || e.userId !== req.user.id || Date.now() - e.at > 600000) return fin('expire');
    if (req.query.error || !req.query.code) return fin('annule');
    const conf = await googleConf();
    if (!conf) return fin('sans-cle');
    try {
      const r1 = await web('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ code: String(req.query.code), client_id: conf.id, client_secret: conf.secret, redirect_uri: retourUrl(req), grant_type: 'authorization_code' }) });
      const t = await r1.json().catch(() => ({}));
      if (!r1.ok || !t.access_token) return fin('refuse');
      if (!String(t.scope || '').includes('gmail.send')) return fin('sans-envoi');
      const r2 = await web('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${t.access_token}` } });
      const u = await r2.json().catch(() => ({}));
      const email = ligne(u.email, 200).toLowerCase();
      if (!EMAIL.test(email)) return fin('refuse');
      const deja = await db.get('SELECT * FROM mail_accounts WHERE user_id = ? AND email = ?', req.user.id, email);
      if (deja && !t.refresh_token) return fin('ok');
      if (!t.refresh_token) return fin('refuse');
      if (deja) await db.run('UPDATE mail_accounts SET provider = ?, smtp_host = ?, smtp_port = 0, smtp_secure = 1, username = ?, secret = ? WHERE id = ?', 'gmail', 'oauth:google', email, chiffrer(t.refresh_token), deja.id);
      else await db.run(`INSERT INTO mail_accounts (id, user_id, provider, email, display_name, smtp_host, smtp_port, smtp_secure, username, secret, signature, created_at)
                         VALUES (?, ?, 'gmail', ?, ?, 'oauth:google', 0, 1, ?, ?, NULL, ?)`, randomUUID(), req.user.id, email, ligne(u.name, 120) || req.user.name, email, chiffrer(t.refresh_token), now());
      if (deja) jetons.delete(deja.id);
      fin('ok');
    } catch { fin('refuse'); }
  });

  // Le serveur peut-il joindre un serveur d'envoi ? (Railway bloque l'envoi de mails hors offre Pro.)
  r.get('/reseau', async (_req, res) => res.json({ smtp: await sonde(), relais: !!(await relaisConf()) }));

  r.get('/comptes', async (req, res) => {
    const rows = await db.all('SELECT * FROM mail_accounts WHERE user_id = ? ORDER BY created_at', req.user.id);
    res.json({ comptes: rows.map(vue) });
  });

  r.post('/comptes', express.json({ limit: '20kb' }), async (req, res) => {
    const b = req.body || {};
    const fournisseur = String(b.fournisseur || '');
    if (!(fournisseur in FOURNISSEURS)) return res.status(400).json({ error: 'Choisissez votre messagerie.' });
    if (fournisseur === 'gmail' && !b.motDePasse) return res.status(400).json({ error: 'Gmail se connecte avec le bouton « Se connecter avec Google ».' });
    const email = ligne(b.email, 200).toLowerCase();
    if (!EMAIL.test(email)) return res.status(400).json({ error: 'Adresse mail invalide.' });
    const brut = String(b.motDePasse || '');
    const pass = fournisseur === 'gmail' ? brut.replace(/\s+/g, '') : brut;
    if (!pass.trim()) return res.status(400).json({ error: 'Entrez le mot de passe de la boîte mail.' });
    let srv = FOURNISSEURS[fournisseur];
    if (!srv) {
      const host = ligne(b.serveur, 200).toLowerCase(), port = Number(b.port);
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) return res.status(400).json({ error: 'Serveur d’envoi (SMTP) invalide, par exemple smtp.mondomaine.fr.' });
      if (![465, 587, 25, 2525].includes(port)) return res.status(400).json({ error: 'Port SMTP : 465 (SSL) ou 587 en général.' });
      srv = { host, port, secure: port === 465 };
    }
    if (await db.get('SELECT 1 AS ok FROM mail_accounts WHERE user_id = ? AND email = ?', req.user.id, email))
      return res.status(409).json({ error: 'Cette boîte mail est déjà connectée.' });
    const c = { id: randomUUID(), smtp_host: srv.host, smtp_port: srv.port, smtp_secure: srv.secure ? 1 : 0, username: ligne(b.identifiant, 200) || email };
    // Vérification auprès du serveur mail : un mot de passe refusé bloque ; un serveur injoignable n'empêche pas d'enregistrer.
    let verifie = true, avertissement = null;
    const voie = await chemin();
    try {
      if (voie.relais) await viaRelais(voie.relais, c, pass, null);
      else await transport(options(c, pass)).verify();
    } catch (err) {
      const e = expliquer(err, !!voie.relais);
      if (!e.reseau) return res.status(400).json({ error: e.error });
      verifie = false; avertissement = e.error;
    }
    await db.run(`INSERT INTO mail_accounts (id, user_id, provider, email, display_name, smtp_host, smtp_port, smtp_secure, username, secret, signature, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      c.id, req.user.id, fournisseur, email, ligne(b.nom, 120) || req.user.name, c.smtp_host, c.smtp_port, c.smtp_secure, c.username,
      chiffrer(pass), texte(b.signature, 2000) || null, now());
    res.status(201).json({ compte: vue(await compteDe(req, c.id)), verifie, avertissement });
  });

  r.patch('/comptes/:id', express.json({ limit: '20kb' }), async (req, res) => {
    const c = await compteDe(req, req.params.id);
    if (!c) return res.status(404).json({ error: 'Boîte mail introuvable.' });
    const b = req.body || {};
    if (b.nom !== undefined) await db.run('UPDATE mail_accounts SET display_name = ? WHERE id = ?', ligne(b.nom, 120) || null, c.id);
    if (b.signature !== undefined) await db.run('UPDATE mail_accounts SET signature = ? WHERE id = ?', texte(b.signature, 2000) || null, c.id);
    if (b.motDePasse) await db.run('UPDATE mail_accounts SET secret = ? WHERE id = ?', chiffrer(String(b.motDePasse).trim()), c.id);
    res.json({ compte: vue(await compteDe(req, c.id)) });
  });

  r.delete('/comptes/:id', async (req, res) => {
    const out = await db.run('DELETE FROM mail_accounts WHERE id = ? AND user_id = ?', req.params.id, req.user.id);
    if (!out.changes) return res.status(404).json({ error: 'Boîte mail introuvable.' });
    res.json({ ok: true });
  });

  r.get('/envoyes', async (req, res) => {
    const rows = await db.all(`SELECT id, account_email, to_addr, cc, subject, body, attachments, prospect_id, status, error, created_at
                               FROM mail_sent WHERE user_id = ? ORDER BY created_at DESC LIMIT 200`, req.user.id);
    res.json({ envoyes: rows.map((x) => ({ id: x.id, de: x.account_email, a: x.to_addr, cc: x.cc || '', sujet: x.subject, texte: x.body,
      pieces: x.attachments ? JSON.parse(x.attachments) : [], prospectId: x.prospect_id, statut: x.status, erreur: x.error, date: x.created_at })) });
  });

  r.post('/envoyer', express.json({ limit: '30mb' }), async (req, res) => {
    const b = req.body || {};
    const c = await compteDe(req, b.compte);
    if (!c) return res.status(400).json({ error: 'Choisissez la boîte mail d’envoi.' });
    const a = adresses(b.a), cc = adresses(b.cc), cci = adresses(b.cci);
    if (!a.length) return res.status(400).json({ error: 'Indiquez au moins un destinataire.' });
    const faux = [...a, ...cc, ...cci].find((x) => !EMAIL.test(x));
    if (faux) return res.status(400).json({ error: `Adresse invalide : ${faux.slice(0, 80)}` });
    if (a.length + cc.length + cci.length > 50) return res.status(400).json({ error: '50 destinataires au plus par mail.' });
    const sujet = ligne(b.sujet, 300), corps = texte(b.texte, 100000);
    if (!sujet) return res.status(400).json({ error: 'Ajoutez un objet au mail.' });
    let total = 0;
    const pieces = [];
    for (const p of Array.isArray(b.pieces) ? b.pieces.slice(0, 20) : []) {
      const data = Buffer.from(String(p && p.data || ''), 'base64');
      if (!data.length) continue;
      total += data.length;
      pieces.push({ filename: ligne(p.nom, 160).replace(/[\\/]/g, '-') || 'piece-jointe', content: data, contentType: ligne(p.type, 100) || 'application/octet-stream' });
    }
    if (total > MAX_TOTAL) return res.status(413).json({ error: 'Pièces jointes trop lourdes : 20 Mo au plus au total.' });
    const signature = c.signature ? '\n\n-- \n' + c.signature : '';
    const html = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#111">' +
      esc(corps + signature).replace(/\r?\n/g, '<br>') + '</div>';
    const id = randomUUID();
    const trace = (statut, erreur) => db.run(`INSERT INTO mail_sent (id, user_id, author, account_email, to_addr, cc, subject, body, attachments, prospect_id, status, error, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, id, req.user.id, req.user.name, c.email, a.join(', '), cc.join(', ') || null, sujet, corps,
      pieces.length ? JSON.stringify(pieces.map((p) => ({ nom: p.filename, taille: p.content.length }))) : null, ligne(b.prospectId, 80) || null, statut, erreur, now());
    let relaisUtilise = false;
    try {
      const message = { from: { name: c.display_name || req.user.name, address: c.email }, to: a, cc: cc.length ? cc : undefined, bcc: cci.length ? cci : undefined,
        subject: sujet, text: corps + signature, html, attachments: pieces };
      let info;
      if (c.smtp_host === 'oauth:google') info = await envoyerGmail(c, message);
      else {
        const voie = await chemin();
        relaisUtilise = !!voie.relais;
        info = voie.relais
          ? await viaRelais(voie.relais, c, dechiffrer(c.secret), { from: c.email, to: [...a, ...cc, ...cci], brut: await brutSmtp(message) })
          : await transport(options(c, dechiffrer(c.secret))).sendMail(message);
      }
      await trace('envoye', null);
      res.json({ ok: true, id, messageId: info && info.messageId });
    } catch (err) {
      const e = expliquer(err, relaisUtilise);
      await trace('echec', e.error);
      res.status(502).json({ error: e.error, reseau: e.reseau, lien: e.lien, lienTexte: e.lienTexte });
    }
  });

  return r;
}

// Un serveur d'envoi connu répond-il ? Résultat gardé 10 minutes.
let derniereSonde = null;
export function sondeSmtp() {
  if (derniereSonde && Date.now() - derniereSonde.at < 600000) return Promise.resolve(derniereSonde.ok);
  const essai = (host, port) => new Promise((ok) => {
    const s = net.connect({ host, port, timeout: 6000 });
    const fin = (v) => { s.destroy(); ok(v); };
    s.once('connect', () => fin(true)); s.once('timeout', () => fin(false)); s.once('error', () => fin(false));
  });
  return Promise.all([essai('smtp.gmail.com', 465), essai('smtp.hostinger.com', 465)])
    .then((v) => { derniereSonde = { at: Date.now(), ok: v.some(Boolean) }; return derniereSonde.ok; });
}
