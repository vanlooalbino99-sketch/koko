/* ================== Voitures : modèles 3D, physique, IA ================== */

const CAR_TYPES = {
  kitsune: { id: 'kitsune', name: 'Kitsune S15', cls: 'Coupé de drift',
    stats: { vitesse: 0.6, accel: 0.72, adherence: 0.66, derapage: 0.96 },
    paints: ['#c3101c', '#f1f0ec', '#16181d', '#f2b705', '#1c63c9', '#ff5fa2'], defaultPaint: '#c3101c',
    phys: { vmax: 262 / 3.6, acc: 9.4, grip: 12.4, driftYaw: 1.05, driftLat: 1.55, dirt: 0, steer: 0.62 },
    dims: { length: 4.45, width: 1.80, height: 1.28, wheelbase: 2.525, track: 1.52, wheelRadius: 0.32 } },
  stallion: { id: 'stallion', name: 'Stallion 67', cls: 'Muscle car fastback',
    stats: { vitesse: 0.95, accel: 0.86, adherence: 0.5, derapage: 0.72 },
    paints: ['#121316', '#0f4a2e', '#b8860b', '#7c0f14', '#1b2f6b', '#d8d4c8'], defaultPaint: '#121316',
    phys: { vmax: 288 / 3.6, acc: 10.4, grip: 11.4, driftYaw: 0.9, driftLat: 2.0, dirt: 0, steer: 0.56 },
    dims: { length: 4.72, width: 1.86, height: 1.30, wheelbase: 2.74, track: 1.58, wheelRadius: 0.34 } },
  taiga: { id: 'taiga', name: 'Taiga R', cls: 'Compacte de rallye',
    stats: { vitesse: 0.42, accel: 0.84, adherence: 0.9, derapage: 0.78 },
    paints: ['#2a2f36', '#e9e9e4', '#0b3d91', '#ff6a00', '#3b4a2a', '#8a1020'], defaultPaint: '#2a2f36',
    phys: { vmax: 248 / 3.6, acc: 10.2, grip: 13.4, driftYaw: 0.98, driftLat: 1.85, dirt: 0.5, steer: 0.6 },
    dims: { length: 4.20, width: 1.84, height: 1.47, wheelbase: 2.56, track: 1.56, wheelRadius: 0.33 } },
  hyperion: { id: 'hyperion', name: 'Hyperion E8', cls: 'Supercar hybride widebody',
    stats: { vitesse: 0.95, accel: 0.9, adherence: 0.85, derapage: 0.7 },
    paints: ['#1b1c20', '#e9b81c', '#f1f0ec', '#0e3a8c', '#7a0f2a', '#5b6068'], defaultPaint: '#1b1c20',
    phys: { vmax: 300 / 3.6, acc: 10.8, grip: 13.2, driftYaw: 0.92, driftLat: 1.7, dirt: 0, steer: 0.58 },
    dims: { length: 4.69, width: 2.05, height: 1.2, wheelbase: 2.8, track: 1.72, wheelRadius: 0.35 } },
};

// Formes : profils en fonction de t (0 = arrière, 1 = avant), hauteurs en mètres
const CC_SPEC = {
  kitsune: { num: 15, zR: -2.19, zF: 2.26, hw: 0.885, mF: 3.2, mR: 5, flare: 0.035, nTop: 5, nBot: 8, tumble: 0.1,
    top: [[0, 0.62], [0.02, 0.8], [0.06, 0.9], [0.13, 0.95], [0.2, 0.955], [0.32, 0.95], [0.6, 0.93], [0.66, 0.9], [0.85, 0.8], [0.95, 0.72], [0.99, 0.62], [1, 0.56]],
    bot: [[0, 0.36], [0.04, 0.22], [0.1, 0.15], [0.9, 0.15], [0.96, 0.2], [1, 0.3]],
    cab: { tA: 0.63, tA2: 0.5, tB: 0.27, tC: 0.13, roofH: 1.28, belt: 0.8, roof: 0.62, rearK: 0.6, tS0: 0.26, tS1: 0.62, bp: 0.37 },
    tire: { w: 0.245, rimR: 0.235 }, rim: { color: '#c9a34e', metal: 1, rough: 0.28, n: 6, split: true, sw: 0.02 },
    exh: [[-0.46, 0.27, 0.06]] },
  stallion: { num: 67, zR: -2.3, zF: 2.42, hw: 0.92, mF: 9, mR: 8, flare: 0.02, nTop: 6, nBot: 9, tumble: 0.07,
    top: [[0, 0.72], [0.015, 0.86], [0.04, 0.93], [0.07, 0.95], [0.2, 0.94], [0.6, 0.92], [0.9, 0.9], [0.975, 0.88], [0.993, 0.84], [1, 0.8]],
    bot: [[0, 0.36], [0.03, 0.24], [0.08, 0.18], [0.92, 0.18], [0.97, 0.26], [1, 0.32]],
    cab: { tA: 0.62, tA2: 0.5, tB: 0.38, tC: 0.07, roofH: 1.3, belt: 0.84, roof: 0.64, rearK: 0.52, tS0: 0.385, tS1: 0.61, bp: 0 },
    tire: { w: 0.26, rimR: 0.215 }, rim: { color: '#dcdde0', metal: 1, rough: 0.1, n: 5, split: false, sw: 0.05 },
    exh: [[-0.52, 0.27, 0.05], [0.52, 0.27, 0.05]] },
  taiga: { num: 7, zR: -2.0, zF: 2.2, hw: 0.91, mF: 3.6, mR: 7, flare: 0.05, nTop: 5, nBot: 7, tumble: 0.11,
    top: [[0, 0.8], [0.02, 0.95], [0.05, 1.0], [0.15, 1.0], [0.6, 0.98], [0.68, 0.95], [0.88, 0.86], [0.96, 0.78], [1, 0.62]],
    bot: [[0, 0.42], [0.04, 0.28], [0.1, 0.22], [0.9, 0.22], [0.96, 0.28], [1, 0.38]],
    cab: { tA: 0.68, tA2: 0.54, tB: 0.1, tC: 0.035, roofH: 1.46, belt: 0.82, roof: 0.66, rearK: 0.8, tS0: 0.115, tS1: 0.67, bp: 0.33 },
    tire: { w: 0.235, rimR: 0.21 }, rim: { color: '#ecebe6', metal: 0.25, rough: 0.35, n: 8, split: false, sw: 0.024 },
    exh: [[-0.42, 0.3, 0.07]] },
  // supercar hybride : très basse, large, nez plongeant, poupe haute
  hyperion: { num: 8, zR: -2.3, zF: 2.39, hw: 0.95, mF: 3.0, mR: 4.2, flare: 0.075, nTop: 4, nBot: 8, tumble: 0.16,
    top: [[0, 0.74], [0.02, 0.86], [0.05, 0.92], [0.12, 0.95], [0.25, 0.94], [0.45, 0.9], [0.6, 0.88], [0.75, 0.855], [0.83, 0.82], [0.9, 0.74], [0.96, 0.62], [1, 0.5]],
    bot: [[0, 0.34], [0.04, 0.2], [0.1, 0.12], [0.9, 0.12], [0.96, 0.17], [1, 0.24]],
    cab: { tA: 0.67, tA2: 0.53, tB: 0.31, tC: 0.15, roofH: 1.2, belt: 0.72, roof: 0.55, rearK: 0.55, tS0: 0.31, tS1: 0.645, bp: 0 },
    tire: { w: 0.3, rimR: 0.272 }, rim: { color: '#141518', metal: 0.75, rough: 0.32, n: 7, split: true, sw: 0.022 }, caliper: '#f2c21b',
    exh: [[-0.11, 0.3, 0.055], [0.11, 0.3, 0.055]] },
};

/* ---------- Outils de forme ---------- */
function cc_curve(pts){
  const n = pts.length;
  return t => {
    if (t <= pts[0][0]) return pts[0][1];
    if (t >= pts[n - 1][0]) return pts[n - 1][1];
    let i = 0; while (i < n - 2 && t > pts[i + 1][0]) i++;
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    const dt = p2[0] - p1[0], u = (t - p1[0]) / dt;
    const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0] || 1) * dt, m2 = (p3[1] - p1[1]) / (p3[0] - p1[0] || 1) * dt;
    const u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * p1[1] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[1] + (u3 - u2) * m2;
  };
}
function cc_shape(sp, D){
  const T = cc_curve(sp.top), B = cc_curve(sp.bot), L = sp.zF - sp.zR;
  const tf = (D.wheelbase / 2 - sp.zR) / L, tr = (-D.wheelbase / 2 - sp.zR) / L;
  const W = t => {
    const m = t > 0.5 ? sp.mF : sp.mR, a = Math.min(1, Math.abs(2 * t - 1));
    const w = sp.hw * Math.pow(Math.max(0, 1 - Math.pow(a, m)), 1 / m);
    return w + sp.flare * (Math.exp(-(((t - tf) / 0.075) ** 2)) + Math.exp(-(((t - tr) / 0.075) ** 2))) * (w / sp.hw);
  };
  const tOf = z => clamp((z - sp.zR) / L, 0, 1), zOf = t => sp.zR + t * L;
  // demi-largeur autorisée à la hauteur y (section superellipse)
  const halfAt = (t, y) => {
    const b = B(t), tp = T(t); if (y < b || y > tp) return -1;
    const yc = (b + tp) / 2, hh = (tp - b) / 2, s = (y - yc) / hh, n = s > 0 ? sp.nTop : sp.nBot;
    return W(t) * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(s), n)), 1 / n) * (1 - sp.tumble * Math.max(0, s) ** 2) * (1 - 0.05 * Math.max(0, -s) ** 3);
  };
  // z du bord avant/arrière de la carrosserie pour (x, y)
  const edgeZ = (x, y, front) => {
    let a = 0.5, b = front ? 1 : 0;
    for (let i = 0; i < 26; i++){ const m = (a + b) / 2; if (halfAt(m, y) >= Math.abs(x)) a = m; else b = m; }
    return zOf(a);
  };
  // hauteur du dessus de caisse à l'abscisse x
  const bodyY = (t, x) => {
    const b = B(t), tp = T(t), yc = (b + tp) / 2, hh = (tp - b) / 2, w = W(t); let s = 0.9;
    for (let i = 0; i < 4; i++){ const we = w * (1 - sp.tumble * s * s), r = Math.min(1, Math.abs(x) / we); s = Math.pow(Math.max(0, 1 - Math.pow(r, sp.nTop)), 1 / sp.nTop); }
    return yc + hh * s;
  };
  return { T, B, W, L, tOf, zOf, halfAt, edgeZ, bodyY, tf, tr };
}

/* ---------- Accumulateurs de géométrie (fusion par matériau) ---------- */
function cc_acc(){ return { p: [], n: [], u: [] }; }
function cc_geoOf(a){
  if (!a.p.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a.p, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(a.n, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(a.u, 2));
  g.computeBoundingSphere(); return g;
}
// ajoute une géométrie THREE (déjà transformée) ; uv : null = conserver, [u,v] = uv constante
function cc_add(a, geo, uv){
  const g = geo.index ? geo.toNonIndexed() : geo;
  if (!g.attributes.normal) g.computeVertexNormals();
  const P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv;
  for (let i = 0; i < P.count; i++){
    a.p.push(P.getX(i), P.getY(i), P.getZ(i)); a.n.push(N.getX(i), N.getY(i), N.getZ(i));
    if (uv) a.u.push(uv[0], uv[1]); else if (U) a.u.push(U.getX(i), U.getY(i)); else a.u.push(0, 0);
  }
}
const cc_M4 = (x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => new THREE.Matrix4().compose(V3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), V3(sx, sy, sz));

/* ---------- Textures partagées ---------- */
const CC_CACHE = {};
function cc_flakeTex(){
  if (!CC_CACHE.flake){
    const r = mulberry32(99);
    const c = normalFromHeight(256, () => r(), 3.5);
    CC_CACHE.flake = ctex(c, { srgb: false, repeat: [22, 22] });
  }
  return CC_CACHE.flake;
}
function cc_tireTex(){
  if (!CC_CACHE.tire){
    const [c, g] = cnv(2048, 256);
    g.fillStyle = '#19191b'; g.fillRect(0, 0, 2048, 256);
    // bande de roulement (v ∈ [6/14, 8/14])
    const y0 = (1 - 8 / 14) * 256, y1 = (1 - 6 / 14) * 256;
    g.fillStyle = '#141415'; g.fillRect(0, y0, 2048, y1 - y0);
    g.strokeStyle = '#0a0a0b'; g.lineWidth = 5;
    for (let x = 0; x < 2048; x += 28){ g.beginPath(); g.moveTo(x, y0); g.lineTo(x + 14, (y0 + y1) / 2); g.lineTo(x, y1); g.stroke(); }
    g.fillStyle = '#0c0c0d'; g.fillRect(0, y0 + (y1 - y0) * 0.3, 2048, 4); g.fillRect(0, y0 + (y1 - y0) * 0.68, 2048, 4);
    // flanc extérieur (v ∈ [1/14, 4/14]) : marquage
    const yc = (1 - 2.6 / 14) * 256;
    g.font = 'bold 30px Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let k = 0; k < 2; k++){
      g.fillStyle = '#9a9a9c'; g.fillText('NITRO  RACING', 512 + k * 1024, yc);
      g.fillStyle = '#5e5e60'; g.font = 'bold 20px Arial, sans-serif'; g.fillText('245/40 ZR18  SEMI-SLICK', 512 + k * 1024 + 330, yc); g.fillText('KOKO TYRES', 512 + k * 1024 - 330, yc);
      g.font = 'bold 30px Arial, sans-serif';
    }
    CC_CACHE.tire = ctex(c);
  }
  return CC_CACHE.tire;
}

