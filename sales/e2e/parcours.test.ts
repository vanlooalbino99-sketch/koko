// Parcours complet dans un vrai navigateur, contre « next start » et une base PGlite jetable :
// inscription, onboarding, dashboard, catalogue, création et modification d'un scénario, langue,
// déconnexion et reconnexion, puis isolation entre deux comptes.
// Prérequis : npm run build. BS_SHOTS=dossier pour enregistrer des captures d'écran.
import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { chromium, type Browser, type Page } from 'playwright';

const PORT = 3000 + Math.floor(Math.random() * 1000) + 400;
const BASE = `http://127.0.0.1:${PORT}`;
const SHOTS = process.env.BS_SHOTS;
const dataDir = mkdtempSync(join(tmpdir(), 'bs-sales-e2e-'));
let server: ChildProcess;
let browser: Browser;
// Dernière page ouverte : capturée à la fin pour comprendre un échec.
let lastPage: Page | undefined;

async function waitForHealth() {
  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return;
    } catch {
      // le serveur démarre
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('le serveur ne répond pas');
}

async function shot(page: Page, name: string) {
  if (!SHOTS) return;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(SHOTS, `${name}.png`), fullPage: true });
}

before(async () => {
  // Groupe de processus à part : on arrête le serveur et ses enfants d'un coup à la fin.
  server = spawn('node_modules/.bin/next', ['start', '-p', String(PORT), '-H', '127.0.0.1'], {
    env: { ...process.env, PGLITE_DIR: dataDir, ALLOW_LOCAL_DB: '1', INSECURE_COOKIES: '1', DATABASE_URL: '' },
    stdio: ['ignore', 'ignore', 'pipe'],
    detached: true,
  });
  server.stderr?.on('data', (d) => process.stderr.write(d));
  await waitForHealth();
  browser = await chromium.launch();
});

after(async () => {
  if (SHOTS && lastPage && !lastPage.isClosed()) {
    await lastPage.screenshot({ path: join(SHOTS, 'derniere-page.png'), fullPage: true }).catch(() => {});
  }
  await browser?.close();
  if (server?.pid) process.kill(-server.pid, 'SIGTERM');
  rmSync(dataDir, { recursive: true, force: true });
});

async function signUp(page: Page, name: string, email: string) {
  await page.goto(`${BASE}/signup`);
  await page.getByLabel('Prénom et nom').fill(name);
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Mot de passe').fill('motdepasse-solide');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await page.waitForURL(`${BASE}/onboarding`);
}

async function onboard(page: Page) {
  await page.getByText('Indépendant ou freelance').click();
  await page.getByText('Confirmé', { exact: true }).click();
  await page.getByText('Traitement des objections', { exact: true }).click();
  await page.getByText('Conclusion', { exact: true }).click();
  await page.getByLabel('Offre ou produit').fill('Assistant téléphonique IA');
  await page.getByRole('button', { name: 'Voir mon tableau de bord' }).click();
  await page.waitForURL(`${BASE}/dashboard`);
}

