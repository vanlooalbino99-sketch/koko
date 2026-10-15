// Rubrique Mail : boîtes connectées (mot de passe chiffré), envoi avec pièces jointes, Gmail par Google (OAuth),
// relais d'envoi Cloudflare pour les boîtes pro quand l'hébergeur bloque l'envoi de mails (SMTP).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { testApp } from './helpers.js';

// ---------------------------------------------------------------- faux serveur SMTP (pour le relais)
function fauxSmtp({ user = 'contact@exemple.fr', pass = 'secret-boite' } = {}) {
  const recus = [];
  const server = net.createServer((s) => {
    let tampon = '', data = false, corps = '';
    s.write('220 faux.smtp ESMTP\r\n');
    s.on('data', (d) => {
      tampon += d.toString('latin1');
      for (;;) {
        if (data) {
          const i = tampon.indexOf('\r\n.\r\n');
          if (i < 0) return;
          corps = tampon.slice(0, i + 2); tampon = tampon.slice(i + 5); data = false;
          recus.push({ corps });
          s.write('250 OK queued\r\n');
          continue;
        }
        const i = tampon.indexOf('\r\n');
        if (i < 0) return;
        const l = tampon.slice(0, i); tampon = tampon.slice(i + 2);
        if (/^EHLO/i.test(l)) s.write('250-faux.smtp\r\n250-AUTH PLAIN LOGIN\r\n250 8BITMIME\r\n');
        else if (/^AUTH PLAIN /i.test(l)) {
          const [, u, p] = Buffer.from(l.slice(11), 'base64').toString('utf8').split('\u0000');
          s.write(u === user && p === pass ? '235 Authentifié\r\n' : '535 5.7.8 Mauvais identifiants\r\n');
        } else if (/^MAIL FROM/i.test(l)) { recus.from = l; s.write('250 OK\r\n'); }
        else if (/^RCPT TO/i.test(l)) { (recus.rcpt ||= []).push(l); s.write('250 OK\r\n'); }
        else if (/^DATA/i.test(l)) { data = true; s.write('354 Go\r\n'); }
        else if (/^QUIT/i.test(l)) { s.end('221 Bye\r\n'); }
        else s.write('500 ?\r\n');
      }
    });
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok({ server, port: server.address().port, recus })));
}
// connect() de Cloudflare imité avec un socket Node (sans TLS : seul le dialogue SMTP est testé).
function ouvrirLocal(port) {
  return () => {
    const sock = net.connect(port, '127.0.0.1');
    let ctrl = null; const attente = [];
    sock.on('data', (d) => (ctrl ? ctrl.enqueue(new Uint8Array(d)) : attente.push(d)));
    sock.on('end', () => { try { ctrl && ctrl.close(); } catch { /* déjà fermé */ } });
    const faire = () => ({
      readable: new ReadableStream({ start(c) { ctrl = c; while (attente.length) c.enqueue(new Uint8Array(attente.shift())); } }),
      writable: new WritableStream({ write(chunk) { return new Promise((ok) => sock.write(Buffer.from(chunk), ok)); } }),
      startTls() { ctrl = null; return faire(); },
      close() { sock.end(); },
    });
    return faire();
  };
}
// Le Worker tel qu'envoyé à Cloudflare, avec connect() remplacé par le socket local.
async function chargerWorker() {
  const src = readFileSync(new URL('../src/relais-worker.js', import.meta.url), 'utf8')
    .replace("import { connect } from 'cloudflare:sockets';", 'const connect = (...a) => globalThis.__ouvrir(...a);');
  const f = join(mkdtempSync(join(tmpdir(), 'bs-relais-')), 'relais.mjs');
  writeFileSync(f, src);
  return (await import(f)).default;
}

let server, base, made, admin, smtp, worker;
const appels = { transport: [], fetch: [] };
let sondeOk = true;
const reseau = {};
const JSONH = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
const h = (c) => ({ ...JSONH, Cookie: c });
const call = (c, method, path, body) => fetch(base + path, { method, headers: h(c), redirect: 'manual', body: body === undefined ? undefined : JSON.stringify(body) });

