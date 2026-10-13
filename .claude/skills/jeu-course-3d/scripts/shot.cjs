// Capture d'un assemblage de morceaux : node shot.cjs sortie.png morceau1.js morceau2.js ... [--w 960 --h 540 --timeout 500]
// Le premier morceau doit être b_core.js (il ouvre <script type="module">). Le dernier ferme le script (</script>),
// construit sa scène, fait ses rendus puis pose window.__previewReady = true (et window.__previewInfo = {...}).
const { chromium } = (() => { try { return require('playwright'); } catch (e) { return require('/opt/node22/lib/node_modules/playwright'); } })();
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf('--' + k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const W = +opt('w', 960), H = +opt('h', 540), TO = +opt('timeout', 500) * 1000;
const out = path.resolve(args[0]), parts = args.slice(1);
const THREE_DIR = process.env.THREE_DIR || path.resolve(__dirname, '../../../../node_modules/three'); // npm i three@0.160.0
let body = parts.map(p => fs.readFileSync(p, 'utf8')).join('\n');
if (!/<\/script>\s*$/.test(body)) body += '\n</script>';
const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%;overflow:hidden;background:#000}canvas{display:block;width:100%;height:100%;position:fixed;inset:0}</style>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}</script></head><body>
<script>window.addEventListener('error',e=>{window.__previewError=String(e.message)});window.addEventListener('unhandledrejection',e=>{window.__previewError=String(e.reason&&e.reason.stack||e.reason)});</script>
${body}</body></html>`;
const tmp = out.replace(/\.png$/, '') + '.tmp.html'; fs.writeFileSync(tmp, html);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await b.newPage({ viewport: { width: W, height: H } });
  const logs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => logs.push('pageerror: ' + e.message));
  await page.route('https://cdn.jsdelivr.net/npm/three@0.160.0/**', r => { const fp = path.join(THREE_DIR, r.request().url().replace('https://cdn.jsdelivr.net/npm/three@0.160.0/', '')); fs.existsSync(fp) ? r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(fp) }) : r.fulfill({ status: 404, body: '' }); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  const t0 = Date.now(); let ok = true;
  await page.goto('file://' + tmp);
  try { await page.waitForFunction(() => window.__previewReady === true || window.__previewError, null, { timeout: TO, polling: 500 }); } catch (e) { ok = false; logs.push('délai dépassé'); }
  const info = await page.evaluate(() => ({ err: window.__previewError || null, info: window.__previewInfo || null })).catch(() => ({}));
  if (info.err){ ok = false; logs.push('erreur: ' + info.err); }
  try { await page.screenshot({ path: out, timeout: TO }); } catch (e) { ok = false; logs.push('capture: ' + e.message); }
  await b.close();
  console.log((ok ? 'OK ' : 'ÉCHEC ') + out + ' ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');
  if (info.info) console.log('info ' + JSON.stringify(info.info));
  if (logs.length) console.log(logs.join('\n'));
})();
