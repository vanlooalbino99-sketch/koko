/* Blackstart CRM : carte vectorielle de la rubrique « Carte clients ».
 *
 * - Fond de carte net (pays, départements français) d'après bs-carte-geo, en projection de Mercator, aux couleurs
 *   du thème clair ou sombre de l'application.
 * - Départements teintés selon le nombre de fiches (densité), cadrage automatique sur vos fiches.
 * - Une bulle par ville : taille = nombre de fiches, anneau = part de clients (vert) et de prospects (bleu).
 *   Les bulles trop proches se regroupent et se séparent en zoomant ; étiquettes placées sans chevauchement.
 * - Arcs lumineux depuis le siège, ondes ponctuelles (activité en direct), échelle en kilomètres.
 * - Glisser pour déplacer (avec élan), molette, pincement ou double-clic pour zoomer, clic sur une bulle.
 * - Lisible sur le monde entier : noms des pays, des océans et des grandes villes (bs-carte-villes), placés sans chevauchement.
 * - « Mode réaliste » : imagerie satellite nette à tous les niveaux de zoom avec routes, frontières et noms (Esri World
 *   Imagery, sans clé), ou Google Maps (satellite + plan) si le serveur fournit une clé GOOGLE_MAPS_KEY.
 * Rendu en canevas 2D, sans bibliothèque ; le fond est mis en cache et redessiné seulement quand la vue change.
 * « Réduire les animations » coupe les effets (la carte reste manipulable).
 */
