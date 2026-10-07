// Test de bout en bout : le vrai CRM dans Chromium, servi par le serveur, avec deux sessions en parallèle.
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
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-'));
  const made = await createApp({ dataDir: dir });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

async function session() {
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  return page;
}
const prospects = (p) => p.evaluate(() => window.__bsStore.get().prospects.map((x) => x.entreprise));
const version = (p) => p.evaluate(() => window.bsEquipe.etat().version);
// Enregistré : l'app a envoyé ses changements (elle les regroupe 250 ms) et le serveur a une version plus récente.
const saved = (p, v0) => p.waitForFunction((v) => { const s = window.bsEquipe.etat(); return s.version > v && !s.enAttente; }, v0, { timeout: 15000 });
const pull = (p) => p.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
function addProspect(p, nom) {
  return p.evaluate((n) => window.__bsStore.set((s) => ({ prospects: [{ id: 'e2e-' + n, entreprise: n, statut: 'a_appeler', events: [], tags: [] }, ...s.prospects] })), nom);
}

test('premier compte, données partagées et fusion entre deux sessions', async () => {
  const a = await session();
  await a.goto(base + '/');
  assert.match(a.url(), /\/connexion$/);
  await a.fill('input[name=name]', 'Albino');
  await a.fill('input[name=email]', 'albino@exemple.fr');
  await a.fill('input[name=password]', 'motdepasse1');
  await a.click('button[type=submit]');
  await a.waitForURL(base + '/');
  await a.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  assert.equal(await a.evaluate(() => !!window.BS_SERVER && window.bsEquipe.serveur), true);

  // Démo chargée dans la session A : enregistrée sur le serveur.
  let va = await version(a);
  await a.getByText('Charger la démo').first().click();
  await saved(a, va);
  const demo = await prospects(a);
  assert.ok(demo.length > 5);

  // Session B (autre navigateur) : retrouve les mêmes données.
  const b = await session();
  await b.goto(base + '/connexion');
  await b.fill('input[name=email]', 'albino@exemple.fr');
  await b.fill('input[name=password]', 'motdepasse1');
  await b.click('button[type=submit]');
  await b.waitForURL(base + '/');
  await b.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  assert.deepEqual(await prospects(b), demo);

  // Ajout dans A : B le voit à la vérification suivante.
  va = await version(a);
  await addProspect(a, 'Société A1');
  await saved(a, va);
  await pull(b);
  await b.waitForFunction(() => window.__bsStore.get().prospects.some((x) => x.entreprise === 'Société A1'), null, { timeout: 10000 });

  // Ajouts simultanés (B ne connaît pas encore le second ajout de A) : le serveur fusionne, rien n'est perdu.
  va = await version(a);
  const vb = await version(b);
  await addProspect(a, 'Société A2');
  await addProspect(b, 'Société B1');
  await saved(a, va);
  await saved(b, vb);
  await pull(a);
  await a.waitForFunction(() => ['Société A2', 'Société B1'].every((n) => window.__bsStore.get().prospects.some((x) => x.entreprise === n)), null, { timeout: 10000 });
  await pull(b);
  await b.waitForFunction(() => ['Société A1', 'Société A2'].every((n) => window.__bsStore.get().prospects.some((x) => x.entreprise === n)), null, { timeout: 10000 });
  assert.equal((await prospects(a)).length, demo.length + 3);
  assert.deepEqual((await prospects(a)).slice().sort(), (await prospects(b)).slice().sort());

  // Rechargement : les données viennent bien du serveur.
  await b.reload();
  await b.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  assert.equal((await prospects(b)).length, demo.length + 3);

  // Réglages › Équipe & compte.
  await a.evaluate(() => { location.hash = '#/settings'; });
  await a.getByText('Équipe & compte', { exact: true }).first().click();
  await a.getByText('Mon compte').waitFor();
  await a.getByText('Ajouter un membre').waitFor();
  await a.fill('form[data-form=add] input[name=name]', 'Marie Curie');
  await a.fill('form[data-form=add] input[name=email]', 'marie@exemple.fr');
  await a.click('form[data-form=add] button[type=submit]');
  await a.getByText(/Marie Curie peut se connecter/).waitFor();
  await a.getByText('marie@exemple.fr', { exact: true }).waitFor();

  // Ambiances et couleurs d'icônes : enregistrées sur le serveur, retrouvées par l'autre session.
  await a.evaluate(() => window.bsAmbiance.surprise());
  await a.waitForFunction(() => window.bsAmbiance.etat().images.length === 4, null, { timeout: 60000 });
  await a.evaluate(() => { location.hash = '#/settings'; });
  await a.getByText('Icônes du menu', { exact: true }).first().click();
  await a.locator('[data-navsel="prospects"]').click();
  await a.locator('[data-col="sel:#ec4899"]').click();
  await a.waitForTimeout(500);
  await b.reload();
  await b.waitForFunction(() => window.bsAmbiance.etat().pret && window.bsAmbiance.etat().images.length === 4, null, { timeout: 15000 });
  const color = await b.waitForFunction(() => {
    const ic = document.querySelector('.sidebar [data-nav="prospects"] .ic');
    return ic && getComputedStyle(ic).color === 'rgb(236, 72, 153)' && getComputedStyle(ic).color;
  }, null, { timeout: 15000 });
  assert.equal(await color.jsonValue(), 'rgb(236, 72, 153)');
  const img = await b.evaluate(() => fetch('/ambiance/images/' + window.bsAmbiance.etat().images[0].id + '?taille=mini').then((r) => r.status));
  assert.equal(img, 200);

  // Carte clients : les fiches de la démo sont localisées sur la planète.
  await a.evaluate(() => { location.hash = '#/carte'; });
  await a.locator('.bsc-canvas').waitFor();
  // Les compteurs défilent depuis 0 : lire la valeur une fois l'animation terminée.
  const kpi = await (await a.waitForFunction(() => {
    const b = document.querySelector('.bsc-kpi b');
    return b && b.innerText.startsWith(b.dataset.count) && b.innerText;
  }, null, { timeout: 10000 })).jsonValue();
  assert.match(kpi, /^\d+/);
  assert.ok(Number(kpi.match(/^\d+/)[0]) >= 20); // fiches de la démo, hors perdues et résiliées

  // Formations : module vu et quiz enregistrés sur le compte (suivi de l'équipe pour l'administrateur).
  await a.evaluate(() => { location.hash = '#/formations'; });
  await a.locator('.bsf-screen').waitFor();
  await a.click('[data-act="seen"]');
  await a.click('[data-act="quiz"]');
  for (let i = 0; i < 3; i++) { await a.click('.bsf-opt >> nth=0'); await a.click('[data-act="qnext"]'); }
  await a.locator('.bsf-score').waitFor();
  const prog = await a.evaluate(() => fetch('/api/formation').then((r) => r.json()));
  assert.equal(prog.mine['01-prise-en-main'].vu, true);
  assert.ok(prog.equipe.some((u) => u.modules['01-prise-en-main']));

  assert.deepEqual(a.errors, []);
  assert.deepEqual(b.errors, []);
});
