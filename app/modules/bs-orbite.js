/* Blackstart CRM : fond animé en verre 3D, le même que l'accueil du site (moteur « Premium 3D Glass », assemblé
 * dans /verre/verre.js par npm run build:verre) : anneaux de lumière en ondes, étincelles, et une forme en verre bleu
 * qui s'éclate en éclats puis se recompose pendant que la caméra tourne autour.
 *
 * - Couche à part, derrière tout le CRM (#bs-orbite-fond, pointer-events: none) : rien d'autre ne change.
 * - Lecture automatique, sans défilement : la chorégraphie du site boucle toute seule à 60 images/s.
 * - Forme au choix dans Réglages › Ambiance (sans le logo par défaut, ou anneaux seuls), choix enregistré sur cet appareil.
 * - Thème clair : la même scène, en négatif (fond clair, verre bleu).
 * - Léger : densité de pixels plafonnée, en pause quand l'onglet est caché ; si l'appareil peine, la scène passe à
 *   30 images/s puis laisse la place au fond habituel. Sans WebGL 2 ou avec « Réduire les animations » : fond habituel.
 * - Version équipe (serveur) seulement : le moteur 3D n'est pas embarqué dans le fichier autonome.
 */
(function () {
  'use strict';
  if (window.bsOrbite || !window.BS_SERVER) return;

  // ?v= : le moteur est mis en cache 7 jours, on change l'adresse quand il change.
  var MOTEUR = '/verre/verre.js?v=8';
  var FORMES = [
    ['vague', 'Vagues de particules (sans 3D)'], ['spark', 'Étincelle'], ['prism', 'Prisme'], ['bloom', 'Fleur'], ['star-soft', 'Étoile'],
    ['growth', 'Croissance'], ['squircle', 'Galet'], ['logo', 'Logo Blackstart'], ['anneaux', 'Anneaux seuls, sans forme'],
  ];
  var DEFAUT = 'vague';
  var PREF = 'bs-orbite', PREF_FORME = 'bs-orbite-forme';
  // Niveaux de qualité : on descend d'un cran si l'appareil peine.
  var NIVEAUX = [{ pixelRatio: 1.25, fps: 60 }, { pixelRatio: 0.85, fps: 60 }, { pixelRatio: 0.7, fps: 30 }];

  var CSS = [
    '#bs-orbite-fond{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;opacity:0;transition:opacity 1.6s ease;background:#000;contain:strict}',
    '#bs-orbite-fond canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
    // Voile : les textes restent lisibles à gauche et en haut, la forme brille à droite.
    '#bs-orbite-fond::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgb(0 0 0/.3),rgb(0 0 0/.1) 42%,rgb(0 0 0/0) 68%),linear-gradient(180deg,rgb(0 0 0/.25),rgb(0 0 0/0) 22%)}',
    'html[data-scheme="light"] #bs-orbite-fond{background:#fff}',
    'html[data-scheme="light"] #bs-orbite-fond canvas{filter:invert(1) hue-rotate(180deg) saturate(1.15)}',
    'html[data-scheme="light"] #bs-orbite-fond::after{background:linear-gradient(90deg,rgb(255 255 255/.55),rgb(255 255 255/.25) 42%,rgb(255 255 255/0) 68%),linear-gradient(180deg,rgb(255 255 255/.4),rgb(255 255 255/0) 22%)}',
    // Vagues de particules : bleu nuit, comme les maquettes ; en thème clair, les mêmes points sur fond clair.
    '#bs-orbite-fond.vague{background:radial-gradient(70% 55% at 85% 8%,#101c4d 0,transparent 70%),radial-gradient(60% 50% at 8% 95%,#1a1250 0,transparent 70%),linear-gradient(180deg,#060b22,#030616)}',
    '#bs-orbite-fond.vague::after{background:linear-gradient(90deg,rgb(3 6 22/.35),rgb(3 6 22/0) 30%)}',
    'html[data-scheme="light"] #bs-orbite-fond.vague{background:linear-gradient(180deg,#f6f8ff,#eef1fb)}',
    'html[data-scheme="light"] #bs-orbite-fond.vague canvas{filter:none;opacity:.7}',
    'html[data-scheme="light"] #bs-orbite-fond.vague::after{background:none}',
    'html.bs-vague:not([data-scheme="light"]){--aur-glass:color-mix(in srgb,var(--surface) 50%,transparent);--aur-glass-2:color-mix(in srgb,var(--surface) 64%,transparent);--aur-blur:blur(2px) saturate(1.25)}',
    'html.bs-vague:not([data-scheme="light"]) .topbar{background:linear-gradient(180deg,rgb(var(--bg-rgb)/.45),rgb(var(--bg-rgb)/.2))}',
    'html.bs-orbite #bs-orbite-fond{opacity:1}',
    'html.bs-orbite body{background:transparent}',
    'html.bs-orbite #bs-amb{display:none!important}',
    'html.bs-orbite body::before,html.bs-orbite #root::after{display:none}',
    'html.bs-orbite #root::before{opacity:.35}',
    'html.bs-orbite .bs-amb-zen-btn{display:none!important}',
    // Le menu et la barre du haut laissent passer la scène, en verre dépoli.
    '@media (min-width:1024px){html.bs-orbite .sidebar{background:linear-gradient(180deg,rgb(var(--bg-rgb)/.55),rgb(var(--bg-rgb)/.72))!important;-webkit-backdrop-filter:blur(20px) saturate(1.4);backdrop-filter:blur(20px) saturate(1.4)}}',
    'html.bs-orbite .topbar{background:linear-gradient(180deg,rgb(var(--bg-rgb)/.62),rgb(var(--bg-rgb)/.38))}',
  ].join('\n');

  var H = document.documentElement;
  var boite = null, arret = null, moteur = null, niveau = 0, abandon = false, lance = 0;
  var reduit = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  // Une fois par appareil : les choix faits pour l'ancien fond en verre 3D (forme, fond coupé quand il ralentissait le CRM)
  // ne cachent pas les vagues de particules demandées ensuite. Les choix faits après restent respectés.
  try {
    if (!localStorage.getItem('bs-orbite-vagues')) {
      localStorage.removeItem(PREF_FORME);
      if (localStorage.getItem(PREF) === 'off') localStorage.removeItem(PREF);
      localStorage.setItem('bs-orbite-vagues', '1');
    }
  } catch (e) { /* stockage bloqué */ }

  function mouvementReduit() { return reduit.matches || H.getAttribute('data-motion') === 'reduced'; }
  // Vagues : lentes et discrètes, elles tournent même si le système demande moins d'animations ; figées si le
  // réglage « Animations » du CRM est sur Réduites ou Aucune.
  function figer() { var m = H.getAttribute('data-motion'); return m === 'reduced' || m === 'none'; }
  function voulu() { try { return localStorage.getItem(PREF) !== 'off'; } catch (e) { return true; } }
  function forme() {
    var f = null;
    try { f = localStorage.getItem(PREF_FORME); } catch (e) { /* stockage bloqué */ }
    return FORMES.some(function (x) { return x[0] === f; }) ? f : DEFAUT;
  }

  // Rendu logiciel (pas de carte graphique : machine virtuelle, vieux PC, navigateur de test) : le verre 3D y serait
  // saccadé, on garde le fond habituel. « force » dans le réglage passe outre (captures d'écran).
  function forcer() { try { return localStorage.getItem(PREF) === 'force'; } catch (e) { return false; } }
  function logiciel() {
    try {
      var gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      var ext = gl.getExtension('WEBGL_debug_renderer_info');
      var r = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
      var l = gl.getExtension('WEBGL_lose_context'); if (l) l.loseContext();
      return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(r);
    } catch (e) { return false; }
  }

  function charger() {
    if (!moteur) moteur = import(MOTEUR);
    return moteur;
  }
  // Grand écran : la forme à droite, à côté des pages (lift < 0 la remonte : la caméra vise plus bas). Téléphone : le moteur la place lui-même (cadrage portrait).
  function placement() {
    var w = window.innerWidth;
    return w >= 1024 ? { lateral: -1.3, scale: 0.6, lift: -0.15 } : { lateral: -0.9, scale: 0.7, lift: 0 };
  }

  function arreter() {
    if (arret) { try { arret(); } catch (e) { /* déjà arrêté */ } }
    arret = null;
    if (boite) { boite.remove(); boite = null; }
    H.classList.remove('bs-vague');
    marquer(false);
  }
  // html.bs-orbite : le fond 3D est à l'écran. Ambiance retire alors l'image de la bannière (rien que l'animation).
  function marquer(on) {
    if (H.classList.contains('bs-orbite') === on) return;
    H.classList.toggle('bs-orbite', on);
    window.dispatchEvent(new Event('bs:orbite'));
  }
  // Vagues de particules (canevas 2D, sans moteur 3D) : deux rubans violet → bleu → cyan qui se croisent en bas,
  // un troisième en haut à droite, une poussière d'étoiles et des points lumineux qui flottent au milieu, qui ondulent
  // et glissent lentement. 30 images/s au plus.
  function vague(id) {
    boite = document.createElement('div'); boite.id = 'bs-orbite-fond'; boite.className = 'vague'; boite.setAttribute('aria-hidden', 'true'); boite.setAttribute('data-fige', String(figer()));
    var cv = document.createElement('canvas'); boite.appendChild(cv);
    document.body.insertBefore(boite, document.body.firstChild);
    var ctx = cv.getContext('2d');
    if (!ctx) { abandon = true; arreter(); return; }
    var graine = 11;
    function hasard() { graine = (graine * 16807) % 2147483647; return graine / 2147483647; }
    function gauss() { return (hasard() + hasard() + hasard() - 1.5) / 1.5; }
    var ARRETS = [[124, 77, 255], [76, 110, 245], [56, 208, 240]];
    function couleur(u) {
      var a = u < 0.5 ? ARRETS[0] : ARRETS[1], b = u < 0.5 ? ARRETS[1] : ARRETS[2], k = u < 0.5 ? u * 2 : (u - 0.5) * 2;
      return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * k) + ',' + Math.round(a[1] + (b[1] - a[1]) * k) + ',' + Math.round(a[2] + (b[2] - a[2]) * k) + ')';
    }
    // Rubans : position verticale (part de la hauteur), amplitude, longueur d'onde, début et fin en largeur, épaisseur.
    var RUBANS = [
      { y: 0.8, amp: 0.07, onde: 1.15, x0: -0.05, x1: 1.05, ep: 0.05, phase: 0, n: 3600 },
      { y: 0.8, amp: 0.07, onde: 1.15, x0: -0.05, x1: 1.05, ep: 0.045, phase: 2.2, n: 3200 },
      { y: 0.09, amp: 0.045, onde: 0.9, x0: 0.3, x1: 1.05, ep: 0.035, phase: 1, n: 2900, monte: 0.07 },
      { y: 0.98, amp: 0.05, onde: 1.4, x0: -0.05, x1: 1.05, ep: 0.04, phase: 4, n: 3800, monte: 0.8 },
    ];
    var points = [];
    RUBANS.forEach(function (r, i) {
      for (var k = 0; k < r.n; k++) {
        var u = hasard();
        points.push({ r: i, u: u, off: gauss(), sc: hasard() * 6.28, c: couleur(u), t: hasard() < 0.15 ? 2.4 : 1.5 });
      }
    });
    var etoiles = [];
    for (var e = 0; e < 520; e++) etoiles.push({ x: hasard(), y: hasard(), sc: hasard() * 6.28, a: 0.15 + hasard() * 0.4, t: hasard() < 0.12 ? 2 : 1 });
    // Poussière lumineuse qui flotte au milieu de l'écran, entre les rubans : de petits points qui montent lentement en dérivant.
    var poussiere = [];
    for (var d = 0; d < 320; d++) {
      var ud = hasard();
      poussiere.push({ x: hasard(), y: hasard(), v: 0.004 + hasard() * 0.01, sc: hasard() * 6.28, c: couleur(ud), t: hasard() < 0.25 ? 2.6 : 1.6 });
    }
    var W = 0, Hh = 0;
    function taille() {
      var dpr = Math.min(window.devicePixelRatio || 1, [1.5, 1, 0.75][niveau] || 1);
      W = window.innerWidth; Hh = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function dessiner(ms) {
      var t = ms / 1000;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, Hh);
      ctx.fillStyle = '#9fb4ff';
      for (var i = 0; i < etoiles.length; i++) {
        var s = etoiles[i];
        ctx.globalAlpha = s.a * (0.55 + 0.45 * Math.sin(t * 0.6 + s.sc));
        ctx.fillRect(s.x * W, s.y * Hh, s.t, s.t);
      }
      ctx.globalCompositeOperation = 'lighter';
      for (var m = 0; m < poussiere.length; m++) {
        var q = poussiere[m];
        var qy = (((q.y - t * q.v) % 1) + 1) % 1, qx = q.x + 0.012 * Math.sin(t * 0.3 + q.sc);
        ctx.globalAlpha = 0.35 + 0.4 * Math.sin(t * 0.7 + q.sc) * Math.sin(t * 0.7 + q.sc);
        ctx.fillStyle = q.c;
        ctx.fillRect(qx * W, qy * Hh, q.t, q.t);
        if (q.t > 2) { ctx.globalAlpha *= 0.25; ctx.fillRect(qx * W - 2, qy * Hh - 2, q.t + 4, q.t + 4); }
      }
      for (var j = 0; j < points.length; j++) {
        var p = points[j], r = RUBANS[p.r];
        // Les points glissent lentement le long du ruban ; la vague ondule plus lentement encore.
        var u = (p.u + t * 0.006) % 1, x = (r.x0 + (r.x1 - r.x0) * u) * W;
        var yc = (r.y - (r.monte || 0) * u) * Hh + r.amp * Hh * Math.sin(6.283 * u / r.onde + t * 0.22 + r.phase);
        var y = yc + p.off * r.ep * Hh;
        ctx.globalAlpha = Math.min(1, Math.max(0, 1 - Math.abs(p.off) * 0.45) * (0.7 + 0.3 * Math.sin(t * 0.9 + p.sc)));
        ctx.fillStyle = p.c;
        ctx.fillRect(x, y, p.t, p.t);
        // Halo autour des points les plus gros : la vague brille comme sur les maquettes.
        if (p.t > 2) { ctx.globalAlpha *= 0.22; ctx.fillRect(x - 2, y - 2, p.t + 4, p.t + 4); }
      }
      ctx.globalAlpha = 1;
    }
    taille();
    var prec = 0, image = 0, fini = false, nb = 0, cout = 0, fige = figer();
    function boucle(ms) {
      if (fini) return;
      image = requestAnimationFrame(boucle);
      if (ms - prec < 33 || document.hidden) return;
      prec = ms;
      var t0 = performance.now(); dessiner(ms); cout += performance.now() - t0; nb++;
      // Appareil qui peine (plus de 14 ms par image en moyenne) : moitié moins de points et de pixels, sans jamais couper le fond.
      if (nb === 60) {
        if (cout / nb > 14 && points.length > 1500) { points = points.filter(function (x, k) { return k % 2 === 0; }); if (niveau < 2) { niveau++; taille(); } }
        nb = 0; cout = 0;
      }
    }
    function redessiner() { taille(); if (fige) dessiner(20000); }
    if (fige) dessiner(20000); else image = requestAnimationFrame(boucle);
    window.addEventListener('resize', redessiner);
    arret = function () { fini = true; cancelAnimationFrame(image); window.removeEventListener('resize', redessiner); };
    H.classList.add('bs-vague'); marquer(true);
  }

  function demarrer() {
    var id = ++lance;
    // Navigateur piloté (tests) : fond habituel, sauf « force » (captures d'écran).
    if (forme() === 'vague') { if (navigator.webdriver && !forcer()) abandon = true; else vague(id); return; }
    charger().then(function (m) {
      if (id !== lance || arret || !voulu() || abandon || mouvementReduit()) return;
      if (!m.glassAvailable() || (!forcer() && logiciel())) { abandon = true; return; }
      var f = forme(), shape = f === 'logo' || f === 'anneaux' ? m.glassMark : (m.glassShapes && m.glassShapes[f]) || m.glassMark;
      boite = document.createElement('div'); boite.id = 'bs-orbite-fond'; boite.setAttribute('aria-hidden', 'true');
      var cv = document.createElement('canvas'); boite.appendChild(cv);
      document.body.insertBefore(boite, document.body.firstChild);
      var p = placement(), q = NIVEAUX[niveau];
      try {
        // root : la boîte du fond, pour que le moteur ne touche à rien d'autre dans le CRM.
        arret = m.startGlass({
          root: boite, canvas: cv, shape: shape, palette: m.sitePalette || m.glassPalette, autoplay: 30, fit: 'canvas',
          lateral: p.lateral, scale: p.scale, lift: p.lift, pixelRatio: q.pixelRatio, fps: q.fps, object: f !== 'anneaux',
          onReady: function () { if (id === lance) { marquer(true); surveiller(id); } },
        });
      } catch (e) {
        console.warn('Fond en verre 3D indisponible :', e && e.message);
        abandon = true; arreter();
      }
    }).catch(function (e) { console.warn('Fond en verre 3D indisponible :', e && e.message); abandon = true; });
  }
  function relancer() { lance++; arreter(); maj(); }
  function maj() {
    var vagues = forme() === 'vague';
    var on = voulu() && !abandon && (vagues || !mouvementReduit());
    if (!on) { lance++; arreter(); return; }
    if (arret && vagues && boite && boite.getAttribute('data-fige') !== String(figer())) { relancer(); return; }
    if (!arret) demarrer();
  }

  // Appareil qui peine (images plus longues que 40 ms la moitié du temps, sur 150 images ou 4 s) : un cran de
  // qualité en moins, puis le fond habituel.
  function surveiller(id) {
    var n = 0, lentes = 0, prec = 0, duree = 0;
    function image(now) {
      if (id !== lance || !arret) return;
      if (document.hidden) { prec = 0; requestAnimationFrame(image); return; }
      if (prec) { n++; duree += now - prec; if (now - prec > 40) lentes++; }
      prec = now;
      if (n < 150 && duree < 4000) { requestAnimationFrame(image); return; }
      if (forcer() || lentes < n / 2) return;
      if (niveau < NIVEAUX.length - 1) { niveau++; relancer(); }
      else { abandon = true; arreter(); }
    }
    setTimeout(function () { requestAnimationFrame(image); }, 1500);
  }

  function brancher() {
    var st = document.createElement('style'); st.id = 'bs-orbite-css'; st.textContent = CSS; document.head.appendChild(st);
    if (reduit.addEventListener) reduit.addEventListener('change', maj);
    // Cadrage grand écran / téléphone : on recadre quand on passe de l'un à l'autre.
    var large = window.innerWidth >= 1024;
    window.addEventListener('resize', function () {
      var l = window.innerWidth >= 1024;
      if (l !== large) { large = l; if (arret) relancer(); }
    });
    new MutationObserver(maj).observe(H, { attributes: true, attributeFilter: ['data-motion'] });
    maj();
  }

  window.bsOrbite = {
    etat: function () { return { actif: H.classList.contains('bs-orbite'), anime: !!arret, forme: forme(), niveau: niveau, abandon: abandon }; },
    voulu: voulu,
    formes: function () { return FORMES.map(function (x) { return { id: x[0], nom: x[1] }; }); },
    forme: forme,
    // Choix enregistrés sur cet appareil (Réglages › Ambiance).
    regler: function (on) {
      try { if (on) localStorage.removeItem(PREF); else localStorage.setItem(PREF, 'off'); } catch (e) { /* stockage bloqué */ }
      if (on) { abandon = false; niveau = 0; }
      maj();
      window.dispatchEvent(new Event('bs:orbite'));
    },
    choisirForme: function (f) {
      try { if (f === DEFAUT) localStorage.removeItem(PREF_FORME); else localStorage.setItem(PREF_FORME, f); } catch (e) { /* stockage bloqué */ }
      if (arret) relancer();
    },
  };
  if (document.body) brancher(); else document.addEventListener('DOMContentLoaded', brancher);
})();
