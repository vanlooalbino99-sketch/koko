/* =====================================================================
   BLACKSTART — Couche PREMIUM (v3.1) : script
   N'altère ni les données ni la structure de l'app : il pose seulement
   des attributs data-* (que React ne touche pas) et des effets visuels.
   ===================================================================== */
(function () {
  'use strict';
  var root = document.getElementById('root');
  if (!root || window.__bsPremium) return;
  window.__bsPremium = true;
  var doc = document.documentElement;
  var finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function motion() { return doc.getAttribute('data-bs-motion') || 'full'; }
  function animOk() { return !reduced && motion() !== 'none'; }

  /* ---------- 1. Dégradés partagés pour les icônes ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  var defs = document.createElementNS(NS, 'svg');
  defs.setAttribute('width', '0');
  defs.setAttribute('height', '0');
  defs.setAttribute('aria-hidden', 'true');
  defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  defs.innerHTML =
    '<defs>' +
    '<linearGradient id="bsIcoGradLight" gradientUnits="userSpaceOnUse" x1="4" y1="2" x2="20" y2="22">' +
    '<stop offset="0" style="stop-color:#ffffff"/><stop offset="1" style="stop-color:rgb(var(--bs-accent-100))"/></linearGradient>' +
    '<linearGradient id="bsIcoGradAccent" gradientUnits="userSpaceOnUse" x1="4" y1="2" x2="20" y2="22">' +
    '<stop offset="0" style="stop-color:rgb(var(--bs-accent-200))"/><stop offset="1" style="stop-color:rgb(var(--bs-accent-500))"/></linearGradient>' +
    '</defs>';
  document.body.insertBefore(defs, document.body.firstChild);

  /* ---------- 2. Marquage des icônes (duotone) ---------- */
  function iconName(svg) {
    var c = svg.getAttribute('class') || '';
    var m = c.match(/lucide-([a-z0-9-]+)/);
    return m && m[1] !== 'icon' ? m[1] : 'custom';
  }
  function tagIcon(svg) {
    if (svg.hasAttribute('data-ic')) return;
    if (svg.closest('.recharts-wrapper, #bs-panel')) return;
    var vb = svg.getAttribute('viewBox');
    var stroke = svg.getAttribute('stroke');
    if (vb !== '0 0 24 24' || (stroke && stroke !== 'currentColor')) return;
    svg.setAttribute('data-ic', iconName(svg));
    var shapes = svg.querySelectorAll('path, circle');
    for (var i = 0; i < shapes.length; i++) {
      var s = shapes[i];
      if (s.tagName === 'circle') {
        var r = parseFloat(s.getAttribute('r')) || 0;
        if (r <= 1.2) s.setAttribute('data-bs-dot', '');
        else if (r >= 2.5) s.setAttribute('data-bs-fill', '');
      } else {
        var d = (s.getAttribute('d') || '').trim();
        if (/z$/i.test(d) && d.length > 18) s.setAttribute('data-bs-fill', '');
        if (svg.getAttribute('data-ic') === 'trending-up') s.setAttribute('pathLength', '1');
      }
    }
    var polys = svg.querySelectorAll('polyline');
    for (var j = 0; j < polys.length; j++) polys[j].setAttribute('pathLength', '1');
  }

  /* ---------- 3. Tuiles d'icônes 3D ---------- */
  function tagTile(el) {
    if (el.hasAttribute('data-bs-tile')) return;
    var c = el.className || '';
    if (typeof c !== 'string' || c.indexOf('overflow-hidden') < 0 || c.indexOf('shrink-0') < 0) return;
    var hl = el.querySelector(':scope > .absolute');
    if (!hl || (hl.className || '').indexOf('bg-white/40') < 0) return;
    el.setAttribute('data-bs-tile', '');
    el.setAttribute('data-tone', c.indexOf('#283952') >= 0 ? 'slate' : c.indexOf('#22314A') >= 0 ? 'ghost' : 'accent');
  }

  /* ---------- 4. Cartes : liseré lumineux + inclinaison 3D ---------- */
  var CARD_SEL = '[class*="bg-[var(--bs-surface)]"]';
  function safeToRelative(el) {
    var abs = el.querySelectorAll('.absolute, .fixed');
    for (var i = 0; i < abs.length; i++) {
      var op = abs[i].offsetParent;
      if (abs[i].classList.contains('fixed')) return false;
      if (op && op !== el && !el.contains(op)) return false;
    }
    return true;
  }
  function tagCard(el) {
    if (el.hasAttribute('data-bs-edge') || el.hasAttribute('data-bs-noedge')) return;
    var c = el.className || '';
    if (typeof c !== 'string' || c.indexOf('rounded') < 0) return;
    if (el.closest('.fixed.bottom-0, #bs-panel') || el.classList.contains('sticky') || el.classList.contains('fixed')) return;
    if (el.offsetWidth < 60 || el.offsetHeight < 34) return;
    var pos = getComputedStyle(el).position;
    if (pos === 'static' && !safeToRelative(el)) {
      el.setAttribute('data-bs-noedge', '');
      return;
    }
    if (pos !== 'static') el.setAttribute('data-bs-rel', '');
    el.setAttribute('data-bs-edge', '');
    // Inclinaison uniquement sur les cartes-conteneurs (pas les boutons ni les champs).
    if (el.tagName === 'DIV' && el.offsetHeight < 420 && !el.querySelector('input, textarea, select, .recharts-wrapper')) el.setAttribute('data-bs-tilt', '');
  }

  var tiltEl = null;
  function onMove(e) {
    if (!finePointer || !animOk() || doc.getAttribute('data-bs-lift') === '0') return;
    var t = e.target.closest ? e.target.closest('[data-bs-tilt]') : null;
    if (tiltEl && tiltEl !== t) resetTilt(tiltEl);
    if (!t) return;
    tiltEl = t;
    var r = t.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    var max = motion() === 'soft' ? 1.6 : 3.4;
    t.classList.remove('bs-tilt-reset');
    t.classList.add('bs-tilting');
    t.style.transform = 'perspective(1000px) rotateX(' + (-y * max).toFixed(2) + 'deg) rotateY(' + (x * max).toFixed(2) + 'deg) translateY(-3px)';
    t.style.setProperty('--bs-mx', ((x + 0.5) * 100).toFixed(1) + '%');
    t.style.setProperty('--bs-my', ((y + 0.5) * 100).toFixed(1) + '%');
  }
  function resetTilt(t) {
    t.classList.remove('bs-tilting');
    t.classList.add('bs-tilt-reset');
    t.style.transform = '';
    tiltEl = null;
  }
  document.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', function () { if (tiltEl) resetTilt(tiltEl); }, true);
  window.addEventListener('blur', function () { if (tiltEl) resetTilt(tiltEl); });

  /* ---------- 5. Ripple au point de contact ---------- */
  document.addEventListener('pointerdown', function (e) {
    if (!animOk()) return;
    var b = e.target.closest ? e.target.closest('button, a, [role="button"]') : null;
    if (!b || b.disabled || b.closest('#bs-panel')) return;
    var pos = getComputedStyle(b).position;
    if (pos === 'static') return; // ne jamais changer le positionnement d'un bouton
    var r = b.getBoundingClientRect();
    if (r.width < 24 || r.height < 20) return;
    var host = document.createElement('span');
    host.className = 'bs-ripple-host';
    host.setAttribute('aria-hidden', 'true');
    var dot = document.createElement('span');
    var size = Math.max(r.width, r.height) * 2.4;
    dot.className = 'bs-ripple';
    dot.style.width = dot.style.height = size + 'px';
    dot.style.left = e.clientX - r.left + 'px';
    dot.style.top = e.clientY - r.top + 'px';
    host.appendChild(dot);
    b.appendChild(host);
    setTimeout(function () { if (host.parentNode) host.parentNode.removeChild(host); }, 700);
  }, { passive: true, capture: true });

  /* ---------- 6. Rebond de l'icône à la sélection d'un onglet ---------- */
  document.addEventListener('click', function (e) {
    var n = e.target.closest ? e.target.closest('.nav-item') : null;
    if (!n || !animOk()) return;
    setTimeout(function () {
      var s = n.querySelector('svg[data-ic]');
      if (!s) return;
      s.classList.remove('bs-pop');
      void s.getBoundingClientRect();
      s.classList.add('bs-pop');
      setTimeout(function () { s.classList.remove('bs-pop'); }, 650);
    }, 30);
  }, true);

  /* ---------- 7. Entrées en cascade ---------- */
  var ENTER_SEL = CARD_SEL + ', button.no-hover-fx[class*="border-blue-500/30"]';
  function stagger(nodes) {
    if (!animOk()) return;
    var i = 0;
    for (var k = 0; k < nodes.length && i < 14; k++) {
      var el = nodes[k];
      if (el.hasAttribute('data-bs-in') || el.closest('.fixed.bottom-0, #bs-panel, [data-bs-in]')) continue;
      var an = getComputedStyle(el).animationName;
      if (an && an !== 'none') continue;
      var r = el.getBoundingClientRect();
      if (r.top > innerHeight + 40 || r.bottom < -40) continue;
      el.style.setProperty('--bs-i', String(i++));
      el.setAttribute('data-bs-in', '');
    }
  }

  /* ---------- Observation du DOM (React) ---------- */
  var pending = [];
  var scheduled = false;
  function scan(scope) {
    var svgs = scope.querySelectorAll ? scope.querySelectorAll('svg') : [];
    for (var i = 0; i < svgs.length; i++) tagIcon(svgs[i]);
    if (scope.tagName === 'svg') tagIcon(scope);
    var tiles = scope.querySelectorAll ? scope.querySelectorAll('.relative.overflow-hidden.shrink-0') : [];
    for (var j = 0; j < tiles.length; j++) tagTile(tiles[j]);
    var cards = scope.querySelectorAll ? scope.querySelectorAll(CARD_SEL) : [];
    for (var k = 0; k < cards.length; k++) tagCard(cards[k]);
    if (scope.matches && scope.matches(CARD_SEL)) tagCard(scope);
    stagger(scope.querySelectorAll ? scope.querySelectorAll(ENTER_SEL) : []);
  }
  function flush() {
    scheduled = false;
    var list = pending;
    pending = [];
    for (var i = 0; i < list.length; i++) if (list[i].isConnected) scan(list[i]);
  }
  new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var a = muts[i].addedNodes;
      for (var j = 0; j < a.length; j++) if (a[j].nodeType === 1 && !(a[j].classList && a[j].classList.contains('bs-ripple-host'))) pending.push(a[j]);
    }
    if (pending.length && !scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  }).observe(document.body, { childList: true, subtree: true });
  scan(document.body);
})();
