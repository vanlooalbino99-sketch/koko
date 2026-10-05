/* Blackstart CRM : carte vectorielle de la rubrique « Carte clients ».
 *
 * - Fond de carte net (pays, départements français) d'après bs-carte-geo, en projection de Mercator, aux couleurs
 *   du thème clair ou sombre de l'application.
 * - Départements teintés selon le nombre de fiches (densité), cadrage automatique sur vos fiches.
 * - Une bulle par ville : taille = nombre de fiches, anneau = part de clients (vert) et de prospects (bleu).
 *   Les bulles trop proches se regroupent et se séparent en zoomant ; étiquettes placées sans chevauchement.
 * - Arcs lumineux depuis le siège, ondes ponctuelles (activité en direct), échelle en kilomètres.
 * - Glisser pour déplacer (avec élan), molette, pincement ou double-clic pour zoomer, clic sur une bulle.
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
          var a = e[i].split(','), f = new Float32Array(a.length), x = 0, y = 0;
          for (var k = 0; k < a.length; k += 2) {
            x += +a[k]; y += +a[k + 1];
            var m = merc(x / q, y / q); f[k] = m[0]; f[k + 1] = m[1];
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
    dark: { sea0: '#060b17', sea1: '#0a1630', land: '#101b30', landLine: 'rgba(148,163,184,.16)', fr: '#14223b', frLine: 'rgba(148,163,184,.17)',
      frEdge: 'rgba(125,211,252,.55)', frGlow: 'rgba(56,189,248,.35)', heat: [56, 189, 248], grat: 'rgba(148,163,184,.06)', text: '#eaf1fb', sub: '#9fb3d1',
      halo: 'rgba(6,11,23,.9)', disc: '#0b1426', client: '#34d399', prospect: '#60a5fa', hub: '#fbbf24', glow: 0.38, vignette: 'rgba(2,5,12,.55)' },
    light: { sea0: '#eaf1fa', sea1: '#dce7f5', land: '#f7f9fc', landLine: 'rgba(100,116,139,.28)', fr: '#ffffff', frLine: 'rgba(100,116,139,.2)',
      frEdge: 'rgba(37,99,235,.55)', frGlow: 'rgba(59,130,246,.18)', heat: [37, 99, 235], grat: 'rgba(100,116,139,.08)', text: '#0f172a', sub: '#475569',
      halo: 'rgba(255,255,255,.92)', disc: '#ffffff', client: '#10b981', prospect: '#3b82f6', hub: '#f59e0b', glow: 0.2, vignette: 'rgba(148,163,184,.25)' },
  };
  function scheme() { return document.documentElement.getAttribute('data-scheme') === 'light' ? 'light' : 'dark'; }

  // ------------------------------------------------------------------ carte
  function create(canvas, o) {
    o = Object.assign({ markers: [], hub: null, onHover: null, onPick: null, padding: [104, 84, 76, 64], minK: 0, maxK: 160000 }, o || {});
    var x = canvas.getContext('2d'), base = document.createElement('canvas'), bx = base.getContext('2d');
    var dpr = 1, W = 0, H = 0, raf = 0, alive = true, last = 0, clock = 0;
    var cX = merc(2.4, 46.6)[0], cY = merc(2.4, 46.6)[1], k = 2200; // centre (Mercator) et pixels par radian
    var fly = null, vX = 0, vY = 0, baseKey = '', pal = PAL[scheme()], hover = null, sel = null;
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
    function bound() { k = clamp(k, minK(), o.maxK); var half = H / 2 / k; cY = clamp(cY, -YMAX + half, YMAX - half); if (half > YMAX) cY = 0.75; }

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
      kk = clamp(kk, minK(), o.maxK);
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
    function path(c, f) {
      c.beginPath();
      f.rings.forEach(function (r) {
        var px = -1e9, py = -1e9;
        for (var i = 0; i < r.length; i += 2) {
          var X = sx(r[i]), Y = sy(r[i + 1]);
          if (i && Math.abs(X - px) < 0.6 && Math.abs(Y - py) < 0.6 && i < r.length - 2) continue;
          if (!i) c.moveTo(X, Y); else c.lineTo(X, Y);
          px = X; py = Y;
        }
        c.closePath();
      });
    }
    function visibleF(f) { return sx(f.bb[2]) >= 0 && sx(f.bb[0]) <= W && sy(f.bb[1]) >= 0 && sy(f.bb[3]) <= H; }
    function drawBase() {
      var c = bx;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, pal.sea0); g.addColorStop(1, pal.sea1);
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      // Graticule discret (pas adapté au zoom).
      var stepDeg = [30, 10, 5, 2, 1, 0.5, 0.25].filter(function (s) { return s * DEG * k > 90; }).pop() || 30;
      var lonA = (cX - W / 2 / k) / DEG, lonB = (cX + W / 2 / k) / DEG, latA = latOf(cY - H / 2 / k), latB = latOf(cY + H / 2 / k);
      c.strokeStyle = pal.grat; c.lineWidth = 1; c.beginPath();
      for (var lo = Math.ceil(lonA / stepDeg) * stepDeg; lo <= lonB; lo += stepDeg) { var X = Math.round(sx(lo * DEG)) + 0.5; c.moveTo(X, 0); c.lineTo(X, H); }
      for (var la = Math.ceil(latA / stepDeg) * stepDeg; la <= latB; la += stepDeg) { var Y = Math.round(sy(merc(0, la)[1])) + 0.5; c.moveTo(0, Y); c.lineTo(W, Y); }
      c.stroke();
      // Pays.
      c.lineJoin = 'round';
      lay.pays.forEach(function (f) {
        if (!visibleF(f)) return;
        path(c, f); c.fillStyle = pal.land; c.fill('evenodd');
        c.strokeStyle = pal.landLine; c.lineWidth = 0.8; c.stroke();
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
      var key = [W, H, dpr, cX.toFixed(7), cY.toFixed(7), k.toFixed(3), pal === PAL.dark].join('|');
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
      var X = cX + (px - W / 2) / k, Y = cY - (py - H / 2) / k, nk = clamp(k * f, minK(), o.maxK);
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
    var mo = new MutationObserver(function () { pal = PAL[scheme()]; baseKey = ''; kick(); });
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

    setMarkers(o.markers); setHub(o.hub); size(); kick();
    return {
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
