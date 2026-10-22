// Messagerie dans le vrai CRM : image d'un groupe (création, réglages) et suppression d'un message.
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
  dir = mkdtempSync(join(tmpdir(), 'bs-e2e-msg-'));
  const made = await createApp({ dataDir: dir });
  ({ db, hub } = made);
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);
  browser = await chromium.launch({ executablePath });
});
after(async () => { await browser?.close(); hub?.close(); server?.close(); await db?.close(); rmSync(dir, { recursive: true, force: true }); });

// Une petite image PNG faite dans la page (dégradé), pour l'envoyer au champ fichier.
async function png(page, couleur) {
  const b64 = await page.evaluate((c) => {
    const cv = document.createElement('canvas'); cv.width = 400; cv.height = 300;
    const g = cv.getContext('2d'); g.fillStyle = c; g.fillRect(0, 0, 400, 300);
    g.fillStyle = '#fff'; g.beginPath(); g.arc(200, 150, 90, 0, 7); g.fill();
    return cv.toDataURL('image/png').split(',')[1];
  }, couleur);
  return { name: 'logo.png', mimeType: 'image/png', buffer: Buffer.from(b64, 'base64') };
}

test('image du groupe à la création et dans les réglages, suppression d’un message', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
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

  await page.evaluate(() => { location.hash = '#/groupes'; });
  await page.locator('[data-act="groupe"]').first().click();
  await page.fill('.bsm-modal [name=nom]', 'Commerciaux');
  // Choisir l'image redessine la fenêtre : le nom tapé reste.
  await page.setInputFiles('.bsm-modal .bsm-gfichier', await png(page, '#3b82f6'));
  await page.waitForSelector('.bsm-modal .bsm-gimg .gph');
  assert.equal(await page.inputValue('.bsm-modal [name=nom]'), 'Commerciaux');
  await page.click('.bsm-modal button[type=submit]');
  await page.waitForFunction(() => Object.values(window.bsMessages.etat().convs).some((c) => c.name === 'Commerciaux' && c.photo));
  const id = await page.evaluate(() => Object.values(window.bsMessages.etat().convs).find((c) => c.name === 'Commerciaux').id);
  const r = await page.request.get(base + '/api/chat/groupes/' + id + '/photo');
  assert.equal(r.status(), 200);
  assert.equal(r.headers()['content-type'], 'image/jpeg');

  // Un message, puis sa suppression avec la corbeille.
  await page.fill('.bsm-input', 'Message à supprimer');
  await page.press('.bsm-input', 'Enter');
  const bulle = page.locator('.bsm-msg', { hasText: 'Message à supprimer' });
  await bulle.waitFor();
  await bulle.hover();
  if (SHOTS) { await page.waitForTimeout(4500); await bulle.hover(); await page.screenshot({ path: join(SHOTS, 'messages-corbeille.png') }); }
  await bulle.locator('[data-suppr]').click();
  await bulle.waitFor({ state: 'detached' });
  const msgs = await page.request.get(base + '/api/chat/conversations/' + id + '/messages');
  assert.ok(!(await msgs.json()).messages.some((m) => m.body === 'Message à supprimer'));

  // Réglages du groupe : changer l'image l'enregistre tout de suite, sans perdre le nom modifié.
  await page.locator('[data-act="reglages"]').first().click();
  await page.fill('.bsm-modal [name=nom]', 'Équipe vente');
  const avant = await page.evaluate((i) => window.bsMessages.etat().convs[i].photo, id);
  await page.setInputFiles('.bsm-modal .bsm-gfichier', await png(page, '#10b981'));
  await page.waitForFunction(([i, a]) => window.bsMessages.etat().convs[i].photo !== a, [id, avant]);
  assert.equal(await page.inputValue('.bsm-modal [name=nom]'), 'Équipe vente');
  if (SHOTS) { await page.waitForTimeout(800); await page.screenshot({ path: join(SHOTS, 'messages-image-groupe.png') }); }
  await page.click('.bsm-modal [data-act="photo-retirer"]');
  await page.waitForFunction((i) => !window.bsMessages.etat().convs[i].photo, id);

  assert.deepEqual(errors, []);
  await ctx.close();
});

