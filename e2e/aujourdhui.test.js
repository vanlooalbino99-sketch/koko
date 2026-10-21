// Page « Aujourd'hui » dans le vrai CRM : chiffres du jour, prospects (onglets, recherche, sélection, actions),
// assistant IA (choix de l'assistant, question sans clé Claude), performance et activités.
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
  delete process.env.ANTHROPIC_API_KEY;
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-auj-'));
  const made = await createApp({ dataDir: dir });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

test('Aujourd’hui : chiffres, prospects, actions, assistant IA', async () => {
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

  // Sans prospect : l'accueil d'origine ; avec la démo : la nouvelle page.
  await page.getByText('Charger la démo').first().click();
  await page.waitForSelector('.bsaj');
  assert.match(await page.textContent('.bsaj-tete h1'), /^Bon(jour|soir) Vanloo/);
  assert.equal(await page.locator('.bsaj-kpi').count(), 4);
  assert.deepEqual(await page.locator('.bsaj-kpi-l').allTextContents(), ['Nouveaux prospects', 'Messages envoyés', 'Réponses reçues', 'Rendez-vous planifiés']);

  const total = await page.evaluate(() => window.__bsStore.get().prospects.length);
  assert.equal(await page.textContent('.bsaj-onglet.on'), `Tous (${total})`);
  assert.equal(await page.locator('.bsaj-table tbody tr').count(), 8);
  assert.match(await page.textContent('.bsaj-pied'), new RegExp(`1–8 sur ${total}`));

  // Onglet « Clients » : seulement des clients.
  await page.click('.bsaj-onglet:has-text("Clients")');
  const statuts = await page.locator('.bsaj-table tbody .bsaj-statut').allTextContents();
  assert.ok(statuts.length > 0 && statuts.every((s) => s === 'Client'));
  await page.click('.bsaj-onglet:has-text("Tous")');

  // Recherche.
  const nom = await page.evaluate(() => window.__bsStore.get().prospects[3].entreprise);
  await page.fill('[data-q]', nom);
  await page.waitForFunction((n) => { const r = document.querySelectorAll('.bsaj-table tbody tr'); return r.length >= 1 && [...r].every((x) => x.textContent.includes(n)); }, nom);
  await page.fill('[data-q]', '');

  // Actions de la ligne : e-mail, fiche.
  const avecMail = page.locator('.bsaj-table tbody tr').filter({ has: page.locator('[data-mail]:not([disabled])') }).first();
  await avecMail.locator('[data-mail]').click();
  await page.waitForFunction(() => window.__bsY.get().overlays.some((o) => o.type === 'email'));
  await page.evaluate(() => window.__bsY.set({ overlays: [] }));
  await page.locator('.bsaj-table tbody tr').first().locator('td').nth(1).click();
  await page.waitForFunction(() => window.__bsY.get().overlays.some((o) => o.type === 'prospect'));
  await page.evaluate(() => window.__bsY.set({ overlays: [] }));

  // Sélection de deux lignes → la session d'appels enchaîne ces deux prospects.
  const ids = await page.locator('.bsaj-table tbody [data-sel]').evaluateAll((l) => l.slice(0, 2).map((x) => x.dataset.sel));
  for (const id of ids) await page.check(`[data-sel="${id}"]`);
  assert.match(await page.textContent('.bsaj-sel'), /2 sélectionnés/);
  await page.click('[data-act="appeler-sel"]');
  await page.waitForFunction(() => window.__bsY.get().session);
  assert.deepEqual(await page.evaluate(() => window.__bsY.get().session.ids), ids);
  await page.evaluate(() => window.__bsY.set({ overlays: [], session: null }));

  // Assistant IA : l'administrateur voit toute l'équipe IA ; sans clé Claude, la réponse le dit.
  await page.waitForSelector('[data-z=ia] .bsas-card');
  assert.match(await page.textContent('[data-z=ia] .bsas-t b'), /Assistant IA - Vanloo 2\.0/);
  await page.click('[data-z=ia] [data-act=menu]');
  assert.equal(await page.locator('[data-z=ia] [data-choisir]').count(), 8);
  await page.click('[data-z=ia] [data-choisir="vp_sales"]');
  assert.equal(await page.textContent('[data-z=ia] .bsas-t b'), 'VP Sales');
  await page.fill('[data-z=ia] .bsas-champ', 'Fais la revue de mon pipeline');
  await page.press('[data-z=ia] .bsas-champ', 'Enter');
  await page.waitForSelector('[data-z=ia] .bsas-bulle.info');
  assert.match(await page.textContent('[data-z=ia] .bsas-bulle.info'), /Claude n’est pas encore branché/);

  // Performance et activités.
  await page.selectOption('[data-f=periode]', '30');
  await page.waitForFunction(() => /sur 30 jours/.test(document.querySelector('.bsaj-perf').textContent));
  assert.ok(await page.locator('.bsaj-acts-l li').count() > 0);

  assert.deepEqual(errors, []);
  await ctx.close();
});