function cc_carbonTex(){
  if (!CC_CACHE.carbon){
    // sergé 2x2 : bandes croisées en escalier
    const [c, g] = cnv(128, 128), s = 16;
    g.fillStyle = '#08090b'; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++){
      const hz = ((i + (j >> 1) * 0 + j) >> 1) % 2 === 0, x = i * s, y = j * s;
      const gr = hz ? g.createLinearGradient(0, y, 0, y + s) : g.createLinearGradient(x, 0, x + s, 0);
      gr.addColorStop(0, '#0d0e11'); gr.addColorStop(0.5, '#3a3d45'); gr.addColorStop(1, '#0d0e11');
      g.fillStyle = gr; g.fillRect(x + 0.5, y + 0.5, s - 1, s - 1);
    }
    CC_CACHE.carbon = ctex(c, { repeat: [7, 7] });
  }
  return CC_CACHE.carbon;
}
function cc_fireTex(){
  if (!CC_CACHE.fire){
    // flamme : chaude à la base (bas de l'image), effilochée vers la pointe
    const [c, g] = cnv(64, 256), img = g.createImageData(64, 256);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 64; x++){
      const v = 1 - y / 255, n = fbm2(x / 9, y / 20, 3), a = Math.max(0, Math.pow(1 - v, 1.3) * (0.45 + 0.9 * n) - v * 0.25);
      const i = (y * 64 + x) * 4, h = Math.min(1, a * 1.4);
      img.data[i] = 255; img.data[i + 1] = 120 + 135 * h; img.data[i + 2] = 40 + 200 * h * h; img.data[i + 3] = Math.min(255, a * 300);
    }
    g.putImageData(img, 0, 0); CC_CACHE.fire = ctex(c);
  }
  return CC_CACHE.fire;
}
function cc_glowTex(){
  if (!CC_CACHE.glow){
    const [c, g] = cnv(128, 128), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,240,200,1)'); gr.addColorStop(0.25, 'rgba(255,150,40,0.7)'); gr.addColorStop(1, 'rgba(255,60,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); CC_CACHE.glow = ctex(c);
  }
  return CC_CACHE.glow;
}
// livrée Hyperion : base graphite, grands panneaux jaunes, géométrie blanche/grise, filets rose fluo et orange
function cc_liveryHyp(g, sp, light, zOf, band, physSide, physTop, seams){
  const Y = light ? '#1b1c20' : '#e9b81c', G2 = light ? '#e9b81c' : '#25272d', W = '#ecebe8', GR = '#8e929b', PK = '#ff2bd6', OR = '#ff7a1a';
  const poly = (pts, fill) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); g.fillStyle = fill; g.fill(); };
  const line = (pts, c, w) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(); };
  const tri = (z, y, r, a) => poly([[z + Math.cos(a) * r, y + Math.sin(a) * r], [z + Math.cos(a + 2.1) * r, y + Math.sin(a + 2.1) * r], [z + Math.cos(a + 4.2) * r, y + Math.sin(a + 4.2) * r]], PK);
  for (const s of [0, 1]) band(s, () => {
    physSide(s);
    // panneau jaune de porte, biseauté
    poly([[zOf(0.33), 0.1], [zOf(0.75), 0.1], [zOf(0.82), 0.5], [zOf(0.72), 1.0], [zOf(0.42), 1.0], [zOf(0.36), 0.62]], Y);
    // bandes sombres obliques dans le jaune
    poly([[zOf(0.5), 0.1], [zOf(0.545), 0.1], [zOf(0.47), 1.0], [zOf(0.425), 1.0]], G2);
    poly([[zOf(0.6), 0.1], [zOf(0.67), 0.1], [zOf(0.6), 1.0], [zOf(0.53), 1.0]], G2);
    // aile avant et bouclier arrière jaunes
    poly([[zOf(0.86), 0.26], [zOf(1.03), 0.26], [zOf(1.03), 0.72], [zOf(0.9), 0.82]], Y);
    poly([[zOf(-0.03), 0.22], [zOf(0.11), 0.22], [zOf(0.15), 0.6], [zOf(-0.03), 0.66]], Y);
    // géométrie blanche / grise sur l'aile arrière
    poly([[zOf(0.13), 0.66], [zOf(0.3), 0.52], [zOf(0.33), 0.6], [zOf(0.17), 0.8]], W);
    poly([[zOf(0.19), 0.24], [zOf(0.31), 0.24], [zOf(0.27), 0.44], [zOf(0.16), 0.5]], GR);
    poly([[zOf(0.76), 0.58], [zOf(0.87), 0.6], [zOf(0.85), 0.68], [zOf(0.74), 0.66]], GR);
    poly([[zOf(0.9), 0.2], [zOf(0.98), 0.2], [zOf(0.96), 0.28], [zOf(0.88), 0.28]], W);
    // filets rose fluo et orange
    line([[zOf(0.03), 0.7], [zOf(0.3), 0.56], [zOf(0.5), 0.3], [zOf(0.6), 0.14]], PK, 0.02);
    line([[zOf(0.06), 0.75], [zOf(0.33), 0.61], [zOf(0.56), 0.27], [zOf(0.64), 0.15]], OR, 0.011);
    line([[zOf(0.62), 1.0], [zOf(0.79), 0.44], [zOf(1.03), 0.4]], PK, 0.014);
    line([[zOf(0.36), 0.2], [zOf(0.9), 0.2]], OR, 0.009);
    line([[zOf(0.7), 0.95], [zOf(0.84), 0.62]], W, 0.008);
    tri(zOf(0.25), 0.38, 0.035, 0.4); tri(zOf(0.71), 0.32, 0.03, 1.2); tri(zOf(0.05), 0.5, 0.03, 2.2); tri(zOf(0.93), 0.52, 0.025, 0.1);
    g.setTransform(1, 0, 0, 1, 0, 0); seams(s);
  });
  // dessus : capot jaune à bande sombre, poupe jaune, filets roses
  g.save(); g.beginPath(); g.rect(0, 640, 1024, 320); g.clip(); physTop();
  poly([[zOf(0.74), -1.2], [zOf(1.03), -1.2], [zOf(1.03), 1.2], [zOf(0.74), 1.2]], Y);
  poly([[zOf(0.74), -0.16], [zOf(1.03), -0.07], [zOf(1.03), 0.07], [zOf(0.74), 0.16]], G2);
  poly([[zOf(-0.03), -1.2], [zOf(0.1), -1.2], [zOf(0.1), 1.2], [zOf(-0.03), 1.2]], Y);
  for (const k of [-1, 1]){ line([[zOf(0.74), k * 0.2], [zOf(1.02), k * 0.1]], PK, 0.015); line([[zOf(0.12), k * 0.55], [zOf(0.45), k * 0.4]], OR, 0.012); tri(zOf(0.86), k * 0.5, 0.04, 0.3); }
  g.restore();
}

