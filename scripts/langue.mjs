// Assemble le dictionnaire anglais du CRM : i18n/en/*.txt (une ligne « texte français ⇒ texte anglais »)
// → app/modules/bs-langue-en.js (window.BS_EN), lu par app/modules/bs-langue.js quand l'anglais est choisi.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'i18n', 'en');
const dico = {};
const erreurs = [];
for (const f of readdirSync(DIR).filter((x) => x.endsWith('.txt')).sort()) {
  readFileSync(join(DIR, f), 'utf8').split('\n').forEach((ligne, i) => {
    if (!ligne.trim() || ligne.startsWith('#')) return;
    const p = ligne.split(' ⇒ ');
    if (p.length !== 2 || !p[0].trim() || !p[1].trim()) { erreurs.push(`${f}:${i + 1} ${ligne}`); return; }
    const fr = p[0].replace(/\s+/g, ' ').trim(), en = p[1].trim();
    if (dico[fr] !== undefined && dico[fr] !== en) erreurs.push(`${f}:${i + 1} deux traductions pour « ${fr} »`);
    dico[fr] = en;
  });
}
if (erreurs.length) { console.error(erreurs.join('\n')); process.exit(1); }
const js = '/* Généré par scripts/langue.mjs depuis i18n/en/*.txt : ne pas modifier à la main. */\n' +
  'window.BS_EN = ' + JSON.stringify(dico, null, 0).replace(/<\/script/gi, '<\\/script') + ';\n' +
  "window.dispatchEvent(new Event('bs-langue-en'));\n";
writeFileSync(join(ROOT, 'app', 'modules', 'bs-langue-en.js'), js);
console.log(`✔ app/modules/bs-langue-en.js — ${Object.keys(dico).length} textes`);
