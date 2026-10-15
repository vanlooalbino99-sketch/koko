
/* ================== Tananarive : textures procédurales ================== */
// Toutes les textures sont dessinées sur canvas, en tailles réelles (mètres indiqués en commentaire)
function tn_rnd(seed){ const r = mulberry32(seed); return (a = 0, b = 1) => a + r() * (b - a); }
function tn_speck(g, w, h, n, cols, s0, s1, r){ for (let i = 0; i < n; i++){ g.fillStyle = cols[(r() * cols.length) | 0]; const s = r(s0, s1); g.fillRect(r(0, w), r(0, h), s, s); } }
// Taches et coulures (crasse de pluie) sur un enduit
function tn_grime(g, w, h, r, k = 1){
  for (let i = 0; i < 26 * k; i++){
    const x = r(0, w), y = r(0, h), rad = r(8, 46), gr = g.createRadialGradient(x, y, 0, x, y, rad), a = r(0.03, 0.09);
    gr.addColorStop(0, `rgba(70,55,40,${a})`); gr.addColorStop(1, 'rgba(70,55,40,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  for (let i = 0; i < 14 * k; i++){ const x = r(0, w), y = r(0, h * 0.7), l = r(20, 90); const gr = g.createLinearGradient(0, y, 0, y + l); gr.addColorStop(0, 'rgba(60,50,40,0.12)'); gr.addColorStop(1, 'rgba(60,50,40,0)'); g.fillStyle = gr; g.fillRect(x, y, r(1.5, 4), l); }
}
// Enduit (4 m × 3,1 m, un étage) : teinté ensuite par la couleur de sommet
function tn_texPlaster(){
  const [c, g] = cnv(256, 256), r = tn_rnd(11);
  g.fillStyle = '#ece8e1'; g.fillRect(0, 0, 256, 256);
  tn_speck(g, 256, 256, 2600, ['rgba(255,255,255,.18)', 'rgba(120,110,95,.12)', 'rgba(150,135,115,.1)'], 1, 3, r);
  tn_grime(g, 256, 256, r);
  // corniche en haut de l'étage, ombre portée dessous, soubassement plus sombre
  g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(0, 0, 256, 7); g.fillStyle = 'rgba(40,30,20,.22)'; g.fillRect(0, 7, 256, 4);
  g.fillStyle = 'rgba(60,45,30,.08)'; g.fillRect(0, 226, 256, 30);
  // fissures
  g.strokeStyle = 'rgba(60,50,40,.28)'; g.lineWidth = 1;
  for (let i = 0; i < 5; i++){ let x = r(0, 256), y = r(20, 240); g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++){ x += r(-8, 8); y += r(3, 10); g.lineTo(x, y); } g.stroke(); }
  return ctex(c, { repeat: [1, 1] });
}
// Brique de latérite des maisons anciennes (4 m × 3,1 m)
function tn_texBrick(){
  const [c, g] = cnv(256, 256), r = tn_rnd(12);
  g.fillStyle = '#d9cfc4'; g.fillRect(0, 0, 256, 256);
  const ch = 6.2, cw = 16;
  for (let row = 0; row * ch < 256; row++){
    const off = (row & 1) * cw / 2;
    for (let x = -cw; x < 256 + cw; x += cw){
      const v = r(0.78, 1.08), red = 168 * v, gr = 82 * v * r(0.9, 1.1), b = 58 * v;
      g.fillStyle = `rgb(${red | 0},${gr | 0},${b | 0})`; g.fillRect(x + off + 0.6, row * ch + 0.6, cw - 1.2, ch - 1.2);
    }
  }
  tn_grime(g, 256, 256, r, 0.8);
  g.fillStyle = 'rgba(230,220,200,.55)'; g.fillRect(0, 0, 256, 6); g.fillStyle = 'rgba(40,25,15,.25)'; g.fillRect(0, 6, 256, 3);
  return ctex(c, { repeat: [1, 1] });
}
// Pierre (2 m × 2 m) : soubassements, Rova, quais
function tn_texStone(){
  const [c, g] = cnv(256, 256), r = tn_rnd(13);
  g.fillStyle = '#6d6458'; g.fillRect(0, 0, 256, 256);
  let y = 0;
  while (y < 256){
    const h = r(18, 34); let x = -r(0, 30);
    while (x < 256){ const w = r(26, 60), v = r(0.75, 1.15); g.fillStyle = `rgb(${(150 * v) | 0},${(140 * v) | 0},${(124 * v) | 0})`; g.fillRect(x + 1.5, y + 1.5, w - 3, h - 3);
      g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x + 1.5, y + 1.5, w - 3, 2); x += w; }
    y += h;
  }
  tn_speck(g, 256, 256, 1500, ['rgba(0,0,0,.12)', 'rgba(255,255,255,.08)'], 1, 2.5, r);
  return ctex(c, { repeat: [1, 1] });
}
// Tuiles rouges (2 m × 2 m)
function tn_texRoof(){
  const [c, g] = cnv(256, 256), r = tn_rnd(14);
  g.fillStyle = '#5a2a1a'; g.fillRect(0, 0, 256, 256);
  const rows = 10, cols = 11, rh = 256 / rows, cw = 256 / cols;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++){
    const x = i * cw + (j & 1) * cw / 2, y = j * rh, v = r(0.8, 1.12);
    const gr = g.createLinearGradient(x, 0, x + cw, 0);
    gr.addColorStop(0, `rgb(${(120 * v) | 0},${(52 * v) | 0},${(34 * v) | 0})`); gr.addColorStop(0.45, `rgb(${(196 * v) | 0},${(96 * v) | 0},${(62 * v) | 0})`); gr.addColorStop(1, `rgb(${(110 * v) | 0},${(46 * v) | 0},${(30 * v) | 0})`);
    g.fillStyle = gr; g.fillRect(x, y, cw - 1, rh - 2); if (x + cw > 256) g.fillRect(x - 256, y, cw - 1, rh - 2);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, y + rh - 3, cw, 3);
  }
  // mousse et salissures
  for (let i = 0; i < 40; i++){ g.fillStyle = `rgba(${r() < 0.5 ? '60,70,40' : '30,25,20'},${r(0.05, 0.16)})`; g.beginPath(); g.arc(r(0, 256), r(0, 256), r(4, 20), 0, 7); g.fill(); }
  return ctex(c, { repeat: [1, 1] });
}
// Fenêtres (4 variantes de 2,1 m × 1,8 m) : volets clairs teintés par la couleur de sommet
function tn_texWindows(){
  const [c, g] = cnv(1024, 256), r = tn_rnd(15);
  for (let v = 0; v < 4; v++){
    const X = v * 256;
    g.fillStyle = '#d8d4cc'; g.fillRect(X, 0, 256, 256);
    const wx = X + 66, ww = 124, wy = 18, wh = 214;
    // vitre : reflet du ciel en dégradé, intérieur sombre
    const gl = g.createLinearGradient(0, wy, 0, wy + wh); gl.addColorStop(0, '#6f8494'); gl.addColorStop(0.45, '#2a3640'); gl.addColorStop(1, '#151b21');
    g.fillStyle = gl; g.fillRect(wx, wy, ww, wh);
    if (v === 3){ g.fillStyle = '#e9e5dc'; g.fillRect(wx, wy, ww, 10); g.beginPath(); g.moveTo(wx, wy + 60); g.quadraticCurveTo(wx + ww / 2, wy - 30, wx + ww, wy + 60); g.lineTo(wx + ww, wy); g.lineTo(wx, wy); g.fill(); }
    // croisillons et cadre
    g.fillStyle = '#eeeae2'; g.fillRect(wx - 6, wy - 6, ww + 12, 8); g.fillRect(wx - 6, wy + wh - 2, ww + 12, 10); g.fillRect(wx - 6, wy, 7, wh); g.fillRect(wx + ww - 1, wy, 7, wh);
    g.fillRect(wx + ww / 2 - 3, wy, 6, wh); for (const f of [0.33, 0.66]) g.fillRect(wx, wy + wh * f, ww, 5);
    // rideau et lumière intérieure parfois
    if (r() < 0.6){ g.fillStyle = 'rgba(235,225,200,.55)'; g.fillRect(wx + 6, wy + 8, ww * 0.22, wh * 0.8); }
    // volets
    const louv = (x, w) => { g.fillStyle = '#e4e0d8'; g.fillRect(x, wy - 4, w, wh + 8); g.fillStyle = 'rgba(0,0,0,.2)'; for (let y = wy; y < wy + wh; y += 9) g.fillRect(x + 4, y, w - 8, 3); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, wy - 4, 2, wh + 8); g.fillRect(x + w - 2, wy - 4, 2, wh + 8); };
    if (v === 1){ louv(wx, ww / 2); louv(wx + ww / 2, ww / 2); }
    else { louv(X + 4, 58); louv(X + 194, 58); }
    // balconnet en fer forgé
    if (v === 2 || v === 3){
      g.strokeStyle = '#1d1d1f'; g.lineWidth = 4; g.strokeRect(wx - 10, wy + wh - 62, ww + 20, 62); g.lineWidth = 2.5;
      for (let x = wx - 6; x < wx + ww + 10; x += 9){ g.beginPath(); g.moveTo(x, wy + wh - 62); g.lineTo(x, wy + wh); g.stroke(); }
      if (v === 2){ // linge qui sèche
        const cols = ['#d23c3c', '#f2c230', '#3a7bd5', '#ffffff', '#2fa36b', '#e57ab0'];
        g.strokeStyle = '#555'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(wx - 10, wy + wh - 70); g.quadraticCurveTo(wx + ww / 2, wy + wh - 60, wx + ww + 10, wy + wh - 70); g.stroke();
        for (let k = 0; k < 5; k++){ g.fillStyle = cols[(r() * cols.length) | 0]; g.fillRect(wx - 4 + k * 27, wy + wh - 68, r(16, 24), r(30, 56)); }
      }
    }
  }
  return ctex(c);
}
// Rez-de-chaussée (4 variantes de 2,8 m × 2,6 m) : porte, boutique, rideau métallique, arcade
function tn_texShops(){
  const [c, g] = cnv(1024, 256), r = tn_rnd(16);
  const goods = ['#d9402b', '#f3c22c', '#2f8f4e', '#3a6fc4', '#f08a24', '#e8e1cf', '#8a5a33', '#c43c78'];
  for (let v = 0; v < 4; v++){
    const X = v * 256;
    g.fillStyle = '#cbc3b6'; g.fillRect(X, 0, 256, 256);
    if (v === 0){ // porte à deux battants
      g.fillStyle = '#efe9df'; g.fillRect(X + 54, 10, 148, 246);
      g.fillStyle = '#5a3a22'; g.fillRect(X + 66, 22, 124, 234);
      g.fillStyle = '#6e4a2c'; for (const dx of [72, 132]) for (const dy of [30, 120]) g.fillRect(X + dx, dy, 52, 80);
      g.fillStyle = '#c9a54a'; g.fillRect(X + 124, 140, 4, 14); g.fillRect(X + 130, 140, 4, 14);
    } else if (v === 1 || v === 2){ // boutique ouverte, étals
      g.fillStyle = '#1b1612'; g.fillRect(X + 12, 26, 232, 230);
      for (let sy = 70; sy < 250; sy += 46){ g.fillStyle = '#4b3524'; g.fillRect(X + 16, sy, 224, 6); for (let k = 0; k < 18; k++){ g.fillStyle = goods[(r() * goods.length) | 0]; const w = r(6, 14), h = r(10, 34); g.fillRect(X + 18 + r(0, 210), sy - h, w, h); } }
      g.fillStyle = 'rgba(255,230,180,.12)'; g.fillRect(X + 12, 26, 232, 230);
      if (v === 2){ // rideau métallique à moitié baissé
        const hgt = r(70, 130); g.fillStyle = '#8f9396'; g.fillRect(X + 12, 26, 232, hgt);
        g.fillStyle = 'rgba(0,0,0,.25)'; for (let y = 30; y < 26 + hgt; y += 7) g.fillRect(X + 12, y, 232, 2);
        g.fillStyle = '#5d6164'; g.fillRect(X + 12, 22 + hgt, 232, 6);
      }
      g.fillStyle = '#e9e2d4'; g.fillRect(X, 0, 256, 26); g.fillRect(X, 0, 12, 256); g.fillRect(X + 244, 0, 12, 256);
    } else { // arcade coloniale
      g.fillStyle = '#ece5d6'; g.fillRect(X, 0, 256, 256);
      g.fillStyle = '#2a241d'; g.beginPath(); g.moveTo(X + 30, 256); g.lineTo(X + 30, 110); g.arc(X + 128, 110, 98, Math.PI, 0); g.lineTo(X + 226, 256); g.fill();
      const gr = g.createLinearGradient(0, 30, 0, 256); gr.addColorStop(0, 'rgba(0,0,0,.6)'); gr.addColorStop(1, 'rgba(90,70,50,.3)'); g.fillStyle = gr; g.fill();
      g.fillStyle = 'rgba(255,240,210,.18)'; g.fillRect(X + 70, 150, 116, 106);
    }
    g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(X, 246, 256, 10);
  }
  return ctex(c);
}
// Enseignes peintes à la main (512 × 128 chacune)
function tn_texSigns(){
  const [c, g] = cnv(1024, 512);
  const S = [['HOTELY GASY', '#1f7a3a', '#fff6d8'], ['FIVAROTANA', '#c4302b', '#ffffff'], ['FARMASIA', '#ffffff', '#1a8f4a'], ['MOFO GASY', '#f2c230', '#5a2a12'],
    ['BOULANGERIE', '#2d5aa8', '#ffffff'], ['ÉPICERIE', '#e8701d', '#ffffff'], ['TAXI-BE 67', '#f4efe2', '#1b4fa0'], ['KAOPERATIVA', '#7a1f2b', '#ffd86b']];
  S.forEach(([t, bg, fg], i) => {
    const x = (i & 1) * 512, y = (i >> 1) * 128;
    g.fillStyle = bg; g.fillRect(x, y, 512, 128);
    g.strokeStyle = fg; g.lineWidth = 6; g.strokeRect(x + 10, y + 10, 492, 108);
    g.font = '800 62px "Barlow Condensed", "Arial Narrow", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillText(t, x + 259, y + 69); g.fillStyle = fg; g.fillText(t, x + 256, y + 66);
    // peinture un peu passée
    for (let k = 0; k < 220; k++){ g.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`; g.fillRect(x + Math.random() * 512, y + Math.random() * 128, 3, 2); }
  });
  return ctex(c);
}
// Asphalte usé avec rapiéçages et nids-de-poule (6 m × 6 m)
function tn_texAsphalt(){
  const [c, g] = cnv(512, 512), r = tn_rnd(17);
  g.fillStyle = '#4a4846'; g.fillRect(0, 0, 512, 512);
  tn_speck(g, 512, 512, 22000, ['#5c5955', '#3c3a38', '#6a6661', '#33312f', '#575049'], 1, 2.4, r);
  for (let i = 0; i < 4; i++){ // rapiéçages plus sombres
    const w = r(50, 170), h = r(30, 110), x = r(0, 512 - w), y = r(0, 512 - h);
    g.fillStyle = `rgba(30,30,30,${r(0.1, 0.22)})`; g.fillRect(x, y, w, h); g.strokeStyle = 'rgba(20,20,20,.3)'; g.lineWidth = 2; g.strokeRect(x, y, w, h);
  }
  for (let i = 0; i < 4; i++){ // nids-de-poule
    const x = r(30, 480), y = r(30, 480), rad = r(8, 18);
    g.fillStyle = 'rgba(25,22,20,.85)'; g.beginPath(); for (let k = 0; k < 9; k++){ const a = k / 9 * 6.28, q = rad * r(0.7, 1.2); g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } g.fill();
    g.strokeStyle = 'rgba(120,110,100,.4)'; g.lineWidth = 2; g.stroke();
  }
  g.strokeStyle = 'rgba(20,20,20,.55)'; g.lineWidth = 1.4;
  for (let i = 0; i < 16; i++){ let x = r(0, 512), y = r(0, 512); g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 10; k++){ x += r(-14, 14); y += r(-14, 14); g.lineTo(x, y); } g.stroke(); }
  for (let i = 0; i < 6; i++){ const x = r(0, 512), y = r(0, 512), rad = r(10, 40), gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, 'rgba(15,12,10,.35)'); gr.addColorStop(1, 'rgba(15,12,10,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  // poussière de latérite sur les bords (u = 0 et 1)
  const e = g.createLinearGradient(0, 0, 512, 0); e.addColorStop(0, 'rgba(150,80,50,.35)'); e.addColorStop(0.12, 'rgba(150,80,50,0)'); e.addColorStop(0.88, 'rgba(150,80,50,0)'); e.addColorStop(1, 'rgba(150,80,50,.35)'); g.fillStyle = e; g.fillRect(0, 0, 512, 512);
  return ctex(c, { repeat: [1, 1] });
}
// Pavés de la Haute-Ville (3 m × 3 m)
function tn_texCobble(){
  const [c, g] = cnv(512, 512), r = tn_rnd(18), hs = new Float32Array(512 * 512);
  g.fillStyle = '#3b352e'; g.fillRect(0, 0, 512, 512);
  const n = 18, cs = 512 / n;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++){
    const x = i * cs + (j & 1) * cs / 2 + r(-2, 2), y = j * cs + r(-2, 2), v = r(0.7, 1.15);
    g.fillStyle = `rgb(${(132 * v) | 0},${(124 * v) | 0},${(112 * v) | 0})`;
    g.beginPath(); g.ellipse(x + cs / 2, y + cs / 2, cs * 0.44, cs * 0.42, r(-0.3, 0.3), 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.12)'; g.beginPath(); g.ellipse(x + cs / 2 - 3, y + cs / 2 - 4, cs * 0.25, cs * 0.18, 0, 0, 7); g.fill();
  }
  const map = ctex(c, { repeat: [1, 1] });
  const id = g.getImageData(0, 0, 512, 512).data;
  const nm = ctex(normalFromHeight(256, (x, y) => id[((y * 2) * 512 + x * 2) * 4] / 255, 3), { repeat: [1, 1], srgb: false });
  return { map, nm };
}
// Trottoir en dalles (2 m × 2 m)
function tn_texSidewalk(){
  const [c, g] = cnv(256, 256), r = tn_rnd(19);
  g.fillStyle = '#9d968c'; g.fillRect(0, 0, 256, 256);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++){ const v = r(0.85, 1.1); g.fillStyle = `rgb(${(170 * v) | 0},${(162 * v) | 0},${(150 * v) | 0})`; g.fillRect(i * 64 + 1.5, j * 64 + 1.5, 61, 61); }
  tn_speck(g, 256, 256, 3000, ['rgba(0,0,0,.08)', 'rgba(255,255,255,.08)', 'rgba(150,80,50,.12)'], 1, 2.2, r);
  tn_grime(g, 256, 256, r, 0.6);
  return ctex(c, { repeat: [1, 1] });
}
// Sol (8 m) : texture neutre, la couleur vient des sommets (herbe, latérite)
function tn_texGround(){
  const [c, g] = cnv(512, 512), r = tn_rnd(20);
  g.fillStyle = '#bdbdb5'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 60; i++){ const x = r(0, 512), y = r(0, 512), rad = r(20, 80), gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, `rgba(${r() < 0.5 ? '255,255,255' : '60,50,40'},${r(0.05, 0.14)})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  tn_speck(g, 512, 512, 26000, ['rgba(255,255,255,.22)', 'rgba(40,35,25,.22)', 'rgba(120,140,80,.18)', 'rgba(150,90,60,.18)'], 1, 3, r);
  g.strokeStyle = 'rgba(40,50,25,.18)'; g.lineWidth = 1; for (let i = 0; i < 2500; i++){ const x = r(0, 512), y = r(0, 512); g.beginPath(); g.moveTo(x, y); g.lineTo(x + r(-2, 2), y - r(3, 7)); g.stroke(); }
  return ctex(c, { repeat: [1, 1] });
}
// Garde-corps en fer (alpha) : balcons, quais du lac
function tn_texRail(){
  const [c, g] = cnv(256, 64);
  g.clearRect(0, 0, 256, 64); g.fillStyle = '#1f1f21';
  g.fillRect(0, 0, 256, 6); g.fillRect(0, 56, 256, 5);
  for (let x = 4; x < 256; x += 16) g.fillRect(x, 0, 3, 64);
  g.strokeStyle = '#1f1f21'; g.lineWidth = 2; for (let x = 4; x < 256; x += 32){ g.beginPath(); g.arc(x + 16, 28, 9, 0, 7); g.stroke(); }
  return ctex(c, { repeat: [1, 1] });
}
// Marquages usés (alpha)
function tn_texMarks(){
  const [c, g] = cnv(64, 256), r = tn_rnd(21);
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 64, 256);
  for (let i = 0; i < 900; i++){ g.fillStyle = `rgba(0,0,0,${r(0.3, 0.9)})`; g.fillRect(r(0, 64), r(0, 256), r(1, 6), r(1, 5)); }
  return ctex(c, { repeat: [1, 1], srgb: false });
}
// Collines lointaines : verdure, latérite et une poussière de maisons
function tn_texFar(){
  const [c, g] = cnv(512, 512), r = tn_rnd(22);
  g.fillStyle = '#c9c9c0'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i++){ const x = r(0, 512), y = r(0, 512), rad = r(20, 90), gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, `rgba(${r() < 0.5 ? '90,110,60' : '170,100,70'},${r(0.1, 0.25)})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  tn_speck(g, 512, 512, 2600, ['#f2ece0', '#e0b98e', '#b8553c', '#d9cdb5', '#9c4a34', '#ffffff'], 1.5, 3.5, r);
  return ctex(c, { repeat: [1, 1] });
}

/* ================== Tananarive : ville des collines, course de rue, balade libre ================== */
// Toute la ville est construite en coordonnées locales dans un groupe placé à x = -30 km (loin du désert et du garage)
const TN_OX = -30000;
function buildTana(onProgress){
  const prog = p => { try { if (onProgress) onProgress(p); } catch (e) {} };
  const R = tn_rnd(2026), TAU = Math.PI * 2;
  const root = new THREE.Group(); root.name = 'tana'; root.position.x = TN_OX; root.visible = false; scene.add(root);

  /* ---------- 1. Lac Anosy (en forme de cœur) et relief ---------- */
  const LK = { x: -140, z: -335, k: 7.2, wy: 1.2 };
  const lakePoly = [];
  for (let i = 0; i < 72; i++){ const t = i / 72 * TAU, hx = 16 * Math.sin(t) ** 3, hz = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); lakePoly.push([LK.x + hx * LK.k, LK.z + hz * LK.k]); }
  const LB = [Infinity, -Infinity, Infinity, -Infinity]; lakePoly.forEach(([x, z]) => { LB[0] = Math.min(LB[0], x); LB[1] = Math.max(LB[1], x); LB[2] = Math.min(LB[2], z); LB[3] = Math.max(LB[3], z); });
  // distance signée au bord du lac (négative dans l'eau)
  function lakeSD(x, z){
    if (x < LB[0] - 60 || x > LB[1] + 60 || z < LB[2] - 60 || z > LB[3] + 60) return 99;
    let inside = false, md = Infinity;
    for (let i = 0, j = lakePoly.length - 1; i < lakePoly.length; j = i++){
      const xi = lakePoly[i][0], zi = lakePoly[i][1], xj = lakePoly[j][0], zj = lakePoly[j][1];
      if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) inside = !inside;
      const ex = xj - xi, ez = zj - zi, t = clamp(((x - xi) * ex + (z - zi) * ez) / (ex * ex + ez * ez), 0, 1), dx = x - xi - ex * t, dz = z - zi - ez * t;
      const d = dx * dx + dz * dz; if (d < md) md = d;
    }
    md = Math.sqrt(md); return inside ? -md : md;
  }
  // île du monument et sa chaussée depuis la pointe nord du cœur
  const ISL = { x: -140, z: -338, r: 15, z1: -294 };
  const onIsland = (x, z, m = 0) => Math.hypot(x - ISL.x, z - ISL.z) < ISL.r + m || (Math.abs(x - ISL.x) < 2.6 + m && z > ISL.z && z < ISL.z1);
  // collines : Haute-Ville et Rova (sud-est), Faravohitra (nord-est), collines du pourtour
  const HILLS = [[235, -235, 50, 150, 175], [300, 255, 28, 160, 150], [-600, 470, 34, 220, 200], [430, -540, 38, 220, 200], [-230, 120, 9, 140, 160], [480, 40, 30, 160, 220], [120, 520, 22, 200, 120]];
  function H0(x, z){
    let h = 4 + (fbm2(x * 0.0045 + 3.1, z * 0.0045 - 7.7, 3) - 0.5) * 7;
    for (const [cx, cz, a, sx, sz] of HILLS){ const dx = (x - cx) / sx, dz = (z - cz) / sz; h += a * Math.exp(-(dx * dx + dz * dz)); }
    const pad = smooth(-300, -390, x); if (pad > 0) h = lerp(h, 0.7 + (fbm2(x * 0.02, z * 0.02, 2) - 0.5) * 0.6, pad * 0.95);
    const ld = lakeSD(x, z); if (ld < 40) h = lerp(h, -2.5, smooth(40, -20, ld));
    return h;
  }
  prog(0.04);

  /* ---------- 2. Circuit de course dans les rues ---------- */
  // x, z, demi-largeur, section
  const CP = [
    [-40, 250, 11, 'avenue'], [-40, 120, 11, 'avenue'], [-40, 10, 11, 'avenue'],
    [-25, -45, 7, 'analakely'], [30, -85, 6.5, 'analakely'], [110, -100, 6.5, 'analakely'],
    [180, -85, 5.5, 'haute-ville'], [255, -120, 5.5, 'haute-ville'], [300, -185, 5.5, 'haute-ville'], [292, -265, 5.5, 'haute-ville'], [235, -318, 5.5, 'haute-ville'],
    [150, -335, 6, 'descente'], [60, -305, 6, 'descente'],
    [-8, -300, 6.5, 'anosy'], [-18, -385, 6.5, 'anosy'], [-80, -470, 6.5, 'anosy'], [-200, -464, 6.5, 'anosy'], [-272, -385, 6.5, 'anosy'],
    [-370, -335, 5.5, 'rizieres'], [-420, -220, 5.5, 'rizieres'], [-425, -20, 5.5, 'rizieres'], [-405, 170, 5.5, 'rizieres'],
    [-310, 320, 6.5, 'soarano'], [-170, 385, 7, 'soarano'], [-85, 372, 8, 'soarano'], [-45, 330, 10, 'avenue'],
  ];
  const SECN = ['avenue', 'analakely', 'haute-ville', 'descente', 'anosy', 'rizieres', 'soarano'];
  const SWOF = { avenue: 4.5, analakely: 3, 'haute-ville': 2.2, descente: 3, anosy: 3.5, rizieres: 0, soarano: 3.5 };
  function makeRoad(points, closed, hwFn){
    const crv = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], 0, p[1])), closed, 'centripetal');
    const len = crv.getLength(), n = Math.max(4, Math.round(len / 2)), sp = crv.getSpacedPoints(n);
    const m = closed ? n : n + 1, rd = { closed, n: m, ds: len / n, len, X: new Float64Array(m), Z: new Float64Array(m), Y: new Float64Array(m), TX: new Float64Array(m), TZ: new Float64Array(m), HW: new Float64Array(m), SW: new Float64Array(m), SEC: new Uint8Array(m) };
    for (let i = 0; i < m; i++){ rd.X[i] = sp[i].x; rd.Z[i] = sp[i].z; }
    for (let i = 0; i < m; i++){
      const a = closed ? (i - 1 + m) % m : Math.max(0, i - 1), b = closed ? (i + 1) % m : Math.min(m - 1, i + 1);
      let tx = rd.X[b] - rd.X[a], tz = rd.Z[b] - rd.Z[a]; const l = Math.hypot(tx, tz) || 1; rd.TX[i] = tx / l; rd.TZ[i] = tz / l;
    }
    return rd;
  }
  function smoothArr(A, w, closed, keep){
    const n = A.length, B = new Float64Array(n);
    for (let i = 0; i < n; i++){ let s = 0, c = 0; for (let k = -w; k <= w; k++){ let j = i + k; if (closed) j = (j + n) % n; else if (j < 0 || j >= n) continue; s += A[j]; c++; } B[i] = s / c; }
    for (let i = 0; i < n; i++) if (!keep || !keep(i)) A[i] = B[i];
  }
  function gradeClamp(rd, g, pins){
    const Y = rd.Y, n = rd.n, m = g * rd.ds;
    for (let it = 0; it < 8; it++){
      for (let k = 1; k < (rd.closed ? 2 * n : n); k++){ const i = k % n, a = Y[(k - 1) % n]; Y[i] = clamp(Y[i], a - m, a + m); if (pins) pins(); }
      for (let k = (rd.closed ? 2 * n : n) - 2; k >= 0; k--){ const i = k % n, a = Y[(k + 1) % n]; Y[i] = clamp(Y[i], a - m, a + m); if (pins) pins(); }
    }
  }
  const T = makeRoad(CP.map(p => [p[0], p[1]]), true);
  {
    // demi-largeur et section : celles du point de contrôle le plus proche (largeur lissée)
    for (let i = 0; i < T.n; i++){
      let bd = Infinity, bk = 0; for (let k = 0; k < CP.length; k++){ const d = (CP[k][0] - T.X[i]) ** 2 + (CP[k][1] - T.Z[i]) ** 2; if (d < bd){ bd = d; bk = k; } }
      T.HW[i] = CP[bk][2]; T.SEC[i] = SECN.indexOf(CP[bk][3]); T.SW[i] = SWOF[CP[bk][3]];
    }
    smoothArr(T.HW, 12, true); smoothArr(T.SW, 6, true);
    for (let i = 0; i < T.n; i++) T.Y[i] = H0(T.X[i], T.Z[i]);
    smoothArr(T.Y, 16, true);
    gradeClamp(T, 0.105);
    for (let i = 0; i < T.n; i++){ const sn = SECN[T.SEC[i]]; if (sn === 'rizieres') T.Y[i] = Math.max(T.Y[i], 2.3); if (sn === 'anosy' || sn === 'descente') T.Y[i] = Math.max(T.Y[i], 3.1); }
    smoothArr(T.Y, 8, true);
  }
  const N = T.n, ds = T.ds, L = T.len;
  const CURV = new Float64Array(N), GR = new Float64Array(N);
  for (let i = 0; i < N; i++){ const a = (i - 1 + N) % N, b = (i + 1) % N; CURV[i] = wrapAng(Math.atan2(T.TX[b], T.TZ[b]) - Math.atan2(T.TX[a], T.TZ[a])) / (2 * ds); GR[i] = (T.Y[b] - T.Y[a]) / (2 * ds); }
  const wrapS = s => ((s % L) + L) % L;
  const surfOf = sec => SECN[sec] === 'haute-ville' ? 'cobble' : 'asphalt';
  function sampleL(s, out = {}){
    s = wrapS(s); const f = s / ds; let i = Math.floor(f); const t = f - i; i %= N; const j = (i + 1) % N;
    out.x = T.X[i] + (T.X[j] - T.X[i]) * t; out.y = T.Y[i] + (T.Y[j] - T.Y[i]) * t; out.z = T.Z[i] + (T.Z[j] - T.Z[i]) * t;
    let tx = T.TX[i] + (T.TX[j] - T.TX[i]) * t, tz = T.TZ[i] + (T.TZ[j] - T.TZ[i]) * t; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    out.tx = tx; out.tz = tz; out.rx = -tz; out.rz = tx;
    out.width = 2 * (T.HW[i] + (T.HW[j] - T.HW[i]) * t); out.sw = T.SW[i] + (T.SW[j] - T.SW[i]) * t;
    const sc = T.SEC[t < 0.5 ? i : j]; out.section = SECN[sc]; out.surface = surfOf(sc);
    out.curvature = CURV[i] + (CURV[j] - CURV[i]) * t; out.grade = GR[i] + (GR[j] - GR[i]) * t;
    return out;
  }
  // grille de hachage des points du circuit (recherche de la projection)
  const HC = 48, HM = new Map(), hk = (ix, iz) => (ix + 1024) * 2048 + iz + 1024;
  for (let i = 0; i < N; i++){ const k = hk(Math.floor(T.X[i] / HC), Math.floor(T.Z[i] / HC)); if (!HM.has(k)) HM.set(k, []); HM.get(k).push(i); }
  function refine(i, x, z){
    let bd = Infinity, bs = 0, bl = 0;
    for (const a of [(i - 1 + N) % N, i]){
      const b = (a + 1) % N, ex = T.X[b] - T.X[a], ez = T.Z[b] - T.Z[a], l2 = ex * ex + ez * ez || 1, t = clamp(((x - T.X[a]) * ex + (z - T.Z[a]) * ez) / l2, 0, 1);
      const px = T.X[a] + ex * t, pz = T.Z[a] + ez * t, d = (x - px) ** 2 + (z - pz) ** 2;
      if (d < bd){ bd = d; bs = (a + t) * ds; const l = Math.sqrt(l2); bl = ((x - T.X[a]) * -ez + (z - T.Z[a]) * ex) / l; }
    }
    return { s: wrapS(bs), lat: bl, dist: Math.sqrt(bd) };
  }
  function nearAll(x, z){
    const cx = Math.floor(x / HC), cz = Math.floor(z / HC);
    for (let r = 0; r < 4; r++){
      let bd = Infinity, bi = -1;
      for (let ix = cx - r; ix <= cx + r; ix++) for (let iz = cz - r; iz <= cz + r; iz++){ const a = HM.get(hk(ix, iz)); if (a) for (const i of a){ const d = (T.X[i] - x) ** 2 + (T.Z[i] - z) ** 2; if (d < bd){ bd = d; bi = i; } } }
      if (bi >= 0 && r >= 1) return bi;
    }
    let bd = Infinity, bi = 0; for (let i = 0; i < N; i += 4){ const d = (T.X[i] - x) ** 2 + (T.Z[i] - z) ** 2; if (d < bd){ bd = d; bi = i; } }
    return bi;
  }
  function projectL(x, z, hintS){
    let bi = -1;
    if (hintS != null && hintS === hintS){
      const c = Math.round(wrapS(hintS) / ds); let bd = Infinity, bk = 0;
      for (let k = -30; k <= 30; k++){ const i = (c + k + N) % N, d = (T.X[i] - x) ** 2 + (T.Z[i] - z) ** 2; if (d < bd){ bd = d; bi = i; bk = k; } }
      if (Math.abs(bk) >= 30) bi = -1;
    }
    if (bi < 0) bi = nearAll(x, z);
    return refine(bi, x, z);
  }
  prog(0.1);

  /* ---------- 3. Rues annexes (balade libre et circulation) ---------- */
  // 'J' : raccord sur le circuit ; 'R' : raccord sur une rue déjà tracée
  const SIDE = [
    { name: 'lac', hw: 5, sw: 3, surf: 'asphalt', pts: [[-272, -385, 'J'], [-286, -305], [-246, -233], [-140, -224], [-38, -233], [6, -262], [20, -303, 'J']] },
    { name: 'monument', hw: 2.6, sw: 0, surf: 'sidewalk', pts: [[-140, -224, 'R'], [-140, -262], [-140, -300], [-140, -330]], end: 2.2 },
    { name: 'basse', hw: 4.5, sw: 2.5, surf: 'asphalt', pts: [[-40, 150, 'J'], [40, 153], [115, 126], [152, 55], [126, -16], [75, -92, 'J']] },
    { name: 'faravohitra', hw: 4, sw: 2, surf: 'asphalt', pts: [[152, 55, 'R'], [216, 92], [268, 160], [292, 240]] },
    { name: 'village', hw: 3.5, sw: 0, surf: 'dirt', pts: [[-425, -20, 'J'], [-500, -12], [-570, 30], [-612, 92]] },
  ];
  const ROADS = [Object.assign(T, { name: 'circuit', isTrack: true, surfArr: T.SEC })];
  // hauteur d'une rue déjà construite au point le plus proche
  function roadYAt(rd, x, z){ let bd = Infinity, bi = 0; for (let i = 0; i < rd.n; i++){ const d = (rd.X[i] - x) ** 2 + (rd.Z[i] - z) ** 2; if (d < bd){ bd = d; bi = i; } } return { y: rd.Y[bi], i: bi, x: rd.X[bi], z: rd.Z[bi] }; }
  const JUNC = [];
  for (const sd of SIDE){
    const pts = sd.pts.map(p => p.slice()), pin = [null, null];
    [0, pts.length - 1].forEach((k, e) => {
      const p = pts[k];
      if (p[2] === 'J'){ const pr = projectL(p[0], p[1]), o = sampleL(pr.s); p[0] = o.x; p[1] = o.z; pin[e] = o.y; JUNC.push({ s: pr.s, hw: sd.hw }); }
      else if (p[2] === 'R'){ const ref = ROADS.find(r => r.name === (sd.name === 'monument' ? 'lac' : 'basse')), q = roadYAt(ref, p[0], p[1]); p[0] = q.x; p[1] = q.z; pin[e] = q.y; }
    });
    if (sd.end != null) pin[1] = sd.end;
    const rd = makeRoad(pts.map(p => [p[0], p[1]]), false);
    Object.assign(rd, { name: sd.name, isTrack: false, surf: sd.surf });
    for (let i = 0; i < rd.n; i++){ rd.HW[i] = sd.hw; rd.SW[i] = sd.sw; rd.Y[i] = H0(rd.X[i], rd.Z[i]); }
    smoothArr(rd.Y, 10, false);
    const n = rd.n, total = (n - 1) * rd.ds;
    const pins = () => { if (pin[0] != null) rd.Y[0] = pin[0]; if (pin[1] != null) rd.Y[n - 1] = pin[1]; };
    for (let i = 0; i < n; i++){ const dA = i * rd.ds, dB = total - dA; if (pin[0] != null) rd.Y[i] = lerp(pin[0], rd.Y[i], smooth(0, 45, dA)); if (pin[1] != null) rd.Y[i] = lerp(pin[1], rd.Y[i], smooth(0, 45, dB)); }
    if (sd.name === 'lac') for (let i = 0; i < n; i++) rd.Y[i] = Math.max(rd.Y[i], 3.1);
    if (sd.name === 'monument') for (let i = 0; i < n; i++) rd.Y[i] = lerp(pin[0], pin[1], smooth(0.3, 1, i / (n - 1)));
    pins(); gradeClamp(rd, 0.13, pins); smoothArr(rd.Y, 4, false, i => i === 0 || i === n - 1);
    ROADS.push(rd);
  }
  const roadSurf = (rd, i) => rd.isTrack ? surfOf(rd.SEC[i]) : rd.surf;
  // grille des segments de toutes les rues : distance à la rue la plus proche (sol, terrain, placement)
  const SC = 16, SG = new Map(), sk = (ix, iz) => (ix + 1024) * 2048 + iz + 1024;
  ROADS.forEach((rd, ri) => {
    const segs = rd.closed ? rd.n : rd.n - 1;
    for (let i = 0; i < segs; i++){
      const j = (i + 1) % rd.n, ex = rd.HW[i] + rd.SW[i] + 32;
      const x0 = Math.floor((Math.min(rd.X[i], rd.X[j]) - ex) / SC), x1 = Math.floor((Math.max(rd.X[i], rd.X[j]) + ex) / SC), z0 = Math.floor((Math.min(rd.Z[i], rd.Z[j]) - ex) / SC), z1 = Math.floor((Math.max(rd.Z[i], rd.Z[j]) + ex) / SC);
      for (let ix = x0; ix <= x1; ix++) for (let iz = z0; iz <= z1; iz++){ const k = sk(ix, iz); let a = SG.get(k); if (!a){ a = []; SG.set(k, a); } a.push(ri, i); }
    }
  });
  const NR = { e: 0, d: 0, y: 0, hw: 0, sw: 0, ri: 0, i: 0, t: 0, lat: 0 };
  // rue la plus proche au sens de « distance au bord » ; renvoie null si aucune à moins de ~30 m du trottoir
  function nearRoad(x, z, skip = -1){
    const a = SG.get(sk(Math.floor(x / SC), Math.floor(z / SC))); if (!a) return null;
    let be = Infinity, found = false;
    for (let k = 0; k < a.length; k += 2){
      const ri = a[k]; if (ri === skip) continue;
      const rd = ROADS[ri], i = a[k + 1], j = (i + 1) % rd.n, ex = rd.X[j] - rd.X[i], ez = rd.Z[j] - rd.Z[i], l2 = ex * ex + ez * ez || 1;
      const t = clamp(((x - rd.X[i]) * ex + (z - rd.Z[i]) * ez) / l2, 0, 1), px = rd.X[i] + ex * t, pz = rd.Z[i] + ez * t, d = Math.hypot(x - px, z - pz);
      const hw = rd.HW[i] + (rd.HW[j] - rd.HW[i]) * t, e = d - hw;
      if (e < be){ be = e; found = true; NR.e = e; NR.d = d; NR.hw = hw; NR.sw = rd.SW[i]; NR.ri = ri; NR.i = i; NR.t = t; NR.y = rd.Y[i] + (rd.Y[j] - rd.Y[i]) * t; NR.lat = ((x - rd.X[i]) * -ez + (z - rd.Z[i]) * ex) / Math.sqrt(l2); }
    }
    return found ? NR : null;
  }
  prog(0.16);

  /* ---------- 4. Terrain ---------- */
  const GX0 = -900, GZ0 = -860, GS = 5, GNX = 333, GNZ = 329, GX1 = GX0 + (GNX - 1) * GS, GZ1 = GZ0 + (GNZ - 1) * GS;
  const HG = new Float32Array(GNX * GNZ), TG = new Uint8Array(GNX * GNZ);
  for (let j = 0; j < GNZ; j++) for (let i = 0; i < GNX; i++){
    const x = GX0 + i * GS, z = GZ0 + j * GS, k = j * GNX + i;
    let h = H0(x, z), ty = 0;
    const r = nearRoad(x, z);
    if (r){
      if (r.e < 0){ h = r.y - 0.14; ty = 3; }
      else if (r.e < r.sw + 0.5){ h = r.y + (r.sw > 0 ? 0.04 : -0.1); ty = 1; }
      else { const t = smooth(r.sw + 0.5, r.sw + 24, r.e); h = lerp(r.y + 0.04, h, t); if (r.e < r.sw + 4.5) ty = 1; }
    }
    const ld = lakeSD(x, z);
    if (onIsland(x, z, 1.5)) h = Math.max(h, 2.1);
    else if (ld < 0) h = Math.min(h, LK.wy - 0.6 - Math.min(2.5, -ld * 0.12));
    if (!ty){ if (x < -380) ty = 2; else if (fbm2(x * 0.03, z * 0.03, 2) > 0.68) ty = 1; }
    HG[k] = h; TG[k] = ty;
  }
  // hauteur du terrain (interpolation identique aux triangles du maillage)
  function gridH(x, z){
    const fx = clamp((x - GX0) / GS, 0, GNX - 1.001), fz = clamp((z - GZ0) / GS, 0, GNZ - 1.001), i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j;
    const a = HG[j * GNX + i], b = HG[(j + 1) * GNX + i], c = HG[(j + 1) * GNX + i + 1], d = HG[j * GNX + i + 1];
    return u + v <= 1 ? a + (d - a) * u + (b - a) * v : c + (b - c) * (1 - u) + (d - c) * (1 - v);
  }
  const gridT = (x, z) => TG[clamp(Math.round((z - GZ0) / GS), 0, GNZ - 1) * GNX + clamp(Math.round((x - GX0) / GS), 0, GNX - 1)];
  {
    const n = GNX * GNZ, pos = new Float32Array(n * 3), uv = new Float32Array(n * 2), colr = new Float32Array(n * 3), cc = new THREE.Color();
    const C0 = [col('#6f7c3e'), col('#9c5a3f'), col('#6c6844'), col('#3a3532')];
    for (let j = 0; j < GNZ; j++) for (let i = 0; i < GNX; i++){
      const k = j * GNX + i, x = GX0 + i * GS, z = GZ0 + j * GS;
      pos[k * 3] = x; pos[k * 3 + 1] = HG[k]; pos[k * 3 + 2] = z; uv[k * 2] = x / 8; uv[k * 2 + 1] = z / 8;
      const ty = TG[k], nz = fbm2(x * 0.02 + 5, z * 0.02, 3);
      cc.copy(C0[ty]);
      if (ty === 0){ cc.lerp(col('#8d8350'), smooth(0.45, 0.7, nz) * 0.7); cc.multiplyScalar(0.85 + nz * 0.3); }
      // pentes raides : la latérite apparaît
      const hx = HG[j * GNX + Math.min(GNX - 1, i + 1)] - HG[k], hz = HG[Math.min(GNZ - 1, j + 1) * GNX + i] - HG[k], sl = Math.hypot(hx, hz) / GS;
      if (ty === 0 || ty === 2) cc.lerp(C0[1], smooth(0.35, 0.8, sl));
      colr[k * 3] = cc.r; colr[k * 3 + 1] = cc.g; colr[k * 3 + 2] = cc.b;
    }
    const idx = new Uint32Array((GNX - 1) * (GNZ - 1) * 6); let q = 0;
    for (let j = 0; j < GNZ - 1; j++) for (let i = 0; i < GNX - 1; i++){
      const a = j * GNX + i, b = (j + 1) * GNX + i, c = b + 1, d = a + 1;
      idx[q++] = a; idx[q++] = b; idx[q++] = d; idx[q++] = b; idx[q++] = c; idx[q++] = d;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setAttribute('color', new THREE.BufferAttribute(colr, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: tn_texGround(), vertexColors: true, roughness: 0.95 })); m.receiveShadow = true; m.name = 'terrain'; root.add(m);
  }
  // collines lointaines (la ville déborde sur les collines tout autour)
  {
    const S = 60, n0 = -4500, cnt = 151, cx = -70, cz = -40, pos = [], uv = [], colr = [], idx = [], cc = new THREE.Color();
    const inner = (x, z, m) => x > GX0 + m && x < GX1 - m && z > GZ0 + m && z < GZ1 - m;
    for (let j = 0; j < cnt; j++) for (let i = 0; i < cnt; i++){
      const x = n0 + i * S, z = n0 + j * S, dist = Math.hypot(x - cx, z - cz);
      let h = H0(x, z) + (fbm2(x * 0.0011 + 9, z * 0.0011 - 3, 4) * 260 - 70) * smooth(800, 2400, dist);
      h = Math.max(h, 0); if (inner(x, z, 2)) h -= 6;
      pos.push(x, h, z); uv.push(x / 900, z / 900);
      cc.set('#7d8a55').lerp(col('#a26446'), fbm2(x * 0.002, z * 0.002, 2) * 0.7); colr.push(cc.r, cc.g, cc.b);
    }
    for (let j = 0; j < cnt - 1; j++) for (let i = 0; i < cnt - 1; i++){
      const x = n0 + i * S, z = n0 + j * S; if (inner(x, z, 0) && inner(x + S, z + S, 0)) continue;
      const a = j * cnt + i, b = (j + 1) * cnt + i, c = b + 1, d = a + 1; idx.push(a, b, d, b, c, d);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(colr, 3)); g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: tn_texFar(), vertexColors: true, roughness: 1 })); m.name = 'collines'; root.add(m);
  }
  prog(0.3);

  /* ---------- 5. Chaussées, trottoirs, marquages ---------- */
  const T_ASPH = tn_texAsphalt(), T_COB = tn_texCobble(), T_SIDE = tn_texSidewalk(), T_MARK = tn_texMarks(), T_STONE = tn_texStone();
  const MAT = {
    asphalt: new THREE.MeshStandardMaterial({ map: T_ASPH, roughness: 0.88, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
    cobble: new THREE.MeshStandardMaterial({ map: T_COB.map, normalMap: T_COB.nm, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.82, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
    dirt: new THREE.MeshStandardMaterial({ map: tn_texGround(), color: col('#b8654a'), roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }),
    sidewalk: new THREE.MeshStandardMaterial({ map: T_SIDE, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }),
    marks: new THREE.MeshStandardMaterial({ color: col('#ece9df'), alphaMap: T_MARK, alphaTest: 0.45, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }),
    stone: new THREE.MeshStandardMaterial({ map: T_STONE, roughness: 0.9 }),
  };
  // accumulateurs de géométrie par matériau et par quartier (pour le culling)
  const BK = new Map();
  function bucket(mat, x, z){
    const ck = mat + '|' + (x == null ? 'g' : Math.floor((x - GX0) / 560) + ',' + Math.floor((z - GZ0) / 550));
    let b = BK.get(ck); if (!b){ b = { mat, p: [], u: [], c: [] }; BK.set(ck, b); } return b;
  }
  const WHITE = [1, 1, 1];
  function quad(b, P, UV, C, hint){
    let o = [0, 1, 2, 3];
    if (hint){ const a = P[0], q = P[1], d = P[3], ux = q[0] - a[0], uy = q[1] - a[1], uz = q[2] - a[2], vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2];
      if ((uy * vz - uz * vy) * hint[0] + (uz * vx - ux * vz) * hint[1] + (ux * vy - uy * vx) * hint[2] < 0) o = [0, 3, 2, 1]; }
    const multi = Array.isArray(C[0]);
    for (const k of [o[0], o[1], o[2], o[0], o[2], o[3]]){ const p = P[k], c = multi ? C[k] : C; b.p.push(p[0], p[1], p[2]); b.u.push(UV[k * 2], UV[k * 2 + 1]); b.c.push(c[0], c[1], c[2]); }
  }
  function tri(b, P, UV, C, hint){
    let o = [0, 1, 2];
    if (hint){ const a = P[0], q = P[1], d = P[2], ux = q[0] - a[0], uy = q[1] - a[1], uz = q[2] - a[2], vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2];
      if ((uy * vz - uz * vy) * hint[0] + (uz * vx - ux * vz) * hint[1] + (ux * vy - uy * vx) * hint[2] < 0) o = [0, 2, 1]; }
    for (const k of o){ const p = P[k]; b.p.push(p[0], p[1], p[2]); b.u.push(UV[k * 2], UV[k * 2 + 1]); b.c.push(C[0], C[1], C[2]); }
  }
  const UP = [0, 1, 0];
  // point d'une rue décalé latéralement
  const RP = (rd, i, lat, dy = 0) => [rd.X[i] - rd.TZ[i] * lat, rd.Y[i] + dy, rd.Z[i] + rd.TX[i] * lat];
  ROADS.forEach((rd, ri) => {
    const segs = rd.closed ? rd.n : rd.n - 1;
    for (let i = 0; i < segs; i++){
      const j = (i + 1) % rd.n, sf = roadSurf(rd, i), tile = sf === 'cobble' ? 3 : 6, b = bucket(sf === 'sidewalk' ? 'sidewalk' : sf, rd.X[i], rd.Z[i]);
      const v0 = i * rd.ds / tile, v1 = (i + 1) * rd.ds / tile, hi = rd.HW[i], hj = rd.HW[j];
      quad(b, [RP(rd, i, -hi), RP(rd, i, hi), RP(rd, j, hj), RP(rd, j, -hj)], [-hi / tile, v0, hi / tile, v0, hj / tile, v1, -hj / tile, v1], WHITE, UP);
      // trottoirs (coupés aux carrefours), bordures
      if (rd.SW[i] > 0.3) for (const sd of [-1, 1]){
        const mx = rd.X[i] - rd.TZ[i] * sd * (hi + rd.SW[i] / 2), mz = rd.Z[i] + rd.TX[i] * sd * (hi + rd.SW[i] / 2), o = nearRoad(mx, mz, ri);
        if (o && o.e < rd.SW[i] / 2 + 0.6) continue;
        const bs = bucket('sidewalk', rd.X[i], rd.Z[i]), w0 = hi + rd.SW[i], w1 = hj + rd.SW[j];
        quad(bs, [RP(rd, i, sd * hi, 0.14), RP(rd, i, sd * w0, 0.14), RP(rd, j, sd * w1, 0.14), RP(rd, j, sd * hj, 0.14)], [0, v0 * 3, rd.SW[i] / 2, v0 * 3, rd.SW[j] / 2, v1 * 3, 0, v1 * 3], WHITE, UP);
        const cb = bucket('stone', rd.X[i], rd.Z[i]), nrm = [rd.TZ[i] * sd, 0, -rd.TX[i] * sd];
        quad(cb, [RP(rd, i, sd * hi, -0.05), RP(rd, j, sd * hj, -0.05), RP(rd, j, sd * hj, 0.14), RP(rd, i, sd * hi, 0.14)], [0, 0, rd.ds / 2, 0, rd.ds / 2, 0.1, 0, 0.1], [0.95, 0.95, 0.95], nrm);
        quad(cb, [RP(rd, i, sd * w0, -0.5), RP(rd, j, sd * w1, -0.5), RP(rd, j, sd * w1, 0.14), RP(rd, i, sd * w0, 0.14)], [0, 0, rd.ds / 2, 0, rd.ds / 2, 0.3, 0, 0.3], [0.8, 0.8, 0.8], [-nrm[0], 0, -nrm[2]]);
      }
      // chaussée surélevée vers l'île : murets de pierre
      if (rd.name === 'monument') for (const sd of [-1, 1]){ const nrm = [-rd.TZ[i] * sd, 0, rd.TX[i] * sd]; quad(bucket('stone', null), [RP(rd, i, sd * hi, -3), RP(rd, j, sd * hj, -3), RP(rd, j, sd * hj, 0.5), RP(rd, i, sd * hi, 0.5)], [0, 0, rd.ds / 2, 0, rd.ds / 2, 1.75, 0, 1.75], WHITE, nrm); }
    }
  });
  // marquages blancs (à Madagascar : lignes blanches)
  function markLine(rd, lat, w, on, off, i0 = 0, i1 = rd.closed ? rd.n : rd.n - 1, test){
    const b = bucket('marks', null);
    for (let i = i0; i < i1; i++){
      const j = (i + 1) % rd.n, s = i * rd.ds;
      if (test && !test(i)) continue;
      if (off > 0 && (s % (on + off)) > on) continue;
      const l = typeof lat === 'function' ? lat(i) : lat, l2 = typeof lat === 'function' ? lat(j) : lat;
      quad(b, [RP(rd, i, l - w / 2, 0.012), RP(rd, i, l + w / 2, 0.012), RP(rd, j, l2 + w / 2, 0.012), RP(rd, j, l2 - w / 2, 0.012)], [0, s / 3, 1, s / 3, 1, (s + rd.ds) / 3, 0, (s + rd.ds) / 3], WHITE, UP);
    }
  }
  {
    const sec = i => SECN[T.SEC[i]], av = i => sec(i) === 'avenue', paved = i => sec(i) !== 'haute-ville';
    markLine(T, 0.2, 0.13, 1, 0, 0, N, av); markLine(T, -0.2, 0.13, 1, 0, 0, N, av);
    markLine(T, i => T.HW[i] * 0.5, 0.15, 3, 6, 0, N, av); markLine(T, i => -T.HW[i] * 0.5, 0.15, 3, 6, 0, N, av);
    markLine(T, 0, 0.14, 3, 5, 0, N, i => paved(i) && !av(i));
    markLine(T, i => T.HW[i] - 0.35, 0.14, 1, 0, 0, N, i => paved(i) && sec(i) !== 'rizieres'); markLine(T, i => -(T.HW[i] - 0.35), 0.14, 1, 0, 0, N, i => paved(i) && sec(i) !== 'rizieres');
    for (const rd of ROADS) if (rd.name === 'lac' || rd.name === 'basse' || rd.name === 'faravohitra') markLine(rd, 0, 0.12, 3, 5);
    // ligne de départ en damier, passages piétons
    const b = bucket('marks', null), hw0 = T.HW[0];
    for (let r = 0; r < 2; r++) for (let k = 0; k < Math.floor(hw0 * 2 / 0.6); k++){ if ((k + r) & 1) continue; const l = -hw0 + k * 0.6, s0 = r * 0.6;
      const p = (s, la) => { const o = sampleL(s); return [o.x + o.rx * la, o.y + 0.014, o.z + o.rz * la]; };
      quad(b, [p(s0, l), p(s0, l + 0.6), p(s0 + 0.6, l + 0.6), p(s0 + 0.6, l)], [0, 0, 1, 0, 1, 0.2, 0, 0.2], WHITE, UP); }
    for (const sZ of [70, 160, L * 0.06 + 40]){ const o0 = sampleL(sZ), hw = o0.width / 2;
      for (let l = -hw + 0.6; l < hw - 0.6; l += 1.1){ const p = (s, la) => { const o = sampleL(s); return [o.x + o.rx * la, o.y + 0.014, o.z + o.rz * la]; }; quad(b, [p(sZ, l), p(sZ, l + 0.55), p(sZ + 4, l + 0.55), p(sZ + 4, l)], [0, 0, 1, 0, 1, 1, 0, 1], WHITE, UP); } }
  }
  prog(0.38);

  /* ---------- 6. Occupation du sol, obstacles (collisions) ---------- */
  const OS = 1, ONX = Math.ceil((GX1 - GX0) / OS), ONZ = Math.ceil((GZ1 - GZ0) / OS), OCC = new Uint8Array(ONX * ONZ);
  const oIdx = (x, z) => { const i = Math.floor((x - GX0) / OS), j = Math.floor((z - GZ0) / OS); return (i < 0 || j < 0 || i >= ONX || j >= ONZ) ? -1 : j * ONX + i; };
  const occ = (x, z) => { const k = oIdx(x, z); return k < 0 || OCC[k] > 0; };
  const mark = (x, z) => { const k = oIdx(x, z); if (k >= 0) OCC[k] = 1; };
  // dégagement des rues (distance géométrique exacte, pas la grille)
  const offRoad = (x, z, m) => { const r = nearRoad(x, z); return !r || r.e > r.sw + m; };
  for (let x = LB[0] - 12; x <= LB[1] + 12; x += OS) for (let z = LB[2] - 12; z <= LB[3] + 12; z += OS) if (lakeSD(x, z) < 6) mark(x, z);
  const zone = (x0, z0, r) => { for (let x = x0 - r; x <= x0 + r; x += OS) for (let z = z0 - r; z <= z0 + r; z += OS) if (Math.hypot(x - x0, z - z0) <= r) mark(x, z); };
  const ROVA = { x: 235, z: -235 }, MARKET = { x: 30, z: -8, r: 36 }, GARE = { x: -40, z: 434 };
  zone(ROVA.x, ROVA.z, 46); zone(MARKET.x, MARKET.z, MARKET.r); zone(ISL.x, ISL.z, ISL.r + 4);
  for (let x = GARE.x - 44; x <= GARE.x + 44; x += OS) for (let z = GARE.z - 26; z <= GARE.z + 14; z += OS) mark(x, z);
  // limites de la carte jouable
  const BX0 = -640, BX1 = 505, BZ0 = -610, BZ1 = 525;
  // grille des obstacles
  const OBS = new Map(), OC = 8, okk = (ix, iz) => (ix + 4096) * 8192 + iz + 4096;
  function addObs(o, x0, z0, x1, z1){ for (let ix = Math.floor(x0 / OC); ix <= Math.floor(x1 / OC); ix++) for (let iz = Math.floor(z0 / OC); iz <= Math.floor(z1 / OC); iz++){ const k = okk(ix, iz); let a = OBS.get(k); if (!a){ a = []; OBS.set(k, a); } a.push(o); } }
  function addBox(cx, cz, h, ha, hb){ const o = { t: 0, cx, cz, ax: Math.sin(h), az: Math.cos(h), ha, hb }, r = Math.hypot(ha, hb); addObs(o, cx - r, cz - r, cx + r, cz + r); }
  function addCirc(x, z, r){ addObs({ t: 1, x, z, r }, x - r, z - r, x + r, z + r); }
  prog(0.42);

  /* ---------- 7. Bâtiments ---------- */
  Object.assign(MAT, {
    wall: new THREE.MeshStandardMaterial({ map: tn_texPlaster(), vertexColors: true, roughness: 0.93 }),
    brick: new THREE.MeshStandardMaterial({ map: tn_texBrick(), vertexColors: true, roughness: 0.92 }),
    roof: new THREE.MeshStandardMaterial({ map: tn_texRoof(), vertexColors: true, roughness: 0.78 }),
    win: new THREE.MeshStandardMaterial({ map: tn_texWindows(), vertexColors: true, roughness: 0.38, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }),
    shop: new THREE.MeshStandardMaterial({ map: tn_texShops(), roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }),
    sign: new THREE.MeshStandardMaterial({ map: tn_texSigns(), roughness: 0.55 }),
    rail: new THREE.MeshStandardMaterial({ map: tn_texRail(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.5 }),
    wood: new THREE.MeshStandardMaterial({ color: col('#7a5536'), vertexColors: true, roughness: 0.8 }),
    conc: new THREE.MeshStandardMaterial({ map: MAT.wall ? null : null, color: col('#a8a298'), vertexColors: true, roughness: 0.95 }),
    white: new THREE.MeshStandardMaterial({ color: col('#efebe2'), vertexColors: true, roughness: 0.55 }),
  });
  MAT.conc.map = MAT.wall.map;
  const TINTS = ['#e3ad66', '#e8a283', '#e6b2aa', '#ecd486', '#f2e8d2', '#f3f1ea', '#b9cfd8', '#d47c5a', '#c4d3a8', '#e9c9a0', '#d9d0c0'];
  const COLONIAL = ['#f2e8d2', '#ecdcb6', '#f3f1ea', '#e8cf98', '#e6d2c2'];
  const SHUT = ['#3f6b4a', '#2f5d8a', '#6b4a2e', '#ece6dc', '#7a2e2e', '#c9b48a', '#355f63'];
  const rgb = h => { const c = col(h); return [c.r, c.g, c.b]; };
  const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const P3 = (x, y, z) => [x, y, z];
  // footprint libre ?
  function canPlace(cx, cz, h, ha, hb, m = 0.6){
    if (cx < GX0 + 20 || cx > GX1 - 20 || cz < GZ0 + 20 || cz > GZ1 - 20) return false;
    const a1x = Math.sin(h), a1z = Math.cos(h), a2x = Math.cos(h), a2z = -Math.sin(h);
    for (let u = -ha - m; u <= ha + m + 0.01; u += Math.min(1.2, ha + m)) for (let v = -hb - m; v <= hb + m + 0.01; v += Math.min(1.2, hb + m)){ const x = cx + a1x * u + a2x * v, z = cz + a1z * u + a2z * v; if (occ(x, z) || !offRoad(x, z, 0.3)) return false; }
    return true;
  }
  function claim(cx, cz, h, ha, hb, m = 0.6){
    const a1x = Math.sin(h), a1z = Math.cos(h), a2x = Math.cos(h), a2z = -Math.sin(h);
    for (let u = -ha - m; u <= ha + m + 0.01; u += 1) for (let v = -hb - m; v <= hb + m + 0.01; v += 1) mark(cx + a1x * u + a2x * v, cz + a1z * u + a2z * v);
  }
  const FH = 3.1;
  // toit à deux pans (ou pyramide) au-dessus d'un rectangle
  function roof(cx, cz, h, ha, hb, y1, kind, tint){
    const o = kind === 'tin' ? 0.35 : 0.5, k = kind === 'tin' ? 0.45 : kind === 'steep' ? 1.25 : 0.95;
    let a1x = Math.sin(h), a1z = Math.cos(h), a2x = Math.cos(h), a2z = -Math.sin(h);
    if (hb > ha && kind !== 'pyramid'){ [a1x, a1z, a2x, a2z] = [a2x, a2z, a1x, a1z]; [ha, hb] = [hb, ha]; }
    const W = (u, y, v) => [cx + a1x * u + a2x * v, y, cz + a1z * u + a2z * v];
    const br = bucket('roof', cx, cz), bw = bucket('wall', cx, cz), yE = y1 - o * k, yR = y1 + hb * k, sl = Math.hypot(hb + o, (hb + o) * k);
    if (kind === 'pyramid'){
      const top = W(0, y1 + Math.max(ha, hb) * 1.4, 0), C = [W(-ha - o, yE, -hb - o), W(ha + o, yE, -hb - o), W(ha + o, yE, hb + o), W(-ha - o, yE, hb + o)];
      for (let e = 0; e < 4; e++){ const A = C[e], B = C[(e + 1) % 4], mx = (A[0] + B[0]) / 2 - cx, mz = (A[2] + B[2]) / 2 - cz; tri(br, [A, B, top], [0, 0, 3, 0, 1.5, 3], tint, [mx, 2, mz]); }
      return;
    }
    for (const sd of [-1, 1]){
      quad(br, [W(-ha - o, yE, sd * (hb + o)), W(ha + o, yE, sd * (hb + o)), W(ha + o, yR, 0), W(-ha - o, yR, 0)], [0, 0, (ha + o) * 2 / 2, 0, (ha + o) * 2 / 2, sl / 2, 0, sl / 2], tint, [a2x * sd, 1.2, a2z * sd]);
      tri(bw, [W(sd * ha, y1, -hb), W(sd * ha, y1, hb), W(sd * ha, yR - 0.05, 0)], [0, 0, hb / 2, 0, hb / 4, hb * k / 3.1], [0.92, 0.88, 0.82], [a1x * sd, 0, a1z * sd]);
    }
  }
  // maison ou immeuble : soubassement, murs teintés, fenêtres à volets, boutiques, enseignes, balcon, toit
  function building(cx, cz, h, ha, hb, o){
    const a1x = Math.sin(h), a1z = Math.cos(h), a2x = Math.cos(h), a2z = -Math.sin(h);
    const C = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [cx + a1x * u * ha + a2x * v * hb, cz + a1z * u * ha + a2z * v * hb]);
    let yMin = Infinity, yMax = -Infinity; for (const [x, z] of C){ const y = gridH(x, z); yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); }
    if (o.baseY != null){ yMin = yMax = o.baseY; }
    const F = o.floors, y0 = yMax + 0.08, yB = yMin - 0.8, y1 = y0 + F * FH + (o.roof === 'flat' ? 0.7 : 0);
    const style = o.style, bw = bucket(style === 'brick' ? 'brick' : style === 'stone' ? 'stone' : 'wall', cx, cz), bs = bucket('stone', cx, cz), bwin = bucket('win', cx, cz), bsh = bucket('shop', cx, cz);
    const ct = o.tint, cb = mul(ct, 0.78), sh = o.shutter, front = o.front;
    for (let e = 0; e < 4; e++){
      const A = C[e], B = C[(e + 1) % 4], len = Math.hypot(B[0] - A[0], B[1] - A[1]);
      let nx = (A[0] + B[0]) / 2 - cx, nz = (A[1] + B[1]) / 2 - cz; const nl = Math.hypot(nx, nz) || 1; nx /= nl; nz /= nl;
      const n = [nx, 0, nz], ux = (B[0] - A[0]) / len, uz = (B[1] - A[1]) / len;
      if (y0 - yB > 0.25) quad(bs, [P3(A[0], yB, A[1]), P3(B[0], yB, B[1]), P3(B[0], y0, B[1]), P3(A[0], y0, A[1])], [0, 0, len / 2, 0, len / 2, (y0 - yB) / 2, 0, (y0 - yB) / 2], [0.85, 0.82, 0.78], n);
      const uw = style === 'stone' ? 2 : 4, vh = style === 'stone' ? 2 : FH;
      quad(bw, [P3(A[0], y0, A[1]), P3(B[0], y0, B[1]), P3(B[0], y1, B[1]), P3(A[0], y1, A[1])], [0, 0, len / uw, 0, len / uw, (y1 - y0) / vh, 0, (y1 - y0) / vh], [cb, cb, ct, ct], n);
      // ouvertures
      const nb = Math.max(1, Math.floor(len / 3.3)), bay = len / nb;
      if (bay < 2.3) continue;
      const isFront = e === front;
      for (let f = 0; f < F; f++){
        if (f === 0 && !isFront && o.blind) continue;
        for (let k = 0; k < nb; k++){
          const t = (k + 0.5) * bay, px = A[0] + ux * t + nx * 0.03, pz = A[1] + uz * t + nz * 0.03;
          if (f === 0 && isFront){
            const v = o.ground != null ? o.ground : (o.shops && R() < 0.75 ? (R() < 0.6 ? 1 : 2) : 0), w = Math.min(bay - 0.4, 2.8) / 2, top = y0 + (v === 3 ? 2.9 : 2.45);
            quad(bsh, [P3(px - ux * w, y0 + 0.02, pz - uz * w), P3(px + ux * w, y0 + 0.02, pz + uz * w), P3(px + ux * w, top, pz + uz * w), P3(px - ux * w, top, pz - uz * w)], [v / 4, 0, (v + 1) / 4, 0, (v + 1) / 4, 1, v / 4, 1], WHITE, n);
            if ((v === 1 || v === 2) && R() < (o.signs || 0.4)){
              const si = (R() * 8) | 0, u0 = (si & 1) * 0.5, v1 = 1 - (si >> 1) * 0.25, sw = Math.min(1.25, w), sx = px + nx * 0.06, sz = pz + nz * 0.06;
              quad(bucket('sign', cx, cz), [P3(sx - ux * sw, y0 + 2.5, sz - uz * sw), P3(sx + ux * sw, y0 + 2.5, sz + uz * sw), P3(sx + ux * sw, y0 + 3.05, sz + uz * sw), P3(sx - ux * sw, y0 + 3.05, sz - uz * sw)], [u0, v1 - 0.25, u0 + 0.5, v1 - 0.25, u0 + 0.5, v1, u0, v1], WHITE, n);
            }
            continue;
          }
          if (f === 0 && R() < 0.5) continue;
          let v = o.win; const r = R(); if (v !== 3){ if (r < 0.14) v = 1; else if (r < 0.24) v = 2; }
          const yb = y0 + f * FH + 0.75, w = 1.05;
          quad(bwin, [P3(px - ux * w, yb, pz - uz * w), P3(px + ux * w, yb, pz + uz * w), P3(px + ux * w, yb + 1.8, pz + uz * w), P3(px - ux * w, yb + 1.8, pz - uz * w)], [v / 4, 0, (v + 1) / 4, 0, (v + 1) / 4, 1, v / 4, 1], sh, n);
        }
      }
      // varangue en bois à l'étage, côté rue
      if (isFront && o.balcony && F >= 2){
        const yb = y0 + FH - 0.1, d = 1.0, bwd = bucket('wood', cx, cz), L0 = 0.3, L1 = len - 0.3;
        const p = (t, out, y) => P3(A[0] + ux * t + nx * out, y, A[1] + uz * t + nz * out);
        quad(bwd, [p(L0, 0, yb + 0.15), p(L1, 0, yb + 0.15), p(L1, d, yb + 0.15), p(L0, d, yb + 0.15)], [0, 0, 1, 0, 1, 1, 0, 1], [0.95, 0.9, 0.85], UP);
        quad(bwd, [p(L0, d, yb), p(L1, d, yb), p(L1, d, yb + 0.15), p(L0, d, yb + 0.15)], [0, 0, 1, 0, 1, 1, 0, 1], [0.7, 0.66, 0.6], n);
        quad(bwd, [p(L0, 0, yb), p(L1, 0, yb), p(L1, d, yb), p(L0, d, yb)], [0, 0, 1, 0, 1, 1, 0, 1], [0.5, 0.47, 0.43], [0, -1, 0]);
        quad(bucket('rail', cx, cz), [p(L0, d, yb + 0.15), p(L1, d, yb + 0.15), p(L1, d, yb + 1.1), p(L0, d, yb + 1.1)], [0, 0, (L1 - L0) / 2, 0, (L1 - L0) / 2, 1, 0, 1], WHITE, n);
      }
    }
    if (o.roof === 'flat'){
      const bc = bucket('conc', cx, cz), y = y1 - 0.55;
      quad(bc, [P3(C[0][0], y, C[0][1]), P3(C[1][0], y, C[1][1]), P3(C[2][0], y, C[2][1]), P3(C[3][0], y, C[3][1])], [0, 0, ha / 2, 0, ha / 2, hb / 2, 0, hb / 2], [0.8, 0.78, 0.75], UP);
    } else roof(cx, cz, h, ha, hb, y1, o.roof, o.roofTint || [1, 1, 1]);
    addBox(cx, cz, h, ha, hb); claim(cx, cz, h, ha, hb);
    return { y0, y1 };
  }
  // styles par quartier
  function styleFor(sec){
    const pick = a => a[(R() * a.length) | 0];
    const roofT = () => { const r = R(); return r < 0.62 ? 'tile' : r < 0.82 ? 'tin' : 'flat'; };
    const rt = k => k === 'tin' ? (R() < 0.5 ? [0.55, 0.52, 0.5] : [0.78, 0.48, 0.34]) : mul([1, 1, 1], 0.82 + R() * 0.26);
    const base = (o) => { o.roofTint = rt(o.roof); return o; };
    switch (sec){
      case 'avenue': return { p: 1, w: [13, 20], d: [12, 16], o: () => base({ floors: 3 + (R() < 0.4 ? 1 : 0), style: 'plaster', tint: rgb(pick(COLONIAL)), shutter: rgb(pick(SHUT)), win: 3, ground: 3, roof: R() < 0.5 ? 'tile' : 'flat', balcony: false }) };
      case 'analakely': case 'basse': return { p: 1, w: [7, 12], d: [9, 13], o: () => base({ floors: 2 + ((R() * 3) | 0), style: R() < 0.2 ? 'brick' : 'plaster', tint: rgb(pick(TINTS)), shutter: rgb(pick(SHUT)), win: 0, shops: true, signs: 0.55, roof: roofT(), balcony: R() < 0.3 }) };
      case 'haute-ville': return { p: 0.95, w: [7, 11], d: [8, 11], o: () => base({ floors: 2 + (R() < 0.4 ? 1 : 0), style: R() < 0.55 ? 'brick' : 'plaster', tint: R() < 0.55 ? [1, 1, 1] : rgb(pick(TINTS)), shutter: rgb(pick(SHUT)), win: 0, shops: R() < 0.25, roof: R() < 0.85 ? 'steep' : 'tin', balcony: R() < 0.55 }) };
      case 'rizieres': case 'village': return { p: sec === 'village' ? 0.45 : 0.12, w: [6, 9], d: [6, 8], o: () => base({ floors: 1 + (R() < 0.5 ? 1 : 0), style: 'brick', tint: [1, 1, 1], shutter: rgb(pick(SHUT)), win: 0, roof: R() < 0.7 ? 'steep' : 'tin', balcony: false }) };
      case 'monument': return null;
      default: return { p: 0.95, w: [7, 13], d: [8, 13], o: () => base({ floors: 2 + ((R() * 3) | 0), style: R() < 0.3 ? 'brick' : 'plaster', tint: R() < 0.3 ? [1, 1, 1] : rgb(pick(TINTS)), shutter: rgb(pick(SHUT)), win: 0, shops: R() < 0.5, roof: roofT(), balcony: R() < 0.35 }) };
    }
  }
  let nB = 0;
  // façades continues le long des rues, avec une seconde rangée en terrasse derrière
  ROADS.forEach(rd => {
    const segs = rd.closed ? rd.n : rd.n - 1, total = segs * rd.ds;
    for (const side of [-1, 1]){
      let s = R() * 5;
      while (s < total - 4){
        const i = Math.min(rd.n - 1, Math.floor(s / rd.ds)), sec = rd.isTrack ? SECN[rd.SEC[i]] : rd.name, st = styleFor(sec);
        if (!st){ s += 8; continue; }
        const w = st.w[0] + R() * (st.w[1] - st.w[0]), dp = st.d[0] + R() * (st.d[1] - st.d[0]), im = Math.min(rd.n - 1, Math.floor((s + w / 2) / rd.ds));
        const hw = rd.HW[im] + rd.SW[im], h = Math.atan2(rd.TX[im], rd.TZ[im]), dx = -rd.TZ[im] * side, dz = rd.TX[im] * side, off = hw + 0.95 + dp / 2;
        const cx = rd.X[im] + dx * off, cz = rd.Z[im] + dz * off;
        if (R() < st.p && canPlace(cx, cz, h, w / 2, dp / 2, 0.5)){
          building(cx, cz, h, w / 2, dp / 2, Object.assign(st.o(), { front: side > 0 ? 2 : 0 })); nB++;
          if (sec !== 'avenue' && R() < 0.75){
            const w2 = w * (0.8 + R() * 0.3), d2 = 7 + R() * 5, off2 = off + dp / 2 + 1 + R() * 2 + d2 / 2, c2x = rd.X[im] + dx * off2, c2z = rd.Z[im] + dz * off2;
            if (canPlace(c2x, c2z, h, w2 / 2, d2 / 2, 0.5)){ const o2 = st.o(); o2.shops = false; o2.blind = true; o2.floors = Math.max(1, o2.floors - (R() < 0.5 ? 1 : 0)); building(c2x, c2z, h, w2 / 2, d2 / 2, Object.assign(o2, { front: side > 0 ? 2 : 0 })); nB++; }
          }
        }
        s += w + 0.3 + R() * 1.6;
      }
    }
  });
  prog(0.55);
  // maisons étagées sur les collines, tournées vers la pente
  {
    const want = Math.round(300 + 1100 * Q.props), sp = 11, cand = [];
    for (let z = GZ0 + 30; z < GZ1 - 30; z += sp) for (let x = GX0 + 30; x < GX1 - 30; x += sp) cand.push([x, z]);
    for (let i = cand.length - 1; i > 0; i--){ const j = (R() * (i + 1)) | 0; [cand[i], cand[j]] = [cand[j], cand[i]]; }
    let made = 0;
    for (const [x, z] of cand){
      if (made >= want) break;
      const px = x + (R() - 0.5) * 6, pz = z + (R() - 0.5) * 6;
      if (px < -395 && R() > 0.05) continue;
      const hh = gridH(px, pz), dens = hh > 14 ? 0.92 : 0.78;
      if (R() > dens || occ(px, pz)) continue;
      const gx = gridH(px + 3, pz) - gridH(px - 3, pz), gz = gridH(px, pz + 3) - gridH(px, pz - 3), slope = Math.hypot(gx, gz) / 6;
      if (slope > 0.75) continue;
      const h = slope > 0.05 ? Math.atan2(-gx, -gz) + Math.PI / 2 : R() * TAU, w = 6 + R() * 5, d = 6 + R() * 4;
      if (!canPlace(px, pz, h, w / 2, d / 2, 0.8)) continue;
      const tall = Math.hypot(px - 0, pz - 60) < 170 && R() < 0.07;
      const st = styleFor(hh > 25 ? 'haute-ville' : 'x'), o = st.o();
      o.front = 0; o.shops = false; o.blind = true;
      if (tall){ o.floors = 6 + ((R() * 4) | 0); o.roof = 'flat'; o.style = 'plaster'; o.tint = rgb(R() < 0.5 ? '#e9e6df' : '#d9d3c8'); }
      building(px, pz, h, w / 2, d / 2, o); made++; nB++;
    }
  }
  prog(0.66);

  /* ---------- 8. Lieux : gare de Soarano, Rova, lac Anosy et son monument, marché d'Analakely ---------- */
  function labelTex(text, w, h, bg, fg, font){
    const [c, g] = cnv(w, h); g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + 2); return ctex(c);
  }
  {
    // gare : ailes à deux étages, pavillon central à trois étages avec horloge
    const H = Math.PI / 2, gy = building(GARE.x, GARE.z + 2, H, 9, 9, { floors: 3, style: 'plaster', tint: rgb('#f1e6cc'), shutter: rgb('#2f5d8a'), win: 3, ground: 3, roof: 'pyramid', roofTint: [0.55, 0.42, 0.36], front: 2 });
    for (const sd of [-1, 1]) building(GARE.x + sd * 25, GARE.z, H, 16, 7, { floors: 2, style: 'plaster', tint: rgb('#eee0c2'), shutter: rgb('#2f5d8a'), win: 3, ground: 3, roof: 'tile', roofTint: [0.95, 0.9, 0.88], front: 2 });
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(12, 1.6), new THREE.MeshStandardMaterial({ map: labelTex('SOARANO', 768, 102, '#1d3f6e', '#f6efe0', '700 74px "Barlow Condensed", Arial, sans-serif'), roughness: 0.6 }));
    sg.position.set(GARE.x, gy.y0 + 3.6, GARE.z + 2 - 9 - 0.08); sg.rotation.y = Math.PI; root.add(sg);
    const clk = new THREE.Mesh(new THREE.CircleGeometry(1.3, 32), new THREE.MeshStandardMaterial({ map: (() => { const [c, g] = cnv(128, 128); g.fillStyle = '#f7f3ea'; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.strokeStyle = '#222'; g.lineWidth = 5; g.stroke(); g.lineWidth = 6; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 22); g.moveTo(64, 64); g.lineTo(94, 72); g.stroke(); return ctex(c); })(), roughness: 0.4 }));
    clk.position.set(GARE.x, gy.y0 + 7.3, GARE.z + 2 - 9 - 0.1); clk.rotation.y = Math.PI; root.add(clk);
    // parvis
    const bp = bucket('sidewalk', GARE.x, GARE.z);
    for (let x = GARE.x - 40; x < GARE.x + 40; x += 5) for (let z = GARE.z - 30; z < GARE.z - 9; z += 5){
      const p = (a, b) => P3(a, gridH(a, b) + 0.06, b); quad(bp, [p(x, z), p(x + 5, z), p(x + 5, z + 5), p(x, z + 5)], [x / 2, z / 2, (x + 5) / 2, z / 2, (x + 5) / 2, (z + 5) / 2, x / 2, (z + 5) / 2], WHITE, UP);
    }
  }
  {
    // Rova : palais de pierre à quatre tours d'angle au sommet de la colline
    const yR = gridH(ROVA.x, ROVA.z) + 0.3, h = 0.35, plat = bucket('stone', ROVA.x, ROVA.z);
    const a1x = Math.sin(h), a1z = Math.cos(h), a2x = Math.cos(h), a2z = -Math.sin(h), W = (u, y, v) => P3(ROVA.x + a1x * u + a2x * v, y, ROVA.z + a1z * u + a2z * v);
    const pa = 32, pb = 26, Cn = [W(-pa, 0, -pb), W(pa, 0, -pb), W(pa, 0, pb), W(-pa, 0, pb)];
    quad(plat, [W(-pa, yR, -pb), W(pa, yR, -pb), W(pa, yR, pb), W(-pa, yR, pb)], [0, 0, pa, 0, pa, pb, 0, pb], [0.9, 0.88, 0.85], UP);
    for (let e = 0; e < 4; e++){ const A = Cn[e], B = Cn[(e + 1) % 4], nx = (A[0] + B[0]) / 2 - ROVA.x, nz = (A[2] + B[2]) / 2 - ROVA.z, len = Math.hypot(B[0] - A[0], B[2] - A[2]);
      quad(plat, [P3(A[0], yR - 9, A[2]), P3(B[0], yR - 9, B[2]), P3(B[0], yR + 1.6, B[2]), P3(A[0], yR + 1.6, A[2])], [0, 0, len / 2, 0, len / 2, 5.3, 0, 5.3], [0.8, 0.78, 0.74], [nx, 0, nz]); }
    addBox(ROVA.x, ROVA.z, h, pa, pb);
    // palais principal (murs de pierre, fenêtres cintrées) puis tours et grand toit sombre
    const mk = (u, v, ha, hb, floors, kind) => {
      const cx = ROVA.x + a1x * u + a2x * v, cz = ROVA.z + a1z * u + a2z * v;
      return building(cx, cz, h, ha, hb, { baseY: yR, floors, style: 'stone', tint: [0.86, 0.82, 0.76], shutter: [0.35, 0.3, 0.27], win: 3, ground: 3, roof: kind, roofTint: [0.32, 0.3, 0.3], front: 0 });
    };
    mk(0, 0, 17, 12, 6, 'steep');
    for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) mk(su * 17, sv * 12, 3.8, 3.8, 8, 'pyramid');
    mk(-22, 18, 5, 3.5, 2, 'steep'); mk(20, 19, 4, 3, 2, 'steep');
  }
  prog(0.72);

  /* ---------- 9. Lac Anosy : eau, quais, île du monument ---------- */
  const T_WN = ctex(normalFromHeight(256, (x, y) => {
    const u = x / 256 * TAU, v = y / 256 * TAU;
    return 0.5 + 0.18 * Math.sin(u * 3 + v * 2) + 0.12 * Math.sin(u * 7 - v * 5 + 1.3) + 0.08 * Math.sin(u * 13 + v * 11 + 2.1) + 0.06 * Math.sin(-u * 17 + v * 19);
  }, 1.4), { repeat: [1, 1], srgb: false });
  MAT.water = new THREE.MeshStandardMaterial({ color: col('#2c4a52'), roughness: 0.1, metalness: 0, envMapIntensity: 0.9, normalMap: T_WN, normalScale: new THREE.Vector2(0.28, 0.28) });
  MAT.paddy = new THREE.MeshStandardMaterial({ color: col('#3d5240'), roughness: 0.2, metalness: 0, envMapIntensity: 0.55, normalMap: T_WN, normalScale: new THREE.Vector2(0.12, 0.12), polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  MAT.stone.vertexColors = true;
  {
    const sh = new THREE.Shape(lakePoly.map(([x, z]) => new THREE.Vector2(x, -z)));
    const g = new THREE.ShapeGeometry(sh, 4); g.rotateX(-Math.PI / 2);
    const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 14, uv.getY(i) / 14);
    const m = new THREE.Mesh(g, MAT.water); m.position.y = LK.wy; m.receiveShadow = true; m.name = 'lac'; root.add(m);
    // quai de pierre et garde-corps (sauf l'accès à la chaussée)
    const bq = bucket('stone', null), brl = bucket('rail', null);
    for (let i = 0; i < lakePoly.length; i++){
      const A = lakePoly[i], B = lakePoly[(i + 1) % lakePoly.length], mx = (A[0] + B[0]) / 2, mz = (A[1] + B[1]) / 2;
      if (Math.abs(mx - ISL.x) < 4 && mz > ISL.z1 - 12) continue;
      const len = Math.hypot(B[0] - A[0], B[1] - A[1]), ex = (B[0] - A[0]) / len, ez = (B[1] - A[1]) / len;
      let nx = -ez, nz = ex; if (lakeSD(mx + nx * 2, mz + nz * 2) > 0){ nx = -nx; nz = -nz; } // vers l'eau
      const ya = Math.max(gridH(A[0] - nx * 0.5, A[1] - nz * 0.5), LK.wy + 0.5) + 0.25, yb = Math.max(gridH(B[0] - nx * 0.5, B[1] - nz * 0.5), LK.wy + 0.5) + 0.25;
      quad(bq, [P3(A[0], LK.wy - 1, A[1]), P3(B[0], LK.wy - 1, B[1]), P3(B[0], yb, B[1]), P3(A[0], ya, A[1])], [0, 0, len / 2, 0, len / 2, 1, 0, 1], [0.95, 0.93, 0.9], [nx, 0, nz]);
      const o = 0.9, ra = [A[0] - nx * o, A[1] - nz * o], rb = [B[0] - nx * o, B[1] - nz * o], y1 = gridH(ra[0], ra[1]) + 0.05, y2 = gridH(rb[0], rb[1]) + 0.05;
      quad(brl, [P3(ra[0], y1, ra[1]), P3(rb[0], y2, rb[1]), P3(rb[0], y2 + 1.0, rb[1]), P3(ra[0], y1 + 1.0, ra[1])], [0, 0, len / 4, 0, len / 4, 1, 0, 1], WHITE, [nx, 0, nz]);
    }
    // île : quai circulaire
    for (let k = 0; k < 36; k++){
      const a0 = k / 36 * TAU, a1 = (k + 1) / 36 * TAU, am = (a0 + a1) / 2;
      const A = [ISL.x + Math.sin(a0) * ISL.r, ISL.z + Math.cos(a0) * ISL.r], B = [ISL.x + Math.sin(a1) * ISL.r, ISL.z + Math.cos(a1) * ISL.r];
      if (Math.cos(am) > 0.985) continue;
      quad(bq, [P3(A[0], LK.wy - 1, A[1]), P3(B[0], LK.wy - 1, B[1]), P3(B[0], 2.35, B[1]), P3(A[0], 2.35, A[1])], [0, 0, 1.3, 0, 1.3, 1, 0, 1], [0.95, 0.93, 0.9], [Math.sin(am), 0, Math.cos(am)]);
    }
  }
  // monument aux morts : colonne blanche surmontée d'un ange de bronze
  {
    const g = new THREE.Group(), y = 2.1, white = new THREE.MeshStandardMaterial({ color: col('#f1eee6'), roughness: 0.55 }), bronze = new THREE.MeshStandardMaterial({ color: col('#5c4a2c'), metalness: 0.75, roughness: 0.38 });
    const add = (geo, mat, px, py, pz, rx = 0, ry = 0, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(px, py, pz); m.rotation.set(rx, ry, rz); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
    add(new THREE.BoxGeometry(9, 0.6, 9), white, 0, y + 0.3, 0); add(new THREE.BoxGeometry(7, 0.6, 7), white, 0, y + 0.9, 0); add(new THREE.BoxGeometry(4, 4.5, 4), white, 0, y + 3.45, 0);
    add(new THREE.BoxGeometry(4.6, 0.5, 4.6), white, 0, y + 5.9, 0);
    add(new THREE.CylinderGeometry(0.75, 1.15, 13, 4, 1), white, 0, y + 12.6, 0, 0, Math.PI / 4);
    add(new THREE.BoxGeometry(1.9, 0.6, 1.9), white, 0, y + 19.4, 0);
    const ay = y + 19.7;
    add(new THREE.ConeGeometry(0.55, 2.2, 10), bronze, 0, ay + 1.1, 0); add(new THREE.CylinderGeometry(0.28, 0.4, 1.0, 10), bronze, 0, ay + 2.5, 0);
    add(new THREE.SphereGeometry(0.27, 12, 10), bronze, 0, ay + 3.25, 0);
    for (const sd of [-1, 1]){ add(new THREE.BoxGeometry(0.08, 2.4, 0.9), bronze, sd * 0.55, ay + 2.9, -0.35, 0.25, 0, sd * -0.45); }
    add(new THREE.CylinderGeometry(0.07, 0.08, 1.3, 6), bronze, 0.3, ay + 3.55, 0.1, 0, 0, -0.35);
    add(new THREE.TorusGeometry(0.28, 0.05, 6, 16), bronze, 0.55, ay + 4.25, 0.1);
    g.position.set(ISL.x, 0, ISL.z); root.add(g); addCirc(ISL.x, ISL.z, 4.8);
  }
  prog(0.76);

  /* ---------- 10. Marché d'Analakely : pavillons et parasols blancs ---------- */
  const box = (b, cx, y0, cz, sx, sy, sz, h, tint) => {
    const a1x = Math.sin(h), a1z = Math.cos(h), a2x = Math.cos(h), a2z = -Math.sin(h), W = (u, y, v) => P3(cx + a1x * u + a2x * v, y, cz + a1z * u + a2z * v);
    const C = [[-sx, -sz], [sx, -sz], [sx, sz], [-sx, sz]];
    for (let e = 0; e < 4; e++){ const [u0, v0] = C[e], [u1, v1] = C[(e + 1) % 4], nx = a1x * (u0 + u1) + a2x * (v0 + v1), nz = a1z * (u0 + u1) + a2z * (v0 + v1);
      quad(b, [W(u0, y0, v0), W(u1, y0, v1), W(u1, y0 + sy, v1), W(u0, y0 + sy, v0)], [0, 0, 1, 0, 1, 1, 0, 1], tint, [nx, 0, nz]); }
    quad(b, [W(-sx, y0 + sy, -sz), W(sx, y0 + sy, -sz), W(sx, y0 + sy, sz), W(-sx, y0 + sy, sz)], [0, 0, 1, 0, 1, 1, 0, 1], tint, UP);
  };
  const umb = [];
  {
    const h = 0.25, pav = [[-14, -10], [18, -4], [0, 20]], a1x = Math.sin(h), a1z = Math.cos(h), a2x = Math.cos(h), a2z = -Math.sin(h);
    // dallage de la place
    const bp = bucket('sidewalk', MARKET.x, MARKET.z);
    for (let x = MARKET.x - MARKET.r; x < MARKET.x + MARKET.r; x += 5) for (let z = MARKET.z - MARKET.r; z < MARKET.z + MARKET.r; z += 5){
      if (Math.hypot(x + 2.5 - MARKET.x, z + 2.5 - MARKET.z) > MARKET.r - 2) continue;
      const p = (a, b) => P3(a, gridH(a, b) + 0.07, b); quad(bp, [p(x, z), p(x + 5, z), p(x + 5, z + 5), p(x, z + 5)], [x / 2, z / 2, (x + 5) / 2, z / 2, (x + 5) / 2, (z + 5) / 2, x / 2, (z + 5) / 2], WHITE, UP);
    }
    const goods = ['#d9402b', '#f3c22c', '#3f8f3e', '#f08a24', '#e8e1cf', '#8a5a33', '#c43c78', '#7cae3c'].map(rgb);
    const inPav = (x, z) => pav.some(([u, v]) => { const cx = MARKET.x + a1x * u + a2x * v, cz = MARKET.z + a1z * u + a2z * v, dx = x - cx, dz = z - cz, pu = dx * a1x + dz * a1z, pv = dx * a2x + dz * a2z; return Math.abs(pu) < 14.5 && Math.abs(pv) < 6.5; });
    for (const [u, v] of pav){
      const cx = MARKET.x + a1x * u + a2x * v, cz = MARKET.z + a1z * u + a2z * v, y = gridH(cx, cz) + 0.07, bw = bucket('white', cx, cz), bwd = bucket('wood', cx, cz);
      for (let k = -13; k <= 13; k += 4.33) for (const sv of [-5, 5]){ const px = cx + a1x * k + a2x * sv, pz = cz + a1z * k + a2z * sv; box(bw, px, y, pz, 0.25, 4.3, 0.25, h, [0.95, 0.94, 0.9]); addCirc(px, pz, 0.35); }
      roof(cx, cz, h, 14, 5.5, y + 4.3, 'tin', [1, 0.95, 0.9]);
      for (let k = -11; k <= 11; k += 2.2) for (const sv of [-2.4, 2.4]){ const px = cx + a1x * k + a2x * sv, pz = cz + a1z * k + a2z * sv; box(bwd, px, y, pz, 0.9, 0.85, 0.7, h, [0.75, 0.6, 0.45]); box(bwd, px, y + 0.85, pz, 0.8, 0.18, 0.6, h, goods[(R() * goods.length) | 0]); }
    }
    for (let i = 0; i < 160; i++){
      const a = R() * TAU, r = Math.sqrt(R()) * (MARKET.r - 4), x = MARKET.x + Math.cos(a) * r, z = MARKET.z + Math.sin(a) * r;
      if (inPav(x, z) || umb.some(p => Math.hypot(p[0] - x, p[2] - z) < 3.1)) continue;
      const y = gridH(x, z) + 0.07; umb.push([x, y, z, R() * TAU]);
      box(bucket('wood', x, z), x, y, z, 0.8, 0.8, 0.6, R(), [0.7, 0.58, 0.45]); box(bucket('wood', x, z), x, y + 0.8, z, 0.72, 0.16, 0.52, R(), goods[(R() * goods.length) | 0]);
      addCirc(x, z, 0.9);
    }
  }
  prog(0.8);

  /* ---------- 11. Arbres, poteaux électriques, lampadaires, rizières ---------- */
  function vc(g, hex, k0 = 0.85, k1 = 1.1, ydark = null){
    g = g.index ? g.toNonIndexed() : g; const p = g.attributes.position, c = new Float32Array(p.count * 3), cc = col(hex);
    for (let i = 0; i < p.count; i++){ let k = k0 + Math.random() * (k1 - k0); if (ydark) k *= lerp(0.6, 1, smooth(ydark[0], ydark[1], p.getY(i))); c[i * 3] = cc.r * k; c[i * 3 + 1] = cc.g * k; c[i * 3 + 2] = cc.b * k; }
    g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g;
  }
  function blob(r, cx, cy, cz, seed){
    const g = mergeVertices(new THREE.IcosahedronGeometry(r, 1)), p = g.attributes.position;
    for (let i = 0; i < p.count; i++){ const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 0.78 + 0.42 * noise3(x * 1.6 + seed, y * 1.6, z * 1.6); p.setXYZ(i, cx + x * k, cy + y * k * 0.8, cz + z * k); }
    g.computeVertexNormals(); return g;
  }
  const trunk = (r0, r1, h, hex) => vc(new THREE.CylinderGeometry(r1, r0, h, 7, 1).translate(0, h / 2, 0), hex, 0.8, 1);
  const SPEC = {
    jac: { r: 0.35, geo: () => mergeGeometries([trunk(0.28, 0.18, 4.6, '#5a4a3c'), ...[[0, 5.6, 0, 2.3], [1.8, 5.1, 0.6, 1.8], [-1.6, 5.3, -0.8, 1.9], [0.4, 6.4, -1.4, 1.7], [-0.6, 6.2, 1.5, 1.7], [1.2, 6.6, 1.0, 1.4]].map(([x, y, z, r], k) => vc(blob(r, x, y, z, k * 3.1), k === 2 ? '#6d7a4c' : k % 2 ? '#9d8bd2' : '#8a78c4', 0.82, 1.12, [4.2, 6.5]))]) },
    mango: { r: 0.5, geo: () => mergeGeometries([trunk(0.42, 0.3, 3, '#4a3b2d'), ...[[0, 4.8, 0, 3.1], [2.2, 4.2, 0.8, 2.3], [-2, 4.4, -0.6, 2.4], [0.5, 6, -1.4, 2.1], [-0.6, 5.6, 1.8, 2.2]].map(([x, y, z, r], k) => vc(blob(r, x, y, z, k * 5.7), '#2f5a2b', 0.75, 1.1, [2.8, 6.5]))]) },
    euc: { r: 0.3, geo: () => mergeGeometries([trunk(0.3, 0.12, 14, '#cfc6b4'), ...[[0, 13.5, 0, 1.9], [1.3, 11.2, 0.4, 1.4], [-1.2, 10.4, -0.5, 1.5], [0.4, 9, 1.1, 1.2], [-0.5, 12.2, 1.0, 1.3]].map(([x, y, z, r], k) => vc(blob(r, x, y, z, k * 2.3), '#7b8e6a', 0.8, 1.15, [8, 14]))]) },
    palm: { r: 0.3, geo: () => { const parts = [trunk(0.25, 0.17, 8.5, '#8a7a62')]; for (let k = 0; k < 9; k++){ const f = new THREE.BoxGeometry(0.5, 0.05, 3.4, 1, 1, 4); const p = f.attributes.position; for (let i = 0; i < p.count; i++){ const z = p.getZ(i) + 1.7; p.setY(i, p.getY(i) - z * z * 0.09); p.setZ(i, z); } f.rotateX(-0.25); f.rotateY(k / 9 * TAU); f.translate(0, 8.5, 0); f.deleteAttribute('uv'); parts.push(vc(f, '#4f7d33', 0.8, 1.1)); } parts.forEach(g => { if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); }); return mergeGeometries(parts); } },
  };
  const TREES = { jac: [], mango: [], euc: [], palm: [] };
  const plant = (kind, x, z, s = 1, force) => { if (!force && (occ(x, z) || !offRoad(x, z, 1.5))) return false; const y = gridH(x, z); TREES[kind].push([x, y - 0.1, z, R() * TAU, s * (0.85 + R() * 0.3)]); addCirc(x, z, SPEC[kind].r * s); mark(x, z); return true; };
  // jacarandas autour du lac
  for (let i = 0; i < lakePoly.length; i++){ const A = lakePoly[i], B = lakePoly[(i + 1) % lakePoly.length]; for (const t of [0, 0.5]){ const x = lerp(A[0], B[0], t), z = lerp(A[1], B[1], t), mx = x, mz = z; let nx = -(B[1] - A[1]), nz = B[0] - A[0]; const l = Math.hypot(nx, nz); nx /= l; nz /= l; if (lakeSD(mx + nx * 2, mz + nz * 2) < 0){ nx = -nx; nz = -nz; }
    const px = x + nx * 4.2, pz = z + nz * 4.2, r = nearRoad(px, pz); if (r && r.e < r.sw + 0.5) continue; if (Math.abs(px - ISL.x) < 6 && pz > ISL.z1 - 14) continue; plant('jac', px, pz, 1, true); } }
  for (let k = 0; k < 5; k++){ const a = k / 5 * TAU + 0.6; plant('jac', ISL.x + Math.sin(a) * 10, ISL.z + Math.cos(a) * 10, 0.8, true); }
  // avenue de l'Indépendance : palmiers et jacarandas en alternance
  for (let i = 0, k = 0; i < N; i += 8){ if (SECN[T.SEC[i]] !== 'avenue') continue; k++; for (const sd of [-1, 1]){ const lat = sd * (T.HW[i] + T.SW[i] - 0.6); plant(k & 1 ? 'palm' : 'jac', T.X[i] - T.TZ[i] * lat, T.Z[i] + T.TX[i] * lat, 1, true); } }
  // eucalyptus sur les collines, manguiers en ville
  for (let n = 0, tries = 0; n < 340 * Q.props && tries < 6000; tries++){ const x = GX0 + 40 + R() * (GX1 - GX0 - 80), z = GZ0 + 40 + R() * (GZ1 - GZ0 - 80); if (x < -395 || gridH(x, z) < 10) continue; const gx = x + (R() - 0.5) * 20, gz = z + (R() - 0.5) * 20; for (let k = 0; k < 4; k++) if (plant('euc', gx + (R() - 0.5) * 14, gz + (R() - 0.5) * 14)) n++; }
  for (let n = 0, tries = 0; n < 200 * Q.props && tries < 4000; tries++){ const x = GX0 + 40 + R() * (GX1 - GX0 - 80), z = GZ0 + 40 + R() * (GZ1 - GZ0 - 80); if (plant(R() < 0.75 ? 'mango' : 'jac', x, z)) n++; }
  for (const kind in TREES){
    const L0 = TREES[kind]; if (!L0.length) continue;
    const im = new THREE.InstancedMesh(SPEC[kind].geo(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }), L0.length), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = V3(), s = V3();
    L0.forEach(([x, y, z, ry, sc], i) => { e.set(0, ry, 0); q.setFromEuler(e); m4.compose(v.set(x, y, z), q, s.set(sc, sc, sc)); im.setMatrixAt(i, m4); });
    im.castShadow = true; im.receiveShadow = true; im.name = 'arbres-' + kind; root.add(im);
  }
  // poteaux électriques et fils emmêlés le long du circuit ; lampadaires sur l'avenue
  {
    const poles = [], lamps = [], W = [];
    const wire = (a, b, sag, n = 8) => { for (let k = 0; k < n; k++){ const t0 = k / n, t1 = (k + 1) / n; W.push(lerp(a[0], b[0], t0), lerp(a[1], b[1], t0) - sag * 4 * t0 * (1 - t0), lerp(a[2], b[2], t0), lerp(a[0], b[0], t1), lerp(a[1], b[1], t1) - sag * 4 * t1 * (1 - t1), lerp(a[2], b[2], t1)); } };
    let prev = null;
    for (let i = 0, k = 0; i < N; i += 15){
      const sec = SECN[T.SEC[i]];
      if (sec === 'avenue'){ prev = null; if (i % 30 === 0) for (const sd of [-1, 1]){ const lat = sd * (T.HW[i] + T.SW[i] - 0.5), x = T.X[(i + 3) % N] - T.TZ[(i + 3) % N] * lat, z = T.Z[(i + 3) % N] + T.TX[(i + 3) % N] * lat; lamps.push([x, gridH(x, z), z, Math.atan2(T.TX[i], T.TZ[i]) + (sd > 0 ? Math.PI : 0)]); addCirc(x, z, 0.2); } continue; }
      const lat = T.SW[i] > 0.3 ? T.HW[i] + T.SW[i] - 0.35 : T.HW[i] + 1.9, x = T.X[i] - T.TZ[i] * lat, z = T.Z[i] + T.TX[i] * lat, o = nearRoad(x, z, 0);
      if (o && o.e < 1.5){ prev = null; continue; }
      const y = gridH(x, z), h = Math.atan2(T.TX[i], T.TZ[i]), rx = -T.TZ[i], rz = T.TX[i];
      poles.push([x, y, z, h]); addCirc(x, z, 0.2);
      const tops = [-0.75, 0, 0.75].map(d => [x + rx * d, y + 8.45, z + rz * d]);
      if (prev) tops.forEach((t, j) => wire(prev[j], t, 0.5 + R() * 0.6));
      if (prev && R() < 0.5) wire(prev[1], tops[(R() * 3) | 0], 1.3 + R() * 0.8);
      if (k++ % 3 === 0){ const lat2 = -(T.HW[i] + T.SW[i] + 0.8), bx = T.X[(i + 3) % N] - T.TZ[(i + 3) % N] * lat2, bz = T.Z[(i + 3) % N] + T.TX[(i + 3) % N] * lat2; wire(tops[0], [bx, gridH(bx, bz) + 6.2, bz], 1.2 + R(), 10); }
      prev = tops;
    }
    const pg = mergeGeometries([new THREE.CylinderGeometry(0.11, 0.15, 9, 6).translate(0, 4.5, 0), new THREE.BoxGeometry(1.9, 0.12, 0.12).translate(0, 8.4, 0)].map(g => vc(g, '#6a645c', 0.85, 1)));
    const pm = new THREE.InstancedMesh(pg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }), Math.max(1, poles.length));
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = V3(), one = V3(1, 1, 1);
    poles.forEach(([x, y, z, h], i) => { q.setFromEuler(e.set(0, h, 0)); m4.compose(v.set(x, y, z), q, one); pm.setMatrixAt(i, m4); }); pm.count = poles.length; pm.castShadow = true; root.add(pm);
    const lg = mergeGeometries([vc(new THREE.CylinderGeometry(0.08, 0.13, 7.5, 6).translate(0, 3.75, 0), '#2d3033', 0.9, 1), vc(new THREE.BoxGeometry(0.1, 0.1, 1.6).translate(0, 7.4, 0.75), '#2d3033', 0.9, 1), vc(new THREE.BoxGeometry(0.42, 0.18, 0.7).translate(0, 7.3, 1.45), '#f2e2c0', 1, 1)]);
    const lm = new THREE.InstancedMesh(lg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.4 }), Math.max(1, lamps.length));
    lamps.forEach(([x, y, z, h], i) => { q.setFromEuler(e.set(0, h, 0)); m4.compose(v.set(x, y, z), q, one); lm.setMatrixAt(i, m4); }); lm.count = lamps.length; lm.castShadow = true; root.add(lm);
    const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(W, 3));
    const wl = new THREE.LineSegments(wg, new THREE.LineBasicMaterial({ color: col('#161616'), transparent: true, opacity: 0.85 })); wl.name = 'fils'; root.add(wl);
  }
  // rizières en terrasses inondées
  {
    const tufts = [], bp = bucket('paddy', null);
    for (let x = GX0 + 30; x < -398; x += 24) for (let z = GZ0 + 30; z < GZ1 - 30; z += 17){
      const x0 = x + 0.8, x1 = x + 23.2, z0 = z + 0.8, z1 = z + 16.2, cs = [[x0, z0], [x1, z0], [x1, z1], [x0, z1], [(x0 + x1) / 2, (z0 + z1) / 2]];
      if (cs.some(([a, b]) => occ(a, b) || !offRoad(a, b, 1.5))) continue;
      const hs = cs.map(([a, b]) => gridH(a, b)), hmax = Math.max(...hs), hmin = Math.min(...hs); if (hmax - hmin > 0.8 || hmax > 3) continue;
      const y = hmax + 0.05; quad(bp, [P3(x0, y, z0), P3(x1, y, z0), P3(x1, y, z1), P3(x0, y, z1)], [x0 / 14, z0 / 14, x1 / 14, z0 / 14, x1 / 14, z1 / 14, x0 / 14, z1 / 14], WHITE, UP);
      if (R() < 0.75) for (let k = 0; k < 40 * Q.grass; k++) tufts.push([x0 + R() * (x1 - x0), y - 0.1, z0 + R() * (z1 - z0), R() * TAU, 0.7 + R() * 0.6]);
    }
    if (tufts.length){
      const parts = []; for (let k = 0; k < 5; k++){ const g = new THREE.PlaneGeometry(0.08, 0.8, 1, 2); const p = g.attributes.position; for (let i = 0; i < p.count; i++){ const yy = p.getY(i) + 0.4; p.setX(i, p.getX(i) * (1 - yy)); p.setZ(i, yy * yy * 0.25); p.setY(i, yy); } g.rotateY(k / 5 * TAU); parts.push(vc(g, k & 1 ? '#8fb03c' : '#6b9a2c', 0.85, 1.1, [0, 0.7])); }
      const im = new THREE.InstancedMesh(mergeGeometries(parts), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, side: THREE.DoubleSide }), tufts.length), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = V3(), s = V3();
      tufts.forEach(([x, y, z, ry, sc], i) => { q.setFromEuler(e.set(0, ry, 0)); m4.compose(v.set(x, y, z), q, s.set(sc, sc, sc)); im.setMatrixAt(i, m4); });
      im.name = 'riz'; root.add(im);
    }
  }
  // parasols du marché (instanciés)
  if (umb.length){
    const g = mergeGeometries([vc(new THREE.ConeGeometry(1.55, 0.55, 12, 1, true).translate(0, 2.45, 0), '#f3f1ea', 0.92, 1.02), vc(new THREE.CylinderGeometry(0.03, 0.03, 2.5, 5).translate(0, 1.25, 0), '#8a8780', 1, 1)]);
    const im = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, side: THREE.DoubleSide }), umb.length), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = V3(), one = V3(1, 1, 1);
    umb.forEach(([x, y, z, r], i) => { q.setFromEuler(e.set(0, r, 0)); m4.compose(v.set(x, y, z), q, one); im.setMatrixAt(i, m4); }); im.castShadow = true; im.name = 'parasols'; root.add(im);
  }
  prog(0.9);

  /* ---------- 12. Maillages fusionnés ---------- */
  const FLAT = new Set(['asphalt', 'cobble', 'dirt', 'sidewalk', 'marks', 'paddy']);
  for (const b of BK.values()){
    if (!b.p.length) continue;
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(b.p, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(b.u, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(b.c, 3));
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, MAT[b.mat]); m.receiveShadow = true;
    m.castShadow = !FLAT.has(b.mat) && !['win', 'shop', 'sign', 'rail'].includes(b.mat);
    m.name = 'ville-' + b.mat; root.add(m);
  }
  BK.clear();

  /* ---------- 13. Lumière de fin d'après-midi tropicale ---------- */
  const TL = { sun: new THREE.Vector3(-0.6, 0.5, 0.62).normalize(), turb: 5.5, ray: 1.5, mie: 0.005, g: 0.82, fog: new THREE.FogExp2(col('#c9cbc6'), 0.00095), hs: col('#b8cde6'), hg: col('#8a6a4c'), hi: 0.85, sc: col('#fff0d6'), si: 3.1, exp: 0.66 };
  let envT = null, saved = null;
  function enter(){
    const u = sky.material.uniforms;
    if (!saved) saved = { sun: SUN_DIR.clone(), turb: u.turbidity.value, ray: u.rayleigh.value, mie: u.mieCoefficient.value, g: u.mieDirectionalG.value, sp: u.sunPosition.value.clone(), env: scene.environment, fog: scene.fog, hs: hemiLight.color.clone(), hg: hemiLight.groundColor.clone(), hi: hemiLight.intensity, sc: sunLight.color.clone(), si: sunLight.intensity, exp: renderer.toneMappingExposure };
    if (!envT){
      const pm = new THREE.PMREMGenerator(renderer), es = new THREE.Scene(), sk2 = new Sky(); sk2.scale.setScalar(10000);
      const v = sk2.material.uniforms; v.turbidity.value = TL.turb; v.rayleigh.value = TL.ray; v.mieCoefficient.value = TL.mie; v.mieDirectionalG.value = TL.g; v.sunPosition.value.copy(TL.sun); es.add(sk2);
      const gd = new THREE.Mesh(new THREE.CircleGeometry(9000, 32), new THREE.MeshBasicMaterial({ color: col('#6b5844') })); gd.rotation.x = -Math.PI / 2; gd.position.y = -5; es.add(gd);
      envT = pm.fromScene(es, 0.03, 1, 20000).texture; pm.dispose();
    }
    SUN_DIR.copy(TL.sun); u.turbidity.value = TL.turb; u.rayleigh.value = TL.ray; u.mieCoefficient.value = TL.mie; u.mieDirectionalG.value = TL.g; u.sunPosition.value.copy(TL.sun);
    scene.environment = envT; scene.fog = TL.fog; hemiLight.color.copy(TL.hs); hemiLight.groundColor.copy(TL.hg); hemiLight.intensity = TL.hi;
    sunLight.color.copy(TL.sc); sunLight.intensity = TL.si; renderer.toneMappingExposure = TL.exp;
    root.visible = true;
  }
  function exit(){
    root.visible = false; if (!saved) return;
    const u = sky.material.uniforms, s = saved; saved = null;
    SUN_DIR.copy(s.sun); u.turbidity.value = s.turb; u.rayleigh.value = s.ray; u.mieCoefficient.value = s.mie; u.mieDirectionalG.value = s.g; u.sunPosition.value.copy(s.sp);
    scene.environment = s.env; scene.fog = s.fog; hemiLight.color.copy(s.hs); hemiLight.groundColor.copy(s.hg); hemiLight.intensity = s.hi;
    sunLight.color.copy(s.sc); sunLight.intensity = s.si; renderer.toneMappingExposure = s.exp;
  }

  /* ---------- 14. API (même forme que le monde du désert) ---------- */
  const LS = {};
  const track = {
    length: L,
    sample(s, out = {}){ sampleL(s, out); out.x += TN_OX; return out; },
    project(x, z, hintS){ return projectL(x - TN_OX, z, hintS); },
    limits(s){ const o = sampleL(s, LS), e = o.sw > 0.3 ? o.sw * 0.55 : 1.2; return { left: o.width / 2 + e, right: o.width / 2 + e }; },
    startSlot(i){ i = clamp(i | 0, 0, 5); const row = i >> 1, o = sampleL(L - 12 - row * 9, {}), lat = (i & 1 ? 1 : -1) * 3.6; return { x: o.x + o.rx * lat + TN_OX, y: o.y, z: o.z + o.rz * lat, heading: Math.atan2(o.tx, o.tz) }; },
    polyline(n = 200){ const out = [], o = {}; for (let k = 0; k < n; k++){ sampleL(k / n * L, o); out.push([o.x + TN_OX, o.z]); } return out; },
  };
  function ground(wx, z, hintS){
    const x = wx - TN_OX, out = { y: 0, surface: 'grass', s: undefined, lat: 0, nx: 0, ny: 1, nz: 0 };
    const r = nearRoad(x, z);
    if (r && r.e <= r.sw + 0.05){
      const rd = ROADS[r.ri], j = (r.i + 1) % rd.n;
      if (rd.isTrack){ out.s = wrapS((r.i + r.t) * ds); out.lat = r.lat; }
      if (r.e <= 0){ out.y = r.y; out.surface = roadSurf(rd, r.i); } else { out.y = r.y + 0.14; out.surface = 'sidewalk'; }
      const g = (rd.Y[j] - rd.Y[r.i]) / rd.ds, gl = Math.hypot(g, 1); out.nx = -g * rd.TX[r.i] / gl; out.ny = 1 / gl; out.nz = -g * rd.TZ[r.i] / gl;
      return out;
    }
    out.y = gridH(x, z);
    const e = 0.8, hx = gridH(x + e, z) - gridH(x - e, z), hz = gridH(x, z + e) - gridH(x, z - e), l = Math.hypot(hx, 2 * e, hz);
    out.nx = -hx / l; out.ny = 2 * e / l; out.nz = -hz / l;
    out.surface = gridT(x, z) === 0 ? 'grass' : 'dirt';
    return out;
  }
  function islandHit(x, z, r){
    const dx = x - ISL.x, dz = z - ISL.z, d = Math.hypot(dx, dz), rc = ISL.r - 1 - r, hw = Math.max(0.3, 2.3 - r), zt = ISL.z1 + 4;
    if (d < rc || (Math.abs(dx) < hw && z > ISL.z && z < zt)) return null;
    const k = d > 1e-4 ? rc / d : 0, cx = ISL.x + dx * k, cz = ISL.z + dz * k, rx = ISL.x + clamp(dx, -hw, hw), rz = clamp(z, ISL.z, zt);
    const d1 = Math.hypot(x - cx, z - cz), d2 = Math.hypot(x - rx, z - rz), px = d1 < d2 ? cx : rx, pz = d1 < d2 ? cz : rz, dd = Math.min(d1, d2);
    return dd > 1e-4 ? { nx: (px - x) / dd, nz: (pz - z) / dd, depth: dd } : null;
  }
  function collide(wx, z, r){
    const x = wx - TN_OX; let best = null, bd = 0;
    const hit = (nx, nz, d) => { if (d > bd){ bd = d; best = { nx, nz, depth: d }; } };
    if (x < BX0 + r) hit(1, 0, BX0 + r - x); if (x > BX1 - r) hit(-1, 0, x - BX1 + r); if (z < BZ0 + r) hit(0, 1, BZ0 + r - z); if (z > BZ1 - r) hit(0, -1, z - BZ1 + r);
    if (x > LB[0] - 4 && x < LB[1] + 4 && z > LB[2] - 4 && z < LB[3] + 4){
      const ld = lakeSD(x, z), lim = 1.0 + r;
      if (ld < lim){
        const nearIsl = Math.abs(x - ISL.x) < 24 && z > ISL.z - ISL.r - 8 && z < ISL.z1 + 2;
        if (nearIsl && (ld <= 0.3 || Math.abs(x - ISL.x) < 2.6)){ const h = islandHit(x, z, r); if (h) hit(h.nx, h.nz, h.depth); }
        else { const e = 0.6, gx = lakeSD(x + e, z) - lakeSD(x - e, z), gz = lakeSD(x, z + e) - lakeSD(x, z - e), gl = Math.hypot(gx, gz) || 1; hit(gx / gl, gz / gl, lim - ld); }
      }
    }
    for (let ix = Math.floor((x - r) / OC); ix <= Math.floor((x + r) / OC); ix++) for (let iz = Math.floor((z - r) / OC); iz <= Math.floor((z + r) / OC); iz++){
      const a = OBS.get(okk(ix, iz)); if (!a) continue;
      for (const o of a){
        if (o.t === 1){ const dx = x - o.x, dz = z - o.z, d = Math.hypot(dx, dz), RR = o.r + r; if (d < RR) hit(d > 1e-4 ? dx / d : 1, d > 1e-4 ? dz / d : 0, RR - d); continue; }
        const dx = x - o.cx, dz = z - o.cz, u = dx * o.ax + dz * o.az, v = dx * o.az - dz * o.ax;
        if (Math.abs(u) > o.ha + r || Math.abs(v) > o.hb + r) continue;
        if (Math.abs(u) <= o.ha && Math.abs(v) <= o.hb){
          const pu = o.ha - Math.abs(u), pv = o.hb - Math.abs(v);
          if (pu < pv){ const sg = Math.sign(u) || 1; hit(o.ax * sg, o.az * sg, pu + r); } else { const sg = Math.sign(v) || 1; hit(o.az * sg, -o.ax * sg, pv + r); }
        } else {
          const cu = clamp(u, -o.ha, o.ha), cv = clamp(v, -o.hb, o.hb), qx = o.cx + o.ax * cu + o.az * cv, qz = o.cz + o.az * cu - o.ax * cv, ddx = x - qx, ddz = z - qz, d = Math.hypot(ddx, ddz);
          if (d < r && d > 1e-5) hit(ddx / d, ddz / d, r - d);
        }
      }
    }
    return best;
  }
  // circulation : voie de droite (on roule à droite à Madagascar)
  const RD = name => ROADS.find(r => r.name === name);
  const laneOff = (rd, i) => Math.min(rd.HW[i] * 0.5, 3.0);
  function lane(rd, i0, i1, rev){
    const n = rd.n, cnt = rd.closed ? ((i1 - i0 + n) % n) : (i1 - i0), out = [];
    for (let k = 0; k <= cnt; k += 3){ const i = (i0 + k) % n, lat = (rev ? -1 : 1) * laneOff(rd, i); out.push([rd.X[i] - rd.TZ[i] * lat + TN_OX, rd.Y[i] + 0.05, rd.Z[i] + rd.TX[i] * lat]); }
    if (rev) out.reverse(); return out;
  }
  const jIdx = (x, z) => Math.round(projectL(x, z).s / ds) % N;
  const lac = RD('lac'), basse = RD('basse');
  const trafficLoops = [
    lane(T, 0, N - 1, false), lane(T, 0, N - 1, true),
    lane(T, jIdx(lac.X[lac.n - 1], lac.Z[lac.n - 1]), jIdx(lac.X[0], lac.Z[0]), false).concat(lane(lac, 0, lac.n - 1, false)),
    lane(T, jIdx(basse.X[0], basse.Z[0]), jIdx(basse.X[basse.n - 1], basse.Z[basse.n - 1]), false).concat(lane(basse, 0, basse.n - 1, true)),
  ].filter(l => l.length > 4);
  const spawnAt = (rd, i, name) => { const lat = laneOff(rd, i), x = rd.X[i] - rd.TZ[i] * lat, z = rd.Z[i] + rd.TX[i] * lat; return { x: x + TN_OX, y: rd.Y[i] + 0.3, z, heading: Math.atan2(rd.TX[i], rd.TZ[i]), name }; };
  const spawns = [
    spawnAt(T, Math.round(60 / ds), 'avenue de l’Indépendance'), spawnAt(lac, Math.round(lac.n * 0.45), 'au bord du lac Anosy'),
    spawnAt(basse, Math.round(basse.n * 0.4), 'dans la ville basse'), spawnAt(T, T.SEC.indexOf(SECN.indexOf('haute-ville')) + 40, 'dans la Haute-Ville'),
  ];
  const districts = [
    ['Soarano', -40, 400, 80], ['Avenue de l’Indépendance', -40, 170, 120], ['Analakely', 30, -40, 90], ['Haute-Ville – Rova', 240, -220, 150],
    ['Lac Anosy', -140, -335, 175], ['Rizières d’Andohatapenaka', -500, -60, 230], ['Faravohitra', 230, 140, 140], ['Isotry', -230, 120, 140],
  ].map(([name, x, z, r]) => ({ name, x: x + TN_OX, z, r }));
  const streetLines = ROADS.map(rd => { const o = []; for (let i = 0; i < rd.n; i += 3) o.push([rd.X[i] + TN_OX, rd.Z[i]]); if (rd.closed) o.push(o[0]); else o.push([rd.X[rd.n - 1] + TN_OX, rd.Z[rd.n - 1]]); return o; });
  let time = 0;
  function update(dt){ time += dt || 0; T_WN.offset.set(time * 0.012, time * 0.007); }
  prog(1);
  return { root, track, ground, collide, spawns, districts, trafficLoops, streetLines, enter, exit, update, terrainHeight: (x, z) => gridH(x - TN_OX, z), buildings: nB };
}
