// Assemble le logo en verre 3D (Three.js r160 + moteur) en un module : app/verre/verre.js.
// Le serveur le sert sous /verre/verre.js ; la page de connexion le charge seulement si WebGL 2 est disponible.
// À relancer après toute modification de scripts/verre/ : npm run build:verre
import { build } from 'esbuild';
import { statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const outfile = join(ROOT, 'app', 'verre', 'verre.js');
await build({
  entryPoints: [join(ROOT, 'scripts', 'verre', 'entry.js')],
  outfile, bundle: true, format: 'esm', minify: true, target: 'es2020', legalComments: 'eof',
});
console.log(`✔ app/verre/verre.js — ${(statSync(outfile).size / 1024).toFixed(0)} Ko`);
