// Le logo Blackstart en verre : le carré arrondi, le B et le point évidés.
// Même dessin que components/layout/logo.tsx (grille 32 × 32), agrandi à 1000 × 1000.
// Le point est un peu décalé vers le coin pour garder une paroi de verre entre lui et le B.
export const glassMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path fill-rule="evenodd" d="
M250 0H750A250 250 0 0 1 1000 250V750A250 250 0 0 1 750 1000H250A250 250 0 0 1 0 750V250A250 250 0 0 1 250 0Z
M343.75 250H546.875A156.25 156.25 0 0 1 637.5 534.375A162.5 162.5 0 0 1 562.5 750H343.75Z
M712.5 218.75A68.75 68.75 0 1 0 850 218.75A68.75 68.75 0 1 0 712.5 218.75Z"/></svg>`;

// Bleu Blackstart vers violet, puis cyan et bleu nuit pour la fin de page.
export const glassPalette = ['#4f8cdb', '#7c5cff', '#b45cf0', '#3aa7ff', '#2a4fd6'];