test('parcours complet d\'un nouvel utilisateur', async () => {
  const context = await browser.newContext({ locale: 'fr-FR', viewport: { width: 1440, height: 900 } });
  context.setDefaultTimeout(15_000);
  const page = await context.newPage();
  lastPage = page;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(BASE);
  await assert.doesNotReject(page.getByRole('heading', { level: 1 }).waitFor());
  await shot(page, '01-accueil');

  // Les pages protégées renvoient vers la connexion.
  await page.goto(`${BASE}/dashboard`);
  await page.waitForURL(`${BASE}/login`);

  const email = `albino.${Date.now()}@example.com`;
  await signUp(page, 'Albino Test', email);
  // Sans onboarding, le dashboard renvoie vers l'onboarding.
  await page.goto(`${BASE}/dashboard`);
  await page.waitForURL(`${BASE}/onboarding`);
  await shot(page, '02-onboarding');
  await onboard(page);

  await assert.doesNotReject(page.getByRole('heading', { name: 'Bonjour Albino' }).waitFor());
  assert.equal(await page.getByText('Pas encore de score').count(), 1, 'aucun score inventé');
  assert.equal(await page.getByText('Aucune simulation pour l\'instant.').count(), 1);
  const recommended = page.locator('section[aria-labelledby="reco"] a[href^="/scenarios/"]');
  assert.equal(await recommended.count(), 3);
  await shot(page, '03-dashboard');

  // Catalogue : 16 scénarios, filtre par langue, recherche.
  await page.getByRole('link', { name: 'Scénarios', exact: true }).first().click();
  await page.waitForURL(`${BASE}/scenarios`);
  await assert.doesNotReject(page.getByText('16 scénarios').waitFor());
  await page.getByLabel("Langue de l'appel").selectOption('fr');
  await page.getByRole('button', { name: 'Filtrer' }).click();
  await assert.doesNotReject(page.getByText('8 scénarios').waitFor());
  await shot(page, '04-scenarios');

  // Un scénario du catalogue ne montre jamais ses informations cachées.
  await page.getByRole('link', { name: /plombier/ }).click();
  await assert.doesNotReject(page.getByRole('heading', { name: /plombier/ }).waitFor());
  assert.equal(await page.getByText('Informations cachées').count(), 0);
  assert.equal(await page.getByText('dizaine d\'appels').count(), 0);
  await shot(page, '05-scenario-catalogue');

  // Création d'un scénario privé.
  await page.goto(`${BASE}/scenarios/new`);
  assert.equal(await page.getByLabel('Nom de l\'offre').inputValue(), 'Assistant téléphonique IA', 'offre reprise du profil');
  await page.getByRole('button', { name: 'Créer le scénario' }).click();
  await assert.doesNotReject(page.getByText('Vérifiez les champs signalés.').waitFor());
  await page.getByLabel('Titre').fill('Relance d\'un garage automobile');
  await page.getByLabel('Résumé en une phrase').fill('Relancer un garagiste après une démo.');
  await page.getByLabel('Secteur').fill('Automobile');
  await page.getByLabel('Objectif du vendeur').fill('Obtenir une date de décision.');
  await page.getByLabel('Nom', { exact: true }).fill('Karim Benali');
  await page.getByLabel('Fonction').fill('Gérant');
  await page.getByLabel('Entreprise', { exact: true }).fill('Garage Benali');
  await page.getByLabel('Besoin réel').fill('Ne plus rater les appels pendant les réparations.');
  await page.getByLabel('Budget', { exact: true }).fill('100 € par mois');
  await page.getByLabel('Objections (une par ligne)').fill('Trop cher\nPas le temps');
  await page.getByLabel('Informations cachées (une par ligne)').fill('Son associé veut un essai gratuit');
  await page.getByLabel('Critères de réussite (un par ligne)').fill('Date de décision obtenue');
  await page.getByRole('button', { name: 'Créer le scénario' }).click();
  await assert.doesNotReject(page.getByText('Scénario créé.').waitFor());
  assert.equal(await page.getByText('Son associé veut un essai gratuit').count(), 1, 'l\'auteur voit ses infos cachées');
  assert.equal(await page.getByText(/^poids \d$/).count(), 6, 'pondération par défaut des compétences');
  const privateUrl = page.url().split('?')[0];
  await shot(page, '06-scenario-prive');

  // Modification : nouvelle version.
  await page.getByRole('link', { name: 'Modifier' }).click();
  await page.getByLabel('Titre').fill('Relance d\'un garage automobile indépendant');
  await page.getByRole('button', { name: 'Enregistrer une nouvelle version' }).click();
  await assert.doesNotReject(page.getByText('Nouvelle version enregistrée.').waitFor());
  await assert.doesNotReject(page.getByText(/Version 2/).waitFor());

  // Langue anglaise, enregistrée sur le compte.
  await page.locator('header').getByRole('button', { name: 'en', exact: true }).click();
  await assert.doesNotReject(page.getByRole('link', { name: 'Dashboard' }).first().waitFor());
  await page.goto(`${BASE}/dashboard`);
  await assert.doesNotReject(page.getByRole('heading', { name: 'Hello Albino' }).waitFor());
  await page.locator('header').getByRole('button', { name: 'fr', exact: true }).click();
  await assert.doesNotReject(page.getByRole('heading', { name: 'Bonjour Albino' }).waitFor());

  // Déconnexion puis reconnexion.
  await page.goto(`${BASE}/settings`);
  await shot(page, '07-reglages');
  await page.getByRole('main').getByRole('button', { name: 'Se déconnecter' }).click();
  await page.waitForURL(`${BASE}/login`);
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Mot de passe').fill('mauvais-mot-de-passe');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await assert.doesNotReject(page.getByText('E-mail ou mot de passe incorrect.').waitFor());
  await page.getByLabel('Mot de passe').fill('motdepasse-solide');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.waitForURL(`${BASE}/dashboard`);

  // Un autre compte ne voit pas le scénario privé.
  const other = await browser.newContext({ locale: 'fr-FR' });
  const otherPage = await other.newPage();
  await signUp(otherPage, 'Bob Autre', `bob.${Date.now()}@example.com`);
  await onboard(otherPage);
  const res = await otherPage.goto(privateUrl);
  assert.equal(res?.status(), 404);
  await otherPage.goto(`${BASE}/scenarios?scope=private`);
  await assert.doesNotReject(otherPage.getByText("Vous n'avez pas encore de scénario privé.").waitFor());
  await other.close();

  // Mobile : menu et pages lisibles sans défilement horizontal.
  const mobile = await browser.newContext({ locale: 'fr-FR', viewport: { width: 390, height: 844 }, storageState: await context.storageState() });
  const m = await mobile.newPage();
  await m.goto(`${BASE}/dashboard`);
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 1, `débordement horizontal de ${overflow}px`);
  await shot(m, '08-mobile-dashboard');
  await mobile.close();

  assert.deepEqual(errors, [], 'aucune erreur JavaScript');
  await context.close();
});
