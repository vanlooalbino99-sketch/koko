// Point d'entrée du logo en verre 3D du CRM, assemblé par scripts/build-verre.mjs dans app/verre/verre.js.
export { startGlass } from './engine.js';

// Le logo Blackstart en verre : carré arrondi, B et point évidés (même dessin que le site, grille 32 × 32 agrandie).
export const glassMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path fill-rule="evenodd" d="
M250 0H750A250 250 0 0 1 1000 250V750A250 250 0 0 1 750 1000H250A250 250 0 0 1 0 750V250A250 250 0 0 1 250 0Z
M343.75 250H546.875A156.25 156.25 0 0 1 637.5 534.375A162.5 162.5 0 0 1 562.5 750H343.75Z
M712.5 218.75A68.75 68.75 0 1 0 850 218.75A68.75 68.75 0 1 0 712.5 218.75Z"/></svg>`;

// Bleu du CRM, violet et cyan de l'aurore.
export const glassPalette = ['#387cd5', '#6a6be8', '#8b5cf6', '#22d3ee', '#2563c9'];

/** Vrai si la scène 3D peut tourner ici (WebGL 2, animations autorisées). */
export function glassAvailable() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}
