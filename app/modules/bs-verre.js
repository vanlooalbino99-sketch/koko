/* Blackstart CRM : mouvement « Premium 3D Glass » (styles/verre.css pour l'apparence).
 *
 * - Titre de page : à chaque changement de page, le titre monte de sa ligne en sortant du flou,
 *   comme les titres du site.
 * - Chiffres clés : un reflet de verre les traverse à l'arrivée sur la page (classe html.verre-entree).
 * Animations en Web Animations API et classe sur <html> : le DOM géré par l'interface n'est pas modifié.
 * « Réduire les animations » (Réglages › Apparence) ou le réglage système les désactive.
 * Le logo en verre 3D est sur la page de connexion de la version équipe (server/src/pages.js, app/verre/).
 */
(function () {
  'use strict';
  if (window.bsVerre) return;

  var EASE = 'cubic-bezier(.16, 1, .3, 1)';
  var lastTitle = null, lastText = '', timer = 0, frame = 0;

  function reduced() {
    return document.documentElement.getAttribute('data-motion') === 'reduced' ||
      (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function reveal(title) {
    if (!title.animate) return;
    title.animate([
      { transform: 'translateY(0.55em)', opacity: 0, filter: 'blur(12px)', clipPath: 'inset(-20% -5% 100% -5%)' },
      { transform: 'none', opacity: 1, filter: 'blur(0)', clipPath: 'inset(-20% -5% -20% -5%)' },
    ], { duration: 1150, easing: EASE });
  }

  function entree() {
    var html = document.documentElement;
    html.classList.remove('verre-entree');
    void html.offsetWidth; // relance l'animation CSS du reflet
    html.classList.add('verre-entree');
    clearTimeout(timer);
    timer = setTimeout(function () { html.classList.remove('verre-entree'); }, 2200);
  }

  function check() {
    frame = 0;
    var title = document.querySelector('#root .page-title, #root .hero-hello');
    var text = title ? title.textContent : '';
    if (title === lastTitle && text === lastText) return;
    var changed = lastTitle !== null && (title !== lastTitle || text !== lastText);
    lastTitle = title; lastText = text;
    if (!title || reduced()) return;
    if (changed || !window.bsVerre.vu) { reveal(title); entree(); window.bsVerre.vu = true; }
  }

  function start() {
    var root = document.getElementById('root');
    if (!root || !window.MutationObserver) return;
    new MutationObserver(function () { if (!frame) frame = requestAnimationFrame(check); })
      .observe(root, { childList: true, subtree: true });
    check();
  }

  window.bsVerre = { vu: false, reveal: reveal, entree: entree };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
