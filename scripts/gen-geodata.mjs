// Génère src/lib/geodata.js : masque des terres (globe à points) + répertoire de villes.
// Outil ponctuel, hors build. Dépendances à installer temporairement :
//   npm i --no-save world-atlas topojson-client d3-geo all-the-cities
//   node scripts/gen-geodata.mjs
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoEquirectangular, geoPath } from 'd3-geo';

const require = createRequire(import.meta.url);
const topo = require('world-atlas/land-50m.json');
const land = feature(topo, topo.objects.land);
const cities = require('all-the-cities');

/* Raster équirectangulaire des terres, 1/8 de degré. d3-geo découpe les polygones à l'antiméridien,
   puis on remplit par balayage (règle pair-impair). */
const W = 2880;
const H = 1440;
const raster = new Uint8Array(W * H);
const rings = [];
let cur = null;
geoPath(
  geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]).precision(0.1),
  {
    moveTo: (x, y) => rings.push((cur = [[x, y]])),
    lineTo: (x, y) => cur.push([x, y]),
    closePath: () => {},
    arc: () => {},
  },
)(land);
for (let row = 0; row < H; row++) {
  const yc = row + 0.5;
  const xs = [];
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [x1, y1] = ring[i];
      const [x2, y2] = ring[j];
      if (y1 > yc !== y2 > yc) xs.push(x1 + ((yc - y1) * (x2 - x1)) / (y2 - y1));
    }
  }
  xs.sort((a, b) => a - b);
  for (let k = 0; k + 1 < xs.length; k += 2) {
    const c0 = Math.max(0, Math.ceil(xs[k] - 0.5));
    const c1 = Math.min(W - 1, Math.floor(xs[k + 1] - 0.5));
    for (let c = c0; c <= c1; c++) raster[row * W + c] = 1;
  }
}
const isLand = (lon, lat) => raster[Math.min(H - 1, Math.floor(((90 - lat) * H) / 180)) * W + Math.min(W - 1, Math.floor(((lon + 180) * W) / 360))];

/* Masques : 1 bit par point d'une sphère de Fibonacci (même formule que src/lib/globe.js),
   deux niveaux de détail — la trame fine sert quand on zoome. */
const GOLD = Math.PI * (3 - Math.sqrt(5));
function mask(N) {
  const bits = new Uint8Array(Math.ceil(N / 8));
  for (let i = 0; i < N; i++) {
    const y = 1 - ((i + 0.5) * 2) / N;
    const lat = (Math.asin(y) * 180) / Math.PI;
    let lon = (((i * GOLD) % (2 * Math.PI)) * 180) / Math.PI;
    if (lon > 180) lon -= 360;
    if (isLand(lon, lat)) bits[i >> 3] |= 1 << (i & 7);
  }
  return bits;
}
const LODS = [24000, 96000];

/* Villes : France ≥ 2 500 hab., outre-mer et pays francophones ≥ 30 000, monde ≥ 500 000 et capitales. */
const FRANCO = new Set(['BE', 'CH', 'LU', 'MC', 'CA', 'MA', 'TN', 'DZ', 'SN', 'CI', 'RE', 'GP', 'MQ', 'GF', 'YT', 'NC', 'PF', 'PM']);
const keep = (c) =>
  (c.country === 'FR' && c.population >= 2500) ||
  (FRANCO.has(c.country) && c.population >= 30000) ||
  c.population >= 500000 ||
  (c.featureCode === 'PPLC' && c.population >= 50000);
const seen = new Set();
const list = cities
  .filter(keep)
  // France d'abord, puis les plus peuplées : en cas d'homonymie la première l'emporte.
  .sort((a, b) => (b.country === 'FR') - (a.country === 'FR') || b.population - a.population || a.cityId - b.cityId)
  .filter((c) => {
    const k = c.name.toLowerCase();
    if (seen.has(k) || c.name.includes('|')) return false;
    seen.add(k);
    return true;
  });
const coords = new Int16Array(list.length * 2);
list.forEach((c, i) => {
  coords[i * 2] = Math.round(c.loc.coordinates[0] * 100);
  coords[i * 2 + 1] = Math.round(c.loc.coordinates[1] * 100);
});

const b64 = (u8) => Buffer.from(u8.buffer, u8.byteOffset, u8.byteLength).toString('base64');
const out = `// Fichier généré par scripts/gen-geodata.mjs — ne pas modifier à la main.
// Terres : Natural Earth 1:50m (domaine public), via world-atlas.
// Villes : GeoNames (CC BY 4.0), via all-the-cities.
export const LAND = [${LODS.map((n) => `{ n: ${n}, bits: '${b64(mask(n))}' }`).join(', ')}];
export const CITY_NAMES = ${JSON.stringify(list.map((c) => c.name).join('|'))};
export const CITY_COORDS = '${b64(new Uint8Array(coords.buffer))}';
`;
writeFileSync(new URL('../src/lib/geodata.js', import.meta.url), out);
console.log(`✔ src/lib/geodata.js — ${list.length} villes, ${(out.length / 1024).toFixed(0)} Ko`);