test('réactions sur les messages envoyés et reçus : palette, liste complète, retrait, temps réel', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '/');
  await page.waitForSelector('input[name=email]');
  if (await page.locator('input[name=name]').count()) await page.fill('input[name=name]', 'Albino');
  await page.fill('input[name=email]', 'albino@exemple.fr');
  await page.fill('input[name=password]', 'motdepasse1');
  await page.click('button[type=submit]');
  await page.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  await page.evaluate(() => { const s = document.getElementById('splash'); if (s) s.remove(); });
  const h = { 'X-Requested-With': 'blackstart' };
  const u = await page.request.post(base + '/api/users', { headers: h, data: { name: 'Marie Dupont', email: 'marie@exemple.fr', password: 'motdepasse-2', role: 'membre' } });
  assert.equal(u.status(), 201);
  const marie = await browser.newContext();
  assert.equal((await marie.request.post(base + '/api/auth/login', { headers: h, data: { email: 'marie@exemple.fr', password: 'motdepasse-2' } })).status(), 200);

  await page.evaluate(() => { location.hash = '#/messages'; });
  await page.waitForSelector('.bsm-input');
  await page.evaluate(() => window.bsMessages.etat && Object.keys(window.bsMessages.etat().convs).length);
  // Un message reçu de Marie : on y réagit avec la palette rapide.
  const recu = (await (await marie.request.post(base + '/api/chat/conversations/equipe/messages', { headers: h, data: { body: 'RDV confirmé avec la boulangerie' } })).json()).message;
  const bulleRecue = page.locator('.bsm-msg', { hasText: 'RDV confirmé' });
  await bulleRecue.waitFor();
  await bulleRecue.hover();
  await bulleRecue.locator('[data-reag]').click();
  await bulleRecue.locator('.bsm-palette [data-reagir="❤️"]').click();
  await bulleRecue.locator('.bsm-reac.on', { hasText: '❤️' }).waitFor();
  // Marie réagit aussi : le compteur passe à 2 sans recharger.
  await marie.request.post(base + `/api/chat/conversations/equipe/messages/${recu.id}/reactions`, { headers: h, data: { emoji: '❤️' } });
  await bulleRecue.locator('.bsm-reac', { hasText: '2' }).waitFor();
  assert.match(await bulleRecue.locator('.bsm-reac').getAttribute('title'), /Vous, Marie Dupont/);

  // Un message envoyé : un emoji de la liste complète, puis Marie réagit (bannière pour l'auteur).
  await page.fill('.bsm-input', 'Devis envoyé au client');
  await page.press('.bsm-input', 'Enter');
  const bulle = page.locator('.bsm-msg.moi', { hasText: 'Devis envoyé' });
  await bulle.waitFor();
  await bulle.hover();
  await bulle.locator('[data-reag]').click();
  await bulle.locator('[data-act="reactions-tout"]').click();
  await bulle.locator('.bsm-palette.tout [data-reagir="🚀"]').click();
  await bulle.locator('.bsm-reac.on', { hasText: '🚀' }).waitFor();
  const mid = Number(await bulle.getAttribute('data-mid'));
  await marie.request.post(base + `/api/chat/conversations/equipe/messages/${mid}/reactions`, { headers: h, data: { emoji: '👍' } });
  await bulle.locator('.bsm-reac:not(.on)', { hasText: '👍' }).waitFor();
  await page.getByText('Marie Dupont a réagi 👍').first().waitFor();
  if (SHOTS) { await bulle.hover(); await bulle.locator('[data-reag]').click(); await page.waitForTimeout(400); await page.screenshot({ path: join(SHOTS, 'messages-reactions.png') }); await page.keyboard.press('Escape'); }
  // Cliquer sa propre réaction la retire.
  await bulle.locator('.bsm-reac', { hasText: '🚀' }).click();
  await bulle.locator('.bsm-reac', { hasText: '🚀' }).waitFor({ state: 'detached' });
  const msgs = (await (await page.request.get(base + '/api/chat/conversations/equipe/messages')).json()).messages;
  assert.deepEqual(msgs.find((m) => m.id === mid).reactions.map((r) => r.emoji), ['👍']);
  assert.deepEqual(errors, []);
  await marie.close(); await ctx.close();
});
