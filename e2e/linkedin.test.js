// Test de bout en bout des leads LinkedIn (Nouveaux leads › onglet LinkedIn) : le bouton « Envoyer au CRM » lit de
// vraies structures de pages LinkedIn et Google, ouvre le CRM avec les personnes, qui sont notées, vérifiées dans
// Sirene et ajoutées au CRM ; collage d'une page, import de l'export officiel (.csv et .zip) ; Claude (version équipe).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { deflateRawSync, crc32 } from 'node:zlib';
import { chromium } from 'playwright';
import { assemble } from '../scripts/build.mjs';
import { createApp } from '../server/src/app.js';
import * as F from './fixtures/linkedin.js';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const CRM = 'https://crm.blackstart.test/';
const PAGES = {
  RECHERCHE: 'https://www.linkedin.com/search/results/people/?keywords=plombier%20Lyon',
  PROFIL: 'https://www.linkedin.com/in/jean-dupont-12345/',
  ENTREPRISE: 'https://www.linkedin.com/company/plomberie-dupont/people/',
  SALESNAV: 'https://www.linkedin.com/sales/search/people?query=boulangerie',
  RELATIONS: 'https://www.linkedin.com/mynetwork/invite-connect/connections/',
  GOOGLE: 'https://www.google.com/search?q=site%3Alinkedin.com%2Fin+g%C3%A9rant+plombier+Lyon',
  RECHERCHE_SDUI: 'https://www.linkedin.com/search/results/people/?keywords=directrice%20commerciale',
  PROFIL_SDUI: 'https://www.linkedin.com/in/camille-martin-4b2a1c9/',
  RELATIONS_SDUI: 'https://www.linkedin.com/mynetwork/invite-connect/connections/?sdui',
};
let browser, html;
const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

before(async () => {
  html = assemble();
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); });

// Services publics simulés : geo.api.gouv.fr (zone) et Recherche d'entreprises (entreprise vérifiée).
async function simulerApis(ctx) {
  const sirene = [];
  await ctx.route('https://geo.api.gouv.fr/**', (route) => route.fulfill({ headers: cors, body: JSON.stringify([
    { nom: 'Lyon', code: '69123', departement: { code: '69', nom: 'Rhône' }, region: { code: '84', nom: 'Auvergne-Rhône-Alpes' } },
  ]) }));
  await ctx.route('https://recherche-entreprises.api.gouv.fr/**', (route) => {
    const q = new URL(route.request().url()).searchParams.get('q') || '';
    sirene.push(q);
    const results = [];
    if (/plomberie dupont/i.test(q)) {
      results.push({ siren: '812345678', nom_complet: 'PLOMBERIE DUPONT', activite_principale: '43.22A', tranche_effectif_salarie: '02', date_creation: '2015-04-01',
        dirigeants: [{ nom: 'DUPONT', prenoms: 'JEAN MARC', qualite: 'Gérant', type_dirigeant: 'personne physique' }], complements: { est_entrepreneur_individuel: false },
        siege: { siret: '81234567800012', adresse: '4 RUE DE LA REPUBLIQUE 69002 LYON', libelle_commune: 'LYON', code_postal: '69002', activite_principale: '43.22A', tranche_effectif_salarie: '02' },
        matching_etablissements: [{ siret: '81234567800012', etat_administratif: 'A', adresse: '4 RUE DE LA REPUBLIQUE 69002 LYON', libelle_commune: 'LYON', code_postal: '69002', activite_principale: '43.22A', tranche_effectif_salarie: '02' }] });
      // Homonyme à Bordeaux : écarté car le lead est à Lyon.
      results.push({ siren: '899999999', nom_complet: 'PLOMBERIE DUPONT', activite_principale: '43.22A', siege: { siret: '89999999900011', libelle_commune: 'BORDEAUX', adresse: '1 QUAI 33000 BORDEAUX' }, matching_etablissements: [{ siret: '89999999900011', etat_administratif: 'A', libelle_commune: 'BORDEAUX' }] });
    }
    if (/grand groupe/i.test(q)) {
      results.push({ siren: '552081317', nom_complet: 'GRAND GROUPE ENERGIE', categorie_entreprise: 'GE', tranche_effectif_salarie: '53', activite_principale: '35.14Z', siege: { siret: '55208131700012', libelle_commune: 'PARIS' }, matching_etablissements: [] });
    }
    route.fulfill({ headers: cors, body: JSON.stringify({ results, total_results: results.length, page: 1, per_page: 8, total_pages: 1 }) });
  });
  return sirene;
}
async function servir(ctx) {
  await ctx.route(CRM + '**', (route) => route.fulfill({ contentType: 'text/html; charset=utf-8', body: html }));
  await ctx.route(/^https:\/\/(www\.linkedin\.com|www\.google\.com)\//, (route) => {
    const u = route.request().url();
    const k = Object.keys(PAGES).find((x) => PAGES[x] === u);
    route.fulfill(k ? { contentType: 'text/html; charset=utf-8', body: F[k] } : { status: 404, body: '' });
  });
}
async function ouvrirCrm(page, url = CRM) {
  await page.goto(url);
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.evaluate(() => document.getElementById('splash')?.remove());
}
// Le bouton « Envoyer au CRM » tel qu'un favori l'exécute sur la page LinkedIn ; window.open est observé.
async function cliquerBouton(page, code, ouvre = true) {
  await page.evaluate((ok) => { window.__ouvert = []; window.open = (u, n) => { window.__ouvert.push([u, n]); return ok ? {} : null; }; }, ouvre);
  await page.evaluate((c) => (0, eval)(c), code);
}
function zip(nom, texte) {
  const data = Buffer.from(texte, 'utf8'), comp = deflateRawSync(data), n = Buffer.from(nom), crc = crc32(data);
  const loc = Buffer.alloc(30); loc.writeUInt32LE(0x04034b50, 0); loc.writeUInt16LE(20, 4); loc.writeUInt16LE(8, 8); loc.writeUInt32LE(crc, 14); loc.writeUInt32LE(comp.length, 18); loc.writeUInt32LE(data.length, 22); loc.writeUInt16LE(n.length, 26);
  const cen = Buffer.alloc(46); cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(8, 10); cen.writeUInt32LE(crc, 16); cen.writeUInt32LE(comp.length, 20); cen.writeUInt32LE(data.length, 24); cen.writeUInt16LE(n.length, 28); cen.writeUInt32LE(0, 42);
  const debut = loc.length + n.length + comp.length;
  const fin = Buffer.alloc(22); fin.writeUInt32LE(0x06054b50, 0); fin.writeUInt16LE(1, 8); fin.writeUInt16LE(1, 10); fin.writeUInt32LE(cen.length + n.length, 12); fin.writeUInt32LE(debut, 16);
  return Buffer.concat([loc, n, comp, cen, n, fin]);
}

