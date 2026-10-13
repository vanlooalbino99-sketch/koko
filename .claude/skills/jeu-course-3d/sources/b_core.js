<script type="module">
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

window.__ncBooted = true;
const $ = s => document.querySelector(s);
const tick = () => new Promise(r => setTimeout(r, 0));

/* ================== Outils (socle commun) ================== */
function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let rng = mulberry32(777);
const rand = (a = 0, b = 1) => a + rng() * (b - a);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const wrapAng = a => { a = (a + Math.PI) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return a - Math.PI; };
const dampAng = (a, b, l, dt) => a + wrapAng(b - a) * (1 - Math.exp(-l * dt));
function hash2(x, y){ let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967295; }
function hash3(x, y, z){ let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1440662683); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967295; }
function noise2(x, y){ const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return lerp(lerp(hash2(xi, yi), hash2(xi + 1, yi), u), lerp(hash2(xi, yi + 1), hash2(xi + 1, yi + 1), u), v); }
function noise3(x, y, z){ const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const a = lerp(lerp(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u), lerp(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u), v);
  const b = lerp(lerp(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u), lerp(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u), v); return lerp(a, b, w); }
function fbm2(x, y, oct = 4){ let s = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++){ s += noise2(x * f + i * 17.3, y * f - i * 9.1) * a; n += a; a *= 0.5; f *= 2.03; } return s / n; }
function ridged2(x, y, oct = 4){ let s = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++){ const v = 1 - Math.abs(noise2(x * f + i * 31.7, y * f + i * 5.3) * 2 - 1); s += v * v * a; n += a; a *= 0.5; f *= 2.1; } return s / n; }
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const col = hex => new THREE.Color(hex);
function cnv(w, h){ const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
let MAXANI = 8;
function ctex(c, o = {}){ const t = new THREE.CanvasTexture(c); if (o.srgb !== false) t.colorSpace = THREE.SRGBColorSpace; if (o.repeat){ t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(o.repeat[0], o.repeat[1]); } t.anisotropy = MAXANI; return t; }
function normalFromHeight(size, hf, strength = 2){
  const [c, g] = cnv(size, size), img = g.createImageData(size, size), hs = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) hs[y * size + x] = hf(x, y);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++){
    const l = hs[y * size + (x + size - 1) % size], r = hs[y * size + (x + 1) % size], u = hs[((y + size - 1) % size) * size + x], d = hs[((y + 1) % size) * size + x];
    let nx = (l - r) * strength, ny = (d - u) * strength, nz = 1; const L = Math.hypot(nx, ny, nz);
    const i = (y * size + x) * 4; img.data[i] = (nx / L * 0.5 + 0.5) * 255; img.data[i + 1] = (ny / L * 0.5 + 0.5) * 255; img.data[i + 2] = (nz / L * 0.5 + 0.5) * 255; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0); return c;
}
const MATS = new Map();
function stdMat(hex, o = {}){
  const key = hex + JSON.stringify(Object.keys(o).map(k => [k, o[k] && o[k].uuid ? o[k].uuid : o[k]]));
  if (!MATS.has(key)) MATS.set(key, new THREE.MeshStandardMaterial(Object.assign({ color: col(hex), roughness: 0.85, metalness: 0 }, o)));
  return MATS.get(key);
}