/* ---------- Livrée peinte (atlas 1024² : côté droit, côté gauche, dessus, bande réservée) ---------- */
function cc_livery(id, paint, num, rival, sp){
  const [c, g] = cnv(1024, 1024), L = sp.zF - sp.zR, MPV = 320 / 1.5, R = mulberry32(id.length * 977 + num * 31 + (rival ? 5 : 0));
  const pc = col(paint), lum = 0.2126 * pc.r + 0.7152 * pc.g + 0.0722 * pc.b, light = lum > 0.35;
  const ink = light ? '#15161a' : '#f3f1ea';
  const zOf = t => sp.zR + t * L, cab = sp.cab;
  g.fillStyle = paint; g.fillRect(0, 0, 1024, 1024);
  const sideT = s => s ? [-1024 / L, 0, 0, -MPV, 1024 + sp.zR * 1024 / L, 640] : [1024 / L, 0, 0, -MPV, -sp.zR * 1024 / L, 320];
  const px = (s, z, y) => { const m = sideT(s); return [m[0] * z + m[4], m[3] * y + m[5]]; };
  const band = (s, fn) => { g.save(); g.beginPath(); g.rect(0, s * 320, 1024, 320); g.clip(); fn(); g.restore(); };
  const physSide = s => { const m = sideT(s); g.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]); };
  const physTop = () => g.setTransform(1024 / L, 0, 0, -160, -sp.zR * 1024 / L, 800);
  const text = (s, z, y, str, hM, fill, o = {}) => {
    const [x, yy] = px(s, z, y); g.save(); g.setTransform(1, 0, 0, 1, x, yy); if (o.rot) g.rotate(o.rot);
    g.font = (o.w || 'italic 900') + ' ' + Math.round(hM * MPV) + 'px ' + (o.f || '"Arial Black", Impact, Arial, sans-serif');
    g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.stroke){ g.lineJoin = 'round'; g.lineWidth = o.sw || 6; g.strokeStyle = o.stroke; g.strokeText(str, 0, 0); }
    g.fillStyle = fill; g.fillText(str, 0, 0); g.restore();
  };
  const roundel = (s, z, y, rM, bg, fg, ring) => {
    const [x, yy] = px(s, z, y), r = rM * MPV;
    g.save(); g.setTransform(1, 0, 0, 1, x, yy);
    g.fillStyle = ring; g.beginPath(); g.arc(0, 0, r * 1.1, 0, 7); g.fill();
    g.fillStyle = bg; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
    g.font = 'italic 900 ' + Math.round(r * 1.25) + 'px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = fg; g.fillText(String(num), 0, r * 0.06); g.restore();
  };
  // joints de portes, trappe à essence (réalisme)
  const seams = s => {
    physSide(s); g.strokeStyle = 'rgba(0,0,0,0.42)'; g.lineWidth = 0.008;
    const zd0 = zOf(cab.tA) + 0.08, zd1 = zOf(cab.tB + (cab.tA2 - cab.tB) * (id === 'taiga' ? 0.05 : 0.0)) + 0.1;
    g.beginPath(); g.moveTo(zd0, 0.22); g.quadraticCurveTo(zd0 + 0.03, 0.6, zd0 - 0.04, 0.98); g.stroke();
    g.beginPath(); g.moveTo(zd1, 0.22); g.lineTo(zd1, 0.98); g.stroke();
    if (id === 'taiga'){ const zm = zOf(cab.bp) + 0.02; g.beginPath(); g.moveTo(zm, 0.24); g.lineTo(zm, 0.98); g.stroke(); }
    g.beginPath(); g.moveTo(zd0, 0.25); g.lineTo(zd1, 0.25); g.stroke();
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(zOf(0.66) + 0.15, 0.78, 0.12, 0.012);
    g.setTransform(1, 0, 0, 1, 0, 0);
  };
  // graffitis (coordonnées pixels)
  const graff = (x0, y0, x1, y1, n) => {
    const pal = ['#00e5ff', '#ff2bd6', '#ffe600', '#7cff3a', '#ff7a00', '#3d5afe', '#ffffff', '#111111'];
    const words = ['KOKO', 'NITRO', 'DRIFT', 'FOX', 'NC', 'YOKO', 'KITSU'];
    for (let i = 0; i < n; i++){
      const ty = R(), x = lerp(x0, x1, R()), y = lerp(y0, y1, R()), cA = pal[(R() * pal.length) | 0], cB = pal[(R() * 6) | 0];
      g.save();
      if (ty < 0.3){
        const pts = [x, y, x + (R() - 0.5) * 200, y + (R() - 0.5) * 120, x + (R() - 0.5) * 260, y + (R() - 0.5) * 120, x + (R() - 0.5) * 300, y + (R() - 0.5) * 60];
        g.lineCap = 'round'; g.lineJoin = 'round';
        const lw = 8 + R() * 18;
        for (const [w, cc] of [[lw + 7, '#0d0d0f'], [lw, cA]]){ g.lineWidth = w; g.strokeStyle = cc; g.beginPath(); g.moveTo(pts[0], pts[1]); g.bezierCurveTo(pts[2], pts[3], pts[4], pts[5], pts[6], pts[7]); g.stroke(); }
      } else if (ty < 0.5){
        for (let k = 0; k < 4 + R() * 5; k++){ const r = 6 + R() * 22, a = R() * 6.28, d = R() * 40; g.fillStyle = k % 2 ? cA : cB; g.strokeStyle = '#0d0d0f'; g.lineWidth = 3; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.6, r, 0, 7); g.fill(); g.stroke(); }
      } else if (ty < 0.78){
        g.translate(x, y); g.rotate((R() - 0.5) * 0.5);
        g.font = 'italic 900 ' + (34 + R() * 40 | 0) + 'px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
        const w = words[(R() * words.length) | 0];
        g.lineWidth = 12; g.strokeStyle = '#0d0d0f'; g.strokeText(w, 0, 0); g.lineWidth = 5; g.strokeStyle = cB; g.strokeText(w, 0, 0); g.fillStyle = cA; g.fillText(w, 0, 0);
      } else if (ty < 0.9){
        g.strokeStyle = cA; g.fillStyle = cA; g.lineWidth = 2 + R() * 3;
        for (let k = 0; k < 5; k++){ const xx = x + (R() - 0.5) * 70, l = 12 + R() * 50; g.beginPath(); g.moveTo(xx, y); g.lineTo(xx, y + l); g.stroke(); g.beginPath(); g.arc(xx, y + l, g.lineWidth * 0.9, 0, 7); g.fill(); }
      } else {
        g.translate(x, y); g.fillStyle = cA; g.strokeStyle = '#0d0d0f'; g.lineWidth = 3; g.beginPath();
        for (let k = 0; k < 16; k++){ const a = k / 16 * 6.283, r = (k % 2 ? 10 : 30) * (0.7 + R() * 0.6); g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        g.closePath(); g.fill(); g.stroke();
      }
      g.restore();
    }
  };
  const zDoor = zOf(lerp(cab.tB, cab.tA, 0.52));
  if (id === 'hyperion') cc_liveryHyp(g, sp, light, zOf, band, physSide, physTop, seams);
  else if (id === 'kitsune'){
    const white = light ? '#16171b' : '#f4f3ef';
    for (const s of [0, 1]) band(s, () => {
      physSide(s);
      // grande vague blanche (basse à l'avant, haute à l'arrière) + liseré noir
      const path = () => { g.beginPath(); g.moveTo(sp.zR - 0.1, -0.1); g.lineTo(sp.zR - 0.1, 0.86); g.bezierCurveTo(zOf(0.25), 0.8, zOf(0.45), 0.36, zOf(0.7), 0.42); g.bezierCurveTo(zOf(0.85), 0.46, zOf(0.92), 0.6, sp.zF + 0.1, 0.5); g.lineTo(sp.zF + 0.1, -0.1); g.closePath(); };
      g.save(); g.translate(0, 0.035); path(); g.fillStyle = '#0d0d10'; g.fill(); g.restore();
      path(); g.fillStyle = white; g.fill();
      g.save(); path(); g.clip(); g.setTransform(1, 0, 0, 1, 0, 0); graff(0, s * 320 + 120, 1024, s * 320 + 320, 34); g.restore();
      g.setTransform(1, 0, 0, 1, 0, 0);
      seams(s);
      roundel(s, zDoor, 0.68, 0.17, '#ffffff', '#111', '#111');
      text(s, zOf(0.86), 0.68, 'NITRO', 0.11, '#ffd400', { stroke: '#111', sw: 5 });
      text(s, zOf(0.13), 0.78, 'KOKO', 0.1, ink, { stroke: light ? '#fff' : '#111', sw: 4 });
      text(s, zOf(0.4), 0.31, 'KITSUNE  DRIFT  TEAM', 0.055, '#111', { w: 'bold' });
    });
    // dessus : capot et coffre graffés, bande centrale
    g.save(); g.beginPath(); g.rect(0, 640, 1024, 320); g.clip();
    physTop(); g.fillStyle = white; g.beginPath(); g.moveTo(zOf(0.8), -1.2); g.lineTo(zOf(1.02), -1.2); g.lineTo(zOf(1.02), 1.2); g.lineTo(zOf(0.86), 1.2); g.closePath(); g.fill();
    g.setTransform(1, 0, 0, 1, 0, 0); graff(840, 650, 1020, 950, 10); graff(10, 660, 120, 940, 6);
    physTop(); g.fillStyle = '#0d0d10'; g.fillRect(zOf(0.6), -0.03, zOf(0.98) - zOf(0.6), 0.06);
    g.restore();
  } else if (id === 'stallion'){
    const st = light ? '#121316' : '#f2f0e8';
    g.save(); g.beginPath(); g.rect(0, 640, 1024, 320); g.clip(); physTop();
    for (const x of [-0.17, 0.17]){ g.fillStyle = st; g.fillRect(sp.zR - 0.1, x - 0.11, L + 0.2, 0.22); }
    g.restore();
    for (const s of [0, 1]) band(s, () => {
      physSide(s); g.fillStyle = st; g.fillRect(zOf(0.16), 0.33, zOf(0.8) - zOf(0.16), 0.035);
      g.fillRect(zOf(0.2), 0.82, zOf(0.86) - zOf(0.2), 0.012);
      g.setTransform(1, 0, 0, 1, 0, 0); seams(s);
      roundel(s, zDoor, 0.6, 0.18, '#f2f0e8', '#111', st);
      text(s, zOf(0.86), 0.62, 'STALLION', 0.065, st, { w: 'italic bold', f: 'Georgia, serif' });
      text(s, zOf(0.12), 0.62, 'NITRO', 0.075, '#d81e1e', { stroke: st, sw: 3 });
      text(s, zOf(0.25), 0.47, 'KOKO', 0.06, st, { w: 'bold' });
    });
  } else {
    const acc = (Math.abs(pc.r - 1) < 0.2 && pc.g < 0.3) ? '#14b8ff' : '#ff6a00';
    for (const s of [0, 1]) band(s, () => {
      physSide(s);
      // flèche de couleur rallye + liseré blanc
      const path = () => { g.beginPath(); g.moveTo(sp.zF + 0.1, 0.3); g.lineTo(zOf(0.74), 0.3); g.bezierCurveTo(zOf(0.45), 0.3, zOf(0.25), 0.55, sp.zR - 0.1, 0.92); g.lineTo(sp.zR - 0.1, 0.62); g.bezierCurveTo(zOf(0.3), 0.4, zOf(0.5), 0.2, zOf(0.7), 0.2); g.lineTo(sp.zF + 0.1, 0.2); g.closePath(); };
      g.save(); g.translate(0, 0.03); path(); g.fillStyle = '#f4f4f0'; g.fill(); g.restore();
      path(); g.fillStyle = acc; g.fill();
      g.setTransform(1, 0, 0, 1, 0, 0); seams(s);
      // plaque de numéro
      const [x, y] = px(s, zOf(lerp(cab.bp, cab.tA, 0.5)), 0.63);
      g.fillStyle = '#f7f7f2'; g.fillRect(x - 62, y - 34, 124, 68); g.strokeStyle = '#111'; g.lineWidth = 4; g.strokeRect(x - 62, y - 34, 124, 68);
      g.fillStyle = '#111'; g.font = '900 54px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(num), x, y + 3);
      text(s, zOf(0.2), 0.68, 'KOKO', 0.09, '#f4f4f0', { stroke: '#111', sw: 4 });
      const [x2, y2] = px(s, zOf(0.86), 0.62); g.fillStyle = '#d81e1e'; g.fillRect(x2 - 52, y2 - 14, 104, 28); g.fillStyle = '#fff'; g.font = 'italic 900 22px "Arial Black", Impact, sans-serif'; g.fillText('NITRO', x2, y2 + 1);
      text(s, zOf(lerp(cab.tB, cab.bp, 0.5)), 0.52, 'RALLY TEAM', 0.045, '#f4f4f0', { w: 'bold' });
    });
    g.save(); g.beginPath(); g.rect(0, 640, 1024, 320); g.clip(); physTop();
    g.fillStyle = acc; for (const k of [0, 1]){ g.beginPath(); g.moveTo(zOf(0.97) - k * 0.25, -0.6); g.lineTo(zOf(0.97) - k * 0.25 - 0.16, -0.6); g.lineTo(zOf(0.87) - k * 0.25 - 0.16, 0); g.lineTo(zOf(0.97) - k * 0.25 - 0.16, 0.6); g.lineTo(zOf(0.97) - k * 0.25, 0.6); g.lineTo(zOf(0.87) - k * 0.25, 0); g.closePath(); g.fill(); }
    // numéro de toit (lisible vu du dessus, avant en haut)
    const rx = (zOf((cab.tA2 + cab.tB) / 2) - sp.zR) * 1024 / L;
    g.setTransform(1, 0, 0, 1, rx, 800); g.rotate(Math.PI / 2); g.fillStyle = '#f7f7f2'; g.fillRect(-48, -40, 96, 80);
    g.fillStyle = '#111'; g.font = '900 60px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(num), 0, 3);
    g.restore();
  }
  if (rival){ for (const s of [0, 1]) band(s, () => text(s, zOf(0.5), 0.28, 'RIVAL', 0.05, '#ff3030', { w: 'bold' })); }
  // bande réservée : plaque + pastille de peinture pure
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = '#f2efe4'; g.fillRect(8, 968, 240, 48); g.strokeStyle = '#222'; g.lineWidth = 4; g.strokeRect(10, 970, 236, 44);
  g.fillStyle = '#1a1a1a'; g.font = 'bold 34px Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(id === 'hyperion' ? 'NITRO' : 'NC·' + String(num).padStart(2, '0') + '·KK', 128, 993);
  g.fillStyle = paint; g.fillRect(1000, 1000, 24, 24);
  return c;
}
const CC_UVBASE = [1012 / 1024, 1 - 1012 / 1024];

