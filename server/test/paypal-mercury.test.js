// Connexions PayPal (application REST : factures PayPal payables par compte ou par carte, paiements relevés) et Mercury
// (jeton d'API : soldes et virements reçus). Identifiants vérifiés, secrets chiffrés en base, jamais renvoyés au navigateur.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { testApp } from './helpers.js';

const JSONH = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
const PP_ID = 'AbCdEfGhIjKlMnOpQrStUvWxYz0123456789', PP_SECRET = 'EFgHiJkLmNoPqRsTuVwXyZ9876543210abcd';
const PP_SANS_FACTURATION = 'ZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz';
const MERCURY = 'secret-token:mercury_production_rma_' + 'x'.repeat(40);
let server, base, made, admin, marie;
const appels = [];
const payees = new Set();
let n = 0;

async function faux(url, o = {}) {
  const u = new URL(url), h = o.headers || {};
  const corps = o.body && String(o.body).startsWith('{') ? JSON.parse(o.body) : o.body;
  appels.push({ hote: u.host, methode: o.method || 'GET', chemin: u.pathname + u.search, corps, auth: h.Authorization });
  const json = (b, status = 200) => new Response(status === 204 ? null : JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } });

  if (u.host === 'api-m.paypal.com' || u.host === 'api-m.sandbox.paypal.com') {
    const mode = u.host === 'api-m.paypal.com' ? 'live' : 'sandbox';
    if (u.pathname === '/v1/oauth2/token') {
      const [id, secret] = Buffer.from(String(h.Authorization).replace('Basic ', ''), 'base64').toString().split(':');
      const ok = mode === 'sandbox' && secret === PP_SECRET && (id === PP_ID || id === PP_SANS_FACTURATION);
      return ok ? json({ access_token: 'A21-' + id.slice(0, 4), expires_in: 32400 }) : json({ error: 'invalid_client' }, 401);
    }
    if (!/^Bearer A21-/.test(h.Authorization)) return json({ message: 'non autorisé' }, 401);
    if (h.Authorization === 'Bearer A21-ZzZz') return json({ name: 'NOT_AUTHORIZED' }, 403);
    if (u.pathname === '/v2/invoicing/generate-next-invoice-number') return json({ invoice_number: '0001' });
    if (u.pathname === '/v2/invoicing/templates') return json({ templates: [{ template_info: { invoicer: { business_name: 'Blackstart AI' } } }] });
    if (u.pathname === '/v2/invoicing/invoices' && o.method === 'POST') return json({ id: 'INV2-' + ++n, status: 'DRAFT' }, 201);
    const m = u.pathname.match(/^\/v2\/invoicing\/invoices\/([^/]+)(\/send|\/cancel)?$/);
    if (m && m[2] === '/send') return json({ href: 'https://www.sandbox.paypal.com/invoice/p/#' + m[1], rel: 'payer-view', method: 'GET' });
    if (m && m[2] === '/cancel') return json(null, 204);
    if (m) return json(payees.has(m[1])
      ? { id: m[1], status: 'PAID', payments: { paid_amount: { currency_code: 'EUR', value: '600.00' }, transactions: [{ payment_date: '2026-10-21', payment_id: 'PAY-1' }] } }
      : { id: m[1], status: 'SENT', detail: { metadata: { recipient_view_url: 'https://www.sandbox.paypal.com/invoice/p/#' + m[1] } } });
    return json({ message: 'inconnu' }, 404);
  }

  if (u.host === 'api.mercury.com') {
    if (h.Authorization === 'Bearer secret-token:ip-non-autorisee-0000000000') return json({ errors: { message: 'IP not whitelisted' } }, 403);
    if (h.Authorization !== `Bearer ${MERCURY}`) return json({ errors: { message: 'unauthorized' } }, 401);
    if (u.pathname === '/api/v1/accounts') return json({ accounts: [
      { id: 'acc-1', accountNumber: '202512349012', routingNumber: '091311229', name: 'Mercury Checking ••9012', nickname: 'Compte courant', status: 'active', type: 'mercury', kind: 'checking', availableBalance: 15000.5, currentBalance: 15200.75, legalBusinessName: 'Blackstart AI LLC', dashboardLink: 'https://app.mercury.com/accounts/acc-1' },
      { id: 'acc-x', name: 'Banque externe', status: 'active', type: 'external', kind: 'externalAccount', availableBalance: 0, currentBalance: 0 },
    ] });
    if (u.pathname === '/api/v1/account/acc-1/transactions') return json({ total: 3, transactions: [
      { id: 'tx-1', amount: 1200, status: 'sent', kind: 'externalTransfer', counterpartyName: 'BOULANGERIE MARTIN', externalMemo: 'Facture F-2026-001', bankDescription: 'WIRE IN', postedAt: '2026-10-20T10:00:00Z', createdAt: '2026-10-20T09:00:00Z', dashboardLink: 'https://app.mercury.com/transactions/tx-1' },
      { id: 'tx-2', amount: -49.99, status: 'sent', kind: 'debitCardTransaction', counterpartyName: 'Notion', postedAt: '2026-10-19T10:00:00Z' },
      { id: 'tx-3', amount: 300, status: 'failed', kind: 'externalTransfer', counterpartyName: 'Rejeté', createdAt: '2026-10-18T10:00:00Z' },
    ] });
    return json({ errors: { message: 'not found' } }, 404);
  }
  return json({}, 404);
}
const call = (c, method, path, body) => fetch(base + path, { method, headers: { ...JSONH, Cookie: c }, body: body ? JSON.stringify(body) : undefined });

