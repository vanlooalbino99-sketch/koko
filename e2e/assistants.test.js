// Assistants IA et Automatisations dans le vrai CRM, avec un faux Claude : compétences métier (méthode, amorce,
// compétence lancée en un clic), actions appliquées, règles automatiques qui créent tâches et relances.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { createApp } from '../server/src/app.js';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SHOTS = process.env.BS_SHOTS || '';
let server, base, dir, db, hub, browser, page;
const demandes = [];
let prochaine = null;
const reponse = (o) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(o) }] });
const faux = () => ({
  models: { retrieve: async (m) => ({ id: m }) },
  beta: { messages: { create: async (p) => { demandes.push(p); const r = prochaine; prochaine = null; return r || reponse({ texte: 'D’accord.', actions: [] }); } } },
});
const vide = { prospect: '', titre: '', date: '', heure: '', statut: '', objet: '', texte: '', canal: '' };
const deux = (n) => (n < 10 ? '0' : '') + n;
const jour = (d) => d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate());
const dans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return jour(d); };

before(async () => {
  delete process.env.ANTHROPIC_API_KEY;
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-ia-'));
  const made = await createApp({ dataDir: dir, ia: { creer: faux } });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
  page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
  await page.goto(base + '/');
  await page.fill('input[name=name]', 'Vanloo Albino');
  await page.fill('input[name=email]', 'albino@exemple.fr');
  await page.fill('input[name=password]', 'motdepasse1');
  await page.click('button[type=submit]');
  await page.waitForURL(base + '/');
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.getByText('Charger la démo').first().click();
  await page.waitForSelector('.bsaj');
  const st = await page.evaluate(() => fetch('/api/ia/cle', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' }, body: JSON.stringify({ cle: 'sk-ant-api03-' + 'x'.repeat(40) }) }).then((r) => r.status));
  assert.equal(st, 200);
  await page.evaluate(() => { const s = document.getElementById('splash'); if (s) s.remove(); });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

test('Assistants IA : 6 compétences par assistant, méthode, amorce, compétence lancée et actions appliquées', async () => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  // Profil en haut à droite : nom complet et rôle.
  assert.equal(await page.textContent('.bs-moi .nm b'), 'Vanloo Albino');
  assert.equal(await page.textContent('.bs-moi .nm small'), 'Admin');

  await page.evaluate(() => { location.hash = '#/assistants'; });
  await page.waitForSelector('.bsasp-carte');
  assert.equal(await page.locator('.bsasp-carte').count(), 8);
  assert.equal(await page.locator('.bsasp-carte .bsasp-missions button').count(), 48);
  assert.deepEqual([...new Set(await page.locator('.bsasp-comp-h').allTextContents())], ['6 compétences']);
  assert.equal(await page.locator('.bsasp-bandeau').count(), 0, 'la clé Claude est prise en compte sans recharger');

  // La conversation affiche les compétences de l'assistant choisi, avec leur méthode.
  await page.click('[data-ouvrir-ia=membre] .bsasp-c-tete');
  await page.waitForSelector('.bsasp-chat .bsas-comp-r');
  assert.equal(await page.locator('.bsasp-chat .bsas-comp-r').count(), 6);
  await page.locator('.bsasp-chat .bsas-comp-m').first().click();
  assert.match(await page.textContent('.bsasp-chat .bsas-comp-r.ouvert p'), /Classe les appels dans cet ordre/);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, 'assistants-competences.png') });

  // Compétence qui a besoin d'un détail : le champ est pré-rempli, rien ne part avant l'envoi.
  const n0 = demandes.length;
  await page.click('.bsasp-chat .bsas-comp-go:has-text("Répondre à une objection")');
  assert.equal(await page.inputValue('.bsasp-chat .bsas-champ'), 'Aide-moi à répondre à cette objection : ');
  assert.equal(demandes.length, n0);
  prochaine = reponse({ texte: 'Je comprends. Trop cher par rapport à quoi ?', actions: [] });
  await page.type('.bsasp-chat .bsas-champ', 'c’est trop cher');
  await page.press('.bsasp-chat .bsas-champ', 'Enter');
  await page.waitForSelector('.bsasp-chat .bsas-bulle.ia:not(.bsas-intro):not(.bsas-ecrit)');
  let d = demandes.at(-1);
  assert.match(d.system, /Compétence demandée maintenant : « Répondre à une objection »/);
  assert.match(d.messages.at(-1).content, /trop cher/);
  assert.equal(await page.textContent('.bsasp-chat .bsas-bulle.moi .bsas-tag'), 'Répondre à une objection');

  // VP Sales : « Revue du pipeline » lancée depuis sa carte, deux actions proposées puis appliquées.
  prochaine = reponse({ texte: 'Deux affaires à reprendre.', actions: [
    { ...vide, type: 'note', prospect: 'P1', texte: 'Relancer avant vendredi' },
    { ...vide, type: 'tache', titre: 'Appeler le décideur', date: dans(1), heure: '10:00' },
  ] });
  await page.click('[data-lancer="vp_sales:0"]');
  await page.waitForFunction(() => document.querySelectorAll('.bsasp-chat .bsas-action').length === 2);
  d = demandes.at(-1);
  assert.match(d.system, /VP Sales/);
  assert.match(d.system, /Compétence demandée maintenant : « Revue du pipeline »/);
  assert.match(d.system, /Grille BANT/, 'les méthodes des autres compétences partent aussi');
  assert.equal(d.output_config.effort, 'medium');
  const contacts = await page.evaluate(() => window.__bsStore.get().prospects.map((p) => p.contact).filter((c) => c && c.length > 4));
  assert.ok(contacts.length > 0);
  for (const c of contacts) assert.ok(!JSON.stringify(d).includes(c), 'aucun nom de contact ne part chez Claude : ' + c);
  assert.equal(await page.locator('.bsasp-chat .bsas-bulle.moi .bsas-tag').last().textContent(), 'Revue du pipeline');
  if (SHOTS) await page.screenshot({ path: join(SHOTS, 'assistants-actions.png') });
  await page.click('.bsasp-chat .bsas-tout');
  await page.waitForFunction(() => {
    const s = window.__bsStore.get();
    return s.tasks.some((t) => t.title === 'Appeler le décideur') && s.prospects.some((p) => (p.events || []).some((e) => e.text === 'Relancer avant vendredi (VP Sales)'));
  });
  assert.equal(await page.locator('.bsasp-chat .bsas-ok').count(), 2);
  assert.deepEqual(errors, []);
});

