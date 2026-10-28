// Icônes deux tons : celles de l'interface (boutons, onglets…) suivent le style « Pleines » du menu, la sélection active
// est une pilule bleue, et Réglages › Icônes du menu propose 2 405 icônes deux tons chargées à la demande.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createApp } from '../server/src/app.js';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let server, base, dir, db, hub, browser;

before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-ic2-'));
  const made = await createApp({ dataDir: dir });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

test('icônes deux tons : interface, sélection active et bibliothèque des Réglages', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
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
  await page.evaluate(() => document.getElementById('splash')?.remove());

  // Icônes de l'interface en deux tons (partie claire à opacité réduite), et retour aux traits avec le style « Traits ».
  assert.match(await page.evaluate(() => window.bsIcones.plein('phone')), /opacity="\.4"/);
  await page.evaluate(() => { location.hash = '#/settings'; });
  await page.locator('.sn-item', { hasText: 'Icônes du menu' }).click();
  const actif = page.locator('.sn-item.active');
  assert.equal(await actif.evaluate((e) => getComputedStyle(e).color), 'rgb(255, 255, 255)');
  assert.match(await actif.locator('svg').innerHTML(), /opacity/);

  // Bibliothèque deux tons : chargée à la demande, recherche en français.
  await page.waitForFunction(() => window.bsIcones2Tons && document.querySelectorAll('.bsi-grid .bsi-ic').length > 5, null, { timeout: 20000 });
  assert.equal(Object.keys(await page.evaluate(() => window.bsIcones2Tons.d)).length, 2405);
  await page.fill('[data-q]', 'téléphone');
  await page.waitForFunction(() => document.querySelector('.bsi-grid .bsi-ic[data-ic^="ph-phone"], .bsi-grid .bsi-ic[data-ic^="ix-call"]'));

  // Choisir une icône deux tons pour « Formations » : le menu change et garde le style « Pleines ».
  const nom = await page.locator('.bsi-grid .bsi-ic').first().getAttribute('data-ic');
  await page.locator('.bsi-grid .bsi-ic').first().click();
  await page.waitForFunction((n) => window.bsIcones.choix().formations === n, nom);
  assert.equal(await page.evaluate(() => document.documentElement.getAttribute('data-bsi-forme')), 'pleine');
  const svgMenu = () => page.evaluate(() => document.querySelector('.sidebar [data-nav="formations"] svg').innerHTML);
  // (le navigateur réécrit les balises : on compare au même tracé passé par le navigateur)
  await page.waitForFunction((n) => {
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); t.innerHTML = window.bsIcones2Tons.d[n];
    return document.querySelector('.sidebar [data-nav="formations"] svg').innerHTML === t.innerHTML;
  }, nom);

  // Après rechargement, l'icône vient du cache de ce navigateur, sans recharger la bibliothèque.
  const avant = await svgMenu();
  await page.reload();
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.evaluate(() => { document.getElementById('splash')?.remove(); location.hash = '#/'; });
  await page.waitForFunction((s) => document.querySelector('.sidebar [data-nav="formations"] svg')?.innerHTML === s, avant);
  assert.equal(await page.evaluate(() => !!window.bsIcones2Tons), false);

  // Style « Traits » : les icônes de l'interface repassent au trait.
  await page.evaluate(() => { location.hash = '#/settings'; });
  await page.locator('.sn-item', { hasText: 'Icônes du menu' }).click();
  await page.getByRole('tab', { name: 'Traits', exact: true }).first().click();
  await page.waitForFunction(() => document.documentElement.getAttribute('data-bsi-forme') === 'trait');
  assert.equal(await page.evaluate(() => window.bsIcones.plein('phone')), '');
  assert.deepEqual(errors, []);
  await ctx.close();
});