test('le bouton lit chaque type de page LinkedIn et Google', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
  await servir(ctx); await simulerApis(ctx);
  const crm = await ctx.newPage();
  await ouvrirCrm(crm);
  const ex = await crm.evaluate(() => window.bsLinkedin.extraire.toString());
  const page = await ctx.newPage();
  const lire = async (k) => { await page.goto(PAGES[k]); return page.evaluate((s) => (0, eval)('(' + s + ')')(document, location.href), ex); };

  let r = await lire('RECHERCHE');
  assert.equal(r.page, 'recherche');
  assert.deepEqual(r.leads.map((l) => l.nom), ['Jean Dupont', 'Claire Moreau', 'Lucas Petit', 'Sophie Garnier', 'Paul Roux'], 'ni « Membre LinkedIn », ni la relation en commun');
  assert.deepEqual(r.leads[0], { nom: 'Jean Dupont', poste: 'Gérant chez Plomberie Dupont', entreprise: 'Plomberie Dupont', lieu: 'Lyon, Auvergne-Rhône-Alpes, France', url: 'https://www.linkedin.com/in/jean-dupont-12345/' });
  assert.equal(r.leads[1].entreprise, 'Chauffage Moreau');
  assert.equal(r.leads[3].entreprise, 'Sanitaires Garnier', 'mise en page récente (classes aléatoires)');
  assert.equal(r.leads[3].lieu, 'Marseille, Provence-Alpes-Côte d’Azur, France');

  r = await lire('PROFIL');
  assert.deepEqual(r.leads, [{ nom: 'Jean Dupont', poste: 'Gérant chez Plomberie Dupont | Chauffage et sanitaire à Lyon', entreprise: 'Plomberie Dupont', lieu: 'Lyon, Auvergne-Rhône-Alpes, France', url: 'https://www.linkedin.com/in/jean-dupont-12345/' }]);

  r = await lire('ENTREPRISE');
  assert.deepEqual(r.leads.map((l) => [l.nom, l.poste, l.entreprise]), [['Lucas Bernard', 'Associé et cogérant', 'Plomberie Dupont'], ['Emma Leroy', 'Plombière chauffagiste', 'Plomberie Dupont']]);

  r = await lire('RELATIONS');
  assert.deepEqual(r.leads.map((l) => [l.nom, l.entreprise]), [['Sophie Lambert', 'Institut Beauté Zen'], ['Marc Blanc', 'Blanc Immobilier']]);

  r = await lire('GOOGLE');
  assert.deepEqual(r.leads.map((l) => [l.nom, l.poste, l.entreprise, l.lieu]), [['Jean Dupont', 'Gérant', 'Plomberie Dupont', 'Lyon'], ['Nadia Benali', 'Fondatrice', 'N.B. Rénovation', 'Villeurbanne, Auvergne-Rhône-Alpes, France'], ['Karim Haddad', 'Gérant', 'Haddad Électricité', '']], 'titre Google « Nom - Titre | LinkedIn »');
  assert.equal(r.adresse, 'https://www.google.com/search', 'page de capture sans la requête');
  assert.equal(r.leads[0].url, 'https://www.linkedin.com/in/jean-dupont-12345/');

  // Mise en page 2025-2026 : liens imbriqués, relation en commun dans la carte, profil sans h1.
  const SDUI = [['Camille Martin', 'Directrice commerciale chez Acme SAS | SaaS B2B', 'Acme SAS', 'Lyon, Auvergne-Rhône-Alpes, France'], ['Thomas Bernard', 'Fondateur @ Boulangerie Bernard', 'Boulangerie Bernard', 'Annecy']];
  r = await lire('RECHERCHE_SDUI');
  assert.ok(await page.evaluate(() => document.querySelectorAll('a a').length > 0), 'cartes en liens imbriqués');
  assert.deepEqual(r.leads.map((l) => [l.nom, l.poste, l.entreprise, l.lieu]), SDUI, 'ni Julie Roux (relation en commun) ni « 2 k abonnés »');
  r = await lire('PROFIL_SDUI');
  assert.deepEqual(r.leads.map((l) => [l.nom, l.poste, l.entreprise, l.lieu, l.url]), [[...SDUI[0], 'https://www.linkedin.com/in/camille-martin-4b2a1c9/']]);
  r = await lire('RELATIONS_SDUI');
  assert.deepEqual(r.leads.map((l) => [l.nom, l.poste, l.entreprise]), [['Camille Martin', 'Directrice commerciale chez Acme SAS', 'Acme SAS'], SDUI[1].slice(0, 3)]);

  // Sales Navigator : la liste se remplit au défilement ; sans défiler, seuls les premiers résultats sont lisibles.
  r = await lire('SALESNAV');
  assert.equal(r.page, 'salesnav');
  assert.ok(r.leads.length < 25);
  await ctx.close();
});