// Faux fetch : Google, Gmail, Cloudflare et le relais (qui appelle le vrai code du Worker).
async function fauxFetch(url, o = {}) {
  url = String(url);
  appels.fetch.push({ url, o });
  const rep = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } });
  if (url === 'https://oauth2.googleapis.com/token') {
    const p = new URLSearchParams(String(o.body));
    if (p.get('grant_type') === 'authorization_code') return rep({ access_token: 'acc-1', refresh_token: 'refresh-1', expires_in: 3600, scope: 'openid email https://www.googleapis.com/auth/gmail.send' });
    return rep({ access_token: 'acc-2', expires_in: 3600 });
  }
  if (url === 'https://openidconnect.googleapis.com/v1/userinfo') return rep({ email: 'albino@gmail.com', name: 'Albino' });
  if (url.startsWith('https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send')) { reseau.gmail = Buffer.from(o.body).toString('utf8'); return rep({ id: 'gm-1' }); }
  if (url.startsWith('https://api.cloudflare.com/client/v4')) {
    const chemin = url.slice('https://api.cloudflare.com/client/v4'.length);
    if (o.headers.Authorization !== 'Bearer jeton-cloudflare-valide-123456') return rep({ success: false, errors: [{ message: 'Invalid token' }] }, 403);
    if (chemin.startsWith('/accounts?')) return rep({ success: true, result: [{ id: 'acc123', name: 'Albino' }] });
    if (chemin.endsWith('/workers/subdomain') && o.method === 'GET') return rep({ success: false, errors: [{ message: 'not found' }] }, 404);
    if (chemin.endsWith('/workers/subdomain') && o.method === 'PUT') return rep({ success: true, result: { subdomain: JSON.parse(o.body).subdomain } });
    if (chemin.includes('/workers/scripts/blackstart-relais-mail') && o.method === 'PUT') {
      const meta = JSON.parse(await o.body.get('metadata').text());
      reseau.secretRelais = meta.bindings[0].text;
      reseau.source = await o.body.get('relais.js').text();
      return rep({ success: true, result: {} });
    }
    if (chemin.endsWith('/subdomain') && o.method === 'POST') return rep({ success: true, result: {} });
    return rep({ success: false, errors: [{ message: 'inconnu ' + chemin }] }, 404);
  }
  if (url.includes('.workers.dev/')) {
    globalThis.__ouvrir = ouvrirLocal(smtp.port);
    return worker.fetch(new Request(url, { method: 'POST', headers: o.headers, body: o.body }), { RELAIS_SECRET: reseau.secretRelais });
  }
  throw new Error('fetch inattendu ' + url);
}
const fauxTransport = (opts) => ({
  async verify() { if (opts.auth.pass !== 'bon-mot-de-passe') throw Object.assign(new Error('Invalid login'), { code: 'EAUTH' }); return true; },
  async sendMail(m) { appels.transport.push({ opts, m }); return { messageId: '<x@y>' }; },
});

before(async () => {
  smtp = await fauxSmtp();
  worker = await chargerWorker();
  made = await testApp({ mail: { transport: fauxTransport, sonde: async () => sondeOk, fetch: fauxFetch } });
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Albino', email: 'albino@exemple.fr', password: 'motdepasse-solide-1' }) });
  admin = r.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); smtp.server.close(); await made.cleanup(); });

