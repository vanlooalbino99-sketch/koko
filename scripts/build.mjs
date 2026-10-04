// Assemble app/ en UN SEUL fichier HTML autonome (dist/Blackstart_CRM_App.html) :
// chaque <script src="…" data-inline> et <link href="…" data-inline> est remplacé par son contenu.
// Le même app/ sert aussi, tel quel, au serveur en développement (fichiers séparés, rechargement simple).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, 'app');

export function assemble() {
  const shell = readFileSync(join(APP, 'index.html'), 'utf8');
  const read = (p) => readFileSync(join(APP, p), 'utf8');
  return shell
    .replace(/<script( id="[^"]+")? src="([^"]+)" data-inline><\/script>/g, (_, id, src) => {
      const js = read(src);
      if (/<\/script/i.test(js)) throw new Error(`${src} contient « </script » : écrivez <\\/script.`);
      return `<script${id || ''}>${js}</script>`;
    })
    .replace(/<link rel="stylesheet"( id="[^"]+")? href="([^"]+)" data-inline>/g, (_, id, href) => {
      const css = read(href);
      if (/<\/style/i.test(css)) throw new Error(`${href} contient « </style ».`);
      return `<style${id || ''}>${css}</style>`;
    });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const out = process.argv[2] || join(ROOT, 'dist', 'Blackstart_CRM_App.html');
  const html = assemble();
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`✔ ${out.replace(ROOT + '/', '')} — ${(Buffer.byteLength(html) / 1024).toFixed(0)} Ko`);
}