before(async () => {
  made = await testApp({ paiements: { fetch: faux } });
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Albino', email: 'albino@exemple.fr', password: 'motdepasse-solide-1' }) });
  admin = r.headers.get('set-cookie').split(';')[0];
  await call(admin, 'POST', '/api/users', { name: 'Marie', email: 'marie@exemple.fr', password: 'motdepasse-solide-2', role: 'membre' });
  const r0 = await fetch(base + '/api/auth/login', { method: 'POST', headers: JSONH, body: JSON.stringify({ email: 'marie@exemple.fr', password: 'motdepasse-solide-2' }) });
  marie = r0.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); await made.cleanup(); });

test('PayPal : connexion par un administrateur, identifiants vérifiés (compte réel puis bac à sable), secret chiffré', async () => {
  assert.equal((await call(marie, 'PUT', '/api/paiements/paypal', { clientId: PP_ID, secret: PP_SECRET })).status, 403);
  let r = await call(admin, 'PUT', '/api/paiements/paypal', { clientId: 'court', secret: PP_SECRET });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /Client ID/);
  r = await call(admin, 'PUT', '/api/paiements/paypal', { clientId: PP_ID, secret: 'Q'.repeat(36) });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /Identifiants PayPal refusés/);
  r = await call(admin, 'PUT', '/api/paiements/paypal', { clientId: PP_SANS_FACTURATION, secret: PP_SECRET });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /Invoicing/);
  appels.length = 0;
  r = await call(admin, 'PUT', '/api/paiements/paypal', { clientId: ' ' + PP_ID + ' ', secret: PP_SECRET });
  assert.deepEqual(await r.json(), { paypal: { connecte: true, compte: 'Blackstart AI', test: true } });
  assert.deepEqual(appels.filter((a) => a.chemin === '/v1/oauth2/token').map((a) => a.hote), ['api-m.paypal.com', 'api-m.sandbox.paypal.com'], 'compte réel essayé d’abord');
  const brut = (await made.db.get("SELECT value FROM settings WHERE key = 'paypal'")).value;
  assert.ok(!brut.includes(PP_SECRET), 'secret chiffré');
  const etat = await (await call(marie, 'GET', '/api/paiements/etat')).text();
  assert.ok(!etat.includes(PP_SECRET) && !etat.includes(PP_ID), 'ni secret ni identifiant renvoyés');
  assert.deepEqual(JSON.parse(etat).paypal, { connecte: true, compte: 'Blackstart AI', test: true });
});

test('PayPal : facture PayPal par facture du CRM, lien de paiement, ancienne annulée si le montant change', async () => {
  appels.length = 0;
  let r = await call(marie, 'POST', '/api/paiements/paypal/facture', { factureId: 'f1', numero: 'F-2026-001', client: 'Boulangerie Martin', email: 'compta@martin.fr', montant: 120000 });
  assert.equal(r.status, 200);
  const f = await r.json();
  assert.equal(f.id, 'INV2-1');
  assert.equal(f.url, 'https://www.sandbox.paypal.com/invoice/p/#INV2-1');
  const cree = appels.find((a) => a.chemin === '/v2/invoicing/invoices' && a.methode === 'POST').corps;
  assert.equal(cree.detail.currency_code, 'EUR');
  assert.equal(cree.detail.invoice_number, 'F-2026-001');
  assert.deepEqual(cree.items[0].unit_amount, { currency_code: 'EUR', value: '1200.00' });
  assert.equal(cree.primary_recipients[0].billing_info.email_address, 'compta@martin.fr');
  const envoi = appels.find((a) => a.chemin === '/v2/invoicing/invoices/INV2-1/send').corps;
  assert.deepEqual(envoi, { send_to_invoicer: false, send_to_recipient: false }, 'PayPal n’envoie pas de mail : le CRM transmet le lien');
  r = await call(marie, 'POST', '/api/paiements/paypal/facture', { factureId: 'f1', numero: 'F-2026-001', montant: 120000 });
  assert.equal((await r.json()).id, 'INV2-1', 'même montant : même facture PayPal');
  appels.length = 0;
  r = await call(marie, 'POST', '/api/paiements/paypal/facture', { factureId: 'f1', numero: 'F-2026-001', montant: 60000 });
  const f2 = await r.json();
  assert.equal(f2.id, 'INV2-2');
  assert.ok(appels.some((a) => a.chemin === '/v2/invoicing/invoices/INV2-1/cancel'), 'l’ancienne est annulée');
  assert.equal(appels.find((a) => a.chemin === '/v2/invoicing/invoices' && a.methode === 'POST').corps.detail.invoice_number, 'F-2026-001-2', 'numéro unique chez PayPal');
  assert.equal((await call(marie, 'POST', '/api/paiements/paypal/facture', { factureId: 'f2', montant: 50 })).status, 400);
});

