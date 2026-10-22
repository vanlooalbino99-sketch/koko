// Page Paiements dans le vrai CRM, avec un faux PayPal et un faux Mercury : connexion du compte PayPal, facture PayPal
// d'une facture (lien sur la facture), paiement relevé chez PayPal ; connexion Mercury, soldes, virement reçu rapproché
// de la bonne facture et marqué payé d'un clic.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createApp } from '../server/src/app.js';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SHOTS = process.env.BS_SHOTS || '';
const PP_ID = 'AbCdEfGhIjKlMnOpQrStUvWxYz0123456789', PP_SECRET = 'EFgHiJkLmNoPqRsTuVwXyZ9876543210abcd';
const MERCURY = 'secret-token:mercury_production_rma_' + 'x'.repeat(40);
let server, base, dir, db, hub, browser, page;
const payees = new Set();
let virement = null, n = 0;

async function faux(url, o = {}) {
  const u = new URL(url), h = o.headers || {};
  const json = (b, status = 200) => new Response(status === 204 ? null : JSON.stringify(b), { status, headers: { 'Content-Type': 'application/json' } });
  if (u.host === 'api-m.paypal.com') return json({ error: 'invalid_client' }, 401);
  if (u.host === 'api-m.sandbox.paypal.com') {
    if (u.pathname === '/v1/oauth2/token') return json({ access_token: 'A21-test', expires_in: 32400 });
    if (u.pathname === '/v2/invoicing/generate-next-invoice-number') return json({ invoice_number: '0001' });
    if (u.pathname === '/v2/invoicing/templates') return json({ templates: [{ template_info: { invoicer: { business_name: 'Blackstart AI' } } }] });
    if (u.pathname === '/v2/invoicing/invoices') return json({ id: 'INV2-' + ++n }, 201);
    const m = u.pathname.match(/^\/v2\/invoicing\/invoices\/([^/]+)(\/send)?$/);
    if (m && m[2]) return json({ href: 'https://www.sandbox.paypal.com/invoice/p/#' + m[1], rel: 'payer-view' });
    if (m) return json(payees.has(m[1]) ? { id: m[1], status: 'PAID', payments: { paid_amount: { value: '1.00' }, transactions: [{ payment_date: '2026-10-21' }] } } : { id: m[1], status: 'SENT' });
  }
  if (u.host === 'api.mercury.com') {
    if (h.Authorization !== `Bearer ${MERCURY}`) return json({ errors: { message: 'unauthorized' } }, 401);
    if (u.pathname === '/api/v1/accounts') return json({ accounts: [{ id: 'acc-1', accountNumber: '202512349012', name: 'Mercury Checking', nickname: 'Compte courant', status: 'active', type: 'mercury', kind: 'checking', availableBalance: 15000.5, currentBalance: 15200.75, legalBusinessName: 'Blackstart AI LLC', dashboardLink: 'https://app.mercury.com/accounts/acc-1' }] });
    if (u.pathname === '/api/v1/account/acc-1/transactions') return json({ transactions: [
      virement,
      { id: 'tx-autre', amount: 250, status: 'sent', kind: 'externalTransfer', counterpartyName: 'INCONNU SARL', postedAt: '2026-10-19T10:00:00Z' },
      { id: 'tx-sortie', amount: -49.99, status: 'sent', kind: 'debitCardTransaction', counterpartyName: 'Notion', postedAt: '2026-10-18T10:00:00Z' },
    ].filter(Boolean) });
  }
  return json({ message: 'inconnu' }, 404);
}

before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-pay-'));
  const made = await createApp({ dataDir: dir, paiements: { fetch: faux } });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
  page = await (await browser.newContext({ viewport: { width: 1440, height: 1100 } })).newPage();
  await page.goto(base + '/');
  await page.fill('input[name=name]', 'Vanloo Albino');
  await page.fill('input[name=email]', 'albino@exemple.fr');
  await page.fill('input[name=password]', 'motdepasse1');
  await page.click('button[type=submit]');
  await page.waitForURL(base + '/');
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.getByText('Charger la démo').first().click();
  await page.waitForFunction(() => window.__bsStore.get().factures.some((f) => f.statut === 'a_payer'));
  await page.evaluate(() => { const s = document.getElementById('splash'); if (s) s.remove(); });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

const facture = (id) => page.evaluate((i) => window.__bsStore.get().factures.find((f) => f.id === i), id);