test('Automatisations : rubrique dans le menu, règles, relance automatique d’une proposition, règle coupée', async () => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.evaluate(() => { location.hash = '#/automatisations'; });
  await page.waitForSelector('.bsau-regle');
  assert.equal(await page.locator('.bsau-regle').count(), 10);
  assert.equal(await page.locator('.bsau-regle input[data-regle]').count(), 9);

  // Proposition envoyée → relance dans 3 jours et tâche.
  const p = await page.evaluate(() => window.__bsStore.get().prospects.find((x) => x.statut === 'a_appeler'));
  await page.evaluate((id) => window.__bsStore.set((s) => ({ prospects: s.prospects.map((x) => (x.id === id ? { ...x, statut: 'proposition_envoyee' } : x)) })), p.id);
  await page.waitForFunction((id) => window.__bsStore.get().tasks.some((t) => t.prospectId === id && /^Relancer la proposition/.test(t.title)), p.id);
  const apres = await page.evaluate((id) => window.__bsStore.get().prospects.find((x) => x.id === id), p.id);
  assert.equal(apres.prochaineRelance, dans(3));
  assert.ok(apres.events.some((e) => /Relance de la proposition programmée/.test(e.text)));
  await page.waitForSelector('.bsau-journal li');
  assert.match(await page.textContent('.bsau-journal'), /Relance de la proposition programmée/);

  // Règle coupée : un client signé ne crée plus la check-list.
  await page.click('.bsau-switch:has(input[data-regle=client_lancement])');
  await page.waitForFunction(() => (window.__bsStore.get().automatisations.regles || {}).client_lancement?.actif === false);
  const q = await page.evaluate(() => window.__bsStore.get().prospects.find((x) => x.statut === 'rdv_pris' || x.statut === 'audit_realise'));
  await page.evaluate((id) => window.__bsStore.set((s) => ({ prospects: s.prospects.map((x) => (x.id === id ? { ...x, statut: 'client_signe' } : x)) })), q.id);
  await page.waitForTimeout(800);
  assert.equal(await page.evaluate((id) => window.__bsStore.get().tasks.filter((t) => t.prospectId === id && /^Réunion de lancement/.test(t.title)).length, q.id), 0);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, 'automatisations.png') });
  assert.deepEqual(errors, []);
});