(function () {
  'use strict';
  if (window.bsCarteMap) return;

  var DEG = Math.PI / 180, TAU = Math.PI * 2, YMAX = 3.1;
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return document.documentElement.getAttribute('data-motion') === 'reduced' || !!(mqReduce && mqReduce.matches); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function merc(lon, lat) { lat = clamp(lat, -85, 85); return [lon * DEG, Math.log(Math.tan(Math.PI / 4 + lat * DEG / 2))]; }
  function latOf(Y) { return (2 * Math.atan(Math.exp(Y)) - Math.PI / 2) / DEG; }
  function hexRgb(h) { var m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return [96, 165, 250]; var v = parseInt(m[1], 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + clamp(a, 0, 1).toFixed(3) + ')'; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // ------------------------------------------------------------------ fond de carte (décodé une fois)
  var LAYERS = null;
  function layers() {
    if (LAYERS) return LAYERS;
    var g = window.bsCarteGeo || { pays: [], dep: [] };
    function dec(list) {
      return list.map(function (e) {
        var q = e[1], rings = [], bb = [Infinity, Infinity, -Infinity, -Infinity];
        for (var i = 2; i < e.length; i++) {
          var a = e[i].split(','), f = new Float32Array(a.length), x = 0, y = 0, off = 0;
          for (var k = 0; k < a.length; k += 2) {
            x += +a[k]; y += +a[k + 1];
            // Passage de l'antiméridien (Russie, Fidji…) : on garde le contour continu, sinon une bande traverse la carte.
            if (k) { if (+a[k] > 180 * q) off -= 360; else if (+a[k] < -180 * q) off += 360; }
            var m = merc(x / q + off, y / q); f[k] = m[0]; f[k + 1] = m[1];
            if (m[0] < bb[0]) bb[0] = m[0]; if (m[1] < bb[1]) bb[1] = m[1]; if (m[0] > bb[2]) bb[2] = m[0]; if (m[1] > bb[3]) bb[3] = m[1];
          }
          rings.push(f);
        }
        return { n: e[0], rings: rings, bb: bb, heat: 0 };
      });
    }
    LAYERS = { pays: dec(g.pays || []), dep: dec(g.dep || []) };
    LAYERS.france = LAYERS.pays.filter(function (p) { return p.n === 'France'; })[0] || null;
    return LAYERS;
  }
  // Point dans un polygone (règle pair-impair, tous anneaux confondus), en coordonnées de Mercator.
  function inside(f, X, Y) {
    if (X < f.bb[0] || X > f.bb[2] || Y < f.bb[1] || Y > f.bb[3]) return false;
    var c = false;
    f.rings.forEach(function (r) {
      for (var i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
        var yi = r[i + 1], yj = r[j + 1];
        if ((yi > Y) !== (yj > Y) && X < (r[j] - r[i]) * (Y - yi) / (yj - yi) + r[i]) c = !c;
      }
    });
    return c;
  }

  // ------------------------------------------------------------------ couleurs (suivent le thème)
  var PAL = {
    dark: { sea0: '#040a18', sea1: '#071530', land: '#1a2944', land2: '#15233c', landLine: 'rgba(160,180,210,.36)', coast: 'rgba(125,211,252,.22)', fr: '#1d3052', frLine: 'rgba(160,180,210,.22)',
      frEdge: 'rgba(125,211,252,.7)', frGlow: 'rgba(56,189,248,.4)', heat: [56, 189, 248], grat: 'rgba(148,163,184,.07)', text: '#eaf1fb', sub: '#9fb3d1',
      halo: 'rgba(6,11,23,.9)', disc: '#0b1426', client: '#34d399', prospect: '#60a5fa', hub: '#fbbf24', glow: 0.38, vignette: 'rgba(2,5,12,.4)',
      country: 'rgba(214,226,243,.78)', countryHalo: 'rgba(10,18,34,.85)', city: '#dbe7f7', cityDot: '#e2ecf9', ocean: 'rgba(125,170,230,.5)' },
    light: { sea0: '#d4e4f6', sea1: '#c3d7ef', land: '#fbfcfe', land2: '#f1f5fa', landLine: 'rgba(71,85,105,.42)', coast: 'rgba(37,99,235,.18)', fr: '#ffffff', frLine: 'rgba(100,116,139,.24)',
      frEdge: 'rgba(37,99,235,.6)', frGlow: 'rgba(59,130,246,.2)', heat: [37, 99, 235], grat: 'rgba(71,85,105,.08)', text: '#0f172a', sub: '#475569',
      halo: 'rgba(255,255,255,.92)', disc: '#ffffff', client: '#10b981', prospect: '#3b82f6', hub: '#f59e0b', glow: 0.2, vignette: 'rgba(148,163,184,.18)',
      country: 'rgba(51,65,85,.82)', countryHalo: 'rgba(255,255,255,.9)', city: '#1e293b', cityDot: '#334155', ocean: 'rgba(30,64,140,.5)' },
  };
  // Mode réaliste : textes clairs sur l'imagerie, quel que soit le thème.
  PAL.sat = Object.assign({}, PAL.dark, { halo: 'rgba(0,0,0,.78)', sub: '#d5e2f3', disc: '#0b1426', glow: 0.5 });
  function scheme() { return document.documentElement.getAttribute('data-scheme') === 'light' ? 'light' : 'dark'; }

  // ------------------------------------------------------------------ noms (pays, océans, villes)
  var NOMS = null;
  // Point d'étiquette d'un pays : centre de gravité de son plus grand anneau (en Mercator).
  function labelPoint(f) {
    var best = null, ba = 0;
    f.rings.forEach(function (r) {
      var a = 0, cx = 0, cy = 0;
      for (var i = 0, j = r.length - 2; i < r.length; j = i, i += 2) { var c = r[j] * r[i + 1] - r[i] * r[j + 1]; a += c; cx += (r[j] + r[i]) * c; cy += (r[j + 1] + r[i + 1]) * c; }
      if (Math.abs(a) > ba) { ba = Math.abs(a); best = [cx / (3 * a), cy / (3 * a), r]; }
    });
    if (!best) return null;
    var r = best[2], x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (var i = 0; i < r.length; i += 2) { x0 = Math.min(x0, r[i]); x1 = Math.max(x1, r[i]); y0 = Math.min(y0, r[i + 1]); y1 = Math.max(y1, r[i + 1]); }
    return { X: best[0], Y: best[1], w: x1 - x0, h: y1 - y0, area: ba / 2 };
  }
  function noms() {
    if (NOMS) return NOMS;
    var src = window.bsCarteNoms || { pays: {}, villes: [] }, lay = layers();
    var pays = lay.pays.map(function (f) {
      var fr = src.pays[f.n]; if (fr === '') return null;
      var p = labelPoint(f); if (!p) return null;
      return Object.assign(p, { n: (fr || f.n).toUpperCase() });
    }).filter(Boolean).sort(function (a, b) { return b.area - a.area; });
    var villes = (src.villes || []).map(function (v) {
      var m = merc(v[1], v[2]);
      return { n: v[0], X: m[0], Y: m[1], pop: v[3], cap: !!v[4], fr: v[5] === 'FR', rank: v[3] * (v[4] ? 4 : 1) };
    }).sort(function (a, b) { return b.rank - a.rank; });
    var oceans = [['Océan Pacifique', -140, 8], ['Océan Pacifique', 170, 18], ['Océan Atlantique', -38, 28], ['Atlantique Sud', -18, -25], ['Océan Indien', 78, -20],
      ['Océan Arctique', -10, 79], ['Océan Austral', 60, -58], ['Mer Méditerranée', 17.5, 34.2, 1], ['Manche', -2.6, 49.95, 2], ['Golfe de Gascogne', -4.6, 45.4, 2],
      ['Mer du Nord', 3.5, 56, 1], ['Mer Baltique', 19.5, 57, 1], ['Mer Noire', 34, 43.3, 1], ['Mer des Caraïbes', -75, 15, 1], ['Golfe du Mexique', -90, 25, 1],
      ['Mer Rouge', 38.5, 20, 1], ['Mer d’Arabie', 64, 15, 1], ['Mer de Chine', 114, 14, 1], ['Mer de Tasman', 160, -38, 1]].map(function (o) {
      var m = merc(o[1], o[2]); return { n: o[0], X: m[0], Y: m[1], lvl: o[3] || 0 };
    });
    NOMS = { pays: pays, villes: villes, oceans: oceans };
    return NOMS;
  }

  // ------------------------------------------------------------------ tuiles du mode réaliste
  var ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
  var SOURCES = {
    esri: { attr: 'Imagerie © Esri, Maxar, Earthstar Geographics · Noms © Esri, HERE, Garmin', layers: [
      { url: ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}', max: 18, dpr: true },
      { url: ESRI + 'Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', max: 18, min: 6, alpha: 0.85 },
      { url: ESRI + 'Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', max: 18 },
    ] },
  };
  var TILES = new Map(), TILE_MAX = 700;
  function tile(url, onload) {
    var t = TILES.get(url);
    if (t) { TILES.delete(url); TILES.set(url, t); return t; } // le plus récent en dernier
    t = { img: new Image(), ok: false, bad: false };
    t.img.decoding = 'async';
    t.img.onload = function () { t.ok = true; onload(); };
    t.img.onerror = function () { t.bad = true; };
    t.img.src = url;
    TILES.set(url, t);
    if (TILES.size > TILE_MAX) { var it = TILES.keys(); for (var n = TILES.size - TILE_MAX; n > 0; n--) { var kk = it.next().value, old = TILES.get(kk); if (old && !old.ok) old.img.src = ''; TILES.delete(kk); } }
    return t;
  }
  // Google Maps (Map Tiles API) : satellite + routes et noms, si une clé est fournie. Sinon, ou en cas d'échec : Esri.
  var GOOGLE = null;
  function googleSource(key, done) {
    if (GOOGLE) { if (GOOGLE.src) done(GOOGLE.src); else GOOGLE.wait.push(done); return; }
    GOOGLE = { src: null, wait: [done] };
    var hi = (window.devicePixelRatio || 1) >= 1.5;
    fetch('https://tile.googleapis.com/v1/createSession?key=' + encodeURIComponent(key), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mapType: 'satellite', language: 'fr-FR', region: 'FR', layerTypes: ['layerRoadmap'], scale: hi ? 'scaleFactor2x' : 'scaleFactor1x', highDpi: hi }),
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); }).then(function (j) {
      GOOGLE.src = { attr: 'Imagerie et plan © Google', layers: [{ url: 'https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=' + encodeURIComponent(j.session) + '&key=' + encodeURIComponent(key), max: 21 }] };
      GOOGLE.wait.forEach(function (f) { f(GOOGLE.src); }); GOOGLE.wait = [];
    }).catch(function () { GOOGLE.src = SOURCES.esri; GOOGLE.wait.forEach(function (f) { f(SOURCES.esri); }); GOOGLE.wait = []; });
  }

  // ------------------------------------------------------------------ carte
  function create(canvas, o) {
    o = Object.assign({ markers: [], hub: null, onHover: null, onPick: null, padding: [104, 84, 76, 64], minK: 0, maxK: 160000, style: 'vecteur', google: null }, o || {});
    var SAT_MAXK = 256 * Math.pow(2, 19.6) / TAU; // environ le niveau 19,5 de Google Maps (une rue, un bâtiment)
    var style = o.style === 'satellite' ? 'satellite' : 'vecteur', src = SOURCES.esri;
    function maxK() { return style === 'satellite' ? SAT_MAXK : o.maxK; }
    var x = canvas.getContext('2d'), base = document.createElement('canvas'), bx = base.getContext('2d');
    var dpr = 1, W = 0, H = 0, raf = 0, alive = true, last = 0, clock = 0;
    var cX = merc(2.4, 46.6)[0], cY = merc(2.4, 46.6)[1], k = 2200; // centre (Mercator) et pixels par radian
    var fly = null, vX = 0, vY = 0, baseKey = '', pal = palette(), hover = null, sel = null;
    function palette() { return style === 'satellite' ? PAL.sat : PAL[scheme()]; }
    function useGoogle() { if (o.google && style === 'satellite') googleSource(o.google, function (s) { src = s; if (style === 'satellite') { baseKey = ''; kick(); } }); }
    var markers = [], hub = null, pings = [], drawn = [], pending = null;
    var lay = layers();

    function size() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      if (w === W && h === H && canvas.width === Math.round(w * dpr)) return;
      W = w; H = h;
      canvas.width = base.width = Math.round(W * dpr); canvas.height = base.height = Math.round(H * dpr);
      baseKey = '';
      if (pending && W > 10 && H > 10) { var p = pending; pending = null; p(); }
    }
    function minK() { return Math.max(o.minK, W / TAU * 0.92); }
    function sx(X) { return W / 2 + (X - cX) * k; }
    function sy(Y) { return H / 2 - (Y - cY) * k; }
    function bound() { k = clamp(k, minK(), maxK()); var half = H / 2 / k; cY = clamp(cY, -YMAX + half, YMAX - half); if (half > YMAX) cY = 0.75; }

    // ---- données
    function setMarkers(list) {
      var max = 1;
      markers = (list || []).map(function (m) { var p = merc(m.lon, m.lat); max = Math.max(max, m.n || 1); return Object.assign({}, m, { X: p[0], Y: p[1] }); });
      markers.forEach(function (m) { m.w = Math.sqrt((m.n || 1) / max); });
      // Densité par département (fiches de chaque ville situées dedans).
      lay.dep.forEach(function (d) { d.heat = 0; });
      var hm = 0;
      markers.forEach(function (m) {
        if (lay.france && !inside(lay.france, m.X, m.Y)) return;
        for (var i = 0; i < lay.dep.length; i++) if (inside(lay.dep[i], m.X, m.Y)) { lay.dep[i].heat += m.n || 1; hm = Math.max(hm, lay.dep[i].heat); break; }
      });
      lay.dep.forEach(function (d) { d.heat = hm ? d.heat / hm : 0; });
      baseKey = '';
    }
    function setHub(h) { hub = h ? Object.assign({}, h, { X: merc(h.lon, h.lat)[0], Y: merc(h.lon, h.lat)[1] }) : null; }

    // ---- vues
    function flyTo(X, Y, kk, ms) {
      kk = clamp(kk, minK(), maxK());
      if (reduced() || !ms) { cX = X; cY = Y; k = kk; bound(); fly = null; return; }
      fly = { x0: cX, y0: cY, k0: k, x1: X, y1: Y, k1: kk, t: 0, d: ms };
    }
    function fitPoints(pts, ms, pad) {
      var run = function () {
        if (!pts.length) { flyTo(merc(2.4, 46.6)[0], merc(2.4, 46.6)[1], H / 0.22, ms); return; }
        var a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
        pts.forEach(function (p) { var m = merc(p.lon, p.lat); a = Math.min(a, m[0]); b = Math.min(b, m[1]); c = Math.max(c, m[0]); d = Math.max(d, m[1]); });
        var P = pad || o.padding, w = Math.max(40, W - P[1] - P[3]), h = Math.max(40, H - P[0] - P[2]);
        // Étendue minimale : une vingtaine de kilomètres autour d'une ville seule.
        var span = Math.max(c - a, (d - b) * w / h, 0.006);
        var kk = Math.min(w / span, h / Math.max(d - b, span * h / w));
        flyTo((a + c) / 2 + (P[1] - P[3]) / 2 / kk, (b + d) / 2 + (P[2] - P[0]) / 2 / kk, kk, ms);
      };
      if (W > 10 && H > 10) run(); else pending = run;
    }

    // ---- fond (mis en cache)
    // line = tracé de contour : on lève le crayon au passage de l'antiméridien (Russie, Fidji, Antarctique),
    // sinon une ligne horizontale traverse toute la carte.
    function path(c, f, line) {
      c.beginPath();
      f.rings.forEach(function (r) {
        var px = -1e9, py = -1e9, cut = false;
        for (var i = 0; i < r.length; i += 2) {
          var X = sx(r[i]), Y = sy(r[i + 1]);
          if (i && Math.abs(X - px) < 0.6 && Math.abs(Y - py) < 0.6 && i < r.length - 2) continue;
          if (line && i && Math.abs(r[i] - r[i - 2]) > 3) { c.moveTo(X, Y); cut = true; }
          else if (!i) c.moveTo(X, Y); else c.lineTo(X, Y);
          px = X; py = Y;
        }
        if (!cut) c.closePath();
      });
    }
    function visibleF(f) { return sx(f.bb[2]) >= 0 && sx(f.bb[0]) <= W && sy(f.bb[1]) >= 0 && sy(f.bb[3]) <= H; }
    // Imagerie : niveau de tuile adapté au zoom (pixels physiques pour la photo, pixels CSS pour les noms, plus lisibles) ;
    // tant qu'une tuile charge, on agrandit sa tuile parente déjà en cache : jamais de trou blanc.
    function drawTiles(c) {
      c.fillStyle = '#0b1220'; c.fillRect(0, 0, W, H);
      var world = TAU * k, ox = W / 2 - (cX + Math.PI) * k, oy = H / 2 - (Math.PI - cY) * k, again = function () { baseKey = ''; kick(); };
      src.layers.forEach(function (L) {
        var zf = Math.log2(world * (L.dpr ? dpr : 1) / 256), z = clamp(Math.round(zf - (L.dpr ? 0.15 : 0)), 0, L.max);
        if (L.min && zf < L.min - 0.5) return;
        var n = 1 << z, ts = world / n;
        var x0 = Math.floor(-ox / ts), x1 = Math.floor((W - ox) / ts), y0 = Math.max(0, Math.floor(-oy / ts)), y1 = Math.min(n - 1, Math.floor((H - oy) / ts));
        if ((x1 - x0 + 1) * (y1 - y0 + 1) > 400) return;
        c.globalAlpha = L.alpha || 1;
        for (var ty = y0; ty <= y1; ty++) for (var tx = x0; tx <= x1; tx++) {
          var wx = ((tx % n) + n) % n, px = ox + tx * ts, py = oy + ty * ts;
          var t = tile(L.url.replace('{z}', z).replace('{x}', wx).replace('{y}', ty), again);
          if (t.ok) { c.drawImage(t.img, px, py, ts + 0.5, ts + 0.5); continue; }
          // En attendant : un ancêtre basse définition (demandé aussi, une tuile en couvre 64), recadré.
          if (z > 3) tile(L.url.replace('{z}', z - 3).replace('{x}', wx >> 3).replace('{y}', ty >> 3), again);
          for (var up = 1; up <= Math.min(12, z); up++) {
            var pz = z - up, f = 1 << up, pt = TILES.get(L.url.replace('{z}', pz).replace('{x}', Math.floor(wx / f)).replace('{y}', Math.floor(ty / f)));
            if (pt && pt.ok) {
              var s0 = pt.img.naturalWidth / f;
              c.drawImage(pt.img, (wx % f) * s0, (ty % f) * s0, s0, s0, px, py, ts + 0.5, ts + 0.5);
              break;
            }
          }
        }
        c.globalAlpha = 1;
      });
    }
    function attribution(c) {
      c.font = '600 10px Inter,system-ui,sans-serif'; c.textAlign = 'right'; c.textBaseline = 'bottom';
      var w = c.measureText(src.attr).width + 12;
      c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(W - w, H - 16, w, 16);
      c.fillStyle = 'rgba(255,255,255,.85)'; c.fillText(src.attr, W - 6, H - 3); c.textAlign = 'left';
    }
    // Noms : océans, pays (plus grands d'abord) puis villes (les plus peuplées d'abord), sans chevauchement.
    function drawNames(c) {
      var N = noms(), rects = [], z = Math.log2(TAU * k / 256);
      function free(R) { if (R.x < 4 || R.y < 4 || R.x + R.w > W - 4 || R.y + R.h > H - 4) return false; for (var i = 0; i < rects.length; i++) { var q = rects[i]; if (R.x < q.x + q.w && R.x + R.w > q.x && R.y < q.y + q.h && R.y + R.h > q.y) return false; } return true; }
      function text(t, px, py, fill, halo, lw) { c.lineJoin = 'round'; c.strokeStyle = halo; c.lineWidth = lw; c.strokeText(t, px, py); c.fillStyle = fill; c.fillText(t, px, py); }
      // Bulles de vos fiches et leur étiquette (à droite) : place réservée, elles s'affichent au premier plan.
      var occupied = markers.map(function (m) { return [sx(m.X), sy(m.Y)]; });
      occupied.forEach(function (q) { rects.push({ x: q[0] - 24, y: q[1] - 24, w: 48, h: 48 }); });
      clusters().slice(0, 6).forEach(function (cl) { rects.push({ x: cl.x - cl.r - 150, y: cl.y - cl.r - 8, w: 2 * cl.r + 320, h: 2 * cl.r + 16 }); });
      c.textBaseline = 'middle'; c.textAlign = 'center';
      // Océans et mers.
      N.oceans.forEach(function (o2) {
        if ((o2.lvl === 0 && z > 5.2) || (o2.lvl === 1 && (z < 2.6 || z > 7.5)) || (o2.lvl === 2 && (z < 4.6 || z > 9))) return;
        var px = sx(o2.X), py = sy(o2.Y);
        c.font = 'italic 600 ' + (o2.lvl ? 11 : 12.5) + 'px Inter,system-ui,sans-serif';
        var w = c.measureText(o2.n).width, R = { x: px - w / 2, y: py - 8, w: w, h: 16 };
        if (!free(R)) return; rects.push(R);
        c.fillStyle = pal.ocean; c.fillText(o2.n, px, py);
      });
      // Pays : nom en capitales espacées, taille selon la place à l'écran.
      if (z < 8.5) N.pays.forEach(function (p) {
        var pw = p.w * k, ph = p.h * k; if (pw < 26 || ph < 10) return;
        var px = sx(p.X), py = sy(p.Y); if (px < -50 || px > W + 50 || py < -20 || py > H + 20) return;
        var size = clamp(Math.sqrt(p.area) * k / 9, 9.5, 15);
        c.font = '700 ' + size.toFixed(1) + 'px Inter,system-ui,sans-serif';
        try { c.letterSpacing = (size / 8).toFixed(1) + 'px'; } catch (e) {}
        var w = c.measureText(p.n).width; if (w > pw * 1.25 && pw < 90) { try { c.letterSpacing = '0px'; } catch (e) {} return; }
        var R = { x: px - w / 2 - 2, y: py - size / 2 - 2, w: w + 4, h: size + 4 };
        if (free(R)) { rects.push(R); text(p.n, px, py, pal.country, pal.countryHalo, 3); }
        try { c.letterSpacing = '0px'; } catch (e) {}
      });
      // Villes : seuil de population selon le zoom ; les capitales passent avant.
      var minPop = z < 2.4 ? 4000 : z < 3.4 ? 1500 : z < 4.4 ? 600 : z < 5.4 ? 200 : z < 6.4 ? 90 : 0, shown = 0;
      c.textAlign = 'left';
      for (var i = 0; i < N.villes.length && shown < 90; i++) {
        var v = N.villes[i];
        if (v.pop < minPop && !(v.cap && v.pop * 6 >= minPop)) continue;
        var px = sx(v.X), py = sy(v.Y); if (px < 0 || px > W || py < 0 || py > H) continue;
        if (occupied.some(function (q) { return Math.abs(q[0] - px) < 34 && Math.abs(q[1] - py) < 22; })) continue;
        var big = v.cap || v.pop >= 3000, size = big ? 12 : 11;
        c.font = (big ? '700 ' : '600 ') + size + 'px Inter,system-ui,sans-serif';
        var w = c.measureText(v.n).width, dot = { x: px - 4, y: py - 4, w: 8, h: 8 };
        var spots = [[px + 6, py - size / 2 - 1], [px - 6 - w, py - size / 2 - 1], [px - w / 2, py - size - 8], [px - w / 2, py + 5]], R = null;
        if (!free(dot)) continue;
        for (var s2 = 0; s2 < spots.length && !R; s2++) { var q = { x: spots[s2][0], y: spots[s2][1], w: w + 2, h: size + 2 }; if (free(q)) R = q; }
        if (!R) continue;
        rects.push(dot, R); shown++;
        c.fillStyle = pal.countryHalo; c.beginPath(); c.arc(px, py, v.cap ? 3.6 : 3, 0, TAU); c.fill();
        c.fillStyle = pal.cityDot; c.beginPath(); c.arc(px, py, v.cap ? 2.4 : 1.9, 0, TAU); c.fill();
        if (v.cap) { c.strokeStyle = pal.cityDot; c.lineWidth = 1; c.beginPath(); c.arc(px, py, 4.4, 0, TAU); c.stroke(); }
        text(v.n, R.x + 1, R.y + size / 2 + 1, pal.city, pal.countryHalo, 3.2);
      }
      c.textAlign = 'left';
    }
    function drawBase() {
      var c = bx;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (style === 'satellite') { drawTiles(c); attribution(c); return; }
      var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, pal.sea0); g.addColorStop(1, pal.sea1);
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      // Graticule discret (pas adapté au zoom).
      var stepDeg = [30, 10, 5, 2, 1, 0.5, 0.25].filter(function (s) { return s * DEG * k > 90; }).pop() || 30;
      var lonA = (cX - W / 2 / k) / DEG, lonB = (cX + W / 2 / k) / DEG, latA = latOf(cY - H / 2 / k), latB = latOf(cY + H / 2 / k);
      c.strokeStyle = pal.grat; c.lineWidth = 1; c.beginPath();
      for (var lo = Math.ceil(lonA / stepDeg) * stepDeg; lo <= lonB; lo += stepDeg) { var X = Math.round(sx(lo * DEG)) + 0.5; c.moveTo(X, 0); c.lineTo(X, H); }
      for (var la = Math.ceil(latA / stepDeg) * stepDeg; la <= latB; la += stepDeg) { var Y = Math.round(sy(merc(0, la)[1])) + 0.5; c.moveTo(0, Y); c.lineTo(W, Y); }
      c.stroke();
      // Pays : liseré lumineux des côtes, deux teintes alternées pour distinguer les voisins, frontières nettes.
      c.lineJoin = 'round';
      var vis = lay.pays.filter(visibleF);
      c.save(); c.strokeStyle = pal.coast; c.lineWidth = 3.2;
      vis.forEach(function (f) { path(c, f, true); c.stroke(); });
      c.restore();
      vis.forEach(function (f, i) {
        path(c, f); c.fillStyle = f.n.length % 2 ? pal.land : pal.land2; c.fill('evenodd');
        path(c, f, true); c.strokeStyle = pal.landLine; c.lineWidth = 0.9; c.stroke();
      });
      // France : départements teintés selon la densité, puis contour lumineux.
      var showDep = k > 900, fade = clamp(1 - Math.log(Math.max(1, k / 12000)) / Math.log(10), 0.35, 1); // teinte plus légère de près
      if (showDep) {
        lay.dep.forEach(function (f) {
          if (!visibleF(f)) return;
          path(c, f);
          c.fillStyle = pal.fr; c.fill('evenodd');
          if (f.heat > 0) { c.fillStyle = rgba(pal.heat, (0.1 + 0.42 * Math.sqrt(f.heat)) * fade); c.fill('evenodd'); }
          c.strokeStyle = pal.frLine; c.lineWidth = k > 6000 ? 1 : 0.7; c.stroke();
        });
      }
      if (lay.france && visibleF(lay.france)) {
        path(c, lay.france);
        c.save(); c.shadowColor = pal.frGlow; c.shadowBlur = 14; c.strokeStyle = pal.frEdge; c.lineWidth = 1.3; c.stroke(); c.restore();
      }
      // Vignette douce sur les bords.
      var v = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) * 0.62);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, pal.vignette);
      c.fillStyle = v; c.fillRect(0, 0, W, H);
      drawNames(c);
    }

    // ---- regroupement des bulles et étiquettes
    function radius(w) { var z = clamp(Math.log(k / 2000) / Math.log(40), 0, 1); return (6 + 15 * w) * (0.85 + 0.35 * z); }
    function clusters() {
      var list = markers.filter(function (m) { return !m.hub; }).slice().sort(function (a, b) { return (b.n || 1) - (a.n || 1); });
      var out = [];
      list.forEach(function (m) {
        var px = sx(m.X), py = sy(m.Y), r = radius(m.w);
        for (var i = 0; i < out.length; i++) {
          var c = out[i];
          if (Math.hypot(c.x - px, c.y - py) < c.r + r + 8) { c.items.push(m); c.n += m.n || 1; c.clients += m.clients || 0; return; }
        }
        out.push({ x: px, y: py, r: r, items: [m], n: m.n || 1, clients: m.clients || 0, m: m });
      });
      var maxN = out.reduce(function (s, c) { return Math.max(s, c.n); }, 1);
      out.forEach(function (c) { if (c.items.length > 1) c.r = Math.min(34, radius(Math.sqrt(c.n / maxN)) + 3); });
      return out;
    }
    function label(c, txt, sub, px, py, rects, self) {
      x.font = '700 12.5px Inter,system-ui,sans-serif';
      var w1 = x.measureText(txt).width;
      x.font = '600 11px Inter,system-ui,sans-serif';
      var w2 = sub ? x.measureText(sub).width : 0, w = Math.max(w1, w2) + 4, h = sub ? 30 : 16;
      var spots = [[px + c.r + 7, py - h / 2], [px - c.r - 7 - w, py - h / 2], [px - w / 2, py - c.r - 6 - h], [px - w / 2, py + c.r + 6]];
      for (var i = 0; i < spots.length; i++) {
        var R = { x: spots[i][0], y: spots[i][1], w: w, h: h };
        if (R.x < 6 || R.y < 50 || R.x + w > W - 56 || R.y + h > H - 46) continue;
        if (rects.some(function (q) { return q.id !== self && R.x < q.x + q.w && R.x + R.w > q.x && R.y < q.y + q.h && R.y + R.h > q.y; })) continue;
        rects.push(R);
        x.textBaseline = 'top'; x.lineJoin = 'round';
        x.font = '700 12.5px Inter,system-ui,sans-serif'; x.strokeStyle = pal.halo; x.lineWidth = 4; x.strokeText(txt, R.x + 2, R.y); x.fillStyle = pal.text; x.fillText(txt, R.x + 2, R.y);
        if (sub) { x.font = '600 11px Inter,system-ui,sans-serif'; x.strokeText(sub, R.x + 2, R.y + 16); x.fillStyle = pal.sub; x.fillText(sub, R.x + 2, R.y + 16); }
        return true;
      }
      return false;
    }

    // ---- dessin du premier plan
    function bubble(c, t) {
      var px = c.x, py = c.y, r = c.r * (hover === c.key ? 1.12 : 1), cl = pal.client, pr = pal.prospect;
      var share = c.n ? c.clients / c.n : 0, main = hexRgb(share >= 0.5 ? cl : pr);
      // Halo.
      var g = x.createRadialGradient(px, py, r * 0.4, px, py, r * 2.4);
      g.addColorStop(0, rgba(main, pal.glow)); g.addColorStop(1, rgba(main, 0));
      x.fillStyle = g; x.beginPath(); x.arc(px, py, r * 2.4, 0, TAU); x.fill();
      // Sélection : anneau qui respire.
      if (sel && c.items.some(function (m) { return m.key === sel; })) {
        var s = 0.5 + 0.5 * Math.sin(t * 3);
        x.strokeStyle = rgba(main, 0.35 + 0.4 * s); x.lineWidth = 2; x.beginPath(); x.arc(px, py, r + 6 + 3 * s, 0, TAU); x.stroke();
      }
      // Disque et anneau (part de clients / prospects).
      x.fillStyle = pal.disc; x.beginPath(); x.arc(px, py, r, 0, TAU); x.fill();
      var lw = Math.max(2.6, r * 0.3), rr = r - lw / 2, a0 = -Math.PI / 2;
      x.lineWidth = lw; x.lineCap = 'butt';
      if (share < 1) { x.strokeStyle = pr; x.beginPath(); x.arc(px, py, rr, a0 + share * TAU, a0 + TAU); x.stroke(); }
      if (share > 0) { x.strokeStyle = cl; x.beginPath(); x.arc(px, py, rr, a0, a0 + share * TAU); x.stroke(); }
      if (hover === c.key) { x.strokeStyle = pal.text; x.lineWidth = 1.5; x.beginPath(); x.arc(px, py, r + 1.5, 0, TAU); x.stroke(); }
      if (r >= 10) {
        x.fillStyle = pal.text; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.font = '800 ' + Math.round(clamp(r * 0.62, 10, 15)) + 'px Inter,system-ui,sans-serif';
        x.fillText(String(c.n), px, py + 0.5); x.textAlign = 'left';
      } else { x.fillStyle = share >= 0.5 ? cl : pr; x.beginPath(); x.arc(px, py, Math.max(1.8, r * 0.3), 0, TAU); x.fill(); }
    }
    function arcs(list, t) {
      if (!hub) return;
      var hx = sx(hub.X), hy = sy(hub.Y), still = reduced();
      list.forEach(function (c, i) {
        var dx = c.x - hx, dy = c.y - hy, d = Math.hypot(dx, dy);
        if (d < c.r + 8) return;
        var mx = (hx + c.x) / 2 - dy * 0.22, my = (hy + c.y) / 2 + dx * 0.22 - d * 0.08;
        var col = hexRgb(c.clients / c.n >= 0.5 ? pal.client : pal.prospect);
        var g = x.createLinearGradient(hx, hy, c.x, c.y); g.addColorStop(0, rgba(hexRgb(pal.hub), 0.5)); g.addColorStop(1, rgba(col, 0.55));
        x.strokeStyle = g; x.lineWidth = 1.2; x.setLineDash([]);
        x.beginPath(); x.moveTo(hx, hy); x.quadraticCurveTo(mx, my, c.x, c.y); x.stroke();
        if (still) return;
        var L = d * 1.15, off = ((t * 90 + i * 37) % (L + 60));
        x.strokeStyle = rgba(col, 0.95); x.lineWidth = 2; x.setLineDash([14, L + 60]); x.lineDashOffset = -off;
        x.beginPath(); x.moveTo(hx, hy); x.quadraticCurveTo(mx, my, c.x, c.y); x.stroke();
        x.setLineDash([]);
      });
    }
    function drawHub() {
      if (!hub) return;
      var px = sx(hub.X), py = sy(hub.Y), s = 8;
      if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return;
      var c = hexRgb(pal.hub), g = x.createRadialGradient(px, py, 2, px, py, 26);
      g.addColorStop(0, rgba(c, 0.45)); g.addColorStop(1, rgba(c, 0));
      x.fillStyle = g; x.beginPath(); x.arc(px, py, 26, 0, TAU); x.fill();
      x.save(); x.translate(px, py); x.rotate(Math.PI / 4);
      x.fillStyle = pal.hub; x.strokeStyle = pal.disc; x.lineWidth = 2; x.fillRect(-s / 2 - 1, -s / 2 - 1, s + 2, s + 2); x.strokeRect(-s / 2 - 1, -s / 2 - 1, s + 2, s + 2);
      x.restore();
      drawn.push({ x: px, y: py, r: 12, hub: true, m: hub, key: '__hub' });
    }
    function drawPings(dt) {
      pings = pings.filter(function (p) {
        p.age += dt; if (p.age > p.life) return false;
        var px = sx(p.X), py = sy(p.Y), t = p.age / p.life, c = hexRgb(p.color);
        if (px < -60 || px > W + 60 || py < -60 || py > H + 60) return true;
        for (var i = 0; i < 2; i++) {
          var tt = (t * 1.6 + i * 0.35) % 1;
          x.strokeStyle = rgba(c, (1 - tt) * 0.8); x.lineWidth = 2; x.beginPath(); x.arc(px, py, 6 + tt * 38, 0, TAU); x.stroke();
        }
        if (p.text && p.age < p.life - 0.6) {
          x.font = '700 12px Inter,system-ui,sans-serif'; var w = x.measureText(p.text).width + 18, bx2 = clamp(px - w / 2, 8, W - w - 8), by = py - 46;
          x.globalAlpha = clamp(Math.min(p.age * 3, (p.life - 0.6 - p.age) * 3), 0, 1);
          x.fillStyle = pal.disc; x.strokeStyle = rgba(c, 0.7); x.lineWidth = 1;
          rr(bx2, by, w, 24, 12); x.fill(); x.stroke();
          x.fillStyle = pal.text; x.textBaseline = 'middle'; x.fillText(p.text, bx2 + 9, by + 12.5);
          x.globalAlpha = 1;
        }
        return true;
      });
    }
    function rr(a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
    // Échelle en kilomètres (latitude du centre).
    function scaleBar() {
      var mPerPx = 6371000 * Math.cos(latOf(cY) * DEG) / k, target = 110 * mPerPx;
      var steps = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000];
      var m = steps.filter(function (s) { return s <= target; }).pop() || steps[0], w = m / mPerPx;
      var px = W - 18 - w, py = H - 40;
      x.strokeStyle = pal.halo; x.lineWidth = 5; x.lineCap = 'round';
      x.beginPath(); x.moveTo(px, py - 5); x.lineTo(px, py); x.lineTo(px + w, py); x.lineTo(px + w, py - 5); x.stroke();
      x.strokeStyle = pal.sub; x.lineWidth = 1.6;
      x.beginPath(); x.moveTo(px, py - 5); x.lineTo(px, py); x.lineTo(px + w, py); x.lineTo(px + w, py - 5); x.stroke();
      var t = m >= 1000 ? (m / 1000) + ' km' : m + ' m';
      x.font = '700 11px Inter,system-ui,sans-serif'; x.textBaseline = 'bottom'; x.textAlign = 'center';
      x.strokeStyle = pal.halo; x.lineWidth = 3; x.strokeText(t, px + w / 2, py - 4); x.fillStyle = pal.sub; x.fillText(t, px + w / 2, py - 4);
      x.textAlign = 'left'; x.lineCap = 'butt';
    }

    function frame(ts) {
      if (!alive) return;
      raf = 0;
      if (!canvas.isConnected) { destroy(); return; }
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts; clock += dt;
      size();
      if (fly) {
        fly.t += dt * 1000; var e = ease(Math.min(1, fly.t / fly.d));
        cX = fly.x0 + (fly.x1 - fly.x0) * e; cY = fly.y0 + (fly.y1 - fly.y0) * e; k = Math.exp(Math.log(fly.k0) + (Math.log(fly.k1) - Math.log(fly.k0)) * e);
        if (fly.t >= fly.d) fly = null;
      } else if (!dragging && (Math.abs(vX) > 1e-6 || Math.abs(vY) > 1e-6)) {
        cX -= vX * dt; cY -= vY * dt; vX *= Math.pow(0.04, dt); vY *= Math.pow(0.04, dt);
        if (Math.abs(vX * k) < 4 && Math.abs(vY * k) < 4) { vX = vY = 0; }
      }
      bound();
      var key = [W, H, dpr, cX.toFixed(9), cY.toFixed(9), k.toFixed(3), scheme(), style].join('|');
      if (key !== baseKey) { drawBase(); baseKey = key; }
      x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(base, 0, 0);
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      var list = clusters();
      list.forEach(function (c) { c.key = c.items.length > 1 ? 'c:' + c.items.map(function (m) { return m.key; }).join('|') : c.m.key; });
      drawn = [];
      arcs(list, clock);
      drawHub();
      list.slice().reverse().forEach(function (c) { if (c.x > -40 && c.x < W + 40 && c.y > -40 && c.y < H + 40) bubble(c, clock); drawn.push({ x: c.x, y: c.y, r: c.r + 4, c: c, key: c.key }); });
      // Étiquettes : les plus grosses villes d'abord, sans chevaucher une bulle ni une autre étiquette.
      var rects = list.map(function (c) { return { id: c.key, x: c.x - c.r - 2, y: c.y - c.r - 2, w: 2 * c.r + 4, h: 2 * c.r + 4 }; });
      if (hub) { var hx = sx(hub.X), hy = sy(hub.Y); rects.push({ id: '__hub', x: hx - 10, y: hy - 10, w: 20, h: 20 }); }
      list.slice(0, 10).forEach(function (c, i) {
        if (c.x < 0 || c.x > W || c.y < 0 || c.y > H) return;
        var group = c.items.length > 1, name = group ? c.m.name + ' +' + (c.items.length - 1) : c.m.name;
        var sub = group ? c.items.length + ' villes · ' + c.n + ' fiches' : (i < 5 || /€/.test(c.m.sub || '') ? c.m.sub || '' : '');
        label(c, name, sub, c.x, c.y, rects, c.key);
      });
      if (hub && hx > 0 && hx < W && hy > 0 && hy < H) label({ r: 9 }, hub.name || 'Siège', 'siège', hx, hy, rects, '__hub');
      drawPings(dt);
      scaleBar();
      if (!reduced() || fly || pings.length || vX || vY) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && alive) raf = requestAnimationFrame(frame); }

    // ---- interactions
    var dragging = false, ptrs = {}, downAt = null, lastMove = null, pinch = null, moved = 0;
    function local(e) { var r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    function zoomAt(f, px, py) {
      var X = cX + (px - W / 2) / k, Y = cY - (py - H / 2) / k, nk = clamp(k * f, minK(), maxK());
      cX = X - (px - W / 2) / nk; cY = Y + (py - H / 2) / nk; k = nk; fly = null; bound(); kick();
    }
    function pick(px, py) {
      var best = null, bd = 1e9;
      drawn.forEach(function (d) { var q = Math.hypot(d.x - px, d.y - py); if (q < d.r && q < bd) { bd = q; best = d; } });
      return best;
    }
    function onDown(e) {
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
      ptrs[e.pointerId] = local(e);
      var ids = Object.keys(ptrs);
      if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), k: k }; return; }
      dragging = true; fly = null; vX = vY = 0; moved = 0; downAt = local(e); lastMove = { p: downAt, t: performance.now() };
    }
    function onMove(e) {
      var p = local(e);
      if (ptrs[e.pointerId]) ptrs[e.pointerId] = p;
      var ids = Object.keys(ptrs);
      if (pinch && ids.length === 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        zoomAt(pinch.k * d / pinch.d / k, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); return;
      }
      if (dragging && lastMove) {
        var dx = p[0] - lastMove.p[0], dy = p[1] - lastMove.p[1], now = performance.now(), dt = Math.max(1, now - lastMove.t) / 1000;
        moved += Math.abs(dx) + Math.abs(dy);
        cX -= dx / k; cY += dy / k; vX = -dx / k / dt * 0.6; vY = dy / k / dt * 0.6; bound();
        lastMove = { p: p, t: now }; canvas.style.cursor = 'grabbing'; kick(); return;
      }
      var h = pick(p[0], p[1]), key = h ? h.key : null;
      canvas.style.cursor = h && !h.hub ? 'pointer' : 'grab';
      if (key !== hover) { hover = key; kick(); }
      if (o.onHover) o.onHover(h && h.c ? h.c : null, p[0], p[1]);
    }
    function onUp(e) {
      delete ptrs[e.pointerId];
      if (pinch) { if (Object.keys(ptrs).length < 2) pinch = null; dragging = false; return; }
      if (!dragging) return;
      dragging = false; canvas.style.cursor = 'grab';
      if (lastMove && performance.now() - lastMove.t > 80) vX = vY = 0;
      if (moved < 5) {
        vX = vY = 0;
        var p = local(e), h = pick(p[0], p[1]);
        if (h && h.c) {
          if (h.c.items.length > 1) fitPoints(h.c.items.map(function (m) { return { lon: m.lon, lat: m.lat }; }), 900);
          else if (o.onPick) o.onPick(h.c.m);
        }
      }
      kick();
    }
    function onWheel(e) { e.preventDefault(); var p = local(e); zoomAt(Math.exp(-clamp(e.deltaY, -120, 120) * 0.0022), p[0], p[1]); }
    function onDbl(e) { var p = local(e); var f = e.shiftKey ? 0.5 : 2, X = cX + (p[0] - W / 2) / k, Y = cY - (p[1] - H / 2) / k; flyTo(X - (p[0] - W / 2) / (k * f), Y + (p[1] - H / 2) / (k * f), k * f, 450); kick(); }
    function onLeave() { if (!dragging && hover) { hover = null; if (o.onHover) o.onHover(null); kick(); } }
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('dblclick', onDbl);
    canvas.style.cursor = 'grab';
    // Changement de thème ou de taille : on redessine.
    var mo = new MutationObserver(function () { pal = palette(); baseKey = ''; kick(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-scheme', 'data-motion'] });
    var ro = window.ResizeObserver ? new ResizeObserver(function () { size(); kick(); }) : null;
    if (ro) ro.observe(canvas);
    function onVis() { if (!document.hidden) { last = 0; kick(); } }
    document.addEventListener('visibilitychange', onVis);

    function destroy() {
      alive = false; if (raf) cancelAnimationFrame(raf); raf = 0;
      mo.disconnect(); if (ro) ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('pointerleave', onLeave); canvas.removeEventListener('wheel', onWheel); canvas.removeEventListener('dblclick', onDbl);
    }

    setMarkers(o.markers); setHub(o.hub); size(); useGoogle(); kick();
    return {
      setStyle: function (st) { style = st === 'satellite' ? 'satellite' : 'vecteur'; pal = palette(); baseKey = ''; bound(); useGoogle(); kick(); },
      setMarkers: function (l) { setMarkers(l); kick(); },
      setHub: function (h) { setHub(h); kick(); },
      fit: function (pts, ms, pad) { fitPoints(pts || markers, ms == null ? 1100 : ms, pad); kick(); },
      focus: function (lon, lat, spanKm, ms) {
        var run = function () { var m = merc(lon, lat), span = (spanKm || 40) / 6371 / Math.cos(lat * DEG); flyTo(m[0], m[1], Math.min(W, H) * 0.8 / span, ms == null ? 1000 : ms); kick(); };
        if (W > 10 && H > 10) run(); else pending = run;
      },
      world: function () { flyTo(merc(10, 30)[0], merc(10, 30)[1], minK() * 1.05, 1200); kick(); },
      zoomBy: function (f) { var tk = (fly ? fly.k1 : k) * f; flyTo(fly ? fly.x1 : cX, fly ? fly.y1 : cY, tk, 380); kick(); },
      ping: function (lon, lat, color, text) {
        var m = merc(lon, lat);
        pings.forEach(function (p) { if (Math.abs(p.X - m[0]) < 2e-4 && Math.abs(p.Y - m[1]) < 2e-4) p.text = null; }); // une seule étiquette par lieu
        pings.push({ X: m[0], Y: m[1], color: color || pal.client, text: text, age: 0, life: 3.4 }); kick(); },
      select: function (key) { sel = key || null; kick(); },
      destroy: destroy,
    };
  }

  window.bsCarteMap = { create: create };
})();
