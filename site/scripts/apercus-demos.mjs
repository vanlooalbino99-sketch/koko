// Aperçus animés des démos CRM (page /demos et accueil) : un curseur parcourt chaque démo,
// enregistré par Chromium puis encodé en MP4 (H.264) + image d'affiche.
// Usage : node scripts/apercus-demos.mjs [slug…]   (depuis site/, ffmpeg requis)
// PLAYWRIGHT_MODULE et CHROMIUM permettent de pointer vers une installation locale.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const DEMOS = resolve('public/demos');
const OUT = join(DEMOS, 'apercus');
const W = 1280, H = 800;
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : ['immobilier', 'renovation', 'courtage', 'consultant', 'formation'];

// Curseur dessiné dans la page : il suit les vrais événements souris, avec un halo à chaque clic.
const CURSOR = () => {
  const s = document.createElement('style');
  s.textContent = `#bs-cur{position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px);filter:drop-shadow(0 3px 6px rgb(0 0 0/.35))}
  #bs-cur svg{width:26px;height:26px}
  .bs-ring{position:fixed;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:3px solid #3b82f6;z-index:2147483646;pointer-events:none;animation:bs-ring .55s ease-out forwards}
  @keyframes bs-ring{from{transform:scale(.3);opacity:1}to{transform:scale(1.4);opacity:0}}`;
  document.head.appendChild(s);
  const c = document.createElement('div');
  c.id = 'bs-cur';
  c.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 2.5l15 9.2-6.6 1.5-3.3 6.3z" fill="#111827" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  document.body.appendChild(c);
  const move = (e) => { c.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 3}px)`; };
  addEventListener('mousemove', move, true);
  addEventListener('dragover', move, true);
  addEventListener('mousedown', (e) => {
    const r = document.createElement('div');
    r.className = 'bs-ring'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
    document.body.appendChild(r); setTimeout(() => r.remove(), 600);
  }, true);
};

let pos = { x: W * 0.62, y: H * 0.5 };
async function glide(page, x, y, ms = 700) {
  const steps = Math.max(12, Math.round(ms / 16));
  const from = { ...pos };
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    await page.mouse.move(from.x + (x - from.x) * e, from.y + (y - from.y) * e);
    await page.waitForTimeout(ms / steps);
  }
  pos = { x, y };
}
async function centre(page, loc) {
  const b = await loc.boundingBox();
  return b && { x: b.x + Math.min(b.width / 2, 120), y: b.y + b.height / 2 };
}
async function clickOn(page, loc, pause = 900) {
  if (!(await loc.count())) return false;
  await loc.first().scrollIntoViewIfNeeded().catch(() => {});
  const p = await centre(page, loc.first());
  if (!p) return false;
  await glide(page, p.x, p.y);
  await page.waitForTimeout(180);
  await page.mouse.down(); await page.waitForTimeout(90); await page.mouse.up();
  await page.waitForTimeout(pause);
  return true;
}

async function tour(page) {
  const views = await page.$$eval('#nav button[data-view], .nav-btn[data-view]', (b) => b.map((x) => x.dataset.view));
  const pick = (re) => views.find((v) => new RegExp(re, 'i').test(v));
  const board = views.find((v) => /pipe|mandat|dossier|chantier|mission|demande/i.test(v)) || views[1];
  const go = (v) => v && clickOn(page, page.locator(`#nav button[data-view="${v}"], .sidebar .nav-btn[data-view="${v}"]`), 1300);

  await glide(page, W * 0.45, H * 0.35, 900);
  await page.waitForTimeout(700);
  // Pipeline : déplacer une carte vers l'étape suivante, puis l'ouvrir.
  if (await go(board)) {
    const card = page.locator('.col [draggable="true"]').first();
    const cols = page.locator('.col');
    if ((await card.count()) && (await cols.count()) > 1) {
      const a = await centre(page, card);
      const colIdx = await card.evaluate((el) => [...document.querySelectorAll('.col')].indexOf(el.closest('.col')));
      const target = cols.nth(Math.min(colIdx + 1, (await cols.count()) - 1));
      const tb = await target.boundingBox();
      await glide(page, a.x, a.y);
      await page.waitForTimeout(250);
      await page.mouse.down();
      await glide(page, tb.x + tb.width / 2, tb.y + 140, 1100);
      await page.mouse.up();
      await page.waitForTimeout(1100);
      await clickOn(page, page.locator('.col [draggable="true"]').nth(1), 1700);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
    }
  }
  // Deux autres écrans métier, puis la recherche Ctrl+K.
  const others = views.filter((v) => !/dash|pipe|setting|reglage|contact|compan|entreprise/i.test(v)).slice(0, 2);
  for (const v of others) {
    await go(v);
    await glide(page, W * (0.4 + Math.random() * 0.3), H * (0.4 + Math.random() * 0.25), 900);
    await page.waitForTimeout(500);
  }
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(400);
  await page.keyboard.type('ma', { delay: 140 });
  await page.waitForTimeout(1100);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await go(pick('dash'));
  await glide(page, W * 0.62, H * 0.5, 900);
  await page.waitForTimeout(600);
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
for (const slug of slugs) {
  const file = join(DEMOS, slug + '.html');
  if (!existsSync(file)) { console.warn('absent :', file); continue; }
  const dir = mkdtempSync(join(tmpdir(), 'apercu-'));
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, colorScheme: 'light', recordVideo: { dir, size: { width: W, height: H } } });
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(CURSOR);
  await page.waitForTimeout(1200);
  await page.keyboard.press('Escape');
  for (const sel of ['.tour button:has-text("Passer")', '.tour button:has-text("Fermer")', '.tour [data-act="close"]']) {
    const b = page.locator(sel); if (await b.count()) await b.first().click().catch(() => {});
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.mouse.move(pos.x, pos.y);
  const start = (Date.now() - t0) / 1000 + 0.2;
  await tour(page);
  const dur = (Date.now() - t0) / 1000 - start;
  await ctx.close();
  const webm = join(dir, readdirSync(dir).find((f) => f.endsWith('.webm')));
  const mp4 = join(OUT, slug + '.mp4');
  execFileSync('mkdir', ['-p', OUT]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(start), '-i', webm, '-t', String(dur),
    '-vf', 'scale=960:-2,fps=24', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-frames:v', '1', '-q:v', '4', join(OUT, slug + '.jpg')]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`✔ ${slug} — ${dur.toFixed(1)} s`);
}
await browser.close();