test('PayPal : compte connecté, facture PayPal sur la facture, paiement relevé tout seul', async () => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.evaluate(() => { location.hash = '#/payments'; });
  await page.waitForSelector('form[data-form=paypal]');
  await page.fill('form[data-form=paypal] input[name=clientId]', PP_ID);
  await page.fill('form[data-form=paypal] input[name=secret]', PP_SECRET);
  await page.click('form[data-form=paypal] button[type=submit]');
  await page.waitForSelector('[data-act="verifier:paypal"]');
  assert.match(await page.textContent('.bsenc-msg'), /PayPal est connecté en bac à sable/);
  assert.match(await page.textContent('.bsenc'), /Compte : Blackstart AI/);

  const id = await page.getAttribute('[data-creer^="paypal:"]', 'data-creer').then((v) => v.slice(7));
  await page.click(`[data-creer="paypal:${id}"]`);
  await page.waitForSelector(`[data-copier="paypal:${id}"]`);
  const liens = await page.evaluate((i) => [window.BS_PAYPAL_LINKS[i], window.BS_PAY_LINKS[i]], id);
  assert.match(liens[0], /^https:\/\/www\.sandbox\.paypal\.com\/invoice\/p\/#INV2-/);
  assert.equal(liens[1], liens[0], 'sans Stripe, le lien PayPal est le lien de paiement de la facture (aperçu, QR code, mail)');
  if (SHOTS) await page.screenshot({ path: join(SHOTS, 'paypal-connecte.png'), fullPage: true });

  payees.add(liens[0].split('#')[1]);
  await page.click('[data-act="verifier:paypal"]');
  await page.waitForFunction((i) => window.__bsStore.get().factures.find((f) => f.id === i).statut === 'payee', id);
  const f = await facture(id);
  assert.equal(f.moyenPaiement, 'PayPal');
  assert.equal(f.datePaiement, '2026-10-21');
  assert.match(await page.textContent('.bsenc-msg'), /Paiement reçu sur PayPal/);
  assert.deepEqual(errors, []);
});

test('Mercury : soldes, virement reçu rapproché de la bonne facture, marqué payé d’un clic', async () => {
  const cible = await page.evaluate(() => {
    const R = window.bsEncaissement;
    const f = window.__bsStore.get().factures.find((x) => x.statut === 'a_payer' && x.numero);
    return { id: f.id, numero: f.numero, montant: R.reste(f) / 100 };
  });
  virement = { id: 'tx-1', amount: cible.montant, status: 'sent', kind: 'externalTransfer', counterpartyName: 'CLIENT SAS', externalMemo: 'Reglement ' + cible.numero, postedAt: '2026-10-20T10:00:00Z', dashboardLink: 'https://app.mercury.com/transactions/tx-1' };
  await page.fill('form[data-form=mercury] input[name=jeton]', MERCURY);
  await page.click('form[data-form=mercury] button[type=submit]');
  await page.waitForSelector('.bsenc-solde');
  assert.match(await page.textContent('.bsenc-solde'), /15\s?200,75\s\$/);
  assert.match(await page.textContent('.bsenc-solde'), /Compte courant ••9012/);
  assert.equal(await page.locator('[data-op]').count(), 2, 'seuls les virements reçus sont listés');
  const ligne = page.locator('[data-op="tx-1"]');
  assert.equal(await ligne.locator('select').inputValue(), cible.id, 'la bonne facture est proposée');
  assert.match(await ligne.textContent(), /numéro de facture trouvé/);
  assert.equal(await page.locator('[data-op="tx-autre"] select').inputValue(), '', 'pas de facture devinée sans indice');
  if (SHOTS) await page.screenshot({ path: join(SHOTS, 'mercury-connecte.png'), fullPage: true });

  await ligne.locator('[data-rapprocher]').click();
  const f = await facture(cible.id);
  assert.equal(f.statut, 'payee');
  assert.equal(f.moyenPaiement, 'Virement (Mercury)');
  assert.equal(f.datePaiement, '2026-10-20');
  assert.equal(f.mercuryTx, 'tx-1');
  await page.waitForSelector('[data-op="tx-1"]', { state: 'detached' });
  assert.match(await page.textContent('.bsenc-msg'), /marquée payée \(virement Mercury/);
  const brut = await db.get("SELECT value FROM settings WHERE key = 'mercury'");
  assert.ok(!brut.value.includes('mercury_production_rma'), 'jeton chiffré en base');
});
