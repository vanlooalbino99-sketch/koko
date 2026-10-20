// Animation des icônes du menu (Réglages › Icônes du menu) : désactivée par défaut, « Au survol » ou « Fun »,
// gardée dans ce navigateur, coupée quand l'interface ou l'appareil demande moins d'animations.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { assemble } from '../scripts/build.mjs';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const CRM = 'https://crm.blackstart.test/';
let browser, html;
before(async () => {
  html = assemble();
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); });

async function ouvrir(ctx) {
  const page = await ctx.newPage();
  await page.goto(CRM);
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.evaluate(() => document.getElementById('splash')?.remove());
  return page;
}
const animDe = (page, id) => page.evaluate((i) => getComputedStyle(document.querySelector('.sidebar button[data-nav="' + i + '"] .ic')).animationName, id);

test('icônes du menu animées : désactivées, au survol, fun, et coupées si moins d’animations', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
  await ctx.route(CRM + '**', (route) => route.fulfill({ contentType: 'text/html; charset=utf-8', body: html }));
  const page = await ouvrir(ctx);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  assert.equal(await page.evaluate(() => document.documentElement.getAttribute('data-bsi-anim')), 'non');
  assert.equal(await animDe(page, 'today'), 'none');

  await page.evaluate(() => { location.hash = '#/settings'; });
  await page.locator('.sn-item', { hasText: 'Icônes du menu' }).click();
  await page.getByRole('tab', { name: 'Fun' }).click();
  assert.equal(await page.evaluate(() => document.documentElement.getAttribute('data-bsi-anim')), 'fun');
  assert.equal(await animDe(page, 'today'), 'bsi-sonne-v', 'le téléphone sonne dans la vague');
  assert.equal(await animDe(page, 'mail'), 'bsi-vole-v');
  assert.equal(await animDe(page, 'payments'), 'bsi-pivote-v');
  const delais = await page.evaluate(() => ['today', 'agenda', 'prospects'].map((i) => getComputedStyle(document.querySelector('.sidebar button[data-nav="' + i + '"] .ic')).animationDelay));
  assert.deepEqual(delais, ['1s', '1.3s', '1.6s'], 'une vague qui descend le menu');
  await page.locator('.sidebar button[data-nav="carte"]').hover();
  assert.equal(await animDe(page, 'carte'), 'bsi-tourne', 'au survol : son geste, tout de suite');
  await page.getByText('Une vague parcourt le menu').waitFor();

  // Au survol : rien ne bouge seul, sauf la rubrique ouverte (une fois) et celle survolée.
  await page.getByRole('tab', { name: 'Au survol' }).click();
  await page.mouse.move(700, 600);
  assert.equal(await animDe(page, 'today'), 'none');
  assert.equal(await animDe(page, 'settings'), 'bsi-tourne', 'rubrique ouverte');
  await page.locator('.sidebar button[data-nav="mail"]').hover();
  assert.equal(await animDe(page, 'mail'), 'bsi-vole');

  // Gardé dans ce navigateur.
  await page.reload();
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  assert.equal(await page.evaluate(() => document.documentElement.getAttribute('data-bsi-anim')), 'survol');

  // « Réduire les animations » : coupé, et le réglage le dit.
  await page.evaluate(() => { document.getElementById('splash')?.remove(); document.documentElement.setAttribute('data-motion', 'reduced'); window.bsIcones.animation('fun'); });
  assert.equal(await animDe(page, 'today'), 'none');
  await page.evaluate(() => { location.hash = '#/settings'; });
  await page.locator('.sn-item', { hasText: 'Icônes du menu' }).click();
  await page.getByText('coupe les animations').waitFor();
  await page.getByRole('tab', { name: 'Désactivée' }).click();
  assert.equal(await page.evaluate(() => localStorage.getItem('bs-icones-anim')), 'non');
  assert.deepEqual(errors, []);
  await ctx.close();
});
