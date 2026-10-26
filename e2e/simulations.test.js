// Simulations IA dans le vrai CRM : trois colonnes, appel au clavier avec le prospect sans IA (pas de clé Claude ici),
// note sur 100 et six compétences, recommandations, vos prospects du CRM, version téléphone.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createApp } from '../server/src/app.js';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SHOTS = process.env.BS_SHOTS;
let server, base, dir, db, hub, browser;

before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-simu-'));
  const made = await createApp({ dataDir: dir });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

const shot = (page, nom) => (SHOTS ? page.screenshot({ path: join(SHOTS, nom + '.png') }) : null);

async function dire(page, texte) {
  const champ = page.locator('input[name=reponse]');
  await champ.waitFor();
  await page.waitForFunction(() => { const c = document.querySelector('input[name=reponse]'); return c && !c.disabled; });
  await champ.fill(texte);
  await champ.press('Enter');
}

test('simulations IA : scénarios, appel au clavier, note et compétences, prospects du CRM', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1536, height: 1024 } });
  // Sans son : le prospect « parle » sans attendre la synthèse vocale du navigateur.
  await ctx.addInitScript(() => { if (!localStorage.getItem('bs-entrainement')) localStorage.setItem('bs-entrainement', JSON.stringify({ son: false, mode: 'clavier' })); });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '/');
  await page.fill('input[name=name]', 'Albino Vanloo');
  await page.fill('input[name=email]', 'albino@exemple.fr');
  await page.fill('input[name=password]', 'motdepasse1');
  await page.click('button[type=submit]');
  await page.waitForURL(base + '/');
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.getByText('Charger la démo').first().click();
  await page.waitForFunction(() => window.__bsStore.get().prospects.length > 5);
  await page.evaluate(() => { const s = document.getElementById('splash'); if (s) s.remove(); });

  // Menu : « Simulations IA » juste sous « Aujourd'hui ».
  const menu = (await page.locator('aside a, aside button, nav a, nav button').allTextContents()).map((t) => t.trim()).filter(Boolean);
  const iA = menu.findIndex((t) => t.includes('Aujourd')), iS = menu.findIndex((t) => t.includes('Simulations IA'));
  assert.ok(iS > iA && iS - iA <= 2, 'Simulations IA sous Aujourd’hui : ' + menu.slice(0, 6).join(' | '));
  assert.ok(!menu.some((t) => /Entraînement/.test(t)));

  await page.evaluate(() => { location.hash = '#/entrainement'; });
  await page.locator('.bsent-3').waitFor();
  assert.equal((await page.textContent('.page-title')).trim(), 'Simulations IA');
  // Trois colonnes côte à côte sur grand écran.
  const cols = await page.evaluate(() => ['.bsent-g', '.bsent-c', '.bsent-d'].map((s) => document.querySelector(s).getBoundingClientRect()).map((r) => [Math.round(r.left), Math.round(r.top)]));
  assert.ok(cols[0][0] < cols[1][0] && cols[1][0] < cols[2][0], 'trois colonnes : ' + JSON.stringify(cols));
  assert.equal(await page.locator('.bsent-g [data-scenario]').count(), 7);
  await page.locator('.bsent-c h2', { hasText: 'Vente de solution IA B2B' }).waitFor();
  await page.locator('.bsent-d', { hasText: 'Thomas Bernard' }).waitFor();
  await page.locator('.bsent-d', { hasText: 'Faites un premier appel sur ce scénario' }).waitFor();
  await shot(page, 'simulations-1-scenario');

  // Filtre et recherche.
  await page.click('[data-filtre=objections]');
  assert.equal(await page.locator('.bsent-g [data-scenario]').count(), 1);
  await page.click('[data-filtre=tout]');
  await page.fill('input[name=recherche]', 'hôtel');
  assert.equal(await page.locator('.bsent-g [data-scenario]:visible').count(), 1);
  await page.fill('input[name=recherche]', '');

  // Objection prix : appel au clavier jusqu'au rendez-vous.
  await page.click('[data-scenario=prix]');
  await page.locator('.bsent-c h2', { hasText: 'Objection prix' }).waitFor();
  await page.locator('.bsent-d', { hasText: 'Marc Lefèvre' }).waitFor();
  await page.click('[data-act=demarrer]');
  await page.locator('.bsent-fil .bsent-bulle.lui', { hasText: 'Marc Lefèvre' }).waitFor();
  assert.equal(await page.locator('.bsent-pill.direct').count(), 1);
  await dire(page, 'Bonjour Monsieur Lefèvre, je suis Albino de Blackstart AI. Merci de me rappeler, comment se passent vos chantiers en ce moment ?');
  await page.locator('.bsent-fil .bsent-bulle.lui').nth(1).waitFor();
  await dire(page, 'Je comprends tout à fait, le prix compte. Combien de devis perdez-vous chaque mois faute de relance, à votre avis ?');
  await page.locator('.bsent-fil .bsent-bulle.lui').nth(2).waitFor();
  await shot(page, 'simulations-2-appel');
  await dire(page, 'Justement, le CRM relance vos devis automatiquement : deux chantiers gagnés de plus et il est remboursé. Vous gagnez du temps chaque semaine.');
  await page.locator('.bsent-fil .bsent-bulle.lui').nth(3).waitFor();
  await dire(page, 'Je vous propose un rendez-vous de 20 minutes : mardi 10 h ou jeudi 14 h, qu’est-ce qui vous arrange ?');
  await page.locator('.bsent-fil .bsent-bulle.lui').nth(4).waitFor();
  await page.click('.bsent-barre [data-act=raccrocher]').catch(() => {});

  // Note, compétences et recommandations.
  await page.locator('.bsent-onglets [data-pane=analyse]:not([hidden]) .bsent-score').waitFor();
  const barres = await page.locator('.bsent-bl b').allTextContents();
  assert.equal(barres.length, 6);
  assert.ok(barres.every((b) => /^\d+$/.test(b) && +b <= 100), barres.join(','));
  await page.locator('.bsent-anneau b').waitFor();
  await page.locator('.bsent-d', { hasText: 'Note estimée sans IA' }).waitFor();
  assert.equal(await page.locator('.bsent-claude').count(), 0, 'pas de badge Claude sans Claude');
  assert.ok(await page.locator('.bsent-exos button').count() >= 1);
  await page.locator('.bsent-g .bsent-histo', { hasText: 'Objection prix' }).waitFor();
  await shot(page, 'simulations-3-analyse');
  await page.click('[data-onglet=transcription]');
  await page.locator('[data-pane=transcription] .bsent-tl', { hasText: 'mardi 10 h' }).waitFor();
  await page.click('[data-onglet=notes]');
  await page.fill('textarea[name=notes]', 'Relancer sur le délai, pas sur le prix.');

  // Un exercice recommandé ouvre son scénario ; les notes restent sur le scénario d'origine.
  const exo = await page.locator('.bsent-exos button').first().getAttribute('data-scenario');
  await page.locator('.bsent-exos button').first().click();
  await page.waitForFunction((id) => document.querySelector('.bsent-sc.on') && document.querySelector('.bsent-sc.on').getAttribute('data-scenario') === id, exo);
  await page.click('[data-scenario=prix]');
  await page.click('[data-onglet=notes]');
  assert.equal(await page.inputValue('textarea[name=notes]'), 'Relancer sur le délai, pas sur le prix.');

  // Vos prospects : un prospect du CRM, sa fiche s'ouvre depuis le profil.
  await page.click('[data-filtre=crm]');
  const nb = await page.locator('.bsent-g [data-prospect]').count();
  assert.ok(nb >= 3, 'prospects du CRM : ' + nb);
  await page.locator('.bsent-g [data-prospect]').first().click();
  await page.locator('.bsent-c h2', { hasText: 'Appel : ' }).waitFor();
  await page.locator('.bsent-d', { hasText: 'Score IA du lead' }).waitFor();
  const fiche = await page.inputValue('textarea[name=fiche]');
  const p = await page.evaluate(() => { const id = document.querySelector('.bsent-sc.on').getAttribute('data-prospect'); return window.__bsStore.get().prospects.find((x) => x.id === id); });
  if (p.contact) for (const m of p.contact.split(/\s+/).filter((x) => x.length > 2)) assert.ok(!fiche.includes(m), 'pas de nom de contact dans la fiche');
  if (p.email) assert.ok(!fiche.includes(p.email));
  await page.click('[data-act=fiche-prospect]');
  await page.waitForFunction(() => (window.__bsY.get().overlays || []).some((o) => o.type === 'prospect'));
  await page.keyboard.press('Escape');
  await shot(page, 'simulations-4-prospect');

  // Téléphone : une colonne, le scénario choisi en premier.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { location.hash = '#/today'; });
  await page.waitForTimeout(300);
  await page.evaluate(() => { location.hash = '#/entrainement'; });
  await page.locator('.bsent-3').waitFor();
  await page.waitForTimeout(800); // fin de l'animation d'entrée de la page
  const larg = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  assert.ok(larg[0] <= larg[1] + 1, 'pas de défilement horizontal : ' + larg);
  const ordre = await page.evaluate(() => ['.bsent-c', '.bsent-d', '.bsent-g'].map((s) => Math.round(document.querySelector(s).getBoundingClientRect().top)));
  assert.ok(ordre[0] < ordre[1] && ordre[1] < ordre[2], 'centre, droite puis scénarios : ' + ordre);
  await shot(page, 'simulations-5-mobile');

  assert.deepEqual(errors, []);
  await ctx.close();
});
