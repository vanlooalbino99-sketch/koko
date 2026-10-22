// Langue de l'interface : passage en anglais depuis le menu du compte, menus et pages traduits, retour au français.
// BS_LANGUE_MANQUES=fichier.json : écrit les textes encore en français, page par page (pour compléter i18n/en).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createApp } from '../server/src/app.js';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SHOTS = process.env.BS_SHOTS;
const MANQUES = process.env.BS_LANGUE_MANQUES;
const PAGES = ['today', 'agenda', 'prospects', 'leads', 'pipeline', 'tasks', 'telephone', 'mail', 'devis', 'clients', 'payments', 'campagnes', 'modeles',
  'contenu', 'sources', 'assistants', 'automatisations', 'messages', 'groupes', 'visio', 'entrainement', 'dashboard', 'reports', 'carte', 'marche',
  'formations', 'tools', 'settings'];
let server, base, dir, db, hub, browser;

before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-langue-'));
  const made = await createApp({ dataDir: dir });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

// Textes visibles qui ont encore l'air français (accents ou petits mots français).
const restes = (page) => page.evaluate(() => {
  const FR = /[àâçéèêëîïôûùüÿœæÀÂÇÉÈÊËÎÏÔÛÙÜŸŒ«»]|\b(le|la|les|des|du|une|et|ou|pour|avec|sans|vos|votre|aucun|aucune|cette|sur|dans|par)\b/i;
  const out = new Set();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const p = n.parentElement;
    if (!p || p.closest('script,style,textarea,.bsm-txt,[translate=no],[data-brut]')) continue;
    const t = n.data.replace(/\s+/g, ' ').trim();
    if (t && FR.test(t) && p.getClientRects().length) out.add(t);
  }
  for (const el of document.querySelectorAll('[title],[placeholder],[aria-label]')) {
    for (const a of ['title', 'placeholder', 'aria-label']) { const v = el.getAttribute(a); if (v && FR.test(v)) out.add(v); }
  }
  return [...out];
});

test('anglais : choisi dans le menu du compte, menus et pages traduits, retour au français', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 950 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (d) => d.accept());
  await page.goto(base + '/');
  await page.fill('input[name=name]', 'Albino');
  await page.fill('input[name=email]', 'albino@exemple.fr');
  await page.fill('input[name=password]', 'motdepasse1');
  await page.click('button[type=submit]');
  await page.waitForURL(base + '/');
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.getByText('Charger la démo').first().click();
  await page.waitForFunction(() => window.__bsStore.get().prospects.length > 5);

  await page.click('.bs-moi');
  await page.click('[data-moi="langue"]');
  await page.waitForFunction(() => window.bsLangue && window.bsLangue.langue === 'en');
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.evaluate(() => { const s = document.getElementById('splash'); if (s) s.remove(); });
  assert.equal(await page.getAttribute('html', 'lang'), 'en');
  const menu = (await page.locator('nav a, nav button, aside a, aside button').allTextContents()).map((t) => t.trim());
  for (const t of ['Today', 'Calendar', 'Prospects', 'Dashboard', 'Settings', 'Quotes & invoices']) assert.ok(menu.some((x) => x.includes(t)), t);
  assert.ok(!menu.some((x) => /Réglages|Tableau de bord|Tâches/.test(x)), 'plus de français dans le menu');
  // Les données saisies restent telles quelles.
  await page.evaluate(() => { location.hash = '#/prospects'; });
  await page.getByText('Plomberie Martin & Fils').first().waitFor();
  if (SHOTS) { await page.evaluate(() => { location.hash = '#/today'; }); await page.waitForTimeout(1200); await page.screenshot({ path: join(SHOTS, 'langue-anglais.png') }); }

  const manques = {};
  for (const p of PAGES) {
    await page.evaluate((h) => { location.hash = '#/' + h; }, p);
    await page.waitForTimeout(700);
    const r = await restes(page);
    if (r.length) manques[p] = r;
  }
  if (MANQUES) writeFileSync(MANQUES, JSON.stringify(manques, null, 1));

  await page.click('.bs-moi');
  assert.equal((await page.textContent('[data-moi="langue"]')).trim(), 'Passer en français');
  await page.click('[data-moi="langue"]');
  await page.waitForFunction(() => window.bsLangue && window.bsLangue.langue === 'fr');
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  const menuFr = (await page.locator('nav a, nav button, aside a, aside button').allTextContents()).join(' ');
  assert.match(menuFr, /Réglages/);
  assert.deepEqual(errors, []);
  await ctx.close();
});
