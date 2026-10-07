// Génère app/modules/bs-carte-geo.js : fond de carte vectoriel de la « Carte clients ».
// Pays du monde (Natural Earth 1:50m près de l'Europe, 1:110m ailleurs) et départements français (101).
// Outil ponctuel, hors build. Dépendances à installer temporairement :
//   npm i --no-save world-atlas topojson-client datamaps
//   node scripts/gen-carte-geo.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const NEAR = [-26, 26, 46, 72]; // lon min, lat min, lon max, lat max : Europe et Maghreb en 1:50m

function rings(geom) {
  if (!geom) return [];
  if (geom.type === 'Polygon') return geom.coordinates;
  if (geom.type === 'MultiPolygon') return geom.coordinates.flat();
  return [];
}
function bbox(rs) {
  let a = 180, b = 90, c = -180, d = -90;
  rs.forEach((r) => r.forEach(([x, y]) => { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); }));
  return [a, b, c, d];
}
function near(bb) { return !(bb[2] < NEAR[0] || bb[0] > NEAR[2] || bb[3] < NEAR[1] || bb[1] > NEAR[3]); }
// Simplification (Douglas-Peucker) et abandon des îlots minuscules : fichier plus léger, tracé identique à l'écran.
function simplify(r, tol) {
  if (r.length < 5) return r;
  const keep = new Uint8Array(r.length); keep[0] = keep[r.length - 1] = 1;
  const st = [[0, r.length - 1]];
  while (st.length) {
    const [a, b] = st.pop(); let md = 0, mi = -1;
    const [x1, y1] = r[a], [x2, y2] = r[b], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    for (let i = a + 1; i < b; i++) {
      const d = L < 1e-9 ? Math.hypot(r[i][0] - x1, r[i][1] - y1) : Math.abs(dy * r[i][0] - dx * r[i][1] + x2 * y1 - y2 * x1) / L; // anneau fermé : distance au point
      if (d > md) { md = d; mi = i; }
    }
    if (md > tol) { keep[mi] = 1; st.push([a, mi], [mi, b]); }
  }
  return r.filter((_, i) => keep[i]);
}
function clean(rs, tol, minSpan) {
  return rs.map((r) => simplify(r, tol)).filter((r) => { const bb = bbox([r]); return r.length >= 4 && Math.max(bb[2] - bb[0], bb[3] - bb[1]) >= minSpan; });
}
// Anneau → chaîne compacte : centièmes de degré, en différences, séparées par des virgules.
function enc(r, q) {
  let px = 0, py = 0; const out = [];
  r.forEach(([x, y]) => {
    const ix = Math.round(x * q), iy = Math.round(y * q);
    if (out.length && ix === px && iy === py) return;
    out.push(ix - px, iy - py); px = ix; py = iy;
  });
  return out.length >= 6 ? out.join(',') : null;
}

const w50 = require('world-atlas/countries-50m.json'), w110 = require('world-atlas/countries-110m.json');
const f50 = feature(w50, w50.objects.countries).features, f110 = feature(w110, w110.objects.countries).features;
const pays = [];
f110.forEach((f) => {
  const rs = rings(f.geometry); if (!rs.length) return;
  const bb = bbox(rs);
  if (near(bb)) {
    const hi = f50.find((g) => g.id === f.id || g.properties.name === f.properties.name);
    if (hi) { pays.push({ n: f.properties.name, q: 100, r: rings(hi.geometry) }); return; }
  }
  pays.push({ n: f.properties.name, q: 10, r: rs });
});
// Petits pays et îles d'Europe absents du 1:110m (Malte, Andorre, Monaco, Luxembourg…).
f50.forEach((g) => {
  if (pays.some((p) => p.n === g.properties.name)) return;
  const rs = rings(g.geometry); if (!rs.length || !near(bbox(rs))) return;
  pays.push({ n: g.properties.name, q: 100, r: rs });
});

// Départements : TopoJSON de datamaps (Natural Earth, admin 1), extrait du fichier distribué.
const src = readFileSync(require.resolve('datamaps/dist/datamaps.fra.js'), 'utf8');
const start = src.indexOf('fraTopo = ') + 'fraTopo = '.length;
let depth = 0, end = start;
for (; end < src.length; end++) { if (src[end] === '{') depth++; else if (src[end] === '}' && --depth === 0) break; }
const fra = JSON.parse(src.slice(start, end + 1));
const dep = feature(fra, fra.objects.fra).features.map((f) => ({ n: f.properties.name, q: 100, r: rings(f.geometry) }));

function pack(list, tol, minSpan) {
  return list.map((p) => ({ ...p, r: clean(p.r, p.q === 100 ? tol : 0, p.q === 100 ? minSpan : 0.5) })).map((p) => [p.n, p.q].concat(p.r.map((r) => enc(r, p.q)).filter(Boolean))).filter((p) => p.length > 2);
}
const data = { pays: pack(pays, 0.03, 0.12), dep: pack(dep, 0.008, 0.03) };
const js = '/* Blackstart CRM : fond de carte de la « Carte clients » (généré par scripts/gen-carte-geo.mjs, ne pas modifier).\n' +
  ' * Pays : Natural Earth 1:50m (Europe, Maghreb) et 1:110m (reste du monde). Départements : Natural Earth admin 1, via datamaps.\n' +
  ' * Format : [nom, échelle, anneau…] ; anneau = « dx,dy,… » en 1/échelle de degré, coordonnées cumulées. Domaine public. */\n' +
  'window.bsCarteGeo = ' + JSON.stringify(data) + ';\n';
writeFileSync(new URL('../app/modules/bs-carte-geo.js', import.meta.url), js);
console.log('pays', data.pays.length, 'départements', data.dep.length, Math.round(js.length / 1024) + ' Ko');
