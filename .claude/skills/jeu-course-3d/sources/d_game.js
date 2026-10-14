
/* ================== Jeu : rendu final, garage, course ================== */
{
const SAVE_KEY = 'nitrocanyon.v1';
let SV = { car: 'kitsune', paint: null, diff: 1, best: {}, quality: null, sfx: true, music: true };
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
let WORLD, FX, AUDIO, HUD, GARAGE = null;
const G = { mode: 'load', time: 0, paused: false, camMode: 0, perfT: 0, perfN: 0, perfAcc: 0, perfDone: false };

/* ---------- Post-traitement : flou de vitesse, étalonnage, halo ---------- */
const POST = { on: false };
const FINAL_FRAG = `
uniform sampler2D tColor; uniform float blur, ca, vig, heat; varying vec2 vUv;
void main(){
  vec2 c = vec2(0.5, 0.55); vec2 d = vUv - c; float r = length(d);
  float amt = blur * smoothstep(0.1, 0.62, r);
  vec3 col = vec3(0.0);
  for (int i = 0; i < 10; i++){ float t = float(i) / 9.0; col += texture2D(tColor, vUv - d * amt * 0.085 * t).rgb; }
  col /= 10.0;
  vec2 o = d * (ca * 0.006 * r + amt * 0.004);
  col.r = mix(col.r, texture2D(tColor, vUv + o).r, 0.7); col.b = mix(col.b, texture2D(tColor, vUv - o).b, 0.7);
  col *= vec3(1.05, 1.0, 0.93);
  float l = dot(col, vec3(0.299, 0.587, 0.114)); col = mix(vec3(l), col, 1.12);
  col = mix(col, col * vec3(1.08, 0.98, 0.88), heat * 0.4);
  col *= 1.0 - smoothstep(0.42, 1.05, r) * vig;
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
  POST.mat = new THREE.ShaderMaterial({ uniforms: { tColor: { value: null }, blur: { value: 0 }, ca: { value: 0.4 }, vig: { value: 0.45 }, heat: { value: 0.5 } }, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }', fragmentShader: FINAL_FRAG, depthTest: false, depthWrite: false });
  POST.quad = new FullScreenQuad(POST.mat);
}
function renderFrame(dt, fx){
  if (!POST.on){ renderer.setRenderTarget(null); renderer.render(scene, camera); return; }
  renderer.setRenderTarget(POST.rt); renderer.render(scene, camera);
  const u = POST.mat.uniforms; u.tColor.value = POST.rt.texture; u.blur.value = fx.blur; u.ca.value = 0.35 + fx.blur * 0.8;
  renderer.setRenderTarget(POST.rtB); POST.quad.render(renderer);
  POST.bloom.strength = 0.3 + fx.bloom; POST.bloom.render(renderer, null, POST.rtB, dt, false);
  POST.out.render(renderer, null, POST.rtB);
}
function resize(){
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, Q.pr));
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  if (POST.on){ const s = renderer.getDrawingBufferSize(new THREE.Vector2()); POST.rt.setSize(s.x, s.y); POST.rtB.setSize(s.x, s.y); POST.bloom.setSize(s.x, s.y); }
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
const worldCtx = () => ({ ground: WORLD.ground, track: WORLD.track, cars: CARS.map(c => c.V) });

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
  if (e.code === 'KeyR' && G.mode === 'race' && PLAYER && !PLAYER.finished) respawn(PLAYER);
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
  const gy = WORLD.ground(_v.x, _v.z, V.s).y + 0.7; if (_v.y < gy) _v.y = gy;
  if (snap || G.camMode === 2) CAM.pos.copy(_v); else { CAM.pos.x = damp(CAM.pos.x, _v.x, 14, dt); CAM.pos.z = damp(CAM.pos.z, _v.z, 14, dt); CAM.pos.y = damp(CAM.pos.y, _v.y, 8, dt); }
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
  const best = SV.best[SV.car];
  $('#best').innerHTML = best ? `Record avec cette voiture : <b>${fmt(best)}</b>` : 'Pas encore de record avec cette voiture.';
}
function pickCar(d){ const ids = TYPE_IDS(); SV.car = ids[(ids.indexOf(SV.car) + d + ids.length) % ids.length]; SV.paint = null; save(); buildShowcase(); renderGarageUI(); AUDIO.one('ui'); }
function enterGarage(){
  G.mode = 'garage'; clearCars(); if (FX) FX.clear(); HUD.show(false); $('#touch').hidden = true;
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
$('#btn-race').onclick = () => startRace();

/* ---------- Course ---------- */
const R = { t: 0, state: 'intro', count: 0, finishOrder: [], radioDone: {} };
const fmt = t => { if (!isFinite(t)) return '--:--.--'; const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s < 10 ? '0' : ''}${s.toFixed(2)}`; };
function startRace(){
  AUDIO.init(); AUDIO.setSfx(SV.sfx); AUDIO.setMusic(SV.music); AUDIO.one('ui');
  if (showcase){ scene.remove(showcase.root); if (showcase.dispose) showcase.dispose(); showcase = null; }
  leaveGarage(); CAM.free = false;
  clearCars(); FX.clear();
  const slots = [0, 1, 2, 3, 4, 5], playerSlot = 3;
  let ri = 0;
  slots.forEach(i => {
    const isP = i === playerSlot, rv = isP ? null : RIVALS[ri++];
    const car = makeCar(isP ? SV.car : rv.type, isP ? SV.paint : rv.paint, isP ? 'Toi' : rv.name, isP, i);
    const sl = WORLD.track.startSlot(i); car.V.reset(sl.x, sl.y, sl.z, sl.heading);
    const pr = WORLD.track.project(sl.x, sl.z); car.prevS = pr.s; car.lap = pr.s > WORLD.track.length / 2 ? -1 : 0; car.V.s = pr.s;
    if (isP) PLAYER = car;
  });
  Object.assign(R, { t: 0, state: 'intro', count: 3.999, finishOrder: [], radioDone: {}, raceTime: 0 });
  $('#s-garage').hidden = true; $('#s-results').hidden = true; $('#s-pause').hidden = true;
  HUD.show(true); $('#touch').hidden = !document.body.classList.contains('touchmode');
  G.mode = 'race'; G.paused = false; CAM.orbit = 0; CAM.yaw = PLAYER.V.heading; camera.clearViewOffset();
  AUDIO.music(0.55);
  radio('Kiko', 'Le désert est à nous ce soir. Fais-leur manger ta poussière.', 'start');
  setTimeout(() => radio('Vega', 'Rentre au garage, petit. Le canyon, c’est chez moi.', 'taunt'), 3600);
}
function radio(who, text, key){ if (key && R.radioDone[key]) return; if (key) R.radioDone[key] = true; HUD.radio(who, text, 4200); }
function respawn(car){
  const o = WORLD.track.sample(car.V.s); car.V.reset(o.x, o.y, o.z, Math.atan2(o.tx, o.tz)); car.V.vel.set(0, 0, 0); CAM.shake = 0.2;
}
function updateProgress(car){
  const L = WORLD.track.length, s = car.V.s;
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
  radio(pos === 1 ? 'Kiko' : 'Vega', pos === 1 ? 'Victoire ! Le désert de Fortune connaît ton nom maintenant.' : pos <= 3 ? 'Pas mal pour un débutant. La prochaine fois, je ne te laisserai même pas ma poussière.' : 'Retourne t’entraîner. Le canyon ne pardonne pas.', 'end');
  if (!SV.best[SV.car] || PLAYER.finishTime < SV.best[SV.car]){ SV.best[SV.car] = PLAYER.finishTime; save(); }
  setTimeout(showResults, 3200);
}
function showResults(){
  // Temps estimés pour ceux qui n'ont pas fini
  const L = WORLD.track.length;
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
  const track = WORLD.track, L = track.length, ctxW = worldCtx();
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
    if (!racing) input = { throttle: car.isPlayer ? 0 : 0, brake: 1, steer: 0, handbrake: false, nitro: false };
    else if (car.isPlayer && !car.finished) input = readInput(dt);
    else if (car.isPlayer) input = { throttle: 0.4, brake: 0, steer: 0, handbrake: false, nitro: false };
    if (!car.isPlayer || car.finished){
      const ai = car.ai || (car.ai = createAI(car.V, { skill: 0.8, lane: 0, name: car.name }));
      const aiIn = ai.update(dt, ctxW, { myProgress: car.progress, playerProgress: PLAYER.progress, leaderProgress: leader });
      if (racing) input = aiIn;
    }
    if (car.isPlayer && racing) readInputSide(car, input);
    car.V.update(dt, input, ctxW);
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
  const rough = V.surface === 'dirt' || V.surface === 'sand', shoulder = V.surface === 'shoulder';
  for (let w = 2; w < 4; w++){
    _wp.copy(m.wheelsLocal[w]); m.root.localToWorld(_wp);
    _vel.copy(V.vel).multiplyScalar(-0.15); _vel.y += 0.8;
    if ((rough || shoulder) && sp > 3) FX.dust(_wp, _vel, clamp(sp / 40, 0.2, 1) * (rough ? 1 : 0.45), V.surface === 'dirt' ? '#c79f75' : PAL.sand);
    if (!rough && V.slip > 0.28 && sp > 6){ FX.smoke(_wp, _vel, clamp(V.slip * 1.4, 0, 1)); }
  }
  if (!rough && (V.slip > 0.3 || (car.lastBrake && V.throttle < 0.05 && sp > 20 && V.slip > 0.12))) for (let w = 0; w < 4; w++){ _wp.copy(m.wheelsLocal[w]); m.root.localToWorld(_wp); FX.skid(car.idx * 4 + w, _wp.x, _wp.y + 0.02, _wp.z, V.heading, clamp(V.slip * 1.5, 0.3, 1)); }
  if (V.nitroOn){ _dir.set(-Math.sin(V.heading), 0, -Math.cos(V.heading)); m.exhausts.forEach(e => { _wp.copy(e); m.root.localToWorld(_wp); FX.flame(_wp, _dir, 1); }); }
  if (V.hitWall > 0.6 || V.hitCar > 0.6){ _wp.copy(V.pos); _wp.y += 0.5; _dir.set(rand(-1, 1), 1, rand(-1, 1)); FX.sparks(_wp, _dir, clamp((V.hitWall + V.hitCar) / 4, 0.3, 1)); }
}

