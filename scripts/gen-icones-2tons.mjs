// Génère app/icones/deux-tons.js : la bibliothèque d'icônes deux tons de Réglages › Icônes du menu
// (chargée seulement quand on en a besoin : écran de choix ouvert, ou une rubrique qui utilise une de ces icônes).
//
//   npm pack iconsax-react@0.0.8 @phosphor-icons/core@2.1.1   (puis tar xzf de chaque paquet dans son dossier)
//   node scripts/gen-icones-2tons.mjs <dossier iconsax-react/package> <dossier @phosphor-icons/core/package>
//
// - Iconsax « Bulk » (iconsax-react 0.0.8, licence MIT, https://github.com/rendinjast/iconsax-react) : noms « ix-… ».
// - Phosphor « Duotone » (@phosphor-icons/core 2.1.1, licence MIT, https://phosphoricons.com) : noms « ph-… ».
// Chaque icône est ramenée à une grille 24 × 24 ; la partie claire garde une opacité réduite.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const [IX, PH] = process.argv.slice(2);
if (!IX || !PH) { console.error('Usage : node scripts/gen-icones-2tons.mjs <iconsax-react/package> <@phosphor-icons/core/package>'); process.exit(1); }

const kebab = (s) => s.replace(/([a-z])([A-Z0-9])/g, '$1-$2').replace(/([0-9])([A-Za-z])/g, '$1-$2').toLowerCase();
const d = {}, t = {}, groupes = {};
const ranger = (g, n) => { (groupes[g] = groupes[g] || []).push(n); };

// ---------------------------------------------------------------- Iconsax (Bulk)
const IX_GROUPES = {
  Archive: 'fichiers', Arrow: 'divers', Astrology: 'divers', Building: 'lieux', Business: 'business', Call: 'communication', Car: 'transport',
  'Computers, Devices, Electronics': 'ia', 'Content-Edit': 'outils', 'Crypto, Currency': 'business', Delivery: 'transport',
  'Design, Tools': 'outils', 'Emails, Messages': 'communication', Essetional: 'divers', Files: 'fichiers', Grid: 'divers', Location: 'lieux',
  Money: 'business', Notifications: 'communication', Programing: 'ia', 'School, Learning': 'education', Search: 'outils', Security: 'securite',
  Settings: 'outils', Shop: 'business', 'Support, Like, Question': 'divers', Time: 'temps', 'Type, Paragraph, Character': 'outils', Users: 'personnes',
  'Video, Audio, Image': 'medias', Weather: 'nature',
};
function bulk(nom) {
  const src = readFileSync(join(IX, 'dist/esm', nom + '.js'), 'utf8');
  const a = src.indexOf('var Bulk = function Bulk(');
  const b = src.indexOf('\nvar ', a + 10);
  if (a < 0 || b < 0) return null;
  const attr = (k) => ({ strokeWidth: 'stroke-width', strokeLinecap: 'stroke-linecap', strokeLinejoin: 'stroke-linejoin', strokeMiterlimit: 'stroke-miterlimit', fillRule: 'fill-rule', clipRule: 'clip-rule' }[k] || k);
  const React = {
    Fragment: 'frag',
    createElement(tag, props, ...kids) {
      const inner = kids.flat().filter(Boolean).join('');
      if (tag === 'frag') return inner;
      const p = Object.assign({}, props || {});
      for (const k of Object.keys(p)) if (p[k] === '#COL') p[k] = 'currentColor';
      if (p.fill === 'currentColor' && !p.stroke) p.stroke = 'none';
      if (p.stroke === 'currentColor' && !p.fill) p.fill = 'none';
      return `<${tag}${Object.entries(p).map(([k, v]) => ` ${attr(k)}="${String(v)}"`).join('')}${inner ? `>${inner}</${tag}>` : '/>'}`;
    },
  };
  return new Function('React', src.slice(a, b) + '\nreturn Bulk;')(React)({ color: '#COL' });
}
const meta = JSON.parse(readFileSync(join(IX, 'dist/meta-data.json'), 'utf8'));
for (const c of meta.categories) {
  if (c.name === 'Crypto, Company') continue; // logos de cryptomonnaies : sans intérêt pour un menu
  for (const nom of c.icons) {
    const n = 'ix-' + kebab(nom);
    if (d[n]) continue;
    const s = bulk(nom);
    if (!s) continue;
    d[n] = s;
    t[n] = [...new Set(kebab(nom).split('-').concat(c.name.toLowerCase().split(/[^a-z]+/)).filter((x) => x && !/^\d+$/.test(x)))].join(' ');
    ranger(IX_GROUPES[c.name] || 'divers', n);
  }
}
const nIx = Object.keys(d).length;

// ---------------------------------------------------------------- Phosphor (Duotone)
const PH_GROUPES = {
  finances: 'business', commerce: 'business', communications: 'communication', people: 'personnes', office: 'fichiers', editor: 'outils',
  system: 'outils', 'technology & development': 'ia', 'maps & travel': 'lieux', media: 'medias', nature: 'nature', weather: 'nature',
  'health & wellness': 'sante', games: 'loisirs', design: 'outils', objects: 'divers', arrows: 'divers', brands: 'divers',
};
const { icons } = await import(join(PH, 'dist/index.mjs'));
const parPh = new Map(icons.map((i) => [i.name, i]));
for (const f of readdirSync(join(PH, 'assets/duotone')).sort()) {
  const nom = f.replace(/-duotone\.svg$/, '');
  const svg = readFileSync(join(PH, 'assets/duotone', f), 'utf8');
  const corps = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/opacity="0\.2"/g, 'opacity=".35"');
  const n = 'ph-' + nom;
  d[n] = '<g transform="scale(.09375)" fill="currentColor" stroke="none">' + corps + '</g>';
  const i = parPh.get(nom) || { tags: [], categories: [] };
  t[n] = [...new Set(nom.split('-').concat(i.tags || [], ...(i.categories || []).map((c) => c.split(/[^a-z]+/))).map((x) => String(x).toLowerCase()).filter((x) => x && !/^\d+$/.test(x) && !x.startsWith('*')))].join(' ');
  ranger(PH_GROUPES[(i.categories || [])[0]] || 'divers', n);
}
const nPh = Object.keys(d).length - nIx;

const tete = `/* Blackstart CRM : bibliothèque d'icônes deux tons de Réglages › Icônes du menu (${nIx + nPh} icônes).
 * Généré par scripts/gen-icones-2tons.mjs : ne pas modifier à la main.
 * - ${nIx} icônes Iconsax « Bulk » de Vuesax, tracés repris d'iconsax-react 0.0.8 (licence MIT,
 *   https://github.com/rendinjast/iconsax-react) : noms « ix-… ».
 * - ${nPh} icônes Phosphor « Duotone » (@phosphor-icons/core 2.1.1, licence MIT, https://github.com/phosphor-icons/core) :
 *   noms « ph-… ».
 *
 * Copyright (c) Erfan Khadivar (iconsax-react)
 * Copyright (c) 2023 Phosphor Icons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
`;
mkdirSync(new URL('../app/icones/', import.meta.url), { recursive: true });
const g = Object.entries(groupes).map(([k, l]) => [k, l.join(' ')]);
writeFileSync(new URL('../app/icones/deux-tons.js', import.meta.url), tete + 'window.bsIcones2Tons = ' + JSON.stringify({ d, t, g }) + ';\n');
console.log(`✔ app/icones/deux-tons.js — ${nIx} Iconsax + ${nPh} Phosphor = ${nIx + nPh} icônes`);
