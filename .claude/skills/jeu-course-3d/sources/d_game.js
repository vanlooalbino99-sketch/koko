
/* ================== Jeu : rendu final, garage, course ================== */
{
const SAVE_KEY = 'nitrocanyon.v1';
let SV = { car: 'kitsune', paint: null, diff: 1, best: {}, quality: null, sfx: true, music: true, dest: 'desert' };
try { Object.assign(SV, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(SV)); } catch (e) {} };
const LAPS = 2;
const RIVALS = [
  { name: 'Vega', type: 'stallion', paint: '#141416' },
  { name: 'Lina', type: 'taiga', paint: '#1d2a44' },
  { name: 'Tetsu', type: 'kitsune', paint: '#e8e6e1' },
  { name: 'Raven', type: CAR_TYPES.hyperion ? 'hyperion' : 'stallion', paint: '#e9b81c' },
  { name: 'Dédé', type: 'taiga', paint: '#d9a12a' },
];
const DOT_COL = ['#35d6ff', '#ff3b4e', '#ffc53d', '#9be15d', '#c38bff', '#ff8a3d'];
let WORLD, FX, AUDIO, HUD, GARAGE = null, TANA = null, ACTIVE = null, DESERT_ROOT = null;
// Destinations : le désert (course), Tananarive (course de rue ou balade libre)
const DEST = {
  desert: { tag: 'Désert de Fortune, heure dorée. Six pilotes, deux tours, un seul gagnant.', go: 'Lancer la course', obj: 'Gagne la course', heat: 0.5 },
  tana: { tag: 'Tananarive, fin d’après-midi. Course de rue entre les collines, du lac Anosy à la Haute-Ville.', go: 'Lancer la course', obj: 'Course de rue · Tana', heat: 0.2 },
  libre: { tag: 'Balade libre dans Tananarive : circulation, quartiers, rues en pente. Roule à droite !', go: 'Partir en balade', obj: 'Tananarive', heat: 0.2 },
};
if (!DEST[SV.dest]) SV.dest = 'desert';
const bestKey = () => SV.dest === 'desert' ? SV.car : SV.dest + ':' + SV.car;
const G = { mode: 'load', time: 0, paused: false, camMode: 0, perfT: 0, perfN: 0, perfAcc: 0, perfDone: false };

