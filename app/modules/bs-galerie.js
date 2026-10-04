
/* Blackstart CRM : galerie d'ambiances générées (créations originales dessinées dans le navigateur).
 *
 * Chaque scène se dessine en coordonnées logiques 2560 × 1440, quelle que soit la taille réelle du canevas
 * (image pleine, ou miniature dessinée après un changement d'échelle). Le hasard vient uniquement de r() :
 * une même graine donne la même image, en grand comme en miniature.
 * Brumes, flous et halos sont calculés sur de petits calques hors écran puis agrandis : c'est rapide, même sans
 * carte graphique, et cela évite ctx.filter (lent, et absent de Safari).
 */
(function () {
  'use strict';
  var TAU = Math.PI * 2, DEG = Math.PI / 180;

  // ------------------------------------------------------------------ outils communs
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function mix(a, b, t) { return a + (b - a) * t; }
  function smooth(e0, e1, v) { var t = clamp01((v - e0) / (e1 - e0)); return t * t * (3 - 2 * t); }
  function lerpC(a, b, t) { return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]; }
  function rgba(c, a) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + (a == null ? 1 : Math.max(0, Math.min(1, a)).toFixed(4)) + ')'; }
  function vgrad(x, y0, y1, stops) { var g = x.createLinearGradient(0, y0, 0, y1); stops.forEach(function (s) { g.addColorStop(s[0], s[1]); }); return g; }
  function fill(x, style, w, h) { x.fillStyle = style; x.fillRect(0, 0, w, h); }
  // Petit générateur rapide, amorcé par r() (pour les tirages en masse : grain, textures).
  function prng(r) {
    var s = (r() * 4294967296) >>> 0;
    return function () { s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  // Profils de halo : BLOOM = point lumineux (pic serré, longue traîne), SOFT = lueur large et douce.
  var BLOOM = [[0, 1], [0.05, 0.62], [0.13, 0.32], [0.28, 0.13], [0.5, 0.045], [0.75, 0.012], [1, 0]];
  var SOFT = [[0, 1], [0.2, 0.82], [0.4, 0.5], [0.6, 0.22], [0.8, 0.06], [1, 0]];
  var BOKEH = [[0, 0.55], [0.7, 0.62], [0.88, 0.85], [0.95, 0.5], [1, 0]];
  function glow(x, cx, cy, rad, c, a, prof) {
    if (!(rad > 0.5) || !(a > 0.002)) return;
    var g = x.createRadialGradient(cx, cy, 0, cx, cy, rad), p = prof || BLOOM;
    for (var i = 0; i < p.length; i++) g.addColorStop(p[i][0], rgba(c, a * p[i][1]));
    x.fillStyle = g; x.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
  }
  function dot(x, cx, cy, rad, style) { x.fillStyle = style; x.beginPath(); x.arc(cx, cy, rad, 0, TAU); x.fill(); }

  // Calque hors écran en coordonnées logiques (taille réelle = logique / K, indépendante de la taille finale).
  function layer(w, h, K) {
    var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w / K)); c.height = Math.max(1, Math.round(h / K));
    var o = c.getContext('2d'); o.scale(c.width / w, c.height / h);
    return { c: c, o: o };
  }
  function blit(x, L, w, h, mode, alpha) {
    x.save(); x.globalCompositeOperation = mode || 'source-over'; x.globalAlpha = alpha == null ? 1 : alpha;
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.drawImage(L.c || L, 0, 0, w, h); x.restore();
  }
  // Flou d'un petit calque : moyennes de copies décalées, horizontalement puis verticalement.
  function soften(L, passes) {
    var c = L.c, W = c.width, H = c.height, t = document.createElement('canvas'); t.width = W; t.height = H;
    var tc = t.getContext('2d'), o = L.o;
    o.save(); o.setTransform(1, 0, 0, 1, 0, 0);
    for (var p = 0; p < passes; p++) {
      var d = 1 + p;
      tc.globalCompositeOperation = 'copy'; tc.globalAlpha = 1 / 3; tc.drawImage(c, -d, 0);
      tc.globalCompositeOperation = 'lighter'; tc.drawImage(c, 0, 0); tc.drawImage(c, d, 0);
      o.globalCompositeOperation = 'copy'; o.globalAlpha = 1 / 3; o.drawImage(t, 0, -d);
      o.globalCompositeOperation = 'lighter'; o.drawImage(t, 0, 0); o.drawImage(t, 0, d);
    }
    o.restore();
  }
  // Image calculée pixel par pixel sur un petit canevas (fn remplit le tableau RGBA).
  function field(W, H, fn) {
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var o = c.getContext('2d'), im = o.createImageData(W, H);
    fn(im.data, W, H); o.putImageData(im, 0, 0);
    return c;
  }
  // Bruit de gradient 2D (type Perlin) amorcé par r(), et sa version fractale (fbm) avec rotation entre octaves.
  function makeNoise(r) {
    var p = new Uint8Array(512), gx = new Float32Array(16), gy = new Float32Array(16), i, j, t;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = p[i]; p[i] = p[j]; p[j] = t; }
    for (i = 0; i < 256; i++) p[i + 256] = p[i];
    for (i = 0; i < 16; i++) { gx[i] = Math.cos(i * TAU / 16 + 0.2); gy[i] = Math.sin(i * TAU / 16 + 0.2); }
    return function (x, y) {
      var X = Math.floor(x), Y = Math.floor(y); x -= X; y -= Y; X &= 255; Y &= 255;
      var u = x * x * x * (x * (x * 6 - 15) + 10), v = y * y * y * (y * (y * 6 - 15) + 10);
      var a = p[X] + Y, b = p[X + 1] + Y, g;
      g = p[a] & 15; var n00 = gx[g] * x + gy[g] * y;
      g = p[b] & 15; var n10 = gx[g] * (x - 1) + gy[g] * y;
      g = p[a + 1] & 15; var n01 = gx[g] * x + gy[g] * (y - 1);
      g = p[b + 1] & 15; var n11 = gx[g] * (x - 1) + gy[g] * (y - 1);
      var a0 = n00 + u * (n10 - n00), a1 = n01 + u * (n11 - n01);
      return (a0 + v * (a1 - a0)) * 1.42;
    };
  }
  function fbm(n, x, y, oct) {
    var s = 0, a = 0.5, t;
    for (var i = 0; i < oct; i++) { s += a * n(x, y); t = x; x = 1.6 * x + 1.2 * y + 17.3; y = -1.2 * t + 1.6 * y + 9.1; a *= 0.5; }
    return s;
  }
  // Ligne de crête par déplacement du point milieu (n + 1 valeurs).
  function crest(r, steps, amp, rough) {
    var n = 1 << steps, pts = new Float32Array(n + 1);
    pts[0] = (r() - 0.5) * amp; pts[n] = (r() - 0.5) * amp;
    for (var size = n, a = amp; size > 1; size >>= 1, a *= rough)
      for (var i = size >> 1; i < n; i += size) pts[i] = (pts[i - (size >> 1)] + pts[i + (size >> 1)]) / 2 + (r() - 0.5) * a;
    return pts;
  }
  // Bruit « en crêtes » (montagnes aux arêtes vives).
  function ridged(n, x, y, oct) {
    var s = 0, a = 0.5, wg = 1, t;
    for (var i = 0; i < oct; i++) {
      var v = 1 - Math.abs(n(x, y)); v *= v; v *= wg; wg = clamp01(v * 2); s += v * a;
      t = x; x = 1.6 * x + 1.2 * y + 17.3; y = -1.2 * t + 1.6 * y + 9.1; a *= 0.5;
    }
    return s;
  }
  // Relief en perspective (« voxel space ») : chaque colonne est parcourue du proche au lointain et seules les
  // tranches visibles sont peintes. Renvoie un canevas W × H transparent hors du relief (le ciel se dessine dessous).
  // o : hz (horizon, px du calque), f (focale, px), camH, camX, bands [[z, pas], ...] (distances et nombre de pas
  // par tronçon), height(x, z), shade(x, z, h, pente x, pente z, couleur). Les pentes sont mesurées à pas fixe,
  // sauf si o.grad est vrai (la scène calcule alors ses pentes elle-même).
  function relief(W, H, o) {
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var ctx = c.getContext('2d'), im = ctx.createImageData(W, H), d = im.data, zl = [], b, s, i, y, k;
    for (b = 0; b + 1 < o.bands.length; b++) {
      var za = o.bands[b][0], zb = o.bands[b + 1][0], nb = o.bands[b][1];
      for (s = 0; s < nb; s++) zl.push(za * Math.pow(zb / za, s / nb));
    }
    zl.push(o.bands[o.bands.length - 1][0]);
    var S = zl.length, col = [0, 0, 0, 255], pc = [0, 0, 0, 0];
    for (i = 0; i < W; i++) {
      var dx = (i + 0.5 - W / 2) / o.f, yb = H, was = false;
      for (s = 0; s < S && yb > 0; s++) {
        var z = zl[s], wx = o.camX + dx * z, hh = o.height(wx, z), sy = o.hz - (hh - o.camH) * o.f / z;
        if (!s) { yb = Math.min(H, Math.ceil(sy)); continue; } // rien n'est peint devant la première distance
        if (sy < yb) {
          var e = Math.max(4, z / o.f * 1.5), gx = o.grad ? 0 : (o.height(wx + e, z) - hh) / e, gz = o.grad ? 0 : (o.height(wx, z + e) - hh) / e;
          col[3] = 255; o.shade(wx, z, hh, gx, gz, col);
          var top = sy < 0 ? 0 : Math.floor(sy), span = yb - top;
          // Pente continue : dégradé depuis la tranche précédente (pas de marches d'escalier).
          if (was && span > 1) for (y = top; y < yb; y++) {
            var t = (y - top) / span; k = (y * W + i) * 4;
            d[k] = col[0] + (pc[0] - col[0]) * t; d[k + 1] = col[1] + (pc[1] - col[1]) * t; d[k + 2] = col[2] + (pc[2] - col[2]) * t; d[k + 3] = col[3] + (pc[3] - col[3]) * t;
          } else for (y = top; y < yb; y++) { k = (y * W + i) * 4; d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = col[3]; }
          pc[0] = col[0]; pc[1] = col[1]; pc[2] = col[2]; pc[3] = col[3]; was = true;
          yb = top;
        } else {
          // Passage derrière une crête : on affine entre les deux pas pour ne pas rater le sommet (crêtes en dents de scie).
          if (was) for (var q = 1; q < 4; q++) {
            var zq = zl[s - 1] + (z - zl[s - 1]) * q / 4, syq = o.hz - (o.height(o.camX + dx * zq, zq) - o.camH) * o.f / zq;
            if (syq < yb) { var tq = syq < 0 ? 0 : Math.floor(syq); for (y = tq; y < yb; y++) { k = (y * W + i) * 4; d[k] = pc[0]; d[k + 1] = pc[1]; d[k + 2] = pc[2]; d[k + 3] = pc[3]; } yb = tq; }
          }
          was = false;
        }
      }
    }
    ctx.putImageData(im, 0, 0);
    return c;
  }
  // Grain photo très léger (casse les dégradés en escalier) et vignettage.
  function grain(x, w, h, r, a) {
    var N = 256, q = prng(r);
    var c = field(N, N, function (d) { for (var i = 0; i < d.length; i += 4) { var v = 128 + (q() + q() - 1) * 100; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } });
    x.save(); x.globalCompositeOperation = 'overlay'; x.globalAlpha = a; x.fillStyle = x.createPattern(c, 'repeat'); x.fillRect(0, 0, w, h); x.restore();
  }
  function vignette(x, w, h, a, c) {
    x.save(); x.translate(w / 2, h / 2); x.scale(1, h / w);
    var g = x.createRadialGradient(0, 0, w * 0.28, 0, 0, w * 0.75);
    g.addColorStop(0, rgba(c || [0, 0, 0], 0)); g.addColorStop(0.6, rgba(c || [0, 0, 0], a * 0.55)); g.addColorStop(1, rgba(c || [0, 0, 0], a));
    x.fillStyle = g; x.fillRect(-w / 2, -w / 2, w, w); x.restore();
  }
  // Étoiles fines (rectangles : rapides) et quelques étoiles brillantes avec halo.
  function starfield(x, w, y0, y1, n, r, bright, density) {
    for (var i = 0; i < n; i++) {
      var sx = r() * w, sy = y0 + r() * (y1 - y0), m = r(), tint = r();
      if (density && r() > density(sx, sy)) continue;
      var c = tint < 0.18 ? [190, 210, 255] : tint < 0.26 ? [255, 222, 190] : [255, 255, 255];
      var s = 0.8 + m * m * 2.2;
      x.fillStyle = rgba(c, 0.25 + 0.75 * m); x.fillRect(sx, sy, s, s);
    }
    for (i = 0; i < (bright || 0); i++) {
      var bx = r() * w, by = y0 + r() * (y1 - y0), bs = 1.6 + r() * 2.4, bc = r() < 0.3 ? [180, 205, 255] : [255, 246, 230];
      x.save(); x.globalCompositeOperation = 'lighter'; glow(x, bx, by, bs * 9, bc, 0.5); x.restore();
      dot(x, bx, by, bs, rgba(bc, 1));
    }
  }
  // Aigrettes de diffraction (étoile brillante « télescope »).
  function spikes(x, sx, sy, len, c, a, n, rot) {
    x.save(); x.globalCompositeOperation = 'lighter'; x.lineCap = 'round';
    for (var i = 0; i < n; i++) {
      var an = rot + i * Math.PI / n * 2, ex = Math.cos(an) * len, ey = Math.sin(an) * len;
      var g = x.createLinearGradient(sx, sy, sx + ex, sy + ey);
      g.addColorStop(0, rgba(c, a)); g.addColorStop(0.25, rgba(c, a * 0.35)); g.addColorStop(1, rgba(c, 0));
      x.strokeStyle = g; x.lineWidth = Math.max(1.2, len * 0.012);
      x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + ex, sy + ey); x.stroke();
    }
    x.restore();
  }

  // ================================================================== IA
  // ---- scène: reseau-neuronal
  // Réseau neuronal en perspective : couches (panneaux de verre), neurones, connexions, impulsions,
  // profondeur de champ (flou devant et derrière le plan net).
  function reseauNeuronal(x, w, h, r) {
    fill(x, '#02040c', w, h);
    x.globalCompositeOperation = 'lighter';
    glow(x, w * 0.5, h * 0.5, w * 0.75, [14, 38, 100], 0.85, SOFT);
    glow(x, w * 0.88, h * 0.16, w * 0.45, [80, 26, 136], 0.45, SOFT);
    glow(x, w * 0.06, h * 0.94, w * 0.42, [0, 80, 112], 0.3, SOFT);
    x.globalCompositeOperation = 'source-over';

    var NL = 6, sp = 470, th = 0.9, ct = Math.cos(th), st = Math.sin(th), Z0 = 1900, f = 1480, cx = w * 0.47, cy = h * 0.5;
    function P(X, Y, Z) { var xr = X * ct - Z * st, zr = X * st + Z * ct + Z0; return [cx + f * xr / zr, cy - f * Y / zr, zr, f / zr]; }
    var C0 = [60, 210, 255], C1 = [86, 128, 255], C2 = [180, 104, 255];
    function col(li) { var t = li / (NL - 1); return t < 0.5 ? lerpC(C0, C1, t * 2) : lerpC(C1, C2, t * 2 - 1); }
    var layers = [], nodes = [], edges = [], panels = [], li, k;
    for (li = 0; li < NL; li++) {
      var X = (li - (NL - 1) / 2) * sp, ny = 5 + Math.floor(r() * 3), nz = 4 + Math.floor(r() * 3);
      var Ry = 420 * (0.75 + 0.25 * Math.sin(Math.PI * (li + 0.5) / NL)), Rz = Ry * 0.95, arr = [];
      panels.push({ li: li, c: [P(X, Ry * 1.18, -Rz * 1.22), P(X, Ry * 1.18, Rz * 1.22), P(X, -Ry * 1.18, Rz * 1.22), P(X, -Ry * 1.18, -Rz * 1.22)], z: P(X, 0, 0)[2] });
      for (var iy = 0; iy < ny; iy++) for (var iz = 0; iz < nz; iz++) {
        if (r() < 0.12) continue;
        var Y = ((iy + 0.5) / ny * 2 - 1) * Ry + (r() - 0.5) * Ry * 0.18, Z = ((iz + 0.5) / nz * 2 - 1) * Rz + (r() - 0.5) * Rz * 0.18, p = P(X, Y, Z);
        var n = { li: li, Y: Y, Z: Z, x: p[0], y: p[1], z: p[2], s: p[3], on: false, e: [] };
        arr.push(n); nodes.push(n);
      }
      layers.push(arr);
    }
    for (li = 0; li < NL - 1; li++) layers[li].forEach(function (a) {
      function d2(q) { return (q.Y - a.Y) * (q.Y - a.Y) + (q.Z - a.Z) * (q.Z - a.Z); }
      var nx = layers[li + 1].slice().sort(function (p, q) { return d2(p) - d2(q); });
      var m = 3 + Math.floor(r() * 2);
      for (var k2 = 0; k2 < m && k2 < nx.length; k2++) { var e = { a: a, b: nx[k2], on: false }; edges.push(e); a.e.push(e); }
      if (r() < 0.5) { var e2 = { a: a, b: nx[Math.floor(r() * nx.length)], on: false }; edges.push(e2); a.e.push(e2); }
    });
    for (k = 0; k < 4; k++) {
      var nn = layers[0][Math.floor(r() * layers[0].length)]; nn.on = true;
      while (nn.e.length) { var ee = nn.e[Math.floor(r() * nn.e.length)]; ee.on = true; ee.t = 0.25 + r() * 0.55; nn = ee.b; nn.on = true; }
    }
    var zF = Z0 - sp * 1.5 * st + 120, nearZ = zF - 330, farZ = zF + 520;
    var Fa = layer(w, h, 3.2), Ne = layer(w, h, 7);
    [x, Fa.o, Ne.o].forEach(function (o) { o.globalCompositeOperation = 'lighter'; o.lineCap = 'round'; o.lineJoin = 'round'; });
    function ctxFor(z) { return z < nearZ ? Ne.o : z > farZ ? Fa.o : x; }
    function fog(z) { return Math.min(1, Math.exp(-(z - 1300) / 2600)); }

    // Source lumineuse derrière les dernières couches
    var src = P((NL - 1) / 2 * sp + 500, 0, 0);
    glow(x, src[0], src[1], w * 0.42, [60, 50, 200], 0.38, SOFT); glow(x, src[0], src[1], w * 0.12, [160, 130, 255], 0.3, SOFT); glow(x, src[0], src[1], w * 0.035, [220, 210, 255], 0.5, SOFT);
    // Panneaux de verre des couches
    panels.forEach(function (pn) {
      var o = ctxFor(pn.z), c = col(pn.li), q = pn.c, fg = fog(pn.z);
      var g = o.createLinearGradient(q[0][0], q[0][1], q[2][0], q[2][1]);
      g.addColorStop(0, rgba(c, 0.07 * fg)); g.addColorStop(0.5, rgba(c, 0.02 * fg)); g.addColorStop(1, rgba(c, 0.05 * fg));
      o.fillStyle = g; o.beginPath(); o.moveTo(q[0][0], q[0][1]); for (var i = 1; i < 4; i++) o.lineTo(q[i][0], q[i][1]); o.closePath(); o.fill();
      o.strokeStyle = rgba(c, 0.22 * fg); o.lineWidth = 1.6 * q[0][3]; o.stroke();
      for (i = 0; i < 4; i++) glow(o, q[i][0], q[i][1], 26 * q[i][3], c, 0.35 * fg);
    });
    // Poussière en suspension
    for (k = 0; k < 1100; k++) {
      var qd = P((r() - 0.45) * 4200, (r() - 0.5) * 2200, (r() - 0.5) * 2400);
      if (qd[2] < 250) continue;
      var od = ctxFor(qd[2]), al = (0.1 + r() * 0.3) * fog(qd[2]);
      if (od === Ne.o) glow(od, qd[0], qd[1], 24 * qd[3], [120, 170, 255], al * 0.45, BOKEH);
      else { od.fillStyle = rgba([150, 190, 255], al); od.fillRect(qd[0], qd[1], 2.4 * qd[3], 2.4 * qd[3]); }
    }
    edges.forEach(function (e) { e.z = (e.a.z + e.b.z) / 2; });
    edges.sort(function (p, q2) { return q2.z - p.z; });
    edges.forEach(function (e) {
      var o = ctxFor(e.z), s = f / e.z, fg = fog(e.z), ca = col(e.a.li), cb = col(e.b.li);
      var g = o.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y), al = e.on ? 0.8 : 0.16 * fg;
      g.addColorStop(0, rgba(e.on ? lerpC(ca, [255, 255, 255], 0.45) : ca, al)); g.addColorStop(1, rgba(e.on ? lerpC(cb, [255, 255, 255], 0.45) : cb, al));
      o.strokeStyle = g; o.lineWidth = (o === Ne.o ? 2.8 : e.on ? 2.3 : 1.1) * s;
      o.beginPath(); o.moveTo(e.a.x, e.a.y); o.lineTo(e.b.x, e.b.y); o.stroke();
      if (e.on) {
        o.lineWidth = 12 * s; o.strokeStyle = rgba(ca, 0.07); o.stroke();
        var px = mix(e.a.x, e.b.x, e.t), py = mix(e.a.y, e.b.y, e.t), tx = mix(e.a.x, e.b.x, e.t - 0.25), ty = mix(e.a.y, e.b.y, e.t - 0.25);
        var tg = o.createLinearGradient(tx, ty, px, py);
        tg.addColorStop(0, 'rgba(255,255,255,0)'); tg.addColorStop(1, 'rgba(255,248,230,1)');
        o.strokeStyle = tg; o.lineWidth = 3.6 * s; o.beginPath(); o.moveTo(tx, ty); o.lineTo(px, py); o.stroke();
        glow(o, px, py, 70 * s, [255, 222, 160], 0.75);
        dot(o, px, py, 3.4 * s, '#fffaf0');
      }
    });
    nodes.sort(function (p, q2) { return q2.z - p.z; });
    nodes.forEach(function (n) {
      var o = ctxFor(n.z), s = n.s, fg = fog(n.z), c = n.on ? [255, 226, 176] : col(n.li);
      if (o === Ne.o) { glow(o, n.x, n.y, (11 + (nearZ - n.z) * 0.08) * s, lerpC(c, [255, 255, 255], 0.3), 0.6, BOKEH); return; }
      glow(o, n.x, n.y, (n.on ? 120 : 56) * s, c, (n.on ? 0.7 : 0.5) * fg);
      dot(o, n.x, n.y, (n.on ? 5.6 : 4) * s, rgba(lerpC(c, [255, 255, 255], 0.7), fg));
      if (n.on) { o.strokeStyle = rgba(c, 0.5 * fg); o.lineWidth = 1.5 * s; o.beginPath(); o.arc(n.x, n.y, 14 * s, 0, TAU); o.stroke(); }
    });
    x.globalCompositeOperation = 'source-over';
    soften(Fa, 1); soften(Ne, 2);
    blit(x, Fa, w, h, 'lighter'); blit(x, Ne, w, h, 'lighter');
    vignette(x, w, h, 0.6);
    grain(x, w, h, r, 0.05);
  }
  // ---- scène: flux-donnees
  // Flux de données : rubans de fils lumineux torsadés en 3D, points de données, profondeur de champ.
  function fluxDonnees(x, w, h, r) {
    fill(x, '#02030b', w, h);
    x.globalCompositeOperation = 'lighter';
    glow(x, w * 0.52, h * 0.52, w * 0.65, [26, 30, 104], 0.75, SOFT);
    glow(x, w * 0.2, h * 0.45, w * 0.42, [0, 66, 118], 0.4, SOFT);
    glow(x, w * 0.88, h * 0.58, w * 0.38, [110, 26, 110], 0.3, SOFT);
    x.globalCompositeOperation = 'source-over';
    var Bl = layer(w, h, 6), Far = layer(w, h, 3.5), Near = layer(w, h, 7);
    [x, Bl.o, Far.o, Near.o].forEach(function (o) { o.globalCompositeOperation = 'lighter'; o.lineJoin = 'round'; });
    // Un ruban = M fils répartis sur une bande qui se tord le long de l'axe horizontal.
    function ribbon(o, glowO, c0, amp, wid, M, pal, lw, aMul, dots) {
      var A1 = h * amp, f1 = (0.6 + r() * 0.5) * TAU / w, p1 = r() * TAU, A2 = h * amp * 0.3, f2 = (1.8 + r() * 1.4) * TAU / w, p2 = r() * TAU;
      var W0 = h * wid, fw = (0.5 + r() * 0.7) * TAU / w, pw = r() * TAU, t0 = r() * TAU, t1 = (0.8 + r() * 0.9) * TAU / w;
      var lg = o.createLinearGradient(0, 0, w, 0); lg.addColorStop(0, rgba(pal[0], 1)); lg.addColorStop(0.55, rgba(pal[1], 1)); lg.addColorStop(1, rgba(pal[2], 1));
      for (var i = 0; i < M; i++) {
        var sI = i / (M - 1) * 2 - 1, pts = [];
        for (var X = -60; X <= w + 60; X += 12) {
          var thv = t0 + t1 * X + 0.6 * Math.sin(X * fw * 1.7 + pw), Wd = W0 * (0.5 + 0.5 * Math.sin(X * fw + pw));
          pts.push(X, c0 + A1 * Math.sin(X * f1 + p1) + A2 * Math.sin(X * f2 + p2) + Wd * sI * Math.cos(thv), sI * Math.sin(thv));
        }
        for (var j = 0; j + 3 < pts.length; j += 24) {
          var al = (0.08 + 0.17 * (pts[j + 2] + 1) / 2) * aMul;
          for (var oi = 0; oi < (glowO ? 2 : 1); oi++) {
            var oo = oi ? glowO : o;
            oo.globalAlpha = oi ? al * 1.3 : al; oo.strokeStyle = lg; oo.lineWidth = oi ? 6 : lw;
            oo.beginPath(); oo.moveTo(pts[j], pts[j + 1]);
            for (var m = j + 3; m < pts.length && m <= j + 24; m += 3) oo.lineTo(pts[m], pts[m + 1]);
            oo.stroke();
          }
        }
        o.globalAlpha = 1; if (glowO) glowO.globalAlpha = 1;
        if (dots && i % 2 === 0) for (var dk = 0; dk < 9; dk++) {
          j = 3 * Math.floor(r() * pts.length / 3);
          var zz = (pts[j + 2] + 1) / 2, cc = pts[j] < w * 0.55 ? lerpC(pal[0], pal[1], clamp01(pts[j] / (w * 0.55))) : lerpC(pal[1], pal[2], clamp01((pts[j] - w * 0.55) / (w * 0.45)));
          o.fillStyle = rgba(lerpC(cc, [255, 255, 255], 0.5), (0.3 + 0.7 * zz) * aMul);
          o.fillRect(pts[j] - 1.8, pts[j + 1] - 1.8, 3.6, 3.6);
          if (zz > 0.8 && r() < 0.3) glow(o, pts[j], pts[j + 1], 22, cc, 0.5 * aMul);
        }
      }
    }
    var PAL1 = [[30, 220, 255], [60, 140, 255], [120, 110, 255]], PAL2 = [[80, 120, 255], [150, 100, 255], [240, 110, 200]], PAL3 = [[110, 90, 255], [170, 90, 240], [90, 160, 255]];
    ribbon(Far.o, null, h * (0.36 + r() * 0.06), 0.09, 0.07, 46, PAL3, 1.6, 0.8, false);
    ribbon(x, Bl.o, h * (0.5 + r() * 0.04), 0.12, 0.085, 72, PAL1, 1.25, 1, true);
    ribbon(x, Bl.o, h * (0.56 + r() * 0.05), 0.1, 0.06, 56, PAL2, 1.2, 0.9, true);
    ribbon(Near.o, null, h * (0.84 + r() * 0.05), 0.07, 0.11, 40, PAL1, 4, 0.6, false);
    // Bokeh discret et poussières
    for (var k = 0; k < 40; k++) {
      var by = r() < 0.5 ? h * (0.05 + r() * 0.25) : h * (0.72 + r() * 0.26);
      glow(Near.o, r() * w, by, 20 + Math.pow(r(), 2) * 80, [PAL1, PAL2][k % 2][Math.floor(r() * 3)], 0.06 + r() * 0.1, BOKEH);
    }
    for (k = 0; k < 600; k++) { var sx = r() * w, sy = h * (0.15 + r() * 0.7), ss = 0.8 + r() * 1.6; x.fillStyle = rgba([200, 220, 255], 0.15 + r() * 0.5); x.fillRect(sx, sy, ss, ss); }
    soften(Bl, 2); soften(Far, 1); soften(Near, 2);
    blit(x, Far, w, h, 'lighter'); blit(x, Bl, w, h, 'lighter', 0.75); blit(x, Near, w, h, 'lighter');
    x.globalCompositeOperation = 'source-over';
    vignette(x, w, h, 0.65);
    grain(x, w, h, r, 0.05);
  }
  // ---- scène: globe-donnees
  // Globe de données : continents en points, villes, arcs lumineux, atmosphère et soleil rasant.
  // Contours simplifiés des terres [lon, lat, lon, lat, ...] (précision de quelques degrés).
  var TERRES = [
    // Amérique du Nord
    [-165, 62, -166, 68, -156, 71.3, -141, 69.6, -128, 70, -117, 68.8, -108, 68, -95, 68, -89, 69, -82, 67, -85, 62, -93, 58.7, -90, 57, -82, 55, -79, 51.5, -79, 55, -77, 60, -71, 61, -64, 59.5, -61, 56, -56, 52, -60, 47.5, -65, 45, -70, 43, -70, 41.5, -74, 40.5, -76, 38, -76, 35, -81, 31.5, -80, 27, -80.5, 25.2, -82, 27, -83, 30, -89, 30, -94, 29.5, -97, 26, -97.5, 22, -95, 19, -91, 18.5, -90, 21.5, -87, 21.5, -88, 16, -84, 15.5, -83.5, 11, -81.5, 9, -79, 9.5, -77.5, 8, -80, 7.3, -82, 8.2, -86, 11, -88, 13.3, -91.5, 14, -94, 16, -97, 15.8, -102, 18, -105.5, 20, -105.5, 22.5, -108, 25.5, -112, 29, -114.5, 31.5, -114, 30, -112, 27, -110, 24, -112, 24.5, -114, 27.5, -115, 29.5, -117, 32.5, -118.5, 34, -120.5, 34.5, -122.5, 37.5, -124, 40.5, -124, 46, -124.5, 48.5, -123, 49, -127.5, 50.5, -130.5, 54, -133, 57, -137, 58.5, -140, 59.8, -145, 60.3, -150, 59.5, -152, 58, -157, 57, -162, 55, -164, 54.6, -158, 58, -162, 58.5, -162, 60, -165, 62],
    // Archipel arctique, Groenland, Islande
    [-80, 73, -72, 71, -62, 66.5, -65, 63, -72, 63, -78, 64.5, -75, 68, -85, 70, -90, 72, -80, 73],
    [-120, 72, -105, 73, -95, 75, -85, 77, -70, 80, -62, 82.5, -90, 82, -110, 78, -122, 75, -120, 72],
    [-73, 78, -60, 82, -35, 83.5, -20, 82, -18, 76, -22, 70, -32, 68, -40, 65, -43, 60, -48, 61, -52, 65, -54, 69, -58, 75, -66, 76, -73, 78],
    [-22.5, 63.9, -24.3, 65.5, -22.4, 66.4, -18.5, 66.2, -14.8, 66.3, -13.6, 65.1, -15, 64.3, -18.7, 63.4, -22.5, 63.9],
    // Caraïbes
    [-84.9, 21.9, -82.6, 22.7, -80.3, 23.1, -77.5, 21.8, -75.6, 21, -74.2, 20.2, -77.6, 19.9, -78.5, 21.4, -81.6, 22.3, -84, 21.8, -84.9, 21.9],
    [-74.5, 18.4, -72.8, 19.9, -70, 19.7, -68.4, 18.6, -70, 18.2, -71.7, 17.8, -74.5, 18.4],
    // Amérique du Sud
    [-80, 9, -77, 8.5, -75.5, 10.8, -72, 12, -71.5, 10, -68, 10.8, -63, 10.7, -61, 10, -57, 6, -52, 5, -50, 1.5, -48.5, -1, -44.5, -2.5, -39, -3.5, -35, -5.5, -35, -9, -37.5, -12.5, -39, -17.5, -40.5, -21.5, -42, -23, -46, -24, -48.5, -26.5, -48.6, -28.5, -51, -31, -53.5, -34, -58, -34.5, -57, -36.5, -57.5, -38.2, -62, -39, -62.5, -41, -65, -42, -64.5, -45, -67.5, -46.5, -66, -48, -69, -51, -68.5, -52.5, -71, -54, -74, -52, -75.5, -48, -74, -44, -73.5, -40, -73.5, -37, -71.5, -32, -71.5, -28, -70.5, -23, -70, -18.5, -75, -15.5, -76.5, -13, -79.5, -8, -81, -5.5, -80.3, -3.5, -80, -1, -80, 1, -78.8, 1.8, -77.5, 4, -77.4, 6.8, -78, 7.5, -80, 9],
    // Afrique, Madagascar
    [-5.8, 35.8, -2, 35.1, 1, 36.5, 5, 36.8, 8.5, 37, 10.2, 37.2, 11, 36.9, 10.5, 35.8, 10.1, 34.3, 11.2, 33.2, 13, 32.8, 15.3, 32.2, 16.2, 31.2, 18.5, 30.4, 20, 30.9, 20, 32.2, 21.6, 32.9, 23.5, 32.4, 25.2, 31.6, 29, 30.9, 31, 31.5, 32.3, 31.3, 34.2, 31.2, 34.4, 29.7, 33.5, 27.8, 34.1, 26.3, 35.5, 23.9, 36.9, 22, 37.4, 18.8, 38.6, 17.9, 39.7, 15.5, 41.2, 14.5, 43.3, 12.5, 44.5, 10.4, 47, 11.1, 51.2, 11.8, 51, 10.4, 50.4, 8.4, 49, 6, 47.8, 4.3, 45.6, 2, 43.5, 0, 41.6, -1.7, 40.2, -2.8, 39.3, -4.8, 39.6, -7.2, 39.5, -9.5, 40.5, -11, 40.6, -15, 37.5, -17.6, 35.3, -21, 35.5, -24, 32.9, -25.9, 32.6, -28.6, 30.9, -30.4, 28.2, -32.7, 25.6, -34, 22.5, -34, 20, -34.8, 18.4, -34.1, 17.9, -31.5, 16.4, -28.6, 15.2, -26.7, 14.5, -22.8, 13.4, -20.8, 11.8, -17.2, 11.8, -15.4, 13.6, -12, 13.4, -9.4, 12.3, -6.1, 12.2, -5, 11.1, -3.9, 9.6, -1.9, 9.3, 0.3, 9.8, 2.8, 9.6, 3.9, 8.5, 4.5, 6.7, 4.3, 5.6, 4.9, 4.4, 6.3, 2.7, 6.3, 1.1, 5.9, -1.1, 5, -3, 5.1, -4.6, 5.2, -7.5, 4.4, -9.3, 5.5, -11.4, 6.8, -12.9, 7.8, -13.2, 8.9, -15.1, 11, -16.7, 12.4, -16.7, 13.6, -17.2, 14.6, -16.4, 16.1, -16.1, 18.1, -16.3, 19.6, -17, 21, -16, 23.7, -14.8, 25.1, -13.4, 27.6, -11.4, 28.1, -9.8, 29.6, -9.6, 30.7, -9.3, 32.6, -8.4, 33.4, -6.9, 34.1, -5.8, 35.8],
    [49.3, -12, 50.5, -15.5, 49.5, -17.5, 48.5, -20.5, 47.1, -24.9, 45.4, -25.6, 44, -24.8, 43.3, -22, 44.4, -20, 44, -17.5, 44.9, -16.2, 47, -15.2, 48, -13.6, 49.3, -12],
    // Eurasie
    [-5.6, 36.1, -2, 36.7, 0.3, 38.8, 0, 40, 3.2, 41.9, 3.1, 43.1, 4.8, 43.4, 7, 43.6, 8.8, 44.4, 10.2, 43.9, 11.2, 42.4, 12.6, 41.4, 14.2, 40.8, 15.7, 39.8, 15.7, 38.1, 16.6, 38.5, 17.2, 39.4, 18.5, 40.1, 17.1, 40.6, 15.9, 41.6, 14.1, 42.6, 12.4, 44.3, 12.3, 45.3, 13.8, 45.6, 15.2, 44.4, 16.4, 43.4, 18.5, 42.5, 19.4, 41.8, 19.4, 40.3, 20.5, 39, 21.1, 37.8, 21.7, 36.8, 22.8, 36.5, 23.2, 37.9, 24, 38.2, 22.9, 39.6, 23.8, 40.6, 25.4, 40.9, 26.4, 40.2, 26.3, 39.2, 27.2, 38.3, 27.3, 37, 28.3, 36.7, 30.6, 36.6, 32.8, 36.1, 34.7, 36.8, 36.2, 36.6, 35.8, 35.2, 35.5, 33.7, 35, 32.8, 34.5, 31.6, 34.3, 31.2, 34.9, 29.5, 36.5, 26.5, 38.5, 23.5, 39.3, 21.5, 40.8, 19, 42.6, 16, 43.2, 13.2, 44.6, 12.7, 46.5, 13.4, 49, 14.5, 52.2, 15.6, 55.5, 17.6, 57.7, 18.9, 58.6, 20.4, 59.8, 22.4, 58.8, 23.6, 56.4, 24.9, 56.3, 26.2, 55.5, 25.4, 54.2, 24.2, 52.5, 24.2, 51.5, 24.6, 51.6, 25.9, 50.8, 24.8, 50.1, 25.9, 49.6, 26.9, 48.6, 27.8, 48, 29.4, 48.4, 30, 49.6, 30.1, 50.6, 29.1, 51.3, 28, 52.6, 27.4, 54.7, 26.5, 56.3, 27.1, 57.4, 25.7, 59.5, 25.4, 61.6, 25.2, 64.3, 25.3, 66.6, 25.4, 67.3, 24.6, 68.3, 23.5, 69, 22.4, 70.4, 20.9, 72.6, 21.3, 72.9, 19, 73.4, 16, 74.4, 14, 75, 12.2, 75.9, 11.1, 76.5, 9.5, 77.3, 8.2, 78.3, 8.9, 79.2, 10.3, 79.9, 10.8, 80.2, 13.2, 80.1, 15.1, 81.2, 16, 82.3, 16.6, 84.1, 18.3, 85.8, 19.8, 86.9, 21.5, 88.8, 21.8, 90.6, 22.4, 91.8, 22.4, 92.4, 20.7, 93.5, 19.4, 94.4, 17, 94.3, 16, 95.4, 15.7, 97.2, 16.8, 97.6, 15.3, 98.2, 13.2, 98.6, 10, 98.3, 8.2, 99.7, 6.4, 100.4, 4.3, 101.4, 2.6, 103.4, 1.3, 104.2, 1.4, 103.5, 4.1, 103.2, 5.4, 102, 6.2, 100.4, 7.4, 99.9, 9.2, 99.2, 10.6, 99.9, 12.8, 100.9, 13.4, 102.6, 12.2, 103, 11, 104.7, 10.5, 104.8, 8.6, 106.7, 9.5, 108.8, 11.3, 109.3, 13.5, 108.9, 15.3, 107.4, 16.7, 106.5, 18, 105.7, 19, 106.6, 20.4, 107.9, 21.5, 109.7, 21.5, 110.5, 20.4, 111, 21.5, 112.8, 21.8, 114.2, 22.3, 116.5, 22.9, 117.8, 24, 119.6, 25.6, 120.3, 27.1, 121.6, 28.5, 121.9, 30.1, 121.2, 30.8, 121.9, 31.7, 120.8, 32.9, 119.6, 34.4, 120.4, 36.1, 122.6, 37.2, 121.4, 37.6, 120, 37.4, 118.9, 37.4, 118, 38.2, 117.6, 39, 118.9, 39.1, 121, 40.8, 121.9, 40.8, 121.5, 39, 122.3, 39.8, 124.3, 39.9, 125.2, 39.4, 125.4, 37.7, 126.4, 37, 126.4, 34.8, 127.4, 34.5, 129.3, 35.2, 129.5, 36.8, 128.6, 38.6, 127.8, 39.6, 129.4, 40.7, 129.7, 41.6, 130.8, 42.3, 132.3, 43.3, 133.9, 42.9, 135.5, 43.9, 137.4, 45.5, 138.4, 47, 140.2, 48.4, 140.6, 50.5, 141.4, 52.2, 140.8, 53.3, 137.6, 54.4, 141, 58, 148, 59.3, 155, 59.7, 156.8, 57.5, 156, 54, 156.7, 51, 158.5, 52, 160, 53.5, 162, 55, 163, 57, 163.5, 59.5, 166, 60.3, 170, 60, 173, 61.5, 177, 62.5, 179.9, 62.8, 179.9, 69, 175, 69.8, 170, 70, 165, 69.6, 160, 70.5, 155, 71, 150, 71.5, 145, 72.3, 140, 72.6, 135, 71.6, 130, 71, 128, 72.8, 125, 73.5, 120, 73.2, 113, 73.6, 110, 74, 113, 75.5, 110, 77, 104, 77.7, 100, 76.5, 95, 76, 90, 75.5, 87, 74, 86.5, 73.5, 80, 72.3, 80.5, 73.5, 78, 72.5, 75, 72.5, 72.8, 72.8, 71, 72.9, 69, 72.6, 67, 70.5, 67.5, 68.6, 66, 69.2, 60, 68.7, 55, 68.4, 53.5, 68.7, 47, 67.6, 44.5, 68.4, 43.8, 67.2, 44.5, 66, 42, 66.5, 40.5, 65.5, 41, 67, 39.5, 67.7, 35, 69.2, 33, 69.4, 29, 69.8, 25, 71, 20, 70, 17, 69, 14.5, 67.6, 12.5, 65.9, 11, 64.5, 9, 63.5, 7, 62.6, 5, 61.5, 5, 60, 5.5, 58.8, 7, 58, 8.5, 58.2, 10.5, 59.2, 11.2, 58.4, 12.3, 56.4, 12.8, 55.5, 14.2, 55.4, 14.3, 56, 16.4, 56.6, 16.6, 57.8, 16.8, 58.7, 18.3, 59.3, 18.7, 60.2, 17.3, 60.7, 17.3, 62.2, 18.5, 62.9, 20.8, 63.8, 22.2, 65.1, 23.9, 65.8, 25.3, 65.1, 25.4, 64.5, 23.4, 63.6, 21.3, 62.4, 21.5, 61, 21.4, 60.6, 22.9, 59.9, 25.9, 60.4, 28, 60.5, 29.7, 60.2, 28, 59.5, 23.5, 59.2, 23.4, 58.5, 24.3, 57.3, 23.2, 57.1, 21.4, 57.1, 21, 56.2, 21.1, 55.3, 19.6, 54.4, 18.6, 54.6, 16.8, 54.5, 14.2, 53.9, 12.5, 54.4, 11, 54, 10.9, 54.6, 10, 54.9, 9.9, 55.9, 10.6, 57.7, 9.4, 57.1, 8.2, 56.8, 8.1, 55.5, 8.7, 54, 7, 53.6, 4.8, 52.9, 4, 51.4, 2.5, 51.1, 1.6, 50.2, 0.2, 49.7, -1.3, 49.6, -1.9, 48.7, -4.7, 48.5, -4.4, 47.8, -2.2, 47.1, -1.2, 46, -1.4, 44.5, -1.8, 43.4, -4, 43.4, -7.5, 43.7, -9.3, 43, -8.8, 41.8, -9, 40.2, -9.4, 38.8, -8.8, 37.9, -9, 37, -7.4, 37.2, -6.3, 36.8, -5.6, 36.1],
    // Îles britanniques, Sri Lanka, Japon
    [-5.7, 50, -3, 50.6, 1.3, 51.1, 1.7, 52.7, 0.2, 53.4, -0.2, 54.1, -1.6, 55.6, -2.1, 57.1, -1.8, 57.6, -3.3, 58.6, -5, 58.6, -5.7, 57.3, -6.2, 56.3, -5.6, 55.3, -4.6, 55, -3.1, 54.6, -3.4, 53.4, -4.5, 53.2, -4.4, 52.2, -5.2, 51.7, -3.3, 51.4, -5.7, 50],
    [-6, 52.1, -6.2, 53.9, -5.5, 54.6, -7, 55.3, -8.5, 54.9, -10, 54.2, -9.8, 53.1, -10.4, 52, -9.5, 51.6, -7.8, 51.8, -6, 52.1],
    [79.8, 8.5, 80.2, 9.8, 81.2, 8.6, 81.9, 7.2, 81.6, 6.4, 80.4, 6, 79.8, 7, 79.8, 8.5],
    [130, 31.5, 131.7, 34, 133.5, 34.4, 135.2, 33.7, 137, 34.6, 139, 34.9, 140.6, 35.6, 140.9, 38.1, 141.5, 40.6, 140, 41.4, 140, 39.5, 139.5, 38, 137.2, 36.9, 136.7, 37.3, 135.5, 35.6, 133, 35.5, 131, 34.4, 129.5, 33.2, 130, 31.5],
    [140, 41.5, 141.3, 41.4, 143.3, 42, 145.6, 43.3, 144.2, 44.1, 141.8, 45.4, 141.4, 43.4, 140, 42.5, 140, 41.5],
    // Asie du Sud-Est, Océanie
    [95.3, 5.6, 97.5, 5.2, 100.4, 2.2, 103.8, -1, 106, -3.2, 105.9, -5.8, 104.7, -5.9, 102.3, -4, 100.9, -2.1, 98.7, 1.7, 95.3, 5.6],
    [105.2, -6.8, 106.5, -6, 108.3, -6.2, 111, -6.4, 112.6, -6.9, 114.4, -7.8, 114.4, -8.7, 111.6, -8.3, 108.7, -7.8, 105.4, -7.2, 105.2, -6.8],
    [109, 1.5, 110.5, 1.8, 111.8, 2.8, 113.8, 4.4, 115.6, 5.6, 117.1, 7, 118.6, 5.1, 119.2, 4.9, 118, 2.4, 117.9, 1.1, 118.9, 0.9, 117.7, 0.1, 116.5, -2.4, 116, -3.6, 114.6, -4.1, 113, -3.1, 111.7, -3.4, 110.2, -2.9, 110, -1.4, 109, 0.4, 109, 1.5],
    [120.6, 18.5, 122.2, 18.5, 122.3, 17, 121.7, 15.9, 122, 14, 123.9, 13.8, 124.1, 12.6, 123.3, 13, 121.5, 13.5, 120.6, 14.3, 120, 16, 120.6, 18.5],
    [131, -1.3, 134, -0.9, 137.8, -1.5, 141, -2.6, 145.7, -4.9, 147.6, -6.1, 147.2, -7.4, 150, -10.6, 147, -10, 144, -7.7, 142, -9.2, 138.3, -8.4, 137.7, -5.5, 135, -4.4, 132.8, -4, 131.9, -2.8, 131, -1.3],
    [113.5, -22, 114.2, -26, 115, -30.5, 115.6, -33.6, 117.9, -35.1, 121.6, -33.9, 124.2, -33, 126.2, -32.3, 129, -31.7, 131.3, -31.5, 133.9, -32.3, 135.6, -34.8, 137.6, -35.6, 138.5, -34.8, 140.6, -38, 143.6, -38.8, 146.3, -39.1, 148.3, -37.8, 150, -37.4, 151.3, -33.8, 153.1, -31, 153.6, -28.4, 153, -25.2, 150.8, -22.6, 149.6, -22.4, 146.3, -18.9, 145.4, -16, 145.3, -14.9, 143.6, -14, 142.5, -10.7, 141.6, -12.9, 141.5, -15.4, 140.2, -17.7, 137.4, -16, 135.9, -15, 136.7, -12.2, 135.3, -12.2, 132.6, -11.5, 131, -12.2, 129.4, -14.9, 127.8, -14.3, 125.8, -14.4, 124.4, -16.3, 122.2, -18.2, 121, -19.7, 118.8, -20.3, 116.7, -20.6, 114.6, -21.8, 113.5, -22],
    [172.7, -34.4, 174.3, -35.3, 175.9, -37.5, 178.5, -37.7, 177, -39.2, 176, -41.3, 174.7, -41.3, 175.2, -40, 174, -39.2, 174.6, -37.5, 172.7, -34.4],
    [172.7, -40.5, 174.3, -41.7, 173, -43.8, 171.2, -44.5, 170.6, -45.9, 169, -46.6, 166.5, -46, 168.4, -44, 171.3, -41.9, 172.7, -40.5]
  ];
  // Mers intérieures (trous dans l'Eurasie) : mer Noire, Caspienne.
  var MERS = [
    [27.5, 42.5, 28.1, 43.4, 28.7, 44.3, 29.7, 45.2, 30.8, 46.5, 31.8, 46.6, 33.5, 46, 32.7, 45.4, 33.6, 44.5, 35.1, 44.8, 36.6, 45.3, 38.2, 46.8, 39.2, 47.1, 37.5, 44.7, 38.8, 44.3, 40, 43.4, 41.6, 41.6, 40, 41, 38.3, 40.9, 36.7, 41.3, 35.1, 42, 33.3, 42, 31.2, 41.1, 29.1, 41.2, 28, 41.9, 27.5, 42.5],
    [47, 44.8, 47.5, 43, 48.6, 41.8, 49.3, 40.5, 49.3, 39.4, 48.9, 38.4, 49.1, 37.6, 50.4, 37.1, 51.8, 36.6, 53.9, 36.9, 53.8, 38.2, 53.2, 39.2, 53.1, 40.3, 52.7, 41.4, 52.9, 42.5, 51.3, 43.2, 50.6, 44.4, 51.3, 45.2, 53, 45.3, 53.2, 46.6, 51.2, 47, 49.2, 46.4, 48.3, 46.1, 47, 44.8]
  ];
  function bbox(p) { var b = [1e9, 1e9, -1e9, -1e9]; for (var i = 0; i < p.length; i += 2) { b[0] = Math.min(b[0], p[i]); b[1] = Math.min(b[1], p[i + 1]); b[2] = Math.max(b[2], p[i]); b[3] = Math.max(b[3], p[i + 1]); } return b; }
  var BOX_T = TERRES.map(bbox), BOX_M = MERS.map(bbox);
  function inPoly(p, b, lo, la) {
    if (lo < b[0] || lo > b[2] || la < b[1] || la > b[3]) return false;
    var c = false;
    for (var i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
      var yi = p[i + 1], yj = p[j + 1];
      if ((yi > la) !== (yj > la) && lo < (p[j] - p[i]) * (la - yi) / (yj - yi) + p[i]) c = !c;
    }
    return c;
  }
  function terre(lo, la) {
    if (la < -70 + 3 * Math.sin(lo * 2 * DEG)) return true; // Antarctique
    for (var m = 0; m < MERS.length; m++) if (inPoly(MERS[m], BOX_M[m], lo, la)) return false;
    for (var t = 0; t < TERRES.length; t++) if (inPoly(TERRES[t], BOX_T[t], lo, la)) return true;
    return false;
  }
  var VILLES = [[2.35, 48.85], [-0.1, 51.5], [-74, 40.7], [3.4, 6.5], [31.2, 30], [55.3, 25.2], [72.8, 19], [28, -26.2], [-46.6, -23.5], [37.6, 55.75], [29, 41], [-3.7, 40.4],
    [36.8, -1.3], [-7.6, 33.6], [13.4, 52.5], [12.5, 41.9], [-73.6, 45.5], [-17.4, 14.7], [77.2, 28.6], [18, 59.3], [15.3, -4.3], [46.7, 24.7], [-4, 5.3], [-9.1, 38.7], [3, 36.7], [51.4, 35.7], [38.7, 9], [18.4, -33.9], [-43.2, -22.9], [4.9, 52.4]];
  function globeDonnees(x, w, h, r) {
    fill(x, '#01030a', w, h);
    var gx = w * 0.6, gy = h * 0.53, R = h * 0.41;
    x.globalCompositeOperation = 'lighter';
    glow(x, gx, gy, R * 2.6, [10, 34, 86], 0.7, SOFT);
    glow(x, w * 0.12, h * 0.2, w * 0.4, [40, 20, 90], 0.25, SOFT);
    x.globalCompositeOperation = 'source-over';
    starfield(x, w, 0, h, 1300, r, 10);
    var lon0 = (10 + r() * 10) * DEG, lat0 = (24 + r() * 6) * DEG, cl = Math.cos(lat0), sl = Math.sin(lat0);
    function V(lo, la, e) {
      var ca = Math.cos(la), X = ca * Math.sin(lo - lon0), Y = Math.sin(la), Z = ca * Math.cos(lo - lon0);
      e = e || 1; return [X * e, (Y * cl - Z * sl) * e, (Y * sl + Z * cl) * e];
    }
    function S(v) { return [gx + R * v[0], gy - R * v[1]]; }
    // Soleil rasant derrière le limbe
    var sa = -0.72 - r() * 0.25, sx = gx + Math.cos(sa) * R * 1.01, sy = gy + Math.sin(sa) * R * 1.01;
    x.globalCompositeOperation = 'lighter';
    glow(x, sx, sy, R * 1.6, [70, 140, 255], 0.5);
    glow(x, sx, sy, R * 0.5, [200, 225, 255], 0.8);
    x.globalCompositeOperation = 'source-over';
    // Anneau orbital (moitié arrière)
    var ringPts = [], tiltA = 1.25 + r() * 0.15, tiltB = -0.32 + r() * 0.12;
    for (var k = 0; k <= 240; k++) {
      var ph = k / 240 * TAU, px = Math.cos(ph) * 1.32, pz = Math.sin(ph) * 1.32, py = 0;
      var y1 = py * Math.cos(tiltA) - pz * Math.sin(tiltA), z1 = py * Math.sin(tiltA) + pz * Math.cos(tiltA);
      var x2 = px * Math.cos(tiltB) - y1 * Math.sin(tiltB), y2 = px * Math.sin(tiltB) + y1 * Math.cos(tiltB);
      ringPts.push([x2, y2, z1]);
    }
    function drawRing(front) {
      x.save(); x.globalCompositeOperation = 'lighter'; x.lineWidth = 2;
      for (var i = 0; i < ringPts.length - 1; i++) {
        var a = ringPts[i], b = ringPts[i + 1], isF = a[2] > 0;
        if (isF !== front) continue;
        if (!front && a[0] * a[0] + a[1] * a[1] < 1) continue;
        var sA = S(a), sB = S(b);
        x.strokeStyle = rgba([110, 180, 255], front ? 0.32 : 0.12); x.beginPath(); x.moveTo(sA[0], sA[1]); x.lineTo(sB[0], sB[1]); x.stroke();
      }
      x.restore();
    }
    drawRing(false);
    // Corps du globe
    var bg = x.createRadialGradient(gx - R * 0.35, gy - R * 0.4, R * 0.1, gx, gy, R);
    bg.addColorStop(0, '#0c2142'); bg.addColorStop(0.6, '#061227'); bg.addColorStop(1, '#030915');
    dot(x, gx, gy, R, bg);
    // Points : océans discrets, terres lumineuses (éclairées en haut à gauche)
    var N = 14000, ga = Math.PI * (3 - Math.sqrt(5)), L = [-0.42, 0.5, 0.76];
    x.save(); x.globalCompositeOperation = 'lighter';
    for (k = 0; k < N; k++) {
      var la = Math.asin(1 - 2 * (k + 0.5) / N), lo = ((k * ga) % TAU) - Math.PI, v = V(lo, la);
      if (v[2] <= 0.02) continue;
      var p = S(v), lit = 0.35 + 0.65 * Math.max(0, v[0] * L[0] + v[1] * L[1] + v[2] * L[2]), rim = Math.pow(1 - v[2], 3);
      if (terre(lo / DEG, la / DEG)) {
        var sz = 2.9 * (0.45 + 0.55 * Math.sqrt(v[2]));
        x.fillStyle = rgba(lerpC([40, 150, 255], [170, 235, 255], lit), 0.35 + 0.6 * lit + rim * 0.3);
        x.fillRect(p[0] - sz / 2, p[1] - sz / 2, sz, sz);
      } else if (k % 2 === 0) {
        x.fillStyle = rgba([60, 120, 220], 0.08 + 0.1 * lit + rim * 0.2);
        x.fillRect(p[0] - 0.9, p[1] - 0.9, 1.8, 1.8);
      }
    }
    // Lueurs des villes
    var vis = [];
    VILLES.forEach(function (c, i) {
      var v2 = V(c[0] * DEG, c[1] * DEG); vis[i] = v2;
      if (v2[2] <= 0.05) return;
      var p2 = S(v2);
      glow(x, p2[0], p2[1], 46 * v2[2], [255, 196, 120], 0.55);
      for (var q = 0; q < 14; q++) {
        var v3 = V((c[0] + (r() - 0.5) * 5) * DEG, (c[1] + (r() - 0.5) * 4) * DEG), p3 = S(v3);
        if (v3[2] > 0.05) { x.fillStyle = rgba([255, 214, 150], 0.4 + r() * 0.5); x.fillRect(p3[0] - 1.2, p3[1] - 1.2, 2.4, 2.4); }
      }
    });
    // Limbe : fresnel intérieur et atmosphère
    var fr = x.createRadialGradient(gx, gy, R * 0.72, gx, gy, R);
    fr.addColorStop(0, 'rgba(60,150,255,0)'); fr.addColorStop(0.75, 'rgba(60,150,255,0.08)'); fr.addColorStop(1, 'rgba(120,200,255,0.4)');
    dot(x, gx, gy, R, fr);
    var at = x.createRadialGradient(gx, gy, R * 0.97, gx, gy, R * 1.3);
    at.addColorStop(0, 'rgba(90,180,255,0)'); at.addColorStop(0.1, 'rgba(110,195,255,0.45)'); at.addColorStop(0.3, 'rgba(70,140,255,0.14)'); at.addColorStop(1, 'rgba(40,90,255,0)');
    x.fillStyle = at; x.fillRect(gx - R * 1.3, gy - R * 1.3, R * 2.6, R * 2.6);
    // Arc de lumière côté soleil
    var ag = x.createRadialGradient(sx, sy, 0, sx, sy, R * 1.1);
    ag.addColorStop(0, 'rgba(235,245,255,1)'); ag.addColorStop(0.3, 'rgba(140,200,255,0.5)'); ag.addColorStop(1, 'rgba(80,150,255,0)');
    x.strokeStyle = ag; x.lineWidth = 5; x.beginPath(); x.arc(gx, gy, R * 1.002, sa - 1.3, sa + 1.3); x.stroke();
    x.lineWidth = 16; x.globalAlpha = 0.35; x.stroke(); x.globalAlpha = 1;
    // Arcs entre villes (Paris au centre du réseau)
    var pairs = [[0, 2], [0, 6], [0, 3], [0, 8], [0, 9], [0, 5], [1, 16], [2, 28], [4, 26], [5, 18], [7, 12], [13, 17], [10, 25], [14, 19], [3, 20], [11, 23], [6, 27], [0, 12], [21, 4], [24, 22]];
    pairs.forEach(function (pr) {
      var A = VILLES[pr[0]], Bv = VILLES[pr[1]];
      var a3 = [Math.cos(A[1] * DEG) * Math.sin(A[0] * DEG), Math.sin(A[1] * DEG), Math.cos(A[1] * DEG) * Math.cos(A[0] * DEG)];
      var b3 = [Math.cos(Bv[1] * DEG) * Math.sin(Bv[0] * DEG), Math.sin(Bv[1] * DEG), Math.cos(Bv[1] * DEG) * Math.cos(Bv[0] * DEG)];
      var om = Math.acos(Math.max(-1, Math.min(1, a3[0] * b3[0] + a3[1] * b3[1] + a3[2] * b3[2]))), so = Math.sin(om);
      if (so < 1e-3) return;
      var lift = Math.min(0.32, 0.22 * om), head = 0.35 + r() * 0.6, gold = r() < 0.3, cc = gold ? [255, 200, 120] : [90, 210, 255], pts = [];
      for (var i = 0; i <= 48; i++) {
        var t = i / 48, wa = Math.sin((1 - t) * om) / so, wb = Math.sin(t * om) / so, e = 1 + lift * Math.sin(Math.PI * t);
        var p3 = [(a3[0] * wa + b3[0] * wb), (a3[1] * wa + b3[1] * wb), (a3[2] * wa + b3[2] * wb)];
        var la2 = Math.asin(Math.max(-1, Math.min(1, p3[1]))), lo2 = Math.atan2(p3[0], p3[2]), v4 = V(lo2, la2, e);
        pts.push({ v: v4, s: S(v4), ok: v4[2] > 0 || v4[0] * v4[0] + v4[1] * v4[1] > 1, t: t });
      }
      for (i = 0; i < 48; i++) {
        var a = pts[i], b = pts[i + 1]; if (!a.ok || !b.ok) continue;
        var dt = head - a.t, hl = dt >= 0 && dt < 0.35 ? 1 - dt / 0.35 : 0;
        x.strokeStyle = rgba(lerpC(cc, [255, 255, 255], hl * 0.6), 0.22 + 0.7 * hl * hl);
        x.lineWidth = 1.6 + 2.2 * hl * hl; x.beginPath(); x.moveTo(a.s[0], a.s[1]); x.lineTo(b.s[0], b.s[1]); x.stroke();
      }
      var hp = pts[Math.round(head * 48)];
      if (hp.ok) { glow(x, hp.s[0], hp.s[1], 40, cc, 0.7); dot(x, hp.s[0], hp.s[1], 3, '#ffffff'); }
      [pr[0], pr[1]].forEach(function (ci) {
        var c = VILLES[ci], v5 = vis[ci]; if (!v5 || v5[2] <= 0.05) return;
        x.strokeStyle = rgba(cc, 0.5); x.lineWidth = 1.4; x.beginPath();
        for (var j = 0; j <= 24; j++) { var an = j / 24 * TAU, v6 = V((c[0] + Math.cos(an) * 1.6 / Math.cos(c[1] * DEG)) * DEG, (c[1] + Math.sin(an) * 1.6) * DEG), p6 = S(v6); if (j) x.lineTo(p6[0], p6[1]); else x.moveTo(p6[0], p6[1]); }
        x.stroke();
      });
    });
    x.restore();
    drawRing(true);
    // Satellites sur l'anneau avant
    x.save(); x.globalCompositeOperation = 'lighter';
    for (k = 0; k < 3; k++) { var rp = ringPts[Math.floor(r() * 240)]; if (rp[2] <= 0) continue; var sp2 = S(rp); glow(x, sp2[0], sp2[1], 30, [150, 210, 255], 0.6); dot(x, sp2[0], sp2[1], 2.4, '#e8f6ff'); }
    // Éclat du soleil au bord
    glow(x, sx, sy, R * 0.35, [255, 255, 255], 0.9);
    spikes(x, sx, sy, R * 0.9, [200, 225, 255], 0.5, 8, 0.2);
    var hs = x.createLinearGradient(sx - w * 0.5, sy, sx + w * 0.5, sy);
    hs.addColorStop(0, 'rgba(90,160,255,0)'); hs.addColorStop(0.5, 'rgba(170,215,255,0.55)'); hs.addColorStop(1, 'rgba(90,160,255,0)');
    x.fillStyle = hs; x.fillRect(sx - w * 0.5, sy - 2, w, 4);
    x.restore();
    vignette(x, w, h, 0.55);
    grain(x, w, h, r, 0.045);
  }

  // ---- scène: cerveau-lumiere
  // Cerveau de lumière : hémisphère gauche organique (circonvolutions éclairées), hémisphère droit en circuits.
  function cerveauLumiere(x, w, h, r) {
    fill(x, '#03030e', w, h);
    var n = makeNoise(r), cx = w * 0.5, cy = h * 0.5, BH = h * 0.37, BW = BH * 0.86, gap = 6;
    x.globalCompositeOperation = 'lighter';
    glow(x, cx, cy, w * 0.58, [28, 24, 92], 0.9, SOFT);
    glow(x, cx - BW * 0.7, cy, BH * 1.7, [116, 28, 120], 0.4, SOFT);
    glow(x, cx + BW * 0.7, cy, BH * 1.7, [0, 92, 150], 0.45, SOFT);
    x.globalCompositeOperation = 'source-over';
    starfield(x, w, 0, h, 700, r, 0);
    function hemi(px, py) {
      var u = Math.abs(px - cx), v = (py - cy) / BH, a = BW * 0.56 * (1 + 0.12 * v), du = (u - gap - a * 0.7) / a;
      var gv = gap + BH * 0.16 * Math.pow(Math.max(0, Math.abs(v) - 0.5) / 0.5, 2);
      return Math.min(1 - Math.pow(Math.abs(du), du < 0 ? 3.2 : 2.25) - Math.pow(Math.abs(v), 2.3), (u - gv) / (a * 0.3));
    }
    // Circonvolutions : somme d'ondes de même longueur dans des directions variées (motif en labyrinthe régulier).
    var NW = 9, wk = TAU / 86, wcos = [], wsin = [], wph = [];
    for (var q0 = 0; q0 < NW; q0++) { var an0 = (q0 + r() * 0.6) * Math.PI / NW; wcos.push(Math.cos(an0) * wk); wsin.push(Math.sin(an0) * wk); wph.push(r() * TAU); }
    // --- Surface calculée pixel par pixel (hauteur, puis normales et lumière)
    var K = 2.2, bx0 = cx - BW * 1.12, by0 = cy - BH * 1.06, bw = BW * 2.24, bh = BH * 2.12;
    var W = Math.round(bw / K), H = Math.round(bh / K), hg = new Float32Array(W * H), cr = new Float32Array(W * H), dd = new Float32Array(W * H);
    var i, j, k, px, py, HS = 24, S3 = Math.sqrt(3);
    for (j = 0; j < H; j++) for (i = 0; i < W; i++) {
      k = j * W + i; px = bx0 + (i + 0.5) * bw / W; py = by0 + (j + 0.5) * bh / H;
      var d = hemi(px, py); dd[k] = d;
      if (d < -0.04) continue;
      var dome = Math.sqrt(Math.max(0, d) + 0.002);
      if (px < cx) {
        var wx = px + n(px * 0.004, py * 0.004) * 46, wy = py + n(px * 0.004 + 31, py * 0.004 + 17) * 46, g = 0;
        for (var q1 = 0; q1 < NW; q1++) g += Math.cos(wx * wcos[q1] + wy * wsin[q1] + wph[q1]);
        g /= 2.1;
        var c = smooth(0.0, 0.5, Math.abs(g)); cr[k] = c; hg[k] = dome * 0.55 + c * 0.09;
      } else {
        // Verre lisse parcouru d'un fin maillage hexagonal
        var qx = (S3 / 3 * px - py / 3) / HS, qr = 2 / 3 * py / HS, qs = -qx - qr, rx = Math.round(qx), ry = Math.round(qr), rz = Math.round(qs);
        var ex = Math.abs(rx - qx), ey = Math.abs(ry - qr), ez = Math.abs(rz - qs);
        if (ex > ey && ex > ez) rx = -ry - rz; else if (ey > ez) ry = -rx - rz;
        var hx = HS * S3 * (rx + ry / 2), hy = HS * 1.5 * ry, ax = Math.abs(px - hx), ay = Math.abs(py - hy);
        var ed = HS * 0.866 - Math.max(ax, ax * 0.5 + ay * 0.866);
        cr[k] = 1 - smooth(0, 1.8, ed); hg[k] = dome * 0.55;
      }
    }
    var Lx = -0.45, Ly = -0.6, Lz = 0.66, Hx = Lx, Hy = Ly, Hz = Lz + 1, hl = Math.hypot(Hx, Hy, Hz); Hx /= hl; Hy /= hl; Hz /= hl;
    var brain = field(W, H, function (D) {
      for (j = 1; j < H - 1; j++) for (i = 1; i < W - 1; i++) {
        k = j * W + i; var d = dd[k]; if (d < -0.04) continue;
        px = bx0 + (i + 0.5) * bw / W; py = by0 + (j + 0.5) * bh / H;
        var nx = (hg[k - 1] - hg[k + 1]) * 55, ny = (hg[k - W] - hg[k + W]) * 55, nz = 1, nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
        var df = Math.max(0, nx * Lx + ny * Ly + nz * Lz), sp = Math.pow(Math.max(0, nx * Hx + ny * Hy + nz * Hz), 30);
        var rim = Math.pow(1 - clamp01(d * 3), 3), R, G, B, A, u = Math.abs(px - cx), c = cr[k];
        if (px < cx) {
          var e = c * c * (3 - 2 * c), lit = 0.38 + 0.75 * df;
          var tw = clamp01((py - by0) / bh);
          R = mix(70, mix(240, 205, tw), e) * lit + 255 * sp * 0.6 * e + 190 * rim;
          G = mix(22, mix(150, 120, tw), e) * lit + 225 * sp * 0.6 * e + 90 * rim;
          B = mix(100, mix(225, 250, tw), e) * lit + 255 * sp * 0.6 * e + 255 * rim;
          A = 0.95;
        } else {
          var lt = 0.45 + 0.8 * df;
          R = 8 * lt + 40 * c + 160 * sp + 50 * rim; G = 40 * lt + 140 * c + 235 * sp + 190 * rim; B = 82 * lt + 210 * c + 255 * sp + 255 * rim; A = 0.86;
        }
        A *= smooth(-0.035, 0.012, d);
        var q = k * 4; D[q] = R; D[q + 1] = G; D[q + 2] = B; D[q + 3] = A * 255;
      }
    });
    // Lueur de l'ensemble (bloom), puis le cerveau net
    var Bl = layer(w, h, 10); Bl.o.drawImage(brain, bx0, by0, bw, bh); soften(Bl, 3);
    blit(x, Bl, w, h, 'lighter', 0.9);
    x.save(); x.imageSmoothingQuality = 'high'; x.drawImage(brain, bx0, by0, bw, bh); x.restore();

    // --- Circuits de l'hémisphère droit
    var gs = 21, occ = {}, traces = [], dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    function gp(gi, gj) { return [cx + gap + 12 + gi * gs, cy + gj * gs]; }
    function ok(gi, gj) { var p = gp(gi, gj); return p[0] > cx + gap + 8 && hemi(p[0], p[1]) > 0.07 && !occ[gi + ',' + gj]; }
    for (var t = 0; t < 170; t++) {
      var gi = Math.floor(r() * 24), gj = Math.floor((r() - 0.5) * 2 * 28), di = Math.floor(r() * 4) * 2, len = 3 + Math.floor(r() * 12);
      if (!ok(gi, gj)) continue;
      var pts = [[gi, gj]]; occ[gi + ',' + gj] = 1;
      for (var s = 0; s < len; s++) {
        if (r() < 0.3) di = (di + (r() < 0.5 ? 1 : 7)) % 8;
        var ni = gi + dirs[di][0], nj = gj + dirs[di][1];
        if (!ok(ni, nj)) break;
        gi = ni; gj = nj; occ[gi + ',' + gj] = 1; pts.push([gi, gj]);
      }
      if (pts.length > 2) traces.push(pts.map(function (p) { return gp(p[0], p[1]); }));
    }
    // Pistes qui sortent du cerveau vers la droite
    var ext = [];
    for (t = 0; t < 22; t++) {
      var v = (t / 21 * 2 - 1) * 0.82 + (r() - 0.5) * 0.04, ey = cy + v * BH, ex = cx + gap;
      while (hemi(ex + 4, ey) > 0.02 && ex < w) ex += 4;
      var path = [[ex - 6, ey]], cxp = ex + 40 + r() * 60, cyp = ey, sg = v < 0 ? -1 : 1;
      path.push([cxp, cyp]);
      var dj = (24 + r() * 120) * Math.abs(v) * 1.4; cxp += dj; cyp += dj * sg; path.push([cxp, cyp]);
      cxp += 180 + r() * 620; path.push([cxp, cyp]);
      ext.push(path);
    }
    x.save(); x.globalCompositeOperation = 'lighter'; x.lineJoin = 'round'; x.lineCap = 'round';
    function stroke(pts, wd, style) { x.strokeStyle = style; x.lineWidth = wd; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (var q = 1; q < pts.length; q++) x.lineTo(pts[q][0], pts[q][1]); x.stroke(); }
    function pad(p, a) { x.strokeStyle = 'rgba(140,230,255,' + a + ')'; x.lineWidth = 1.8; x.beginPath(); x.arc(p[0], p[1], 4.6, 0, TAU); x.stroke(); dot(x, p[0], p[1], 1.8, 'rgba(220,250,255,' + a + ')'); }
    traces.forEach(function (pts) {
      stroke(pts, 8, 'rgba(40,170,255,0.1)'); stroke(pts, 2, 'rgba(110,220,255,0.8)');
      pad(pts[0], 0.9); pad(pts[pts.length - 1], 0.9);
    });
    ext.forEach(function (pts) {
      var last = pts[pts.length - 1], g = x.createLinearGradient(pts[0][0], 0, last[0], 0);
      g.addColorStop(0, 'rgba(110,220,255,0.75)'); g.addColorStop(1, 'rgba(110,220,255,0.05)');
      stroke(pts, 1.8, g); pad(last, 0.35);
    });
    // Fibres nerveuses qui partent vers la gauche
    for (t = 0; t < 34; t++) {
      var v2 = (t / 33 * 2 - 1) * 0.85, fy = cy + v2 * BH, fx = cx - gap;
      while (hemi(fx - 4, fy) > 0.02 && fx > 0) fx -= 4;
      var L2 = 260 + r() * 640, c1x = fx - L2 * 0.35, c1y = fy + (r() - 0.5) * 120, c2x = fx - L2 * 0.7, c2y = fy + v2 * 160 + (r() - 0.5) * 160, e2x = fx - L2, e2y = fy + v2 * 220 + (r() - 0.5) * 120;
      var fg = x.createLinearGradient(fx, 0, e2x, 0); fg.addColorStop(0, 'rgba(255,130,220,0.6)'); fg.addColorStop(1, 'rgba(160,90,255,0)');
      x.strokeStyle = fg; x.lineWidth = 1.6; x.beginPath(); x.moveTo(fx + 4, fy); x.bezierCurveTo(c1x, c1y, c2x, c2y, e2x, e2y); x.stroke();
      for (var m = 0; m < 4; m++) {
        var tt = r(), it = 1 - tt, bxp = it * it * it * fx + 3 * it * it * tt * c1x + 3 * it * tt * tt * c2x + tt * tt * tt * e2x, byp = it * it * it * fy + 3 * it * it * tt * c1y + 3 * it * tt * tt * c2y + tt * tt * tt * e2y;
        glow(x, bxp, byp, 16, [255, 150, 230], 0.5 * (1 - tt)); dot(x, bxp, byp, 1.6, 'rgba(255,230,250,' + (0.9 * (1 - tt)) + ')');
      }
    }
    // Impulsions sur les circuits
    for (t = 0; t < 14 && traces.length; t++) { var tr = traces[Math.floor(r() * traces.length)], pp = tr[Math.floor(r() * tr.length)]; glow(x, pp[0], pp[1], 34, [120, 230, 255], 0.8); dot(x, pp[0], pp[1], 2.6, '#ffffff'); }
    // Scissure centrale lumineuse
    var cg = x.createLinearGradient(0, cy - BH, 0, cy + BH);
    cg.addColorStop(0, 'rgba(200,180,255,0)'); cg.addColorStop(0.5, 'rgba(225,215,255,0.9)'); cg.addColorStop(1, 'rgba(200,180,255,0)');
    x.fillStyle = cg; x.fillRect(cx - 1.5, cy - BH, 3, BH * 2);
    x.globalAlpha = 0.18; x.fillRect(cx - 18, cy - BH, 36, BH * 2); x.globalAlpha = 1;
    // Anneau d'interface, graduations discrètes
    var RR = BH * 1.2;
    x.strokeStyle = 'rgba(140,180,255,0.12)'; x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, RR, 0, TAU); x.stroke();
    for (k = 0; k < 120; k++) {
      var an = k / 120 * TAU, l = k % 10 === 0 ? 16 : 7;
      x.strokeStyle = 'rgba(150,190,255,' + (k % 10 === 0 ? 0.3 : 0.14) + ')';
      x.beginPath(); x.moveTo(cx + Math.cos(an) * RR, cy + Math.sin(an) * RR); x.lineTo(cx + Math.cos(an) * (RR + l), cy + Math.sin(an) * (RR + l)); x.stroke();
    }
    for (k = 0; k < 3; k++) { var a0 = r() * TAU; x.strokeStyle = 'rgba(150,215,255,0.45)'; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, RR * 1.035, a0, a0 + 0.25 + r() * 0.4); x.stroke(); }
    // Particules
    for (k = 0; k < 260; k++) {
      var aa = r() * TAU, rr = BH * (0.9 + Math.pow(r(), 0.7) * 1.4), qx = cx + Math.cos(aa) * rr * 1.25, qy = cy + Math.sin(aa) * rr * 0.85;
      var pc = qx < cx ? [255, 150, 230] : [120, 220, 255], pa = 0.2 + r() * 0.6;
      if (r() < 0.12) glow(x, qx, qy, 14, pc, pa * 0.6);
      x.fillStyle = rgba(pc, pa); x.fillRect(qx, qy, 2.2, 2.2);
    }
    x.restore();
    vignette(x, w, h, 0.62);
    grain(x, w, h, r, 0.05);
  }
  // ---- scène: puce-centrale
  // Puce centrale : carte électronique vue en plongée, pistes en éventail, impulsions de lumière, effet maquette.
  function puceCentrale(x, w, h, r) {
    var f = 1500, cx = w * 0.5, cy = h * 0.46, camY = 1850, camZ = -2050, tgZ = 400;
    var phi = Math.atan2(camY, tgZ - camZ), sp = Math.sin(phi), cp = Math.cos(phi);
    function P(X, Z, Y) { Y = Y || 0; var dy = Y - camY, dz = Z - camZ, yc = dy * cp + dz * sp, zc = -dy * sp + dz * cp; return [cx + f * X / zc, cy - f * yc / zc, zc, f / zc]; }
    function squash(X, Z) { var a = P(X, Z - 10), b = P(X, Z + 10); return Math.abs(a[1] - b[1]) / (20 * a[3]); }
    var CH = 340, CZ = 400, NP = 17, traces = [], k, side;
    // Éventail de pistes depuis les quatre côtés (sans croisement)
    for (side = 0; side < 4; side++) for (k = 0; k < NP; k++) {
      var s = k / (NP - 1) * 2 - 1, as = Math.abs(s), sg = s < 0 ? -1 : 1, a1 = 70 + (1 - as) * 210, q = 430, L = 700 + r() * 2800;
      if (side === 3) L = Math.min(L, CZ - CH - a1 - as * q + 1500);
      var loc = [[0, s * 290], [a1, s * 290], [a1 + as * q, s * 290 + sg * as * q], [a1 + as * q + L, s * 290 + sg * as * q]];
      traces.push({ w: 12, pts: loc.map(function (p) {
        return side === 0 ? [CH + p[0], CZ + p[1]] : side === 1 ? [-CH - p[0], CZ - p[1]] : side === 2 ? [p[1], CZ + CH + p[0]] : [-p[1], CZ - CH - p[0]];
      }) });
    }
        function freeQ(X, Z, m) { return Math.abs(X) > 820 + m && Math.abs(Z - CZ) > 820 + m; }
    // Petites puces secondaires et leurs pistes courtes
    var chips = [];
    for (k = 0; k < 40 && chips.length < 16; k++) {
      var X = (r() - 0.5) * 9000, Z = -900 + r() * 6500, S = 90 + r() * 90, okc = freeQ(X, Z, S + 120);
      chips.forEach(function (c) { if (Math.abs(c.X - X) < c.S + S + 260 && Math.abs(c.Z - Z) < c.S + S + 260) okc = false; });
      if (!okc) continue;
      var c = { X: X, Z: Z, S: S }; chips.push(c);
      var np = 3 + Math.floor(r() * 4);
      for (side = 0; side < 4; side++) for (var m = 0; m < np; m++) {
        var o = (m / (np - 1) * 2 - 1) * S * 0.75, l = 90 + r() * 260, p0, p1;
        if (side === 0) { p0 = [X + S, Z + o]; p1 = [X + S + l, Z + o]; } else if (side === 1) { p0 = [X - S, Z + o]; p1 = [X - S - l, Z + o]; }
        else if (side === 2) { p0 = [X + o, Z + S]; p1 = [X + o, Z + S + l]; } else { p0 = [X + o, Z - S]; p1 = [X + o, Z - S - l]; }
        traces.push({ w: 7, pts: [p0, p1] });
      }
    }
    // Bus de pistes parallèles dans les zones libres
    for (k = 0; k < 14; k++) {
      var bx = (r() - 0.5) * 9000, bz = -1000 + r() * 6500, horiz = r() < 0.5, nb = 5 + Math.floor(r() * 5), bl = 500 + r() * 1500, dg = (r() < 0.5 ? -1 : 1) * (150 + r() * 300);
      if (!freeQ(bx, bz, 300) || !freeQ(bx + (horiz ? bl : dg), bz + (horiz ? dg : bl), 300)) continue;
      for (m = 0; m < nb; m++) {
        var off = m * 34, pts;
        if (horiz) pts = [[bx, bz + off], [bx + bl * 0.4 + off * 0.41 * Math.sign(dg), bz + off], [bx + bl * 0.4 + Math.abs(dg) + off * 0.41 * Math.sign(dg), bz + off + dg], [bx + bl, bz + off + dg]];
        else pts = [[bx + off, bz], [bx + off, bz + bl * 0.4 + off * 0.41 * Math.sign(dg)], [bx + off + dg, bz + bl * 0.4 + Math.abs(dg) + off * 0.41 * Math.sign(dg)], [bx + off + dg, bz + bl]];
        traces.push({ w: 7, pts: pts });
      }
    }
    var vias = [], smd = [];
    for (k = 0; k < 260; k++) { var vx = (r() - 0.5) * 9000, vz = -1200 + r() * 6800; if (freeQ(vx, vz, 60)) vias.push([vx, vz]); }
    for (k = 0; k < 4; k++) { var qx2 = k % 2 ? 1 : -1, qz2 = k < 2 ? 1 : -1, rot = r() < 0.5; for (var m2 = 0; m2 < 3; m2++) for (var n2 = 0; n2 < 2; n2++) if (r() < 0.85) smd.push([qx2 * (470 + (rot ? m2 : n2) * 95), CZ + qz2 * (470 + (rot ? n2 : m2) * 95), rot]); }
    // Impulsions lumineuses (position sur la piste)
    var pulses = [];
    for (k = 0; k < 30; k++) pulses.push({ tr: traces[Math.floor(r() * NP * 4)], t: 0.25 + r() * 0.7, c: r() < 0.25 ? [255, 196, 110] : [90, 220, 255] });

    function seg(o, a, b, wd, style) {
      var d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(d / 350));
      o.strokeStyle = style;
      for (var i = 0; i < n; i++) {
        var p = P(mix(a[0], b[0], i / n), mix(a[1], b[1], i / n)), q2 = P(mix(a[0], b[0], (i + 1) / n), mix(a[1], b[1], (i + 1) / n));
        o.lineWidth = wd * (p[3] + q2[3]) / 2; o.beginPath(); o.moveTo(p[0], p[1]); o.lineTo(q2[0], q2[1]); o.stroke();
      }
    }
    function ring(o, X, Z, rad, wd, style, fillHole) {
      var p = P(X, Z), sq = squash(X, Z); if (p[2] < 200) return;
      o.save(); o.translate(p[0], p[1]); o.scale(1, sq);
      if (fillHole) { o.fillStyle = fillHole; o.beginPath(); o.arc(0, 0, rad * p[3], 0, TAU); o.fill(); }
      o.strokeStyle = style; o.lineWidth = wd * p[3]; o.beginPath(); o.arc(0, 0, rad * p[3], 0, TAU); o.stroke(); o.restore();
    }
    function pathAt(tr, t) {
      var L = 0, i, ls = [];
      for (i = 1; i < tr.pts.length; i++) { var d = Math.hypot(tr.pts[i][0] - tr.pts[i - 1][0], tr.pts[i][1] - tr.pts[i - 1][1]); ls.push(d); L += d; }
      var want = t * L;
      for (i = 0; i < ls.length; i++) { if (want <= ls[i]) { var u = want / ls[i]; return [mix(tr.pts[i][0], tr.pts[i + 1][0], u), mix(tr.pts[i][1], tr.pts[i + 1][1], u)]; } want -= ls[i]; }
      return tr.pts[tr.pts.length - 1];
    }
    function drawBoard(o) {
      o.fillStyle = vgrad(o, 0, h, [[0, '#03060b'], [0.45, '#06101a'], [1, '#050b13']]); o.fillRect(0, 0, w, h);
      o.fillStyle = 'rgba(90,150,180,0.13)';
      for (var gz = -1500; gz < 6400; gz += 95) for (var gx = -5600; gx <= 5600; gx += 95) {
        var p = P(gx, gz); if (p[0] < -8 || p[0] > w + 8 || p[1] < -8 || p[1] > h + 8) continue;
        var s2 = 3.4 * p[3]; o.fillRect(p[0] - s2 / 2, p[1] - s2 * 0.3, s2, s2 * 0.6);
      }
      o.lineCap = 'round'; o.lineJoin = 'round';
      traces.forEach(function (tr) {
        for (var i = 1; i < tr.pts.length; i++) seg(o, tr.pts[i - 1], tr.pts[i], tr.w, 'rgba(34,96,122,0.9)');
        for (i = 1; i < tr.pts.length; i++) seg(o, tr.pts[i - 1], tr.pts[i], tr.w * 0.3, 'rgba(120,205,235,0.32)');
        var e = tr.pts[tr.pts.length - 1]; ring(o, e[0], e[1], tr.w * 1.9, tr.w * 0.7, 'rgba(60,140,170,0.95)', '#02050a');
      });
      vias.forEach(function (v) { ring(o, v[0], v[1], 13, 5, 'rgba(60,125,150,0.7)', '#02050a'); });
      chips.forEach(function (c) {
        var tp = [[c.X - c.S, c.Z - c.S], [c.X + c.S, c.Z - c.S], [c.X + c.S, c.Z + c.S], [c.X - c.S, c.Z + c.S]].map(function (q2) { return P(q2[0], q2[1], 30); });
        o.fillStyle = '#0b1119'; o.beginPath(); o.moveTo(tp[0][0], tp[0][1]); for (var i = 1; i < 4; i++) o.lineTo(tp[i][0], tp[i][1]); o.closePath(); o.fill();
        o.strokeStyle = 'rgba(110,170,200,0.35)'; o.lineWidth = 3 * tp[0][3]; o.stroke();
      });
      smd.forEach(function (c) {
        var a = c[2] ? 30 : 15, b = c[2] ? 15 : 30;
        [[a, b, '#141820'], [a, b * (c[2] ? 1 : 0.28), '#8d97a3'], [a * (c[2] ? 0.28 : 1), b, '#8d97a3']].forEach(function (pt, pi) {
          if (pi === 1 && c[2]) return; if (pi === 2 && !c[2]) return;
          [-1, 1].forEach(function (sd) {
            var ox = pi === 2 ? sd * (a - pt[0]) : 0, oz = pi === 1 ? sd * (b - pt[1]) : 0;
            if (pi === 0 && sd > 0) return;
            var tp = [[c[0] + ox - pt[0], c[1] + oz - pt[1]], [c[0] + ox + pt[0], c[1] + oz - pt[1]], [c[0] + ox + pt[0], c[1] + oz + pt[1]], [c[0] + ox - pt[0], c[1] + oz + pt[1]]].map(function (q2) { return P(q2[0], q2[1], 12); });
            o.fillStyle = pt[2]; o.beginPath(); o.moveTo(tp[0][0], tp[0][1]); for (var i = 1; i < 4; i++) o.lineTo(tp[i][0], tp[i][1]); o.closePath(); o.fill();
          });
        });
      });
      // Impulsions (traînée + tête)
      o.save(); o.globalCompositeOperation = 'lighter';
      pulses.forEach(function (pu) {
        for (var i = 0; i < 14; i++) {
          var a = pathAt(pu.tr, pu.t - (i + 1) * 0.012), b = pathAt(pu.tr, pu.t - i * 0.012);
          seg(o, a, b, 9, rgba(lerpC(pu.c, [255, 255, 255], i < 2 ? 0.5 : 0), 0.85 * (1 - i / 14)));
        }
        var hp = pathAt(pu.tr, pu.t), p = P(hp[0], hp[1]);
        glow(o, p[0], p[1], 150 * p[3], pu.c, 0.8); dot(o, p[0], p[1], 7 * p[3], '#ffffff');
      });
      o.restore();
    }
    drawBoard(x);
    // Effet maquette : le lointain et le premier plan sont flous
    var Df = layer(w, h, 5);
    drawBoard(Df.o); soften(Df, 1);
    Df.o.globalCompositeOperation = 'destination-in';
    Df.o.fillStyle = vgrad(Df.o, 0, h, [[0, 'rgba(0,0,0,1)'], [0.3, 'rgba(0,0,0,0)'], [0.72, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.85)']]);
    Df.o.fillRect(0, 0, w, h);
    blit(x, Df, w, h);
    // Lumière de la puce sur la carte
    var cc = P(0, CZ), sq = squash(0, CZ);
    x.save(); x.globalCompositeOperation = 'lighter'; x.translate(cc[0], cc[1]); x.scale(1, sq);
    glow(x, 0, 0, 1900 * cc[3], [40, 140, 255], 0.38, SOFT); glow(x, 0, 0, 760 * cc[3], [90, 210, 255], 0.55, SOFT);
    x.restore();
    // La puce : face avant, dessus métallique, fenêtre de cœurs lumineux
    var Hc = 70, T = [[-CH, CZ - CH], [CH, CZ - CH], [CH, CZ + CH], [-CH, CZ + CH]];
    function face(pts, style) { x.fillStyle = style; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]); x.closePath(); x.fill(); }
    var top = T.map(function (q2) { return P(q2[0], q2[1], Hc); }), base = T.map(function (q2) { return P(q2[0], q2[1], 0); });
    // broches visibles sur la face avant
    for (k = 0; k < NP; k++) {
      var bxp = (k / (NP - 1) * 2 - 1) * 290, a = P(bxp - 9, CZ - CH, 26), b2 = P(bxp + 9, CZ - CH - 50, 0);
      x.fillStyle = 'rgba(190,200,210,0.85)'; x.fillRect(a[0], a[1], b2[0] - a[0], b2[1] - a[1]);
    }
    face([base[0], base[1], top[1], top[0]], vgrad(x, top[0][1], base[0][1], [[0, '#1b2533'], [1, '#080c12']]));
    var tg = x.createLinearGradient(top[3][0], top[3][1], top[1][0], top[1][1]);
    tg.addColorStop(0, '#2a3546'); tg.addColorStop(0.45, '#121a26'); tg.addColorStop(0.62, '#1d2838'); tg.addColorStop(1, '#0c121b');
    face(top, tg);
    var ins = function (m, y) { return [[-CH + m, CZ - CH + m], [CH - m, CZ - CH + m], [CH - m, CZ + CH - m], [-CH + m, CZ + CH - m]].map(function (q2) { return P(q2[0], q2[1], y); }); };
    var hs = ins(40, Hc + 2), hsg = x.createLinearGradient(hs[3][0], hs[3][1], hs[1][0], hs[1][1]);
    hsg.addColorStop(0, '#3a4658'); hsg.addColorStop(0.5, '#1a2230'); hsg.addColorStop(1, '#2b3546');
    face(hs, hsg);
    x.strokeStyle = 'rgba(200,225,255,0.35)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(hs[3][0], hs[3][1]); x.lineTo(hs[0][0], hs[0][1]); x.lineTo(hs[1][0], hs[1][1]); x.stroke();
    var win = ins(105, Hc + 3); face(win, '#050a12');
    x.save(); x.globalCompositeOperation = 'lighter';
    var NC = 7, cell = (2 * (CH - 105)) / NC;
    for (var ix = 0; ix < NC; ix++) for (var iz = 0; iz < NC; iz++) {
      var x0 = -CH + 105 + ix * cell + 6, z0 = CZ - CH + 105 + iz * cell + 6, br = 0.25 + Math.pow(r(), 2) * 0.75;
      var cq = [[x0, z0], [x0 + cell - 12, z0], [x0 + cell - 12, z0 + cell - 12], [x0, z0 + cell - 12]].map(function (q2) { return P(q2[0], q2[1], Hc + 4); });
      face(cq, rgba(lerpC([30, 140, 255], [170, 240, 255], br), 0.25 + 0.6 * br));
    }
    var cc2 = P(0, CZ, Hc);
    glow(x, cc2[0], cc2[1], 700 * cc2[3], [80, 200, 255], 0.6); glow(x, cc2[0], cc2[1], 240 * cc2[3], [200, 240, 255], 0.5);
    x.strokeStyle = 'rgba(120,220,255,0.75)'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(top[0][0], top[0][1]); for (k = 1; k < 4; k++) x.lineTo(top[k][0], top[k][1]); x.closePath(); x.stroke();
    x.lineWidth = 10; x.strokeStyle = 'rgba(80,190,255,0.12)'; x.stroke();
    x.restore();
    // Brume lointaine, vignettage, grain
    x.fillStyle = vgrad(x, 0, h * 0.5, [[0, 'rgba(6,14,28,0.9)'], [0.6, 'rgba(6,14,28,0.25)'], [1, 'rgba(6,14,28,0)']]); x.fillRect(0, 0, w, h * 0.5);
    x.save(); x.globalCompositeOperation = 'lighter';
    glow(x, w * 0.5, h * 0.1, w * 0.5, [20, 60, 120], 0.35, SOFT);
    x.restore();
    vignette(x, w, h, 0.6);
    grain(x, w, h, r, 0.045);
  }
  // ---- scène: horizon-holo
  // Horizon holographique : relief filaire en perspective, vallée de données, faisceau à l'horizon.
  function horizonHolo(x, w, h, r) {
    var hz = h * 0.54, n = makeNoise(r), cx = w * 0.5, f = 1150, camH = 230;
    x.fillStyle = vgrad(x, 0, hz, [[0, '#02030b'], [0.45, '#050925'], [0.8, '#120f46'], [1, '#2a165e']]); x.fillRect(0, 0, w, hz + 2);
    x.fillStyle = '#03040c'; x.fillRect(0, hz, w, h - hz);
    starfield(x, w, 0, hz * 0.8, 1000, r, 8);
    x.save(); x.globalCompositeOperation = 'lighter'; x.translate(cx, hz); x.scale(1, 0.3);
    glow(x, 0, 0, w * 0.8, [140, 46, 200], 0.55, SOFT); glow(x, 0, 0, w * 0.42, [50, 160, 255], 0.5, SOFT); glow(x, 0, 0, w * 0.13, [210, 232, 255], 0.65, SOFT);
    x.restore();
    // Relief : grille régulière, vallée plate au centre, montagnes fractales sur les côtés
    var NX = 111, NZ = 84, X0 = -6600, DX = 120, Z0 = 140, DZ = 108, rows = [], i, j;
    function H(X, Z) {
      var v = smooth(420, 2100, Math.abs(X)), m = fbm(n, X * 0.00042 + 3, Z * 0.00042, 5);
      return v * Math.max(0, 240 + m * 1500) * (0.35 + 0.65 * smooth(500, 3200, Z));
    }
    for (j = 0; j < NZ; j++) {
      var Z = Z0 + j * DZ, row = [];
      for (i = 0; i < NX; i++) { var X = X0 + i * DX, Y = H(X, Z); row.push([cx + f * X / Z, hz + f * (camH - Y) / Z]); }
      rows.push(row);
    }
    var Bl = layer(w, h, 4), lg = x.createLinearGradient(0, 0, w, 0);
    lg.addColorStop(0, 'rgb(180,90,255)'); lg.addColorStop(0.32, 'rgb(90,150,255)'); lg.addColorStop(0.5, 'rgb(90,225,255)'); lg.addColorStop(0.68, 'rgb(90,150,255)'); lg.addColorStop(1, 'rgb(180,90,255)');
    [x, Bl.o].forEach(function (o, oi) {
      o.lineJoin = 'round';
      for (j = NZ - 2; j >= 0; j--) {
        var A = rows[j + 1], B = rows[j], z = Z0 + (j + 1) * DZ, fg = Math.exp(-z / 4200);
        o.fillStyle = oi ? '#000' : rgba(lerpC([22, 16, 62], [3, 4, 12], Math.min(1, fg * 1.6)), 1);
        o.beginPath(); o.moveTo(A[0][0], A[0][1]);
        for (i = 1; i < NX; i++) o.lineTo(A[i][0], A[i][1]);
        for (i = NX - 1; i >= 0; i--) o.lineTo(B[i][0], B[i][1]);
        o.closePath(); o.fill();
        o.globalAlpha = Math.min(1, 0.18 + 0.95 * fg); o.strokeStyle = lg; o.lineWidth = oi ? 5 : Math.max(0.7, Math.min(3, 330 / z));
        o.beginPath(); o.moveTo(A[0][0], A[0][1]);
        for (i = 1; i < NX; i++) o.lineTo(A[i][0], A[i][1]);
        for (i = 0; i < NX; i++) { o.moveTo(A[i][0], A[i][1]); o.lineTo(B[i][0], B[i][1]); }
        o.stroke(); o.globalAlpha = 1;
      }
    });
    soften(Bl, 2); blit(x, Bl, w, h, 'lighter', 0.8);
    x.save(); x.globalCompositeOperation = 'lighter';
    // Tours de données sur le fond de la vallée
    for (var k = 0; k < 170; k++) {
      var ti = Math.round((NX - 1) / 2 + (r() - 0.5) * 7), tj = 4 + Math.floor(Math.pow(r(), 0.7) * (NZ - 10)), p = rows[tj][ti], zt = Z0 + tj * DZ, s = f / zt;
      if (Math.abs(X0 + ti * DX) > 420) continue;
      var th = (60 + Math.pow(r(), 3) * 900) * s, c = r() < 0.2 ? [255, 190, 120] : [110, 220, 255], fa = Math.exp(-zt / 5000);
      var g = x.createLinearGradient(0, p[1], 0, p[1] - th); g.addColorStop(0, rgba(c, 0.9 * fa)); g.addColorStop(1, rgba(c, 0));
      x.fillStyle = g; x.fillRect(p[0] - 1.6 * s * 2, p[1] - th, 3.2 * s * 2, th);
      glow(x, p[0], p[1], 40 * s * 2, c, 0.6 * fa); dot(x, p[0], p[1], 2.2 * s * 2, rgba([235, 250, 255], fa));
    }
    // Faisceau vertical à l'horizon et reflet sur le sol
    var bg = x.createLinearGradient(0, hz, 0, 0); bg.addColorStop(0, 'rgba(200,235,255,0.95)'); bg.addColorStop(0.5, 'rgba(120,200,255,0.25)'); bg.addColorStop(1, 'rgba(120,200,255,0)');
    x.fillStyle = bg; x.fillRect(cx - 3, 0, 6, hz);
    x.globalAlpha = 0.16; x.fillRect(cx - 40, 0, 80, hz); x.globalAlpha = 0.06; x.fillRect(cx - 160, 0, 320, hz); x.globalAlpha = 1;
    glow(x, cx, hz, 300, [200, 235, 255], 0.9);
    var hs = x.createLinearGradient(0, 0, w, 0); hs.addColorStop(0, 'rgba(120,170,255,0)'); hs.addColorStop(0.5, 'rgba(210,235,255,0.8)'); hs.addColorStop(1, 'rgba(120,170,255,0)');
    x.fillStyle = hs; x.fillRect(0, hz - 1.5, w, 3);
    x.translate(cx, hz + 40); x.scale(1, 0.22); glow(x, 0, 0, w * 0.32, [90, 140, 255], 0.35, SOFT);
    x.restore();
    // Particules flottantes
    for (k = 0; k < 160; k++) { var px = r() * w, py = h * (0.15 + r() * 0.7), ps = 1 + r() * 2.2; x.fillStyle = rgba([170, 210, 255], 0.2 + r() * 0.5); x.fillRect(px, py, ps, ps); }
    vignette(x, w, h, 0.6);
    grain(x, w, h, r, 0.05);
  }
  // ---- scène: coeur-quantique
  // Cœur quantique : noyau d'énergie, orbites de particules inclinées, filaments de plasma, reflets d'objectif.
  function coeurQuantique(x, w, h, r) {
    fill(x, '#020209', w, h);
    var cx = w * 0.5, cy = h * 0.5, n = makeNoise(r), f = 2300, Z0 = 2300;
    x.globalCompositeOperation = 'lighter';
    glow(x, cx, cy, w * 0.62, [46, 18, 104], 0.75, SOFT);
    glow(x, cx, cy, w * 0.32, [0, 64, 120], 0.55, SOFT);
    x.globalCompositeOperation = 'source-over';
    starfield(x, w, 0, h, 600, r, 6);
    function P(v) { var zz = v[2] + Z0; return [cx + f * v[0] / zz, cy - f * v[1] / zz, zz, f / zz]; }
    var Ne = layer(w, h, 6), Bl = layer(w, h, 5);
    Ne.o.globalCompositeOperation = Bl.o.globalCompositeOperation = 'lighter';
    x.save(); x.globalCompositeOperation = 'lighter'; x.lineCap = 'round';
    // Sphère filaire très discrète (champ)
    var SR = 980;
    for (var la = -60; la <= 60; la += 30) {
      x.beginPath();
      for (var lo = 0; lo <= 360; lo += 6) {
        var v = [SR * Math.cos(la * DEG) * Math.cos(lo * DEG), SR * Math.sin(la * DEG), SR * Math.cos(la * DEG) * Math.sin(lo * DEG)], p = P(v);
        if (lo) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]);
      }
      x.strokeStyle = 'rgba(120,150,255,0.06)'; x.lineWidth = 1.4; x.stroke();
    }
    for (lo = 0; lo < 180; lo += 30) {
      x.beginPath();
      for (la = 0; la <= 360; la += 6) {
        var v2 = [SR * Math.cos(la * DEG) * Math.cos(lo * DEG), SR * Math.sin(la * DEG), SR * Math.cos(la * DEG) * Math.sin(lo * DEG)], p2 = P(v2);
        if (la) x.lineTo(p2[0], p2[1]); else x.moveTo(p2[0], p2[1]);
      }
      x.strokeStyle = 'rgba(120,150,255,0.05)'; x.stroke();
    }
    // Orbites : anneaux de particules inclinés en 3D
    var PAL = [[90, 220, 255], [150, 120, 255], [255, 140, 220], [120, 255, 230]], k, i;
    for (k = 0; k < 6; k++) {
      var ra = r() * Math.PI, rb = 0.25 + r() * 1.1, rad = 330 + k * 105 + r() * 50, col = PAL[k % 4], th = 6 + r() * 26;
      var ca = Math.cos(ra), sa = Math.sin(ra), cb = Math.cos(rb), sb = Math.sin(rb);
      var RP = function (t, dr, dy) {
        var X = Math.cos(t) * (rad + dr), Z = Math.sin(t) * (rad + dr), Y = dy, Y1 = Y * cb - Z * sb, Z1 = Y * sb + Z * cb;
        return [X * ca - Y1 * sa, X * sa + Y1 * ca, Z1];
      };
      // fil de l'orbite
      for (i = 0; i < 160; i++) {
        var a = P(RP(i / 160 * TAU, 0, 0)), b = P(RP((i + 1) / 160 * TAU, 0, 0)), front = a[2] < Z0;
        x.strokeStyle = rgba(col, front ? 0.32 : 0.1); x.lineWidth = 1.5 * a[3];
        x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke();
      }
      // nuage de particules
      for (i = 0; i < 700; i++) {
        var gr = (r() + r() + r() - 1.5) * th, pv = P(RP(r() * TAU, gr, (r() + r() - 1) * th * 0.5)), al = (0.18 + r() * 0.6) * (pv[2] < Z0 ? 1 : 0.45);
        var dc = Math.hypot(pv[0] - cx, pv[1] - cy); if (pv[2] > Z0 && dc < 120) continue;
        x.fillStyle = rgba(lerpC(col, [255, 255, 255], r() * 0.5), al); var ss = (0.8 + r() * 1.8) * pv[3]; x.fillRect(pv[0], pv[1], ss, ss);
      }
      // électrons et leur traînée
      for (var e = 0; e < 2; e++) {
        var t0 = r() * TAU, dir = 1;
        for (i = 0; i < 26; i++) {
          var e1 = P(RP(t0 - dir * i * 0.02, 0, 0)), e2 = P(RP(t0 - dir * (i + 1) * 0.02, 0, 0));
          x.strokeStyle = rgba(lerpC(col, [255, 255, 255], 0.5), 0.9 * (1 - i / 26)); x.lineWidth = 3.5 * e1[3] * (1 - i / 30);
          x.beginPath(); x.moveTo(e1[0], e1[1]); x.lineTo(e2[0], e2[1]); x.stroke();
        }
        var ep = P(RP(t0, 0, 0)); glow(x, ep[0], ep[1], 70 * ep[3], col, 0.85); dot(x, ep[0], ep[1], 3.6 * ep[3], '#ffffff');
        glow(Bl.o, ep[0], ep[1], 160 * ep[3], col, 0.5);
      }
    }
    // Filaments de plasma autour du noyau
    for (k = 0; k < 46; k++) {
      var ang = r() * TAU, px = cx + Math.cos(ang) * 60, py = cy + Math.sin(ang) * 60, len = 18 + Math.floor(r() * 40), fc = r() < 0.5 ? [120, 220, 255] : [190, 140, 255], so = r() * 50;
      x.beginPath(); x.moveTo(px, py);
      for (i = 0; i < len; i++) { ang += n(so + i * 0.08, k * 3.1) * 0.5; px += Math.cos(ang) * 11; py += Math.sin(ang) * 11; x.lineTo(px, py); }
      x.strokeStyle = rgba(fc, 0.16 + r() * 0.25); x.lineWidth = 1.3; x.stroke();
    }
    // Noyau : halos superposés et coquille d'énergie
    glow(x, cx, cy, h * 0.75, [120, 70, 255], 0.35, SOFT);
    glow(x, cx, cy, h * 0.34, [60, 170, 255], 0.55);
    glow(x, cx, cy, h * 0.13, [170, 230, 255], 0.9);
    var sh = x.createRadialGradient(cx, cy, h * 0.05, cx, cy, h * 0.085);
    sh.addColorStop(0, 'rgba(160,220,255,0)'); sh.addColorStop(0.75, 'rgba(170,225,255,0.35)'); sh.addColorStop(1, 'rgba(170,225,255,0)');
    x.fillStyle = sh; x.fillRect(cx - h * 0.09, cy - h * 0.09, h * 0.18, h * 0.18);
    dot(x, cx, cy, h * 0.028, 'rgba(255,255,255,0.95)');
    glow(Bl.o, cx, cy, h * 0.4, [120, 200, 255], 0.6);
    // Reflets d'objectif : traînée horizontale et fantômes sur la diagonale
    var hs = x.createLinearGradient(0, 0, w, 0); hs.addColorStop(0, 'rgba(80,150,255,0)'); hs.addColorStop(0.5, 'rgba(190,230,255,0.85)'); hs.addColorStop(1, 'rgba(80,150,255,0)');
    x.fillStyle = hs; x.fillRect(0, cy - 2, w, 4); x.globalAlpha = 0.12; x.fillRect(0, cy - 22, w, 44); x.globalAlpha = 1;
    var gdx = w * 0.62 - cx, gdy = h * 0.82 - cy;
    [[0.6, 50, [120, 180, 255], 0.08], [1.1, 120, [200, 120, 255], 0.05], [1.6, 34, [120, 255, 220], 0.09], [2.1, 200, [90, 140, 255], 0.035]].forEach(function (gh) {
      glow(x, cx + gdx * gh[0], cy + gdy * gh[0], gh[1], gh[2], gh[3], BOKEH);
    });
    x.restore();
    // Bokeh de premier plan
    for (k = 0; k < 70; k++) {
      var bx = r() * w, by = r() * h, br = 18 + Math.pow(r(), 2) * 90, d = Math.hypot(bx - cx, by - cy) / w;
      glow(Ne.o, bx, by, br, PAL[Math.floor(r() * 4)], (0.05 + r() * 0.12) * Math.min(1, d * 2.5), BOKEH);
    }
    soften(Ne, 1); soften(Bl, 2);
    blit(x, Bl, w, h, 'lighter'); blit(x, Ne, w, h, 'lighter');
    vignette(x, w, h, 0.62);
    grain(x, w, h, r, 0.05);
  }
  // ---- scène: constellation
  // Constellation de données : nappe de points reliés (maillage 3D ondulant), lumière rasante, profondeur de champ.
  function constellation(x, w, h, r) {
    fill(x, vgrad(x, 0, h, [[0, '#02040f'], [0.55, '#060a26'], [1, '#0c0a2c']]), w, h);
    x.globalCompositeOperation = 'lighter';
    glow(x, w * 0.2, h * 0.2, w * 0.5, [0, 70, 130], 0.45, SOFT);
    glow(x, w * 0.85, h * 0.75, w * 0.5, [110, 28, 130], 0.45, SOFT);
    glow(x, w * 0.55, h * 0.45, w * 0.4, [40, 50, 160], 0.4, SOFT);
    x.globalCompositeOperation = 'source-over';
    starfield(x, w, 0, h * 0.6, 700, r, 6);
    var n = makeNoise(r), f = 1250, cx = w * 0.5, cy = h * 0.3, NX = 66, NZ = 30, DX = 150, DZ = 160, Zs = 330;
    var ph1 = r() * TAU, ph2 = r() * TAU, G = [], i, j;
    for (j = 0; j < NZ; j++) for (i = 0; i < NX; i++) {
      var X = (i - (NX - 1) / 2) * DX + (r() - 0.5) * DX * 0.6, Z = Zs + j * DZ + (r() - 0.5) * DZ * 0.6;
      var Y = -400 + 230 * Math.sin(X * 0.0013 + Z * 0.0009 + ph1) + 140 * Math.sin(Z * 0.0021 - X * 0.0006 + ph2) + 110 * n(X * 0.001, Z * 0.001);
      G.push({ X: X, Y: Y, Z: Z, x: cx + f * X / Z, y: cy - f * Y / Z, s: f / Z, b: r() });
    }
    function at(i2, j2) { return G[j2 * NX + i2]; }
    function vis(p) { return p.x > -200 && p.x < w + 200 && p.y > -200 && p.y < h + 200; }
    function fog(z) { return Math.min(1, Math.exp(-(z - 900) / 2300)); }
    function colAt(sx) { var t = clamp01(sx / w); return t < 0.5 ? lerpC([70, 210, 255], [110, 130, 255], t * 2) : lerpC([110, 130, 255], [220, 110, 255], t * 2 - 1); }
    var Ne = layer(w, h, 6), Fa = layer(w, h, 2.6);
    [x, Ne.o, Fa.o].forEach(function (o) { o.globalCompositeOperation = 'lighter'; o.lineJoin = 'round'; });
    function ctxFor(z) { return z < 820 ? Ne.o : z > 4000 ? Fa.o : x; }
    var L = [0.5, 0.75, -0.42], ll = Math.hypot(L[0], L[1], L[2]);
    for (j = NZ - 2; j >= 0; j--) {
      var zr = Zs + j * DZ, o = ctxFor(zr), fg = fog(zr), lw = Math.max(0.8, 1.6 * f / zr / 2.4);
      // facettes
      for (i = 0; i < NX - 1; i++) {
        var a = at(i, j), b = at(i + 1, j), c = at(i, j + 1), d = at(i + 1, j + 1);
        if (!vis(a) && !vis(d)) continue;
        [[a, b, c], [b, d, c]].forEach(function (t) {
          var ux = t[1].X - t[0].X, uy = t[1].Y - t[0].Y, uz = t[1].Z - t[0].Z, vx = t[2].X - t[0].X, vy = t[2].Y - t[0].Y, vz = t[2].Z - t[0].Z;
          var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.hypot(nx, ny, nz) || 1;
          if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; }
          var li = Math.max(0, (nx * L[0] + ny * L[1] + nz * L[2]) / (nl * ll)), sp = Math.pow(li, 12);
          o.fillStyle = rgba(lerpC(colAt(t[0].x), [255, 255, 255], sp * 0.6), (0.015 + 0.09 * li * li + 0.12 * sp) * fg);
          o.beginPath(); o.moveTo(t[0].x, t[0].y); o.lineTo(t[1].x, t[1].y); o.lineTo(t[2].x, t[2].y); o.closePath(); o.fill();
        });
      }
      // arêtes de la rangée
      var lg = o.createLinearGradient(0, 0, w, 0); lg.addColorStop(0, rgba([70, 210, 255], 1)); lg.addColorStop(0.5, rgba([110, 130, 255], 1)); lg.addColorStop(1, rgba([220, 110, 255], 1));
      o.strokeStyle = lg; o.globalAlpha = 0.3 * fg; o.lineWidth = o === Ne.o ? lw * 2.2 : lw;
      o.beginPath();
      for (i = 0; i < NX - 1; i++) {
        var p0 = at(i, j), p1 = at(i + 1, j), p2 = at(i, j + 1), p3 = at(i + 1, j + 1);
        if (!vis(p0) && !vis(p3)) continue;
        o.moveTo(p0.x, p0.y); o.lineTo(p1.x, p1.y); o.moveTo(p0.x, p0.y); o.lineTo(p2.x, p2.y); o.moveTo(p1.x, p1.y); o.lineTo(p2.x, p2.y);
      }
      o.stroke(); o.globalAlpha = 1;
    }
    // Nœuds : petits points, quelques étoiles brillantes reliées
    G.forEach(function (p) {
      if (!vis(p)) return;
      var o = ctxFor(p.Z), fg = fog(p.Z), c = colAt(p.x);
      if (o === Ne.o) { if (p.b > 0.75) glow(o, p.x, p.y, 16 * p.s, lerpC(c, [255, 255, 255], 0.4), 0.5, BOKEH); return; }
      if (p.b > 0.93) { glow(o, p.x, p.y, 80 * p.s, c, 0.65 * fg); dot(o, p.x, p.y, 4.2 * p.s, rgba([255, 255, 255], fg)); o.strokeStyle = rgba(c, 0.5 * fg); o.lineWidth = 1.4 * p.s; o.beginPath(); o.arc(p.x, p.y, 12 * p.s, 0, TAU); o.stroke(); }
      else { glow(o, p.x, p.y, 20 * p.s, c, 0.35 * fg); dot(o, p.x, p.y, 2.2 * p.s, rgba(lerpC(c, [255, 255, 255], 0.6), 0.9 * fg)); }
    });
    // Constellations dans le ciel
    for (var k = 0; k < 5; k++) {
      var sx = w * (0.08 + r() * 0.84), sy = h * (0.06 + r() * 0.26), pts = [[sx, sy]];
      for (i = 0; i < 3 + Math.floor(r() * 3); i++) { sx += (r() - 0.3) * 160; sy += (r() - 0.5) * 110; pts.push([sx, sy]); }
      x.strokeStyle = 'rgba(150,190,255,0.22)'; x.lineWidth = 1.2; x.beginPath(); pts.forEach(function (p, q) { if (q) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]); }); x.stroke();
      pts.forEach(function (p) { glow(x, p[0], p[1], 26, [170, 210, 255], 0.5); dot(x, p[0], p[1], 2.2, '#eef6ff'); });
    }
    x.globalCompositeOperation = 'source-over';
    soften(Ne, 2); soften(Fa, 1);
    blit(x, Fa, w, h, 'lighter'); blit(x, Ne, w, h, 'lighter');
    vignette(x, w, h, 0.6);
    grain(x, w, h, r, 0.05);
  }
  // ---- scène: lac-miroir
  // Lac miroir : sommets enneigés à l'heure rose, reflet sur un lac immobile, brume légère au ras de l'eau.
  function lacMiroir(x, w, h, r) {
    var n = makeNoise(r), W = 1600, H = 900, hzL = H * 0.5, f = W * 0.95, camH = 24, z0 = 2600;
    var yS = (hzL + camH * f / z0) * h / H, mx = (r() - 0.5) * 9000, mx2 = mx + (r() < 0.5 ? -1 : 1) * (9000 + r() * 6000);
    var L = [-0.8, 0.34, -0.32], ll = Math.hypot(L[0], L[1], L[2]); L = [L[0] / ll, L[1] / ll, L[2] / ll];
    function height(X, Z) {
      var m = smooth(10000, 19000, Z), env = 0.35 + 0.85 * Math.exp(-Math.pow((X - mx) / 9000, 2)) + 0.45 * Math.exp(-Math.pow((X - mx2) / 7000, 2));
      var hm = m > 0 ? ridged(n, X * 0.00011 + 11, Z * 0.00011, Z > 26000 ? 4 : 5) * 4800 * m * env : 0;
      var hills = (fbm(n, X * 0.0007 + 40, Z * 0.0007, 4) * 0.5 + 0.5) * 120 * smooth(z0, 6000, Z);
      var trees = Z < 9000 ? (n(X * 0.03, Z * 0.03) * 0.5 + 0.5) * 14 : 0;
      return Math.max(0, hm + hills + trees - 40);
    }
    var SUN = [1.0, 0.66, 0.5], SKY = [0.22, 0.29, 0.52], HAZE = [150, 140, 182];
    function shade(X, Z, hh, gx, gz, c) {
      var dt = Z > 9000 && Z < 30000 ? 0.35 * (1 - Z / 30000) : 0, nx = -gx + dt * n(X * 0.012, Z * 0.012), ny = 1, nz = -gz + dt * n(X * 0.012 + 50, Z * 0.012), nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
      var df = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
      var sl = 2000 + n(X * 0.0005, Z * 0.0005) * 300, snow = smooth(sl - 160, sl + 160, hh) * smooth(0.45, 0.6, ny);
      var forest = (1 - smooth(300, 700, hh)) * smooth(0.4, 0.7, ny);
      var tex = 0.85 + 0.3 * n(X * 0.004, Z * 0.004), ar = mix(mix(0.32 * tex, 0.04, forest), 0.95, snow), ag = mix(mix(0.27 * tex, 0.08, forest), 0.95, snow), ab = mix(mix(0.27 * tex, 0.08, forest), 1, snow);
      var amb = 0.4 + 0.45 * ny, R = ar * (SUN[0] * df * 2.1 + SKY[0] * amb), G = ag * (SUN[1] * df * 2.1 + SKY[1] * amb), B = ab * (SUN[2] * df * 2.1 + SKY[2] * amb);
      var fz = 1 - Math.exp(-(Z - z0) / 42000);
      c[0] = mix(Math.min(255, R * 255), HAZE[0], fz); c[1] = mix(Math.min(255, G * 255), HAZE[1], fz); c[2] = mix(Math.min(255, B * 255), HAZE[2], fz);
    }
    var T = relief(W, H, { hz: hzL, f: f, camH: camH, camX: 0, bands: [[z0, 100], [10000, 620], [42000, 70], [90000, 0]], height: height, shade: shade });
    soften({ c: T, o: T.getContext('2d') }, 1);
    // Ciel (dessiné deux fois : à l'endroit et dans le reflet) : dégradé, voiles de nuages, étoiles, croissant de lune
    var CW = 400, CH = Math.round(CW * yS / w), cl = field(CW, CH, function (d) {
      for (var j = 0; j < CH; j++) for (var i = 0; i < CW; i++) {
        var u = i / CW * w, v = j / CH * yS, t = v / yS;
        var dn = fbm(n, u * 0.0011 + 70, v * 0.006 + n(u * 0.0006, v * 0.002) * 1.4, 5) + 0.12 - 0.35 * Math.abs(t - 0.45);
        var a = smooth(0.02, 0.4, dn) * 0.75, q = (j * CW + i) * 4, cc = lerpC([150, 130, 200], [255, 175, 165], smooth(0.2, 0.85, t));
        d[q] = cc[0]; d[q + 1] = cc[1]; d[q + 2] = cc[2]; d[q + 3] = a * 255;
      }
    });
    var stars = [], moon = [w * (0.62 + r() * 0.25), h * (0.1 + r() * 0.08)];
    for (var k = 0; k < 160; k++) stars.push([r() * w, Math.pow(r(), 1.6) * h * 0.25, 0.8 + r() * 1.6, 0.2 + r() * 0.6]);
    function sky(o) {
      o.fillStyle = vgrad(o, 0, yS, [[0, '#121a3e'], [0.4, '#343b74'], [0.72, '#96769a'], [0.93, '#e3ad9a'], [1, '#efc0a8']]); o.fillRect(0, 0, w, yS + 2);
      stars.forEach(function (s) { o.fillStyle = rgba([255, 255, 255], s[3] * 0.6); o.fillRect(s[0], s[1], s[2], s[2]); });
      o.save(); o.imageSmoothingQuality = 'high'; o.globalAlpha = 0.85; o.drawImage(cl, 0, 0, w, yS); o.globalAlpha = 1;
      o.globalCompositeOperation = 'lighter';
      glow(o, moon[0], moon[1], 160, [255, 236, 210], 0.35);
      o.globalCompositeOperation = 'source-over';
      o.save(); o.beginPath(); o.arc(moon[0], moon[1], 22, 0, TAU); o.clip();
      o.beginPath(); o.arc(moon[0], moon[1], 22, 0, TAU); o.arc(moon[0] + 9, moon[1] - 5, 21, 0, TAU); o.fillStyle = 'rgba(255,246,228,0.95)'; o.fill('evenodd'); o.restore();
      o.globalCompositeOperation = 'lighter';
      o.translate(w * 0.3, yS); o.scale(1, 0.25); glow(o, 0, 0, w * 0.6, [255, 180, 150], 0.32, SOFT);
      o.restore();
    }
    sky(x);
    x.save(); x.imageSmoothingQuality = 'high'; x.drawImage(T, 0, 0, w, h); x.restore();
    // Reflet : ciel et relief renversés autour de la rive, légèrement adoucis
    var Rf = layer(w, h, 2.4);
    Rf.o.save(); Rf.o.translate(0, 2 * yS); Rf.o.scale(1, -1); sky(Rf.o); Rf.o.imageSmoothingQuality = 'high'; Rf.o.drawImage(T, 0, 0, w, h); Rf.o.restore();
    x.save(); x.beginPath(); x.rect(0, yS, w, h - yS); x.clip(); blit(x, Rf, w, h);
    x.fillStyle = vgrad(x, yS, h, [[0, 'rgba(10,16,34,0.1)'], [0.5, 'rgba(10,16,34,0.35)'], [1, 'rgba(6,10,22,0.62)']]); x.fillRect(0, yS, w, h - yS);
    // Rides très fines
    for (k = 0; k < 340; k++) {
      var ry = yS + 4 + Math.pow(r(), 1.7) * (h - yS), d = (ry - yS) / (h - yS), rl = 30 + r() * 260 * (0.3 + d);
      x.fillStyle = r() < 0.6 ? rgba([255, 225, 220], 0.025 + 0.035 * d) : rgba([5, 10, 25], 0.08 + 0.1 * d);
      x.fillRect(r() * w - rl / 2, ry, rl, 1 + d * 2);
    }
    x.restore();
    // Brume au ras de l'eau et lisière sombre de la rive
    x.fillStyle = 'rgba(14,16,28,0.55)'; x.fillRect(0, yS - 1, w, 2.5);
    x.fillStyle = vgrad(x, yS - 110, yS + 60, [[0, 'rgba(225,190,205,0)'], [0.62, 'rgba(225,190,205,0.3)'], [1, 'rgba(225,190,205,0)']]); x.fillRect(0, yS - 110, w, 170);
    vignette(x, w, h, 0.45);
    grain(x, w, h, r, 0.05);
  }
  // ---- scène: dunes-dorees
  // Dunes dorées : mer de sable au soleil couchant, crêtes vives, ombres violettes et rides du vent.
  function dunesDorees(x, w, h, r) {
    var n = makeNoise(r), W = 1600, H = 900, hzL = H * 0.44, f = W * 1.0, camH = 520;
    var wa = 0.12 + r() * 0.25, cw = Math.cos(wa), sw = Math.sin(wa), rw = wa + 0.3, rc = Math.cos(rw), rs = Math.sin(rw);
    var sunX = w * (0.1 + r() * 0.08), sunY = hzL * h / H - h * 0.06;
    var L = [-0.85, 0.25, 0.45], ll = Math.hypot(L[0], L[1], L[2]); L = [L[0] / ll, L[1] / ll, L[2] / ll];
    // Profil d'une dune : pente douce au vent, crête vive (phase 0,72), face raide sous le vent.
    function phase(X, Z, per) { var ph = (X * cw + Z * sw + fbm(n, X * 0.00028, Z * 0.00028, 3) * 1700) / per; return ph - Math.floor(ph); }
    function prof(t) { if (t < 0.72) { var s = t / 0.72; return s * s * (1.7 - 0.7 * s); } var s2 = (t - 0.72) / 0.28; return (1 - s2) * (1 - s2); }
    function amp(X, Z) { return 230 + 150 * fbm(n, X * 0.00019 + 9, Z * 0.00019, 3); }
    function height(X, Z) {
      return prof(phase(X, Z, 2000)) * amp(X, Z) + prof(phase(X * 1.6 + 310, Z * 1.6 - 170, 2000)) * 40 + 300 * fbm(n, X * 0.00006 + 3, Z * 0.00006, 2);
    }
    // Ombre portée de la crête précédente (calcul direct sur le profil, sans lancer de rayon).
    var Lu = -(L[0] * cw + L[2] * sw), tanA = L[1] / Math.max(0.15, Math.abs(Lu));
    var HZ = [246, 186, 150];
    function shade(X, Z, hh, gx0, gz0, c) {
      // Pente analytique de la dune principale (crêtes nettes, sans artefacts), plus la houle lointaine.
      var t = phase(X, Z, 2000), A = amp(X, Z), dp = t < 0.72 ? (3.4 * (t / 0.72) - 2.1 * Math.pow(t / 0.72, 2)) / 0.72 : -2 * (1 - (t - 0.72) / 0.28) / 0.28;
      var su = dp * A / 2000, e = 60, sw0 = 300 * fbm(n, X * 0.00006 + 3, Z * 0.00006, 2);
      var gx = su * cw + (300 * fbm(n, (X + e) * 0.00006 + 3, Z * 0.00006, 2) - sw0) / e, gz = su * sw + (300 * fbm(n, X * 0.00006 + 3, (Z + e) * 0.00006, 2) - sw0) / e;
      var nx = -gx, ny = 1, nz = -gz;
      if (Z < 2200) { // rides du vent, seulement au premier plan
        var k = 1 - Z / 2200, ph = (X * rc + Z * rs) / 10 + n(X * 0.006, Z * 0.006) * 5, dr = Math.cos(ph) * 0.2 * k;
        nx += dr * rc; nz += dr * rs;
      }
      var nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
      var df = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
      var du = (t >= 0.72 ? t - 0.72 : t + 0.28) * 2000, ray = A - du * tanA, sh = Lu > 0 ? smooth(-14, 14, prof(t) * A - ray) : 1;
      df *= 0.06 + 0.94 * sh;
      var rim = t < 0.72 ? Math.pow(t / 0.72, 10) * sh : 0, amb = 0.75 + 0.25 * ny;
      var R = 255 * (1.05 * df * 1.4 + 0.2 * amb) + 90 * rim, G = 255 * (0.6 * df * 1.3 + 0.11 * amb) + 60 * rim, B = 255 * (0.25 * df * 1.15 + 0.17 * amb) + 30 * rim;
      var fz = 1 - Math.exp(-Z / 26000);
      c[0] = mix(Math.min(255, R), HZ[0], fz); c[1] = mix(Math.min(255, G), HZ[1], fz); c[2] = mix(Math.min(255, B), HZ[2], fz);
    }
    var T = relief(W, H, { hz: hzL, f: f, camH: camH, camX: 0, bands: [[300, 320], [3500, 380], [22000, 110], [90000, 0]], grad: true, height: height, shade: shade });
    // Ciel doré, soleil bas et voile de chaleur
    var yH = hzL * h / H;
    x.fillStyle = vgrad(x, 0, yH, [[0, '#2a3a68'], [0.38, '#6a5f86'], [0.7, '#d9937a'], [0.9, '#ffc68e'], [1, '#ffd9a6']]); x.fillRect(0, 0, w, h);
    x.save(); x.globalCompositeOperation = 'lighter';
    glow(x, sunX, sunY, w * 0.62, [255, 150, 80], 0.42, SOFT);
    glow(x, sunX, sunY, w * 0.2, [255, 210, 150], 0.55, SOFT);
    x.restore();
    // Fins nuages effilés
    var CW = 400, CHh = Math.round(CW * yH / w), cl = field(CW, CHh, function (d) {
      for (var j = 0; j < CHh; j++) for (var i = 0; i < CW; i++) {
        var u = i / CW * w, v = j / CHh * yH, t = v / yH, dn = fbm(n, u * 0.0009 + 31, v * 0.007 + n(u * 0.0005, 3) * 1.2, 5) - 0.05 - 0.3 * Math.abs(t - 0.5);
        var a = smooth(0, 0.35, dn) * 0.6, q = (j * CW + i) * 4, near = Math.exp(-Math.pow((u - sunX) / (w * 0.35), 2)), cc = lerpC([170, 120, 150], [255, 196, 150], 0.4 + 0.6 * near * t);
        d[q] = cc[0]; d[q + 1] = cc[1]; d[q + 2] = cc[2]; d[q + 3] = a * 255;
      }
    });
    x.save(); x.imageSmoothingQuality = 'high'; x.drawImage(cl, 0, 0, w, yH); x.globalCompositeOperation = 'lighter'; glow(x, sunX, sunY, h * 0.1, [255, 245, 220], 0.95); x.restore();
    soften({ c: T, o: T.getContext('2d') }, 1);
    x.save(); x.imageSmoothingQuality = 'high'; x.drawImage(T, 0, 0, w, h); x.restore();
    // Brume de chaleur sur l'horizon et lumière rasante
    x.fillStyle = vgrad(x, yH - h * 0.05, yH + h * 0.12, [[0, 'rgba(255,200,150,0)'], [0.4, 'rgba(255,200,150,0.22)'], [1, 'rgba(255,200,150,0)']]); x.fillRect(0, yH - h * 0.05, w, h * 0.17);
    x.save(); x.globalCompositeOperation = 'screen';
    glow(x, sunX, yH, w * 0.4, [255, 160, 90], 0.25, SOFT);
    x.restore();
    vignette(x, w, h, 0.5, [30, 10, 20]);
    grain(x, w, h, r, 0.05);
  }
  // ---- fin des scènes
  window.bsGalerie = [
    { id: 'reseau-neuronal', nom: 'Réseau neuronal', cat: 'IA', draw: reseauNeuronal },
    { id: 'cerveau-lumiere', nom: 'Cerveau de lumière', cat: 'IA', draw: cerveauLumiere },
    { id: 'puce-centrale', nom: 'Puce centrale', cat: 'IA', draw: puceCentrale },
    { id: 'globe-donnees', nom: 'Globe connecté', cat: 'IA', draw: globeDonnees },
    { id: 'flux-donnees', nom: 'Flux de données', cat: 'IA', draw: fluxDonnees },
    { id: 'horizon-holo', nom: 'Horizon holographique', cat: 'IA', draw: horizonHolo },
    { id: 'coeur-quantique', nom: 'Cœur quantique', cat: 'IA', draw: coeurQuantique },
    { id: 'constellation', nom: 'Constellation de données', cat: 'IA', draw: constellation },
    { id: 'lac-miroir', nom: 'Lac miroir', cat: 'Paysages', draw: lacMiroir },
    { id: 'dunes-dorees', nom: 'Dunes dorées', cat: 'Paysages', draw: dunesDorees }
  ];
})();

