// Rubrique Analyse › Marché dans le vrai CRM, avec la base Sirene, geo.api.gouv.fr et le BODACC simulés : potentiel
// par métier classé (chiffres officiels × résultats du CRM), « Prospecter » vers le générateur de leads, nouvelles
// entreprises ajoutées au CRM, concurrence de la zone.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createApp } from '../server/src/app.js';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SHOTS = process.env.BS_SHOTS || '';
const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
let server, base, dir, db, hub, browser, page;
const sirene = [], bodacc = [];

// Nombre d'entreprises simulé par code d'activité (les restaurants dominent, les dentistes sont rares).
const TOTAUX = { '56.10A': 2400, '43.22A,43.22B': 900, '68.31Z': 650, '86.23Z': 120, '73.11Z': 310, '62.01Z': 520, '62.02A': 140, '82.20Z': 25, '70.22Z': 1900, '73.20Z': 60 };
function sireneRoute(route) {
  const u = new URL(route.request().url()), naf = u.searchParams.get('activite_principale');
  sirene.push(Object.fromEntries(u.searchParams));
  const etablis = !!u.searchParams.get('tranche_effectif_salarie');
  const total = Math.round((TOTAUX[naf] ?? 40) / (etablis ? 10 : 1));
  const results = +u.searchParams.get('per_page') > 1 ? [
    { siren: '512345678', nom_complet: 'AGENCE LUMIERE', date_creation: '2009-03-01', siege: { libelle_commune: 'LYON', tranche_effectif_salarie: '12' } },
    { siren: '523456789', nom_complet: 'PIXEL & CO', date_creation: '2015-06-01', siege: { libelle_commune: 'VILLEURBANNE', tranche_effectif_salarie: '11' } },
  ] : [];
  route.fulfill({ headers: cors, body: JSON.stringify({ results, total_results: total, page: 1, per_page: 1, total_pages: total }) });
}
const BODACC = [
  { id: 'A20260198765', dateparution: '2026-10-20', familleavis: 'creation', familleavis_lib: 'Créations', commercant: 'LE PETIT BISTROT LYONNAIS', ville: 'Lyon', cp: '69002', numerodepartement: '69',
    registre: ['912 345 678', '912345678'], url_complete: 'https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:A20260198765',
    listepersonnes: JSON.stringify({ personne: { typePersonne: 'pm', denomination: 'LE PETIT BISTROT LYONNAIS', formeJuridique: 'Société par actions simplifiée', administration: 'Président : MARTIN, Claire' } }),
    listeetablissements: JSON.stringify({ etablissement: { origineFonds: 'Création', activite: 'Restauration traditionnelle, vente à emporter', adresse: { ville: 'Lyon' } } }),
    acte: JSON.stringify({ dateImmatriculation: '2026-10-14', descriptif: 'Immatriculation', dateCommencementActivite: '2026-10-01' }) },
  { id: 'A20260198766', dateparution: '2026-10-19', familleavis: 'creation', familleavis_lib: 'Créations', commercant: 'DUPUIS RENOVATION', ville: 'Villeurbanne', cp: '69100', numerodepartement: '69',
    registre: ['923456789'], listeetablissements: JSON.stringify({ etablissement: { activite: 'Travaux de plomberie et de rénovation' } }) },
];

before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-marche-'));
  const made = await createApp({ dataDir: dir });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
  await ctx.route('https://recherche-entreprises.api.gouv.fr/**', sireneRoute);
  await ctx.route('https://geo.api.gouv.fr/**', (route) => route.fulfill({ headers: cors, body: JSON.stringify([
    { nom: 'Lyon', code: '69123', codeDepartement: '69', codesPostaux: ['69001', '69002', '69003', '69004', '69005', '69006', '69007', '69008', '69009'] },
  ]) }));
  await ctx.route('https://bodacc-datadila.opendatasoft.com/**', (route) => {
    bodacc.push(new URL(route.request().url()).searchParams.get('where'));
    route.fulfill({ headers: cors, body: JSON.stringify({ total_count: BODACC.length, results: BODACC }) });
  });
  page = await ctx.newPage();
  await page.goto(base + '/');
  await page.fill('input[name=name]', 'Vanloo Albino');
  await page.fill('input[name=email]', 'albino@exemple.fr');
  await page.fill('input[name=password]', 'motdepasse1');
  await page.click('button[type=submit]');
  await page.waitForURL(base + '/');
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.getByText('Charger la démo').first().click();
  await page.waitForFunction(() => window.__bsStore.get().prospects.length > 5);
  await page.evaluate(() => { const s = document.getElementById('splash'); if (s) s.remove(); });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

