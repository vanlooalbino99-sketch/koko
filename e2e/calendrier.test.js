// Page Calendrier : semaine (rendez-vous des prospects et tâches), créneau libre → planifier, fiche,
// vues mois et jour, mini-calendrier, fuseau horaire.
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
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-cal-'));
  const made = await createApp({ dataDir: dir });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

test('Calendrier : semaine, planifier un créneau, fiche, mois, jour, fuseau horaire', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Europe/Paris' });
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
  // Un rendez-vous connu cette semaine, à 14 h 30 heure de Paris.
  const id = await page.evaluate(() => {
    const s = window.__bsStore.get(), p = s.prospects.find((x) => x.statut === 'a_appeler'), d = new Date();
    const j = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    window.__bsStore.set({ prospects: s.prospects.map((x) => x.id === p.id ? { ...x, prochaineRelance: j, prochaineRelanceHeure: '14:30' } : x) });
    return p.id;
  });
  assert.equal(await page.textContent('.sidebar button[data-nav="agenda"]').then((t) => t.trim().replace(/\d+$/, '')), 'Calendrier');
  await page.evaluate(() => { location.hash = '#/agenda'; });
  await page.waitForSelector('.bscal');
  assert.equal(await page.textContent('.bscal-tete h1'), 'Calendrier');
  assert.equal(await page.locator('.bscal-jt').count(), 7);
  assert.equal(await page.locator('.bscal-jt.auj').count(), 1);
  const ev = page.locator(`.bscal-ev[data-ev="p:${id}"]`);
  assert.match(await ev.textContent(), /14:30 – 15:00.*Appel - /);
  assert.ok(await page.locator('.bscal-stats li').count() === 3);

  // Clic sur le rendez-vous : sa fiche.
  await ev.click();
  await page.waitForFunction((i) => window.__bsY.get().overlays.some((o) => o.type === 'prospect' && o.id === i), id);
  await page.evaluate(() => window.__bsY.set({ overlays: [] }));

  // Créneau libre (première heure de la grille, mercredi) : fenêtre « Planifier » à la bonne date et heure.
  const col = page.locator('.bscal-col').nth(2);
  await col.scrollIntoViewIfNeeded();
  const b = await col.boundingBox(), jourCol = await col.getAttribute('data-col'), h0 = Number(await col.getAttribute('data-h0'));
  await page.mouse.click(b.x + 6, b.y + 8);
  const o = await page.evaluate(() => window.__bsY.get().overlays.find((x) => x.type === 'schedule'));
  assert.deepEqual([o.date, o.heure], [jourCol, String(h0).padStart(2, '0') + ':00']);
  await page.evaluate(() => window.__bsY.set({ overlays: [] }));

  // Fuseau de Madagascar (UTC+3, Paris +1 ou +2) : le même rendez-vous s'affiche une ou deux heures plus tard.
  await page.selectOption('[data-tz]', 'Indian/Antananarivo');
  assert.match(await page.locator(`.bscal-ev[data-ev="p:${id}"]`).textContent(), /(15|16):30 – (16|17):00/);
  await page.selectOption('[data-tz]', 'Europe/Paris');

  // Vue mois puis jour (clic sur une case du mois).
  await page.click('[data-vue=mois]');
  assert.ok(await page.locator('.bscal-mc').count() >= 28);
  await page.click('.bscal-mc.auj > b');
  assert.equal(await page.getAttribute('[data-vue=jour]', 'aria-selected'), 'true');
  assert.equal(await page.locator('.bscal-jt').count(), 1);
  // Mini-calendrier : un autre jour.
  await page.locator('.bscal-mini-g button:not(.auj):not(.hors)').first().click();
  assert.notEqual(await page.locator('.bscal-jt b').textContent(), null);

  assert.deepEqual(errors, []);
  await ctx.close();
});
