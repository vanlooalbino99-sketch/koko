// Génère Blackstart_CRM_App_v3_Premium.html : la v3 d'origine + la couche Premium
// (un <style> et un <script> ajoutés juste avant </body>, rien d'autre ne change).
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'archive/Blackstart_CRM_App_v3.html';
const OUT = '../../versions/Blackstart_CRM_App_v3_Premium.html';

const html = readFileSync(SRC, 'utf8');
const css = readFileSync('premium/premium.css', 'utf8');
const js = readFileSync('premium/premium.js', 'utf8').replace(/<\/script/gi, '<\\/script');
const idx = html.lastIndexOf('</body>');
if (idx < 0) throw new Error('</body> introuvable dans ' + SRC);

const layer = `<style id="bs-premium">\n${css}</style>\n<script id="bs-premium-js">\n${js}</script>\n`;
const out = html.slice(0, idx) + layer + html.slice(idx);
writeFileSync(OUT, out.replace('<title>Blackstart AI — CRM</title>', '<title>Blackstart AI — CRM Premium</title>'));
console.log(`✔ ${OUT} — ${(out.length / 1024).toFixed(0)} Ko`);