/* ---------- Post-traitement : flou de vitesse, étalonnage, halo ---------- */
const POST = { on: false };
const FINAL_FRAG = `
uniform sampler2D tColor; uniform float blur, ca, vig, heat, sharp; uniform vec2 px; varying vec2 vUv;
void main(){
  vec2 c = vec2(0.5, 0.55); vec2 d = vUv - c; float r = length(d);
  float amt = blur * smoothstep(0.16, 0.7, r);
  // Netteté : on renforce les détails fins, bornée par les voisins pour éviter les halos
  vec3 c0 = texture2D(tColor, vUv).rgb;
  vec3 n = texture2D(tColor, vUv + vec2(0.0, px.y)).rgb, s = texture2D(tColor, vUv - vec2(0.0, px.y)).rgb;
  vec3 e = texture2D(tColor, vUv + vec2(px.x, 0.0)).rgb, w = texture2D(tColor, vUv - vec2(px.x, 0.0)).rgb;
  vec3 mn = min(c0, min(min(n, s), min(e, w))), mx = max(c0, max(max(n, s), max(e, w)));
  vec3 col = clamp(c0 + (c0 - (n + s + e + w) * 0.25) * sharp * 1.6, mn, mx);
  // Flou radial de vitesse
  if (amt > 0.002){
    vec3 acc = vec3(0.0);
    for (int i = 0; i < 10; i++){ float t = float(i) / 9.0; acc += texture2D(tColor, vUv - d * amt * 0.085 * t).rgb; }
    col = mix(col, acc / 10.0, clamp(amt * 8.0, 0.0, 1.0));
  }
  vec2 o = d * (ca * 0.003 * r + amt * 0.003);
  col.r = mix(col.r, texture2D(tColor, vUv + o).r, 0.6); col.b = mix(col.b, texture2D(tColor, vUv - o).b, 0.6);
  col *= vec3(1.03, 1.0, 0.96);
  float l = dot(col, vec3(0.299, 0.587, 0.114)); col = mix(vec3(l), col, 1.07);
  col = mix(col, col * vec3(1.08, 0.98, 0.88), heat * 0.4);
  col *= 1.0 - smoothstep(0.5, 1.1, r) * vig;
  gl_FragColor = vec4(col, 1.0);
}`;
function setupPost(){
  if (POST.rt){ POST.rt.dispose(); POST.rtB.dispose(); POST.bloom.dispose(); POST.quad.dispose(); POST.rt = null; }
  POST.on = Q.post;
  if (!Q.post) return;
  const s = renderer.getDrawingBufferSize(new THREE.Vector2()), w = Math.max(2, s.x), h = Math.max(2, s.y);
  POST.rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: Q.msaa });
  POST.rtB = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType });
  POST.bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.32, 0.55, 0.88);
  POST.out = new OutputPass(); POST.out.renderToScreen = true;
  POST.mat = new THREE.ShaderMaterial({ uniforms: { tColor: { value: null }, blur: { value: 0 }, ca: { value: 0.25 }, vig: { value: 0.32 }, heat: { value: 0.5 }, sharp: { value: 0.5 }, px: { value: new THREE.Vector2(1 / w, 1 / h) } }, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }', fragmentShader: FINAL_FRAG, depthTest: false, depthWrite: false });
  POST.quad = new FullScreenQuad(POST.mat);
}
function renderFrame(dt, fx){
  if (!POST.on){ renderer.setRenderTarget(null); renderer.render(scene, camera); return; }
  renderer.setRenderTarget(POST.rt); renderer.render(scene, camera);
  const u = POST.mat.uniforms; u.tColor.value = POST.rt.texture; u.blur.value = fx.blur; u.ca.value = 0.2 + fx.blur * 0.5;
  u.heat.value = fx.heat != null ? fx.heat : 0.5; u.sharp.value = Q.pr >= 2 ? 0.35 : 0.6;
  renderer.setRenderTarget(POST.rtB); POST.quad.render(renderer);
  POST.bloom.strength = 0.3 + fx.bloom; POST.bloom.render(renderer, null, POST.rtB, dt, false);
  POST.out.render(renderer, null, POST.rtB);
}
function resize(){
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, Q.pr));
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  if (POST.on){ const s = renderer.getDrawingBufferSize(new THREE.Vector2()); POST.rt.setSize(s.x, s.y); POST.rtB.setSize(s.x, s.y); POST.bloom.setSize(s.x, s.y); POST.mat.uniforms.px.value.set(1 / s.x, 1 / s.y); }
}
function setQuality(name, auto){
  if (!QUAL[name]) return;
  qName = name; Q = QUAL[name]; if (!auto){ SV.quality = name; save(); }
  setupShadow(); setupPost(); resize();
  scene.traverse(o => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.needsUpdate = true); });
  syncPause();
}
// Halo du soleil (caché derrière le relief grâce au test de profondeur)
let glare;
function buildGlare(){
  const [c, g] = cnv(128, 128), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,240,210,1)'); gr.addColorStop(0.12, 'rgba(255,220,170,.8)'); gr.addColorStop(0.4, 'rgba(255,170,90,.18)'); gr.addColorStop(1, 'rgba(255,150,60,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  glare = new THREE.Sprite(new THREE.SpriteMaterial({ map: ctex(c), color: col('#ffffff').multiplyScalar(3), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  glare.scale.setScalar(900); scene.add(glare);
}

/* ---------- Voitures en course ---------- */
const CARS = [];
let PLAYER = null;
function makeCar(type, paint, name, isPlayer, idx){
  const model = buildCarModel(type, paint, { number: [7, 21, 33, 4, 88, 12][idx % 6], rival: !isPlayer });
  scene.add(model.root);
  const V = createVehicle(type);
  const car = { idx, name, type, paint, model, V, isPlayer, color: DOT_COL[idx % 6], lap: -1, prevS: 0, progress: 0, finished: false, finishTime: 0, lapStart: 0, bestLap: Infinity, ai: null, driftPts: 0, lastSection: null, tmp: new THREE.Vector3() };
  if (!isPlayer) car.ai = createAI(V, { skill: [0.72, 0.86, 0.97][SV.diff] - idx * 0.025 + rand(-0.02, 0.02), lane: rand(-0.6, 0.6), name });
  CARS.push(car);
  return car;
}
function clearCars(){ CARS.forEach(c => { scene.remove(c.model.root); if (c.model.dispose) c.model.dispose(); }); CARS.length = 0; PLAYER = null; }
const worldCtx = () => ({ ground: ACTIVE.ground, track: ACTIVE.track, cars: CARS.map(c => c.V), collide: ACTIVE.collide ? collideAll : undefined, freeRoam: G.mode === 'free' });
function collideAll(x, z, r){ return ACTIVE.collide(x, z, r) || (G.mode === 'free' ? trafficHit(x, z, r) : null); }
// La caméra ne traverse pas les façades : on la rapproche de la voiture si un bâtiment est entre les deux
function camAvoid(t, p){
  if (!ACTIVE || !ACTIVE.collide) return;
  for (let k = 0.3; k <= 1.001; k += 0.2333){
    if (ACTIVE.collide(lerp(t.x, p.x, k), lerp(t.z, p.z, k), 0.35)){ const f = Math.max(0.1, k - 0.22); p.x = lerp(t.x, p.x, f); p.z = lerp(t.z, p.z, f); p.y = Math.max(p.y, t.y + 1.3); return; }
  }
}

/* ---------- Commandes ---------- */
const IN = { keys: new Set(), steer: 0, touch: { left: false, right: false, gas: false, brake: false, nitro: false, drift: false } };
const K = (...codes) => codes.some(c => IN.keys.has(c));
function readInput(dt){
  const t = IN.touch;
  let left = K('KeyA', 'KeyQ', 'ArrowLeft') || t.left, right = K('KeyD', 'ArrowRight') || t.right;
  let throttle = (K('KeyW', 'KeyZ', 'ArrowUp') || t.gas) ? 1 : 0, brake = (K('KeyS', 'ArrowDown') || t.brake) ? 1 : 0;
  let handbrake = K('Space') || t.drift, nitro = K('ShiftLeft', 'ShiftRight', 'KeyN') || t.nitro;
  let target = (right ? 1 : 0) - (left ? 1 : 0), analog = null;
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const p of pads){
    if (!p) continue;
    const ax = p.axes[0] || 0; if (Math.abs(ax) > 0.12) analog = ax;
    const rt = p.buttons[7] ? p.buttons[7].value : 0, lt = p.buttons[6] ? p.buttons[6].value : 0;
    if (rt > 0.05) throttle = Math.max(throttle, rt); if (lt > 0.05) brake = Math.max(brake, lt);
    if (p.buttons[0] && p.buttons[0].pressed) nitro = true;
    if ((p.buttons[1] && p.buttons[1].pressed) || (p.buttons[5] && p.buttons[5].pressed)) handbrake = true;
    if (p.buttons[3] && p.buttons[3].pressed && !G.padY){ G.camMode = (G.camMode + 1) % 3; } G.padY = !!(p.buttons[3] && p.buttons[3].pressed);
    if (p.buttons[9] && p.buttons[9].pressed && !G.padStart){ togglePause(); } G.padStart = !!(p.buttons[9] && p.buttons[9].pressed);
  }
  if (analog != null) IN.steer = analog;
  else { const rate = target === 0 ? 7 : (Math.sign(target) !== Math.sign(IN.steer) ? 9 : 4.2); IN.steer += clamp(target - IN.steer, -rate * dt, rate * dt); }
  return { throttle, brake, steer: clamp(IN.steer, -1, 1), handbrake, nitro };
}
addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'Escape' || e.code === 'KeyP'){ togglePause(); return; }
  if (G.mode === 'garage'){
    if (e.code === 'ArrowLeft') pickCar(-1); else if (e.code === 'ArrowRight') pickCar(1); else if (e.code === 'Enter') startRace();
    return;
  }
  if (e.repeat) return;
  IN.keys.add(e.code);
  if (e.code === 'KeyC') G.camMode = (G.camMode + 1) % 3;
  if (e.code === 'KeyR' && (G.mode === 'race' || G.mode === 'free') && PLAYER && !PLAYER.finished) respawn(PLAYER);
});
addEventListener('keyup', e => IN.keys.delete(e.code));
addEventListener('blur', () => IN.keys.clear());
function bindTouch(id, key){
  const el = $(id);
  const on = e => { e.preventDefault(); IN.touch[key] = true; el.classList.add('on'); };
  const off = () => { IN.touch[key] = false; el.classList.remove('on'); };
  el.addEventListener('pointerdown', on); ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => el.addEventListener(ev, off));
}
[['#t-left', 'left'], ['#t-right', 'right'], ['#t-gas', 'gas'], ['#t-brake', 'brake'], ['#t-nitro', 'nitro'], ['#t-drift', 'drift']].forEach(([i, k]) => bindTouch(i, k));
function enableTouch(){ document.body.classList.add('touchmode'); $('#keys').textContent = 'Boutons à l’écran : ◀ ▶ pour tourner, Gaz, Frein, Drift (frein à main) et Nitro. Les dérapages remplissent la nitro.'; }
if (isTouch) enableTouch();
addEventListener('pointerdown', e => { if (e.pointerType === 'touch' && !document.body.classList.contains('touchmode')) enableTouch(); }, { capture: true });

/* ---------- Caméra ---------- */
const CAM = { pos: V3(), look: V3(), yaw: 0, fov: 62, shake: 0, orbit: 0, drag: null };
const _v = V3(), _w = V3(), _f = V3();
function chaseCamera(car, dt, snap){
  const V = car.V, sp = Math.abs(V.speed), s01 = clamp(sp / 75, 0, 1);
  // Le regard suit le cap avec du retard, et un peu la direction de glisse pendant un dérapage
  const velYaw = sp > 4 ? Math.atan2(V.vel.x, V.vel.z) : V.heading;
  const want = V.speed < -2 ? V.heading : dampAng(V.heading, velYaw, 1, V.drifting ? 0.45 : 0.15);
  CAM.yaw = snap ? want : dampAng(CAM.yaw, want, 5.5, dt);
  const fx = Math.sin(CAM.yaw), fz = Math.cos(CAM.yaw);
  let dist, hgt, lookUp, fov;
  if (G.camMode === 2){ dist = -1.1; hgt = 1.05; lookUp = 0.9; fov = 72; }
  else if (G.camMode === 1){ dist = 9.5 + s01 * 1.5; hgt = 3.4; lookUp = 1.2; fov = 58; }
  else { dist = 6.0 + s01 * 1.4; hgt = 2.05 - s01 * 0.2; lookUp = 1.05; fov = 60; }
  fov += s01 * 14 + (V.nitroOn ? 8 : 0);
  _v.set(V.pos.x - fx * dist, V.pos.y + hgt, V.pos.z - fz * dist);
  const gy = ACTIVE.ground(_v.x, _v.z, V.s).y + 0.7; if (_v.y < gy) _v.y = gy;
  if (snap || G.camMode === 2) CAM.pos.copy(_v); else { CAM.pos.x = damp(CAM.pos.x, _v.x, 14, dt); CAM.pos.z = damp(CAM.pos.z, _v.z, 14, dt); CAM.pos.y = damp(CAM.pos.y, _v.y, 8, dt); }
  if (G.camMode !== 2){ _f.set(V.pos.x, V.pos.y + 1, V.pos.z); camAvoid(_f, CAM.pos); }
  if (G.camMode === 2) CAM.look.set(V.pos.x + fx * 20, V.pos.y + lookUp, V.pos.z + fz * 20);
  else CAM.look.set(V.pos.x + fx * 4, V.pos.y + lookUp, V.pos.z + fz * 4);
  CAM.fov = snap ? fov : damp(CAM.fov, fov, 3, dt);
  const onRough = V.surface === 'dirt' || V.surface === 'sand' ? 1 : 0;
  CAM.shake = Math.max(CAM.shake - dt * 2.5, 0);
  const sh = CAM.shake * 0.25 + s01 * s01 * 0.025 + onRough * s01 * 0.05;
  camera.position.copy(CAM.pos); camera.position.x += rand(-sh, sh); camera.position.y += rand(-sh, sh);
  camera.lookAt(CAM.look);
  if (Math.abs(camera.fov - CAM.fov) > 0.05){ camera.fov = CAM.fov; camera.updateProjectionMatrix(); }
}