test('du bouton au CRM : notés, entreprise vérifiée, ajoutés comme prospects', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: CRM.slice(0, -1) });
  await servir(ctx);
  const sirene = await simulerApis(ctx);
  const crm = await ctx.newPage();
  const errors = [];
  crm.on('pageerror', (e) => errors.push(e.message));
  await ouvrirCrm(crm);
  await crm.evaluate(() => { location.hash = '#/leads'; });
  await crm.locator('.bsl-root .page-title').waitFor();
  await crm.getByRole('tab', { name: /LinkedIn/ }).click();
  await crm.locator('.bsli-bouton').waitFor();

  // Critères : plombiers à Lyon.
  await crm.fill('input[name="li-secteurs"]', 'plombier, plomberie, chauffage');
  await crm.fill('input[name="li-zone"]', 'Lyon');
  await crm.locator('input[name="li-zone"]').dispatchEvent('change');
  const lienIn = await crm.locator('a.bsli-in').getAttribute('href');
  assert.match(decodeURIComponent(lienIn), /^https:\/\/www\.linkedin\.com\/search\/results\/people\/\?keywords=\(gérant OR fondateur .*\) \(plombier OR plomberie OR chauffage\) Lyon/);
  assert.match(decodeURIComponent(await crm.locator('a', { hasText: 'Google' }).getAttribute('href')), /site:linkedin\.com\/in .*"Lyon"/);
  const favori = await crm.locator('.bsli-bouton').getAttribute('href');
  assert.ok(favori.startsWith('javascript:') && favori.length < 40000);
  // Un clic sur le bouton dans le CRM ne lance rien : il faut le glisser dans les favoris.
  await crm.locator('.bsli-bouton').click();
  await crm.getByText('Ne cliquez pas ici').waitFor();

  const code = decodeURIComponent(favori.slice('javascript:'.length));
  const li = await ctx.newPage();
  await li.goto(PAGES.RECHERCHE);
  await cliquerBouton(li, code);
  const [[url, cible]] = await li.evaluate(() => window.__ouvert);
  assert.equal(cible, 'bs-crm');
  assert.ok(url.startsWith(CRM + '#/leads?li='));
  assert.match(await li.locator('#bs-crm-panneau').innerText(), /5 personnes envoyées au CRM/);

  // Le CRM déjà ouvert reçoit les leads (changement d'adresse), sans recharger la page.
  await crm.evaluate((u) => { window.__pasRecharge = 1; location.href = u; }, url);
  await crm.locator('.bsli-card', { hasText: 'Jean Dupont' }).waitFor();
  assert.equal(await crm.evaluate(() => window.__pasRecharge), 1);
  assert.equal(await crm.evaluate(() => location.hash), '#/leads');
  assert.equal(await crm.locator('.bsli-card').count(), 5, 'filtre « Derniers reçus »');

  // Notes : décideur + secteur + zone ; l'étudiant et le grand groupe sont hors cible.
  await crm.waitForFunction(() => !document.querySelector('.bsli-attente'));
  const carte = (nom) => crm.locator('.bsli-card', { hasText: nom });
  const score = async (nom) => Number(await carte(nom).locator('.bsli-score b').innerText());
  assert.match(await carte('Jean Dupont').innerText(), /Qualifié/);
  assert.match(await carte('Jean Dupont').innerText(), /Dirigeant de l’entreprise \(Sirene\)/);
  assert.match(await carte('Jean Dupont').innerText(), /3 à 5 salariés/);
  assert.equal(await score('Jean Dupont'), 100);
  assert.match(await carte('Claire Moreau').innerText(), /Qualifié/);
  assert.match(await carte('Claire Moreau').innerText(), /Près de la zone|Dans la zone/);
  assert.match(await carte('Lucas Petit').innerText(), /Hors cible/);
  assert.match(await carte('Lucas Petit').innerText(), /À écarter : étudiant/);
  assert.match(await carte('Paul Roux').innerText(), /Grande entreprise/);
  assert.match(await carte('Sophie Garnier').innerText(), /Hors zone/);
  assert.ok(sirene.some((q) => /Plomberie Dupont/.test(q)));

  // Ajouter au CRM : prospect LinkedIn complet (entreprise vérifiée, SIRET, adresse, profil, poste).
  await carte('Jean Dupont').locator('[data-li-ajouter]').click();
  await carte('Jean Dupont').getByText('Dans le CRM').waitFor();
  const p = await crm.evaluate(() => window.__bsStore.get().prospects.find((x) => x.contact === 'Jean Dupont'));
  assert.equal(p.canal, 'LinkedIn');
  assert.equal(p.linkedin, 'https://www.linkedin.com/in/jean-dupont-12345/');
  assert.equal(p.poste, 'Gérant chez Plomberie Dupont');
  assert.equal(p.entreprise, 'Plomberie Dupont');
  assert.equal(p.siret, '81234567800012');
  assert.equal(p.secteur, 'Artisans / BTP');
  assert.equal(p.priorite, 'haute');
  assert.equal(p.statut, 'a_appeler');
  assert.match(p.notes, /Profil LinkedIn : https:\/\/www\.linkedin\.com\/in\/jean-dupont-12345\//);
  assert.match(p.notes, /RGPD/);
  assert.match(p.notes, /Vu sur : https:\/\/www\.linkedin\.com\/search\/results\/people\/\n/, 'page de capture, sans la requête');

  // Même personne renvoyée depuis son profil puis Google : pas de doublon.
  await li.goto(PAGES.PROFIL);
  await cliquerBouton(li, code);
  const [[url2]] = await li.evaluate(() => window.__ouvert);
  await crm.evaluate((u) => { location.href = u; }, url2);
  await crm.waitForFunction(() => window.bsLinkedin._interne.leads().length === 5);
  await li.goto(PAGES.GOOGLE);
  await cliquerBouton(li, code);
  const [[url3]] = await li.evaluate(() => window.__ouvert);
  await crm.evaluate((u) => { location.href = u; }, url3);
  await crm.waitForFunction(() => window.bsLinkedin._interne.leads().length === 7);
  assert.equal(await crm.evaluate(() => window.__bsStore.get().prospects.filter((x) => x.contact === 'Jean Dupont').length), 1);

  // Sales Navigator : le bouton fait défiler la liste avant de lire (25 résultats), puis propose d'envoyer.
  await li.goto(PAGES.SALESNAV);
  await cliquerBouton(li, code, false);
  await li.locator('#bs-crm-panneau', { hasText: '25 personnes trouvées' }).waitFor({ timeout: 20000 });
  await li.locator('#bs-crm-panneau button', { hasText: 'Envoyer au CRM' }).click();
  const envois = await li.evaluate(() => window.__ouvert);
  assert.ok(envois.length >= 1 && envois[0][0].startsWith(CRM + '#/leads?li='));

  // Nouvel onglet CRM ouvert par le bouton (le CRM n'était pas ouvert) : les leads sont gardés au démarrage.
  const crm2 = await ctx.newPage();
  await ouvrirCrm(crm2, envois[0][0]);
  await crm2.locator('.bsli-card', { hasText: 'Prospect Y Martin' }).waitFor();
  assert.equal(await crm2.evaluate(() => location.hash), '#/leads');
  assert.equal(await crm2.evaluate(() => window.bsLinkedin._interne.leads().filter((l) => l.source === 'salesnav').length), 25);

  // « Ajouter les qualifiés » : tous les qualifiés pas encore au CRM.
  await crm2.getByRole('tab', { name: /Qualifiés/ }).click();
  const nQualif = await crm2.locator('.bsli-card').count();
  assert.ok(nQualif > 0);
  await crm2.locator('[data-li-act="tout"]').click();
  await crm2.getByRole('tab', { name: /Ajoutés/ }).waitFor();
  const nLinkedin = await crm2.evaluate(() => window.__bsStore.get().prospects.filter((x) => x.canal === 'LinkedIn').length);
  assert.ok(nLinkedin >= nQualif);

  // Mobile : pas de défilement horizontal.
  await crm2.setViewportSize({ width: 390, height: 844 });
  await crm2.waitForTimeout(300);
  assert.ok(await crm2.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('sans le bouton : page collée et export officiel des relations (.csv et .zip)', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  await servir(ctx); await simulerApis(ctx);
  const crm = await ctx.newPage();
  const errors = [];
  crm.on('pageerror', (e) => errors.push(e.message));
  await ouvrirCrm(crm);
  await crm.evaluate(() => { localStorage.setItem('bs-leads-onglet', '"linkedin"'); location.hash = '#/leads'; });
  await crm.locator('.bsli-bouton').waitFor();

  // Coller une page de résultats (le presse-papiers contient le HTML de la page).
  await crm.locator('[data-li-aide="coller"]').click();
  await crm.locator('[data-li-coller]').evaluate((z, h) => {
    const dt = new DataTransfer();
    dt.setData('text/html', '<!-- SourceURL: https://www.linkedin.com/search/results/people/ -->' + h);
    dt.setData('text/plain', 'Jean Dupont Gérant…');
    z.focus();
    z.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  }, F.RECHERCHE);
  await crm.getByText('5 leads ajoutés à trier').waitFor();

  // Liste d'adresses de profils en texte.
  await crm.locator('[data-li-coller]').evaluate((z) => {
    const dt = new DataTransfer();
    dt.setData('text/plain', 'https://www.linkedin.com/in/marie-curie-4b5c6d7e8f\nhttps://fr.linkedin.com/in/jean-dupont-12345/');
    z.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  });
  await crm.getByText('1 lead ajouté à trier (1 déjà là)').waitFor();
  assert.ok(await crm.evaluate(() => window.bsLinkedin._interne.leads().some((l) => l.nom === 'Marie Curie')));

  // Export officiel : Connections.csv puis l'archive .zip entière.
  await crm.locator('[data-li-aide="export"]').click();
  await crm.locator('[data-li-fichier]').setInputFiles({ name: 'Connections.csv', mimeType: 'text/csv', buffer: Buffer.from(F.CONNECTIONS_CSV, 'utf8') });
  await crm.getByText('2 relations importées (1 déjà là)').waitFor();
  const aicha = await crm.evaluate(() => window.bsLinkedin._interne.leads().find((l) => l.nom === 'Aïcha Diallo'));
  assert.equal(aicha.entreprise, 'Diallo Plomberie, SARL');
  assert.equal(aicha.email, 'aicha@exemple.fr');
  assert.equal(aicha.source, 'export');
  const autre = F.CONNECTIONS_CSV.replace('Thomas,Girard,https://www.linkedin.com/in/thomas-girard', 'Inès,Robert,https://www.linkedin.com/in/ines-robert');
  await crm.locator('[data-li-fichier]').setInputFiles({ name: 'Basic_LinkedInDataExport_10-20-2026.zip', mimeType: 'application/zip', buffer: zip('Connections.csv', autre) });
  await crm.getByText('1 relation importée (2 déjà là)').waitFor();
  await crm.locator('[data-li-fichier]').setInputFiles({ name: 'notes.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2\n') });
  await crm.getByText('Ce fichier n’est pas la liste des relations LinkedIn').waitFor();

  // Leads illisibles dans l'adresse : message, rien d'ajouté.
  const avant = await crm.evaluate(() => window.bsLinkedin._interne.leads().length);
  await crm.evaluate(() => { location.hash = '#/leads?li=AAAA'; });
  await crm.waitForFunction(() => location.hash === '#/leads');
  assert.equal(await crm.evaluate(() => window.bsLinkedin._interne.leads().length), avant);

  // Un nom piégé reste du texte.
  await crm.evaluate(() => window.bsLinkedin._interne.fusionner([{ nom: '<img src=x onerror="window.__xss=1">Eve', poste: 'Gérante', entreprise: '<b>x</b>', url: 'javascript:alert(1)' }], 'collage'));
  await crm.getByRole('tab', { name: /Tous à trier/ }).click();
  await crm.locator('.bsli-card', { hasText: 'Eve' }).waitFor();
  assert.equal(await crm.evaluate(() => window.__xss), undefined);
  assert.equal(await crm.locator('.bsli-card', { hasText: 'Eve' }).locator('a[data-li-profil]').count(), 0, 'pas de lien hors LinkedIn');
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('version équipe : Claude qualifie sans recevoir les noms et propose une invitation', async () => {
  const demandes = [];
  const faux = () => ({
    models: { retrieve: async (m) => ({ id: m }) },
    beta: { messages: { create: async (p) => {
      demandes.push(p);
      const leads = JSON.parse(p.messages[0].content.split('(JSON) :\n')[1]);
      return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ leads: leads.map((l) => ({
        id: l.id, score: /gérant|fondat/i.test(l.poste) ? 88 : 15, categorie: /gérant|fondat/i.test(l.poste) ? 'qualifie' : 'hors_cible',
        raison: /gérant/i.test(l.poste) ? 'Gérant d’une petite plomberie lyonnaise.' : 'Profil peu pertinent.', message: 'Bonjour {{prenom}}, je vois que vous dirigez votre entreprise. Comment gérez-vous vos devis ?' })) }) }] };
    } } },
  });
  const sdir = mkdtempSync(join(tmpdir(), 'bs-li-srv-'));
  delete process.env.ANTHROPIC_API_KEY;
  const made = await createApp({ dataDir: sdir, ia: { creer: faux } });
  const server = await new Promise((res) => { const s = made.app.listen(0, () => res(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
  await simulerApis(ctx);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    await page.goto(base + '/');
    await page.fill('input[name=name]', 'Albino');
    await page.fill('input[name=email]', 'albino@exemple.fr');
    await page.fill('input[name=password]', 'motdepasse1');
    await page.click('button[type=submit]');
    await page.waitForURL(base + '/');
    await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded && window.BS_SERVER);
    await page.evaluate(() => document.getElementById('splash')?.remove());
    const cle = await page.evaluate(() => fetch('/api/ia/cle', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' }, body: JSON.stringify({ cle: 'sk-ant-api03-' + 'x'.repeat(40) }) }).then((r) => r.status));
    assert.equal(cle, 200);
    // Des leads arrivent par l'adresse, comme depuis le bouton.
    const code = Buffer.from(JSON.stringify({ v: 1, p: 'recherche', l: [
      ['Jean Dupont', 'Gérant chez Plomberie Dupont', 'Plomberie Dupont', 'Lyon, Auvergne-Rhône-Alpes, France', 'in:jean-dupont-12345'],
      ['Lucas Petit', 'Technicien', '', 'Lyon', 'in:lucas-petit'],
    ] })).toString('base64url');
    await page.evaluate((c) => { location.hash = '#/leads?li=' + c; }, code);
    await page.locator('.bsli-card', { hasText: 'Jean Dupont' }).waitFor();
    await page.locator('[data-li-act="ia"]').click();
    await page.locator('.bsli-ia', { hasText: 'Gérant d’une petite plomberie lyonnaise.' }).waitFor();
    const carte = page.locator('.bsli-card', { hasText: 'Jean Dupont' });
    assert.match(await carte.locator('.bsli-msg').innerText(), /^Bonjour Jean, je vois que vous dirigez/);
    assert.equal(await carte.locator('.bsli-score b').innerText(), '88');
    const envoye = JSON.stringify(demandes[0]);
    assert.ok(!envoye.includes('Dupont Jean') && !envoye.includes('Jean Dupont') && !envoye.includes('Lucas'), 'les noms ne partent pas chez Claude');
    assert.match(envoye, /Plomberie Dupont/);
    // Ajout : l'invitation proposée est gardée dans la fiche.
    await carte.locator('[data-li-ajouter]').click();
    const p = await page.evaluate(() => window.__bsStore.get().prospects.find((x) => x.contact === 'Jean Dupont'));
    assert.match(p.notes, /Invitation LinkedIn proposée : Bonjour Jean,/);
    assert.match(p.notes, /Qualification : 88\/100 \(Claude\)/);
    assert.deepEqual(errors, []);
  } finally {
    await ctx.close(); made.hub.close(); server.close(); await made.db.close();
    rmSync(sdir, { recursive: true, force: true });
  }
});

test('garde-fous : rythme, effacement à 30 jours, « ne plus contacter », fichiers Excel, liens de recherche', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
  await servir(ctx); await simulerApis(ctx);
  const crm = await ctx.newPage();
  const errors = [];
  crm.on('pageerror', (e) => errors.push(e.message));
  // Un lead jamais ajouté reçu il y a 40 jours est effacé ; un lead ajouté au CRM reste.
  await crm.addInitScript(() => {
    if (sessionStorage.getItem('init')) return;
    sessionStorage.setItem('init', '1');
    const vieux = new Date(Date.now() - 40 * 864e5).toISOString(), recent = new Date(Date.now() - 5 * 864e5).toISOString();
    localStorage.setItem('bs-linkedin-leads', JSON.stringify([
      { id: 'a', nom: 'Vieux Lead', poste: 'Gérant', recu: vieux, statut: '' },
      { id: 'b', nom: 'Vieil Écarté', poste: 'Gérant', recu: vieux, statut: 'ecarte' },
      { id: 'c', nom: 'Déjà Client', poste: 'Gérant', recu: vieux, statut: 'ajoute' },
      { id: 'd', nom: 'Lead Récent', poste: 'Gérant', recu: recent, statut: '' },
    ]));
  });
  await ouvrirCrm(crm);
  assert.deepEqual(await crm.evaluate(() => window.bsLinkedin._interne.leads().map((l) => l.nom)), ['Déjà Client', 'Lead Récent']);

  // Page de capture gardée (adresse LinkedIn seulement) et compteur du jour.
  await crm.evaluate(() => { location.hash = '#/leads'; });
  await crm.locator('.bsl-root .page-title').waitFor();
  await crm.getByRole('tab', { name: /LinkedIn/ }).click();
  const r = await crm.evaluate(() => {
    const I = window.bsLinkedin._interne;
    I.fusionner([{ nom: 'Jean Dupont', poste: 'Gérant', entreprise: 'Plomberie Dupont', url: 'in:jean-dupont-12345' }], 'recherche', 'https://www.linkedin.com/search/results/people/');
    I.fusionner([{ nom: 'Eve Piège', poste: 'Gérante', entreprise: 'X' }], 'recherche', 'javascript:alert(1)');
    const l = I.leads();
    return { vu: l.find((x) => x.nom === 'Jean Dupont').vu, piege: l.find((x) => x.nom === 'Eve Piège').vu };
  });
  assert.equal(r.vu, 'https://www.linkedin.com/search/results/people/');
  assert.equal(r.piege, undefined);
  await crm.getByRole('tab', { name: /LinkedIn/ }).click();
  await crm.evaluate(() => window.bsLeads.onglet('sirene'));
  await crm.evaluate(() => window.bsLeads.onglet('linkedin'));
  await crm.locator('[data-li-rythme]', { hasText: 'Aujourd’hui : 2 pages lues, 2 personnes.' }).waitFor();
  await crm.evaluate(() => localStorage.setItem('bs-linkedin-jour', JSON.stringify({ d: JSON.parse(localStorage.getItem('bs-linkedin-jour')).d, pages: 30, personnes: 400 })));
  await crm.evaluate(() => { window.bsLeads.onglet('sirene'); window.bsLeads.onglet('linkedin'); });
  await crm.locator('[data-li-rythme].trop', { hasText: 'faites une pause' }).waitFor();

  // Une personne qui a demandé à ne plus être contactée n'est pas rajoutée au CRM.
  const stop = await crm.evaluate(() => {
    window.__bsStore.set((st) => ({ prospects: [{ id: 'p-stop', entreprise: 'Plomberie Dupont', contact: 'Jean Dupont', linkedin: 'https://www.linkedin.com/in/jean-dupont-12345/', nePlusContacter: true, statut: 'perdu', notes: '', tags: [] }].concat(st.prospects || []) }));
    const I = window.bsLinkedin._interne, l = I.leads().find((x) => x.nom === 'Jean Dupont');
    const res = I.ajouterAuCrm(l);
    return { res, statut: l.statut, n: window.__bsStore.get().prospects.filter((p) => p.contact === 'Jean Dupont').length };
  });
  assert.equal(stop.res.stop, true);
  assert.equal(stop.statut, 'ecarte');
  assert.equal(stop.n, 1);
  await crm.getByRole('tab', { name: /Écartés/ }).click();
  await crm.locator('.bsli-card', { hasText: 'Jean Dupont' }).getByText('A demandé à ne plus être contacté').waitFor();

  // Fichier réenregistré par Excel : « ; » et Windows-1252 ; entités HTML.
  const csv = 'Notes:\r\n"…"\r\n\r\nFirst Name;Last Name;URL;Email Address;Company;Position;Connected On\r\nHélène;Fabre;https://www.linkedin.com/in/helene-fabre;;"Fabre &amp; Fils, SARL";Gérante;01 Feb 2025\r\n';
  await crm.locator('[data-li-aide="export"]').click();
  await crm.locator('[data-li-fichier]').setInputFiles({ name: 'Connections.csv', mimeType: 'text/csv', buffer: Buffer.from(csv.replace('…', '...'), 'latin1') });
  await crm.getByText('1 relation importée').waitFor();
  const h = await crm.evaluate(() => window.bsLinkedin._interne.leads().find((l) => l.url.includes('helene-fabre')));
  assert.equal(h.nom, 'Hélène Fabre');
  assert.equal(h.entreprise, 'Fabre & Fils, SARL');

  // Liens de recherche : Sales Navigator au format query=(…), Google sans &num.
  const liens = await crm.evaluate(() => ({ sn: window.bsLinkedin.lienRecherche('salesnav', { postes: 'gérant', secteurs: 'plomberie', zone: 'Lyon' }), g: window.bsLinkedin.lienRecherche('google', { postes: 'gérant', secteurs: 'plomberie', zone: 'Lyon' }) }));
  assert.ok(liens.sn.startsWith('https://www.linkedin.com/sales/search/people?query=(spellCorrectionEnabled%3Atrue%2Ckeywords%3A'), liens.sn);
  assert.ok(liens.sn.endsWith(')') && liens.sn.includes('%2520Lyon'), liens.sn);
  assert.ok(!/num=/.test(liens.g) && /hl=fr&gl=fr/.test(liens.g), liens.g);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('fiche d’un prospect : ses contacts LinkedIn récupérés en un clic, rangés dans la fiche', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
  await servir(ctx); await simulerApis(ctx);
  const crm = await ctx.newPage();
  const errors = [];
  crm.on('pageerror', (e) => errors.push(e.message));
  await ouvrirCrm(crm);
  const vide = { telephone: '', email: '', secteur: 'Artisans / BTP', statut: 'a_appeler', priorite: 'moyenne', tags: [], notes: '', dealValue: 0, mrrValue: 0, callLog: [], events: [], createdAt: '2026-10-01', updatedAt: '2026-10-01' };
  await crm.evaluate((v) => window.__bsStore.set((s) => ({ prospects: [
    { ...v, id: 'p-dupont', entreprise: 'PLOMBERIE DUPONT SARL', contact: '', ville: 'Lyon' },
    { ...v, id: 'p-garnier', entreprise: 'Sanitaires Garnier', contact: '', ville: 'Marseille' },
  ].concat(s.prospects || []) })), vide);
  const fiche = (id) => crm.evaluate((x) => window.__bsY.set((s) => ({ overlays: (s.overlays || []).filter((o) => o.type !== 'prospect').concat([{ key: 'k' + x, type: 'prospect', id: x }]) })), id);
  const prospect = (id) => crm.evaluate((x) => window.__bsStore.get().prospects.find((p) => p.id === x), id);
  const code = await crm.evaluate(() => window.bsLinkedin.codeBouton());

  // Sur la fiche : le bloc « Contacts LinkedIn » et la recherche des décideurs de l'entreprise.
  await fiche('p-dupont');
  const bloc = crm.locator('.bsli-ct-root');
  await bloc.waitFor();
  assert.match(await bloc.innerText(), /Contacts LinkedIn/i);
  const lien = await bloc.locator('[data-ct-chercher=linkedin]').getAttribute('href');
  assert.equal(decodeURIComponent(lien), 'https://www.linkedin.com/search/results/people/?keywords="Plomberie Dupont"&origin=GLOBAL_SEARCH_HEADER', 'sans la forme juridique');
  const [onglet] = await Promise.all([ctx.waitForEvent('page'), bloc.locator('[data-ct-chercher=linkedin]').click()]);
  await onglet.close();
  await bloc.getByText('cliquez sur votre favori').waitFor();

  // Page « Personnes » de l'entreprise : tout le monde y travaille, les 2 sont rangés, l'associé devient le contact
  // principal, et la fiche se rouvre.
  const li = await ctx.newPage();
  await li.goto(PAGES.ENTREPRISE);
  await cliquerBouton(li, code);
  let [[url]] = await li.evaluate(() => window.__ouvert);
  await crm.evaluate((u) => { location.href = u; }, url);
  await crm.waitForFunction(() => (window.__bsStore.get().prospects.find((p) => p.id === 'p-dupont').contacts || []).length === 2);
  let p = await prospect('p-dupont');
  assert.deepEqual(p.contacts.map((c) => [c.nom, c.poste]), [['Lucas Bernard', 'Associé et cogérant'], ['Emma Leroy', 'Plombière chauffagiste']]);
  assert.equal(p.contact, 'Lucas Bernard');
  assert.equal(p.poste, 'Associé et cogérant');
  assert.equal(p.linkedin, 'https://www.linkedin.com/in/lucas-bernard-abc/');
  assert.match(p.events[0].text, /^2 contacts LinkedIn ajoutés : Lucas Bernard \(Associé et cogérant\), Emma Leroy/);
  await crm.locator('.bsli-ct-root .bsli-ct').nth(1).waitFor();
  assert.match(await crm.locator('.bsli-ct-root .bsli-ct.princ').innerText(), /Lucas Bernard\s*Principal/);
  assert.equal(await crm.evaluate(() => window.bsLinkedin._interne.leads().filter((l) => l.crmId === 'p-dupont').length), 2, 'pas à trier une deuxième fois');

  // Recherche de personnes : seul Jean Dupont travaille chez Plomberie Dupont ; les autres sont proposés.
  await li.goto(PAGES.RECHERCHE);
  await cliquerBouton(li, code);
  [[url]] = await li.evaluate(() => window.__ouvert);
  await crm.evaluate((u) => { location.href = u; }, url);
  const panneau = crm.locator('.bsli-pour');
  await panneau.getByText('Claire Moreau').waitFor();
  assert.match(await panneau.innerText(), /Contacts de PLOMBERIE DUPONT SARL/);
  assert.match(await panneau.innerText(), /3 contacts sur la fiche · principal : Lucas Bernard/);
  assert.equal(await panneau.locator('[data-pour-ajouter]').count(), 4);
  await panneau.locator('li', { hasText: 'Claire Moreau' }).locator('[data-pour-ajouter]').click();
  await crm.waitForFunction(() => window.__bsStore.get().prospects.find((p) => p.id === 'p-dupont').contacts.length === 4);
  assert.equal(await panneau.locator('[data-pour-ajouter]').count(), 3);

  // Dans la fiche : changer le contact principal, retirer un contact.
  await panneau.locator('[data-pour-ouvrir]').click();
  await crm.locator('.bsli-ct-root .bsli-ct', { hasText: 'Jean Dupont' }).locator('[data-ct-princ]').click();
  await crm.waitForFunction(() => window.__bsStore.get().prospects.find((p) => p.id === 'p-dupont').contact === 'Jean Dupont');
  p = await prospect('p-dupont');
  assert.equal(p.poste, 'Gérant chez Plomberie Dupont', 'le poste et le profil suivent le contact principal');
  assert.equal(p.linkedin, 'https://www.linkedin.com/in/jean-dupont-12345/');
  await crm.locator('.bsli-ct-root .bsli-ct', { hasText: 'Claire Moreau' }).locator('[data-ct-suppr]').click();
  await crm.waitForFunction(() => window.__bsStore.get().prospects.find((p) => p.id === 'p-dupont').contacts.length === 3);

  // Une personne déjà reçue qui travaille dans l'entreprise d'un autre prospect : proposée sur sa fiche, en un clic.
  await fiche('p-garnier');
  const recus = crm.locator('.bsli-ct-root .bsli-ct-recus');
  await recus.waitFor();
  assert.match(await recus.innerText(), /1 personne de cette entreprise est déjà dans vos leads LinkedIn : Sophie Garnier/);
  await recus.locator('[data-ct-recus]').click();
  await crm.waitForFunction(() => window.__bsStore.get().prospects.find((p) => p.id === 'p-garnier').contact === 'Sophie Garnier');
  p = await prospect('p-garnier');
  assert.deepEqual(p.contacts.map((c) => c.nom), ['Sophie Garnier']);
  if (process.env.BS_SHOTS) {
    await fiche('p-dupont');
    await crm.locator('.bsli-ct-root .bsli-ct').nth(2).waitFor();
    await crm.locator('.bsli-ct-root').scrollIntoViewIfNeeded();
    await crm.screenshot({ path: join(process.env.BS_SHOTS, 'linkedin-contacts-fiche.png') });
  }

  // « Terminé » : la recherche pour ce prospect est close.
  await crm.evaluate(() => window.__bsY.set({ overlays: [] }));
  await crm.evaluate(() => { location.hash = '#/leads'; });
  await crm.locator('.bsli-pour [data-pour-fin]').click();
  assert.equal(await crm.evaluate(() => localStorage.getItem('bs-linkedin-pour')), null);
  assert.ok(await crm.locator('.bsli-pour').isHidden());
  assert.deepEqual(errors, []);
  await ctx.close();
});