/* ================== Qualité, palette, soleil ================== */
const QUAL = {
  basse:   { name: 'basse',   pr: 1,    shadow: 1024, msaa: 0, post: false, particles: 0.5, props: 0.45, grass: 0.35 },
  moyenne: { name: 'moyenne', pr: 1.25, shadow: 2048, msaa: 0, post: true,  particles: 0.8, props: 0.75, grass: 0.7 },
  haute:   { name: 'haute',   pr: 2,    shadow: 4096, msaa: 4, post: true,  particles: 1,   props: 1,    grass: 1 },
};
const isTouch = matchMedia('(pointer: coarse)').matches;
let qName = 'haute';
try { const sv = JSON.parse(localStorage.getItem('nitrocanyon.v1') || '{}'); if (QUAL[sv.quality]) qName = sv.quality; else if (isTouch) qName = 'moyenne'; } catch (e) { if (isTouch) qName = 'moyenne'; }
let Q = QUAL[qName];
// Heure dorée : soleil bas devant la ligne droite de départ (+Z), légèrement à gauche
const SUN_DIR = new THREE.Vector3(0.38, 0.085, 0.92).normalize();
const PAL = { sand: '#d9b98c', sandDark: '#b48d63', rockRed: '#a4502c', rockOrange: '#c77a45', rockPale: '#e3b787', asphalt: '#38383b', lineYellow: '#e6b422', lineWhite: '#efebe2', shrub: '#6e7840', shrubDry: '#9b8a55', fog: '#dcc1a0' };

/* ================== Moteur : rendu, ciel, lumière ================== */
let renderer, scene, camera, sky, sunLight, hemiLight;
function initEngine(canvas){
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !Q.post, powerPreference: 'high-performance' });
  if (!renderer.capabilities.isWebGL2) throw new Error('WebGL2 indisponible');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, Q.pr));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.62;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  MAXANI = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.15, 9000);
  // Ciel physique (diffusion de Rayleigh/Mie)
  sky = new Sky(); sky.scale.setScalar(12000);
  const u = sky.material.uniforms;
  u.turbidity.value = 10; u.rayleigh.value = 2.6; u.mieCoefficient.value = 0.009; u.mieDirectionalG.value = 0.88; u.sunPosition.value.copy(SUN_DIR);
  scene.add(sky);
  // Reflets d'environnement calculés depuis ce même ciel (peinture, vitres, chrome)
  const pm = new THREE.PMREMGenerator(renderer), envScene = new THREE.Scene(), sk2 = new Sky(); sk2.scale.setScalar(10000);
  Object.keys(u).forEach(k => { if (sk2.material.uniforms[k] && u[k].value !== undefined){ const v = u[k].value; sk2.material.uniforms[k].value = v && v.clone ? v.clone() : v; } });
  envScene.add(sk2);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(9000, 32), new THREE.MeshBasicMaterial({ color: col(PAL.sandDark).multiplyScalar(0.55) })); ground.rotation.x = -Math.PI / 2; ground.position.y = -5; envScene.add(ground);
  scene.environment = pm.fromScene(envScene, 0.03, 1, 20000).texture; pm.dispose();
  scene.fog = new THREE.FogExp2(col('#e2b88e'), 0.00062);
  hemiLight = new THREE.HemisphereLight(col('#c6d3ea'), col('#a8774a'), 0.8);
  sunLight = new THREE.DirectionalLight(col('#ffc98f'), 3.6);
  sunLight.castShadow = true;
  setupShadow();
  scene.add(hemiLight, sunLight, sunLight.target);
  return { renderer, scene, camera };
}
function setupShadow(){
  sunLight.shadow.mapSize.set(Q.shadow, Q.shadow);
  if (sunLight.shadow.map){ sunLight.shadow.map.dispose(); sunLight.shadow.map = null; }
  const c = sunLight.shadow.camera, S = 70; c.left = -S; c.right = S; c.top = S; c.bottom = -S; c.near = 5; c.far = 600; c.updateProjectionMatrix();
  sunLight.shadow.bias = -0.0003; sunLight.shadow.normalBias = 0.04;
}
// L'ombre du soleil suit le point d'intérêt (voiture du joueur), alignée sur les texels pour ne pas scintiller
function updateSun(focus){
  const tex = 140 / Q.shadow, x = Math.round(focus.x / tex) * tex, z = Math.round(focus.z / tex) * tex;
  sunLight.target.position.set(x, focus.y, z); sunLight.position.set(x, focus.y, z).addScaledVector(SUN_DIR, 300);
  sky.position.copy(camera.position);
}
