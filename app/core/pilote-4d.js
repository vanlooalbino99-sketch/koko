

/* =====================================================================
   BLACKSTART CRM — pilote de la couche « 4D »
   Deux rôles, aucun autre : garder le défilement libre, et nourrir les
   variables CSS de lumière. Rien ici ne touche à l'état de l'application.
   ===================================================================== */
(function () {
  "use strict";
  var root = document.documentElement;
  var body = document.body;

  /* -------------------------------------------------------------------
     1. Garde-fou anti-blocage.
     Preact exécute le nettoyage des hooks AVANT de retirer le noeud du
     DOM : la modale qui se ferme se trouve donc elle-même via
     querySelector('.overlay') et la classe no-scroll restait collée au
     body. On resynchronise ici en permanence sur l'état réel du DOM.
     ------------------------------------------------------------------- */
  var LOCKERS = ".overlay, .call-screen";
  var pending = false;

  function syncScrollLock() {
    pending = false;
    try {
      var locked = !!document.querySelector(LOCKERS);
      if (locked !== body.classList.contains("no-scroll")) {
        body.classList.toggle("no-scroll", locked);
      }
    } catch (e) {}
  }
  function scheduleSync() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(syncScrollLock);
  }

  try {
    new MutationObserver(scheduleSync).observe(body, { childList: true, subtree: true });
  } catch (e) {}
  ["pointerup", "keyup", "transitionend", "animationend"].forEach(function (evt) {
    window.addEventListener(evt, scheduleSync, true);
  });
  setInterval(scheduleSync, 800);

  /* Filet de sécurité : si l'écran de démarrage survit à une erreur
     d'initialisation, il ne doit pas rester en travers de la page. */
  setTimeout(function () {
    var s = document.getElementById("splash");
    if (s) { s.classList.add("hide"); setTimeout(function () { s.remove(); }, 600); }
  }, 16000);

  /* -------------------------------------------------------------------
     2. Lumière ambiante : la nappe de fond suit le pointeur et le
     défilement, ce qui donne sa parallaxe au champ de profondeur.
     ------------------------------------------------------------------- */
  var fine = false;
  var calm = false;
  try {
    fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  if (fine) root.setAttribute("data-pointer", "fine");

  var px = 0, py = 0, rafAmbient = 0;
  function flushAmbient() {
    rafAmbient = 0;
    /* Pixels et non pourcentages : le halo bouge par translate3d,
       donc le GPU compose sans repeindre quoi que ce soit. */
    root.style.setProperty("--pxp", px + "px");
    root.style.setProperty("--pyp", py + "px");
  }

  var sy = 0, rafScroll = 0;
  function flushScroll() {
    rafScroll = 0;
    root.style.setProperty("--sy", sy.toFixed(0));
  }
  window.addEventListener("scroll", function () {
    sy = window.scrollY || 0;
    if (!rafScroll) rafScroll = requestAnimationFrame(flushScroll);
  }, { passive: true });

  /* -------------------------------------------------------------------
     3. Reflet local + bascule 3D des tuiles survolées.
     ------------------------------------------------------------------- */
  var GLARE = ".kpi, .hero, .kb-card";
  var TILT = ".kpi, .kb-card";
  var current = null, rafGlare = 0, gx = 50, gy = 50, tx = 0, ty = 0;

  function flushGlare() {
    rafGlare = 0;
    if (!current) return;
    current.style.setProperty("--mx", gx.toFixed(1) + "%");
    current.style.setProperty("--my", gy.toFixed(1) + "%");
    if (!calm && current.matches(TILT)) {
      current.style.setProperty("--tx", tx.toFixed(2) + "deg");
      current.style.setProperty("--ty", ty.toFixed(2) + "deg");
    }
  }

  function release(el) {
    if (!el) return;
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
    el.style.removeProperty("--tx");
    el.style.removeProperty("--ty");
  }

  if (fine) {
    window.addEventListener("pointermove", function (e) {
      px = e.clientX;
      py = e.clientY;
      if (!rafAmbient) rafAmbient = requestAnimationFrame(flushAmbient);

      var el = null;
      try { el = e.target && e.target.closest ? e.target.closest(GLARE) : null; } catch (err) { el = null; }
      if (el !== current) { release(current); current = el; }
      if (!el) return;

      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var nx = (e.clientX - r.left) / r.width;
      var ny = (e.clientY - r.top) / r.height;
      gx = nx * 100;
      gy = ny * 100;
      /* Amplitude volontairement faible : on veut un relief, pas un jouet. */
      ty = (nx - 0.5) * 6;
      tx = (0.5 - ny) * 5;
      if (!rafGlare) rafGlare = requestAnimationFrame(flushGlare);
    }, { passive: true });

    window.addEventListener("pointerleave", function () { release(current); current = null; }, true);
    window.addEventListener("blur", function () { release(current); current = null; });
  }
})();
