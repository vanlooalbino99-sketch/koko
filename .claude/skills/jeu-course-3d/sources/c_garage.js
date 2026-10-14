import { Reflector } from 'three/addons/objects/Reflector.js';

/* ================== Garage de nuit (vitrine voiture) ================== */
// Hangar industriel loin du circuit : néons, verrière, béton mouillé réfléchissant.
function buildGarage(){
  const R = mulberry32(4242), r = (a = 0, b = 1) => a + R() * (b - a);
  const root = new THREE.Group(); root.name = 'garage'; root.position.set(6000, 0, 6000); root.visible = false;
  const HX = 14, HZ = 20, HY = 9.5; // demi-largeur, demi-longueur, hauteur
  const carHeading = 0.6, carLocal = V3(0, 0, 0);
  const add = (m, x = 0, y = 0, z = 0) => { m.position.set(x, y, z); root.add(m); return m; };
  const box = (w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) => { const g = new THREE.BoxGeometry(w, h, d); g.rotateX(rx); g.rotateY(ry); g.rotateZ(rz); g.translate(x, y, z); return g; };
  const meshOf = (geos, mat, cast = false, recv = true) => { const m = new THREE.Mesh(mergeGeometries(geos), mat); m.castShadow = cast; m.receiveShadow = recv; root.add(m); return m; };

  /* --- textures peintes --- */
  // brique sombre
  const brickTex = (() => { const [c, g] = cnv(512, 512); g.fillStyle = '#1b1719'; g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 16; y++) for (let x = -1; x < 9; x++){ const ox = (y & 1) * 32, v = 30 + r(0, 22) | 0; g.fillStyle = `rgb(${v + 14},${v},${v + 4})`; g.fillRect(x * 64 + ox + 2, y * 32 + 2, 60, 28);
      for (let k = 0; k < 6; k++){ g.fillStyle = `rgba(0,0,0,${r(0.05, 0.2)})`; g.fillRect(x * 64 + ox + r(2, 55), y * 32 + r(2, 25), r(3, 10), r(2, 5)); } }
    for (let k = 0; k < 40; k++){ const gr = g.createLinearGradient(0, 0, 0, 512), x = r(0, 512); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.35)'); g.fillStyle = gr; g.fillRect(x, r(0, 300), r(2, 8), 512); }
    return ctex(c, { repeat: [7, 2] }); })();
  // béton (murs bas, sol)
  const concreteCanvas = (sz, alpha) => { const [c, g] = cnv(sz, sz), im = g.createImageData(sz, sz);
    for (let y = 0; y < sz; y++) for (let x = 0; x < sz; x++){ const n = fbm2(x / 38, y / 38, 4), p = fbm2(x / 90 + 7, y / 90 - 3, 3), v = 26 + n * 34, i = (y * sz + x) * 4;
      im.data[i] = v; im.data[i + 1] = v; im.data[i + 2] = v + 3;
      // flaques : zones plus transparentes (le reflet passe davantage)
      im.data[i + 3] = alpha ? 255 * clamp(0.97 - smooth(0.42, 0.62, p) * 0.42 - n * 0.1, 0.45, 0.97) : 255; }
    g.putImageData(im, 0, 0);
    // joints de dalles
    g.strokeStyle = 'rgba(10,10,12,0.9)'; g.lineWidth = 2; for (let k = 0; k <= 4; k++){ g.beginPath(); g.moveTo(k * sz / 4, 0); g.lineTo(k * sz / 4, sz); g.moveTo(0, k * sz / 4); g.lineTo(sz, k * sz / 4); g.stroke(); }
    return c; };
  const floorTex = ctex(concreteCanvas(512, true), { repeat: [7, 10] });
  const concTex = ctex(concreteCanvas(256, false), { repeat: [10, 1] });

  // graffitis (calque transparent posé sur les murs)
  const graffiti = (w, h, seed, words) => { const [c, g] = cnv(w, h), R2 = mulberry32(seed), q = (a, b) => a + R2() * (b - a);
    const cols = ['#ff2fa8', '#9b4dff', '#21d4ff', '#ffd23a', '#ff6a2a', '#3dff9a'];
    for (let k = 0; k < 7; k++){ const x = q(0, w), y = q(h * 0.2, h * 0.9), rr = q(60, 180), c1 = cols[(q(0, 6)) | 0], c2 = cols[(q(0, 6)) | 0];
      const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, c1); gr.addColorStop(0.6, c2 + 'aa'); gr.addColorStop(1, c2 + '00'); g.fillStyle = gr;
      g.beginPath(); for (let a = 0; a < 7; a++){ const an = a / 7 * Math.PI * 2, rd = rr * q(0.5, 1); g.lineTo(x + Math.cos(an) * rd, y + Math.sin(an) * rd * 0.7); } g.fill(); }
    words.forEach((wd, i) => { const fs = h * q(0.28, 0.4), x = q(10, w * 0.4), y = h * (0.45 + i * 0.35);
      g.save(); g.translate(x, y); g.rotate(q(-0.12, 0.08)); g.font = `italic 900 ${fs}px Impact, Arial Black, sans-serif`;
      g.lineJoin = 'round'; g.lineWidth = fs * 0.16; g.strokeStyle = '#0a0610'; g.strokeText(wd, 0, 0);
      const gr = g.createLinearGradient(0, -fs, 0, 0); gr.addColorStop(0, cols[(i * 2 + 1) % 6]); gr.addColorStop(1, cols[(i * 2 + 2) % 6]); g.fillStyle = gr; g.fillText(wd, 0, 0);
      g.lineWidth = fs * 0.03; g.strokeStyle = '#ffffff'; g.strokeText(wd, 0, 0); g.restore(); });
    // coulures
    for (let k = 0; k < 30; k++){ g.fillStyle = cols[(q(0, 6)) | 0] + '88'; const x = q(0, w), y = q(h * 0.3, h * 0.8); g.fillRect(x, y, 2, q(20, 90)); }
    return ctex(c); };
  // posters peints
  const poster = (kind) => { const [c, g] = cnv(256, 384);
    const bg = g.createLinearGradient(0, 0, 0, 384);
    if (kind === 0){ bg.addColorStop(0, '#2a1f3a'); bg.addColorStop(1, '#0d0a14'); g.fillStyle = bg; g.fillRect(0, 0, 256, 384);
      g.fillStyle = '#e8e2ee'; g.font = '900 120px Arial Black, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('19', 128, 160); g.fillText('96', 128, 280);
      g.fillStyle = '#ff2fa8'; g.fillRect(28, 300, 200, 6); g.font = 'bold 20px Arial'; g.fillStyle = '#a99cc0'; g.fillText('STREET  SERIES', 128, 340); }
    else if (kind === 1){ bg.addColorStop(0, '#ff3d7f'); bg.addColorStop(0.55, '#6a1fb0'); bg.addColorStop(1, '#130825'); g.fillStyle = bg; g.fillRect(0, 0, 256, 384);
      g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(128, 150, 70, 0, 7); g.fill(); g.fillStyle = '#130825'; for (let k = 0; k < 6; k++) g.fillRect(40, 150 + k * 12, 176, 4 + k);
      g.beginPath(); g.moveTo(20, 280); g.quadraticCurveTo(70, 225, 150, 235); g.lineTo(236, 262); g.lineTo(236, 290); g.lineTo(20, 292); g.fill();
      g.fillStyle = '#fff'; g.font = 'italic 900 38px Arial Black, sans-serif'; g.textAlign = 'center'; g.fillText('NIGHT RUN', 128, 345); }
    else { bg.addColorStop(0, '#0d2a3a'); bg.addColorStop(1, '#05080d'); g.fillStyle = bg; g.fillRect(0, 0, 256, 384);
      g.strokeStyle = '#21d4ff'; g.lineWidth = 5; for (let k = 0; k < 7; k++){ g.beginPath(); g.moveTo(0, 120 + k * 22); g.lineTo(256, 60 + k * 30); g.stroke(); }
      g.fillStyle = '#21d4ff'; g.font = '900 54px Impact, Arial Black'; g.textAlign = 'center'; g.fillText('CANYON', 128, 70); g.fillStyle = '#fff'; g.font = 'bold 22px Arial'; g.fillText('MIDNIGHT CUP', 128, 350); }
    // usure du papier
    for (let k = 0; k < 500; k++){ g.fillStyle = `rgba(0,0,0,${R() * 0.25})`; g.fillRect(R() * 256, R() * 384, 2, 2); }
    return ctex(c); };
  const glowTex = (() => { const [c, g] = cnv(128, 128), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return ctex(c); })();
  const beamTex = (() => { const [c, g] = cnv(64, 256), gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
    const gx = g.createLinearGradient(0, 0, 64, 0); gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(0.5, 'rgba(0,0,0,0)'); gx.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = gx; g.fillRect(0, 0, 64, 256); return ctex(c); })();

  /* --- matériaux --- */
  const mBrick = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.9, color: col('#b0a4b8'), emissive: col('#140c1c'), emissiveMap: brickTex, emissiveIntensity: 1 });
  const mConc = new THREE.MeshStandardMaterial({ map: concTex, roughness: 0.85, color: col('#9a98a0') });
  const mSteel = new THREE.MeshStandardMaterial({ color: col('#24252b'), roughness: 0.5, metalness: 0.8 });
  const mDark = new THREE.MeshStandardMaterial({ color: col('#121216'), roughness: 0.7, metalness: 0.3 });
  const mWood = new THREE.MeshStandardMaterial({ color: col('#5a4632'), roughness: 0.85 });
  const mRed = new THREE.MeshStandardMaterial({ color: col('#7a1418'), roughness: 0.4, metalness: 0.5 });
  const mTire = new THREE.MeshStandardMaterial({ color: col('#0c0c0d'), roughness: 0.75 });

  /* --- sol : miroir sous un béton mouillé semi-transparent --- */
  const fw = HX * 2, fd = HZ * 2;
  const mirror = new Reflector(new THREE.PlaneGeometry(fw, fd), { textureWidth: Math.round(clamp(innerWidth * 0.6, 256, 1024)), textureHeight: Math.round(clamp(innerHeight * 0.6, 160, 640)), color: 0x9a9aa6, clipBias: 0.003 });
  mirror.rotation.x = -Math.PI / 2; add(mirror, 0, 0, 0);
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, transparent: true, roughness: 0.62, metalness: 0.1, color: col('#b8b8c4'), envMapIntensity: 0.6 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), floorMat); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; add(floor, 0, 0.008, 0);

  /* --- murs, plafond, verrière --- */
  const wallGeo = [], concGeo = [];
  [[0, -HZ, 0], [0, HZ, Math.PI], [-HX, 0, Math.PI / 2], [HX, 0, -Math.PI / 2]].forEach(([x, z, ry]) => {
    const len = Math.abs(ry) > 0.1 && Math.abs(ry) < 3 ? fd : fw;
    const g = new THREE.PlaneGeometry(len, HY - 1.4, 1, 1); g.rotateY(ry); g.translate(x, 1.4 + (HY - 1.4) / 2, z); wallGeo.push(g);
    const g2 = new THREE.PlaneGeometry(len, 1.4); g2.rotateY(ry); g2.translate(x, 0.7, z); concGeo.push(g2);
  });
  meshOf(wallGeo, mBrick); meshOf(concGeo, mConc);
  // plafond sombre + verrière centrale
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(fw, fd), new THREE.MeshStandardMaterial({ color: col('#0d0d12'), roughness: 0.8, metalness: 0.4 })); ceil.rotation.x = Math.PI / 2; add(ceil, 0, HY, 0);
  const skyMat = new THREE.MeshBasicMaterial({ color: col('#9fb8ff').multiplyScalar(2.2) });
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(9, 26), skyMat); pane.rotation.x = Math.PI / 2; add(pane, 0, HY - 0.02, 2);
  const mull = [];
  for (let i = -4; i <= 4; i++) mull.push(box(0.08, 0.12, 26, i * 1.125, HY - 0.08, 2));
  for (let j = 0; j <= 13; j++) mull.push(box(9, 0.12, 0.08, 0, HY - 0.08, -11 + j * 2));
  meshOf(mull, mDark);
  // charpente : fermes métalliques
  const tr = [];
  for (let z = -HZ + 2.5; z < HZ; z += 5){
    tr.push(box(fw, 0.28, 0.22, 0, HY - 0.4, z), box(fw, 0.22, 0.2, 0, HY - 2.2, z));
    for (let x = -HX + 1; x < HX; x += 2){ tr.push(box(0.1, 2.1, 0.12, x, HY - 1.3, z)); tr.push(box(0.08, 2.6, 0.1, x + 1, HY - 1.3, z, 0, 0, 0.75 * ((x / 2 | 0) & 1 ? 1 : -1))); }
    tr.push(box(0.4, HY, 0.4, -HX + 0.25, HY / 2, z), box(0.4, HY, 0.4, HX - 0.25, HY / 2, z));
  }
  for (let x = -HX + 3; x < HX; x += 5.5) tr.push(box(0.16, 0.24, fd, x, HY - 2.2, 0));
  meshOf(tr, mSteel, false, false);

  /* --- posters et graffitis --- */
  const wallDecal = (tex, w, h, x, y, z, ry, emi = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.8, emissive: col('#ffffff'), emissiveMap: emi ? tex : null, emissiveIntensity: emi })); m.rotation.y = ry; add(m, x, y, z); return m; };
  const P = [poster(0), poster(1), poster(2)];
  // mur du fond (-Z) et murs latéraux
  wallDecal(graffiti(1024, 400, 11, ['NITRO', 'KANYON']), 12, 4.7, -5, 4.2, -HZ + 0.05, 0, 0.4);
  wallDecal(graffiti(1024, 400, 23, ['RUSH']), 10, 3.9, 7, 3.4, -HZ + 0.05, 0, 0.4);
  wallDecal(graffiti(1024, 400, 37, ['MIDNIGHT']), 14, 5.5, HX - 0.05, 4.2, -3, -Math.PI / 2, 0.4);
  wallDecal(graffiti(1024, 400, 51, ['DRIFT', 'CREW']), 13, 5, -HX + 0.05, 4.0, 4, Math.PI / 2, 0.4);
  wallDecal(graffiti(1024, 400, 67, ['NC', '24/7']), 12, 4.7, 2, 4.0, HZ - 0.05, Math.PI, 0.4);
  [[-HX + 0.06, 3.4, -9, Math.PI / 2, 0], [-HX + 0.06, 3.4, -11.6, Math.PI / 2, 1], [-HX + 0.06, 3.4, 13, Math.PI / 2, 2],
   [HX - 0.06, 3.4, 8, -Math.PI / 2, 0], [HX - 0.06, 3.4, 10.6, -Math.PI / 2, 2], [-10, 3.4, -HZ + 0.06, 0, 0], [-1.5, 3.4, HZ - 0.06, Math.PI, 1], [10, 3.4, HZ - 0.06, Math.PI, 0], [12.4, 3.4, -HZ + 0.06, 0, 1]]
    .forEach(([x, y, z, ry, k]) => wallDecal(P[k], 2.1, 3.15, x, y, z, ry, 0.25));

  /* --- néons (tubes émissifs + halos) --- */
  const neons = [];
  const NEON = { pink: '#ff2fa8', violet: '#9b4dff', cyan: '#21d4ff', white: '#dfe6ff' };
  const tube = (hex, a, b, k = 3) => {
    const d = new THREE.Vector3().subVectors(b, a), L = d.length(), mid = a.clone().add(b).multiplyScalar(0.5);
    const base = col(hex), mat = new THREE.MeshBasicMaterial({ color: base.clone().multiplyScalar(k) });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, L, 8), mat); m.position.copy(mid); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize()); root.add(m);
    const halos = [], n = Math.max(2, Math.round(L / 0.9));
    for (let i = 0; i < n; i++){ const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: base, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.55, fog: false }));
      s.position.lerpVectors(a, b, (i + 0.5) / n); s.scale.setScalar(1.5); root.add(s); halos.push(s); }
    const ne = { mat, base, k, halos, ph: r(0, 100), flick: 0 }; neons.push(ne); return ne;
  };
  // grand tube blanc-violet au plafond (comme la capture), tubes muraux
  tube(NEON.white, V3(-3.5, HY - 2.6, -6), V3(3.5, HY - 2.6, -6), 3.2);
  tube(NEON.violet, V3(-3.5, HY - 2.6, 6), V3(3.5, HY - 2.6, 6), 3);
  tube(NEON.pink, V3(-HX + 0.15, 2.2, -14), V3(-HX + 0.15, 2.2, -4), 3);
  tube(NEON.pink, V3(-HX + 0.15, 6.4, -14), V3(-HX + 0.15, 6.4, -4), 2.6);
  tube(NEON.cyan, V3(HX - 0.15, 2.0, -12), V3(HX - 0.15, 2.0, 2), 3);
  tube(NEON.violet, V3(-12, 6.6, -HZ + 0.15), V3(12, 6.6, -HZ + 0.15), 2.6);
  tube(NEON.pink, V3(-8, 1.1, -HZ + 0.15), V3(-8, 4.5, -HZ + 0.15), 3);
  tube(NEON.cyan, V3(9, 1.1, -HZ + 0.15), V3(9, 4.5, -HZ + 0.15), 3);
  tube(NEON.cyan, V3(-10, 2.4, HZ - 0.15), V3(4, 2.4, HZ - 0.15), 3);
  tube(NEON.pink, V3(HX - 0.15, 5.8, 4), V3(HX - 0.15, 5.8, 16), 2.6);
  // bandes lumineuses au sol (lignes blanches/cyan)
  const strip = new THREE.MeshBasicMaterial({ color: col('#cfe9ff').multiplyScalar(1.6) });
  [[-7.5, 0], [7.5, 0]].forEach(([x]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.01, 30), strip); add(m, x, 0.012, 0); });
  // plateau tournant discret : anneau lumineux affleurant
  const ringMat = new THREE.MeshBasicMaterial({ color: col(NEON.cyan).multiplyScalar(0.9), transparent: true, opacity: 0.6 });
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.17, 3.2, 96), ringMat); ring.rotation.x = -Math.PI / 2; add(ring, carLocal.x, 0.013, carLocal.z);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(3.15, 64), new THREE.MeshStandardMaterial({ color: col('#0e0e12'), roughness: 0.35, metalness: 0.6, transparent: true, opacity: 0.35 })); disc.rotation.x = -Math.PI / 2; add(disc, carLocal.x, 0.011, carLocal.z);

  /* --- accessoires : étagères, caisses, pneus, servantes, mezzanine --- */
  const shelf = [], crates = [], tires = [], reds = [];
  const shelfAt = (x, z, ry) => { const c = Math.cos(ry), s = Math.sin(ry), P2 = (u, v) => [x + u * c + v * s, z - u * s + v * c];
    for (const u of [-1.5, 1.5]) for (const v of [-0.4, 0.4]){ const [px, pz] = P2(u, v); shelf.push(box(0.06, 3, 0.06, px, 1.5, pz)); }
    for (const y of [0.3, 1.2, 2.1, 2.95]){ const [px, pz] = P2(0, 0); shelf.push(box(3.1, 0.04, 0.85, px, y, pz, 0, ry));
      for (let k = 0; k < 3; k++) if (R() < 0.8){ const [bx, bz] = P2(r(-1.1, 1.1), 0), h = r(0.3, 0.6); crates.push(box(r(0.4, 0.7), h, 0.6, bx, y + h / 2 + 0.02, bz, 0, ry + r(-0.15, 0.15))); } } };
  shelfAt(-HX + 0.6, -1, Math.PI / 2); shelfAt(-HX + 0.6, 8, Math.PI / 2); shelfAt(HX - 0.6, -14, -Math.PI / 2); shelfAt(4, HZ - 0.6, Math.PI);
  // caisses empilées
  [[-9, -16], [-10.2, -15.4], [11, 14], [-11, 15], [6, -17]].forEach(([x, z], i) => { for (let k = 0; k < 1 + (i % 3); k++){ const s = r(0.8, 1.1); crates.push(box(s, s * 0.8, s, x + r(-0.2, 0.2), s * 0.4 + k * s * 0.8, z, 0, r(-0.3, 0.3))); } });
  // piles de pneus
  [[-11.5, -6], [-11.5, -4.9], [11.4, 4], [8, -17.5]].forEach(([x, z]) => { const n = 3 + (R() * 3 | 0); for (let k = 0; k < n; k++){ const g = new THREE.TorusGeometry(0.3, 0.13, 8, 20); g.rotateX(Math.PI / 2); g.translate(x, 0.13 + k * 0.26, z); tires.push(g); } });
  // servantes d'outils rouges
  [[-HX + 0.6, -7.5], [HX - 0.6, -6.5], [-3, -HZ + 0.6]].forEach(([x, z]) => { reds.push(box(1.2, 1.0, 0.55, x, 0.55, z)); for (let k = 0; k < 4; k++) reds.push(box(1.1, 0.02, 0.02, x, 0.2 + k * 0.22, z + (z > 0 ? -0.29 : 0.29) * (Math.abs(x) > 10 ? 0 : 1))); });
  // mezzanine côté +X avec garde-corps
  shelf.push(box(4, 0.25, 22, HX - 2, 4.2, 6));
  for (let z = -5; z <= 17; z += 2.2){ shelf.push(box(0.05, 1.05, 0.05, HX - 4, 4.8, z)); shelf.push(box(0.25, 4.1, 0.25, HX - 4, 2.05, z)); }
  shelf.push(box(0.06, 0.06, 22, HX - 4, 5.3, 6), box(0.05, 0.05, 22, HX - 4, 4.8, 6));
  for (let k = 0; k < 8; k++){ const s = r(0.6, 1); crates.push(box(s, s * 0.8, s, HX - r(1, 3), 4.33 + s * 0.4, r(-4, 16), 0, r(-0.4, 0.4))); }
  meshOf(shelf, mSteel, true); meshOf(crates, mWood, true); meshOf(tires, mTire, true); meshOf(reds, mRed, true);

  /* --- faisceaux de la verrière + poussière --- */
  const beams = [];
  const beamMat = new THREE.MeshBasicMaterial({ map: beamTex, color: col('#8fa6ff'), transparent: true, opacity: 0.11, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  [[-2.5, -4], [2.2, 1], [-1, 8], [3, -9]].forEach(([x, z]) => { const g = new THREE.Group(); for (let k = 0; k < 2; k++){ const p = new THREE.Mesh(new THREE.PlaneGeometry(2.4, HY), beamMat); p.rotation.y = k * Math.PI / 2; p.position.y = -HY / 2; g.add(p); }
    g.position.set(x, HY, z); g.rotation.set(0.22, 0, -0.18); root.add(g); beams.push(g); });
  const DN = 700, dpos = new Float32Array(DN * 3), dseed = new Float32Array(DN);
  for (let i = 0; i < DN; i++){ dpos[i * 3] = r(-5, 5); dpos[i * 3 + 1] = r(0.2, HY - 1); dpos[i * 3 + 2] = r(-12, 12); dseed[i] = r(0, 100); }
  const dgeo = new THREE.BufferGeometry(); dgeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
  const dust = new THREE.Points(dgeo, new THREE.PointsMaterial({ map: glowTex, color: col('#b8c4ff'), size: 0.05, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  root.add(dust); const dbase = dpos.slice();

  /* --- vraies lumières (5) --- */
  const L = [];
  const key = new THREE.SpotLight(col('#c9d4ff'), 170, 22, 0.55, 0.6, 1.6); key.position.set(-1.5, HY - 0.3, 1); key.target.position.copy(carLocal); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; key.shadow.camera.near = 2; key.shadow.camera.far = 16;
  root.add(key, key.target); L.push(key);
  const rim = new THREE.SpotLight(col('#9a5cff'), 60, 30, 0.38, 0.8, 1.5); rim.position.set(5, 5.5, 11); rim.target.position.copy(carLocal); rim.castShadow = true; rim.shadow.mapSize.set(512, 512); rim.shadow.bias = -0.0005; root.add(rim, rim.target); L.push(rim);
  const pinkL = new THREE.PointLight(col(NEON.pink), 70, 22, 1.6); pinkL.position.set(-11, 3.5, 3); root.add(pinkL); L.push(pinkL);
  const cyanL = new THREE.PointLight(col(NEON.cyan), 90, 22, 1.6); cyanL.position.set(10, 2.4, -4); root.add(cyanL); L.push(cyanL);
  const fillL = new THREE.PointLight(col('#ff6ab8'), 14, 14, 1.8); fillL.position.set(-6, 3.5, -9); root.add(fillL); L.push(fillL);
  const lBase = L.map(l => l.intensity);

  /* --- environnement de reflets (calculé une fois) --- */
  const env = (() => { const es = new THREE.Scene(); es.background = col('#050409');
    const ebox = new THREE.Mesh(new THREE.BoxGeometry(30, 12, 40), new THREE.MeshBasicMaterial({ color: col('#0a0810'), side: THREE.BackSide })); ebox.position.y = 5; es.add(ebox);
    const bar = (hex, k, w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: col(hex).multiplyScalar(k) })); m.position.set(x, y, z); es.add(m); };
    bar('#9fb8ff', 2.5, 8, 0.1, 24, 0, 10.5, 2);           // verrière
    bar(NEON.pink, 5, 0.25, 0.25, 10, -13.5, 2.2, -9); bar(NEON.pink, 4, 0.25, 0.25, 10, -13.5, 6.4, -9);
    bar(NEON.cyan, 5, 0.25, 0.25, 14, 13.5, 2, -5); bar(NEON.violet, 4, 24, 0.25, 0.25, 0, 6.6, -19.5);
    bar(NEON.white, 5, 7, 0.2, 0.2, 0, 6.9, -6); bar(NEON.violet, 4, 7, 0.2, 0.2, 0, 6.9, 6);
    bar(NEON.cyan, 4, 14, 0.25, 0.25, -3, 2.4, 19.5); bar(NEON.pink, 3, 0.25, 0.25, 12, 13.5, 5.8, 10);
    bar('#cfe9ff', 2, 0.15, 0.05, 30, -7.5, 0.05, 0); bar('#cfe9ff', 2, 0.15, 0.05, 30, 7.5, 0.05, 0);
    const pm = new THREE.PMREMGenerator(renderer), rt = pm.fromScene(es, 0.02, 0.1, 100); pm.dispose(); return rt.texture; })();

  /* --- plans caméra (monde) --- */
  const W0 = root.position, carPos = W0.clone().add(carLocal);
  const f = V3(Math.sin(carHeading), 0, Math.cos(carHeading)), lft = V3(Math.cos(carHeading), 0, -Math.sin(carHeading));
  const at = (df, dl, y) => carPos.clone().addScaledVector(f, df).addScaledVector(lft, dl).setY(y);
  const shots = [
    { name: 'arriere34bas', pos: at(-4.9, -3.1, 0.55), look: at(0.9, 0, 1.35), fov: 46 },
    { name: 'avant34', pos: at(5.2, 3.2, 1.5), look: at(0, 0, 0.6), fov: 38 },
    { name: 'profil', pos: at(0.2, -6.5, 1.1), look: at(0.2, 0, 0.7), fov: 36 },
    { name: 'plongee', pos: at(-6, 5, 4.6), look: at(0.5, 0, 0.4), fov: 42 },
  ];

  /* --- entrée / sortie : sauvegarde et restitution de l'état global --- */
  let saved = null;
  const enter = () => {
    if (saved) return;
    saved = { sky: sky.visible, bg: scene.background, env: scene.environment, fog: scene.fog, sun: sunLight.intensity, sunCast: sunLight.castShadow, hemi: hemiLight.intensity,
      hemiC: hemiLight.color.clone(), hemiG: hemiLight.groundColor.clone(), exp: renderer.toneMappingExposure };
    sky.visible = false; scene.background = col('#04050b'); scene.environment = env; scene.fog = new THREE.FogExp2(col('#0a0814'), 0.008);
    sunLight.intensity = 0; sunLight.castShadow = false;
    hemiLight.intensity = 0.55; hemiLight.color.set('#4a4a7a'); hemiLight.groundColor.set('#1a0f1a');
    renderer.toneMappingExposure = 0.85; root.visible = true;
  };
  const exit = () => {
    if (!saved) return; const s = saved; saved = null;
    sky.visible = s.sky; scene.background = s.bg; scene.environment = s.env; scene.fog = s.fog; sunLight.intensity = s.sun; sunLight.castShadow = s.sunCast;
    hemiLight.intensity = s.hemi; hemiLight.color.copy(s.hemiC); hemiLight.groundColor.copy(s.hemiG); renderer.toneMappingExposure = s.exp; root.visible = false;
  };

  /* --- animations --- */
  const update = (dt, t) => {
    if (!root.visible) return;
    neons.forEach((n, i) => { // grésillement : léger bruit + rares coupures
      let v = 0.93 + noise2(t * 6 + n.ph, i) * 0.12;
      if (i === 4 && (Math.sin(t * 1.3) > 0.97)) v *= hash2(t * 40 | 0, i) > 0.5 ? 0.25 : 1;
      n.mat.color.copy(n.base).multiplyScalar(n.k * v); n.halos.forEach(h => h.material.opacity = 0.55 * v); });
    L[2].intensity = lBase[2] * (0.94 + noise2(t * 5, 3) * 0.1); L[3].intensity = lBase[3] * (0.94 + noise2(t * 5, 7) * 0.1);
    ringMat.opacity = 0.7 + Math.sin(t * 1.6) * 0.2;
    for (let i = 0; i < DN; i++){ const s = dseed[i]; dpos[i * 3] = dbase[i * 3] + Math.sin(t * 0.15 + s) * 0.4; dpos[i * 3 + 1] = ((dbase[i * 3 + 1] + t * 0.05 * (0.5 + (s % 1))) % (HY - 1)) + 0.2; dpos[i * 3 + 2] = dbase[i * 3 + 2] + Math.cos(t * 0.12 + s * 1.7) * 0.4; }
    dgeo.attributes.position.needsUpdate = true;
    beamMat.opacity = 0.1 + Math.sin(t * 0.4) * 0.015;
  };

  scene.add(root);
  return { root, carPos, carHeading, shots, enter, exit, update, env };
}
