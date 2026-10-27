// Page Rapports & analyses : KPI, graphiques dessinés, info-bulle du graphique de performance, période, export CSV.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createApp } from '../server/src/app.js';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let server, base, dir, db, hub, browser;

before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-rap-'));
  const made = await createApp({ dataDir: dir });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

test('Rapports : KPI, graphiques, info-bulle, période et export', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '/');
  await page.fill('input[name=name]', 'Vanloo Albino');
  await page.fill('input[name=email]', 'albino@exemple.fr');
  await page.fill('input[name=password]', 'motdepasse1');
  await page.click('button[type=submit]');
  await page.waitForURL(base + '/');
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.getByText('Charger la démo').first().click();
  await page.waitForFunction(() => window.__bsStore.get().prospects.length > 5);
  await page.evaluate(() => { location.hash = '#/reports'; });
  await page.waitForSelector('.bsr-kpi');
  assert.equal(await page.locator('.bsr-kpi').count(), 4);
  assert.deepEqual(await page.locator('.bsr-kpi-t small').allTextContents(), ['Prospects contactés', 'Rendez-vous obtenus', 'Taux de conversion', 'Revenus générés']);
  // Les chiffres viennent du calcul mensuel sur les vraies fiches.
  const m = await page.evaluate(() => window.bsRapports.mensuel());
  const der = m[m.length - 1];
  assert.equal(m.length, 6);
  // Prospects contactés sur la période : chaque fiche comptée une fois, même appelée plusieurs mois.
  const n = Number((await page.locator('.bsr-kpi-t > b').first().textContent()).trim());
  assert.ok(n >= Math.max(...m.map((x) => x.contactes)) && n <= m.reduce((s, x) => s + x.contactes, 0), 'prospects contactés ' + n);
  for (const g of ['perf', 'ca', 'creneaux', 'mrr']) assert.ok(await page.locator(`[data-g=${g}] svg`).count(), 'graphique ' + g);
  await page.waitForSelector('[data-g=equipe] svg, [data-g=equipe] .bsr-vide');
  assert.ok(der.ca >= 0 && der.cum >= der.ca);

  // Survol du graphique de performance : info-bulle du mois.
  const g = page.locator('[data-g=perf]');
  const b = await g.boundingBox();
  await page.mouse.move(b.x + b.width * 0.7, b.y + b.height / 2);
  await page.waitForSelector('[data-g=perf] .bsr-bulle');

  // Période : 12 derniers mois.
  await page.locator('.bsr-per-b').click();
  await page.getByText('12 derniers mois').click();
  await page.waitForFunction(() => window.bsRapports.mensuel().length === 12);

  // Export CSV.
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByText('Exporter le rapport').click()]);
  const csv = readFileSync(await dl.path(), 'utf8');
  assert.match(csv, /Mois;/);
  assert.equal(csv.trim().split('\n').length, 13);
  assert.deepEqual(errors, []);
  await ctx.close();
});