test('Analyse › Marché : potentiel par métier, classé, et « Prospecter » vers le générateur de leads', async () => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const menu = await page.locator('nav a, nav button, aside a, aside button').allTextContents();
  assert.ok(menu.some((t) => /Marché/.test(t)), 'Marché dans le menu');
  await page.evaluate(() => { location.hash = '#/marche'; });
  await page.waitForSelector('.bsmar form[data-form=potentiel]');
  assert.equal(await page.textContent('.bsmar .page-title'), 'Marché');
  await page.fill('form[data-form=potentiel] input[name=zone]', 'Lyon');
  await page.click('form[data-form=potentiel] button[type=submit]');
  await page.waitForSelector('.bsmar-table tbody tr', { timeout: 60000 });
  const n = await page.evaluate(() => window.bsLeads.SECTEURS.reduce((a, s) => a + s.metiers.length, 0));
  assert.equal(await page.locator('.bsmar-table tbody tr').count(), 12, 'les 12 plus prometteurs d’abord');
  await page.click('[data-act=tout]');
  assert.equal(await page.locator('.bsmar-table tbody tr').count(), n, 'puis tous les métiers');
  assert.equal(sirene.length, n);
  assert.equal(sirene[0].code_postal, '69001,69002,69003,69004,69005,69006,69007,69008,69009', 'Lyon : tous ses arrondissements');
  assert.equal(sirene[0].etat_administratif, 'A');
  // Classement : clients possibles décroissants (entreprises pas encore au CRM × taux de signature du secteur).
  const possibles = await page.$$eval('.bsmar-table tbody tr td:nth-child(5)', (tds) => tds.map((td) => Number(td.textContent.replace(/\D/g, ''))));
  assert.deepEqual(possibles, possibles.slice().sort((a, b) => b - a), 'le plus gros potentiel en premier');
  const premier = await page.textContent('.bsmar-table tbody tr:first-child td:first-child b');
  const kpis = await page.locator('.bsmar-kpi').allTextContents();
  assert.match(kpis[0], /entreprises ciblables/);
  assert.match(kpis[2], /taux de signature/);
  assert.match(await page.textContent('.bsmar-conseils'), new RegExp('Commencez par les ' + premier.toLowerCase()));
  // Valeur d'un client : hypothèse saisie quand le CRM n'a pas encore de clients chiffrés.
  if (await page.locator('form[data-form=hypotheses] input[name=valeur]').count()) {
    await page.fill('form[data-form=hypotheses] input[name=valeur]', '1500');
    await page.click('form[data-form=hypotheses] button[type=submit]');
  }
  await page.waitForSelector('.bsmar-table th:has-text("CA possible")');
  if (SHOTS) await page.screenshot({ path: join(SHOTS, 'marche-potentiel.png'), fullPage: true });

  await page.click('[data-prospecter="restaurant"]');
  await page.waitForFunction(() => location.hash === '#/leads');
  const prefs = await page.evaluate(() => JSON.parse(localStorage.getItem('bs-leads-prefs')));
  assert.equal(prefs.metier, 'restaurant');
  assert.equal(prefs.secteur, 'Commerce / e-commerce');
  assert.equal(prefs.zone, 'Lyon');
  assert.deepEqual(errors, []);
});

test('Marché › Nouvelles entreprises : créations du BODACC dans le département, ajout au CRM', async () => {
  await page.evaluate(() => { location.hash = '#/marche'; });
  await page.waitForSelector('[data-onglet=creations]');
  await page.click('[data-onglet=creations]');
  await page.waitForSelector('.bsmar-crea');
  assert.match(bodacc[0], /numerodepartement="69"/);
  assert.match(bodacc[0], /dateparution>=date'\d{4}-\d{2}-\d{2}'/);
  const premier = page.locator('.bsmar-crea').first();
  assert.match(await premier.textContent(), /Le Petit Bistrot Lyonnais/);
  assert.match(await premier.textContent(), /Restauration traditionnelle/);
  assert.match(await premier.textContent(), /Commerce \/ e-commerce/);
  await page.fill('[data-filtre]', 'plomberie');
  assert.equal(await page.locator('.bsmar-crea').count(), 1);
  await page.fill('[data-filtre]', '');
  await premier.locator('[data-ajouter]').click();
  await page.waitForSelector('.bsmar-crea:first-child [data-ouvrir]');
  const p = await page.evaluate(() => window.__bsStore.get().prospects.find((x) => x.siret === '912345678'));
  assert.equal(p.entreprise, 'Le Petit Bistrot Lyonnais');
  assert.equal(p.canal, 'Nouvelles entreprises (BODACC)');
  assert.equal(p.statut, 'a_appeler');
  assert.equal(p.secteur, 'Commerce / e-commerce');
  assert.match(p.notes, /Président : MARTIN, Claire/);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, 'marche-nouvelles-entreprises.png'), fullPage: true });
});

test('Marché › Concurrence : prestataires de la zone et entreprises ciblables par concurrent', async () => {
  await page.click('[data-onglet=concurrence]');
  await page.click('form[data-form=concurrence] button[type=submit]');
  await page.waitForSelector('.bsmar-kpi:has-text("concurrents directs")', { timeout: 60000 });
  const kpis = await page.locator('.bsmar-kpi').allTextContents();
  assert.match(kpis[0], /995\s*concurrents directs/, '73.11Z + 62.01Z + 62.02A + 82.20Z');
  assert.match(kpis[2], /entreprises ciblables par concurrent/);
  assert.doesNotMatch(kpis[2], /–/);
  assert.equal(await page.locator('.bsmar-crea').count(), 2, 'les mieux établis, sans doublon');
  if (SHOTS) await page.screenshot({ path: join(SHOTS, 'marche-concurrence.png'), fullPage: true });
});
