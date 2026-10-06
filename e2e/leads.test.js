// Test de bout en bout du générateur de leads (rubrique « Nouveaux leads »), sur la version autonome.
// Les services publics (Recherche d'entreprises, geo.api.gouv.fr, OpenStreetMap) sont simulés avec leur format réel.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { assemble } from '../scripts/build.mjs';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser, dir, file;

before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-leads-'));
  file = join(dir, 'crm.html');
  writeFileSync(file, assemble());
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); rmSync(dir, { recursive: true, force: true }); });

// 60 plombiers lyonnais fictifs, 25 par page, au format de l'API Recherche d'entreprises.
const TOTAL = 60;
function entreprise(n) {
  const siren = String(800000000 + n);
  return {
    siren,
    nom_complet: n === 7 ? '[NON-DIFFUSIBLE]' : `PLOMBERIE ${n} DU RHONE`,
    activite_principale: '43.22A',
    date_creation: n % 5 ? '2012-03-01' : `${new Date().getFullYear()}-01-15`,
    tranche_effectif_salarie: n % 3 ? '02' : 'NN',
    nombre_etablissements_ouverts: 1,
    complements: { est_entrepreneur_individuel: false },
    dirigeants: [{ nom: 'MARTIN', prenoms: 'JEAN PIERRE', qualite: 'Gérant', type_dirigeant: 'personne physique' }],
    siege: { siret: siren + '00011' },
    matching_etablissements: [{
      siret: siren + '00011', etat_administratif: 'A', adresse: `${n} RUE GARIBALDI 69003 LYON 3EME`, code_postal: '69003',
      libelle_commune: 'LYON 3EME', latitude: String(45.76 + n / 10000), longitude: String(4.85 + n / 10000), activite_principale: '43.22A',
      liste_enseignes: n === 1 ? ['PLOMBERIE EXPRESS'] : null, date_creation: n % 5 ? '2012-03-01' : `${new Date().getFullYear()}-01-15`,
    }],
  };
}

