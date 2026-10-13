/* ================== Monde : circuit, terrain désertique, décor ================== */
function buildWorld(onProgress){
  const prog = v => { if (onProgress) try { onProgress(v); } catch (e) {} };
  const R = mulberry32(90210), rr = (a = 0, b = 1) => a + R() * (b - a);
  const gauss = () => { let u = 0; for (let i = 0; i < 4; i++) u += R(); return (u - 2) / 0.577; };
  const TAU = Math.PI * 2, SECN = ['highway', 'canyon', 'dirt'];
  const lc = hex => new THREE.Color(hex); // couleur en espace linéaire
  const SHO = 1.8, VERGE = 1.4;           // bas-côté et talus de raccord

  /* ---------- 1. Tracé (boucle fermée, Catmull-Rom centripète, rééchantillonnée tous les ~2 m) ---------- */
  const CP = [[0,-300],[0,-150],[0,300],[0,700],[-60,950],[-250,1100],[-480,1120],[-650,1000],[-700,820],[-860,700],[-900,500],[-820,330],[-880,150],[-760,-60],[-520,-180],[-300,-330],[-120,-380]];
  const mk = k => { const c = new THREE.CatmullRomCurve3(CP.map(p => new THREE.Vector3(p[0] * k, 0, p[1] * k)), true, 'centripetal'); c.arcLengthDivisions = 8000; return c; };
  let curve = mk(1); const K = 3200 / curve.getLength(); curve = mk(K);
  const L = curve.getLength(), N = Math.round(L / 2), ds = L / N;
  const pts = curve.getSpacedPoints(N); pts.length = N;
  let i0 = 0; { let bd = Infinity; pts.forEach((p, i) => { const d = p.x * p.x + p.z * p.z; if (d < bd){ bd = d; i0 = i; } }); }
  const ox = pts[i0].x, oz = pts[i0].z;
  const F = () => new Float64Array(N);
  const X = F(), Z = F(), Y = F(), TX = F(), TZ = F(), HW = F(), CF = F(), CURV = F(), GR = F(), WL = F(), WH = F(), LL = F(), LR = F();
  const SEC = new Uint8Array(N);
  for (let i = 0; i < N; i++){ const p = pts[(i + i0) % N]; X[i] = p.x - ox; Z[i] = p.z - oz; }
  const nearAll = (x, z) => { let b = 0, bd = Infinity; for (let i = 0; i < N; i++){ const dx = X[i] - x, dz = Z[i] - z, d = dx * dx + dz * dz; if (d < bd){ bd = d; b = i; } } return b; };
  const at = j => nearAll(CP[j][0] * K - ox, CP[j][1] * K - oz);
  const iC0 = at(5) + 20, iC1 = at(11), iD1 = at(15);
  for (let i = 0; i < N; i++) SEC[i] = i >= iC0 && i < iC1 ? 1 : i >= iC1 && i < iD1 ? 2 : 0;
  const box = (src, rad) => { const out = F(); let acc = 0; for (let k = -rad; k <= rad; k++) acc += src[(k + N) % N]; for (let i = 0; i < N; i++){ out[i] = acc / (2 * rad + 1); acc += src[(i + rad + 1) % N] - src[(i - rad + N) % N]; } return out; };
  const box2 = (src, rad) => box(box(src, rad), rad);
  const tgt = f => { const a = F(); for (let i = 0; i < N; i++) a[i] = f(i); return a; };
  HW.set(box2(tgt(i => [6.5, 5.5, 7.5][SEC[i]]), 15));
  CF.set(box2(tgt(i => SEC[i] === 1 ? 1 : 0), 22));
  const cW = box2(tgt(i => SEC[i] === 1 ? 1 : 0), 80), dW = box2(tgt(i => SEC[i] === 2 ? 1 : 0), 40);
  for (let i = 0; i < N; i++){ const u = i / N * TAU; Y[i] = 2.2 * Math.sin(u * 3 + 0.6) + 1.4 * Math.sin(u * 7 + 2) + 18 * cW[i] - 3.5 * dW[i]; }
  { const y0 = Y[0]; for (let i = 0; i < N; i++) Y[i] -= y0; }
  const HD = F();
  for (let i = 0; i < N; i++){ const a = (i + N - 1) % N, b = (i + 1) % N; let tx = X[b] - X[a], tz = Z[b] - Z[a]; const l = Math.hypot(tx, tz); TX[i] = tx / l; TZ[i] = tz / l; HD[i] = Math.atan2(TX[i], TZ[i]); GR[i] = (Y[b] - Y[a]) / (2 * ds); }
  CURV.set(box(tgt(i => -wrapAng(HD[(i + 1) % N] - HD[(i + N - 1) % N]) / (2 * ds)), 3));
  for (let i = 0; i < N; i++){ WL[i] = HW[i] + 3.0 + (1 - CF[i]) * 44; WH[i] = CF[i] * (24 + 18 * noise2(i * ds / 160, 7.7)); }
  { const bl = box(tgt(i => [36, 40, 40][SEC[i]]), 10), br = box(tgt(i => [32, 40, 40][SEC[i]]), 10);
    for (let i = 0; i < N; i++){ LL[i] = Math.min(bl[i], WL[i] - 0.7); LR[i] = Math.min(br[i], WL[i] - 0.7); } }

  // échantillonnage
  const wrapS = s => ((s % L) + L) % L;
  function sample(s, out = {}){
    s = wrapS(s); const f = s / ds; let i = Math.floor(f); const t = f - i; i %= N; const j = (i + 1) % N;
    out.x = X[i] + (X[j] - X[i]) * t; out.y = Y[i] + (Y[j] - Y[i]) * t; out.z = Z[i] + (Z[j] - Z[i]) * t;
    let tx = TX[i] + (TX[j] - TX[i]) * t, tz = TZ[i] + (TZ[j] - TZ[i]) * t; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    out.tx = tx; out.tz = tz; out.rx = -tz; out.rz = tx;
    out.width = 2 * (HW[i] + (HW[j] - HW[i]) * t);
    const sc = SEC[t < 0.5 ? i : j]; out.section = SECN[sc]; out.surface = sc === 2 ? 'dirt' : 'asphalt';
    out.curvature = CURV[i] + (CURV[j] - CURV[i]) * t; out.grade = GR[i] + (GR[j] - GR[i]) * t;
    return out;
  }
  // projection d'un point sur la ligne médiane
  function refine(i, x, z){
    let bd = Infinity, bs = 0, bl = 0;
    for (let q = 0; q < 2; q++){
      const a = q ? i : (i - 1 + N) % N, b = (a + 1) % N, ex = X[b] - X[a], ez = Z[b] - Z[a], l2 = ex * ex + ez * ez;
      let t = ((x - X[a]) * ex + (z - Z[a]) * ez) / l2; t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = X[a] + ex * t, pz = Z[a] + ez * t, d = (x - px) * (x - px) + (z - pz) * (z - pz);
      if (d < bd){ bd = d; const l = Math.sqrt(l2); bs = (a + t) * ds; bl = (x - px) * (-ez / l) + (z - pz) * (ex / l); }
    }
    return { s: wrapS(bs), lat: bl, dist: Math.sqrt(bd) };
  }
  function project(x, z, hintS){
    let bi = -1;
    if (hintS != null && hintS === hintS){
      const c = Math.round(wrapS(hintS) / ds); let bd = Infinity, bk = 0;
      for (let k = -40; k <= 40; k++){ let i = c + k; if (i < 0) i += N; else if (i >= N) i -= N; const dx = X[i] - x, dz = Z[i] - z, d = dx * dx + dz * dz; if (d < bd){ bd = d; bi = i; bk = k; } }
      if (Math.abs(bk) >= 40) bi = -1; // indice faux : recherche globale
    }
    if (bi < 0) bi = nearAll(x, z);
    return refine(bi, x, z);
  }
  // grille de hachage pour les recherches du constructeur
  const HC = 64, HM = new Map(), hk = (ix, iz) => (ix + 512) * 1024 + iz + 512;
  for (let i = 0; i < N; i++){ const k = hk(Math.floor(X[i] / HC), Math.floor(Z[i] / HC)); if (!HM.has(k)) HM.set(k, []); HM.get(k).push(i); }
  function nearB(x, z){
    const cx = Math.floor(x / HC), cz = Math.floor(z / HC); let b = -1, bd = Infinity;
    for (let a = -2; a <= 2; a++) for (let c = -2; c <= 2; c++){ const arr = HM.get(hk(cx + a, cz + c)); if (!arr) continue;
      for (let n = 0; n < arr.length; n++){ const i = arr[n], dx = X[i] - x, dz = Z[i] - z, d = dx * dx + dz * dz; if (d < bd){ bd = d; b = i; } } }
    return b < 0 ? null : refine(b, x, z);
  }
  const idxOf = s => Math.round(wrapS(s) / ds) % N;
  prog(0.08);

  /* ---------- 2. Textures procédurales ---------- */
  function pnz(x, y, p, sd = 0){
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const m = k => ((k % p) + p) % p, x0 = m(xi) + sd, x1 = m(xi + 1) + sd, y0 = m(yi), y1 = m(yi + 1);
    const a = hash2(x0, y0), b = hash2(x1, y0), c = hash2(x0, y1), d = hash2(x1, y1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function pfbm(x, y, p, oct, sd = 0){ let s = 0, a = 0.5, n = 0; for (let o = 0; o < oct; o++){ s += pnz(x, y, p, sd + o * 101) * a; n += a; x *= 2; y *= 2; p *= 2; a *= 0.5; } return s / n; }
  function fill(S, T, fn){ const [c, g] = cnv(S, T), img = g.createImageData(S, T), d = img.data, o = [0, 0, 0];
    for (let y = 0; y < T; y++) for (let x = 0; x < S; x++){ fn(x, y, o); const k = (y * S + x) * 4; d[k] = clamp(o[0], 0, 1) * 255; d[k + 1] = clamp(o[1], 0, 1) * 255; d[k + 2] = clamp(o[2], 0, 1) * 255; d[k + 3] = 255; }
    g.putImageData(img, 0, 0); return [c, g]; }
  // dessine en 3 copies verticales pour garder la texture raccordable
  const wrapDraw = (g, T, f) => { for (const dy of [-T, 0, T]){ g.save(); g.translate(0, dy); f(); g.restore(); } };

  // Asphalte usé (u : travers de la route, v : 16 m de long) avec marquages
  function texAsphalt(){
    const S = 1024, ln = (x, c0, w) => clamp(w / 2 + 0.5 - Math.abs(x - c0), 0, 1);
    const [c, g] = fill(S, S, (x, y, o) => {
      const u = x / S, n1 = pfbm(x / S * 12, y / S * 12, 12, 4, 3), n2 = pnz(x / S * 90, y / S * 90, 90, 9), gr = hash2(x * 7 + 1, y * 13 + 5);
      let l = 0.27 + (n1 - 0.5) * 0.10 + (n2 - 0.5) * 0.04 + (gr - 0.5) * 0.07;
      if (gr > 0.986) l += 0.14; else if (gr < 0.012) l -= 0.07;
      const wp = Math.min(Math.abs(u - 0.2), Math.abs(u - 0.38), Math.abs(u - 0.62), Math.abs(u - 0.8));
      l *= 1 - 0.16 * (1 - smooth(0.01, 0.05, wp)) * (0.6 + 0.4 * n1);
      l *= 1 - 0.09 * (1 - smooth(0.006, 0.05, Math.min(Math.abs(u - 0.29), Math.abs(u - 0.71)))) * smooth(0.35, 0.7, n2);
      let r = l * 1.03, gg = l, b = l * 0.96;
      const ue = Math.min(u, 1 - u), jit = (pfbm(x / S * 6, y / S * 40, 6, 3, 17) - 0.5) * 0.03;
      if (ue < 0.12){ const t = 1 - smooth(0.05, 0.12, ue); r = lerp(r, 0.42, t * 0.35); gg = lerp(gg, 0.37, t * 0.35); b = lerp(b, 0.31, t * 0.35); }
      if (ue < 0.05 + jit){ const k = 0.85 + 0.3 * n2 + (gr - 0.5) * 0.25; r = 0.66 * k; gg = 0.54 * k; b = 0.40 * k; }
      // marquages : double ligne jaune centrale, lignes de rive blanches, usure en mouchetis
      const my = Math.max(ln(x, 502.5, 7), ln(x, 521.5, 7)), mw = Math.max(ln(x, 127.5, 9.5), ln(x, S - 127.5, 9.5));
      if (my + mw > 0){
        const keep = (0.72 + 0.28 * smooth(0.25, 0.6, pfbm(x / S * 64, y / S * 32, 64, 3, 41))) * (gr > 0.1 ? 1 : 0.55) * 0.95;
        if (my > 0){ const k = my * keep; r = lerp(r, 0.92, k); gg = lerp(gg, 0.70, k); b = lerp(b, 0.14, k); }
        if (mw > 0){ const k = mw * keep; r = lerp(r, 0.93, k); gg = lerp(gg, 0.92, k); b = lerp(b, 0.88, k); }
      }
      o[0] = r; o[1] = gg; o[2] = b;
    });
    const R2 = mulberry32(31); g.lineCap = 'round'; g.lineJoin = 'round';
    const walk = (x, y, n, step, ang, wob) => { const p = [[x, y]]; for (let k = 0; k < n; k++){ ang += (R2() - 0.5) * wob; x += Math.sin(ang) * step; y += Math.cos(ang) * step; p.push([x, y]); } return p; };
    const stroke = (p, w, st) => wrapDraw(g, S, () => { g.strokeStyle = st; g.lineWidth = w; g.beginPath(); p.forEach((q, k) => k ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.stroke(); });
    // rapiéçages
    for (let k = 0; k < 4; k++){ const x = 160 + R2() * 640, y = R2() * S, w = 60 + R2() * 200, h = 80 + R2() * 300; wrapDraw(g, S, () => { g.fillStyle = `rgba(28,28,30,${0.18 + R2() * 0.12})`; g.fillRect(x, y, w, h); g.strokeStyle = 'rgba(15,15,15,0.35)'; g.lineWidth = 2; g.strokeRect(x, y, w, h); }); }
    // joints transversaux + joint longitudinal central
    for (const y0 of [0, 512]){ const p = []; for (let x = 70; x <= S - 70; x += 16) p.push([x, y0 + Math.sin(x * 0.03) * 2 + (R2() - 0.5) * 2]); stroke(p, 2.5, 'rgba(12,12,13,0.6)'); }
    stroke([[512, -10], [512, S + 10]], 2, 'rgba(14,14,15,0.4)');
    // serpents de goudron (fissures colmatées) et fissures fines
    for (let k = 0; k < 12; k++) stroke(walk(140 + R2() * 744, R2() * S, 26, 8, (R2() < 0.7 ? 0 : 1.57) + (R2() - 0.5), 0.9), 2.5 + R2() * 2.5, 'rgba(12,12,14,0.62)');
    for (let k = 0; k < 40; k++) stroke(walk(120 + R2() * 784, R2() * S, 10, 5, R2() * 6.28, 1.4), 1, 'rgba(22,22,22,0.3)');
    return c;
  }
  // Piste de terre : ornières compactées avec sculptures de pneus, tôle ondulée, cailloux
  function texDirt(){
    const S = 1024;
    return fill(S, S, (x, y, o) => {
      const u = x / S, n1 = pfbm(x / S * 10, y / S * 10, 10, 4, 5), n2 = pnz(x / S * 120, y / S * 120, 120, 8), gr = hash2(x * 3 + 7, y * 11 + 2);
      let k = 0.92 + (n1 - 0.5) * 0.28 + (n2 - 0.5) * 0.1 + (gr - 0.5) * 0.1;
      let r = 0.70, g = 0.55, b = 0.40;
      const rut = Math.min(Math.abs(u - 0.4), Math.abs(u - 0.27), Math.abs(u - 0.6), Math.abs(u - 0.73)), rm = 1 - smooth(0.012, 0.03, rut + (n1 - 0.5) * 0.01);
      if (rm > 0){ const tread = ((y >> 2) & 1) ? 1 : 0.9, rib = 0.95 + 0.05 * Math.sin(x * 2.4); k *= lerp(1, 0.8 * tread * rib, rm); r = lerp(r, 0.62, rm); g = lerp(g, 0.46, rm); b = lerp(b, 0.33, rm); }
      k *= 1 + 0.045 * Math.sin(y / S * TAU * 80 + n1 * 3) * (1 - smooth(0.25, 0.4, Math.abs(u - 0.5)));
      const ue = Math.min(u, 1 - u); if (ue < 0.14){ const t = 1 - smooth(0.04, 0.14, ue); r = lerp(r, 0.8, t); g = lerp(g, 0.68, t); b = lerp(b, 0.52, t); }
      if (gr > 0.992) k *= 0.6; else if (gr > 0.984) k *= 1.25;
      if (n2 > 0.86 && rm < 0.5) k *= 0.82 + 0.35 * hash2(x >> 2, y >> 2);
      o[0] = r * k; o[1] = g * k; o[2] = b * k;
    })[0];
  }
  // Sable clair quasi neutre (la teinte vient des couleurs de sommets)
  function texSand(){
    const S = 1024;
    return fill(S, S, (x, y, o) => {
      const n1 = pfbm(x / S * 8, y / S * 8, 8, 4, 2), n2 = pnz(x / S * 160, y / S * 160, 160, 4), gr = hash2(x + 3, y * 5 + 1);
      const rip = 0.5 + 0.5 * Math.sin((x * 0.8 + y * 0.6) / S * TAU * 48 + n1 * 9);
      let k = 0.86 + (n1 - 0.5) * 0.16 + (n2 - 0.5) * 0.06 + (gr - 0.5) * 0.08 + rip * 0.035;
      let r = 1, g = 0.97, b = 0.93;
      if (gr > 0.993){ k *= 0.55; r = 0.9; g = 0.8; b = 0.75; } else if (gr > 0.987) k *= 1.12;
      if (n2 > 0.84){ k *= 0.88; r = 0.95; g = 0.86; b = 0.8; }
      o[0] = r * k; o[1] = g * k; o[2] = b * k;
    })[0];
  }
  // Roche stratifiée : bandes horizontales (v = hauteur monde / 64 m), coulures de vernis du désert
  const BANDS = (() => { const cols = ['#9b4a2a', '#b45d33', '#c77a45', '#d8a070', '#e3b787', '#8a3d24', '#a85a35', '#c98c5a', '#b86b3e', '#d4925e'].map(h => { const c = col(h); return [c.r, c.g, c.b]; });
    const b = []; let v = 0; const R3 = mulberry32(12); while (v < 1){ const t = 0.008 + R3() * R3() * 0.07; b.push({ v0: v, v1: Math.min(1, v + t), c: cols[(R3() * cols.length) | 0], h: R3() }); v += t; } return b; })();
  const bandAt = v => { v = v - Math.floor(v); for (let i = 0; i < BANDS.length; i++) if (v < BANDS[i].v1) return BANDS[i]; return BANDS[BANDS.length - 1]; };
  function texRock(){
    const S = 512, T = 1024;
    return fill(S, T, (x, y, o) => {
      const v = 1 - y / T, w = (pfbm(x / S * 4, y / T * 8, 4, 3, 1) - 0.5) * 0.02, bd = bandAt(v + w);
      const n1 = pfbm(x / S * 16, y / T * 32, 16, 4, 7), gr = hash2(x * 5, y * 3 + 1);
      let k = 0.8 + (n1 - 0.5) * 0.4 + (gr - 0.5) * 0.12;
      const st = pnz(x / S * 40 + n1 * 3, y / T * 3, 40, 21); k *= 1 - 0.25 * smooth(0.62, 0.88, st) * (0.5 + 0.5 * n1);
      const fr = (v + w - bd.v0) / (bd.v1 - bd.v0); k *= 0.82 + 0.18 * smooth(0, 0.25, fr);
      o[0] = bd.c[0] * k; o[1] = bd.c[1] * k; o[2] = bd.c[2] * k;
    })[0];
  }
  const nrm = (S, hf, st) => ctex(normalFromHeight(S, hf, st), { srgb: false, repeat: [1, 1] });
  const T_ASPH = ctex(texAsphalt(), { repeat: [1, 1] }), T_ASPHN = nrm(256, (x, y) => hash2(x, y) * 0.6 + pfbm(x / 256 * 16, y / 256 * 16, 16, 3) * 1.2, 2.5);
  T_ASPHN.repeat.set(5, 5);
  const T_DIRT = ctex(texDirt(), { repeat: [1, 1] }), T_DIRTN = nrm(256, (x, y) => pfbm(x / 256 * 8, y / 256 * 8, 8, 4, 9) * 3 + hash2(x, y + 9) * 0.6 + (hash2(x >> 2, y >> 2) > 0.93 ? 1.2 : 0), 3);
  T_DIRTN.repeat.set(2, 2);
  const T_SAND = ctex(texSand(), { repeat: [1, 1] }), T_SANDN = nrm(512, (x, y) => { const n = pfbm(x / 512 * 6, y / 512 * 6, 6, 3, 4); const n2 = pfbm(x / 512 * 24, y / 512 * 24, 24, 2, 8); return Math.sin((x * 0.8 + y * 0.6) / 512 * TAU * 48 + n * 14) * 0.35 * smooth(0.3, 0.7, n2) + n * 4 + hash2(x, y) * 0.3; }, 1.7);
  const T_ROCK = ctex(texRock(), { repeat: [1, 1] }), T_ROCKN = nrm(256, (x, y) => { const v = 1 - y / 256, bd = bandAt(v * 0.25); return bd.h * 3 + pfbm(x / 256 * 8, y / 256 * 8, 8, 4, 3) * 4 + hash2(x, y) * 0.4; }, 2.5);
  T_ROCKN.repeat.set(4, 4);
  prog(0.3);

  /* ---------- 3. Terrain (grille exacte réutilisée par ground()) ---------- */
  let bx0 = Infinity, bx1 = -Infinity, bz0 = Infinity, bz1 = -Infinity;
  for (let i = 0; i < N; i++){ bx0 = Math.min(bx0, X[i]); bx1 = Math.max(bx1, X[i]); bz0 = Math.min(bz0, Z[i]); bz1 = Math.max(bz1, Z[i]); }
  const CX = (bx0 + bx1) / 2, CZ = (bz0 + bz1) / 2;
  const sun2 = Math.hypot(SUN_DIR.x, SUN_DIR.z), SX = SUN_DIR.x / sun2, SZ = SUN_DIR.z / sun2;
  function tnat(x, z){
    let h = (fbm2(x / 520 + 11, z / 520 - 3, 4) - 0.5) * 18;
    const w = fbm2(x / 300, z / 300 + 5, 3), d = 0.5 + 0.5 * Math.sin((x * 0.83 + z * 0.56) / 42 + w * 7);
    h += d * d * 3.4 * smooth(0.38, 0.62, fbm2(x / 800 - 7, z / 800, 2));
    return h + (fbm2(x / 60, z / 60, 3) - 0.5) * 1.6;
  }
  function farH(x, z){
    const dx = x - CX, dz = z - CZ, r = Math.hypot(dx, dz);
    let h = tnat(x, z) * (1 - smooth(1600, 2600, r));
    const m = smooth(2300, 3900, r);
    if (m > 0){ const sd = (dx * SX + dz * SZ) / r, cut = 1 - 0.82 * smooth(0.84, 0.97, sd); h += m * (80 + 640 * Math.pow(ridged2(x / 1300 + 3, z / 1300 - 2, 5), 1.7)) * cut; }
    return h;
  }
  let fPF = 0, fLK = 0;
  function field(x, z){
    fPF = 0; fLK = 0; let h = tnat(x, z);
    const r = Math.hypot(x - CX, z - CZ);
    const p = r < 1450 ? nearB(x, z) : null;
    if (p){
      const k = idxOf(p.s), a = Math.abs(p.lat), yr = Y[k], hw = HW[k], e = hw + SHO, cf = CF[k], wl = WL[k], H = WH[k];
      // lac asséché autour de la piste de terre
      const lk = dW[k] * (1 - smooth(50, 125, a)); fLK = lk;
      h = lerp(h, yr - 0.25 + (fbm2(x / 30, z / 30, 2) - 0.5) * 0.3, lk);
      // plateau rocheux entaillé par le canyon
      const pf = cf * (1 - smooth(wl + 50, wl + 100, a + (fbm2(x / 90, z / 90, 3) - 0.5) * 50)); fPF = pf;
      const plat = yr + H - 0.4 + ridged2(x / 45, z / 45, 3) * 2.5;
      h = lerp(h, plat, pf);
      // aplanissement sous la route, talus doux
      const f0 = lerp(e + 16, wl + 18, cf), f1 = lerp(e + 46, wl + 32, cf);
      h = lerp(yr - 0.3, h, smooth(f0, f1, a));
    }
    if (r > 1420){ const fh = farH(x, z); h = r > 1490 ? fh - 4 : lerp(h, fh, smooth(1420, 1480, r)); }
    return h;
  }
  const GSZ = 1500, GN = Q.grass >= 0.9 ? 280 : Q.grass >= 0.6 ? 240 : 190, CELL = 2 * GSZ / GN, GV = GN + 1, GX0 = CX - GSZ, GZ0 = CZ - GSZ;
  const TH = new Float32Array(GV * GV), TPF = new Float32Array(GV * GV), TLK = new Float32Array(GV * GV);
  for (let j = 0; j < GV; j++) for (let i = 0; i < GV; i++){ const q = j * GV + i; TH[q] = field(GX0 + i * CELL, GZ0 + j * CELL); TPF[q] = fPF; TLK[q] = fLK; }
  function gridH(x, z, n){
    let fx = clamp((x - GX0) / CELL, 0, GN - 1e-4), fz = clamp((z - GZ0) / CELL, 0, GN - 1e-4); const i = fx | 0, j = fz | 0; fx -= i; fz -= j;
    const q = j * GV + i, a = TH[q], b = TH[q + 1], c = TH[q + GV], d = TH[q + GV + 1]; let h, dx, dz;
    if (fx + fz <= 1){ dx = b - a; dz = c - a; h = a + dx * fx + dz * fz; } else { dx = d - c; dz = d - b; h = d - dx * (1 - fx) - dz * (1 - fz); }
    if (n){ const nx = -dx / CELL, nz = -dz / CELL, l = Math.hypot(nx, 1, nz); n.x = nx / l; n.y = 1 / l; n.z = nz / l; }
    return h;
  }
  // anti-répétition : la texture est échantillonnée à deux échelles
  const antiTile = m => { m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `#ifdef USE_MAP
  vec4 sampledDiffuseColor = texture2D( map, vMapUv );
  vec4 s2 = texture2D( map, vMapUv * 0.137 + vec2( 0.31, 0.77 ) );
  sampledDiffuseColor.rgb = mix( sampledDiffuseColor.rgb, sampledDiffuseColor.rgb * s2.rgb * 1.35, 0.55 );
  diffuseColor *= sampledDiffuseColor;
#endif`); }; m.customProgramCacheKey = () => 'antitile'; return m; };
  {
    const n = GV * GV, pos = new Float32Array(n * 3), uv = new Float32Array(n * 2), cl = new Float32Array(n * 3);
    const cS = lc(PAL.sand), cD = lc(PAL.sandDark), cR = lc('#b0623a'), cP = lc('#e3cfae'), cRk = lc(PAL.rockRed), tmp = new THREE.Color(), nn = { x: 0, y: 1, z: 0 };
    for (let j = 0; j < GV; j++) for (let i = 0; i < GV; i++){
      const q = j * GV + i, x = GX0 + i * CELL, z = GZ0 + j * CELL, h = TH[q];
      pos[q * 3] = x; pos[q * 3 + 1] = h; pos[q * 3 + 2] = z; uv[q * 2] = x / 24; uv[q * 2 + 1] = z / 24;
      gridH(x + 0.3 * CELL, z + 0.3 * CELL, nn); const slope = 1 - nn.y;
      tmp.copy(cS).lerp(cD, smooth(0.35, 0.75, fbm2(x / 180, z / 180, 3)) * 0.75);
      tmp.lerp(cR, smooth(0.45, 0.8, fbm2(x / 400 + 9, z / 400, 3)) * 0.45);
      tmp.lerp(cRk, clamp(smooth(0.06, 0.35, slope) * 0.8 + TPF[q] * 0.5, 0, 0.9));
      tmp.lerp(cP, TLK[q] * 0.7);
      tmp.multiplyScalar(0.92 + 0.16 * noise2(x / 23, z / 23));
      cl[q * 3] = tmp.r; cl[q * 3 + 1] = tmp.g; cl[q * 3 + 2] = tmp.b;
    }
    const idx = new Uint32Array(GN * GN * 6); let k = 0;
    for (let j = 0; j < GN; j++) for (let i = 0; i < GN; i++){ const a = j * GV + i, b = a + 1, c = a + GV, d = c + 1; idx[k++] = a; idx[k++] = c; idx[k++] = b; idx[k++] = b; idx[k++] = c; idx[k++] = d; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setAttribute('color', new THREE.BufferAttribute(cl, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, antiTile(new THREE.MeshStandardMaterial({ map: T_SAND, normalMap: T_SANDN, normalScale: new THREE.Vector2(0.9, 0.9), vertexColors: true, roughness: 0.96 })));
    m.receiveShadow = true; m.name = 'terrain'; scene.add(m);
  }
  // anneau lointain : plaine puis chaîne de montagnes dans la brume
  {
    const AS = 320, RS = 56, pos = [], cl = [], idx = [], c1 = lc(PAL.sandDark), c2 = lc('#7a5446'), c3 = lc('#5d4a4c'), tmp = new THREE.Color();
    for (let j = 0; j < RS; j++){ const r = 1480 * Math.pow(8000 / 1480, j / (RS - 1));
      for (let i = 0; i < AS; i++){ const a = i / AS * TAU, x = CX + Math.cos(a) * r, z = CZ + Math.sin(a) * r, h = farH(x, z);
        pos.push(x, h, z); tmp.copy(c1).lerp(c2, smooth(10, 160, h)).lerp(c3, smooth(200, 600, h)).multiplyScalar(0.9 + 0.2 * noise2(x / 300, z / 300)); cl.push(tmp.r, tmp.g, tmp.b); } }
    for (let j = 0; j < RS - 1; j++) for (let i = 0; i < AS; i++){ const a = j * AS + i, b = j * AS + (i + 1) % AS, c = a + AS, d = b + AS; idx.push(a, b, c, b, d, c); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(cl, 3)); g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
    m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <fog_fragment>', `#ifdef USE_FOG
  float fogF = min( 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth ), 0.8 );
  vec3 fogC = mix( fogColor, vec3( 0.56, 0.6, 0.74 ), smoothstep( 2500.0, 7000.0, vFogDepth ) * 0.5 );
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogC, fogF );
#endif`); }; m.customProgramCacheKey = () => 'farhaze';
    const me = new THREE.Mesh(g, m); me.receiveShadow = false; me.name = 'horizon'; scene.add(me);
  }
  prog(0.5);

  /* ---------- 4. Chaussées ---------- */
  const LATS = hw => { const e = hw + SHO; return [-(e + VERGE), -e, -hw, -hw / 2, 0, hw / 2, hw, e, e + VERGE]; }, US = [0, 0.05, 0.12, 0.31, 0.5, 0.69, 0.88, 0.95, 1];
  function strip(a, b, lift, alphaFn){
    const pos = [], uv = [], cl = [], idx = [], rows = b - a + 1, tile = L / Math.round(L / 16);
    for (let n = 0; n < rows; n++){ const k = ((a + n) % N + N) % N, la = LATS(HW[k]), rx = -TZ[k], rz = TX[k];
      for (let c = 0; c < 9; c++){ const x = X[k] + rx * la[c], z = Z[k] + rz * la[c]; let y = Y[k] + lift;
        if (c === 0 || c === 8) y = Math.max(Y[k] - 1.5, Math.min(Y[k] - 0.05, gridH(x, z) + 0.04)) + lift; else if (c === 1 || c === 7) y -= 0.02;
        pos.push(x, y, z); uv.push(US[c], (a + n) * ds / tile); if (alphaFn) cl.push(1, 1, 1, alphaFn(n, rows, c)); } }
    for (let n = 0; n < rows - 1; n++) for (let c = 0; c < 8; c++){ const p = n * 9 + c, q = p + 9; idx.push(p, p + 1, q, p + 1, q + 1, q); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    if (alphaFn) g.setAttribute('color', new THREE.Float32BufferAttribute(cl, 4)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  {
    const ga = strip(iD1 - 4, N + iC1 + 4, 0);
    const ma = new THREE.MeshStandardMaterial({ map: T_ASPH, normalMap: T_ASPHN, normalScale: new THREE.Vector2(0.6, 0.6), roughness: 0.88, metalness: 0 });
    const road = new THREE.Mesh(ga, ma); road.receiveShadow = true; road.name = 'asphalt'; scene.add(road);
    const gd = strip(iC1 - 8, iD1 + 8, 0.025, (n, rows, c) => (c === 0 || c === 8 ? 0 : c === 1 || c === 7 ? 0.85 : 1) * smooth(0, 10, n) * smooth(0, 10, rows - 1 - n));
    const md = new THREE.MeshStandardMaterial({ map: T_DIRT, normalMap: T_DIRTN, normalScale: new THREE.Vector2(0.9, 0.9), roughness: 0.97, vertexColors: true, transparent: true, depthWrite: true, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 });
    const dirt = new THREE.Mesh(gd, md); dirt.receiveShadow = true; dirt.name = 'dirt'; scene.add(dirt);
  }
  // damier de départ + emplacements de grille (décalcomanie)
  const slotPos = i => ({ s: -6 - Math.floor(i / 2) * 8, lat: i % 2 === 0 ? 3.0 : -3.0 });
  {
    const S0 = -34, S1 = 2, hw0 = HW[0], Wc = 512, Hc = 1024, [c, g] = cnv(Wc, Hc);
    const px = lat => (lat + hw0) / (2 * hw0) * Wc, py = s => (1 - (s - S0) / (S1 - S0)) * Hc, ppm = Wc / (2 * hw0);
    for (let r = 0; r < 4; r++) for (let q = 0; q < 26; q++){ if ((r + q) % 2) continue; g.fillStyle = '#f2efe8'; g.fillRect(px(-hw0 + q * 0.5), py(-1 + (r + 1) * 0.5), 0.5 * ppm, 0.5 * ppm); }
    g.fillStyle = 'rgba(20,20,22,0.92)'; for (let r = 0; r < 4; r++) for (let q = 0; q < 26; q++){ if ((r + q) % 2 === 0) continue; g.fillRect(px(-hw0 + q * 0.5), py(-1 + (r + 1) * 0.5), 0.5 * ppm, 0.5 * ppm); }
    g.strokeStyle = '#f2efe8'; g.fillStyle = '#f2efe8'; g.lineWidth = 0.15 * ppm; g.font = `700 ${1.4 * ppm}px Rajdhani, Arial Narrow, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let i = 0; i < 6; i++){ const p = slotPos(i), x0 = px(p.lat - 1.3), x1 = px(p.lat + 1.3), y = py(p.s + 2.6), yb = py(p.s + 1.8);
      g.beginPath(); g.moveTo(x0, yb); g.lineTo(x0, y); g.lineTo(x1, y); g.lineTo(x1, yb); g.stroke(); g.fillText(String(i + 1), px(p.lat), py(p.s + 3.6)); }
    // usure
    g.globalCompositeOperation = 'destination-out'; const R4 = mulberry32(8);
    for (let k = 0; k < 5000; k++){ g.fillStyle = `rgba(0,0,0,${0.15 + R4() * 0.45})`; const s = 1 + R4() * 3; g.fillRect(R4() * Wc, R4() * Hc, s, s); }
    g.globalCompositeOperation = 'source-over';
    const tex = ctex(c), pos = [], uv = [], idx = [], i0s = Math.floor(S0 / ds), i1s = Math.ceil(S1 / ds);
    for (let n = i0s; n <= i1s; n++){ const k = (n % N + N) % N, s = n * ds, rx = -TZ[k], rz = TX[k];
      for (const sd of [-1, 1]){ pos.push(X[k] + rx * hw0 * sd, Y[k] + 0.012, Z[k] + rz * hw0 * sd); uv.push(sd < 0 ? 0 : 1, (s - S0) / (S1 - S0)); } }
    for (let n = 0; n < i1s - i0s; n++){ const p = n * 2; idx.push(p, p + 1, p + 2, p + 1, p + 3, p + 2); }
    const g2 = new THREE.BufferGeometry(); g2.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g2.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g2.setIndex(idx); g2.computeVertexNormals();
    const m = new THREE.Mesh(g2, new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.7, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }));
    m.receiveShadow = true; m.renderOrder = 1; scene.add(m);
  }
  prog(0.6);

  /* ---------- 5. Parois du canyon + mesas (un seul maillage de roche) ---------- */
  const RP = [], RU = [], RC = [], RI = [];
  {
    const ROWS = 26, PR = ROWS + 4, step = Q.props < 0.6 ? 2 : 1;
    let a = iC0, b = iC1; while (CF[(a - 1 + N) % N] > 0.015) a--; while (CF[b % N] > 0.015) b++;
    for (const sd of [-1, 1]){
      const base = RP.length / 3; let cols = 0;
      for (let i = a; i <= b; i += step){
        const k = (i + N) % N, s = i * ds, wl = WL[k], H = Math.max(WH[k], 0.05), yr = Y[k], rx = -TZ[k] * sd, rz = TX[k] * sd, us = (s + (sd > 0 ? 0 : 731)) / 32;
        const put = (d, hh, ao, vExtra = 0) => { RP.push(X[k] + rx * d, yr + hh, Z[k] + rz * d); RU.push(us, (yr + hh) / 64 + vExtra); RC.push(ao, ao * 0.97, ao * 0.95); };
        put(wl + 2, -3, 0.45);
        let dTop = wl;
        for (let r = 0; r < ROWS; r++){
          const hh = H * r / (ROWS - 1), yw = yr + hh, bf = yw / 3.8, bi = Math.floor(bf), fr = bf - bi;
          const ledge = (hash2(bi, 77) - 0.5) * 2.2 - 1.1 * smooth(0.72, 1, fr) + 0.4 * smooth(0, 0.2, fr);
          const bulge = (noise2(s / 14 + sd * 50, yw / 9) - 0.5) * 3.6 + (noise2(s / 50 + sd * 20, 1.3) - 0.5) * 7 + hh * 0.22 + (noise2(s / 5 + sd * 9, yw / 22) - 0.5) * 2.2 + Math.sin(s / 2.7 + noise2(s / 9, yw / 7) * 4) * 0.35;
          const d = wl + Math.max(0, 1.1 + ledge + bulge); dTop = d;
          put(d, hh, (0.5 + 0.5 * smooth(0, 7, hh)) * (0.86 + 0.14 * smooth(-0.6, 0.4, ledge)));
        }
        put(dTop + 1.6, H + 0.5, 1, 0.02); put(wl + 30, H + 0.6 + noise2(s / 20, sd) * 1.2, 0.95, 0.4); put(wl + 33, H - 5, 0.8, 0.45);
        cols++;
      }
      for (let c = 0; c < cols - 1; c++) for (let r = 0; r < PR - 1; r++){ const q = base + c * PR + r; RI.push(q, q + 1, q + PR, q + 1, q + PR + 1, q + PR); }
    }
  }
  // mesas et buttes lointaines à strates
  const mesas = [];
  function mesa(cx, cz, rad, hgt, ax = 1, az = 1){
    const A = 44, prof = [[1.5, -0.08], [1.38, 0], [1.2, 0.12], [1.07, 0.24], [1.0, 0.32], [1.0, 0.44], [0.97, 0.52], [1.01, 0.53], [0.98, 0.66], [1.0, 0.67], [0.96, 0.8], [0.99, 0.81], [0.96, 0.95], [0.9, 1.0], [0.6, 1.01], [0, 1.02]];
    const y0 = gridH(cx, cz) - 6, base = RP.length / 3, sd = R() * 100;
    for (let p = 0; p < prof.length; p++) for (let i = 0; i <= A; i++){
      const a = i / A * TAU, ca = Math.cos(a), sa = Math.sin(a);
      const nr = 1 + (noise2(ca * 1.4 + sd, sa * 1.4) - 0.5) * 0.8 + (noise2(ca * 4 + sd, sa * 4 + p * 0.35) - 0.5) * 0.3 + Math.sin(a * 23 + noise2(ca * 3, sa * 3 + sd) * 8) * 0.035 * (p > 3 ? 1 : 0.3);
      const rr2 = rad * prof[p][0] * nr, hh = hgt * prof[p][1] * (p > 12 ? 1 - 0.08 * noise2(ca * 2 + sd, sa * 2) : 1) + 6 * (p ? 1 : 0), x = cx + ca * rr2 * ax, z = cz + sa * rr2 * az, y = y0 + hh;
      RP.push(x, y, z); RU.push(i / A * rad * 6.28 / 32, y / 64 + (p >= prof.length - 2 ? (1 - prof[p][0]) * rad / 64 : 0));
      const ao = p < 4 ? 0.6 + p * 0.08 : 0.9 + 0.1 * hash2(p, 3); RC.push(ao, ao * 0.97, ao * 0.95);
    }
    for (let p = 0; p < prof.length - 1; p++) for (let i = 0; i < A; i++){ const q = base + p * (A + 1) + i, w = q + A + 1; RI.push(q, q + 1, w, q + 1, w + 1, w); }
    mesas.push({ x: cx, z: cz, r: rad * Math.max(ax, az) * 1.6 });
  }
  {
    const trackDist = (x, z) => { let bd = Infinity; for (let i = 0; i < N; i += 4){ const d = Math.hypot(X[i] - x, Z[i] - z); if (d < bd) bd = d; } return bd; };
    const fixed = [[620, 1350, 120, 105, 1.3, 0.8], [1150, 520, 70, 150, 1, 1], [-230, 1850, 170, 95, 1.6, 0.7], [-1500, 1300, 140, 120, 1, 1.2], [-1350, -500, 180, 85, 1.4, 1], [380, -900, 110, 110, 1, 1], [-700, -900, 90, 140, 1, 1]];
    fixed.forEach(f => { if (trackDist(f[0], f[1]) > f[2] * Math.max(f[4], f[5]) * 2.3 + 50) mesa(f[0], f[1], f[2], f[3], f[4], f[5]); });
    let tries = 0, want = Math.round(10 * Q.props);
    while (want > 0 && tries++ < 400){
      const a = rr(0, TAU), r = rr(650, 1350), x = CX + Math.cos(a) * r, z = CZ + Math.sin(a) * r, rad = rr(35, 110), hgt = rr(45, 130);
      const sdot = ((x - 0) * SX + (z - 300) * SZ) / Math.hypot(x, z - 300); if (sdot > 0.95) continue;
      if (trackDist(x, z) < rad * 1.6 + 70 || mesas.some(m => Math.hypot(m.x - x, m.z - z) < m.r + rad * 1.5 + 40)) continue;
      const ax = rr(0.7, 1.5), az = rr(0.7, 1.3); if (trackDist(x, z) < rad * Math.max(ax, az) * 2.3 + 50) continue; mesa(x, z, rad, hgt, ax, az); want--;
    }
  }
  {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(RP, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(RU, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(RC, 3)); g.setIndex(RI); g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: T_ROCK, normalMap: T_ROCKN, normalScale: new THREE.Vector2(1.2, 1.2), vertexColors: true, roughness: 0.93, side: THREE.DoubleSide }));
    m.castShadow = true; m.receiveShadow = true; m.name = 'rock'; scene.add(m);
  }
  prog(0.7);

  /* ---------- 6. Accessoires ---------- */
  const _o = new THREE.Object3D();
  function inst(geo, mat, list, cast = true, name = ''){
    if (!list.length) return null;
    const m = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach((p, k) => { _o.position.set(p.x, p.y, p.z); _o.rotation.set(p.rx || 0, p.ry || 0, p.rz || 0); _o.scale.set(p.sx ?? p.s ?? 1, p.sy ?? p.s ?? 1, p.sz ?? p.s ?? 1); _o.updateMatrix(); m.setMatrixAt(k, _o.matrix); if (p.c) m.setColorAt(k, p.c); });
    m.castShadow = cast; m.receiveShadow = true; m.frustumCulled = false; m.name = name; scene.add(m); return m;
  }
  const paint = (g, hex, k = 1) => { const c = lc(hex).multiplyScalar(k), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++){ a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; };
  const _m4 = new THREE.Matrix4(), _upY = V3(0, 1, 0), _upX = V3(1, 0, 0);
  function beam(a, b, t, t2 = t){ const g = new THREE.BoxGeometry(t, t2, a.distanceTo(b)); const d = V3().subVectors(b, a); _m4.lookAt(b, a, Math.abs(d.y) > d.length() * 0.95 ? _upX : _upY); _m4.setPosition(V3().addVectors(a, b).multiplyScalar(0.5)); g.applyMatrix4(_m4); return g; }
  const ptAt = (s, lat) => { const sp = sample(s); return { x: sp.x + sp.rx * lat, z: sp.z + sp.rz * lat, h: Math.atan2(sp.tx, sp.tz), sp }; };
  const hwyRange = []; for (let i = iD1 + 25; i < N + iC0 - 70; i++) hwyRange.push(i);

  // pylônes à treillis (côté gauche, côté soleil : leurs ombres traversent la route)
  const towerGeo = (() => {
    const P = []; const lv = [0, 5, 10, 14.5, 18.5, 22], up = [22, 26, 29, 32];
    const wAt = y => y <= 22 ? lerp(3.6, 1.1, y / 22) : lerp(1.1, 0.8, (y - 22) / 10);
    const C = (y, sx, sz) => V3(sx * wAt(y), y, sz * wAt(y));
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const levels = lv.concat(up.slice(1));
    for (let l = 0; l < levels.length - 1; l++){ const y0 = levels[l], y1 = levels[l + 1], t = y0 < 22 ? 0.22 : 0.16;
      for (let c = 0; c < 4; c++){ const [ax, az] = corners[c], [bx, bz] = corners[(c + 1) % 4];
        P.push(beam(C(y0, ax, az), C(y1, ax, az), t * 1.3)); P.push(beam(C(y0, ax, az), C(y1, bx, bz), t * 0.6)); P.push(beam(C(y0, bx, bz), C(y1, ax, az), t * 0.6)); P.push(beam(C(y1, ax, az), C(y1, bx, bz), t * 0.7)); } }
    for (const [ya, span] of [[22, 7.2], [27, 6.2]]) for (const sx of [-1, 1]){ const tip = V3(sx * span, ya, 0);
      P.push(beam(V3(sx * wAt(ya), ya, -0.8), tip, 0.18), beam(V3(sx * wAt(ya), ya, 0.8), tip, 0.18), beam(V3(sx * wAt(ya + 2), ya + 2, 0), tip, 0.16));
      const ins = new THREE.CylinderGeometry(0.14, 0.14, 2.2, 6); ins.translate(tip.x, ya - 1.1, 0); P.push(ins); }
    P.push(beam(C(32, -1, 0), V3(0, 34.5, 0), 0.16), beam(C(32, 1, 0), V3(0, 34.5, 0), 0.16));
    return mergeGeometries(P.map(g => { g.deleteAttribute('uv'); return g; }));
  })();
  const ATT = [[-7.2, 19.8], [7.2, 19.8], [-6.2, 24.8], [6.2, 24.8], [0, 34.5]];
  const WIRE_P = [], WIRE_I = [], LINE_P = [];
  function wire(ax, ay, az, bx, by, bz, sag, w, segs = 14){
    let prev = null;
    for (let k = 0; k <= segs; k++){ const t = k / segs, x = lerp(ax, bx, t), z = lerp(az, bz, t), y = lerp(ay, by, t) - sag * 4 * t * (1 - t);
      if (prev){ const dx = x - prev[0], dz = z - prev[2], l = Math.hypot(dx, dz) || 1, px = -dz / l * w, pz = dx / l * w, b = WIRE_P.length / 3;
        WIRE_P.push(prev[0] - px, prev[1], prev[2] - pz, prev[0] + px, prev[1], prev[2] + pz, x - px, y, z - pz, x + px, y, z + pz,
          prev[0], prev[1] - w, prev[2], prev[0], prev[1] + w, prev[2], x, y - w, z, x, y + w, z);
        WIRE_I.push(b, b + 1, b + 2, b + 1, b + 3, b + 2, b + 4, b + 5, b + 6, b + 5, b + 7, b + 6);
        LINE_P.push(prev[0], prev[1], prev[2], x, y, z); }
      prev = [x, y, z]; }
  }
  {
    const towers = []; let last = null;
    for (let i = hwyRange[0]; i <= hwyRange[hwyRange.length - 1]; i += 36){ const p = ptAt(i * ds, -42); p.y = gridH(p.x, p.z) - 0.2; towers.push(p); }
    // la ligne continue tout droit vers l'horizon après l'autoroute
    if (towers.length > 2){ const a = towers[towers.length - 2], b = towers[towers.length - 1], dx = b.x - a.x, dz = b.z - a.z;
      for (let k = 1; k <= 6; k++){ const x = b.x + dx * k, z = b.z + dz * k; towers.push({ x, z, y: gridH(x, z) - 0.2 }); } }
    towers.forEach((t, k) => { const a = towers[Math.max(0, k - 1)], b = towers[Math.min(towers.length - 1, k + 1)]; t.h = Math.atan2(b.x - a.x, b.z - a.z); });
    inst(towerGeo, stdMat('#8f9498', { metalness: 0.75, roughness: 0.42 }), towers.map(t => ({ x: t.x, y: t.y, z: t.z, ry: t.h })), true, 'pylons');
    for (let k = 0; k < towers.length - 1; k++){ const a = towers[k], b = towers[k + 1], span = Math.hypot(b.x - a.x, b.z - a.z);
      for (const [lx, ly] of ATT){ const ca = Math.cos(a.h), sa = Math.sin(a.h), cb = Math.cos(b.h), sb = Math.sin(b.h);
        wire(a.x + lx * ca, a.y + ly, a.z - lx * sa, b.x + lx * cb, b.y + ly, b.z - lx * sb, span * (ly > 30 ? 0.025 : 0.04), 0.05); } }
    // poteaux téléphoniques en bois (côté droit)
    const poles = [];
    for (let i = hwyRange[0]; i <= hwyRange[hwyRange.length - 1]; i += 24){ const p = ptAt(i * ds, 34 + Math.sin(i * 0.37) * 0.6); p.y = gridH(p.x, p.z) - 0.3; poles.push(p); }
    poles.forEach((t, k) => { const a = poles[Math.max(0, k - 1)], b = poles[Math.min(poles.length - 1, k + 1)]; t.h = Math.atan2(b.x - a.x, b.z - a.z); t.lean = (hash2(k, 5) - 0.5) * 0.05; });
    const pg = (() => { const p = new THREE.CylinderGeometry(0.11, 0.16, 9.6, 7); p.translate(0, 4.8, 0); const arm = new THREE.BoxGeometry(2.4, 0.13, 0.13); arm.translate(0, 8.9, 0);
      const parts = [p, arm]; for (const x of [-1.0, 0, 1.0]){ const ins = new THREE.CylinderGeometry(0.05, 0.05, 0.22, 5); ins.translate(x, 9.06, 0); parts.push(ins); } return mergeGeometries(parts); })();
    inst(pg, stdMat('#5b4633', { roughness: 0.92 }), poles.map(t => ({ x: t.x, y: t.y, z: t.z, ry: t.h, rz: t.lean })), true, 'poles');
    for (let k = 0; k < poles.length - 1; k++){ const a = poles[k], b = poles[k + 1];
      for (const lx of [-1.0, 0, 1.0]){ wire(a.x + lx * Math.cos(a.h), a.y + 9.15, a.z - lx * Math.sin(a.h), b.x + lx * Math.cos(b.h), b.y + 9.15, b.z - lx * Math.sin(b.h), 0.7, 0.025, 8); } }
    const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(WIRE_P, 3)); wg.setIndex(WIRE_I); wg.computeVertexNormals();
    const wm = new THREE.Mesh(wg, new THREE.MeshBasicMaterial({ color: col('#2c2723'), side: THREE.DoubleSide })); wm.name = 'cables'; scene.add(wm);
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(LINE_P, 3));
    const lm = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: col('#3a332d'), transparent: true, opacity: 0.55 })); scene.add(lm);
  }
  // glissières (extérieur des virages de l'autoroute) + chevrons
  {
    const P = [], chev = [];
    const runs = side => { const out = []; let cur = null;
      for (const i of hwyRange){ const k = i % N, on = side * CURV[k] < -1 / 450 || false; const ok = side < 0 ? CURV[k] > 1 / 450 : CURV[k] < -1 / 450;
        if (ok){ if (!cur) cur = [i, i]; else cur[1] = i; } else if (cur){ out.push(cur); cur = null; } }
      if (cur) out.push(cur); return out.filter(r => r[1] - r[0] > 20).map(r => [r[0] - 15, r[1] + 15]); };
    for (const side of [-1, 1]) for (const [a, b] of runs(side)){
      const rail = [], prof = [[0, 0.52], [0.09, 0.6], [0.02, 0.68], [0.09, 0.76], [0, 0.84]];
      for (let i = a; i <= b; i++){ const k = (i % N + N) % N, lat = side * (HW[k] + SHO + 0.35), rx = -TZ[k], rz = TX[k], end = Math.min(i - a, b - i), drop = end < 3 ? (3 - end) * 0.25 : 0;
        rail.push(prof.map(([d, h]) => [X[k] + rx * (lat + side * d), Y[k] + h - drop, Z[k] + rz * (lat + side * d)]));
        if (i % 2 === 0){ const post = new THREE.BoxGeometry(0.14, 1.0, 0.12); post.rotateY(HD[k]); post.translate(X[k] + rx * (lat + side * 0.2), Y[k] + 0.3, Z[k] + rz * (lat + side * 0.2)); post.deleteAttribute('uv'); P.push(post); }
        if (side === -1 ? LL[k] > HW[k] + 1.75 : LR[k] > HW[k] + 1.75){ if (side < 0) LL[k] = HW[k] + 1.75; else LR[k] = HW[k] + 1.75; }
        if (Math.abs(CURV[k]) > 1 / 430 && i % 9 === 0 && end > 6) chev.push({ x: X[k] + rx * side * (HW[k] + SHO + 1.6), y: Y[k], z: Z[k] + rz * side * (HW[k] + SHO + 1.6), ry: HD[k] + Math.PI, sx: CURV[k] > 0 ? 1 : -1 });
      }
      const pos = [], idx = [];
      rail.forEach(r => r.forEach(p => pos.push(p[0], p[1], p[2])));
      for (let n = 0; n < rail.length - 1; n++) for (let c = 0; c < 4; c++){ const p = n * 5 + c, q = p + 5; idx.push(p, p + 1, q, p + 1, q + 1, q); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); P.push(g);
    }
    if (P.length){ const m = new THREE.Mesh(mergeGeometries(P.map(g => g.index ? g : g)), stdMat('#b4b8bb', { metalness: 0.85, roughness: 0.32, side: THREE.DoubleSide })); m.castShadow = true; m.receiveShadow = true; m.name = 'rails'; scene.add(m); }
    if (chev.length){
      const [c, g] = cnv(128, 160); g.fillStyle = '#f0b81c'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#121212';
      g.beginPath(); g.moveTo(30, 14); g.lineTo(62, 14); g.lineTo(100, 64); g.lineTo(62, 114); g.lineTo(30, 114); g.lineTo(68, 64); g.closePath(); g.fill();
      g.strokeStyle = '#121212'; g.lineWidth = 6; g.strokeRect(3, 3, 122, 122); g.fillStyle = '#6d7073'; g.fillRect(0, 128, 128, 32);
      const panel = new THREE.PlaneGeometry(0.8, 0.95); panel.translate(0, 1.75, 0.04); const uvp = panel.attributes.uv; for (let i = 0; i < uvp.count; i++) uvp.setY(i, 0.2 + uvp.getY(i) * 0.8);
      const back = new THREE.PlaneGeometry(0.8, 0.95); back.rotateY(Math.PI); back.translate(0, 1.75, 0.02); const uvb = back.attributes.uv; for (let i = 0; i < uvb.count; i++) uvb.setY(i, 0.05);
      const post = new THREE.BoxGeometry(0.07, 2.3, 0.07); post.translate(0, 1.15, 0); const uvq = post.attributes.uv; for (let i = 0; i < uvq.count; i++) uvq.setY(i, 0.08);
      const t = ctex(c); inst(mergeGeometries([panel, back, post]), new THREE.MeshStandardMaterial({ map: t, roughness: 0.5, side: THREE.DoubleSide }), chev, true, 'chevrons');
    }
  }
  prog(0.8);

  // végétation et rochers
  {
    const placeNear = (latMin, spread, farProb, okSec) => {
      for (let t = 0; t < 30; t++){
        const s = rr(0, L), k = idxOf(s), sd = R() < 0.5 ? -1 : 1, e = HW[k] + SHO;
        const lat = sd * (e + latMin + Math.abs(gauss()) * spread * (R() < farProb ? 5 : 1)), sp = sample(s), x = sp.x + sp.rx * lat, z = sp.z + sp.rz * lat;
        if (Math.hypot(x - CX, z - CZ) > 1420) continue;
        const p = nearB(x, z); if (p){ const kk = idxOf(p.s), a = Math.abs(p.lat), ee = HW[kk] + SHO;
          if (a < ee + latMin) continue; if (okSec && !okSec(kk, a)) continue;
          if (CF[kk] > 0.25 && a > WL[kk] - 0.3 && a < WL[kk] + 36) continue; }
        if (mesas.some(m => Math.hypot(m.x - x, m.z - z) < m.r * 0.8)) continue;
        return { x, z, y: gridH(x, z) };
      } return null; };
    // arbustes secs et touffes d'herbe en plans croisés (alpha testé)
    const cross = (w, h, n = 3) => { const parts = []; for (let i = 0; i < n; i++){ const p = new THREE.PlaneGeometry(w, h); p.translate(0, h / 2, 0); p.rotateY(i * Math.PI / n); parts.push(p); }
      const g = mergeGeometries(parts), nm = g.attributes.normal, ps = g.attributes.position, c = new Float32Array(ps.count * 3);
      for (let i = 0; i < nm.count; i++){ nm.setXYZ(i, 0, 1, 0); const k = 0.55 + 0.45 * clamp(ps.getY(i) / h, 0, 1); c[i * 3] = c[i * 3 + 1] = c[i * 3 + 2] = k; }
      g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g; };
    const shrubTex = (() => { const [c, g] = cnv(256, 256), R2 = mulberry32(5); g.lineCap = 'round'; const tips = [];
      const br = (x, y, a, len, w, d) => { const x2 = x + Math.sin(a) * len, y2 = y - Math.cos(a) * len; g.strokeStyle = `rgb(${78 + d * 12},${64 + d * 9},${50 + d * 7})`; g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
        if (d < 4){ const n = 2 + (R2() * 2 | 0); for (let k = 0; k < n; k++) br(x2, y2, a + (R2() - 0.5) * 1.2, len * (0.62 + R2() * 0.2), w * 0.66, d + 1); } else tips.push([x2, y2]); };
      for (let k = 0; k < 8; k++) br(128 + (R2() - 0.5) * 24, 255, (R2() - 0.5) * 1.7, 38 + R2() * 26, 5, 0);
      const lc2 = ['#7f8752', '#959058', '#a79a68', '#b9a57a', '#6d7848'];
      tips.forEach(([x, y]) => { for (let k = 0; k < 5; k++){ g.fillStyle = lc2[(R2() * lc2.length) | 0]; g.beginPath(); g.ellipse(x + (R2() - 0.5) * 14, y + (R2() - 0.5) * 12, 2 + R2() * 4, 2 + R2() * 3, R2() * 3, 0, TAU); g.fill(); } });
      return ctex(c); })();
    const grassTex = (() => { const [c, g] = cnv(256, 128), R2 = mulberry32(6); g.lineCap = 'round';
      for (let k = 0; k < 120; k++){ const x = 128 + (R2() - 0.5) * 150, h = 50 + R2() * 70, bend = (R2() - 0.5) * 60, v = 0.75 + R2() * 0.35;
        g.strokeStyle = `rgb(${(196 * v) | 0},${(168 * v) | 0},${(110 * v) | 0})`; g.lineWidth = 1.5 + R2() * 1.5; g.beginPath(); g.moveTo(x, 128); g.quadraticCurveTo(x + bend * 0.3, 128 - h * 0.6, x + bend, 128 - h); g.stroke(); }
      return ctex(c); })();
    const vegMat = map => new THREE.MeshStandardMaterial({ map, alphaTest: 0.45, side: THREE.DoubleSide, vertexColors: true, roughness: 0.95 });
    const shr = [], grs = [], tint = new THREE.Color();
    const nS = Math.round(4200 * Q.grass), nG = Math.round(7000 * Q.grass);
    for (let n = 0; n < nS; n++){ const p = placeNear(1.5, 45, 0.3); if (!p) continue; const s = rr(0.7, 1.8); tint.setHSL(rr(0.08, 0.16), rr(0.15, 0.35), rr(0.42, 0.6));
      shr.push({ x: p.x, y: p.y - 0.08, z: p.z, ry: rr(0, TAU), sx: s * rr(1, 1.5), sy: s, sz: s * rr(1, 1.5), c: tint.clone().multiplyScalar(1.6) }); }
    for (let n = 0; n < nG; n++){ const p = placeNear(0.6, 25, 0.25); if (!p) continue; const s = rr(0.5, 1.1); tint.setHSL(rr(0.1, 0.13), rr(0.3, 0.5), rr(0.5, 0.68));
      grs.push({ x: p.x, y: p.y - 0.05, z: p.z, ry: rr(0, TAU), sx: s, sy: s * rr(0.7, 1.2), sz: s, c: tint.clone().multiplyScalar(1.5) }); }
    inst(cross(1.6, 1.2), vegMat(shrubTex), shr, true, 'shrubs');
    inst(cross(1.1, 0.6, 2), vegMat(grassTex), grs, false, 'grass');
    // yuccas et saguaros
    const yuccaGeo = (() => { const parts = []; const tr = new THREE.CylinderGeometry(0.13, 0.2, 1.1, 6); tr.translate(0, 0.55, 0); parts.push(paint(tr, '#6b5a44'));
      const sk = new THREE.ConeGeometry(0.34, 0.7, 7, 1, true); sk.translate(0, 0.8, 0); parts.push(paint(sk, '#8a7350'));
      for (let k = 0; k < 24; k++){ const lf = new THREE.ConeGeometry(0.045, 1.0, 3); lf.translate(0, 0.5, 0); lf.rotateX(0.15 + (k % 6) * 0.17); lf.rotateY(k * 2.399); lf.translate(0, 1.05, 0); parts.push(paint(lf, k % 3 ? '#5f7136' : '#808446')); }
      return mergeGeometries(parts); })();
    const sagGeo = (() => { const parts = [], C = '#56703c';
      const cyl = (r, h, x, y, z, rz = 0) => { const g = new THREE.CylinderGeometry(r * 0.9, r, h, 9); if (rz) g.rotateZ(rz); g.translate(x, y, z); parts.push(paint(g, C)); };
      const cap = (r, x, y, z) => { const g = new THREE.SphereGeometry(r * 0.9, 9, 4, 0, TAU, 0, Math.PI / 2); g.translate(x, y, z); parts.push(paint(g, C)); };
      cyl(0.34, 5.4, 0, 2.7, 0); cap(0.34, 0, 5.4, 0);
      cyl(0.2, 0.9, 0.6, 2.2, 0, Math.PI / 2); cyl(0.21, 1.9, 1.05, 3.1, 0); cap(0.21, 1.05, 4.05, 0);
      cyl(0.18, 0.7, -0.5, 3.0, 0, Math.PI / 2); cyl(0.19, 1.4, -0.85, 3.65, 0); cap(0.19, -0.85, 4.35, 0);
      return mergeGeometries(parts); })();
    const yu = [], sg = [];
    const notCanyon = (k, a) => CF[k] < 0.2 && a > HW[k] + 10;
    for (let n = 0; n < Math.round(240 * Q.props); n++){ const p = placeNear(9, 60, 0.4, notCanyon); if (!p) continue; const s = rr(0.8, 1.6); yu.push({ x: p.x, y: p.y - 0.1, z: p.z, ry: rr(0, TAU), s, c: tint.setHSL(0, 0, rr(0.85, 1.15)).clone() }); }
    for (let n = 0; n < Math.round(80 * Q.props); n++){ const p = placeNear(14, 70, 0.4, notCanyon); if (!p) continue; const s = rr(0.7, 1.4); sg.push({ x: p.x, y: p.y - 0.2, z: p.z, ry: rr(0, TAU), s, c: tint.setHSL(0, 0, rr(0.85, 1.1)).clone() }); }
    inst(yuccaGeo, stdMat('#ffffff', { vertexColors: true, roughness: 0.8 }), yu, true, 'yucca');
    inst(sagGeo, stdMat('#ffffff', { vertexColors: true, roughness: 0.7 }), sg, true, 'saguaro');
    // rochers : 2 formes facettées
    const rockG = seed => { const g = new THREE.IcosahedronGeometry(1, 1), p = g.attributes.position;
      for (let i = 0; i < p.count; i++){ const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 0.75 + 0.5 * noise3(x * 1.3 + seed, y * 1.3, z * 1.3); p.setXYZ(i, x * k, y * k * 0.7, z * k); }
      g.computeVertexNormals(); return g; };
    const rmat = new THREE.MeshStandardMaterial({ map: T_ROCK, normalMap: T_ROCKN, roughness: 0.92 });
    const rk = [[], []];
    for (let n = 0; n < Math.round(320 * Q.props); n++){ const p = placeNear(26, 80, 0.4, (k, a) => a > Math.min(LL[k], LR[k]) + 1); if (!p) continue; const s = rr(0.4, 1) ** 2 * 3.2 + 0.3;
      rk[n & 1].push({ x: p.x, y: p.y - s * 0.25, z: p.z, ry: rr(0, TAU), sx: s * rr(0.8, 1.4), sy: s, sz: s * rr(0.8, 1.3), c: tint.setHSL(rr(0.03, 0.06), rr(0.3, 0.5), rr(0.55, 0.8)).clone() }); }
    // éboulis au pied des parois
    for (let i = iC0; i < iC1; i += Math.max(1, Math.round(3 / Q.props))){ const k = i % N; if (CF[k] < 0.5) continue;
      for (const sd of [-1, 1]){ if (R() < 0.35) continue; const s = rr(0.5, 1.1), lat = sd * (WL[k] + 0.6 + rr(0, 0.8) + s * 0.4), x = X[k] - TZ[k] * lat, z = Z[k] + TX[k] * lat;
        rk[i & 1].push({ x, y: Y[k] - s * 0.12, z, ry: rr(0, TAU), sx: s * rr(1, 1.6), sy: s, sz: s * rr(0.9, 1.4), c: tint.setHSL(rr(0.03, 0.06), rr(0.35, 0.5), rr(0.6, 0.85)).clone() }); } }
    // blocs autour des mesas
    mesas.forEach(m => { for (let n = 0; n < 10 * Q.props; n++){ const a = rr(0, TAU), r = m.r * rr(0.9, 1.3), x = m.x + Math.cos(a) * r, z = m.z + Math.sin(a) * r, s = rr(2, 7);
      rk[n & 1].push({ x, y: gridH(x, z) - s * 0.3, z, ry: rr(0, TAU), sx: s, sy: s * rr(0.6, 1), sz: s * rr(0.8, 1.2), c: tint.setHSL(0.04, 0.4, rr(0.6, 0.8)).clone() }); } });
    inst(rockG(1.7), rmat, rk[0], true, 'rocks0'); inst(rockG(9.1), rmat, rk[1], true, 'rocks1');
  }
  prog(0.9);

  /* ---------- 7. Arche d'arrivée holographique ---------- */
  let holoMat = null, stripMat = null;
  {
    const sp = sample(0), hw0 = sp.width / 2, px = hw0 + 2.6, grp = new THREE.Group();
    grp.position.set(sp.x, sp.y, sp.z); grp.rotation.y = Math.atan2(sp.tx, sp.tz);
    const dark = [], glow = [];
    const bx = (w, h, d, x, y, z, arr, c) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); if (c) paint(g, '#000').attributes.color.array.forEach((_, i, a) => { a[i] = c[i % 3]; }); else g.deleteAttribute('uv'); arr.push(g); };
    const OR = [5, 1.5, 0.35], CY = [0.5, 2.6, 5];
    for (const sx of [-1, 1]){
      bx(1.9, 0.7, 2.3, sx * px, 0.35, 0, dark); bx(1.15, 12.2, 1.5, sx * px, 6.4, 0, dark);
      bx(0.12, 11, 0.12, sx * (px - 0.6), 6.4, -0.55, glow, OR); bx(0.12, 11, 0.12, sx * (px - 0.6), 6.4, 0.55, glow, OR);
      bx(0.1, 0.1, 1.6, sx * (px - 0.6), 1.0, 0, glow, CY);
    }
    bx(2 * px + 1.15, 1.2, 1.3, 0, 12.1, 0, dark); bx(2 * px - 1, 0.25, 0.9, 0, 11.35, 0, dark);
    bx(2 * px - 1.4, 0.08, 0.08, 0, 11.2, -0.42, glow, CY); bx(2 * px - 1.4, 0.08, 0.08, 0, 11.2, 0.42, glow, CY);
    const md = new THREE.Mesh(mergeGeometries(dark), stdMat('#1b1d22', { metalness: 0.65, roughness: 0.32 })); md.castShadow = true; md.receiveShadow = true; grp.add(md);
    stripMat = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: true }); grp.add(new THREE.Mesh(mergeGeometries(glow), stripMat));
    // texture : R = texte, G = cadre/grille, B = halo
    const [c, g] = cnv(1024, 256); g.fillStyle = '#000'; g.fillRect(0, 0, 1024, 256);
    g.strokeStyle = '#00ff00'; g.lineWidth = 6; g.strokeRect(10, 10, 1004, 236); g.lineWidth = 2; for (let x = 40; x < 1024; x += 40){ g.beginPath(); g.moveTo(x, 236); g.lineTo(x, 246); g.stroke(); }
    g.fillStyle = '#00ff00'; for (const x0 of [40, 900]) for (let k = 0; k < 3; k++){ g.beginPath(); g.moveTo(x0 + k * 26, 90); g.lineTo(x0 + k * 26 + 18, 128); g.lineTo(x0 + k * 26, 166); g.lineTo(x0 + k * 26 + 8, 166); g.lineTo(x0 + k * 26 + 26, 128); g.lineTo(x0 + k * 26 + 8, 90); g.fill(); }
    g.font = 'italic 800 150px "Barlow Condensed", Rajdhani, Arial Narrow, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = '#0000ff'; g.shadowBlur = 30; g.fillStyle = '#ff0000'; g.fillText('ARRIVÉE', 512, 132); g.shadowBlur = 0;
    g.globalCompositeOperation = 'lighter'; g.fillStyle = '#0000ff'; g.globalAlpha = 0.6; g.fillText('ARRIVÉE', 512, 132); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    const tex = ctex(c, { srgb: false });
    holoMat = new THREE.ShaderMaterial({
      uniforms: { map: { value: tex }, uT: { value: 0 } }, transparent: true, depthWrite: false, side: THREE.FrontSide,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform sampler2D map; uniform float uT; varying vec2 vUv;
        float h1(float n){ return fract(sin(n) * 43758.5453); }
        void main(){
          vec2 uv = vUv; float gl = step(0.93, h1(floor(uT * 9.0)));
          uv.x += gl * (h1(floor(uv.y * 18.0) + floor(uT * 30.0)) - 0.5) * 0.04;
          vec4 t = texture2D(map, uv);
          float scan = 0.72 + 0.28 * sin(uv.y * 260.0 - uT * 7.0);
          float sweep = smoothstep(0.08, 0.0, abs(fract(uv.x * 0.6 - uT * 0.25) - 0.5) - 0.42);
          float fl = 0.92 + 0.08 * sin(uT * 37.0) * sin(uT * 13.0);
          vec3 c = t.r * vec3(3.4, 1.9, 0.6) + t.b * vec3(1.6, 0.5, 0.1) + t.g * vec3(0.25, 1.3, 2.3);
          c *= scan * fl * (1.0 + sweep * 0.8);
          c += vec3(0.02, 0.06, 0.1) * (0.6 + 0.4 * sin(uv.y * 900.0)) * smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.92, uv.y);
          float a = clamp(0.5 + t.r * 0.5 + t.g * 0.5 + t.b * 0.4, 0.0, 1.0);
          gl_FragColor = vec4(c + vec3(0.006, 0.02, 0.04), a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }` });
    const pw = 2 * px - 1.6, ph = pw / 4.6;
    const p1 = new THREE.PlaneGeometry(pw, ph); p1.rotateY(Math.PI); const p2 = new THREE.PlaneGeometry(pw, ph);
    const holo = new THREE.Mesh(mergeGeometries([p1, p2]), holoMat); holo.position.y = 11.0 - ph / 2 - 0.1; holo.renderOrder = 5; grp.add(holo);
    grp.name = 'arch'; scene.add(grp);
  }
  prog(1);

  /* ---------- 8. API ---------- */
  let time = 0; const GS = {}, NN = { x: 0, y: 1, z: 0 };
  const track = {
    length: L,
    sample,
    project,
    limits(s){ s = wrapS(s); const f = s / ds; let i = Math.floor(f); const t = f - i; i %= N; const j = (i + 1) % N; return { left: LL[i] + (LL[j] - LL[i]) * t, right: LR[i] + (LR[j] - LR[i]) * t }; },
    startSlot(i){ const p = slotPos(clamp(i | 0, 0, 5)), sp = sample(p.s); return { x: sp.x + sp.rx * p.lat, y: sp.y, z: sp.z + sp.rz * p.lat, heading: Math.atan2(sp.tx, sp.tz) }; },
    polyline(n = 200){ const out = [], sp = {}; for (let k = 0; k < n; k++){ sample(k / n * L, sp); out.push([sp.x, sp.z]); } return out; },
  };
  function ground(x, z, hintS){
    const p = project(x, z, hintS); sample(p.s, GS);
    const a = Math.abs(p.lat), hw = GS.width / 2, e = hw + SHO, out = { y: GS.y, surface: GS.surface, s: p.s, lat: p.lat, nx: 0, ny: 1, nz: 0 };
    const gx = -GS.grade * GS.tx, gz = -GS.grade * GS.tz, gl = Math.hypot(gx, 1, gz);
    if (a <= e){ out.surface = a <= hw ? GS.surface : 'shoulder'; out.nx = gx / gl; out.ny = 1 / gl; out.nz = gz / gl; return out; }
    const tg = gridH(x, z, NN);
    if (a <= e + VERGE){ const yo = Math.max(GS.y - 1.5, Math.min(GS.y - 0.05, tg + 0.04)), t = (a - e) / VERGE; out.y = lerp(GS.y - 0.02, yo, t); out.surface = 'shoulder';
      out.nx = lerp(gx / gl, NN.x, t); out.ny = lerp(1 / gl, NN.y, t); out.nz = lerp(gz / gl, NN.z, t); const l = Math.hypot(out.nx, out.ny, out.nz); out.nx /= l; out.ny /= l; out.nz /= l; return out; }
    out.y = tg; out.surface = 'sand'; out.nx = NN.x; out.ny = NN.y; out.nz = NN.z; return out;
  }
  function update(dt, camPos){
    time += dt || 0;
    if (holoMat) holoMat.uniforms.uT.value = time;
  }
  return { track, ground, update, terrainHeight: gridH, sections: { canyon: [iC0 * ds, iC1 * ds], dirt: [iC1 * ds, iD1 * ds] } };
}