test('PayPal : paiements relevés chez PayPal, facture marquée payée', async () => {
  let { factures } = await (await call(marie, 'GET', '/api/paiements/paypal/factures?verifier=1')).json();
  assert.equal(factures.f1.payee, undefined);
  assert.equal(factures.f1.statut, 'SENT');
  payees.add('INV2-2');
  ({ factures } = await (await call(marie, 'GET', '/api/paiements/paypal/factures?verifier=1')).json());
  assert.equal(factures.f1.payee, true);
  assert.equal(factures.f1.montantPaye, 60000);
  assert.equal(factures.f1.datePaiement, '2026-10-21');
});

test('Mercury : connexion par un administrateur, jeton vérifié et chiffré, messages clairs', async () => {
  assert.equal((await call(marie, 'PUT', '/api/paiements/mercury', { jeton: MERCURY })).status, 403);
  let r = await call(admin, 'PUT', '/api/paiements/mercury', { jeton: 'abc' });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /secret-token/);
  r = await call(admin, 'PUT', '/api/paiements/mercury', { jeton: 'secret-token:mauvais-jeton-0000000000000' });
  assert.match((await r.json()).error, /Jeton Mercury refusé/);
  r = await call(admin, 'PUT', '/api/paiements/mercury', { jeton: 'ip-non-autorisee-0000000000' });
  assert.match((await r.json()).error, /Lecture seule/);
  r = await call(admin, 'PUT', '/api/paiements/mercury', { jeton: MERCURY });
  assert.deepEqual(await r.json(), { mercury: { connecte: true, compte: 'Blackstart AI LLC' } });
  const brut = (await made.db.get("SELECT value FROM settings WHERE key = 'mercury'")).value;
  assert.ok(!brut.includes('mercury_production_rma'), 'jeton chiffré');
  assert.deepEqual((await (await call(marie, 'GET', '/api/paiements/etat')).json()).mercury, { connecte: true, compte: 'Blackstart AI LLC' });
});

test('Mercury : soldes et opérations (administrateur), numéros de compte jamais renvoyés en entier', async () => {
  assert.equal((await call(marie, 'GET', '/api/paiements/mercury')).status, 403, 'soldes réservés aux administrateurs');
  const r = await call(admin, 'GET', '/api/paiements/mercury');
  const txt = await r.text(), b = JSON.parse(txt);
  assert.ok(!txt.includes('202512349012') && !txt.includes('091311229'));
  assert.deepEqual(b.comptes, [{ id: 'acc-1', nom: 'Compte courant', type: 'checking', fin: '9012', solde: 15200.75, disponible: 15000.5, lien: 'https://app.mercury.com/accounts/acc-1' }]);
  assert.deepEqual(b.operations.map((o) => [o.id, o.montant, o.date]), [['tx-1', 1200, '2026-10-20'], ['tx-2', -49.99, '2026-10-19']], 'opérations échouées écartées');
  assert.equal(b.operations[0].libelle, 'BOULANGERIE MARTIN');
  assert.match(b.operations[0].detail, /F-2026-001/);
  const t = appels.find((a) => a.chemin.startsWith('/api/v1/account/acc-1/transactions'));
  assert.match(t.chemin, /start=\d{4}-\d{2}-\d{2}/);
  assert.ok(!appels.some((a) => a.chemin.startsWith('/api/v1/account/acc-x')), 'comptes externes ignorés');
});

test('déconnexion PayPal et Mercury', async () => {
  assert.equal((await call(marie, 'DELETE', '/api/paiements/paypal')).status, 403);
  await call(admin, 'DELETE', '/api/paiements/paypal');
  await call(admin, 'DELETE', '/api/paiements/mercury');
  const e = await (await call(admin, 'GET', '/api/paiements/etat')).json();
  assert.deepEqual([e.paypal, e.mercury], [{ connecte: false }, { connecte: false }]);
  assert.equal((await call(admin, 'GET', '/api/paiements/mercury')).status, 409);
  assert.equal((await call(marie, 'POST', '/api/paiements/paypal/facture', { factureId: 'f9', montant: 5000 })).status, 409);
});

test('le module Paiements branche PayPal et Mercury', () => {
  const js = readFileSync(new URL('../../app/modules/bs-encaissement.js', import.meta.url), 'utf8');
  assert.ok(js.includes('window.BS_PAYPAL_LINKS'));
  assert.ok(js.includes('/api/paiements/mercury'));
});
