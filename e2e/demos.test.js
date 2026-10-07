// Test de bout en bout des CRM de démonstration (demos/*.html) : chaque fichier s'ouvre tel quel dans Chromium.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const DEMOS = ['immobilier', 'renovation', 'courtage'];
const url = (nom) => pathToFileURL(fileURLToPath(new URL(`../demos/${nom}.html`, import.meta.url))).href;
let browser;

before(async () => {
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); });

async function ouvrir(nom, viewport) {
  const ctx = await browser.newContext({ viewport });
  // Pas de réseau : la démo doit fonctionner hors ligne (seule la police Google est facultative).
  await ctx.route(/^https?:/, (r) => r.abort());
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  await page.goto(url(nom));
  await page.waitForFunction(() => window.CRM && window.CRM.state().deals.length > 0);
  return { ctx, page };
}

for (const nom of DEMOS) {
  test(`${nom} : vues, pipeline, persistance`, async () => {
    const { ctx, page } = await ouvrir(nom, { width: 1440, height: 900 });
    const etat = () => page.evaluate(() => {
      const s = window.CRM.state();
      return { deals: s.deals.filter((d) => !d.archived).map((d) => ({ id: d.id, stageId: d.stageId })), stages: s.stages.map((x) => x.id) };
    });
    const avant = await etat();
    assert.ok(avant.deals.length >= 15, 'au moins 15 affaires de démonstration');
    assert.ok(avant.stages.length >= 5, 'au moins 5 étapes');

    // Toutes les vues s'affichent sans erreur.
    const vues = await page.$$eval('[data-view]', (els) => [...new Set(els.map((e) => e.dataset.view))]);
    for (const v of ['dashboard', 'pipeline', 'tasks', 'settings']) assert.ok(vues.includes(v), `vue ${v}`);
    for (const v of vues) {
      await page.locator(`[data-view="${v}"]:visible`).first().click();
      await page.waitForTimeout(150);
    }

    // Le kanban affiche une carte par affaire ouverte, dans la bonne colonne.
    await page.locator('[data-view="pipeline"]:visible').first().click();
    await page.waitForSelector('[data-stage-id] [data-deal-id]');
    const d = avant.deals[0];
    assert.equal(await page.locator(`[data-stage-id="${d.stageId}"] [data-deal-id="${d.id}"]`).count(), 1);

    // Déplacement, puis rechargement : l'étape est conservée.
    const cible = avant.stages.find((s) => s !== d.stageId);
    await page.evaluate(([id, s]) => window.CRM.move(id, s), [d.id, cible]);
    await page.reload();
    await page.waitForFunction(() => window.CRM && window.CRM.state().deals.length > 0);
    const apres = await etat();
    assert.equal(apres.deals.find((x) => x.id === d.id).stageId, cible);
    assert.equal(apres.deals.length, avant.deals.length);

    assert.deepEqual(page.errors, []);
    await ctx.close();
  });

  test(`${nom} : utilisable au téléphone`, async () => {
    const { ctx, page } = await ouvrir(nom, { width: 390, height: 844 });
    for (const v of ['dashboard', 'pipeline', 'tasks']) {
      await page.locator(`[data-view="${v}"]:visible`).first().click();
      await page.waitForTimeout(150);
      const deborde = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert.equal(deborde, false, `pas de défilement horizontal sur ${v}`);
    }
    assert.deepEqual(page.errors, []);
    await ctx.close();
  });
}
