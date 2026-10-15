// node gametest2.cjs jeu.html — Tana : course puis balade libre (STEPS=desert,tana,libre)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const THREE_DIR = '/tmp/claude-0/-home-user-koko/ed968d4b-db68-5680-8af3-faace8015916/scratchpad/t/node_modules/three';
const file = path.resolve(process.argv[2]), OUT = path.join(__dirname, 'shots');
const W = +(process.env.W || 960), H = +(process.env.H || 540), PFX = process.env.PFX || 't';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await b.newPage({ viewport: { width: W, height: H }, hasTouch: !!process.env.TOUCH, isMobile: !!process.env.TOUCH });
  const logs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => logs.push('pageerror: ' + e.message));
  await page.route('https://cdn.jsdelivr.net/npm/three@0.160.0/**', r => { const fp = path.join(THREE_DIR, r.request().url().replace('https://cdn.jsdelivr.net/npm/three@0.160.0/', '')); fs.existsSync(fp) ? r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(fp) }) : r.fulfill({ status: 404, body: '' }); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  if (process.env.QUAL) await page.addInitScript(q => localStorage.setItem('nitrocanyon.v1', JSON.stringify({ quality: q })), process.env.QUAL);
  const t0 = Date.now(), el = () => ((Date.now() - t0) / 1000).toFixed(0) + 's';
  await page.goto('file://' + file);
  try { await page.waitForFunction(() => window.__nc && window.__nc.G.mode === 'garage', null, { timeout: 400000, polling: 1000 }); } catch (e) { logs.push('garage jamais atteint'); }
  logs.push('garage ' + el());
  const shot = async n => { try { await page.screenshot({ path: path.join(OUT, PFX + '_' + n + '.png'), timeout: 400000 }); logs.push('capture ' + n + ' ' + el()); } catch (e) { logs.push('capture ratée ' + n + ': ' + e.message); } };
  const waitT = async gt => { const t = await page.evaluate(() => window.__nc.G.time); await page.waitForFunction(x => window.__nc.G.time > x, t + gt, { timeout: 600000, polling: 500 }); };
  const info = async tag => logs.push(tag + ' ' + JSON.stringify(await page.evaluate(() => { const n = window.__nc, P = n.PLAYER; if (!P) return { mode: n.G.mode }; return { mode: n.G.mode, v: +(P.V.speed * 3.6).toFixed(0), s: +(P.V.s || 0).toFixed(0), surf: P.V.surface, pos: [+P.V.pos.x.toFixed(1), +P.V.pos.y.toFixed(1), +P.V.pos.z.toFixed(1)], hit: +P.V.hitWall.toFixed(2), traf: n.TRAF.cars.length, cars: n.CARS.map(c => [c.name, +c.progress.toFixed(0), +(c.V.speed * 3.6).toFixed(0)]) }; })));
  const steps = (process.env.STEPS || 'tana,libre').split(',');
  if (steps.includes('garage')) await shot('garage');
  if (steps.includes('desert')){
    await page.evaluate(() => { window.__nc.SV.dest = 'desert'; window.__nc.startRace(); });
    await waitT(4.6); await page.keyboard.down('KeyW'); await waitT(2.5); await shot('desert'); await page.keyboard.up('KeyW'); await info('desert');
    await page.evaluate(() => window.__nc.enterGarage()); await waitT(0.3);
  }
  if (steps.includes('tana')){
    await page.evaluate(() => { window.__nc.SV.dest = 'tana'; window.__nc.startRace(); });
    await page.waitForFunction(() => window.__nc.G.mode === 'race', null, { timeout: 600000, polling: 1000 }); logs.push('tana prête ' + el());
    await waitT(1.0); await shot('tana_intro');
    await waitT(3.6); await page.keyboard.down('KeyW'); await waitT(3); await shot('tana_race'); await info('tana');
    for (const f of (process.env.SPOTS || '0.35,0.7').split(',').map(Number)){
      await page.evaluate(f => { const n = window.__nc, P = n.PLAYER, T = n.ACTIVE.track, s = T.length * f, o = T.sample(s); P.V.reset(o.x, o.y, o.z, Math.atan2(o.tx, o.tz)); P.V.s = s; P.prevS = s; P.V.vel.set(o.tx * 20, 0, o.tz * 20); n.CARS.forEach((c, i) => { if (c !== P){ const q = T.sample(s + 10 + i * 8); c.V.reset(q.x + q.rx * (i % 2 ? 2 : -2), q.y, q.z + q.rz * (i % 2 ? 2 : -2), Math.atan2(q.tx, q.tz)); c.V.s = s + 10 + i * 8; c.prevS = c.V.s; } }); }, f);
      await waitT(1.5); await shot('tana_spot_' + f); await info('spot ' + f);
    }
    await page.keyboard.up('KeyW');
    await page.evaluate(() => window.__nc.enterGarage()); await waitT(0.3); await shot('garage_after');
  }
  if (steps.includes('libre')){
    await page.evaluate(() => { window.__nc.SV.dest = 'libre'; window.__nc.startRace(); });
    await page.waitForFunction(() => window.__nc.G.mode === 'free', null, { timeout: 600000, polling: 1000 }); logs.push('libre prête ' + el());
    await page.keyboard.down('KeyW'); await waitT(3); await shot('libre1'); await info('libre');
    await page.keyboard.up('KeyW');
    const ds = await page.evaluate(() => (window.__nc.TANA.districts || []).map(d => d.name));
    logs.push('quartiers ' + JSON.stringify(ds));
    for (const k of (process.env.DIST || '1,3').split(',').map(Number)){
      await page.evaluate(k => { const n = window.__nc, d = n.TANA.districts[k % n.TANA.districts.length], P = n.PLAYER; const T = n.TANA; let best = null, bd = 1e18; for (const L of T.trafficLoops) for (let i = 0; i < L.length; i++){ const p = L[i], q = L[(i + 1) % L.length], dd = (p[0] - d.x) ** 2 + (p[2] - d.z) ** 2; if (dd < bd){ bd = dd; best = [p, q]; } } const [p, q] = best; P.V.reset(p[0], n.ACTIVE.ground(p[0], p[2]).y, p[2], Math.atan2(q[0] - p[0], q[2] - p[2])); }, k);
      await page.keyboard.down('KeyW'); await waitT(1.6); await page.keyboard.up('KeyW'); await shot('libre_d' + k); await info('district ' + k);
    }
    // Collision avec un mur : on fonce perpendiculairement
    await page.keyboard.down('KeyW'); await page.keyboard.down('KeyD'); await waitT(2); await page.keyboard.up('KeyD'); await page.keyboard.up('KeyW'); await info('après virage');
  }
  await b.close();
  console.log(logs.join('\n'));
})();
