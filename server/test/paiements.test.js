// Paiement en ligne (/api/paiements) : connexion Stripe par un administrateur (clé vérifiée, chiffrée), liens de
// paiement par facture au montant dû, paiements reçus relevés chez Stripe.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { testApp } from './helpers.js';
import { formulaire } from '../src/routes/paiements.js';

const JSONH = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
const CLE = 'sk_test_' + 'a'.repeat(30);
let server, base, made, admin, marie;
const appels = [];
let payees = new Set(), n = 0;
async function fauxStripe(url, o = {}) {
  const u = new URL(url), corps = o.body ? Object.fromEntries(new URLSearchParams(String(o.body))) : {};
  appels.push({ methode: o.method, chemin: u.pathname + u.search, corps, auth: o.headers.Authorization });
  const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } });
  if (o.headers.Authorization !== `Bearer ${CLE}`) return json({ error: { message: 'Invalid API Key' } }, 401);
  if (u.pathname === '/v1/account') return json({ id: 'acct_1', settings: { dashboard: { display_name: 'Blackstart AI' } } });
  if (u.pathname === '/v1/prices') return json({ id: 'price_' + ++n });
  if (u.pathname === '/v1/payment_links') return json({ id: 'plink_' + n, url: 'https://buy.stripe.com/test_' + n });
  if (u.pathname.startsWith('/v1/payment_links/')) return json({ id: u.pathname.split('/').pop(), active: false });
  if (u.pathname === '/v1/checkout/sessions') {
    const l = u.searchParams.get('payment_link');
    return json({ data: payees.has(l) ? [{ payment_status: 'paid', amount_total: 120000, created: 1760918400 }] : [{ payment_status: 'unpaid' }] });
  }
  return json({ error: { message: 'inconnu' } }, 404);
}
const call = (c, method, path, body) => fetch(base + path, { method, headers: { ...JSONH, Cookie: c }, body: body ? JSON.stringify(body) : undefined });

before(async () => {
  made = await testApp({ paiements: { fetch: fauxStripe } });
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Albino', email: 'albino@exemple.fr', password: 'motdepasse-solide-1' }) });
  admin = r.headers.get('set-cookie').split(';')[0];
  await call(admin, 'POST', '/api/users', { name: 'Marie', email: 'marie@exemple.fr', password: 'motdepasse-solide-2', role: 'membre' });
  const r0 = await fetch(base + '/api/auth/login', { method: 'POST', headers: JSONH, body: JSON.stringify({ email: 'marie@exemple.fr', password: 'motdepasse-solide-2' }) });
  marie = r0.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); await made.cleanup(); });

test('formulaire à la façon de Stripe', () => {
  assert.equal(formulaire({ a: 1, b: { c: [{ d: 'x' }] }, e: null }).toString(), 'a=1&b%5Bc%5D%5B0%5D%5Bd%5D=x');
});

test('connexion Stripe : administrateur seulement, clé vérifiée chez Stripe, chiffrée en base', async () => {
  assert.deepEqual((await (await call(marie, 'GET', '/api/paiements/etat')).json()), { admin: false, stripe: { connecte: false }, paypal: { connecte: false }, mercury: { connecte: false } });
  assert.equal((await call(marie, 'PUT', '/api/paiements/stripe', { cle: CLE })).status, 403);
  let r = await call(admin, 'PUT', '/api/paiements/stripe', { cle: 'pk_live_123' });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /sk_live_/);
  r = await call(admin, 'PUT', '/api/paiements/stripe', { cle: 'sk_test_' + 'b'.repeat(30) });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /Clé Stripe refusée/);
  r = await call(admin, 'PUT', '/api/paiements/stripe', { cle: CLE });
  assert.deepEqual(await r.json(), { stripe: { connecte: true, compte: 'Blackstart AI', test: true } });
  const brut = (await made.db.get("SELECT value FROM settings WHERE key = 'stripe'")).value;
  assert.ok(!brut.includes(CLE), 'clé chiffrée');
  assert.deepEqual((await (await call(marie, 'GET', '/api/paiements/etat')).json()).stripe, { connecte: true, compte: 'Blackstart AI', test: true });
});

test('lien de paiement par facture : créé une fois, recréé si le montant change', async () => {
  appels.length = 0;
  let r = await call(marie, 'POST', '/api/paiements/stripe/lien', { factureId: 'f1', numero: 'F-2026-001', client: 'Boulangerie Martin', montant: 120000 });
  assert.equal(r.status, 200);
  const l = await r.json();
  assert.equal(l.url, 'https://buy.stripe.com/test_1');
  const prix = appels.find((a) => a.chemin === '/v1/prices');
  assert.equal(prix.corps.unit_amount, '120000');
  assert.equal(prix.corps.currency, 'eur');
  assert.equal(prix.corps['product_data[name]'], 'Facture F-2026-001 · Boulangerie Martin');
  const pl = appels.find((a) => a.chemin === '/v1/payment_links');
  assert.equal(pl.corps['line_items[0][price]'], 'price_1');
  assert.equal(pl.corps['metadata[facture_id]'], 'f1');
  r = await call(marie, 'POST', '/api/paiements/stripe/lien', { factureId: 'f1', numero: 'F-2026-001', montant: 120000 });
  assert.equal((await r.json()).id, 'plink_1', 'même montant : même lien');
  appels.length = 0;
  r = await call(marie, 'POST', '/api/paiements/stripe/lien', { factureId: 'f1', numero: 'F-2026-001', montant: 60000 });
  assert.equal((await r.json()).id, 'plink_2');
  assert.ok(appels.some((a) => a.chemin === '/v1/payment_links/plink_1' && a.corps.active === 'false'), 'l’ancien lien est désactivé');
  assert.equal((await call(marie, 'POST', '/api/paiements/stripe/lien', { factureId: 'f2', montant: 10 })).status, 400);
});

test('paiements reçus : relevés chez Stripe, lien désactivé ensuite', async () => {
  payees.add('plink_2');
  const r = await call(marie, 'GET', '/api/paiements/stripe/liens?verifier=1');
  const { liens } = await r.json();
  assert.equal(liens.f1.payee, true);
  assert.equal(liens.f1.datePaiement, '2025-10-20');
  assert.ok(appels.some((a) => a.chemin === '/v1/payment_links/plink_2' && a.corps.active === 'false'));
});

test('accès : suit la rubrique Paiements ; déconnexion par un administrateur', async () => {
  const id = (await (await call(admin, 'GET', '/api/users')).json()).users.find((u) => u.email === 'marie@exemple.fr').id;
  await call(admin, 'PATCH', `/api/users/${id}`, { acces: ['today'] });
  assert.equal((await call(marie, 'GET', '/api/paiements/etat')).status, 403);
  assert.equal((await call(admin, 'DELETE', '/api/paiements/stripe')).status, 200);
  assert.deepEqual((await (await call(admin, 'GET', '/api/paiements/etat')).json()).stripe, { connecte: false });
  assert.deepEqual((await (await call(admin, 'GET', '/api/paiements/stripe/liens')).json()), { liens: {} });
});

test('le module de paiement en ligne remplit les liens des factures', () => {
  const js = readFileSync(new URL('../../app/modules/bs-encaissement.js', import.meta.url), 'utf8');
  assert.ok(js.includes('window.BS_PAY_LINKS = map'));
});