test('Hostinger : la boîte se connecte, le mot de passe est chiffré, le mail part avec ses pièces jointes', async () => {
  let r = await call(admin, 'POST', '/api/mail/comptes', { fournisseur: 'hostinger', email: 'contact@blackstart.fr', motDePasse: 'mauvais', nom: 'Albino' });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /mot de passe refusé/);
  r = await call(admin, 'POST', '/api/mail/comptes', { fournisseur: 'hostinger', email: 'Contact@Blackstart.fr', motDePasse: 'bon-mot-de-passe', nom: 'Albino' });
  assert.equal(r.status, 201);
  const { compte, verifie } = await r.json();
  assert.equal(verifie, true);
  assert.equal(compte.email, 'contact@blackstart.fr');
  assert.equal(compte.serveur, 'smtp.hostinger.com');
  const brut = await made.db.get('SELECT secret FROM mail_accounts WHERE id = ?', compte.id);
  assert.ok(!brut.secret.includes('bon-mot-de-passe'), 'mot de passe chiffré en base');
  assert.equal((await call(admin, 'POST', '/api/mail/comptes', { fournisseur: 'hostinger', email: 'contact@blackstart.fr', motDePasse: 'bon-mot-de-passe' })).status, 409);

  r = await call(admin, 'POST', '/api/mail/envoyer', { compte: compte.id, a: 'client@exemple.com, autre@exemple.com', sujet: 'Votre devis', texte: 'Bonjour,\nVoici le devis.',
    pieces: [{ nom: 'Devis D-001.pdf', type: 'application/pdf', data: Buffer.from('%PDF-1.4 faux').toString('base64') }] });
  assert.equal(r.status, 200);
  const envoi = appels.transport.at(-1);
  assert.equal(envoi.opts.host, 'smtp.hostinger.com');
  assert.equal(envoi.opts.auth.pass, 'bon-mot-de-passe');
  assert.deepEqual(envoi.m.to, ['client@exemple.com', 'autre@exemple.com']);
  assert.equal(envoi.m.attachments[0].filename, 'Devis D-001.pdf');
  assert.equal(envoi.m.from.address, 'contact@blackstart.fr');
  const liste = (await (await call(admin, 'GET', '/api/mail/envoyes')).json()).envoyes;
  assert.equal(liste[0].sujet, 'Votre devis');
  assert.equal(liste[0].statut, 'envoye');
  assert.deepEqual(liste[0].pieces, [{ nom: 'Devis D-001.pdf', taille: 13 }]);
  // Refus clairs.
  assert.equal((await call(admin, 'POST', '/api/mail/envoyer', { compte: compte.id, a: 'pas-une-adresse', sujet: 'x' })).status, 400);
  assert.equal((await call(admin, 'POST', '/api/mail/envoyer', { compte: compte.id, a: 'a@b.fr', sujet: '' })).status, 400);
});

test('Gmail : « Se connecter avec Google », puis envoi par l’API Gmail (sans SMTP)', async () => {
  let g = await (await call(admin, 'GET', '/api/mail/google')).json();
  assert.equal(g.pret, false);
  assert.match(g.retour, /\/api\/mail\/google\/retour$/);
  assert.equal((await call(admin, 'PUT', '/api/mail/google', { clientId: 'pas-bon', clientSecret: 'x' })).status, 400);
  assert.equal((await call(admin, 'PUT', '/api/mail/google', { clientId: '123-abc.apps.googleusercontent.com', clientSecret: 'GOCSPX-secret-du-client' })).status, 200);
  g = await (await call(admin, 'GET', '/api/mail/google')).json();
  assert.equal(g.pret, true);
  let r = await call(admin, 'GET', '/api/mail/google/debut');
  assert.equal(r.status, 302);
  const vers = new URL(r.headers.get('location'));
  assert.equal(vers.host, 'accounts.google.com');
  assert.match(vers.searchParams.get('scope'), /gmail\.send/);
  assert.equal(vers.searchParams.get('access_type'), 'offline');
  // Mauvais état : refusé.
  r = await call(admin, 'GET', '/api/mail/google/retour?code=abc&state=faux');
  assert.match(r.headers.get('location'), /mail=expire/);
  r = await call(admin, 'GET', `/api/mail/google/retour?code=abc&state=${vers.searchParams.get('state')}`);
  assert.match(r.headers.get('location'), /mail=ok/);
  const comptes = (await (await call(admin, 'GET', '/api/mail/comptes')).json()).comptes;
  const gm = comptes.find((c) => c.email === 'albino@gmail.com');
  assert.ok(gm && gm.google);
  sondeOk = false; // même si l'hébergeur bloque l'envoi classique
  r = await call(admin, 'POST', '/api/mail/envoyer', { compte: gm.id, a: 'client@exemple.com', sujet: 'Facture F-002', texte: 'Merci !',
    pieces: [{ nom: 'Facture.pdf', type: 'application/pdf', data: Buffer.from('PDF').toString('base64') }] });
  assert.equal(r.status, 200, JSON.stringify(await r.clone().json()));
  assert.match(reseau.gmail, /Subject: Facture F-002/);
  assert.match(reseau.gmail, /Facture\.pdf/);
  sondeOk = true;
});