/* ---------- Garage ---------- */
let showcase = null, garageIdx = 0;
const TYPE_IDS = () => Object.keys(CAR_TYPES);
function garagePos(){ const o = WORLD.track.sample(70); return { x: o.x, y: o.y, z: o.z, heading: Math.atan2(o.tx, o.tz) }; }
function buildShowcase(){
  if (showcase){ scene.remove(showcase.root); if (showcase.dispose) showcase.dispose(); }
  const t = CAR_TYPES[SV.car];
  if (!SV.paint || !t.paints.includes(SV.paint)) SV.paint = t.defaultPaint || t.paints[0];
  showcase = buildCarModel(SV.car, SV.paint, { number: 7 });
  if (GARAGE){ showcase.root.position.copy(GARAGE.carPos); showcase.root.rotation.y = GARAGE.carHeading; }
  else { const p = garagePos(); showcase.root.position.set(p.x, p.y, p.z); showcase.root.rotation.y = p.heading + 0.5; }
  showcase.pose({ steer: -0.3, spin: 0, roll: 0, pitch: 0, heave: 0, brake: 0, nitro: 0, head: 0.35 });
  scene.add(showcase.root);
}
function renderGarageUI(){
  const ids = TYPE_IDS(), t = CAR_TYPES[SV.car];
  garageIdx = ids.indexOf(SV.car);
  $('#car-name').textContent = t.name; $('#car-class').textContent = t.cls;
  const st = $('#car-stats'); st.innerHTML = '';
  [['Vitesse', 'vitesse'], ['Accélération', 'accel'], ['Adhérence', 'adherence'], ['Dérapage', 'derapage']].forEach(([lbl, k]) => {
    const v = t.stats[k] || 0;
    st.insertAdjacentHTML('beforeend', `<span>${lbl}</span><i><b style="width:${Math.round(v * 100)}%"></b></i><span>${Math.round(v * 10)}</span>`);
  });
  const sw = $('#swatches'); sw.innerHTML = '';
  t.paints.forEach(p => { const b = document.createElement('button'); b.style.background = p; b.setAttribute('aria-label', 'Peinture ' + p); b.setAttribute('aria-pressed', String(p === SV.paint)); b.onclick = () => { SV.paint = p; save(); buildShowcase(); renderGarageUI(); AUDIO.one('ui'); }; sw.appendChild(b); });
  document.querySelectorAll('#diff button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.d === SV.diff)));
  document.querySelectorAll('#dest button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.dest === SV.dest)));
  const D = DEST[SV.dest]; $('#tagline').textContent = D.tag; $('#btn-race').textContent = D.go; $('#diff-card').hidden = SV.dest === 'libre';
  if (SV.dest === 'libre'){ $('#best').textContent = 'Pas de chrono : promène-toi dans Tana, d’Analakely au lac Anosy.'; return; }
  const best = SV.best[bestKey()];
  $('#best').innerHTML = best ? `Record avec cette voiture : <b>${fmt(best)}</b>` : 'Pas encore de record avec cette voiture.';
}
function pickCar(d){ const ids = TYPE_IDS(); SV.car = ids[(ids.indexOf(SV.car) + d + ids.length) % ids.length]; SV.paint = null; save(); buildShowcase(); renderGarageUI(); AUDIO.one('ui'); }
function enterGarage(){
  G.mode = 'garage'; clearCars(); clearTraffic(); if (FX) FX.clear(); HUD.show(false); $('#touch').hidden = true; document.body.classList.remove('free');
  setWorld('desert');
  ['#s-pause', '#s-results'].forEach(s => $(s).hidden = true); $('#s-garage').hidden = false;
  $('#radio-wrap').innerHTML = ''; $('#center').innerHTML = '';
  if (GARAGE && !GARAGE.active){ GARAGE.enter(); GARAGE.active = true; }
  CAM.shot = 0; CAM.shotT = 0; G.backfireT = 2.5;
  buildShowcase(); renderGarageUI(); AUDIO.music(0.25);
}
function leaveGarage(){ if (GARAGE && GARAGE.active){ GARAGE.exit(); GARAGE.active = false; } }
function garageCamera(dt){
  // Garage néon : plans de caméra enchaînés lentement, comme une vitrine de jeu ; glisser = tourner librement
  if (GARAGE && GARAGE.shots && GARAGE.shots.length && !CAM.free){
    CAM.shotT += dt;
    if (CAM.shotT > 8){ CAM.shotT = 0; CAM.shot = (CAM.shot + 1) % GARAGE.shots.length; }
    const sh = GARAGE.shots[CAM.shot], k = Math.min(1, CAM.shotT / 8), drift = (k - 0.5) * 0.6;
    const side = _v.set(sh.look.z - sh.pos.z, 0, -(sh.look.x - sh.pos.x)).normalize();
    _w.copy(sh.pos).addScaledVector(side, drift);
    if (CAM.shotT < dt * 1.5) camera.position.copy(_w); else camera.position.lerp(_w, 1 - Math.exp(-dt * 3));
    camera.lookAt(sh.look);
    if (innerWidth >= 720) camera.setViewOffset(innerWidth, innerHeight, -Math.min(280, innerWidth * 0.21), 0, innerWidth, innerHeight); else camera.clearViewOffset();
    const f = (sh.fov || 40) + (innerWidth >= 720 ? 6 : 12); if (camera.fov !== f){ camera.fov = f; camera.updateProjectionMatrix(); }
    return;
  }
  if (!CAM.drag) CAM.orbit += dt * 0.12;
  const p = showcase.root.position, r = innerWidth < 720 ? 7.8 : 6.2, a = CAM.orbit;
  camera.position.set(p.x + Math.sin(a) * r, p.y + 1.35 + Math.sin(a * 0.7) * 0.25, p.z + Math.cos(a) * r);
  // Décale la voiture vers la droite de l'écran quand le panneau occupe la gauche
  _w.set(p.x, p.y + (innerWidth < 720 ? 0.15 : 0.55), p.z);
  camera.lookAt(_w);
  // Décale l'image vers la droite quand le panneau du garage occupe la gauche
  if (innerWidth >= 720) camera.setViewOffset(innerWidth, innerHeight, -Math.min(230, innerWidth * 0.17), 0, innerWidth, innerHeight); else camera.clearViewOffset();
  if (camera.fov !== 42){ camera.fov = 42; camera.updateProjectionMatrix(); }
}
$('#c').addEventListener('pointerdown', e => { if (G.mode === 'garage'){ CAM.drag = { x: e.clientX }; if (!CAM.free){ CAM.free = true; const p = showcase.root.position; CAM.orbit = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); } } });
addEventListener('pointermove', e => { if (CAM.drag){ CAM.orbit -= (e.clientX - CAM.drag.x) * 0.008; CAM.drag.x = e.clientX; } });
addEventListener('pointerup', () => { CAM.drag = null; });
$('#car-prev').onclick = () => pickCar(-1);
$('#car-next').onclick = () => pickCar(1);
document.querySelectorAll('#diff button').forEach(b => b.onclick = () => { SV.diff = +b.dataset.d; save(); renderGarageUI(); AUDIO.one('ui'); });
document.querySelectorAll('#dest button').forEach(b => b.onclick = () => { SV.dest = b.dataset.dest; save(); renderGarageUI(); AUDIO.one('ui'); });
$('#btn-race').onclick = () => startRace();

/* ---------- Mondes : désert ou Tananarive ---------- */
// Tana est construite au premier départ (écran de chargement), puis gardée en mémoire
async function ensureTana(){
  if (TANA || typeof buildTana !== 'function') return !!TANA;
  $('#s-load').hidden = false; $('#load-txt').textContent = 'Arrivée à Tananarive…'; $('#load-bar').style.width = '4%';
  await new Promise(r => requestAnimationFrame(() => setTimeout(r, 40)));
  TANA = buildTana(p => { $('#load-bar').style.width = (4 + p * 86) + '%'; });
  $('#load-txt').textContent = 'Compilation des shaders…'; $('#load-bar').style.width = '94%';
  await tick();
  return true;
}
function setWorld(name){
  const want = name === 'desert' || !TANA ? WORLD : TANA;
  if (ACTIVE === want) return;
  if (ACTIVE === TANA && TANA){ TANA.exit(); }
  if (want === TANA){ if (DESERT_ROOT) DESERT_ROOT.visible = false; TANA.enter(); }
  else if (DESERT_ROOT) DESERT_ROOT.visible = true;
  ACTIVE = want; FX.clear();
}
function setMap(free){
  if (ACTIVE === TANA){
    HUD.setTrack(free ? null : TANA.track.polyline(400));
    HUD.setStreets(TANA.streetLines || null, free ? 210 : null);
  } else { HUD.setStreets(null); HUD.setTrack(WORLD.track.polyline(400)); }
}

/* ---------- Course ---------- */
const R = { t: 0, state: 'intro', count: 0, finishOrder: [], radioDone: {} };
const fmt = t => { if (!isFinite(t)) return '--:--.--'; const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s < 10 ? '0' : ''}${s.toFixed(2)}`; };
async function startRace(){
  if (G.starting) return; G.starting = true;
  try { await startRaceInner(); } catch (err) { console.error(err); $('#err').hidden = false; $('#err').textContent = 'Erreur : ' + (err && err.message || err); }
  G.starting = false;
}
async function startRaceInner(){
  AUDIO.init(); AUDIO.setSfx(SV.sfx); AUDIO.setMusic(SV.music); AUDIO.one('ui');
  const wantTana = SV.dest !== 'desert';
  if (wantTana && !TANA){ const was = G.mode; G.mode = 'load'; await ensureTana(); if (!TANA){ SV.dest = 'desert'; } G.mode = was; }
  if (showcase){ scene.remove(showcase.root); if (showcase.dispose) showcase.dispose(); showcase = null; }
  leaveGarage(); CAM.free = false;
  clearCars(); clearTraffic(); FX.clear();
  setWorld(SV.dest); setMap(SV.dest === 'libre');
  if (!$('#s-load').hidden){ try { renderer.compile(scene, camera); } catch (e) {} $('#s-load').hidden = true; }
  $('#h-obj').textContent = DEST[SV.dest].obj; document.body.classList.toggle('free', SV.dest === 'libre');
  if (SV.dest === 'libre') return startFree();
  const slots = [0, 1, 2, 3, 4, 5], playerSlot = 3;
  let ri = 0;
  slots.forEach(i => {
    const isP = i === playerSlot, rv = isP ? null : RIVALS[ri++];
    const car = makeCar(isP ? SV.car : rv.type, isP ? SV.paint : rv.paint, isP ? 'Toi' : rv.name, isP, i);
    const sl = ACTIVE.track.startSlot(i); car.V.reset(sl.x, sl.y, sl.z, sl.heading);
    const pr = ACTIVE.track.project(sl.x, sl.z); car.prevS = pr.s; car.lap = pr.s > ACTIVE.track.length / 2 ? -1 : 0; car.V.s = pr.s;
    if (isP) PLAYER = car;
  });
  Object.assign(R, { t: 0, state: 'intro', count: 3.999, finishOrder: [], radioDone: {}, raceTime: 0 });
  $('#s-garage').hidden = true; $('#s-results').hidden = true; $('#s-pause').hidden = true;
  HUD.show(true); $('#touch').hidden = !document.body.classList.contains('touchmode');
  G.mode = 'race'; G.paused = false; CAM.orbit = 0; CAM.yaw = PLAYER.V.heading; camera.clearViewOffset();
  AUDIO.music(0.55);
  if (ACTIVE === TANA){
    radio('Kiko', 'Course de rue à Tana ! Les rues sont étroites et ça monte : freine avant les virages.', 'start');
    setTimeout(() => radio('Vega', 'Ici, c’est mon quartier. Reste derrière moi, petit.', 'taunt'), 3600);
  } else {
    radio('Kiko', 'Le désert est à nous ce soir. Fais-leur manger ta poussière.', 'start');
    setTimeout(() => radio('Vega', 'Rentre au garage, petit. Le canyon, c’est chez moi.', 'taunt'), 3600);
  }
}
function radio(who, text, key){ if (key && R.radioDone[key]) return; if (key) R.radioDone[key] = true; HUD.radio(who, text, 4200); }
function respawn(car){
  if (G.mode === 'free') return respawnFree();
  const o = ACTIVE.track.sample(car.V.s); car.V.reset(o.x, o.y, o.z, Math.atan2(o.tx, o.tz)); car.V.vel.set(0, 0, 0); CAM.shake = 0.2;
}
function updateProgress(car){
  const L = ACTIVE.track.length, s = car.V.s;
  if (car.prevS > L * 0.75 && s < L * 0.25){ car.lap++; onLap(car); }
  else if (car.prevS < L * 0.25 && s > L * 0.75) car.lap--;
  car.prevS = s;
  car.progress = car.finished ? 1e9 - car.finishPos : car.lap * L + s;
}
function onLap(car){
  if (car.lap <= 0){ car.lapStart = R.raceTime; return; }
  const lt = R.raceTime - car.lapStart; car.lapStart = R.raceTime;
  if (lt < car.bestLap) car.bestLap = lt;
  if (car.lap >= LAPS && !car.finished){
    car.finished = true; car.finishTime = R.raceTime; R.finishOrder.push(car); car.finishPos = R.finishOrder.length;
    if (car.isPlayer){ AUDIO.one('finish'); finishPlayer(); }
    return;
  }
  if (car.isPlayer){
    AUDIO.one('lap'); HUD.banner(car.lap + 1 === LAPS ? 'Dernier tour' : `Tour ${car.lap + 1}`, fmt(lt));
    if (car.lap + 1 === LAPS) radio('Kiko', 'Dernier tour ! Garde ta nitro pour la grande ligne droite.', 'last');
  }
}
function standings(){ return CARS.slice().sort((a, b) => b.progress - a.progress); }
function finishPlayer(){
  R.state = 'done';
  const pos = R.finishOrder.indexOf(PLAYER) + 1;
  radio(pos === 1 ? 'Kiko' : 'Vega', pos === 1 ? (ACTIVE === TANA ? 'Victoire ! Tout Tana va parler de toi ce soir.' : 'Victoire ! Le désert de Fortune connaît ton nom maintenant.') : pos <= 3 ? 'Pas mal pour un débutant. La prochaine fois, je ne te laisserai même pas ma poussière.' : 'Retourne t’entraîner. Le canyon ne pardonne pas.', 'end');
  const bk = bestKey(); if (!SV.best[bk] || PLAYER.finishTime < SV.best[bk]){ SV.best[bk] = PLAYER.finishTime; save(); }
  setTimeout(showResults, 3200);
}
function showResults(){
  // Temps estimés pour ceux qui n'ont pas fini
  const L = ACTIVE.track.length;
  const rows = standings().map(c => {
    let t = c.finished ? c.finishTime : R.raceTime + Math.max(0, LAPS * L - c.progress) / Math.max(20, Math.abs(c.V.speed));
    return { c, t };
  }).sort((a, b) => a.t - b.t);
  const pos = rows.findIndex(r => r.c === PLAYER) + 1;
  $('#res-title').innerHTML = pos === 1 ? 'Victoire <em>!</em>' : `${pos}<sup>e</sup> place`;
  $('#res-sub').innerHTML = `Ton temps : <b>${fmt(PLAYER.finishTime)}</b> · meilleur tour ${fmt(PLAYER.bestLap)}`;
  $('#res-table').innerHTML = rows.map((r, i) => `<tr class="${r.c === PLAYER ? 'me' : ''}"><td>${i + 1}</td><td>${r.c.name}</td><td>${fmt(r.t)}</td></tr>`).join('');
  HUD.show(false); $('#touch').hidden = true; $('#s-results').hidden = false; G.mode = 'results';
}
$('#btn-again').onclick = () => startRace();
$('#btn-res-garage').onclick = () => enterGarage();

function updateRace(dt){
  const track = ACTIVE.track, L = track.length, ctxW = worldCtx();
  R.t += dt;
  // Compte à rebours avec plan d'introduction
  if (R.state === 'intro'){
    const prev = Math.ceil(R.count); R.count -= dt; const now = Math.ceil(R.count);
    if (now !== prev && now >= 1 && now <= 3){ HUD.countdown(now); AUDIO.one('countdown'); }
    if (R.count <= 0){ R.state = 'go'; HUD.countdown(0); AUDIO.one('go'); }
  }
  if (R.state !== 'intro') R.raceTime += dt;
  const racing = R.state !== 'intro';
  const leader = Math.max(...CARS.map(c => c.progress));
  for (const car of CARS){
    let input;
    // compte à rebours : frein à main serré (le frein seul passe en marche arrière à l'arrêt)
    if (!racing) input = { throttle: 0, brake: 0, steer: 0, handbrake: true, nitro: false };
    else if (car.isPlayer && !car.finished) input = readInput(dt);
    else if (car.isPlayer) input = { throttle: 0.4, brake: 0, steer: 0, handbrake: false, nitro: false };
    if (!car.isPlayer || car.finished){
      const ai = car.ai || (car.ai = createAI(car.V, { skill: 0.8, lane: 0, name: car.name }));
      const aiIn = ai.update(dt, ctxW, { myProgress: car.progress, playerProgress: PLAYER.progress, leaderProgress: leader });
      if (racing) input = aiIn;
    }
    if (car.isPlayer && racing) readInputSide(car, input);
    car.V.update(dt, input, ctxW);
    if (!racing){ car.V.vel.x = car.V.vel.z = 0; car.V.speed = 0; car.V.yawRate = 0; }
    updateProgress(car);
    carFX(car, dt);
  }
  // Drift : points et nitro
  const P = PLAYER.V;
  if (P.drifting && Math.abs(P.speed) > 12){ PLAYER.driftPts += dt * Math.abs(P.speed) * 6 * (0.5 + P.slip); HUD.drift(`Dérapage ${Math.round(PLAYER.driftPts)}`); }
  else if (PLAYER.driftPts > 0){ if (PLAYER.driftPts > 250) HUD.banner(`+${Math.round(PLAYER.driftPts)}`, 'Dérapage'); PLAYER.driftPts = 0; HUD.drift(null); }
  // Messages radio selon la section
  const sec = track.sample(P.s).section;
  if (sec !== PLAYER.lastSection){
    if (ACTIVE === TANA && PLAYER.lap === 0 && tanaRadio(sec)) radio('Kiko', tanaRadio(sec), 'tana-' + sec);
    if (sec === 'canyon' && PLAYER.lap === 0) radio('Kiko', 'Canyon devant. Les parois ne pardonnent pas, reste au centre.', 'canyon');
    if (sec === 'dirt' && PLAYER.lap === 0) radio('Kiko', 'Piste de terre ! Frein à main, contre-braquage, et la nitro se remplit toute seule.', 'dirt');
    PLAYER.lastSection = sec;
  }
  // HUD
  const st = standings(), pos = st.indexOf(PLAYER) + 1;
  HUD.update({
    speedKmh: Math.abs(P.speed) * 3.6, gear: P.gear, rpm01: P.rpm01, nitro01: P.nitro, nitroOn: P.nitroOn,
    pos, total: CARS.length, lap: clamp(PLAYER.lap + 1, 1, LAPS), laps: LAPS, time: R.raceTime, best: PLAYER.bestLap,
    standings: st.map(c => ({ name: c.name, me: c.isPlayer })), cars: CARS.map(c => ({ x: c.V.pos.x, z: c.V.pos.z, me: c.isPlayer, color: c.color })),
    heading: P.heading, px: P.pos.x, pz: P.pos.z,
  });
  // Son
  AUDIO.engine(0, { rpm01: P.rpm01, throttle: P.throttle, speed01: clamp(Math.abs(P.speed) / 75, 0, 1), gain: 1 });
  const near = CARS.filter(c => !c.isPlayer).map(c => ({ c, d: c.V.pos.distanceTo(camera.position) })).sort((a, b) => a.d - b.d).slice(0, 3);
  near.forEach((n, i) => AUDIO.engine(i + 1, { rpm01: n.c.V.rpm01, throttle: n.c.V.throttle, speed01: clamp(Math.abs(n.c.V.speed) / 75, 0, 1), gain: clamp(1 - n.d / 90, 0, 1) * 0.6 }));
  AUDIO.tires(P.surface === 'asphalt' ? clamp(P.slip * 1.6, 0, 1) : 0);
  AUDIO.wind(clamp(Math.abs(P.speed) / 80, 0, 1));
  if (P.hitWall > 0.5 || P.hitCar > 0.5){ AUDIO.one(P.hitWall > 3 || P.hitCar > 3 ? 'impact' : 'scrape'); CAM.shake = Math.min(1, CAM.shake + (P.hitWall + P.hitCar) * 0.08); }
  if (P.nitroOn && !G.wasNitro) AUDIO.one('nitro'); G.wasNitro = P.nitroOn;
  if (P.gear !== G.lastGear){ if (G.lastGear && P.gear > G.lastGear) AUDIO.one('gear'); G.lastGear = P.gear; }
  AUDIO.music(PLAYER.lap + 1 >= LAPS ? 1 : 0.6);
}
// Petits coups de pouce côté joueur : rien à corriger pour l'instant
function readInputSide(car, input){ return input; }
const _wp = V3(), _dir = V3(), _vel = V3();
function carFX(car, dt){
  const V = car.V, m = car.model;
  m.root.position.copy(V.pos); m.root.rotation.y = V.heading;
  V.spinVis = (V.spinVis || 0);
  m.pose({ steer: V.steer, spin: V.spin, roll: V.roll, pitch: V.pitch, heave: V.heave, brake: car.lastBrake || 0, nitro: V.nitroOn ? 1 : 0, head: 0.85 });
  car.lastBrake = V.speed > 2 && V.throttle < 0.05 ? 1 : 0;
  const dCam = V.pos.distanceTo(camera.position); if (dCam > 160) return;
  m.root.updateMatrixWorld();
  const sp = Math.abs(V.speed);
  const rough = V.surface === 'dirt' || V.surface === 'sand' || V.surface === 'grass', shoulder = V.surface === 'shoulder';
  const dustCol = V.surface === 'dirt' ? (ACTIVE === TANA ? '#b8674a' : '#c79f75') : V.surface === 'grass' ? '#8f7a52' : PAL.sand;
  for (let w = 2; w < 4; w++){
    _wp.copy(m.wheelsLocal[w]); m.root.localToWorld(_wp);
    _vel.copy(V.vel).multiplyScalar(-0.15); _vel.y += 0.8;
    if ((rough || shoulder) && sp > 3) FX.dust(_wp, _vel, clamp(sp / 40, 0.2, 1) * (rough ? (V.surface === 'grass' ? 0.4 : 1) : 0.45), dustCol);
    if (!rough && V.slip > 0.28 && sp > 6){ FX.smoke(_wp, _vel, clamp(V.slip * 1.4, 0, 1)); }
  }
  if (!rough && (V.slip > 0.3 || (car.lastBrake && V.throttle < 0.05 && sp > 20 && V.slip > 0.12))) for (let w = 0; w < 4; w++){ _wp.copy(m.wheelsLocal[w]); m.root.localToWorld(_wp); FX.skid(car.idx * 4 + w, _wp.x, _wp.y + 0.02, _wp.z, V.heading, clamp(V.slip * 1.5, 0.3, 1)); }
  if (V.nitroOn){ _dir.set(-Math.sin(V.heading), 0, -Math.cos(V.heading)); m.exhausts.forEach(e => { _wp.copy(e); m.root.localToWorld(_wp); FX.flame(_wp, _dir, 1); }); }
  if (V.hitWall > 1.5 || V.hitCar > 2){ _wp.copy(V.pos); _wp.y += 0.5; _dir.set(rand(-1, 1), 1, rand(-1, 1)); FX.sparks(_wp, _dir, clamp((V.hitWall + V.hitCar) / 5, 0.25, 1)); }
}

/* ---------- Tana : messages de course par section ---------- */
const TANA_RADIO = [
  [/ind[eé]pendance|avenue|boulevard/i, 'Avenue de l’Indépendance : c’est tout droit jusqu’à la gare. Nitro !'],
  [/anosy|lac/i, 'Le lac Anosy ! Admire les jacarandas… mais pas trop longtemps.'],
  [/analakely|march[eé]/i, 'Analakely, le marché : ça se resserre entre les parasols, freine tôt.'],
  [/rova|haute|colline|mont[eé]e/i, 'Ça grimpe vers la Haute-Ville et le Rova. Garde de l’élan dans les épingles.'],
  [/rizi[eè]re|digue/i, 'Les rizières en contrebas : longue ligne droite sur la digue, mets les gaz.'],
  [/pav[eé]|cobble/i, 'Pavés devant : ça glisse, doucement sur le volant.'],
];
const tanaRadio = sec => { if (!sec) return null; for (const [re, txt] of TANA_RADIO) if (re.test(String(sec))) return txt; return null; };

/* ---------- Balade libre et circulation ---------- */
const TRAF = { cars: [], loops: [], spawnIdx: 0, distT: 0, district: null };
const TRAF_TYPES = ['taxibe', 'quatrelle', 'deuxpattes', 'taxibe', 'quatrelle', 'taiga', 'deuxpattes', 'kitsune'];
const TRAF_PAINTS = { taxibe: ['#efe8d6', '#e8e2cf', '#f1ead8'], quatrelle: ['#e6dcc0', '#d9cfb2', '#ece3c9'], deuxpattes: ['#7d8288', '#6e2a32', '#a7a9a4'] };
function clearTraffic(){ TRAF.cars.forEach(c => { scene.remove(c.model.root); if (c.model.dispose) c.model.dispose(); }); TRAF.cars.length = 0; }
function prepLoops(){
  TRAF.loops = (TANA.trafficLoops || []).filter(l => l && l.length > 2).map(pts => {
    const P = pts.map(p => ({ x: p[0], y: p[1], z: p[2] })), cum = [0]; let d = 0;
    for (let i = 1; i <= P.length; i++){ const a = P[i - 1], b = P[i % P.length]; d += Math.hypot(b.x - a.x, b.z - a.z); cum.push(d); }
    return { P, cum, len: d };
  });
}
// Point d'une boucle à la distance d (index mémorisé pour avancer vite)
function loopAt(L, d, c, out){
  d = ((d % L.len) + L.len) % L.len;
  let i = c.seg || 0; if (L.cum[i] > d) i = 0;
  while (i < L.P.length - 1 && L.cum[i + 1] < d) i++;
  c.seg = i;
  const a = L.P[i], b = L.P[(i + 1) % L.P.length], t = (d - L.cum[i]) / Math.max(0.01, L.cum[i + 1] - L.cum[i]);
  out.x = lerp(a.x, b.x, t); out.z = lerp(a.z, b.z, t); out.h = Math.atan2(b.x - a.x, b.z - a.z);
  return out;
}
function buildTraffic(){
  clearTraffic(); prepLoops();
  if (!TRAF.loops.length || typeof buildTrafficModel !== 'function') return;
  const types = TRAF_TYPES.filter(t => CAR_TYPES[t]); if (!types.length) return;
  const total = Math.round(6 + 8 * Q.props), P = PLAYER.V.pos, tmp = {};
  const lens = TRAF.loops.reduce((a, L) => a + L.len, 0);
  let k = 0;
  TRAF.loops.forEach((L, li) => {
    const n = Math.max(1, Math.round(total * L.len / lens));
    for (let j = 0; j < n; j++){
      const d = (j + rand(0.1, 0.6)) * L.len / n, c = { loop: li, d, seg: 0 };
      loopAt(L, d, c, tmp); if (Math.hypot(tmp.x - P.x, tmp.z - P.z) < 30) continue;
      const type = types[k++ % types.length], pal = TRAF_PAINTS[type] || CAR_TYPES[type].paints;
      c.type = type; c.model = buildTrafficModel(type, pal[(Math.random() * pal.length) | 0]);
      c.vmax = (type === 'taxibe' ? 10.5 : 12.5) + rand(-1.5, 1.5); c.v = c.vmax * 0.6; c.stun = 0; c.spin = 0; c.heading = tmp.h; c.pos = V3(tmp.x, 0, tmp.z); c.steer = 0;
      const dm = c.model.dims; c.half = dm && dm.length ? dm.length / 2 : 2.2;
      scene.add(c.model.root); TRAF.cars.push(c);
    }
  });
}
const _tp = {};
function updateTraffic(dt){
  const P = PLAYER.V, px = P.pos.x, pz = P.pos.z;
  for (const c of TRAF.cars){
    const L = TRAF.loops[c.loop];
    // Freine derrière une autre voiture de la boucle ou devant le joueur
    let want = c.vmax;
    for (const o of TRAF.cars){ if (o === c || o.loop !== c.loop) continue; const gap = ((o.d - c.d) % L.len + L.len) % L.len; if (gap < 16) want = Math.min(want, Math.max(0, (gap - 7) * 1.2)); }
    const fx = Math.sin(c.heading), fz = Math.cos(c.heading), dx = px - c.pos.x, dz = pz - c.pos.z, ahead = dx * fx + dz * fz, side = Math.abs(dx * fz - dz * fx);
    if (ahead > 0 && ahead < 18 && side < 2.6) want = Math.min(want, Math.max(0, (ahead - 6) * 1.1));
    if (c.stun > 0){ c.stun -= dt; want = 0; }
    c.v = damp(c.v, want, want < c.v ? 4 : 1.2, dt); c.d += c.v * dt;
    loopAt(L, c.d, c, _tp);
    const prevH = c.heading; c.heading = dampAng(c.heading, _tp.h, 5, dt);
    c.steer = clamp(wrapAng(c.heading - prevH) / Math.max(dt, 1e-3) * 0.35, -0.6, 0.6);
    const g = ACTIVE.ground(_tp.x, _tp.z);
    c.pos.set(_tp.x, g.y, _tp.z); c.spin += c.v * dt / 0.33;
    const m = c.model, dc = Math.hypot(_tp.x - camera.position.x, _tp.z - camera.position.z);
    m.root.visible = dc < 260;
    if (!m.root.visible) continue;
    m.root.position.copy(c.pos); m.root.rotation.y = c.heading;
    m.pose({ steer: -c.steer, spin: c.spin, roll: 0, pitch: 0, heave: 0, brake: want < c.v - 0.5 ? 1 : 0, nitro: 0, head: 0.6 });
  }
}
// Collision joueur ↔ circulation : deux cercles par voiture ; la voiture touchée s'arrête un instant
function trafficHit(x, z, r){
  for (const c of TRAF.cars){
    const fx = Math.sin(c.heading), fz = Math.cos(c.heading), off = Math.max(0.6, c.half - 1.1);
    for (const sgn of [-1, 1]){
      const cx = c.pos.x + fx * off * sgn, cz = c.pos.z + fz * off * sgn, dx = x - cx, dz = z - cz, d = Math.hypot(dx, dz), R = r + 1.1;
      if (d < R && d > 1e-4){ c.stun = 2.5; return { nx: dx / d, nz: dz / d, depth: R - d }; }
    }
  }
  return null;
}
function nearestRoad(x, z){
  let best = null, bd = Infinity;
  for (const L of TRAF.loops) for (let i = 0; i < L.P.length; i++){
    const p = L.P[i], d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d < bd){ bd = d; const q = L.P[(i + 1) % L.P.length]; best = { x: p.x, z: p.z, heading: Math.atan2(q.x - p.x, q.z - p.z) }; }
  }
  if (!best && TANA.spawns && TANA.spawns.length){ const sp = TANA.spawns[0]; best = { x: sp.x, z: sp.z, heading: sp.heading }; }
  return best;
}
function respawnFree(){
  const b = nearestRoad(PLAYER.V.pos.x, PLAYER.V.pos.z); if (!b) return;
  PLAYER.V.reset(b.x, ACTIVE.ground(b.x, b.z).y, b.z, b.heading); PLAYER.V.vel.set(0, 0, 0); CAM.yaw = b.heading; CAM.shake = 0.2;
  for (const c of TRAF.cars) if (Math.hypot(c.pos.x - b.x, c.pos.z - b.z) < 12) c.d += 30;
}
function startFree(){
  const sps = TANA.spawns && TANA.spawns.length ? TANA.spawns : [Object.assign(TANA.track.startSlot(0), {})];
  const sp = sps[TRAF.spawnIdx++ % sps.length];
  PLAYER = makeCar(SV.car, SV.paint, 'Toi', true, 3);
  PLAYER.V.reset(sp.x, sp.y != null ? sp.y : ACTIVE.ground(sp.x, sp.z).y, sp.z, sp.heading);
  buildTraffic();
  Object.assign(R, { t: 0, state: 'go', count: 0, finishOrder: [], radioDone: {}, raceTime: 0 });
  TRAF.district = null; TRAF.distT = 0;
  $('#s-garage').hidden = true; $('#s-results').hidden = true; $('#s-pause').hidden = true;
  HUD.show(true); $('#touch').hidden = !document.body.classList.contains('touchmode');
  G.mode = 'free'; G.paused = false; CAM.yaw = sp.heading; camera.clearViewOffset();
  chaseCamera(PLAYER, 0.016, true);
  AUDIO.music(0.35);
  radio('Kiko', `Bienvenue à Tana${sp.name ? ', ' + sp.name : ''} ! Ici on roule à droite. Attention aux taxi-be.`, 'free');
}
function updateFree(dt){
  const ctxW = worldCtx(), P = PLAYER.V;
  R.raceTime += dt;
  P.update(dt, readInput(dt), ctxW);
  carFX(PLAYER, dt);
  updateTraffic(dt);
  // Quartier traversé
  TRAF.distT -= dt;
  if (TRAF.distT <= 0 && TANA.districts){
    TRAF.distT = 0.5;
    let best = null, bd = Infinity;
    for (const d of TANA.districts){ const k = Math.hypot(P.pos.x - d.x, P.pos.z - d.z) / (d.r || 200); if (k < 1 && k < bd){ bd = k; best = d; } }
    if (best && best !== TRAF.district){ TRAF.district = best; HUD.banner(best.name, 'Tananarive'); $('#h-obj').textContent = best.name; }
  }
  if (P.drifting && Math.abs(P.speed) > 12){ PLAYER.driftPts += dt * Math.abs(P.speed) * 6 * (0.5 + P.slip); HUD.drift(`Dérapage ${Math.round(PLAYER.driftPts)}`); }
  else if (PLAYER.driftPts > 0){ if (PLAYER.driftPts > 250) HUD.banner(`+${Math.round(PLAYER.driftPts)}`, 'Dérapage'); PLAYER.driftPts = 0; HUD.drift(null); }
  HUD.update({
    speedKmh: Math.abs(P.speed) * 3.6, gear: P.gear, rpm01: P.rpm01, nitro01: P.nitro, nitroOn: P.nitroOn,
    pos: 1, total: 1, lap: 1, laps: 1, time: R.raceTime, best: 0,
    cars: TRAF.cars.map(c => ({ x: c.pos.x, z: c.pos.z, me: false, color: '#d8d2c4' })),
    heading: P.heading, px: P.pos.x, pz: P.pos.z,
  });
  AUDIO.engine(0, { rpm01: P.rpm01, throttle: P.throttle, speed01: clamp(Math.abs(P.speed) / 75, 0, 1), gain: 1 });
  const near = TRAF.cars.map(c => ({ c, d: c.pos.distanceTo(camera.position) })).sort((a, b) => a.d - b.d).slice(0, 3);
  near.forEach((n, i) => AUDIO.engine(i + 1, { rpm01: 0.2 + n.c.v / 40, throttle: 0.3, speed01: n.c.v / 75, gain: clamp(1 - n.d / 60, 0, 1) * 0.35 }));
  AUDIO.tires(P.surface === 'asphalt' || P.surface === 'cobble' ? clamp(P.slip * 1.6, 0, 1) : 0);
  AUDIO.wind(clamp(Math.abs(P.speed) / 80, 0, 1));
  if (P.hitWall > 0.5 || P.hitCar > 0.5){ AUDIO.one(P.hitWall > 3 || P.hitCar > 3 ? 'impact' : 'scrape'); CAM.shake = Math.min(1, CAM.shake + (P.hitWall + P.hitCar) * 0.08); }
  if (P.nitroOn && !G.wasNitro) AUDIO.one('nitro'); G.wasNitro = P.nitroOn;
  if (P.gear !== G.lastGear){ if (G.lastGear && P.gear > G.lastGear) AUDIO.one('gear'); G.lastGear = P.gear; }
}

/* ---------- Pause ---------- */
function togglePause(){
  if (G.mode !== 'race' && G.mode !== 'free') return;
  G.paused = !G.paused; $('#s-pause').hidden = !G.paused; syncPause();
  if (G.paused) AUDIO.stopAll && AUDIO.setSfx(false); else AUDIO.setSfx(SV.sfx);
}
function syncPause(){
  document.querySelectorAll('#quality button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.q === qName)));
  $('#btn-sound').textContent = 'Son : ' + (SV.sfx ? 'oui' : 'non'); $('#btn-music').textContent = 'Musique : ' + (SV.music ? 'oui' : 'non');
}
$('#btn-pause').onclick = () => togglePause();
$('#btn-resume').onclick = () => togglePause();
$('#btn-restart').onclick = () => { $('#s-pause').hidden = true; G.paused = false; startRace(); };
$('#btn-garage').onclick = () => enterGarage();
document.querySelectorAll('#quality button').forEach(b => b.onclick = () => setQuality(b.dataset.q));
$('#btn-sound').onclick = () => { SV.sfx = !SV.sfx; save(); syncPause(); };
$('#btn-music').onclick = () => { SV.music = !SV.music; save(); AUDIO.setMusic(SV.music); syncPause(); };
document.addEventListener('visibilitychange', () => { if (document.hidden && (G.mode === 'race' || G.mode === 'free') && !G.paused) togglePause(); });
addEventListener('resize', () => resize());

/* ---------- Boucle ---------- */
let last = performance.now();
function frame(now){
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
  G.time += dt;
  let blur = 0, bloom = 0;
  if (G.mode === 'garage'){
    garageCamera(dt); updateSun(showcase.root.position);
    if (GARAGE){
      GARAGE.update(dt, G.time);
      // Retour de flamme à l'échappement de temps en temps
      G.backfireT -= dt;
      const fire = G.backfireT < 0 ? clamp(1 + G.backfireT / 0.45, 0, 1) : 0;
      showcase.pose({ steer: -0.3, spin: 0, roll: 0, pitch: 0, heave: 0, brake: 0.4, nitro: 0, head: 0.35, backfire: fire });
      if (G.backfireT < 0 && !G.backfired){ G.backfired = true; AUDIO.one('backfire'); showcase.root.updateMatrixWorld(); _dir.set(-Math.sin(showcase.root.rotation.y), 0.05, -Math.cos(showcase.root.rotation.y)); showcase.exhausts.forEach(e => { _wp.copy(e); showcase.root.localToWorld(_wp); for (let i = 0; i < 6; i++) FX.flame(_wp, _dir, 1); }); }
      if (G.backfireT < -0.45){ G.backfireT = rand(3.5, 6.5); G.backfired = false; }
    }
    FX.update(dt); bloom = GARAGE ? 0.04 : 0;
  }
  else if (G.mode === 'race' || G.mode === 'results'){
    if (!G.paused){
      if (G.mode === 'race') updateRace(dt);
      else for (const car of CARS){ const ai = car.ai || (car.ai = createAI(car.V, { skill: 0.75, lane: 0 })); car.V.update(dt, ai.update(dt, worldCtx(), { myProgress: car.progress, playerProgress: PLAYER.progress }), worldCtx()); updateProgress(car); carFX(car, dt); }
      FX.update(dt);
    }
    if (R.state === 'intro'){
      // Plan d'introduction : la caméra tourne autour de la voiture du joueur
      const V = PLAYER.V, a = V.heading + Math.PI * (0.25 + (1 - R.count / 4) * 0.75), r = 7 - (1 - R.count / 4) * 1.2;
      camera.position.set(V.pos.x + Math.sin(a) * r, V.pos.y + 1.4 + R.count * 0.25, V.pos.z + Math.cos(a) * r);
      _f.set(V.pos.x, V.pos.y + 1, V.pos.z); camAvoid(_f, camera.position);
      camera.lookAt(V.pos.x, V.pos.y + 0.8, V.pos.z); if (camera.fov !== 55){ camera.fov = 55; camera.updateProjectionMatrix(); }
      CAM.pos.copy(camera.position); CAM.yaw = V.heading;
    } else chaseCamera(PLAYER, dt, false);
    updateSun(PLAYER.V.pos);
  }
  else if (G.mode === 'free'){
    if (!G.paused){ updateFree(dt); FX.update(dt); }
    chaseCamera(PLAYER, dt, false); updateSun(PLAYER.V.pos);
  }
  if ((G.mode === 'race' || G.mode === 'results' || G.mode === 'free') && PLAYER){
    // Flou de vitesse seulement au-delà de ~100 km/h : l'image reste nette en ville
    const s01 = clamp((Math.abs(PLAYER.V.speed) - 26) / 55, 0, 1);
    blur = Q.post ? s01 * s01 * 0.7 + (PLAYER.V.nitroOn ? 0.3 : 0) : 0; bloom = PLAYER.V.nitroOn ? 0.08 : 0;
  }
  if (ACTIVE) ACTIVE.update(dt, camera.position);
  if (glare) glare.position.copy(camera.position).addScaledVector(SUN_DIR, 6000);
  if (AUDIO) AUDIO.update(dt);
  renderFrame(dt, { blur, bloom, heat: G.mode === 'garage' ? 0.5 : ACTIVE === TANA ? DEST.tana.heat : DEST.desert.heat });
  perfWatch(dt);
  requestAnimationFrame(frame);
}
function perfWatch(dt){
  if ((G.mode !== 'race' && G.mode !== 'free') || G.paused || G.perfDone || qName === 'basse') return;
  G.perfT += dt; G.perfAcc += dt; G.perfN++;
  if (G.perfT < 5) return;
  if (G.perfAcc / G.perfN > 1 / 28){ G.perfDone = true; setQuality(qName === 'haute' ? 'moyenne' : 'basse', true); HUD.banner('Qualité ajustée', 'pour rester fluide'); }
  G.perfT = G.perfAcc = G.perfN = 0;
}

/* ---------- Démarrage ---------- */
(async function boot(){
  const step = async (p, t) => { $('#load-bar').style.width = p + '%'; if (t) $('#load-txt').textContent = t; await tick(); };
  try {
    await step(5, 'Démarrage du moteur…');
    initEngine($('#c'));
    await step(15, 'Le soleil se couche sur le désert…');
    const before = new Set(scene.children);
    WORLD = buildWorld(p => { $('#load-bar').style.width = (15 + p * 65) + '%'; });
    DESERT_ROOT = new THREE.Group(); DESERT_ROOT.name = 'desert';
    scene.children.filter(o => !before.has(o) && !o.isLight).forEach(o => DESERT_ROOT.add(o));
    scene.add(DESERT_ROOT); ACTIVE = WORLD;
    await step(82, 'Préparation des voitures…');
    FX = createFX(); AUDIO = createAudio(); HUD = createHUD(); HUD.setTrack(WORLD.track.polyline(400));
    if (typeof buildGarage === 'function'){ await step(86, 'Allumage des néons du garage…'); GARAGE = buildGarage(); }
    buildGlare(); setupPost(); resize();
    if (!CAR_TYPES[SV.car] || (!SV.paint && CAR_TYPES.hyperion)) SV.car = CAR_TYPES.hyperion ? 'hyperion' : Object.keys(CAR_TYPES)[0];
    // Nouvelle version : on présente la Hyperion en rouge-orange irisé
    if (!SV.v3 && CAR_TYPES.hyperion){ SV.v3 = true; SV.car = 'hyperion'; SV.paint = CAR_TYPES.hyperion.paints[0]; save(); }
    enterGarage();
    await step(95, 'Compilation des shaders…');
    try { renderer.compile(scene, camera); } catch (e) {}
    await step(100);
    $('#s-load').hidden = true;
    requestAnimationFrame(frame);
    window.__nc = { G, R, CARS, get PLAYER(){ return PLAYER; }, WORLD, get TANA(){ return TANA; }, get ACTIVE(){ return ACTIVE; }, TRAF, SV, startRace, enterGarage, setQuality, CAM, IN };
  } catch (err) {
    console.error(err);
    $('#err').hidden = false; $('#err').textContent = 'Le jeu n’a pas pu démarrer : ' + (err && err.message || err); $('#s-load').hidden = true;
  }
})();
}
</script>
<!--ARTIFACT-END-->
</body>
</html>