test('génère des lots toujours nouveaux, sans doublon, et les ajoute au CRM', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  const recherches = [];
  await page.route('https://recherche-entreprises.api.gouv.fr/**', (route) => {
    const u = new URL(route.request().url());
    recherches.push(u);
    const p = +u.searchParams.get('page'), per = +u.searchParams.get('per_page');
    const results = [];
    for (let n = (p - 1) * per + 1; n <= Math.min(TOTAL, p * per); n++) results.push(entreprise(n));
    route.fulfill({ headers: cors, body: JSON.stringify({ results, total_results: TOTAL, page: p, per_page: per, total_pages: Math.ceil(TOTAL / per) }) });
  });
  await page.route('https://geo.api.gouv.fr/**', (route) => route.fulfill({ headers: cors, body: JSON.stringify([
    { nom: 'Lyon', code: '69123', codesPostaux: ['69001', '69002', '69003'], codeDepartement: '69', centre: { type: 'Point', coordinates: [4.835, 45.758] } },
  ]) }));
  await page.route('https://overpass-api.de/**', (route) => route.fulfill({ headers: cors, body: JSON.stringify({ elements: [
    { type: 'node', lat: 45.7601, lon: 4.8501, tags: { name: 'Plomberie Express', phone: '+33 4 78 00 00 01', website: 'plomberie-express.fr' } },
    { type: 'node', lat: 45.7602, lon: 4.8502, tags: { name: 'Boulangerie Voisine', phone: '+33 4 78 99 99 99' } },
  ] }) }));

  await page.goto(pathToFileURL(file).href);
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.evaluate(() => document.getElementById('splash')?.remove());
  // Un plombier déjà au CRM (même SIRET) : il ne doit jamais être proposé.
  await page.evaluate(() => window.__bsStore.set((s) => ({ prospects: [{ id: 'deja', entreprise: 'Déjà client', siret: '80000000300011', ville: 'Lyon', statut: 'client_signe', events: [], tags: [] }, ...s.prospects] })));
  await page.evaluate(() => { location.hash = '#/leads'; });
  await page.locator('.bsl-root .page-title').waitFor();

  await page.getByRole('tab', { name: 'Artisans / BTP' }).click();
  await page.selectOption('select[name=metier]', 'plombier');
  await page.fill('input[name=zone]', 'Lyon');
  await page.locator('input[name=zone]').dispatchEvent('change');
  await page.locator('button[data-act=gen]').first().click();
  await page.locator('.bsl-card[data-i="11"]').waitFor();

  const q = recherches[0].searchParams;
  assert.equal(q.get('activite_principale'), '43.22A,43.22B');
  assert.equal(q.get('etat_administratif'), 'A');
  assert.equal(q.get('code_postal'), '69001,69002,69003');

  const sirens = () => page.evaluate(() => Array.from(document.querySelectorAll('.bsl-card a[href*="annuaire-entreprises"]')).map((a) => a.href.split('/').pop()));
  const lot1 = await sirens();
  assert.equal(lot1.length, 12);
  assert.ok(!lot1.includes('800000003'), 'déjà au CRM');
  assert.ok(!lot1.includes('800000007'), 'non diffusible');

  // Coordonnées OpenStreetMap : seulement pour l'entreprise dont le nom correspond.
  await page.waitForFunction(() => !document.querySelector('.bsl-wait'));
  const carte1 = page.locator('.bsl-card', { hasText: 'Plomberie Express' });
  await carte1.locator('a[href^="tel:"]').waitFor();
  assert.match(await carte1.innerText(), /plomberie-express\.fr/);
  assert.equal(await page.locator('a[href*="78 99 99 99"], a[href="tel:+33478999999"]').count(), 0);
  assert.ok(await page.locator('.bsl-none').count() >= 10);

  // Deuxième et troisième lots : jamais un lead déjà proposé.
  await page.locator('.bsl-more button[data-act=gen]').click();
  await page.waitForFunction((prev) => {
    const s = Array.from(document.querySelectorAll('.bsl-card a[href*="annuaire-entreprises"]')).map((a) => a.href.split('/').pop());
    return s.length && !s.includes(prev);
  }, lot1[0]);
  const lot2 = await sirens();
  assert.equal(lot2.length, 12);
  assert.equal(lot2.filter((s) => lot1.includes(s)).length, 0);

  // Ajout au CRM : prospect « À appeler », avec SIRET, dirigeant et relance du jour.
  await page.locator('.bsl-card[data-i="0"] button[data-add]').click();
  await page.locator('.bsl-card[data-i="0"] .bsl-ok').waitFor();
  const ajoute = await page.evaluate((siren) => window.__bsStore.get().prospects.find((p) => String(p.siret).startsWith(siren)), lot2[0]);
  assert.ok(ajoute);
  assert.equal(ajoute.canal, 'Générateur de leads');
  assert.equal(ajoute.statut, 'a_appeler');
  assert.equal(ajoute.contact, 'Jean Martin');
  assert.equal(ajoute.secteur, 'Artisans / BTP');
  assert.ok(ajoute.prochaineRelance);

  // Tout ajouter : les 11 autres, sans doublon.
  await page.locator('button[data-act=all]').click();
  const n = await page.evaluate(() => window.__bsStore.get().prospects.filter((p) => p.canal === 'Générateur de leads').length);
  assert.equal(n, 12);

  // Lot suivant puis épuisement : 60 - 1 au CRM - 1 non diffusible = 58 leads, puis le message de fin.
  const vus = new Set([...lot1, ...lot2]);
  for (let i = 0; i < 4; i++) {
    await page.locator('.bsl-more button[data-act=gen]').click();
    await page.waitForFunction(() => !document.querySelector('.bsl-gen [class=bsl-spin]') && !document.querySelector('.bsl-list.busy'));
    await page.waitForTimeout(200);
    const lotN = await sirens();
    for (const s of lotN) { assert.ok(!vus.has(s), 'lead déjà proposé : ' + s); vus.add(s); }
    if (await page.getByText('Revoir les leads déjà proposés').count()) break;
  }
  assert.equal(vus.size, 58);
  await page.getByText('Revoir les leads déjà proposés').waitFor();

  // Mobile : pas de défilement horizontal.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  assert.deepEqual(errors, []);
  await ctx.close();
});
