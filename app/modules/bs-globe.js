
/* Blackstart CRM : globe 3D interactif (ambiance « Globe connecté » et rubrique « Carte clients »).
 *
 * - Planète en points lumineux (continents d'après bs-galerie), atmosphère, anneau orbital, étoiles, comètes.
 * - Tourne toute seule ; se fait tourner à la souris ou au doigt (avec élan), molette ou pincement pour zoomer.
 * - Marqueurs pulsants (clients, prospects, siège), arcs lumineux parcourus d'impulsions depuis le siège,
 *   survol et clic sur un marqueur, centrage animé sur un lieu, onde ponctuelle sur un lieu (activité en direct).
 * - Annuaire hors ligne des villes (France, DOM, Europe, monde) et des départements (code postal) pour
 *   localiser les clients sans service extérieur ; repli facultatif sur OpenStreetMap (Nominatim).
 * Rendu en canevas 2D (projection orthographique) : léger, sans bibliothèque. « Réduire les animations » arrête
 * la rotation automatique (le globe reste manipulable).
 */
(function () {
  'use strict';
  if (window.bsGlobe) return;

  var DEG = Math.PI / 180, TAU = Math.PI * 2;
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return document.documentElement.getAttribute('data-motion') === 'reduced' || !!(mqReduce && mqReduce.matches); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + clamp(a, 0, 1).toFixed(3) + ')'; }

  // ------------------------------------------------------------------ points de la planète (calculés une fois)
  // Deux semis de points (sphère de Fibonacci) selon le zoom ; au-delà, une trame en latitude / longitude
  // dont le pas suit le zoom, avec une carte des terres calculée au fur et à mesure (cellules de 1/8 de degré).
  var PTS = {};
  function points(N) {
    if (PTS[N]) return PTS[N];
    var terre = window.bsTerre || function () { return false; };
    var ga = Math.PI * (3 - Math.sqrt(5)), land = [], sea = [], seaEvery = N > 20000 ? 6 : 3;
    for (var k = 0; k < N; k++) {
      var la = Math.asin(1 - 2 * (k + 0.5) / N), lo = ((k * ga) % TAU) - Math.PI;
      var c = Math.cos(la), v = [c * Math.sin(lo), Math.sin(la), c * Math.cos(lo)];
      if (terre(lo / DEG, la / DEG)) land.push(v); else if (k % seaEvery === 0) sea.push(v);
    }
    return (PTS[N] = { land: flat(land), sea: flat(sea) });
  }
  var RAS_W = 2880, RAS_H = 1440, RASTER = null;
  function isLand(lo, la) {
    if (!RASTER) RASTER = new Uint8Array(RAS_W * RAS_H);
    lo = ((lo + 180) % 360 + 360) % 360;
    var ix = Math.min(RAS_W - 1, Math.floor(lo * 8)), iy = Math.min(RAS_H - 1, Math.max(0, Math.floor((la + 90) * 8))), i = iy * RAS_W + ix;
    if (!RASTER[i]) RASTER[i] = (window.bsTerre && window.bsTerre(ix / 8 - 180 + 0.0625, iy / 8 - 90 + 0.0625)) ? 2 : 1;
    return RASTER[i] === 2;
  }
  function flat(a) { var f = new Float32Array(a.length * 3); a.forEach(function (v, i) { f[i * 3] = v[0]; f[i * 3 + 1] = v[1]; f[i * 3 + 2] = v[2]; }); return f; }
  function vec(lon, lat) { var c = Math.cos(lat * DEG); return [c * Math.sin(lon * DEG), Math.sin(lat * DEG), c * Math.cos(lon * DEG)]; }

  // ------------------------------------------------------------------ globe
  function create(canvas, o) {
    o = Object.assign({ background: 'space', autoRotate: 7, interactive: true, zoom: true, minZoom: 0.7, maxZoom: 10,
      center: [0.5, 0.5], radius: 0.4, lon: 2, lat: 30, markers: [], hub: null, arcs: true, ring: true, labels: true,
      onHover: null, onPick: null, density: 1 }, o || {});
    var x = canvas.getContext('2d'), dpr = 1, W = 0, H = 0, raf = 0, last = 0, alive = true;
    var lon0 = o.lon, lat0 = o.lat, zoom = 1, vLon = 0, vLat = 0, dragging = false, idleUntil = 0, focusAnim = null, zoomTo = null;
    var markers = [], hub = o.hub, hover = null, pings = [], stars = [], comets = [], clock = 0;

    function size() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, o.density < 1 ? 1 : 2);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = [];
      var n = Math.round(W * H / 2600);
      for (var i = 0; i < n; i++) stars.push([Math.random() * W, Math.random() * H, Math.random() < 0.9 ? 0.5 + Math.random() * 0.9 : 1.4 + Math.random(), 0.25 + Math.random() * 0.7, Math.random() * TAU]);
    }
    function geom() { var R = Math.min(W, H) * o.radius * zoom; return { cx: W * o.center[0], cy: H * o.center[1], R: R }; }
    // Rotation : longitude centrale lon0, inclinaison lat0.
    function rot(v) {
      var a = -lon0 * DEG, b = lat0 * DEG, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      var X = v[0] * ca + v[2] * sa, Z = -v[0] * sa + v[2] * ca, Y = v[1];
      return [X, Y * cb - Z * sb, Y * sb + Z * cb];
    }
    function screen(r, g) { return [g.cx + g.R * r[0], g.cy - g.R * r[1]]; }

    function setMarkers(list) {
      markers = (list || []).map(function (m) { return Object.assign({}, m, { v: vec(m.lon, m.lat), ph: Math.random() * TAU }); });
    }
    setMarkers(o.markers);

    // ---------------- dessin
    function draw(dt) {
      var g = geom(), cx = g.cx, cy = g.cy, R = g.R;
      x.clearRect(0, 0, W, H);
      if (o.background === 'space') {
        var bg = x.createRadialGradient(cx, cy, R * 0.2, cx, cy, Math.max(W, H));
        bg.addColorStop(0, '#071631'); bg.addColorStop(0.45, '#040b1c'); bg.addColorStop(1, '#01030a');
        x.fillStyle = bg; x.fillRect(0, 0, W, H);
        for (var s = 0; s < stars.length; s++) {
          var st = stars[s], tw = 0.55 + 0.45 * Math.sin(clock * 1.3 + st[4]);
          x.fillStyle = rgba([210, 228, 255], st[3] * tw);
          x.fillRect((st[0] - lon0 * 0.6 % W + W) % W, st[1], st[2], st[2]);
        }
        drawComets(dt);
      }
      // Halo d'atmosphère
      x.save(); x.globalCompositeOperation = 'lighter';
      var at = x.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.45);
      at.addColorStop(0, 'rgba(70,150,255,.42)'); at.addColorStop(0.25, 'rgba(40,110,240,.16)'); at.addColorStop(1, 'rgba(20,60,180,0)');
      x.fillStyle = at; x.beginPath(); x.arc(cx, cy, R * 1.45, 0, TAU); x.fill();
      x.restore();
      if (o.ring) drawRing(g, false);
      // Corps
      var body = x.createRadialGradient(cx - R * 0.35, cy - R * 0.42, R * 0.08, cx, cy, R);
      body.addColorStop(0, '#0e2650'); body.addColorStop(0.6, '#061430'); body.addColorStop(1, '#020815');
      x.fillStyle = body; x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.fill();
      drawGrid(g);
      drawDots(g);
      // Liseré lumineux du limbe
      var rim = x.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      rim.addColorStop(0, 'rgba(140,200,255,.85)'); rim.addColorStop(0.5, 'rgba(80,150,255,.25)'); rim.addColorStop(1, 'rgba(60,120,255,.05)');
      x.strokeStyle = rim; x.lineWidth = 1.6; x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.stroke();
      if (o.arcs && hub) drawArcs(g);
      drawMarkers(g);
      drawPings(g, dt);
      if (o.ring) drawRing(g, true);
      // Soleil rasant derrière le limbe
      x.save(); x.globalCompositeOperation = 'lighter';
      var sx = cx + Math.cos(-0.85) * R, sy = cy + Math.sin(-0.85) * R, sun = x.createRadialGradient(sx, sy, 0, sx, sy, R * 0.7);
      sun.addColorStop(0, 'rgba(230,240,255,.55)'); sun.addColorStop(0.15, 'rgba(120,180,255,.22)'); sun.addColorStop(1, 'rgba(60,120,255,0)');
      x.fillStyle = sun; x.fillRect(sx - R * 0.7, sy - R * 0.7, R * 1.4, R * 1.4);
      x.restore();
    }
    var L = [-0.42, 0.5, 0.76];
    var COLS = [[40, 120, 230, 0.45], [60, 160, 255, 0.6], [110, 200, 255, 0.78], [180, 236, 255, 0.95]];
    function drawDots(g) {
      if (zoom >= 3.4) return drawGridDots(g);
      var P = points(zoom < 1.7 ? 12000 : 40000);
      var a = -lon0 * DEG, b = lat0 * DEG, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      var R = g.R, cx = g.cx, cy = g.cy;
      var sz = clamp(R / (zoom < 1.7 ? 160 : 230), 1.1, 3.4);
      x.save(); x.globalCompositeOperation = 'lighter';
      // Océans : points discrets.
      x.fillStyle = 'rgba(60,120,220,.16)';
      var f = P.sea, i, X, Y, Z, Y2, Z2;
      for (i = 0; i < f.length; i += 3) {
        X = f[i] * ca + f[i + 2] * sa; Z = -f[i] * sa + f[i + 2] * ca; Y = f[i + 1];
        Z2 = Y * sb + Z * cb; if (Z2 <= 0.02) continue; Y2 = Y * cb - Z * sb;
        x.fillRect(cx + R * X - 0.7, cy - R * Y2 - 0.7, 1.4, 1.4);
      }
      // Terres : 4 niveaux de lumière (éclairées en haut à gauche, plus vives au centre).
      var buckets = [[], [], [], []];
      f = P.land;
      for (i = 0; i < f.length; i += 3) {
        X = f[i] * ca + f[i + 2] * sa; Z = -f[i] * sa + f[i + 2] * ca; Y = f[i + 1];
        Z2 = Y * sb + Z * cb; if (Z2 <= 0.01) continue; Y2 = Y * cb - Z * sb;
        var lit = 0.35 + 0.65 * Math.max(0, X * L[0] + Y2 * L[1] + Z2 * L[2]);
        buckets[Math.min(3, Math.floor(lit * 4))].push(cx + R * X, cy - R * Y2, Z2);
      }
      paintBuckets(buckets, sz);
      x.restore();
    }
    function paintBuckets(buckets, sz) {
      for (var k = 0; k < 4; k++) {
        var bk = buckets[k]; x.fillStyle = rgba(COLS[k], COLS[k][3]);
        for (var i = 0; i < bk.length; i += 3) { var s = sz * (0.45 + 0.55 * Math.sqrt(bk[i + 2])); x.fillRect(bk[i] - s / 2, bk[i + 1] - s / 2, s, s); }
      }
    }
    // Vue régionale : trame de points accrochée aux latitudes / longitudes (elle tourne avec la planète).
    function drawGridDots(g) {
      var R = g.R, cx = g.cx, cy = g.cy, want = 9 / (R * DEG), step = 0.125;
      while (step * 2 <= want) step *= 2;
      var span = Math.asin(Math.min(1, Math.hypot(W, H) / 2 / R)) / DEG + step;
      var a = -lon0 * DEG, b = lat0 * DEG, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      var buckets = [[], [], [], []], sea = [], sz = clamp(step * DEG * R * 0.42, 1.2, 4);
      var la0 = Math.max(-89, lat0 - span), la1 = Math.min(89, lat0 + span);
      for (var la = Math.ceil(la0 / step) * step; la <= la1; la += step) {
        var cl = Math.cos(la * DEG), sl = Math.sin(la * DEG), lsp = Math.min(180, span / Math.max(0.05, cl));
        // Pas en longitude élargi selon la latitude : points espacés pareil dans les deux sens (la trame ne dépend
        // que de la latitude et du zoom, elle reste donc stable pendant la rotation).
        var ila = Math.round(la / step), ls = step / Math.max(0.05, cl);
        for (var lo = Math.ceil((lon0 - lsp) / ls) * ls; lo <= lon0 + lsp; lo += ls) {
          var v0 = cl * Math.sin(lo * DEG), v2 = cl * Math.cos(lo * DEG);
          var X = v0 * ca + v2 * sa, Z = -v0 * sa + v2 * ca, Z2 = sl * sb + Z * cb;
          if (Z2 <= 0.01) continue;
          var Y2 = sl * cb - Z * sb, px = cx + R * X, py = cy - R * Y2;
          if (px < -6 || py < -6 || px > W + 6 || py > H + 6) continue;
          if (isLand(lo, la)) {
            var lit = 0.35 + 0.65 * Math.max(0, X * L[0] + Y2 * L[1] + Z2 * L[2]);
            buckets[Math.min(3, Math.floor(lit * 4))].push(px, py, Z2);
          } else if ((Math.round(lo / ls) + ila) % 3 === 0) sea.push(px, py);
        }
      }
      x.save(); x.globalCompositeOperation = 'lighter';
      x.fillStyle = 'rgba(60,120,220,.16)';
      for (var i = 0; i < sea.length; i += 2) x.fillRect(sea[i] - 0.8, sea[i + 1] - 0.8, 1.6, 1.6);
      paintBuckets(buckets, sz);
      x.restore();
    }
    function drawGrid(g) {
      x.save(); x.strokeStyle = 'rgba(110,170,255,.07)'; x.lineWidth = 1;
      for (var m = -180; m < 180; m += 30) line(g, function (t) { return vec(m, -90 + t * 180); }, 48);
      for (var p = -60; p <= 60; p += 30) line(g, function (t) { return vec(-180 + t * 360, p); }, 96);
      x.restore();
    }
    function line(g, fn, n) {
      x.beginPath(); var pen = false;
      for (var i = 0; i <= n; i++) {
        var r = rot(fn(i / n));
        if (r[2] < 0) { pen = false; continue; }
        var s = screen(r, g);
        if (pen) x.lineTo(s[0], s[1]); else { x.moveTo(s[0], s[1]); pen = true; }
      }
      x.stroke();
    }
    function drawRing(g, front) {
      var tiltA = 1.28, tiltB = -0.3, R = g.R;
      x.save(); x.globalCompositeOperation = 'lighter'; x.lineWidth = Math.max(1, R / 220);
      x.beginPath(); var pen = false;
      for (var k = 0; k <= 200; k++) {
        var ph = k / 200 * TAU + clock * 0.02, px = Math.cos(ph) * 1.34, pz = Math.sin(ph) * 1.34;
        var y1 = -pz * Math.sin(tiltA), z1 = pz * Math.cos(tiltA);
        var x2 = px * Math.cos(tiltB) - y1 * Math.sin(tiltB), y2 = px * Math.sin(tiltB) + y1 * Math.cos(tiltB);
        var vis = front ? z1 > 0 : (z1 <= 0 && x2 * x2 + y2 * y2 > 1);
        if (!vis) { pen = false; continue; }
        var sx = g.cx + R * x2, sy = g.cy - R * y2;
        if (pen) x.lineTo(sx, sy); else { x.moveTo(sx, sy); pen = true; }
      }
      x.strokeStyle = front ? 'rgba(120,190,255,.32)' : 'rgba(120,190,255,.12)'; x.stroke();
      x.restore();
    }
    // Arc en grand cercle, soulevé au-dessus de la surface, du siège vers chaque marqueur.
    function arcPts(a, b, n) {
      var d = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1)), out = [];
      if (d < 1e-4) return out;
      var sd = Math.sin(d), lift = 0.08 + d * 0.22;
      for (var i = 0; i <= n; i++) {
        var t = i / n, k1 = Math.sin((1 - t) * d) / sd, k2 = Math.sin(t * d) / sd, e = 1 + lift * Math.sin(Math.PI * t);
        out.push([(a[0] * k1 + b[0] * k2) * e, (a[1] * k1 + b[1] * k2) * e, (a[2] * k1 + b[2] * k2) * e]);
      }
      return out;
    }
    function visible(r) { return r[2] > 0 || r[0] * r[0] + r[1] * r[1] > 1; }
    function drawArcs(g) {
      var hv = vec(hub.lon, hub.lat);
      x.save(); x.globalCompositeOperation = 'lighter';
      markers.forEach(function (m, idx) {
        if (m.hub) return;
        var pts = arcPts(hv, m.v, 40); if (!pts.length) return;
        var sp = pts.map(function (p) { var r = rot(p); return { r: r, s: screen(r, g), v: visible(r) }; });
        x.lineWidth = Math.max(1, g.R / 300); x.strokeStyle = rgba(m.color ? hexRgb(m.color) : [120, 190, 255], 0.35);
        x.beginPath(); var pen = false;
        sp.forEach(function (p) { if (!p.v) { pen = false; return; } if (pen) x.lineTo(p.s[0], p.s[1]); else { x.moveTo(p.s[0], p.s[1]); pen = true; } });
        x.stroke();
        // Impulsion qui parcourt l'arc.
        var t = ((clock * 0.35 + idx * 0.137) % 1), j = Math.floor(t * (sp.length - 1)), p = sp[j];
        if (p && p.v) { glowDot(p.s[0], p.s[1], clamp(g.R / 90, 2, 5), [200, 235, 255], 0.9); }
      });
      x.restore();
    }
    function hexRgb(h) { var m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return [120, 190, 255]; var v = parseInt(m[1], 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; }
    function glowDot(px, py, r, c, a) {
      var gr = x.createRadialGradient(px, py, 0, px, py, r * 3);
      gr.addColorStop(0, rgba(c, a)); gr.addColorStop(0.3, rgba(c, a * 0.45)); gr.addColorStop(1, rgba(c, 0));
      x.fillStyle = gr; x.fillRect(px - r * 3, py - r * 3, r * 6, r * 6);
    }
    var drawn = [];
    function drawMarkers(g) {
      drawn = [];
      var base = clamp(g.R / 70, 3, 7);
      var list = markers.map(function (m) { var r = rot(m.v); return { m: m, r: r, s: screen(r, g) }; }).filter(function (q) { return q.r[2] > 0.02; });
      list.sort(function (a, b) { return a.r[2] - b.r[2]; });
      list.forEach(function (q) {
        var m = q.m, c = hexRgb(m.color), sz = base * (m.size || 1) * (0.6 + 0.4 * q.r[2]);
        var pulse = (clock * 0.8 + m.ph) % 1;
        x.save();
        glowDot(q.s[0], q.s[1], sz * 0.75, c, 0.35);
        x.strokeStyle = rgba(c, 0.6 * (1 - pulse)); x.lineWidth = 1.5;
        x.beginPath(); x.arc(q.s[0], q.s[1], sz * (1 + pulse * 2.6), 0, TAU); x.stroke();
        x.restore();
        x.fillStyle = '#fff'; x.beginPath(); x.arc(q.s[0], q.s[1], Math.max(1.6, sz * 0.38), 0, TAU); x.fill();
        x.strokeStyle = rgba(c, 1); x.lineWidth = 2; x.beginPath(); x.arc(q.s[0], q.s[1], sz * 0.7, 0, TAU); x.stroke();
        drawn.push({ m: m, x: q.s[0], y: q.s[1], r: Math.max(10, sz * 1.6) });
        if (o.labels && (m === hover || m.label && m.always)) label(q.s[0], q.s[1] - sz - 8, m.label || m.name);
      });
    }
    function label(px, py, text) {
      if (!text) return;
      x.font = '600 12.5px Inter,system-ui,sans-serif';
      var w = x.measureText(text).width + 18, h = 24, lx = clamp(px - w / 2, 4, W - w - 4), ly = clamp(py - h, 4, H - h - 4);
      x.fillStyle = 'rgba(8,16,32,.9)'; x.strokeStyle = 'rgba(120,180,255,.45)'; x.lineWidth = 1;
      roundRect(lx, ly, w, h, 12); x.fill(); x.stroke();
      x.fillStyle = '#eaf1fb'; x.textBaseline = 'middle'; x.fillText(text, lx + 9, ly + h / 2 + 0.5);
    }
    function roundRect(a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
    function drawPings(g, dt) {
      pings = pings.filter(function (p) {
        p.age += dt; if (p.age > p.life) return false;
        var r = rot(vec(p.lon, p.lat)); if (r[2] <= 0) return true;
        var s = screen(r, g), k = p.age / p.life, c = hexRgb(p.color);
        x.save(); x.globalCompositeOperation = 'lighter';
        for (var i = 0; i < 2; i++) {
          var kk = (k + i * 0.3) % 1;
          x.strokeStyle = rgba(c, 0.8 * (1 - kk)); x.lineWidth = 2;
          x.beginPath(); x.arc(s[0], s[1], 6 + kk * Math.max(30, g.R / 6), 0, TAU); x.stroke();
        }
        x.restore();
        if (p.text && k < 0.85) label(s[0], s[1] - 18, p.text);
        return true;
      });
    }
    // Comètes : traits lumineux qui traversent le ciel de temps en temps.
    function drawComets(dt) {
      if (Math.random() < dt * 0.25 && comets.length < 3) comets.push({ x: Math.random() * W, y: Math.random() * H * 0.45, a: (Math.random() < 0.5 ? 160 : 20) * DEG, v: 260 + Math.random() * 260, life: 1.2, age: 0 });
      comets = comets.filter(function (c) {
        c.age += dt; if (c.age > c.life) return false;
        var e = Math.sin(Math.PI * c.age / c.life), dx = Math.cos(c.a), dy = Math.sin(c.a);
        var hx = c.x + dx * c.v * c.age, hy = c.y + dy * c.v * c.age, tx = hx - dx * 120, ty = hy - dy * 120;
        var gr = x.createLinearGradient(tx, ty, hx, hy); gr.addColorStop(0, 'rgba(160,210,255,0)'); gr.addColorStop(1, rgba([200, 230, 255], 0.7 * e));
        x.strokeStyle = gr; x.lineWidth = 1.2; x.beginPath(); x.moveTo(tx, ty); x.lineTo(hx, hy); x.stroke();
        return true;
      });
    }

    // ---------------- animation
    function frame(ts) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (!canvas.isConnected) { destroy(); return; }
      if (document.hidden) { last = 0; return; }
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts;
      clock += dt;
      if (focusAnim) {
        var k = Math.min(1, (ts - focusAnim.t0) / focusAnim.d), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        lon0 = focusAnim.l0 + focusAnim.dl * e; lat0 = focusAnim.a0 + (focusAnim.a1 - focusAnim.a0) * e;
        if (focusAnim.z1) zoom = focusAnim.z0 + (focusAnim.z1 - focusAnim.z0) * e;
        if (k >= 1) focusAnim = null;
      } else if (!dragging) {
        if (Math.abs(vLon) > 0.01 || Math.abs(vLat) > 0.01) { lon0 -= vLon * dt; lat0 = clamp(lat0 + vLat * dt, -70, 80); vLon *= Math.pow(0.04, dt); vLat *= Math.pow(0.04, dt); }
        else if (ts > idleUntil && !reduced()) lon0 -= o.autoRotate * dt / Math.max(1, zoom * 0.8);
      }
      if (zoomTo != null) { zoom += (zoomTo - zoom) * Math.min(1, dt * 10); if (Math.abs(zoomTo - zoom) < 0.001) zoomTo = null; }
      lon0 = ((lon0 + 540) % 360) - 180;
      draw(dt);
    }

    // ---------------- interaction
    var down = null, pinch = null, ptrs = {};
    function onDown(e) {
      if (!o.interactive || e.button > 0) return;
      ptrs[e.pointerId] = [e.clientX, e.clientY];
      var ids = Object.keys(ptrs);
      if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: zoom }; }
      down = { x: e.clientX, y: e.clientY, lon: lon0, lat: lat0, t: performance.now(), moved: false };
      dragging = true; focusAnim = null; vLon = vLat = 0;
      try { canvas.setPointerCapture(e.pointerId); } catch (er) {}
      canvas.style.cursor = 'grabbing';
    }
    var lastMove = null;
    function onMove(e) {
      if (ptrs[e.pointerId]) ptrs[e.pointerId] = [e.clientX, e.clientY];
      if (pinch && Object.keys(ptrs).length === 2 && o.zoom) {
        var ids = Object.keys(ptrs), a = ptrs[ids[0]], b = ptrs[ids[1]];
        zoom = clamp(pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / Math.max(1, pinch.d), o.minZoom, o.maxZoom); zoomTo = null;
        return;
      }
      if (dragging && down) {
        var g = geom(), dx = e.clientX - down.x, dy = e.clientY - down.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) down.moved = true;
        var k = 180 / Math.PI / Math.max(60, g.R);
        lon0 = down.lon - dx * k; lat0 = clamp(down.lat + dy * k, -70, 80);
        var now = performance.now();
        if (lastMove) { var dtm = Math.max(1, now - lastMove.t) / 1000; vLon = (e.clientX - lastMove.x) * k / dtm; vLat = -(e.clientY - lastMove.y) * k / dtm; }
        lastMove = { x: e.clientX, y: e.clientY, t: now };
        return;
      }
      // Survol d'un marqueur.
      var r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, hit = pick(mx, my);
      if (hit !== hover) { hover = hit; canvas.style.cursor = hit ? 'pointer' : (o.interactive ? 'grab' : ''); if (o.onHover) o.onHover(hit, mx, my); }
    }
    function onUp(e) {
      delete ptrs[e.pointerId];
      if (Object.keys(ptrs).length < 2) pinch = null;
      if (!dragging) return;
      dragging = false; idleUntil = performance.now() + 2500; canvas.style.cursor = o.interactive ? 'grab' : '';
      if (lastMove && performance.now() - lastMove.t > 80) vLon = vLat = 0;
      vLon = -vLon; // la vitesse a été mesurée dans le sens du doigt
      lastMove = null;
      if (down && !down.moved && o.onPick) { var r = canvas.getBoundingClientRect(), hit = pick(e.clientX - r.left, e.clientY - r.top); if (hit) o.onPick(hit); }
      down = null;
    }
    function onWheel(e) {
      if (!o.zoom || !o.interactive) return;
      e.preventDefault();
      zoomTo = clamp((zoomTo || zoom) * Math.pow(1.0018, -e.deltaY), o.minZoom, o.maxZoom);
      idleUntil = performance.now() + 2500;
    }
    function pick(mx, my) {
      var best = null, bd = 1e9;
      drawn.forEach(function (d) { var q = Math.hypot(d.x - mx, d.y - my); if (q < d.r && q < bd) { bd = q; best = d.m; } });
      return best;
    }
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', function () { if (!dragging && hover) { hover = null; if (o.onHover) o.onHover(null); } });
    canvas.addEventListener('wheel', onWheel, { passive: false });
    if (o.interactive) { canvas.style.cursor = 'grab'; canvas.style.touchAction = 'none'; }

    var ro = window.ResizeObserver ? new ResizeObserver(size) : null;
    if (ro) ro.observe(canvas); else window.addEventListener('resize', size);
    size();
    raf = requestAnimationFrame(frame);

    function destroy() {
      alive = false; cancelAnimationFrame(raf);
      if (ro) ro.disconnect(); else window.removeEventListener('resize', size);
    }
    return {
      setMarkers: setMarkers,
      setHub: function (h) { hub = h; },
      // Centre le globe sur un lieu (et zoome si demandé), en douceur.
      focus: function (lon, lat, z) {
        var dl = ((lon - lon0 + 540) % 360) - 180;
        focusAnim = { t0: performance.now(), d: 1300, l0: lon0, dl: dl, a0: lat0, a1: clamp(lat, -60, 75), z0: zoom, z1: z ? clamp(z, o.minZoom, o.maxZoom) : 0 };
        idleUntil = performance.now() + 6000; vLon = vLat = 0;
      },
      ping: function (lon, lat, color, text) { pings.push({ lon: lon, lat: lat, color: color || '#34d399', text: text, age: 0, life: 3.2 }); },
      zoomBy: function (f) { zoomTo = clamp((zoomTo || zoom) * f, o.minZoom, o.maxZoom); idleUntil = performance.now() + 2500; },
      pause: function (ms) { idleUntil = performance.now() + (ms || 3000); },
      resize: size,
      destroy: destroy,
    };
  }

  // ------------------------------------------------------------------ annuaire des lieux (hors ligne)
  // Nom|latitude|longitude ; les noms sont comparés sans accents, tirets ni majuscules.
  var VILLES_TXT =
    'Paris|48.857|2.352;Marseille|43.296|5.370;Lyon|45.764|4.836;Toulouse|43.605|1.444;Nice|43.710|7.262;Nantes|47.218|-1.554;Montpellier|43.611|3.877;Strasbourg|48.573|7.752;' +
    'Bordeaux|44.838|-0.579;Lille|50.629|3.057;Rennes|48.117|-1.678;Reims|49.258|4.032;Toulon|43.124|5.928;Saint-Etienne|45.440|4.387;Le Havre|49.494|0.108;Grenoble|45.188|5.724;' +
    'Dijon|47.322|5.041;Angers|47.478|-0.563;Nimes|43.837|4.360;Villeurbanne|45.771|4.890;Clermont-Ferrand|45.778|3.087;Le Mans|48.006|0.199;Aix-en-Provence|43.529|5.447;' +
    'Brest|48.390|-4.486;Tours|47.394|0.685;Amiens|49.894|2.296;Limoges|45.834|1.261;Annecy|45.899|6.129;Perpignan|42.699|2.895;Boulogne-Billancourt|48.835|2.241;Metz|49.120|6.176;' +
    'Besancon|47.238|6.024;Orleans|47.903|1.909;Saint-Denis|48.936|2.357;Argenteuil|48.947|2.248;Rouen|49.443|1.100;Mulhouse|47.750|7.336;Montreuil|48.861|2.443;Caen|49.183|-0.371;' +
    'Nancy|48.692|6.184;Tourcoing|50.724|3.161;Roubaix|50.690|3.181;Nanterre|48.892|2.207;Vitry-sur-Seine|48.787|2.393;Avignon|43.949|4.806;Creteil|48.790|2.455;Poitiers|46.580|0.340;' +
    'Aubervilliers|48.914|2.382;Versailles|48.804|2.130;Courbevoie|48.897|2.256;Pau|43.295|-0.370;La Rochelle|46.160|-1.151;Calais|50.951|1.858;Cannes|43.552|7.017;Antibes|43.580|7.125;' +
    'Colmar|48.079|7.358;Ajaccio|41.919|8.738;Bastia|42.697|9.450;Beziers|43.344|3.216;Saint-Nazaire|47.273|-2.214;Quimper|47.996|-4.102;Valence|44.933|4.892;Troyes|48.297|4.074;' +
    'Chambery|45.564|5.918;Niort|46.323|-0.459;Lorient|47.748|-3.370;Vannes|47.658|-2.760;Saint-Malo|48.649|-2.026;Bayonne|43.493|-1.475;Biarritz|43.483|-1.559;Montauban|44.018|1.355;' +
    'Albi|43.929|2.148;Carcassonne|43.212|2.353;Narbonne|43.184|3.004;Sete|43.403|3.697;Arles|43.677|4.631;Frejus|43.433|6.737;Hyeres|43.120|6.130;Gap|44.559|6.079;Digne-les-Bains|44.093|6.235;' +
    'Bourges|47.081|2.399;Chateauroux|46.810|1.690;Blois|47.586|1.336;Chartres|48.446|1.489;Evreux|49.027|1.151;Beauvais|49.430|2.081;Compiegne|49.418|2.826;Saint-Quentin|49.848|3.287;' +
    'Laon|49.564|3.620;Charleville-Mezieres|49.762|4.726;Chalons-en-Champagne|48.957|4.363;Epinal|48.172|6.449;Belfort|47.640|6.863;Macon|46.307|4.828;Chalon-sur-Saone|46.780|4.854;' +
    'Nevers|46.990|3.159;Auxerre|47.798|3.567;Vichy|46.128|3.426;Moulins|46.565|3.333;Montlucon|46.340|2.603;Le Puy-en-Velay|45.043|3.885;Aurillac|44.926|2.444;Rodez|44.350|2.575;' +
    'Cahors|44.447|1.441;Agen|44.203|0.616;Perigueux|45.184|0.721;Angouleme|45.648|0.156;Brive-la-Gaillarde|45.159|1.533;Tulle|45.267|1.771;Gueret|46.171|1.871;Mont-de-Marsan|43.890|-0.500;' +
    'Tarbes|43.233|0.078;Lourdes|43.095|-0.046;Auch|43.646|0.586;Foix|42.965|1.607;Mende|44.518|3.500;Privas|44.735|4.599;Annemasse|46.193|6.234;Thonon-les-Bains|46.371|6.479;' +
    'Aix-les-Bains|45.689|5.915;Vienne|45.525|4.874;Bourg-en-Bresse|46.205|5.226;Villefranche-sur-Saone|45.990|4.718;Roanne|46.036|4.068;Laval|48.073|-0.770;Alencon|48.432|0.091;' +
    'Cherbourg|49.639|-1.616;Saint-Brieuc|48.514|-2.765;La Roche-sur-Yon|46.670|-1.426;Cholet|47.060|-0.879;Saumur|47.260|-0.077;Dunkerque|51.034|2.377;Boulogne-sur-Mer|50.726|1.614;' +
    'Arras|50.291|2.778;Lens|50.432|2.833;Douai|50.370|3.080;Valenciennes|50.357|3.523;Cambrai|50.176|3.235;Maubeuge|50.278|3.973;Thionville|49.358|6.168;Forbach|49.188|6.896;' +
    'Haguenau|48.816|7.790;Saint-Germain-en-Laye|48.898|2.094;Neuilly-sur-Seine|48.885|2.267;Issy-les-Moulineaux|48.824|2.270;Levallois-Perret|48.895|2.288;Rueil-Malmaison|48.877|2.190;' +
    'Cergy|49.036|2.076;Evry|48.629|2.441;Meaux|48.960|2.879;Melun|48.540|2.659;Massy|48.731|2.271;Vincennes|48.847|2.439;Saint-Maur-des-Fosses|48.799|2.494;Noisy-le-Grand|48.848|2.553;' +
    'Villejuif|48.792|2.364;Ivry-sur-Seine|48.813|2.385;Pantin|48.894|2.409;Bobigny|48.908|2.440;Saint-Ouen|48.912|2.334;Clichy|48.904|2.305;Colombes|48.923|2.252;Asnieres-sur-Seine|48.914|2.285;' +
    'Bron|45.738|4.913;Venissieux|45.697|4.886;Caluire-et-Cuire|45.795|4.846;Ecully|45.775|4.778;Limonest|45.837|4.772;Saint-Priest|45.696|4.944;Vaulx-en-Velin|45.778|4.920;' +
    'Decines-Charpieu|45.769|4.959;Meyzieu|45.767|5.004;Oullins|45.714|4.807;Rillieux-la-Pape|45.820|4.898;Tassin-la-Demi-Lune|45.763|4.780;Givors|45.590|4.769;Martigues|43.405|5.048;' +
    'Aubagne|43.293|5.571;La Ciotat|43.175|5.605;Salon-de-Provence|43.640|5.097;Istres|43.513|4.987;Vitrolles|43.460|5.248;Marignane|43.416|5.215;Saint-Raphael|43.425|6.768;' +
    'Draguignan|43.537|6.464;Grasse|43.658|6.923;Menton|43.775|7.497;Monaco|43.738|7.424;Villeneuve-d\'Ascq|50.623|3.145;Merignac|44.838|-0.646;Pessac|44.806|-0.631;Talence|44.808|-0.588;' +
    'Blagnac|43.636|1.390;Colomiers|43.611|1.335;Saint-Herblain|47.212|-1.649;Reze|47.189|-1.550;Cesson-Sevigne|48.121|-1.603;Echirolles|45.147|5.719;Saint-Martin-d\'Heres|45.167|5.764;' +
    'Sarcelles|48.997|2.380;Poissy|48.929|2.046;Mantes-la-Jolie|48.991|1.717;Fontainebleau|48.404|2.701;Chelles|48.881|2.590;Lons-le-Saunier|46.675|5.555;Saint-Lo|49.116|-1.091;' +
    'Chaumont|48.111|5.139;Bar-le-Duc|48.773|5.160;Vesoul|47.620|6.155;Fort-de-France|14.616|-61.059;Pointe-a-Pitre|16.241|-61.533;Cayenne|4.922|-52.313;Noumea|-22.276|166.458;' +
    'Papeete|-17.535|-149.569;Mamoudzou|-12.780|45.228;Saint-Denis de la Reunion|-20.882|55.450;Saint-Pierre|-21.339|55.478;' +
    'Bruxelles|50.850|4.352;Anvers|51.219|4.402;Liege|50.633|5.567;Namur|50.467|4.867;Charleroi|50.411|4.444;Gand|51.054|3.717;Luxembourg|49.611|6.130;Geneve|46.204|6.143;' +
    'Lausanne|46.520|6.633;Zurich|47.377|8.541;Berne|46.948|7.447;Bale|47.560|7.588;Montreal|45.502|-73.567;Quebec|46.813|-71.208;Ottawa|45.421|-75.697;Toronto|43.653|-79.383;' +
    'Vancouver|49.283|-123.121;New York|40.713|-74.006;Los Angeles|34.052|-118.244;San Francisco|37.775|-122.419;Chicago|41.878|-87.630;Miami|25.762|-80.192;Washington|38.907|-77.037;' +
    'Boston|42.360|-71.059;Mexico|19.433|-99.133;Sao Paulo|-23.550|-46.633;Rio de Janeiro|-22.907|-43.173;Buenos Aires|-34.604|-58.382;Santiago|-33.449|-70.669;Lima|-12.046|-77.043;' +
    'Bogota|4.711|-74.072;Londres|51.507|-0.128;Manchester|53.480|-2.242;Dublin|53.350|-6.260;Madrid|40.417|-3.704;Barcelone|41.385|2.173;Seville|37.389|-5.984;Lisbonne|38.722|-9.139;' +
    'Porto|41.158|-8.629;Rome|41.903|12.496;Milan|45.464|9.190;Turin|45.070|7.687;Naples|40.852|14.268;Berlin|52.520|13.405;Munich|48.135|11.582;Francfort|50.110|8.682;Hambourg|53.551|9.994;' +
    'Cologne|50.938|6.960;Amsterdam|52.368|4.904;Rotterdam|51.924|4.478;La Haye|52.070|4.300;Copenhague|55.676|12.568;Stockholm|59.329|18.069;Oslo|59.914|10.752;Helsinki|60.170|24.938;' +
    'Varsovie|52.230|21.012;Prague|50.076|14.438;Budapest|47.498|19.040;Athenes|37.984|23.728;Istanbul|41.008|28.978;Moscou|55.756|37.617;Kiev|50.450|30.523;Bucarest|44.427|26.103;' +
    'Casablanca|33.573|-7.590;Rabat|34.020|-6.842;Marrakech|31.630|-7.981;Tanger|35.759|-5.834;Fes|34.033|-5.000;Alger|36.754|3.059;Oran|35.697|-0.633;Tunis|36.806|10.181;Sfax|34.740|10.760;' +
    'Le Caire|30.044|31.236;Dakar|14.716|-17.467;Abidjan|5.360|-4.008;Bamako|12.639|-8.003;Ouagadougou|12.371|-1.520;Niamey|13.512|2.112;Lome|6.131|1.223;Cotonou|6.367|2.425;' +
    'Douala|4.051|9.768;Yaounde|3.848|11.502;Libreville|0.416|9.467;Kinshasa|-4.441|15.266;Brazzaville|-4.263|15.242;Antananarivo|-18.879|47.508;Nairobi|-1.292|36.822;Lagos|6.524|3.379;' +
    'Johannesburg|-26.204|28.047;Le Cap|-33.925|18.424;Dubai|25.205|55.271;Abou Dabi|24.454|54.377;Doha|25.285|51.531;Riyad|24.713|46.675;Beyrouth|33.894|35.502;Tel Aviv|32.085|34.781;' +
    'Bombay|19.076|72.878;New Delhi|28.614|77.209;Bangalore|12.972|77.595;Singapour|1.352|103.820;Bangkok|13.756|100.502;Ho Chi Minh-Ville|10.823|106.630;Hanoi|21.028|105.834;' +
    'Hong Kong|22.320|114.169;Shanghai|31.230|121.474;Pekin|39.904|116.407;Seoul|37.566|126.978;Tokyo|35.676|139.650;Osaka|34.694|135.502;Sydney|-33.869|151.209;Melbourne|-37.814|144.963;' +
    'Auckland|-36.848|174.763;Port-Louis|-20.166|57.502';
  var ALIAS = { caluire: 'caluire et cuire', tassin: 'tassin la demi lune', villefranche: 'villefranche sur saone', decines: 'decines charpieu', london: 'londres', brussels: 'bruxelles',
    geneva: 'geneve', barcelona: 'barcelone', lisbon: 'lisbonne', munich: 'munich', frankfurt: 'francfort', moscow: 'moscou', beijing: 'pekin', cairo: 'le caire', 'cape town': 'le cap',
    'saint denis reunion': 'saint denis de la reunion', bombay: 'bombay', mumbai: 'bombay', delhi: 'new delhi', marseilles: 'marseille', 'aix': 'aix en provence', 'st etienne': 'saint etienne',
    'clermont': 'clermont ferrand', 'boulogne': 'boulogne billancourt', 'la defense': 'courbevoie', cergy: 'cergy', 'cergy pontoise': 'cergy', 'saint martin d heres': 'saint martin d heres' };
  // Préfecture (ou grande ville) de chaque département, pour un code postal sans ville connue.
  var DEPTS = { '01': 'bourg en bresse', '02': 'laon', '03': 'moulins', '04': 'digne les bains', '05': 'gap', '06': 'nice', '07': 'privas', '08': 'charleville mezieres', '09': 'foix', '10': 'troyes',
    '11': 'carcassonne', '12': 'rodez', '13': 'marseille', '14': 'caen', '15': 'aurillac', '16': 'angouleme', '17': 'la rochelle', '18': 'bourges', '19': 'tulle', '21': 'dijon', '22': 'saint brieuc',
    '23': 'gueret', '24': 'perigueux', '25': 'besancon', '26': 'valence', '27': 'evreux', '28': 'chartres', '29': 'quimper', '30': 'nimes', '31': 'toulouse', '32': 'auch', '33': 'bordeaux',
    '34': 'montpellier', '35': 'rennes', '36': 'chateauroux', '37': 'tours', '38': 'grenoble', '39': 'lons le saunier', '40': 'mont de marsan', '41': 'blois', '42': 'saint etienne',
    '43': 'le puy en velay', '44': 'nantes', '45': 'orleans', '46': 'cahors', '47': 'agen', '48': 'mende', '49': 'angers', '50': 'saint lo', '51': 'chalons en champagne', '52': 'chaumont',
    '53': 'laval', '54': 'nancy', '55': 'bar le duc', '56': 'vannes', '57': 'metz', '58': 'nevers', '59': 'lille', '60': 'beauvais', '61': 'alencon', '62': 'arras', '63': 'clermont ferrand',
    '64': 'pau', '65': 'tarbes', '66': 'perpignan', '67': 'strasbourg', '68': 'colmar', '69': 'lyon', '70': 'vesoul', '71': 'macon', '72': 'le mans', '73': 'chambery', '74': 'annecy',
    '75': 'paris', '76': 'rouen', '77': 'melun', '78': 'versailles', '79': 'niort', '80': 'amiens', '81': 'albi', '82': 'montauban', '83': 'toulon', '84': 'avignon', '85': 'la roche sur yon',
    '86': 'poitiers', '87': 'limoges', '88': 'epinal', '89': 'auxerre', '90': 'belfort', '91': 'evry', '92': 'nanterre', '93': 'bobigny', '94': 'creteil', '95': 'cergy',
    '971': 'pointe a pitre', '972': 'fort de france', '973': 'cayenne', '974': 'saint denis de la reunion', '976': 'mamoudzou' };
  var PLACES = null;
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\bst\b/g, 'saint').replace(/\bste\b/g, 'sainte')
      .replace(/\bcedex\b.*$/, '').replace(/\b\d+\s*(e|er|eme)?\b/g, ' ').replace(/[^a-z]+/g, ' ').trim();
  }
  function places() {
    if (PLACES) return PLACES;
    PLACES = {};
    VILLES_TXT.split(';').forEach(function (e) { var p = e.split('|'); PLACES[norm(p[0])] = { name: p[0], lat: +p[1], lon: +p[2] }; });
    return PLACES;
  }
  // Libellé propre (accents) : on garde le texte saisi par l'utilisateur quand il est reconnu.
  function locate(ville, adresse, cache) {
    var P = places(), n = norm(ville);
    if (n) {
      if (P[n]) return P[n];
      if (ALIAS[n] && P[ALIAS[n]]) return P[ALIAS[n]];
      if (cache && cache[n]) return cache[n];
      // « Lyon 3e », « Paris La Défense », « Marseille Sud » : premier mot(s) reconnu(s).
      var words = n.split(' ');
      for (var k = words.length - 1; k > 0; k--) { var pre = words.slice(0, k).join(' '); if (P[pre]) return P[pre]; if (ALIAS[pre] && P[ALIAS[pre]]) return P[ALIAS[pre]]; }
    }
    var cp = /\b(97[1-6]|\d{2})\d{3}\b/.exec(String(adresse || '') + ' ' + String(ville || ''));
    if (cp) {
      var d = cp[1].length === 3 ? cp[1] : cp[0].slice(0, 2);
      if (cp[0].slice(0, 2) === '20') d = +cp[0].slice(0, 3) < 202 ? 'aj' : 'ba';
      var name = d === 'aj' ? 'ajaccio' : d === 'ba' ? 'bastia' : DEPTS[d];
      if (name && P[name]) return Object.assign({ approx: true }, P[name]);
    }
    return null;
  }
  // Repli en ligne (OpenStreetMap / Nominatim), une demande par seconde au plus, résultat mis en cache.
  function geocodeOnline(query) {
    var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=fr&q=' + encodeURIComponent(query);
    return fetch(url, { headers: { Accept: 'application/json' } }).then(function (r) { return r.ok ? r.json() : []; })
      .then(function (a) { return a && a[0] ? { name: query, lat: +a[0].lat, lon: +a[0].lon } : null; });
  }

  window.bsGlobe = { create: create, locate: locate, norm: norm, geocodeOnline: geocodeOnline };
})();
