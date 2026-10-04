
/* Blackstart CRM : logo Blackstart AI (symbole « ▷B » : triangle de lecture gris, B bleu).
 *
 * Dessiné en vectoriel d'après le logo officiel : net à toutes les tailles (menu, barre mobile, écran de
 * chargement, icône d'onglet, page de connexion). En mode sombre, le triangle passe en argent pour rester
 * lisible sur le fond bleu nuit ; en mode clair, il garde le gris anthracite du logo.
 * L'interface appelle window.bsLogo.svg(id) pour le dessiner (un id par emplacement : dégradés distincts).
 */
(function () {
  'use strict';
  if (window.bsLogo) return;

  var GRIS = 'M566 350V209L828 402L566 595V450';
  var BLEU = 'M766 205H862L978 290V314L874 402L978 490V514L862 605H766';
  function svg(id) {
    id = 'bsl' + String(id || 'x').replace(/[^a-z0-9]/gi, '');
    return '<svg class="bs-logo-svg" viewBox="528 168 484 474" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" style="stop-color:var(--bsl-g1)"/><stop offset="1" style="stop-color:var(--bsl-g2)"/></linearGradient>' +
      '<linearGradient id="' + id + 'b" x1="0.2" y1="0" x2="0.6" y2="1">' +
      '<stop offset="0" style="stop-color:var(--bsl-b1)"/><stop offset="1" style="stop-color:var(--bsl-b2)"/></linearGradient></defs>' +
      '<path class="bsl-g" d="' + GRIS + '" pathLength="1" fill="none" stroke="url(#' + id + 'g)" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path class="bsl-b" d="' + BLEU + '" pathLength="1" fill="none" stroke="url(#' + id + 'b)" stroke-width="54" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  var CSS = [
    ':root{--bsl-g1:#eef1f6;--bsl-g2:#9aa3b4;--bsl-b1:#2bb0ff;--bsl-b2:#0b52e0}',
    '[data-scheme="light"]{--bsl-g1:#6b7180;--bsl-g2:#2f343e;--bsl-b1:#1ea2ff;--bsl-b2:#0a45d1}',
    // Le symbole remplace la pastille « B » : pas de fond, un léger halo bleu.
    '.brand-mark.bs-logo{width:34px;height:34px;padding:0;border-radius:0;background:none!important;box-shadow:none!important;color:inherit;overflow:visible}',
    '.brand-mark.bs-logo::before,.brand-mark.bs-logo::after{display:none!important}',
    '.bs-logo-svg{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 3px 8px rgb(11 82 224/.35))}',
    '[data-scheme="light"] .bs-logo-svg{filter:drop-shadow(0 2px 5px rgb(15 23 42/.18))}',
    '.topbar .brand-mark.bs-logo{width:30px;height:30px}',
    // Écran de chargement : le logo se trace, puis respire doucement.
    '#splash .splash-logo{width:84px;height:84px}',
    '#splash .splash-logo .bsl-g,#splash .splash-logo .bsl-b{stroke-dasharray:1;stroke-dashoffset:1;animation:bslDraw .9s cubic-bezier(.65,0,.35,1) forwards}',
    '#splash .splash-logo .bsl-b{animation-delay:.35s}',
    '#splash .splash-logo .bs-logo-svg{animation:bslPulse 2.4s ease-in-out 1.3s infinite}',
    '@keyframes bslDraw{to{stroke-dashoffset:0}}',
    '@keyframes bslPulse{50%{transform:scale(1.05);filter:drop-shadow(0 6px 18px rgb(11 82 224/.6))}}',
    '[data-motion="reduced"] #splash .splash-logo *{animation:none!important;stroke-dashoffset:0!important}',
    '@media (prefers-reduced-motion:reduce){#splash .splash-logo *{animation:none!important;stroke-dashoffset:0!important}}',
  ].join('\n');
  var st = document.createElement('style'); st.id = 'bs-logo-css'; st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);

  window.bsLogo = { svg: svg };
})();
