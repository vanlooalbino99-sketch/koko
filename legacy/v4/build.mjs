// Construit l'application en UN SEUL fichier HTML autonome :
// le JS (Preact + app) et le CSS sont intégrés dans la page.
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = '../../versions/Blackstart_CRM_App_v4.html';
const watch = process.argv.includes('--watch');

async function build() {
  const result = await esbuild.build({
    entryPoints: ['src/main.jsx'],
    bundle: true,
    write: false,
    format: 'iife',
    target: ['es2019', 'safari13'],
    jsx: 'automatic',
    jsxImportSource: 'preact',
    minify: true,
    legalComments: 'none',
    charset: 'utf8',
  });
  const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  const css = readFileSync('src/styles.css', 'utf8');
  const html = readFileSync('src/index.html', 'utf8')
    .replace('/*__CSS__*/', () => css)
    .replace('/*__JS__*/', () => js);
  writeFileSync(OUT, html);
  console.log(`✔ ${OUT} — ${(html.length / 1024).toFixed(0)} Ko`);
}

if (watch) {
  const { watch: fsWatch } = await import('node:fs');
  await build();
  let t;
  fsWatch('src', { recursive: true }, () => {
    clearTimeout(t);
    t = setTimeout(() => build().catch((e) => console.error(e.message)), 120);
  });
} else {
  await build();
}
