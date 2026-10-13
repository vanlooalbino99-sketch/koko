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
  var MOTEUR = '/verre/verre.js?v=9';
  var FORMES = [
    ['spark', 'Étincelle'], ['prism', 'Prisme'], ['bloom', 'Fleur'], ['star-soft', 'Étoile'],
    ['growth', 'Croissance'], ['squircle', 'Galet'], ['logo', 'Logo Blackstart'], ['anneaux', 'Anneaux seuls, sans forme'],
  ];
  var DEFAUT = 'spark';
  var PREF = 'bs-orbite', PREF_FORME = 'bs-orbite-forme';
  // Niveaux de qualité : on descend d'un cran si l'appareil peine.
  // Premier niveau : rendu plus fin que l'écran (supersample) pour un verre net, jusqu'à 2 pixels par point.
  var NIVEAUX = [
    { pixelRatio: 2, supersample: 1.5, fps: 60 }, { pixelRatio: 1.5, supersample: 1, fps: 60 },
    { pixelRatio: 1, supersample: 1, fps: 60 }, { pixelRatio: 0.75, supersample: 1, fps: 30 },
  ];

  var CSS = [
    '#bs-orbite-fond{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;opacity:0;transition:opacity 1.6s ease;background:#000;contain:strict}',
    '#bs-orbite-fond canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
    // Voile : les textes restent lisibles à gauche et en haut, la forme brille à droite.
    '#bs-orbite-fond::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgb(0 0 0/.3),rgb(0 0 0/.1) 42%,rgb(0 0 0/0) 68%),linear-gradient(180deg,rgb(0 0 0/.25),rgb(0 0 0/0) 22%)}',
    'html[data-scheme="light"] #bs-orbite-fond{background:#fff}',
    'html[data-scheme="light"] #bs-orbite-fond canvas{filter:invert(1) hue-rotate(180deg) saturate(1.15)}',
    'html[data-scheme="light"] #bs-orbite-fond::after{background:linear-gradient(90deg,rgb(255 255 255/.55),rgb(255 255 255/.25) 42%,rgb(255 255 255/0) 68%),linear-gradient(180deg,rgb(255 255 255/.4),rgb(255 255 255/0) 22%)}',
    'html.bs-orbite #bs-orbite-fond{opacity:1}',
    'html.bs-orbite body{background:transparent}',
    'html.bs-orbite #bs-amb{display:none!important}',
    'html.bs-orbite body::before,html.bs-orbite #root::after{display:none}',
    'html.bs-orbite #root::before{opacity:.35}',
    'html.bs-orbite .bs-amb-zen-btn{display:none!important}',
  ].join('\n');

  // Thème « verre 3D » : tant que la scène est à l'écran, tout le CRM devient du verre net qui la laisse voir
  // (cartes, menu, barre du haut, colonnes du pipeline, tableaux, agenda, fenêtres, menus). Flou léger pour garder
  // l'animation nette ; les éléments collants (en-têtes) et les fenêtres gardent un peu plus de matière pour la
  // lisibilité. « html.bs-orbite body » passe devant les règles d'ambiance (html.bs-amb-fond …).
  // --bso-v : verre clair des grandes surfaces ; --bso-f : flou. --surface-2 n'a pas de version rgb : color-mix.
  var G = 'html.bs-orbite body ';
  function sel(l) { return l.split(',').map(function (x) { return G + x.trim(); }).join(','); }
  var FLOU = '-webkit-backdrop-filter:blur(var(--bso-f)) saturate(1.35);backdrop-filter:blur(var(--bso-f)) saturate(1.35)';
  var THEME = [
    'html.bs-orbite{--bso-v:.46;--bso-f:7px;--bso-epais:.74}',
    'html.bs-orbite[data-scheme="light"]{--bso-v:.58;--bso-epais:.82}',
    // Grandes surfaces : verre clair, reflet discret en haut.
    sel('.card,.kpi,.kb-col,.week-wrap,.month,.script-step,.call-top,.call-foot,.paper-wrap') +
      '{background:linear-gradient(180deg,rgb(255 255 255/.05),rgb(255 255 255/0) 38%),rgb(var(--surface-rgb)/var(--bso-v))!important;' + FLOU + '}',
    sel('.hero') + '{background:radial-gradient(90% 120% at var(--mx,96%) 0%,rgb(var(--accent-rgb)/.26) 0%,transparent 58%),rgb(var(--surface-rgb)/var(--bso-v))!important;' + FLOU + '}',
    sel('.kb-card') + '{background:rgb(var(--bg-rgb)/.42)!important}',
    'html.bs-orbite[data-scheme="light"] body .kb-card{background:rgb(255 255 255/.6)!important}',
    // Navigation : menu de gauche, barre du haut, barre du bas (téléphone).
    '@media (min-width:1024px){' + sel('.sidebar') + '{background:linear-gradient(180deg,rgb(var(--bg-rgb)/.34),rgb(var(--bg-rgb)/.5))!important;-webkit-backdrop-filter:blur(12px) saturate(1.4);backdrop-filter:blur(12px) saturate(1.4)}}',
    sel('.topbar') + '{background:linear-gradient(180deg,rgb(var(--bg-rgb)/.5),rgb(var(--bg-rgb)/.22))!important;-webkit-backdrop-filter:blur(12px) saturate(1.5);backdrop-filter:blur(12px) saturate(1.5)}',
    sel('.bottom-nav') + '{background:rgb(var(--bg-rgb)/.58)!important;-webkit-backdrop-filter:blur(14px) saturate(1.5);backdrop-filter:blur(14px) saturate(1.5)}',
    // Ce qui passe au-dessus du contenu qui défile, et les fenêtres : un peu plus de matière.
    sel('.table th,.wk-dayhead,.wk-hour,.wk-corner,.bulk-bar,.modal-foot') + '{background:rgb(var(--surface-rgb)/var(--bso-epais))!important;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}',
    sel('.modal,.drawer,.palette') + '{background:linear-gradient(180deg,rgb(255 255 255/.06),rgb(255 255 255/0) 30%),rgb(var(--surface-rgb)/var(--bso-epais))!important;-webkit-backdrop-filter:blur(16px) saturate(1.4);backdrop-filter:blur(16px) saturate(1.4)}',
    sel('.menu') + '{background:color-mix(in srgb,var(--surface-2) 78%,transparent)!important;-webkit-backdrop-filter:blur(16px) saturate(1.4);backdrop-filter:blur(16px) saturate(1.4)}',
    sel('.overlay') + '{background:rgb(3 7 15/.28)!important;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}',
    sel('.call-screen') + '{background:rgb(var(--bg-rgb)/.35)!important}',
    // Petits éléments : champs, puces, boutons secondaires, onglets, en verre aussi.
    sel('.input,.checkbox') + '{background-color:rgb(var(--bg-rgb)/.4)!important}',
    'html.bs-orbite[data-scheme="light"] body .input{background-color:rgb(255 255 255/.62)!important}',
    sel('.search-input,.topbar-search,.chip,.bsm-search,.bsm-compose') + '{background:rgb(var(--surface-rgb)/.5)!important}',
    sel('.pill,.segmented,.btn-secondary,.icon-btn-secondary,.p-action,.quick-dates button,.empty-icon,.kpi-icon,.mm-item') + '{background:color-mix(in srgb,var(--surface-2) 58%,transparent)!important}',
    // Les anneaux et bords dessinés avec la couleur du fond deviennent invisibles sur le verre.
    sel('.tl-icon') + '{box-shadow:none!important}',
    sel('.bs-moi-menu,.bsm-emojis') + '{background:color-mix(in srgb,var(--surface) 72%,transparent)!important;-webkit-backdrop-filter:blur(16px) saturate(1.4);backdrop-filter:blur(16px) saturate(1.4)}',
    sel('.bso-vue,.bsn-edit') + '{background-color:color-mix(in srgb,var(--surface-2) 45%,transparent)!important}',
  ].join('\n');

  var H = document.documentElement;
  var boite = null, arret = null, moteur = null, niveau = 0, abandon = false, lance = 0;
  var reduit = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  function mouvementReduit() { return reduit.matches || H.getAttribute('data-motion') === 'reduced'; }
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
    marquer(false);
  }
  // html.bs-orbite : le fond 3D est à l'écran. Ambiance retire alors l'image de la bannière (rien que l'animation).
  function marquer(on) {
    if (H.classList.contains('bs-orbite') === on) return;
    H.classList.toggle('bs-orbite', on);
    window.dispatchEvent(new Event('bs:orbite'));
  }
  function demarrer() {
    var id = ++lance;
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
          lateral: p.lateral, scale: p.scale, lift: p.lift, pixelRatio: q.pixelRatio, supersample: q.supersample, fps: q.fps, object: f !== 'anneaux',
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
    var on = voulu() && !abandon && !mouvementReduit();
    if (!on) { lance++; arreter(); return; }
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
    var st = document.createElement('style'); st.id = 'bs-orbite-css'; st.textContent = CSS + '\n' + THEME; document.head.appendChild(st);
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