/* ---------- Matériaux ---------- */
function cc_shared(){
  if (!CC_CACHE.mats){
    CC_CACHE.mats = {
      glass: new THREE.MeshPhysicalMaterial({ color: col('#07090c'), metalness: 0.2, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.4 }),
      trim: new THREE.MeshStandardMaterial({ color: col('#111214'), roughness: 0.5, metalness: 0.25, envMapIntensity: 0.9 }),
      chrome: new THREE.MeshStandardMaterial({ color: col('#eceef0'), roughness: 0.1, metalness: 1, envMapIntensity: 1.8 }),
      dark: new THREE.MeshStandardMaterial({ color: col('#0a0a0b'), roughness: 0.92, metalness: 0, side: THREE.DoubleSide }),
      tire: new THREE.MeshStandardMaterial({ map: cc_tireTex(), roughness: 0.92, metalness: 0, envMapIntensity: 0.5 }),
      disc: new THREE.MeshStandardMaterial({ color: col('#8d8d92'), roughness: 0.36, metalness: 0.9 }),
      caliper: new THREE.MeshStandardMaterial({ color: col('#d0141c'), roughness: 0.32, metalness: 0.15, envMapIntensity: 1.2 }),
      flame: new THREE.MeshBasicMaterial({ color: col('#6fb0ff'), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
      carbon: new THREE.MeshPhysicalMaterial({ map: cc_carbonTex(), roughness: 0.4, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.6 }),
      fireO: new THREE.MeshBasicMaterial({ map: cc_fireTex(), color: col('#ff6a14'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
      fireC: new THREE.MeshBasicMaterial({ map: cc_fireTex(), color: col('#ffe2a0'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
      fireGlow: new THREE.SpriteMaterial({ map: cc_glowTex(), color: col('#ff8a2a'), opacity: 0.7, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    };
  }
  return CC_CACHE.mats;
}

/* ---------- Roues (géométries par type, en cache) ---------- */
function cc_wheelGeo(id, D, sp){
  const key = 'wheel_' + id; if (CC_CACHE[key]) return CC_CACHE[key];
  const R = D.wheelRadius, w = sp.tire.w, rr = sp.tire.rimR, rs = sp.rim;
  const mid = (rr + R) / 2;
  const prof = [[rr + 0.005, -w * 0.42], [rr + 0.02, -w * 0.47], [mid, -w * 0.53], [R - 0.045, -w * 0.5], [R - 0.02, -w * 0.48], [R - 0.006, -w * 0.44], [R, -w * 0.38],
    [R, w * 0.38], [R - 0.006, w * 0.44], [R - 0.02, w * 0.48], [R - 0.045, w * 0.5], [mid, w * 0.53], [rr + 0.02, w * 0.47], [rr + 0.005, w * 0.42]].map(p => new THREE.Vector2(p[0], p[1]));
  const tire = new THREE.LatheGeometry(prof, 56); tire.rotateZ(Math.PI / 2); // axe X, flanc extérieur en +X
  // jante : fût, lèvre, voile, moyeu, branches, écrous
  const parts = [];
  const barrel = new THREE.CylinderGeometry(rr - 0.004, rr - 0.004, w * 0.86, 40, 1, true); barrel.rotateZ(Math.PI / 2); parts.push(barrel);
  const lip = new THREE.TorusGeometry(rr - 0.006, 0.013, 8, 48); lip.rotateY(Math.PI / 2); lip.translate(w * 0.41, 0, 0); parts.push(lip);
  const ring = new THREE.RingGeometry(rr - 0.05, rr - 0.004, 48, 1); ring.rotateY(Math.PI / 2); ring.translate(w * 0.38, 0, 0); parts.push(ring);
  const hub = new THREE.CylinderGeometry(0.07, 0.085, 0.07, 28); hub.rotateZ(-Math.PI / 2); hub.translate(w * 0.27, 0, 0); parts.push(hub);
  const cap = new THREE.CylinderGeometry(0.032, 0.036, 0.03, 20); cap.rotateZ(-Math.PI / 2); cap.translate(w * 0.32, 0, 0); parts.push(cap);
  const r0 = 0.065, r1 = rr - 0.035, len = r1 - r0;
  const spoke = (ang, sw, th) => {
    const b = new THREE.BoxGeometry(th, len, sw, 1, 3, 1);
    // galbe : la branche se creuse vers le moyeu
    const P = b.attributes.position; for (let i = 0; i < P.count; i++){ const yy = P.getY(i) / len + 0.5; P.setX(i, P.getX(i) - Math.sin(yy * Math.PI) * 0.01); P.setZ(i, P.getZ(i) * (1 - 0.35 * yy)); }
    b.computeVertexNormals();
    b.translate(w * 0.29, r0 + len / 2, 0);
    // inclinaison : extrémité extérieure plus en +X
    const P2 = b.attributes.position; for (let i = 0; i < P2.count; i++){ const rr2 = P2.getY(i); P2.setX(i, P2.getX(i) + (rr2 - r0) / len * w * 0.09); }
    b.rotateX(ang); parts.push(b);
  };
  for (let i = 0; i < rs.n; i++){
    const a = i / rs.n * Math.PI * 2;
    if (rs.split){ spoke(a - 0.075, rs.sw, 0.026); spoke(a + 0.075, rs.sw, 0.026); }
    else spoke(a, rs.sw, rs.n === 5 ? 0.034 : 0.024);
  }
  for (let i = 0; i < 5; i++){ const a = i / 5 * Math.PI * 2 + 0.3, n = new THREE.CylinderGeometry(0.011, 0.012, 0.03, 8); n.rotateZ(-Math.PI / 2); n.translate(w * 0.315, Math.cos(a) * 0.048, Math.sin(a) * 0.048); parts.push(n); }
  const rim = mergeGeometries(parts.map(p => p.index ? p : p), false);
  const disc = new THREE.CylinderGeometry(rr - 0.04, rr - 0.04, 0.028, 40); disc.rotateZ(Math.PI / 2); disc.translate(w * 0.04, 0, 0);
  const dh = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 24); dh.rotateZ(Math.PI / 2); dh.translate(w * 0.12, 0, 0);
  const discM = mergeGeometries([disc, dh], false);
  // étrier : bloc arrondi en haut-arrière du disque (ne tourne pas)
  const cal = new THREE.CapsuleGeometry(0.035, 0.12, 4, 10); const ca = 0.75, cr = rr - 0.075;
  cal.applyMatrix4(cc_M4(w * 0.13, Math.cos(ca) * cr, -Math.sin(ca) * cr, ca, 0, 0));
  return (CC_CACHE[key] = { tire, rim, disc: discM, caliper: cal });
}

/* ---------- Construction du modèle ---------- */
function buildCarModel(typeId, paintHex, opts = {}){
  const T = CAR_TYPES[typeId] || CAR_TYPES.kitsune, id = T.id, sp = CC_SPEC[id], D = T.dims;
  const paint = paintHex || T.defaultPaint, num = opts.number != null ? opts.number : sp.num, rival = !!opts.rival;
  const S = cc_shape(sp, D), cab = sp.cab, sh = cc_shared();
  const A = { paint: cc_acc(), glass: cc_acc(), trim: cc_acc(), chrome: cc_acc(), dark: cc_acc(), head: cc_acc(), tail: cc_acc(), carbon: cc_acc() };
  const L = S.L, MPV = 320 / 1.5;
  const uvProj = (x, y, z, n) => {
    const u = (z - sp.zR) / L;
    if (n.y > 0.55) return [u, 1 - (800 - 160 * x) / 1024];
    if (n.x < 0) return [u, 1 - (320 - MPV * y) / 1024];
    return [1 - u, 1 - (640 - MPV * y) / 1024];
  };
  const archs = [D.wheelbase / 2, -D.wheelbase / 2].map(z => ({ z, y: D.wheelRadius, r: D.wheelRadius + 0.06, xin: D.track / 2 - sp.tire.w / 2 - 0.035 }));
  const _a = V3(), _b = V3(), _c = V3(), _n = V3(), _e1 = V3(), _e2 = V3();
  // maillage en grille -> faces classées par matériau
  const grid = (NZ, NA, pt, classify, ring) => {
    const W1 = NA + 1, pos = new Float32Array((NZ + 1) * W1 * 3);
    for (let i = 0; i <= NZ; i++) for (let j = 0; j <= NA; j++){ const p = pt(i, j); pos.set(p, (i * W1 + j) * 3); }
    const idx = [];
    for (let i = 0; i < NZ; i++) for (let j = 0; j < NA; j++){ const a = i * W1 + j, b = a + W1, c2 = b + 1, d = a + 1; idx.push(a, b, d, b, c2, d); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx);
    g.computeVertexNormals();
    // orientation : la normale du haut doit pointer vers +Y
    const nrm = g.attributes.normal, mid = ((NZ >> 1) * W1 + (ring ? (NA >> 1) : (NA >> 1))) * 3;
    let flip = nrm.array[mid + 1] < 0;
    if (flip){ for (let k = 0; k < idx.length; k += 3){ const t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; } g.setIndex(idx); g.computeVertexNormals(); }
    const N = g.attributes.normal.array;
    for (let k = 0; k < idx.length; k += 3){
      const ia = idx[k], ib = idx[k + 1], ic = idx[k + 2];
      _a.fromArray(pos, ia * 3); _b.fromArray(pos, ib * 3); _c.fromArray(pos, ic * 3);
      _e1.subVectors(_b, _a); _e2.subVectors(_c, _a); _n.crossVectors(_e1, _e2); const ar = _n.length(); if (ar < 1e-7) continue; _n.multiplyScalar(1 / ar);
      const cx = (_a.x + _b.x + _c.x) / 3, cy = (_a.y + _b.y + _c.y) / 3, cz = (_a.z + _b.z + _c.z) / 3;
      const q = (k / 6) | 0, fi = (q / NA) | 0, fj = q % NA;
      const cls = classify({ x: cx, y: cy, z: cz, nx: _n.x, ny: _n.y, nz: _n.z, t: S.tOf(cz), i: fi, j: fj }) || 'paint';
      const acc = A[cls];
      for (const v of [ia, ib, ic]){
        const x = pos[v * 3], y = pos[v * 3 + 1], z = pos[v * 3 + 2];
        acc.p.push(x, y, z); acc.n.push(N[v * 3], N[v * 3 + 1], N[v * 3 + 2]);
        const uv = uvProj(x, y, z, _n); acc.u.push(uv[0], uv[1]);
      }
    }
  };
  // --- caisse basse (loft de sections superellipses, passages de roues découpés)
  const NZ = 150, NA = 60, rowT = [];
  for (let i = 0; i <= NZ; i++){ const u = i / NZ; rowT.push(lerp(u, 0.5 - 0.5 * Math.cos(Math.PI * u), 0.6)); }
  grid(NZ, NA, (i, j) => {
    const t = rowT[i], z = S.zOf(t), w = S.W(t), b = S.B(t), tp = S.T(t), yc = (b + tp) / 2, hh = (tp - b) / 2;
    const phi = -Math.PI / 2 + (j % NA) / NA * Math.PI * 2, sn = Math.sin(phi), cs = Math.cos(phi), ne = sn > 0 ? sp.nTop : sp.nBot;
    const sy = Math.sign(sn) * Math.pow(Math.abs(sn), 2 / ne), sx = Math.sign(cs) * Math.pow(Math.abs(cs), 2 / ne);
    let y = yc + hh * sy; const x = w * sx * (1 - sp.tumble * Math.max(0, sy) ** 2) * (1 - 0.05 * Math.max(0, -sy) ** 3);
    for (const a of archs){ const dz = z - a.z; if (Math.abs(dz) < a.r && Math.abs(x) > a.xin){ const ya = a.y + Math.sqrt(a.r * a.r - dz * dz); if (y < ya) y = ya; } }
    return [x, y, z];
  }, f => {
    for (const a of archs){ const dz = Math.abs(f.z - a.z), r = a.r + 0.012; if (dz < r && f.y < a.y + Math.sqrt(r * r - dz * dz) + 0.004 && Math.abs(f.x) < S.W(f.t) - 0.035) return 'dark'; }
    if (f.ny < -0.35) return 'dark';
    f.T = S.T(f.t); f.B = S.B(f.t);
    return sp.cls ? sp.cls(f) : null;
  }, true);
  // --- habitacle (pavillon, vitres, montants)
  const tA = cab.tA, tC = cab.tC, rt = cab.roofH, Tt = S.T;
  const roof = cc_curve([[tC, Tt(tC)], [tC + 0.45 * (cab.tB - tC), lerp(Tt(tC), rt, cab.rearK)], [cab.tB, rt - 0.012], [(cab.tB + cab.tA2) / 2, rt], [cab.tA2, rt - 0.012], [cab.tA2 + 0.5 * (tA - cab.tA2), lerp(rt, Tt(tA), 0.47)], [tA, Tt(tA)]]);
  const NZC = 80, NT = 32, nc = 4;
  const cabRow = t => { const bh = Math.min(cab.belt, S.W(t) - 0.04), by = S.bodyY(t, bh) - 0.012; return { bh, by, H: Math.max(0.004, roof(t) - by) }; };
  grid(NZC, NT, (i, j) => {
    const t = lerp(tC, tA, i / NZC), r = cabRow(t), th = j / NT * Math.PI, cs = Math.cos(th), sn = Math.max(0, Math.sin(th));
    const sx = Math.sign(cs) * Math.pow(Math.abs(cs), 2 / nc), sy = Math.pow(sn, 2 / nc), X = lerp(r.bh, cab.roof, sy);
    return [X * sx, r.by + r.H * sy, S.zOf(t)];
  }, f => {
    const th = (f.j + 0.5) / NT * Math.PI, side = th < 0.62 || th > Math.PI - 0.62, top = th > 0.98 && th < Math.PI - 0.98;
    const t = f.t, r = cabRow(t), yRel = (f.y - r.by) / r.H;
    if (top){
      if (t > cab.tB + 0.004 && t < cab.tA2 - 0.004) return 'paint';
      if (t > tA - 0.014 || t < tC + 0.012) return 'trim';
      return 'glass';
    }
    if (!side) return 'paint';
    if (yRel < 0.07) return 'trim';
    if (t < cab.tS0 || t > cab.tS1) return 'paint';
    if (cab.bp && Math.abs(t - cab.bp) < 0.009) return 'trim';
    return 'glass';
  }, false);
  // --- pièces rapportées
  const addG = (cls, geo, m, uv) => { if (m) geo.applyMatrix4(m); cc_add(A[cls], geo, uv === 'keep' ? null : cls === 'paint' ? (uv || CC_UVBASE) : (uv || null)); };
  const zA = S.zOf(tA), rA = cabRow(tA - 0.02);
  for (const s of [1, -1]){
    // rétroviseurs
    const mx = s * (rA.bh + 0.11), my = rA.by + 0.1, mz = zA - 0.2;
    addG('paint', new THREE.SphereGeometry(0.08, 16, 10), cc_M4(mx, my, mz, 0, 0, 0, 1.1, 0.62, 0.62));
    addG('chrome', new THREE.CircleGeometry(0.06, 16), cc_M4(mx, my, mz - 0.048, 0, Math.PI, 0, 1.2, 0.68, 1));
    addG('trim', new THREE.BoxGeometry(0.1, 0.025, 0.05), cc_M4(s * (rA.bh + 0.04), my - 0.04, mz + 0.01));
  }
  // échappements
  const zRear = S.edgeZ(0, 0.4, false);
  const exhausts = [];
  for (const e of sp.exh){
    const ez = S.edgeZ(e[0], e[1] + 0.12, false) - 0.06, r = e[2];
    addG('chrome', new THREE.CylinderGeometry(r, r * 0.92, 0.3, 20, 1, true), cc_M4(e[0], e[1], ez + 0.1, Math.PI / 2, 0, 0));
    addG('chrome', new THREE.TorusGeometry(r - 0.004, 0.006, 6, 20), cc_M4(e[0], e[1], ez - 0.05));
    addG('dark', new THREE.CircleGeometry(r * 0.95, 16), cc_M4(e[0], e[1], ez - 0.02, 0, Math.PI, 0));
    exhausts.push(V3(e[0], e[1], ez - 0.06));
  }
  // diffuseur (ailettes) et lame avant
  const zDif = S.edgeZ(0, S.B(0.03) + 0.06, false);
  const yDif = S.B(0.04);
  if (id !== 'hyperion') for (let k = -3; k <= 3; k++) addG('trim', new THREE.BoxGeometry(0.012, 0.07, 0.36), cc_M4(k * 0.15, yDif - 0.03, zDif + 0.2, 0.12, 0, 0));
  if (id !== 'hyperion') addG('trim', new THREE.BoxGeometry(1.1, 0.014, 0.38), cc_M4(0, yDif - 0.065, zDif + 0.24, 0.12, 0, 0));
  if (id !== 'stallion' && id !== 'hyperion'){ const zs = S.edgeZ(0, S.B(0.97) + 0.03, true); addG('trim', new THREE.BoxGeometry(1.5, 0.018, 0.3), cc_M4(0, S.B(0.97) - 0.01, zs - 0.12)); }
  // plaques
  const plateUV = g => { const U = g.attributes.uv; for (let i = 0; i < U.count; i++) U.setXY(i, lerp(8, 248, U.getX(i)) / 1024, 1 - lerp(1016, 968, U.getY(i)) / 1024); return g; };
  const pyR = id === 'stallion' ? 0.52 : id === 'taiga' ? 0.56 : id === 'hyperion' ? 0.44 : 0.5;
  const pz = S.edgeZ(0, pyR, false) - 0.008;
  addG('paint', plateUV(new THREE.PlaneGeometry(0.42, 0.1)), cc_M4(0, pyR, pz, 0, Math.PI, 0), 'keep');
  if (id !== 'kitsune' && id !== 'hyperion'){ const py = id === 'taiga' ? 0.36 : 0.3; addG('paint', plateUV(new THREE.PlaneGeometry(0.42, 0.1)), cc_M4(0, py, S.edgeZ(0, py, true) + 0.012), 'keep'); }
  // spécifiques
  if (id === 'hyperion') cc_hypParts(S, sp, D, archs, addG, uvProj, A);
  else if (id === 'kitsune'){
    // aileron GT sur pieds
    const wz = sp.zR + 0.36, wy = 1.16, ty = S.T(0.08);
    const sh2 = new THREE.Shape(); sh2.moveTo(0, 0); sh2.bezierCurveTo(0.02, 0.04, 0.16, 0.045, 0.34, 0.012); sh2.lineTo(0.34, 0.0); sh2.bezierCurveTo(0.2, 0.0, 0.06, -0.02, 0, 0);
    const wing = new THREE.ExtrudeGeometry(sh2, { depth: 1.66, bevelEnabled: false, curveSegments: 10 });
    wing.rotateY(Math.PI / 2); // corde vers -Z, bord d'attaque à l'avant
    addG('trim', wing, cc_M4(-0.83, wy, wz + 0.2, 0.1, 0, 0));
    for (const s of [1, -1]){
      addG('trim', new THREE.BoxGeometry(0.022, wy - ty + 0.02, 0.13), cc_M4(s * 0.46, (wy + ty) / 2, wz + 0.05, 0.12, 0, 0));
      addG('trim', new THREE.BoxGeometry(0.012, 0.11, 0.3), cc_M4(s * 0.835, wy + 0.015, wz + 0.03));
    }
    // feux arrière ovales avec entourage
    for (const s of [1, -1]){
      const tx = s * 0.6, ty2 = 0.78, tz = S.edgeZ(tx, ty2, false);
      addG('trim', new THREE.SphereGeometry(1, 24, 12), cc_M4(tx, ty2, tz + 0.045, 0, s * -0.42, 0, 0.225, 0.08, 0.06));
      addG('tail', new THREE.SphereGeometry(1, 24, 12), cc_M4(tx, ty2, tz + 0.04, 0, s * -0.42, 0, 0.205, 0.065, 0.06));
      addG('chrome', new THREE.SphereGeometry(1, 12, 8), cc_M4(s * 0.52, ty2 - 0.005, tz + 0.012, 0, s * -0.3, 0, 0.05, 0.035, 0.03));
    }
    // canards et lèvre
    for (const s of [1, -1]) addG('trim', new THREE.BoxGeometry(0.16, 0.012, 0.09), cc_M4(s * 0.72, 0.36, S.edgeZ(0.72, 0.36, true) - 0.02, 0, s * 0.4, s * 0.15));
  } else if (id === 'stallion'){
    // phares ronds + cerclages chromés, logo
    for (const s of [1, -1]){
      const hx = s * 0.6, hy = 0.63, hz = S.edgeZ(hx, hy, true);
      addG('head', new THREE.SphereGeometry(0.085, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), cc_M4(hx, hy, hz - 0.035, Math.PI / 2, 0, 0, 1, 0.5, 1));
      addG('chrome', new THREE.TorusGeometry(0.09, 0.015, 8, 28), cc_M4(hx, hy, hz - 0.02));
    }
    addG('chrome', new THREE.BoxGeometry(0.2, 0.06, 0.02), cc_M4(0, 0.62, S.edgeZ(0, 0.62, true) + 0.0));
    // becquet canard (lèvre)
    addG('paint', new THREE.BoxGeometry(1.5, 0.03, 0.12), cc_M4(0, S.T(0.05) + 0.005, S.zOf(0.05), 0.25, 0, 0));
    // prise d'air de capot
    addG('paint', new THREE.BoxGeometry(0.5, 0.05, 0.5, 2, 1, 2), cc_M4(0, S.T(0.8) - 0.005, S.zOf(0.8), 0.03, 0, 0));
    addG('trim', new THREE.BoxGeometry(0.42, 0.035, 0.02), cc_M4(0, S.T(0.8) + 0.01, S.zOf(0.8) + 0.25));
  } else {
    // écope de toit, rampe de phares, aileron de hayon, bavettes
    const zr = S.zOf(cab.tA2) - 0.35;
    addG('paint', new THREE.BoxGeometry(0.34, 0.07, 0.42, 2, 1, 2), cc_M4(0, rt + 0.025, zr, -0.04, 0, 0));
    addG('trim', new THREE.PlaneGeometry(0.3, 0.05), cc_M4(0, rt + 0.03, zr + 0.212));
    const zb = S.zOf(cab.tA2) - 0.06;
    addG('trim', new THREE.BoxGeometry(1.12, 0.05, 0.08), cc_M4(0, rt + 0.035, zb));
    for (let k = 0; k < 4; k++){
      const lx = -0.42 + k * 0.28;
      addG('trim', new THREE.CylinderGeometry(0.075, 0.075, 0.08, 20), cc_M4(lx, rt + 0.13, zb + 0.02, Math.PI / 2, 0, 0));
      addG('head', new THREE.CircleGeometry(0.065, 20), cc_M4(lx, rt + 0.13, zb + 0.062));
      addG('trim', new THREE.BoxGeometry(0.03, 0.08, 0.03), cc_M4(lx, rt + 0.07, zb));
    }
    const zw = S.zOf(cab.tB) + 0.02;
    addG('trim', new THREE.BoxGeometry(1.36, 0.025, 0.3), cc_M4(0, rt + 0.0, zw - 0.12, -0.12, 0, 0));
    for (const s of [1, -1]) addG('trim', new THREE.BoxGeometry(0.02, 0.1, 0.3), cc_M4(s * 0.67, rt - 0.02, zw - 0.12));
    for (const z of [D.wheelbase / 2, -D.wheelbase / 2]) for (const s of [1, -1]) addG('trim', new THREE.BoxGeometry(0.26, 0.3, 0.012), cc_M4(s * D.track / 2, 0.2, z - D.wheelRadius - 0.1, 0.05, 0, 0));
  }
  // --- matériaux de l'instance
  const liv = ctex(cc_livery(id, paint, num, rival, sp));
  const hyp = id === 'hyperion';
  const mPaint = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: liv, metalness: hyp ? 0.4 : 0.55, roughness: hyp ? 0.26 : 0.3, clearcoat: 1, clearcoatRoughness: hyp ? 0.02 : 0.035, envMapIntensity: hyp ? 2.4 : 1.7, normalMap: cc_flakeTex(), normalScale: new THREE.Vector2(hyp ? 0.08 : 0.12, hyp ? 0.08 : 0.12) });
  const mHead = new THREE.MeshStandardMaterial({ color: col('#e8ecf2'), emissive: col('#fff1dc'), emissiveIntensity: 0.3, roughness: 0.12, metalness: 0.4, envMapIntensity: 2 });
  const mTail = new THREE.MeshStandardMaterial({ color: col('#4a0306'), emissive: col('#ff1408'), emissiveIntensity: 0.5, roughness: 0.18, metalness: 0.1, toneMapped: !hyp });
  const mats = { paint: mPaint, glass: sh.glass, trim: sh.trim, chrome: sh.chrome, dark: sh.dark, head: mHead, tail: mTail, carbon: sh.carbon };
  const root = new THREE.Group(), body = new THREE.Group(), inner = new THREE.Group();
  root.name = 'car_' + id; body.add(inner); root.add(body); inner.position.y = -0.45; body.position.y = 0.45;
  for (const k in A){ const g = cc_geoOf(A[k]); if (!g) continue; const m = new THREE.Mesh(g, mats[k]); m.castShadow = k !== 'head'; m.receiveShadow = true; m.name = k; inner.add(m); }
  // flammes de nitro
  const flames = exhausts.map(e => {
    const g1 = new THREE.ConeGeometry(0.06, 0.62, 14, 1, true); g1.rotateX(-Math.PI / 2); g1.translate(0, 0, -0.31);
    const g2 = new THREE.ConeGeometry(0.032, 0.34, 10, 1, true); g2.rotateX(-Math.PI / 2); g2.translate(0, 0, -0.17);
    const f = new THREE.Mesh(mergeGeometries([g1, g2]), sh.flame); f.position.copy(e); f.visible = false; f.renderOrder = 5; inner.add(f); return f;
  });
  // flammes orange de retour à l'échappement (backfire)
  const fires = exhausts.map(e => {
    const grp = new THREE.Group(); grp.position.copy(e); grp.visible = false; inner.add(grp);
    const o1 = new THREE.ConeGeometry(0.15, 0.95, 16, 1, true); o1.rotateX(-Math.PI / 2); o1.translate(0, 0, -0.47);
    const o2 = new THREE.ConeGeometry(0.1, 0.6, 12, 1, true); o2.rotateX(-Math.PI / 2); o2.rotateZ(1); o2.translate(0.03, 0.04, -0.3);
    const c1 = new THREE.ConeGeometry(0.065, 0.48, 12, 1, true); c1.rotateX(-Math.PI / 2); c1.translate(0, 0, -0.24);
    const outer = new THREE.Mesh(mergeGeometries([o1, o2]), sh.fireO), core = new THREE.Mesh(c1, sh.fireC), glow = new THREE.Sprite(sh.fireGlow);
    outer.renderOrder = core.renderOrder = glow.renderOrder = 6; glow.position.z = -0.2; glow.scale.setScalar(0.45);
    grp.add(outer, core, glow); return grp;
  });
  // roues : coin -> pivot de braquage -> côté (miroir) -> rotation
  const wg = cc_wheelGeo(id, D, sp), rimMat = CC_CACHE['rimMat_' + id] || (CC_CACHE['rimMat_' + id] = new THREE.MeshStandardMaterial({ color: col(sp.rim.color), metalness: sp.rim.metal, roughness: sp.rim.rough, envMapIntensity: 1.6, side: THREE.DoubleSide }));
  const wheelsLocal = [], pivots = [], spins = [];
  [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sz], i) => {
    const corner = new THREE.Group(); corner.position.set(sx * D.track / 2, D.wheelRadius, sz * D.wheelbase / 2); root.add(corner);
    const piv = new THREE.Group(); corner.add(piv); const side = new THREE.Group(); side.scale.x = sx; piv.add(side);
    const spin = new THREE.Group(); side.add(spin);
    for (const [g, m] of [[wg.tire, sh.tire], [wg.rim, rimMat], [wg.disc, sh.disc]]){ const ms = new THREE.Mesh(g, m); ms.castShadow = ms.receiveShadow = true; spin.add(ms); }
    const cl = new THREE.Mesh(wg.caliper, sp.caliper ? (CC_CACHE['cal_' + id] || (CC_CACHE['cal_' + id] = new THREE.MeshStandardMaterial({ color: col(sp.caliper), roughness: 0.3, metalness: 0.15, envMapIntensity: 1.2 }))) : sh.caliper); cl.castShadow = true; cl.receiveShadow = true; side.add(cl);
    pivots.push(piv); spins.push(spin); wheelsLocal.push(V3(sx * D.track / 2, 0, sz * D.wheelbase / 2));
  });
  const model = {
    root, body, typeId: id, paint, materials: mats,
    dims: { length: D.length, width: D.width, height: D.height, wheelbase: D.wheelbase, track: D.track, wheelRadius: D.wheelRadius },
    exhausts, wheelsLocal,
    pose(p = {}){
      const st = p.steer || 0, sp2 = p.spin || 0;
      pivots[0].rotation.y = pivots[1].rotation.y = -st;
      for (const s of spins) s.rotation.x = sp2;
      body.position.y = 0.45 + (p.heave || 0);
      body.rotation.set(-(p.pitch || 0), 0, p.roll || 0);
      const hd = p.head || 0, br = p.brake || 0, nt = p.nitro || 0;
      mHead.emissiveIntensity = 0.25 + hd * 6;
      mTail.emissiveIntensity = 0.45 + hd * 1.2 + br * 5;
      for (const f of flames){ f.visible = nt > 0.02; if (f.visible){ const k = nt * (0.75 + Math.random() * 0.5); f.scale.set(0.8 + nt * 0.4, 0.8 + nt * 0.4, k * 1.4); } }
      const bf = clamp(p.backfire || 0, 0, 1);
      for (const f of fires){ f.visible = bf > 0.02; if (f.visible){ const k = bf * (0.8 + Math.random() * 0.4), w = 0.6 + bf * 0.6; f.scale.set(w, w, k * 1.2); f.rotation.z = Math.random() * 6.28; } }
    },
  };
  model.pose({});
  return model;
}

// Classement des faces de caisse (prises d'air, feux, chromes) par type
CC_SPEC.kitsune.cls = f => {
  const ax = Math.abs(f.x);
  if (f.t > 0.875 && ax > 0.34 && ax < 0.84 && f.y > f.T - 0.1 && f.y < f.T - 0.012 && f.nz > 0.1 && f.ny < 0.9) return 'head';
  if (f.nz > 0.45 && f.y > f.B + 0.05 && f.y < f.B + 0.2 && ax < 0.6) return 'trim';
  return null;
};
CC_SPEC.stallion.cls = f => {
  const ax = Math.abs(f.x);
  if (f.nz > 0.55 && f.y > 0.47 && f.y < 0.76 && ax < 0.72) return 'trim';
  if (Math.abs(f.nz) > 0.3 && f.y > 0.35 && f.y < 0.46) return 'chrome';
  if (f.nz < -0.55 && f.y > 0.6 && f.y < 0.76 && ax > 0.24 && ax < 0.74){ const k = ((ax - 0.24) / 0.5 * 3) % 1; return (k > 0.12 && k < 0.88) ? 'tail' : 'chrome'; }
  if (f.nz < -0.55 && f.y > 0.58 && f.y < 0.78) return 'trim';
  if (f.y < f.B + 0.03) return 'trim';
  return null;
};
CC_SPEC.taiga.cls = f => {
  const ax = Math.abs(f.x);
  if (f.t > 0.9 && ax > 0.42 && ax < 0.8 && f.y > 0.64 && f.y < 0.76 && f.nz > 0.25) return 'head';
  if (f.nz > 0.5 && f.y > 0.36 && f.y < 0.43 && ax > 0.5 && ax < 0.68) return 'head';
  if (f.nz > 0.45 && f.y > 0.3 && f.y < 0.56 && ax < 0.72) return 'trim';
  if (f.nz > 0.55 && f.y > 0.6 && f.y < 0.69 && ax < 0.36) return 'trim';
  if (f.t < 0.05 && ax > 0.6 && f.y > 0.72 && f.y < 0.96) return 'tail';
  if (f.y < f.B + 0.17 && f.ny < 0.5) return 'trim';
  return null;
};

CC_SPEC.hyperion.cls = f => {
  const ax = Math.abs(f.x);
  // phares effilés : fine bande au ras du capot
  if (f.t > 0.9 && ax > 0.4 && ax < 0.86 && f.y > f.T - 0.075 && f.y < f.T - 0.035 && f.nz > 0.15) return 'head';
  if (f.nz > 0.45 && f.y > f.B + 0.04 && f.y < f.B + 0.2 && ax < 0.78) return 'trim';
  // poupe : bandeau noir brillant des feux, partie basse en carbone
  if (f.nz < -0.45 && f.y < f.B + 0.11) return 'carbon';
  if (f.nz < -0.5 && f.y > 0.66 && f.y < 0.86) return 'trim';
  return null;
};
function cc_mirX(geo){
  // miroir en X avec retournement de l'ordre des sommets
  const g = geo.index ? geo.toNonIndexed() : geo; g.scale(-1, 1, 1);
  for (const k of ['position', 'normal', 'uv']){ const at = g.attributes[k]; if (!at) continue; const n = at.itemSize, a = at.array;
    for (let i = 0; i < a.length; i += 3 * n) for (let c = 0; c < n; c++){ const t = a[i + n + c]; a[i + n + c] = a[i + 2 * n + c]; a[i + 2 * n + c] = t; } }
  return g;
}
// Pièces de la Hyperion : kit large riveté, ailes flottantes, aileron col de cygne, diffuseur, feux en U
function cc_hypParts(S, sp, D, archs, addG, uvProj, A){
  const addP = geo => {
    const g = geo.index ? geo.toNonIndexed() : geo, P = g.attributes.position, N = g.attributes.normal, a = A.paint, n = { x: 0, y: 0 };
    for (let i = 0; i < P.count; i++){ const x = P.getX(i), y = P.getY(i), z = P.getZ(i); n.x = N.getX(i); n.y = N.getY(i); a.p.push(x, y, z); a.n.push(n.x, n.y, N.getZ(i)); const uv = uvProj(x, y, z, n); a.u.push(uv[0], uv[1]); }
  };
  const halfY = (z, y) => { const h = S.halfAt(S.tOf(z), y); return h > 0 ? h : S.W(S.tOf(z)) * 0.8; };
  // ailes élargies : lèvre d'arche qui suit la caisse + rivets
  for (const a of archs) for (const s of [1, -1]){
    const pts = [];
    for (let k = 0; k <= 16; k++){ const an = 0.12 + k / 16 * (Math.PI - 0.24), z = a.z - Math.cos(an) * (a.r + 0.02), y = a.y + Math.sin(an) * (a.r + 0.02); pts.push(V3(s * (halfY(z, y) + 0.004), y, z)); }
    addP(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.026, 6, false));
    for (let k = 0; k < 9; k++){ const an = 0.3 + k / 8 * (Math.PI - 0.6), z = a.z - Math.cos(an) * (a.r + 0.075), y = a.y + Math.sin(an) * (a.r + 0.075);
      addG('chrome', new THREE.SphereGeometry(0.011, 6, 4), cc_M4(s * (halfY(z, y) + 0.003), y, z)); }
  }
  // ailes flottantes (double peau) du montant arrière vers l'aile arrière
  const cab = sp.cab, z0 = S.zOf(cab.tB) + 0.02, z1 = sp.zR + 0.22, NS = 14;
  for (const s of [1, -1]){
    const sh = new THREE.Shape(), up = [], lo = [];
    for (let k = 0; k <= NS; k++){
      const u = k / NS, z = lerp(z0, z1, u), x = lerp(cab.roof + 0.02, 0.8, Math.pow(u, 0.8));
      let yu = lerp(cab.roofH - 0.02, S.T(S.tOf(z1)) + 0.03, u) + Math.sin(u * Math.PI) * 0.07;
      const yb = S.bodyY(S.tOf(z), x);
      let yl = Math.max(yu - lerp(0.05, 0.13, u), yb + 0.035);
      if (u > 0.8) yl = lerp(yl, yb - 0.03, (u - 0.8) / 0.2);
      if (yu < yl + 0.03) yu = yl + 0.03;
      up.push([-z, yu, x]); lo.push([-z, yl, x]);
    }
    sh.moveTo(up[0][0], up[0][1]); for (const p of up.slice(1)) sh.lineTo(p[0], p[1]); for (const p of lo.slice().reverse()) sh.lineTo(p[0], p[1]);
    let g = new THREE.ExtrudeGeometry(sh, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1 });
    g.rotateY(Math.PI / 2);
    // cintrage en X selon z
    const P = g.attributes.position; for (let i = 0; i < P.count; i++){ const z = P.getZ(i), u = clamp((z0 - z) / (z0 - z1), 0, 1); P.setX(i, P.getX(i) + lerp(cab.roof + 0.02, 0.8, Math.pow(u, 0.8)) - 0.02); }
    g.computeVertexNormals();
    if (s < 0) g = cc_mirX(g);
    addP(g);
  }
  // bas de caisse, lame avant, canards
  const zs0 = -D.wheelbase / 2 + D.wheelRadius + 0.14, zs1 = D.wheelbase / 2 - D.wheelRadius - 0.14;
  for (const s of [1, -1]){
    addG('carbon', new THREE.BoxGeometry(0.17, 0.035, zs1 - zs0), cc_M4(s * (S.W(0.5) - 0.03), S.B(0.5) + 0.0, (zs0 + zs1) / 2, 0, 0, s * -0.12));
    addG('carbon', new THREE.BoxGeometry(0.2, 0.012, 0.12), cc_M4(s * 0.82, 0.3, S.edgeZ(0.82, 0.3, true) - 0.03, 0, s * 0.35, s * 0.18));
  }
  const yS = S.B(0.97), zS = S.edgeZ(0, yS + 0.03, true);
  addG('carbon', new THREE.BoxGeometry(1.86, 0.022, 0.42, 1, 1, 1), cc_M4(0, yS - 0.015, zS - 0.13));
  for (const s of [1, -1]) addG('carbon', new THREE.BoxGeometry(0.012, 0.07, 0.4), cc_M4(s * 0.92, yS + 0.015, zS - 0.13));
  // diffuseur prononcé
  const yD = 0.13, zD = sp.zR + 0.06;
  addG('carbon', new THREE.BoxGeometry(1.62, 0.02, 0.7), cc_M4(0, yD + 0.03, zD, 0.18, 0, 0));
  for (const x of [-0.74, -0.52, -0.31, 0.31, 0.52, 0.74]) addG('carbon', new THREE.BoxGeometry(0.014, 0.22, 0.7), cc_M4(x, yD + 0.13, zD, 0.18, 0, 0));
  // aileron arrière : profil, volet, dérives, pieds en col de cygne
  const wy = 1.3, wz = sp.zR + 0.5, span = 1.98, ch = 0.44, aoa = 0.08;
  const af = new THREE.Shape(); af.moveTo(0, 0); af.bezierCurveTo(0.02, 0.05, 0.2, 0.06, ch, 0.03); af.lineTo(ch, 0.012); af.bezierCurveTo(0.26, 0.0, 0.07, -0.025, 0, 0);
  const wing = new THREE.ExtrudeGeometry(af, { depth: span, bevelEnabled: false, curveSegments: 10 }); wing.rotateY(Math.PI / 2);
  addG('carbon', wing, cc_M4(-span / 2, wy, wz, aoa, 0, 0));
  addG('carbon', new THREE.BoxGeometry(span, 0.06, 0.012), cc_M4(0, wy + 0.06, wz - ch + 0.005, 0.25, 0, 0));
  const ep = new THREE.Shape(); ep.moveTo(-0.06, -0.12); ep.lineTo(0.52, -0.08); ep.lineTo(0.54, 0.16); ep.lineTo(0.04, 0.1); ep.closePath();
  for (const s of [1, -1]){ const e = new THREE.ExtrudeGeometry(ep, { depth: 0.014, bevelEnabled: false }); e.rotateY(Math.PI / 2); addG('carbon', e, cc_M4(s * (span / 2) - 0.007, wy, wz)); }
  for (const s of [1, -1]){
    const xb = s * 0.38, zb = wz + 0.14, yb = S.bodyY(S.tOf(zb), 0.38) - 0.01, H = wy + 0.045 - yb, Xe = 0.14 + 0.2;
    const bz = u => { const v = 1 - u; return [v * v * v * 0 + 3 * v * v * u * -0.05 + 3 * v * u * u * 0.12 + u * u * u * Xe, 3 * v * v * u * H * 0.85 + 3 * v * u * u * (H + 0.17) + u * u * u * H]; };
    const L1 = [], R1 = [];
    for (let k = 0; k <= 18; k++){
      const u = k / 18, p = bz(u), q = bz(Math.min(1, u + 0.01)), r0 = bz(Math.max(0, u - 0.01)), dx = q[0] - r0[0], dy = q[1] - r0[1], l = Math.hypot(dx, dy) || 1, th = lerp(0.035, 0.02, u);
      L1.push([p[0] - dy / l * th, p[1] + dx / l * th]); R1.push([p[0] + dy / l * th, p[1] - dx / l * th]);
    }
    const ns = new THREE.Shape(); ns.moveTo(L1[0][0], L1[0][1]); for (const p of L1.slice(1)) ns.lineTo(p[0], p[1]); for (const p of R1.slice().reverse()) ns.lineTo(p[0], p[1]);
    const ng = new THREE.ExtrudeGeometry(ns, { depth: 0.022, bevelEnabled: false }); ng.rotateY(Math.PI / 2);
    addG('carbon', ng, cc_M4(xb - 0.011, yb, zb));
  }
  // feux arrière LED en U fins + bandeau central
  const ez = (x, y) => Math.min(S.edgeZ(x, y, false), sp.zR + 0.5);
  for (const s of [1, -1]){
    const uv = [[0.3, 0.805], [0.6, 0.81], [0.72, 0.795], [0.76, 0.765], [0.7, 0.735], [0.44, 0.73]];
    const pts = uv.map(([x, y]) => V3(s * x, y, ez(x, y) - 0.004));
    addG('tail', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.014, 6, false));
    addG('tail', new THREE.BoxGeometry(0.34, 0.008, 0.01), cc_M4(s * 0.5, 0.77, ez(0.5, 0.77) - 0.006));
  }
  addG('tail', new THREE.BoxGeometry(0.56, 0.007, 0.01), cc_M4(0, 0.81, ez(0, 0.81) - 0.004));
  // phares effilés : fines lames LED sur l'arête du nez
  const fz = (x, y) => Math.max(S.edgeZ(x, y, true), sp.zF - 0.9);
  for (const s of [1, -1]){
    for (const [dy, r] of [[0, 0.016], [-0.045, 0.008]]){
      const pts = [[0.36, 0.545], [0.56, 0.575], [0.74, 0.565], [0.84, 0.53]].map(([x, y]) => V3(s * x, y + dy, fz(x, y + dy) + 0.002));
      addG('head', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, r, 6, false));
    }
  }
}

/* ================== Piste : lecture tolérante de l'API ================== */
function cc_len(tr){ const l = typeof tr.length === 'function' ? tr.length() : tr.length; return l > 0 ? l : (tr.total || 1000); }
function cc_smp(tr, s){
  const L = cc_len(tr); s = ((s % L) + L) % L;
  const p = tr.sample(s) || {}, q = p.isVector3 ? p : (p.pos || p.p || p.point || p.position || p);
  const o = { x: q.x || 0, y: q.y || 0, z: q.z || 0, tx: 0, tz: 1, k: null };
  const t = p.tangent || p.tan || p.dir || p.t;
  if (p.tx != null && p.tz != null){ o.tx = p.tx; o.tz = p.tz; }
  else if (t && t.x != null){ o.tx = t.x; o.tz = t.z; }
  else if (p.heading != null || p.h != null){ const h = p.heading != null ? p.heading : p.h; o.tx = Math.sin(h); o.tz = Math.cos(h); }
  else { const a = tr.sample((s + 1) % L), b = tr.sample((s - 1 + L) % L), qa = a.pos || a.p || a, qb = b.pos || b.p || b; o.tx = qa.x - qb.x; o.tz = qa.z - qb.z; }
  const l = Math.hypot(o.tx, o.tz) || 1; o.tx /= l; o.tz /= l;
  const wd = p.width != null ? p.width : p.w; if (typeof wd === 'number') o.w = wd;
  const k = p.curvature != null ? p.curvature : p.curv != null ? p.curv : p.k;
  if (typeof k === 'number') o.k = k;
  return o;
}
function cc_hd(tr, s){ const p = cc_smp(tr, s); return Math.atan2(p.tx, p.tz); }
function cc_curv(tr, s){ const p = cc_smp(tr, s); if (p.k != null) return Math.abs(p.k); return Math.abs(wrapAng(cc_hd(tr, s + 4) - cc_hd(tr, s - 4))) / 8; }
function cc_turn(tr, s, span){ return wrapAng(cc_hd(tr, s + span / 2) - cc_hd(tr, s - span / 2)); }
function cc_lim(tr, s){
  if (!tr.limits) return [-7, 7];
  const L = tr.limits(s);
  if (typeof L === 'number') return [-Math.abs(L), Math.abs(L)];
  if (Array.isArray(L)) return (L[0] <= 0 && L[1] >= 0) ? [L[0], L[1]] : [-Math.abs(L[0]), Math.abs(L[1])];
  if (L){
    if (L.min != null && L.max != null) return [L.min, L.max];
    const l = L.left != null ? L.left : L.l != null ? L.l : L.wallL, r = L.right != null ? L.right : L.r != null ? L.r : L.wallR;
    if (l != null && r != null) return [-Math.abs(l), Math.abs(r)];
    const h = L.half != null ? L.half : L.width != null ? L.width / 2 : 7; return [-h, h];
  }
  return [-7, 7];
}
function cc_proj(tr, x, z, hint){
  const r = tr.project(x, z, hint);
  if (typeof r === 'number'){ const p = cc_smp(tr, r); return { s: r, lat: (x - p.x) * -p.tz + (z - p.z) * p.tx }; }
  if (r && r.lat == null){ const p = cc_smp(tr, r.s); r.lat = (x - p.x) * -p.tz + (z - p.z) * p.tx; }
  return r;
}

/* ================== Physique du véhicule ================== */
const CC_SURF = { asphalt: [1, 0], road: [1, 0], shoulder: [0.85, 0.3], curb: [0.92, 0.1], dirt: [0.72, 0.9], gravel: [0.66, 1.4], grass: [0.6, 1.8], sand: [0.55, 3.2] };
let cc_vid = 0;
function createVehicle(typeId){
  const TY = CAR_TYPES[typeId] || CAR_TYPES.kitsune, P = TY.phys, D = TY.dims;
  const GEAR = [0, 0.24, 0.38, 0.52, 0.67, 0.83, 1.0];
  const st = { steerIn: 0, driftT: 0, driftDir: 0, shiftT: 0, hv: 0, prevY: null, prevVy: 0, grip: 1, drag: 0, gn: V3(0, 1, 0), prevSpeed: 0, rollD: 0, pitchD: 0, track: null };
  const V = {
    id: ++cc_vid, type: TY.id, dims: D, pos: V3(), heading: 0, vel: V3(), speed: 0, yawRate: 0, steer: 0, rpm01: 0.15, gear: 1,
    throttle: 0, brake: 0, slip: 0, slipAngle: 0, drifting: false, nitro: 0.35, nitroOn: false, surface: 'asphalt', s: 0, lat: 0,
    roll: 0, pitch: 0, heave: 0, spin: 0, hitWall: 0, hitCar: 0, _hitNext: 0, assist: 0, grip: 1, groundPitch: 0, groundRoll: 0, offTrack: false, driftScore: 0,
  };
  V.maxSteer = v => P.steer / (1 + Math.abs(v) / 13);
  V.reset = (x, y, z, h) => {
    V.pos.set(x, y || 0, z); V.heading = h || 0; V.vel.set(0, 0, 0); V.speed = V.yawRate = V.steer = V.slip = V.slipAngle = 0;
    V.drifting = false; V.nitroOn = false; V.gear = 1; V.rpm01 = 0.15; V.roll = V.pitch = V.heave = 0; V.hitWall = V.hitCar = V._hitNext = 0;
    st.steerIn = 0; st.hv = 0; st.prevY = null; st.prevSpeed = 0; st.rollD = st.pitchD = 0; st.shiftT = 0;
    if (st.track && st.track.project){ const r = cc_proj(st.track, x, z, V.s); if (r){ V.s = r.s; V.lat = r.lat; } }
  };
  const step = (h, thr, brk, hb) => {
    const fx = Math.sin(V.heading), fz = Math.cos(V.heading), rx = -fz, rz = fx;
    let vF = V.vel.x * fx + V.vel.z * fz, vR = V.vel.x * rx + V.vel.z * rz;
    const gS = st.grip, vTop = P.vmax * (1 + V.assist) * (V.nitroOn ? 1.1 : 1);
    // --- longitudinal
    let ax = 0;
    if (thr > 0 && vF > -0.8){
      const x = Math.max(0, vF / vTop);
      let a = x < 1 ? P.acc * (1 + Math.max(0, V.assist) * 1.5) * thr * (1 - Math.pow(x, 2.1)) * (st.shiftT > 0 ? 0.35 : 1) : -(x - 1) * 12;
      if (V.nitroOn) a += 8.5 * (1 - Math.min(1, x) * 0.4);
      ax += a * lerp(0.7, 1, gS);
    }
    if (thr > 0 && vF < -0.8) ax += 16 * thr;
    if (brk > 0){ if (vF > 0.8) ax -= 24 * brk * lerp(0.62, 1, gS); else if (vF > -14) ax -= 9 * brk; }
    if (hb) ax -= Math.sign(vF) * 3.2;
    ax -= Math.sign(vF) * (0.4 + 0.00035 * vF * vF) * (1 - thr) + Math.sign(vF) * st.drag * Math.min(1, Math.abs(vF) / 8) * (1 + Math.abs(vF) * 0.012);
    ax += 9.81 * (st.gn.x * fx + st.gn.z * fz);
    const v0 = vF; vF += ax * h;
    if (v0 > 0 && vF < 0 && !(brk > 0 && v0 < 0.8)) vF = 0;
    if (v0 < 0 && vF > 0 && thr < 0.05) vF = 0;
    // --- braquage et lacet
    const sa = V.maxSteer(vF) * st.steerIn;
    V.steer = sa;
    const slipA = Math.atan2(vR, Math.max(2, Math.abs(vF)));
    if (!V.drifting){
      if (hb && vF > 9 && Math.abs(st.steerIn) > 0.2){ V.drifting = true; st.driftDir = Math.sign(st.steerIn); st.driftT = 0; V.yawRate -= st.driftDir * 0.5; }
      else if (Math.abs(slipA) > 0.3 && vF > 12){ V.drifting = true; st.driftDir = -Math.sign(slipA); st.driftT = 0; }
    }
    let latK;
    if (V.drifting){
      st.driftT += h;
      const k = clamp(vF / 22, 0.45, 1.25);
      let yawT = -(st.driftDir * P.driftYaw * (0.75 + 0.35 * thr) + st.steerIn * 1.15) * k;
      // anti-tête-à-queue : au-delà de ~50° la rotation est freinée
      if (Math.abs(slipA) > 0.85 && Math.sign(yawT) === Math.sign(slipA)) yawT = yawT * 0.2 + Math.sign(slipA) * -0.6 * (Math.abs(slipA) - 0.85);
      V.yawRate = damp(V.yawRate, yawT, 3.2, h);
      latK = P.driftLat * gS * (hb ? 0.75 : 1.15);
      if ((!hb && st.driftT > 0.3 && Math.abs(slipA) < 0.09) || vF < 5) V.drifting = false;
    } else {
      let yawT = -vF * Math.tan(sa) / D.wheelbase;
      const my = P.grip * gS * (1 + Math.max(0, V.assist)) / Math.max(4, Math.abs(vF));
      yawT = clamp(yawT, -my, my);
      V.yawRate = damp(V.yawRate, yawT, 9, h);
      latK = 9 * gS * (hb ? 0.4 : 1);
    }
    // --- adhérence latérale (on conserve une partie de l'élan : arcade)
    const s0 = Math.hypot(vF, vR);
    vR *= Math.exp(-latK * h);
    const s1 = Math.hypot(vF, vR);
    if (s1 > 0.05 && vF > 0){ const k = (s0 - (s0 - s1) * (V.drifting ? 0.12 : 0.5)) / s1; vF *= k; vR *= k; }
    if (V.drifting) vF -= Math.min(Math.max(vF, 0), (0.3 + 1.2 * Math.abs(Math.sin(slipA))) * h);
    V.vel.x = fx * vF + rx * vR; V.vel.z = fz * vF + rz * vR;
    V.heading += V.yawRate * h;
    V.pos.x += V.vel.x * h; V.pos.z += V.vel.z * h;
  };
  V.update = (dt, input, world) => {
    dt = Math.min(dt || 0, 0.05); if (dt <= 0) return V;
    const inp = input || {}, thr = clamp(inp.throttle || 0, 0, 1), brk = clamp(inp.brake || 0, 0, 1), hb = !!inp.handbrake;
    const tr = world && world.track; if (tr) st.track = tr;
    V.hitWall = 0; V.hitCar = V._hitNext; V._hitNext = 0;
    V.throttle = thr; V.brake = brk;
    const si = clamp(inp.steer || 0, -1, 1);
    st.steerIn = damp(st.steerIn, si, Math.abs(si) > Math.abs(st.steerIn) ? 7 : 10, dt);
    V.nitroOn = !!inp.nitro && V.nitro > 0.01 && thr > 0.1 && V.speed > -1;
    if (V.nitroOn) V.nitro = Math.max(0, V.nitro - dt * 0.24);
    if (st.shiftT > 0) st.shiftT -= dt;
    const n = Math.max(1, Math.ceil(dt / 0.0084)), h = dt / n;
    for (let k = 0; k < n; k++) step(h, thr, brk, hb);
    const fx = Math.sin(V.heading), fz = Math.cos(V.heading), rx = -fz, rz = fx;
    V.speed = V.vel.x * fx + V.vel.z * fz;
    const vR = V.vel.x * rx + V.vel.z * rz;
    V.slipAngle = Math.abs(V.speed) > 3 ? Math.atan2(vR, Math.abs(V.speed)) : 0;
    V.slip = clamp(Math.abs(V.slipAngle) / 0.5, 0, 1);
    // --- sol, surface, suivi de piste
    const g = world && world.ground ? world.ground(V.pos.x, V.pos.z, V.s) : null;
    if (g){
      if (g.s != null) V.s = g.s; if (g.lat != null) V.lat = g.lat;
      V.surface = g.surface || 'asphalt';
      st.gn.set(g.nx || 0, g.ny == null ? 1 : g.ny, g.nz || 0).normalize();
      const gy = g.y || 0;
      if (st.prevY != null){ const vy = (gy - st.prevY) / dt; st.hv -= clamp(vy - st.prevVy, -6, 6) * 0.35; st.prevVy = vy; }
      st.prevY = gy; V.pos.y = gy;
    }
    if (tr && tr.project && (!g || g.s == null)){ const r = cc_proj(tr, V.pos.x, V.pos.z, V.s); if (r){ V.s = r.s; V.lat = r.lat; } }
    const sf = CC_SURF[V.surface] || [0.8, 0.5];
    st.grip = V.grip = 1 - (1 - sf[0]) * (1 - P.dirt * (V.surface === 'asphalt' ? 0 : 1)); st.drag = sf[1] * (1 - P.dirt * 0.5);
    V.offTrack = !(V.surface === 'asphalt' || V.surface === 'road' || V.surface === 'curb');
    // --- murs (track.limits)
    if (tr){
      const lim = cc_lim(tr, V.s), hw = D.width * 0.5;
      let over = 0, side = 0;
      if (V.lat > lim[1] - hw){ over = V.lat - (lim[1] - hw); side = 1; } else if (V.lat < lim[0] + hw){ over = lim[0] + hw - V.lat; side = -1; }
      if (over > 0){
        const tp = cc_smp(tr, V.s), nx = -tp.tz * side, nz = tp.tx * side;
        V.pos.x -= nx * over; V.pos.z -= nz * over; V.lat -= side * over;
        const vn = V.vel.x * nx + V.vel.z * nz;
        if (vn > 0){
          V.vel.x -= nx * vn * 1.35; V.vel.z -= nz * vn * 1.35;
          V.vel.multiplyScalar(1 - clamp((vn - 1.5) / 25, 0, 0.5) * 0.6);
          V.hitWall += vn;
          // le cap se réaligne le long du mur
          const ht = Math.atan2(tp.tx, tp.tz), hw2 = Math.abs(wrapAng(ht - V.heading)) < Math.PI / 2 ? ht : ht + Math.PI;
          if (vn > 1.2){ V.heading += wrapAng(hw2 - V.heading) * clamp(0.1 + vn / 40, 0, 0.6); V.yawRate *= 0.3; }
          if (vn > 4) V.drifting = false;
        }
      }
    }
    // --- collisions voiture-voiture (deux cercles chacune)
    const cars = world && world.cars;
    if (cars) for (const o of cars){
      if (!o || o === V || !o.pos || (o.id || 0) < V.id) continue;
      const dx0 = o.pos.x - V.pos.x, dz0 = o.pos.z - V.pos.z; if (dx0 * dx0 + dz0 * dz0 > 64) continue;
      const ra = D.width * 0.52, rb = (o.dims ? o.dims.width : 1.8) * 0.52, la = D.wheelbase * 0.42, lb = (o.dims ? o.dims.wheelbase : 2.6) * 0.42;
      const fa = [Math.sin(V.heading), Math.cos(V.heading)], fb = [Math.sin(o.heading), Math.cos(o.heading)];
      for (const sa of [la, -la]) for (const sb of [lb, -lb]){
        const ax = V.pos.x + fa[0] * sa, az = V.pos.z + fa[1] * sa, bx = o.pos.x + fb[0] * sb, bz = o.pos.z + fb[1] * sb;
        let dx = ax - bx, dz = az - bz; const d = Math.hypot(dx, dz), pen = ra + rb - d;
        if (pen <= 0 || d < 1e-4) continue;
        dx /= d; dz /= d;
        V.pos.x += dx * pen * 0.5; V.pos.z += dz * pen * 0.5; o.pos.x -= dx * pen * 0.5; o.pos.z -= dz * pen * 0.5;
        const vr = (V.vel.x - o.vel.x) * dx + (V.vel.z - o.vel.z) * dz;
        if (vr < 0){
          const J = -vr * 1.25 / 2;
          V.vel.x += dx * J; V.vel.z += dz * J; o.vel.x -= dx * J; o.vel.z -= dz * J;
          // couple : un choc décentré fait pivoter
          V.yawRate += sa * -(dx * -fa[1] + dz * fa[0]) * J * 0.1;
          o.yawRate += sb * (dx * -fb[1] + dz * fb[0]) * J * 0.1;
          V.hitCar += J; o._hitNext = (o._hitNext || 0) + J;
        }
      }
    }
    // --- boîte, régime
    const sp = Math.abs(V.speed), vt = P.vmax * 1.04;
    if (V.speed < -0.5) V.gear = -1;
    else {
      let gr = Math.max(1, V.gear);
      if (sp > GEAR[gr] * vt * 0.985 && gr < 6){ gr++; st.shiftT = 0.14; }
      else if (gr > 1 && sp < GEAR[gr - 1] * vt * 0.8) gr--;
      V.gear = gr;
    }
    const top = V.gear < 0 ? 14 : GEAR[V.gear] * vt;
    let rpm = clamp(sp / top, 0, 1);
    rpm = Math.max(rpm, 0.14 + (sp < 2 ? thr * 0.55 : 0), V.drifting ? 0.55 + 0.4 * thr * V.slip : 0);
    V.rpm01 = damp(V.rpm01, clamp(rpm, 0.12, 1), 12, dt);
    // --- caisse : roulis, tangage, pompage
    const aLong = (V.speed - st.prevSpeed) / dt; st.prevSpeed = V.speed;
    const aLat = V.yawRate * V.speed;
    st.pitchD = damp(st.pitchD, clamp(aLong * 0.0045, -0.06, 0.045), 6, dt);
    st.rollD = damp(st.rollD, clamp(aLat * 0.0055, -0.075, 0.075), 6, dt);
    const fxg = st.gn.x * fx + st.gn.z * fz, rxg = st.gn.x * rx + st.gn.z * rz;
    V.groundPitch = -Math.asin(clamp(fxg, -1, 1)); V.groundRoll = Math.asin(clamp(rxg, -1, 1));
    st.hv += (-140 * V.heave - 13 * st.hv) * dt;
    if (V.offTrack && sp > 5) st.hv += (Math.random() - 0.5) * sp * 0.012;
    V.heave = clamp(V.heave + st.hv * dt, -0.08, 0.08);
    V.pitch = V.groundPitch + st.pitchD; V.roll = V.groundRoll + st.rollD;
    V.spin += V.speed / D.wheelRadius * dt;
    // --- nitro : les dérapages remplissent le réservoir
    if (V.drifting && sp > 8){ V.nitro = Math.min(1, V.nitro + dt * 0.16 * V.slip * clamp(sp / 30, 0.3, 1)); V.driftScore += dt * sp * V.slip; }
    V.nitro = Math.min(1, V.nitro + dt * 0.012);
    return V;
  };
  return V;
}

/* ================== Pilote IA ================== */
function createAI(V, o = {}){
  const skill = clamp(o.skill == null ? 0.7 : o.skill, 0, 1), lane = clamp(o.lane || 0, -1, 1);
  const st = { steer: 0, stuck: 0, rev: 0, revSteer: 0, avoid: 0, nitro: false, t: 0, phase: (V.id * 1.7) % 6.28 };
  const out = { throttle: 0, brake: 0, steer: 0, handbrake: false, nitro: false };
  const P = (CAR_TYPES[V.type] || CAR_TYPES.kitsune).phys;
  return {
    name: o.name || 'IA', skill, lane, input: out,
    update(dt, world, ctx = {}){
      const tr = world && world.track; st.t += dt;
      if (!tr){ out.throttle = 0.6; out.brake = 0; out.steer = 0; out.nitro = false; return out; }
      const L = cc_len(tr), sp = Math.max(0, V.speed), fx = Math.sin(V.heading), fz = Math.cos(V.heading);
      // marche arrière de déblocage
      if (st.rev > 0){ st.rev -= dt; out.throttle = 0; out.brake = 1; out.steer = st.revSteer; out.nitro = false; out.handbrake = false; return out; }
      // élastique
      let gap = 0;
      if (ctx.playerProgress != null && ctx.myProgress != null){ gap = ctx.playerProgress - ctx.myProgress; if (Math.abs(ctx.playerProgress) < 60 && Math.abs(ctx.myProgress) < 60 && L > 300) gap *= L; }
      const rub = gap > 35 ? Math.min(0.1, (gap - 35) / 700) : gap < -110 ? -Math.min(0.07, (-gap - 110) / 1400) : 0;
      V.assist = damp(V.assist, rub, 1, dt);
      // vitesse cible selon la courbure à venir
      const aLat = P.grip * (0.78 + 0.14 * skill) * (1 + Math.max(0, V.assist)) * (V.grip || 1), dec = 11 + 4 * skill;
      const look = Math.min(340, sp * sp / (2 * dec) + 50);
      let vT = P.vmax * (1 + V.assist) * 1.1;
      for (let d = 0; d <= look; d += 8){
        const k = cc_curv(tr, V.s + d);
        if (k > 1e-4){ const vc = Math.sqrt(aLat / k), va = Math.sqrt(vc * vc + 2 * dec * Math.max(0, d - sp * 0.3)); if (va < vT) vT = va; }
      }
      if (V.offTrack) vT *= 0.88;
      // évitement des voitures devant
      let avoid = 0, cap = Infinity;
      for (const c of (world.cars || [])){
        if (!c || c === V || !c.pos) continue;
        const dx = c.pos.x - V.pos.x, dz = c.pos.z - V.pos.z, fwd = dx * fx + dz * fz, side = -dx * fz + dz * fx;
        // voisin à côté : on s'écarte
        if (Math.abs(fwd) < 5.5 && Math.abs(side) < 3) avoid -= Math.sign(side || 1) * (3 - Math.abs(side)) * 1.4;
        if (fwd > 0 && fwd < 32 && Math.abs(side) < 3.6 && V.speed - c.speed > -1.5){
          const w = 1 - fwd / 32, dir = side > 0.25 ? -1 : side < -0.25 ? 1 : (V.lat > 0 ? -1 : 1);
          avoid += dir * (3.6 - Math.abs(side)) * w * 1.15;
          if (fwd < 11 && Math.abs(side) < 2.1) cap = Math.min(cap, c.speed + fwd * 0.5 - 0.5);
        }
      }
      st.avoid = damp(st.avoid, clamp(avoid, -4.5, 4.5), 3, dt);
      vT = Math.min(vT, Math.max(cap, 6));
      // trajectoire : point visé à s + anticipation, intérieur des virages
      const Ld = clamp(7 + sp * 0.42, 9, 42), sA = V.s + Ld, lim = cc_lim(tr, sA), hw = V.dims.width / 2 + 0.6;
      const pA = cc_smp(tr, sA), road = pA.w ? pA.w / 2 : Math.min(lim[1], -lim[0]) * 0.8;
      const half = Math.max(0.3, Math.min(road, lim[1], -lim[0]) - hw);
      const dh = cc_turn(tr, V.s + Ld * 0.7, 36);
      const rl = clamp(-dh / 0.55, -1, 1) * 0.6 * half;
      let latT = lane * 0.42 * half + rl * (0.35 + 0.5 * skill) + st.avoid + Math.sin(st.t * 0.37 + st.phase) * (1 - skill) * 0.7;
      latT = clamp(latT, Math.max(lim[0] + hw, -half), Math.min(lim[1] - hw, half));
      const p = pA, tx = p.x - p.tz * latT, tz = p.z + p.tx * latT;
      const dx = tx - V.pos.x, dz = tz - V.pos.z, lf = dx * fx + dz * fz, ls = -dx * fz + dz * fx;
      const alpha = Math.atan2(ls, lf), dist = Math.max(4, Math.hypot(dx, dz));
      const delta = Math.atan(2 * Math.sin(alpha) / dist * V.dims.wheelbase);
      let steer = delta / Math.max(0.04, V.maxSteer(sp));
      if (V.drifting) steer += clamp(V.slipAngle * 1.2, -0.8, 0.8);
      st.steer = damp(st.steer, clamp(steer, -1, 1), 7 + 6 * skill, dt);
      // gaz / frein
      const dv = vT - sp; let thr, brk;
      if (dv > 1.5){ thr = 1; brk = 0; } else if (dv > -1.5){ thr = clamp(0.5 + dv * 0.3, 0, 1); brk = 0; } else { thr = 0; brk = clamp(-dv / 4, 0.3, 1); }
      if (Math.abs(st.steer) > 0.95 && sp > 25) thr *= 0.6;
      // nitro en ligne droite
      let wantN = false;
      if (V.nitro > 0.12 && sp > 20 && dv > 4 && Math.abs(st.steer) < 0.3 && !V.offTrack){
        let mk = 0; for (let d = 0; d <= 180; d += 15) mk = Math.max(mk, cc_curv(tr, V.s + d));
        wantN = mk < 0.004 && (st.nitro || Math.random() < dt * (0.4 + skill));
      }
      st.nitro = wantN;
      // bloqué ou à contresens : marche arrière
      if (sp < 1.5 && thr > 0.5) st.stuck += dt; else st.stuck = Math.max(0, st.stuck - dt * 2);
      const ang = Math.abs(wrapAng(cc_hd(tr, V.s) - V.heading));
      if (st.stuck > 1.5 || (ang > 2.0 && sp < 4)){ st.rev = 1.1; st.revSteer = -Math.sign(st.steer || 1); st.stuck = 0; }
      out.throttle = thr; out.brake = brk; out.steer = st.steer; out.nitro = wantN; out.handbrake = false;
      return out;
    },
  };
}