/* ---------- Pause ---------- */
function togglePause(){
  if (G.mode !== 'race') return;
  G.paused = !G.paused; $('#s-pause').hidden = !G.paused; syncPause();
  if (G.paused) AUDIO.stopAll && AUDIO.setSfx(false); else AUDIO.setSfx(SV.sfx);
}
function syncPause(){
  document.querySelectorAll('#quality button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.q === qName)));
  $('#btn-sound').textContent = 'Son : ' + (SV.sfx ? 'oui' : 'non'); $('#btn-music').textContent = 'Musique : ' + (SV.music ? 'oui' : 'non');
}
$('#btn-pause').onclick = () => togglePause();
$('#btn-resume').onclick = () => togglePause();
$('#btn-restart').onclick = () => { $('#s-pause').hidden = true; startRace(); };
$('#btn-garage').onclick = () => enterGarage();
document.querySelectorAll('#quality button').forEach(b => b.onclick = () => setQuality(b.dataset.q));
$('#btn-sound').onclick = () => { SV.sfx = !SV.sfx; save(); syncPause(); };
$('#btn-music').onclick = () => { SV.music = !SV.music; save(); AUDIO.setMusic(SV.music); syncPause(); };
document.addEventListener('visibilitychange', () => { if (document.hidden && G.mode === 'race' && !G.paused) togglePause(); });
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
      camera.lookAt(V.pos.x, V.pos.y + 0.8, V.pos.z); if (camera.fov !== 55){ camera.fov = 55; camera.updateProjectionMatrix(); }
      CAM.pos.copy(camera.position); CAM.yaw = V.heading;
    } else chaseCamera(PLAYER, dt, false);
    updateSun(PLAYER.V.pos);
    const s01 = clamp(Math.abs(PLAYER.V.speed) / 80, 0, 1);
    blur = Q.post ? s01 * s01 * 0.9 + (PLAYER.V.nitroOn ? 0.35 : 0) : 0; bloom = PLAYER.V.nitroOn ? 0.08 : 0;
  }
  if (WORLD) WORLD.update(dt, camera.position);
  if (glare) glare.position.copy(camera.position).addScaledVector(SUN_DIR, 6000);
  if (AUDIO) AUDIO.update(dt);
  renderFrame(dt, { blur, bloom });
  perfWatch(dt);
  requestAnimationFrame(frame);
}
function perfWatch(dt){
  if (G.mode !== 'race' || G.paused || G.perfDone || qName === 'basse') return;
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
    WORLD = buildWorld(p => { $('#load-bar').style.width = (15 + p * 65) + '%'; });
    await step(82, 'Préparation des voitures…');
    FX = createFX(); AUDIO = createAudio(); HUD = createHUD(); HUD.setTrack(WORLD.track.polyline(400));
    if (typeof buildGarage === 'function'){ await step(86, 'Allumage des néons du garage…'); GARAGE = buildGarage(); }
    buildGlare(); setupPost(); resize();
    if (!CAR_TYPES[SV.car] || (!SV.paint && CAR_TYPES.hyperion)) SV.car = CAR_TYPES.hyperion ? 'hyperion' : Object.keys(CAR_TYPES)[0];
    enterGarage();
    await step(95, 'Compilation des shaders…');
    try { renderer.compile(scene, camera); } catch (e) {}
    await step(100);
    $('#s-load').hidden = true;
    requestAnimationFrame(frame);
    window.__nc = { G, R, CARS, get PLAYER(){ return PLAYER; }, WORLD, startRace, enterGarage, setQuality, CAM, IN };
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
