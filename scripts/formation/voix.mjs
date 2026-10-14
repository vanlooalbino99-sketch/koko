// Voix off de la Formation : génère les MP3 manquants (une phrase = un fichier app/voix/<empreinte>.mp3),
// réécrit app/modules/bs-voix.js (durées) et supprime les fichiers qui ne servent plus.
//   node scripts/formation/voix.mjs            (KOKORO_MODEL et KOKORO_VOICE : voir voix_kokoro.py)
// L'empreinte (FNV-1a 32 bits) est la même que hashCap() dans bs-formation.js : changer un texte change son fichier.
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const VOIX = join(ROOT, 'app', 'voix'), JS = join(ROOT, 'app', 'modules', 'bs-voix.js');
function hashCap(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }

// Toutes les phrases : modules et tutos, version équipe (captures présentes).
// Deux passes : version équipe (tutos sur captures) et version autonome (anciennes scènes animées).
const caps = new Map();
for (const serveur of [true, false]) {
  const win = { document: { documentElement: { getAttribute: () => 'dark' } }, location: { protocol: 'http:' } };
  if (serveur) win.BS_SERVER = {};
  const ctx = vm.createContext({ window: win, document: win.document, location: win.location, navigator: {}, setTimeout, console });
  // Toutes les captures « présentes » : chaque tuto compte, même avant d'avoir refait les captures.
  if (serveur) win.BS_ECRANS = new Proxy({}, { get: (_, k) => (k === '_v' ? undefined : { w: 1440, h: 900, z: {} }) });
  vm.runInContext(readFileSync(join(ROOT, 'app', 'modules', 'bs-formation.js'), 'utf8'), ctx);
  for (const m of win.bsFormation.modules) for (const s of m.scenes) for (const c of s.captions) caps.set(hashCap(c), c);
}
const old = existsSync(JS) ? JSON.parse(readFileSync(JS, 'utf8').replace(/^[\s\S]*?window\.BS_VOIX = /, '').replace(/;\s*$/, '')) : {};
const manque = [...caps].filter(([h]) => !(old[h] && existsSync(join(VOIX, h + '.mp3')))).map(([h, t]) => ({ h, t }));
console.log(`${caps.size} phrases, ${manque.length} à enregistrer`);
let neuves = {};
if (manque.length) {
  const r = spawnSync('python3', [join(ROOT, 'scripts', 'formation', 'voix_kokoro.py'), VOIX], { input: JSON.stringify(manque), stdio: ['pipe', 'pipe', 'inherit'], maxBuffer: 1 << 26 });
  if (r.status) process.exit(r.status);
  neuves = JSON.parse(r.stdout.toString());
}
const durees = {};
for (const h of caps.keys()) { const d = neuves[h] || old[h]; if (d) durees[h] = d; }
writeFileSync(JS, '/* Voix off de la formation : durée (ms) de chaque phrase enregistrée, par empreinte du texte. Généré, ne pas modifier. */\nwindow.BS_VOIX = ' + JSON.stringify(durees) + ';\n');
let sup = 0;
for (const f of readdirSync(VOIX)) if (f.endsWith('.mp3') && !durees[f.slice(0, -4)]) { unlinkSync(join(VOIX, f)); sup++; }
console.log(`bs-voix.js : ${Object.keys(durees).length} phrases ; ${sup} fichiers supprimés`);