test("relais Cloudflare : le CRM l'installe avec un jeton, puis les boîtes pro envoient par lui", async () => {
  sondeOk = false; // Railway bloque l'envoi classique
  assert.equal((await (await call(admin, 'GET', '/api/mail/reseau')).json()).relais, false);
  let r = await call(admin, 'PUT', '/api/mail/relais', { jeton: 'jeton-faux-mais-assez-long' });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /Jeton Cloudflare refusé/);
  r = await call(admin, 'PUT', '/api/mail/relais', { jeton: 'jeton-cloudflare-valide-123456' });
  assert.equal(r.status, 200);
  assert.match((await r.json()).adresse, /^blackstart-relais-mail\.blackstart-[0-9a-f]{6}\.workers\.dev$/);
  assert.equal(reseau.source, readFileSync(new URL('../src/relais-worker.js', import.meta.url), 'utf8'), 'le Worker envoyé est le fichier du dépôt');
  assert.equal((await (await call(admin, 'GET', '/api/mail/relais')).json()).pret, true);

  // Connexion d'une boîte OVH par le relais (le faux serveur SMTP joue OVH).
  r = await call(admin, 'POST', '/api/mail/comptes', { fournisseur: 'autre', email: 'contact@exemple.fr', motDePasse: 'mauvais', serveur: 'ssl0.ovh.net', port: 465 });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /mot de passe refusé/);
  r = await call(admin, 'POST', '/api/mail/comptes', { fournisseur: 'autre', email: 'contact@exemple.fr', motDePasse: 'secret-boite', serveur: 'ssl0.ovh.net', port: 465 });
  assert.equal(r.status, 201);
  const { compte, verifie } = await r.json();
  assert.equal(verifie, true);
  r = await call(admin, 'POST', '/api/mail/envoyer', { compte: compte.id, a: 'client@exemple.com', cc: 'associe@exemple.com', sujet: 'Devis été', texte: 'Bonjour,\n.ligne qui commence par un point\nÀ bientôt',
    pieces: [{ nom: 'devis.pdf', type: 'application/pdf', data: Buffer.alloc(3000, 7).toString('base64') }] });
  assert.equal(r.status, 200, JSON.stringify(await r.clone().json()));
  const recu = smtp.recus.at(-1).corps;
  assert.match(smtp.recus.from, /MAIL FROM:<contact@exemple\.fr>/);
  assert.deepEqual(smtp.recus.rcpt, ['RCPT TO:<client@exemple.com>', 'RCPT TO:<associe@exemple.com>']);
  assert.match(recu, /Subject: =\?UTF-8\?Q\?Devis_=C3=A9t=C3=A9\?=/);
  assert.match(recu, /filename=devis\.pdf/);
  assert.ok(!/\r\n\.[^.]/.test(recu), 'les points en début de ligne sont doublés');
  sondeOk = true;
});

test('la rubrique Mail suit les accès choisis par l’administrateur', async () => {
  await call(admin, 'POST', '/api/users', { name: 'Marie', email: 'marie@exemple.fr', password: 'motdepasse-solide-2', role: 'membre' });
  const id = (await (await call(admin, 'GET', '/api/users')).json()).users.find((u) => u.email === 'marie@exemple.fr').id;
  await call(admin, 'PATCH', `/api/users/${id}`, { acces: ['today'] });
  const r0 = await fetch(base + '/api/auth/login', { method: 'POST', headers: JSONH, body: JSON.stringify({ email: 'marie@exemple.fr', password: 'motdepasse-solide-2' }) });
  const marie = r0.headers.get('set-cookie').split(';')[0];
  assert.equal((await call(marie, 'GET', '/api/mail/comptes')).status, 403);
  await call(admin, 'PATCH', `/api/users/${id}`, { acces: ['today', 'mail'] });
  const r = await call(marie, 'GET', '/api/mail/comptes');
  assert.equal(r.status, 200);
  assert.deepEqual((await r.json()).comptes, [], 'chacun ne voit que ses boîtes');
  assert.equal((await call(marie, 'PUT', '/api/mail/google', { clientId: 'a.apps.googleusercontent.com', clientSecret: 'xxxxxxxxxxxx' })).status, 403);
});
