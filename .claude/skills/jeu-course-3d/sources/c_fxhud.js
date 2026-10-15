/* ================== Effets : particules GPU et traces de pneus ================== */
// Atlas 2×2 de bouffées de poussière (alpha = densité, rouge = détail de relief)
function fxhPuffAtlas(){
  const S = 512, T = 256, [c, g] = cnv(S, S), img = g.createImageData(S, S), d = img.data;
  for (let k = 0; k < 4; k++){
    const ox = (k % 2) * T, oy = (k >> 1) * T;
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++){
      const dx = (x - T / 2) / (T / 2), dy = (y - T / 2) / (T / 2), r = Math.sqrt(dx * dx + dy * dy);
      const n = fbm2(x / 30 + k * 13.7, y / 30 - k * 7.1, 5), b = clamp(1 - r, 0, 1), sb = b * b * (3 - 2 * b);
      const a = clamp(sb * 1.5 * (n * 2.3 - 0.62) + sb * 0.18, 0, 1) * smooth(0.98, 0.75, r);
      const i = ((oy + y) * S + ox + x) * 4;
      d[i] = 90 + 165 * clamp((n - 0.3) * 1.8, 0, 1); d[i + 1] = d[i]; d[i + 2] = d[i]; d[i + 3] = a * 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = ctex(c, { srgb: false }); t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; return t;
}

function createFX(){
  const gl = renderer.getContext();
  let maxPt = 256; try { const r = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE); if (r && r[1]) maxPt = r[1]; } catch (e) {}
  let time = 0;
  const _v2 = new THREE.Vector2();
  const U = {
    uTime: { value: 0 }, uScale: { value: 500 }, uMaxPt: { value: Math.min(maxPt, 900) },
    uSunV: { value: V3(0, 0.3, 1) }, uSunCol: { value: col('#ffffff') }, uAmb: { value: col('#888888') },
    uMap: { value: fxhPuffAtlas() },
  };
  const setCam = (r, s, cam) => {
    const rt = r.getRenderTarget(), h = rt ? rt.height : r.getDrawingBufferSize(_v2).y;
    U.uScale.value = h * 0.5 * cam.projectionMatrix.elements[5];
    U.uSunV.value.copy(SUN_DIR).transformDirection(cam.matrixWorldInverse);
  };
  const COMMON_V = `
    uniform float uTime, uScale, uMaxPt; uniform vec3 uSunV;
    attribute vec3 aV; attribute vec4 aT, aC, aM;`;
  // Poussière et fumée : mélange normal, éclairées par le soleil doré (diffusion vers l'avant)
  const softV = COMMON_V + `
    attribute vec2 aK;
    varying vec4 vC; varying float vRot, vTile, vScat;
    void main(){
      float age = uTime - aT.x, t = age / aT.y;
      if (t < 0.0 || t >= 1.0){ gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
      float dr = aM.x;
      vec3 p = position + aV * (1.0 - exp(-dr * age)) / dr;
      p.y += 0.5 * aM.y * age * age;
      float ph = aM.z * 3.0;
      p.x += sin(age * 1.7 + ph) * 0.35 * age; p.z += cos(age * 1.3 + ph * 1.3) * 0.35 * age;
      p.y = max(p.y, position.y - 0.05);
      float size = mix(aT.z, aT.w, 1.0 - pow(1.0 - t, 2.6));
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      float d = -mv.z;
      if (d < 0.25){ gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
      float ps = size * uScale / d;
      // rapproche le sprite de la caméra (le long du rayon) pour éviter la coupure nette avec le sol
      float pull = min(size * 0.45, d * 0.6);
      mv.xyz *= (d - pull) / d;
      gl_Position = projectionMatrix * mv;
      gl_PointSize = min(ps, uMaxPt);
      float fin = smoothstep(0.0, 0.07, t), fout = pow(1.0 - t, 1.5);
      vC = vec4(aC.rgb, aC.a * fin * fout * smoothstep(size * 0.25, size * 1.3 + 0.5, d) * (ps > uMaxPt ? uMaxPt / ps : 1.0));
      vRot = aM.z + aM.w * age; vTile = aK.x;
      vScat = pow(max(dot(normalize(mv.xyz), uSunV), 0.0), 3.0) * 1.4;
    }`;
  const softF = `
    uniform sampler2D uMap; uniform vec3 uSunV, uSunCol, uAmb;
    varying vec4 vC; varying float vRot, vTile, vScat;
    void main(){
      vec2 q = gl_PointCoord - 0.5;
      float cs = cos(vRot), sn = sin(vRot);
      vec2 r = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y);
      if (dot(r, r) > 0.25) discard;
      vec2 tile = vec2(mod(vTile, 2.0), floor(vTile * 0.5));
      vec4 tx = texture2D(uMap, (r + 0.5 + tile) * 0.5);
      float a = tx.a * vC.a;
      if (a < 0.003) discard;
      vec2 nq = q * 2.0; nq.y = -nq.y;
      vec3 n = normalize(vec3(nq * 1.15, sqrt(max(0.0, 1.0 - dot(nq, nq))) + 0.3));
      float lam = max(dot(n, uSunV), 0.0) * 0.75 + 0.25;
      float occ = mix(0.5, 1.0, tx.r);
      vec3 lit = vC.rgb * (uAmb * mix(0.75, 1.0, tx.r) + uSunCol * lam * occ) + vC.rgb * uSunCol * vScat * (1.5 - tx.a) * occ;
      gl_FragColor = vec4(lit, a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`;
  // Étincelles et flammes de nitro : additif, très lumineux (pris par le bloom)
  const glowV = COMMON_V + `
    varying vec3 vCol; varying float vA;
    void main(){
      float age = uTime - aT.x, t = age / aT.y;
      if (t < 0.0 || t >= 1.0){ gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
      float dr = aM.x;
      vec3 p = position + aV * (1.0 - exp(-dr * age)) / dr;
      p.y += 0.5 * aM.y * age * age;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      float d = -mv.z;
      if (d < 0.15){ gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
      gl_Position = projectionMatrix * mv;
      float size = mix(aT.z, aT.w, t), ps = size * uScale / d;
      gl_PointSize = clamp(ps, 2.0, uMaxPt);
      float e = ps < 2.0 ? ps * 0.5 : 1.0;
      if (aM.z > 0.5){
        vCol = mix(vec3(0.08, 0.3, 1.9), vec3(1.7, 0.45, 0.05), smoothstep(0.35, 0.9, t)) * aC.a;
        vA = smoothstep(0.0, 0.12, t) * (1.0 - t) * e;
      } else {
        vCol = mix(aC.rgb, aC.rgb * vec3(0.9, 0.3, 0.08), t) * aC.a;
        vA = (1.0 - t * t) * e;
      }
    }`;
  const glowF = `
    varying vec3 vCol; varying float vA;
    void main(){
      vec2 q = gl_PointCoord * 2.0 - 1.0; float r2 = dot(q, q);
      if (r2 > 1.0) discard;
      float g = exp(-r2 * 3.5) * (1.0 - r2) + exp(-r2 * 22.0) * 0.8;
      gl_FragColor = vec4(vCol, g * vA);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`;

  function makePool(cap, glow){
    const g = new THREE.BufferGeometry(), A = {};
    const add = (name, n) => { const arr = new Float32Array(cap * n), at = new THREE.BufferAttribute(arr, n); at.setUsage(THREE.DynamicDrawUsage); g.setAttribute(name, at); A[name] = arr; return at; };
    const atts = [add('position', 3), add('aV', 3), add('aT', 4), add('aC', 4), add('aM', 4)];
    if (!glow) atts.push(add('aK', 2));
    for (let i = 0; i < cap; i++){ A.aT[i * 4] = -1e9; A.aT[i * 4 + 1] = 1; A.aM[i * 4] = 1; }
    g.boundingSphere = new THREE.Sphere(V3(), 1e7);
    const mat = new THREE.ShaderMaterial({ uniforms: U, vertexShader: glow ? glowV : softV, fragmentShader: glow ? glowF : softF, transparent: true, depthWrite: false, blending: glow ? THREE.AdditiveBlending : THREE.NormalBlending });
    const pts = new THREE.Points(g, mat); pts.frustumCulled = false; pts.renderOrder = glow ? 12 : 11;
    pts.onBeforeRender = setCam; scene.add(pts);
    return { cap, A, atts, pts, idx: 0, n: 0, start: 0 };
  }
  const SOFT = makePool(8192, false), GLOW = makePool(2048, true);

  // Écrit une particule dans l'anneau
  function spawn(P, x, y, z, vx, vy, vz, life, s0, s1, r, g, b, a, drag, grav, m3, m4, tile){
    const i = P.idx, A = P.A; P.idx = (i + 1) % P.cap; if (P.n === 0) P.start = i; P.n++;
    A.position[i * 3] = x; A.position[i * 3 + 1] = y; A.position[i * 3 + 2] = z;
    A.aV[i * 3] = vx; A.aV[i * 3 + 1] = vy; A.aV[i * 3 + 2] = vz;
    A.aT[i * 4] = time; A.aT[i * 4 + 1] = life; A.aT[i * 4 + 2] = s0; A.aT[i * 4 + 3] = s1;
    A.aC[i * 4] = r; A.aC[i * 4 + 1] = g; A.aC[i * 4 + 2] = b; A.aC[i * 4 + 3] = a;
    A.aM[i * 4] = Math.max(0.05, drag); A.aM[i * 4 + 1] = grav; A.aM[i * 4 + 2] = m3; A.aM[i * 4 + 3] = m4;
    if (A.aK){ A.aK[i * 2] = tile; A.aK[i * 2 + 1] = 0; }
  }
  // N'envoie au GPU que la plage écrite pendant l'image
  function flush(P, cap, atts, n, start){
    for (const at of atts){
      const s = at.itemSize;
      if (n < cap){
        if (start + n <= cap) at.addUpdateRange(start * s, n * s);
        else { at.addUpdateRange(start * s, (cap - start) * s); at.addUpdateRange(0, (start + n - cap) * s); }
      }
      at.needsUpdate = true;
    }
  }
  // Nombre d'émissions (arrondi aléatoire) selon la qualité
  const cnt = x => { x *= Q.particles; const f = Math.floor(x); return f + (Math.random() < x - f ? 1 : 0); };
  const R = Math.random, _c = new THREE.Color();

  function dust(pos, vel, k = 1, colorHex){
    k = clamp(k, 0, 1); if (k <= 0) return;
    _c.set(colorHex || PAL.sand);
    const n = cnt(1 + 3 * k);
    for (let j = 0; j < n; j++){
      const v = 0.98 + R() * 0.24;
      spawn(SOFT, pos.x + (R() - 0.5) * 0.6, pos.y + 0.1 + R() * 0.2, pos.z + (R() - 0.5) * 0.6,
        vel.x * (0.5 + R() * 0.7) + (R() - 0.5) * 5 * k, Math.max(0.3, vel.y) * (0.6 + R() * 0.9) + R() * 2.2 * k, vel.z * (0.5 + R() * 0.7) + (R() - 0.5) * 5 * k,
        (1.6 + R() * 2) * (0.6 + 0.6 * k), 0.45 + R() * 0.5, (2.6 + R() * 3) * (0.55 + 0.7 * k),
        _c.r * v, _c.g * v, _c.b * v, (0.26 + R() * 0.2) * (0.45 + 0.55 * k), 1.7, 0.18, R() * 6.28, (R() - 0.5) * 0.9, (R() * 4) | 0);
    }
    // grosses volutes qui donnent du volume au nuage
    if (R() < k * 0.6 * Q.particles){
      spawn(SOFT, pos.x + (R() - 0.5) * 1.2, pos.y + 0.6 + R() * 0.5, pos.z + (R() - 0.5) * 1.2,
        vel.x * 0.35 + (R() - 0.5) * 3, 0.7 + R() * 1.1, vel.z * 0.35 + (R() - 0.5) * 3,
        3.4 + R() * 2.4, 1.4, (7 + R() * 4.5) * (0.6 + 0.4 * k), _c.r * 1.1, _c.g * 1.1, _c.b * 1.1, 0.13 + R() * 0.08, 1.1, 0.12, R() * 6.28, (R() - 0.5) * 0.3, (R() * 4) | 0);
    }
  }
  function smoke(pos, vel, k = 1){
    k = clamp(k, 0, 1); if (k <= 0) return;
    const n = cnt(0.7 + 2.2 * k);
    for (let j = 0; j < n; j++){
      const v = 0.8 + R() * 0.12;
      spawn(SOFT, pos.x + (R() - 0.5) * 0.5, pos.y + 0.15 + R() * 0.2, pos.z + (R() - 0.5) * 0.5,
        vel.x * 0.4 + (R() - 0.5) * 2, 0.5 + R() * 1.1, vel.z * 0.4 + (R() - 0.5) * 2,
        (2.4 + R() * 2.2) * (0.7 + 0.6 * k), 0.55 + R() * 0.35, (4 + R() * 3.5) * (0.7 + 0.7 * k),
        v, v * 0.985, v * 0.97, (0.24 + R() * 0.16) * (0.5 + 0.5 * k), 2, 0.3, R() * 6.28, (R() - 0.5) * 1.2, (R() * 4) | 0);
    }
    // gros nuage blanc qui reste derrière la voiture pendant un long dérapage
    if (R() < k * 0.55 * Q.particles){
      const v = 0.86 + R() * 0.08;
      spawn(SOFT, pos.x + (R() - 0.5) * 1.4, pos.y + 0.5 + R() * 0.5, pos.z + (R() - 0.5) * 1.4,
        vel.x * 0.25 + (R() - 0.5) * 2.4, 0.6 + R() * 0.9, vel.z * 0.25 + (R() - 0.5) * 2.4,
        4.5 + R() * 3, 1.6, (8 + R() * 5) * (0.6 + 0.4 * k), v, v * 0.99, v * 0.98, 0.16 + R() * 0.08, 1.2, 0.12, R() * 6.28, (R() - 0.5) * 0.4, (R() * 4) | 0);
    }
  }
  function sparks(pos, dir, k = 1){
    k = clamp(k, 0, 1);
    const n = Math.max(1, cnt(4 + 18 * k)), l = Math.hypot(dir.x, dir.y, dir.z) || 1;
    for (let j = 0; j < n; j++){
      const s = 3 + R() * 9 * (0.5 + k), u = R() * 2 - 1, th = R() * 6.283, w = Math.sqrt(1 - u * u);
      spawn(GLOW, pos.x, pos.y, pos.z,
        dir.x / l * s + w * Math.cos(th) * 4, dir.y / l * s + Math.abs(u) * 3, dir.z / l * s + w * Math.sin(th) * 4,
        0.3 + R() * 0.6, 0.08 + R() * 0.06, 0.04, 5, 2.2, 0.55, 1, 0.9, -11, 0, 0, 0);
    }
  }
  function flame(pos, dir, k = 1){
    k = clamp(k, 0, 1); if (k <= 0) return;
    const l = Math.hypot(dir.x, dir.y, dir.z) || 1, dx = dir.x / l, dy = dir.y / l, dz = dir.z / l;
    for (let j = 0; j < 3; j++){
      const o = R() * 0.3, s = 7 + R() * 7;
      spawn(GLOW, pos.x + dx * o, pos.y + dy * o, pos.z + dz * o,
        dx * s + (R() - 0.5) * 0.8, dy * s + (R() - 0.2) * 0.8, dz * s + (R() - 0.5) * 0.8,
        0.07 + R() * 0.07, 0.16 + R() * 0.06, 0.45 + R() * 0.25, 0, 0, 0, 0.9 * k, 3, 1.5, 1, 0);
    }
    // cœur bleu fixe à la sortie d'échappement
    spawn(GLOW, pos.x, pos.y, pos.z, dx * 2, dy * 2, dz * 2, 0.04, 0.2, 0.22, 0, 0, 0, 0.8 * k, 1, 0, 1, 0);
  }

  /* --- Traces de pneus : anneau d'instances posées au sol --- */
  const SK = 4000, skGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const skAttr = new THREE.InstancedBufferAttribute(new Float32Array(SK * 2), 2); skAttr.setUsage(THREE.DynamicDrawUsage);
  for (let i = 0; i < SK; i++) skAttr.array[i * 2] = -1e9;
  skGeo.setAttribute('aSk', skAttr);
  const skU = { uTime: U.uTime, uLife: { value: 26 } };
  const skMat = new THREE.ShaderMaterial({
    uniforms: skU, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
    vertexShader: `
      attribute vec2 aSk; uniform float uTime, uLife; varying vec2 vUv; varying float vA;
      void main(){
        vUv = uv; float age = uTime - aSk.x;
        vA = aSk.y * (1.0 - smoothstep(uLife * 0.45, uLife, age));
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec2 vUv; varying float vA;
      void main(){
        float x = vUv.x;
        float edge = smoothstep(0.0, 0.2, x) * smoothstep(1.0, 0.8, x);
        float tread = 0.7 + 0.3 * step(0.45, fract(x * 4.0 + 0.1));
        float a = vA * edge * tread * 0.8;
        if (a < 0.004) discard;
        gl_FragColor = vec4(0.012, 0.011, 0.01, a);
        #include <colorspace_fragment>
      }`,
  });
  const skMesh = new THREE.InstancedMesh(skGeo, skMat, SK);
  skMesh.frustumCulled = false; skMesh.renderOrder = 2; skMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = V3(), _s = V3(), _up = V3(0, 1, 0);
  _m.makeScale(0, 0, 0); for (let i = 0; i < SK; i++) skMesh.setMatrixAt(i, _m);
  scene.add(skMesh);
  const skLast = new Map(); let skI = 0, skN = 0, skStart = 0;
  function skid(id, x, y, z, heading, k = 1){
    const L = skLast.get(id);
    if (!L){ skLast.set(id, { x, y, z, t: time }); return; }
    const dx = x - L.x, dz = z - L.z, d = Math.hypot(dx, dz);
    if (time - L.t > 0.15 || d > 4){ L.x = x; L.y = y; L.z = z; L.t = time; return; }
    if (d < 0.22) return; // attend un segment assez long
    const a = Math.atan2(dx, dz), wobble = Math.abs(wrapAng(a - heading)) > 0.6 ? 1.25 : 1; // plus large en glissade
    _p.set((x + L.x) / 2, (y + L.y) / 2, (z + L.z) / 2); _q.setFromAxisAngle(_up, a); _s.set(0.23 * wobble, 1, d + 0.06);
    _m.compose(_p, _q, _s); skMesh.setMatrixAt(skI, _m);
    skAttr.array[skI * 2] = time; skAttr.array[skI * 2 + 1] = clamp(k, 0, 1);
    if (skN === 0) skStart = skI; skN++; skI = (skI + 1) % SK;
    L.x = x; L.y = y; L.z = z; L.t = time;
  }

  function update(dt){
    time += Math.max(0, dt || 0); U.uTime.value = time;
    // éclairage : soleil (Lambert) + ciel ; ramené à l'échelle du MeshStandardMaterial
    U.uSunCol.value.copy(sunLight.color).multiplyScalar(sunLight.intensity / Math.PI * 1.05);
    U.uAmb.value.copy(hemiLight.color).lerp(hemiLight.groundColor, 0.45).multiplyScalar(hemiLight.intensity * 0.8);
    for (const P of [SOFT, GLOW]) if (P.n){ flush(P, P.cap, P.atts, P.n, P.start); P.n = 0; }
    if (skN){ flush(null, SK, [skMesh.instanceMatrix, skAttr], skN, skStart); skN = 0; }
  }
  function clear(){
    for (const P of [SOFT, GLOW]){ for (let i = 0; i < P.cap; i++) P.A.aT[i * 4] = -1e9; P.n = 0; P.atts.forEach(a => a.needsUpdate = true); }
    for (let i = 0; i < SK; i++) skAttr.array[i * 2] = -1e9;
    skAttr.needsUpdate = true; skN = 0; skLast.clear();
  }
  return { dust, smoke, sparks, flame, skid, update, clear, meshes: [SOFT.pts, GLOW.pts, skMesh] };
}

/* ================== Audio synthétisé (Web Audio, aucun fichier) ================== */
function createAudio(){
  let ctx = null, master, sfx, mus, noiseBuf, brownBuf, curve, curveHard, tiresV, windV, padBus, bassBus, gtrIn, leadBus;
  let sfxOn = true, musOn = true, musI = 0, mStep = 0, mNext = 0, prevThr = 0, pops = 0, popT = 0;
  const voices = [], lastOne = {}; let warned = false;
  const warn = e => { if (!warned){ warned = true; console.warn('audio :', e); } };
  const now = () => ctx.currentTime;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const set = (p, v, tc = 0.04) => { try { p.setTargetAtTime(v, now(), tc); } catch (e) {} };
  function mkCurve(k){ const n = 1024, c = new Float32Array(n); for (let i = 0; i < n; i++){ const x = i / (n - 1) * 2 - 1; c[i] = (1 + k) * x / (1 + k * Math.abs(x)); } return c; }
  function build(){
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.2;
    master = ctx.createGain(); master.gain.value = 0.85; master.connect(comp); comp.connect(ctx.destination);
    sfx = ctx.createGain(); sfx.gain.value = sfxOn ? 1 : 0; sfx.connect(master);
    mus = ctx.createGain(); mus.gain.value = musOn ? 0.3 : 0; mus.connect(master);
    const N = ctx.sampleRate * 2; noiseBuf = ctx.createBuffer(1, N, ctx.sampleRate); brownBuf = ctx.createBuffer(1, N, ctx.sampleRate);
    const w = noiseBuf.getChannelData(0), b = brownBuf.getChannelData(0); let l = 0;
    for (let i = 0; i < N; i++){ w[i] = Math.random() * 2 - 1; l = (l + 0.02 * w[i]) / 1.02; b[i] = l * 3.5; }
    curve = mkCurve(6); curveHard = mkCurve(40);
    // crissement : bruit filtré + sifflement vibrant
    tiresV = { g: ctx.createGain() }; tiresV.g.gain.value = 0; tiresV.g.connect(sfx);
    const tn = loopSrc(noiseBuf), tb = filt('bandpass', 2300, 5); tn.connect(tb); tb.connect(tiresV.g);
    const sq = ctx.createGain(); sq.gain.value = 0.25; sq.connect(tiresV.g);
    [880, 1310].forEach((f, i) => { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f; const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 6 + i * 2.3; lg.gain.value = 30; lfo.connect(lg); lg.connect(o.frequency); o.connect(sq); o.start(); lfo.start(); });
    tiresV.bp = tb;
    // vent
    windV = { g: ctx.createGain() }; windV.g.gain.value = 0; windV.g.connect(sfx);
    const wn = loopSrc(noiseBuf), wf = filt('bandpass', 500, 0.6); wn.connect(wf); wf.connect(windV.g); windV.f = wf;
    // bus musicaux
    padBus = filt('lowpass', 1100, 0.7); padBus.connect(mus);
    bassBus = filt('lowpass', 520, 5); bassBus.connect(mus);
    gtrIn = ctx.createGain(); gtrIn.gain.value = 0.6; const sh = ctx.createWaveShaper(); sh.curve = curveHard; const gl = filt('lowpass', 2600, 1), go = ctx.createGain(); go.gain.value = 0.22;
    gtrIn.connect(sh); sh.connect(gl); gl.connect(go); go.connect(mus);
    leadBus = ctx.createGain(); leadBus.gain.value = 0.5; const lf = filt('lowpass', 3200, 2), dl = ctx.createDelay(1), fb = ctx.createGain();
    dl.delayTime.value = 60 / 132 * 0.75; fb.gain.value = 0.32; leadBus.connect(lf); lf.connect(mus); lf.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(mus);
  }
  function filt(type, f, q){ const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
  function loopSrc(buf){ const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.start(0, Math.random() * 1.5); return s; }
  function env(g, t, a, peak, dur){ g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
  function tone(type, f0, f1, dur, vol, dest, t, a = 0.005){
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, a, vol, dur); o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05); return o;
  }
  function noise(dur, vol, type, f0, f1, q, dest, t, a = 0.004, buf = noiseBuf){
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
    const f = filt(type, f0, q); if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain(); env(g, t, a, vol, dur); s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
  }
  // Voix moteur : riche pour le joueur, simple pour les adversaires
  function mkEngine(rich){
    const out = ctx.createGain(); out.gain.value = 0; out.connect(sfx);
    const lp = filt('lowpass', 600, rich ? 3.2 : 1.4), sh = ctx.createWaveShaper(); sh.curve = curve;
    const am = ctx.createGain(); am.gain.value = 0.75; am.connect(sh); sh.connect(lp); lp.connect(out);
    const oscs = [], add = (type, mult, det, g) => { const o = ctx.createOscillator(); o.type = type; o.detune.value = det; const gg = ctx.createGain(); gg.gain.value = g; o.connect(gg); gg.connect(am); o.start(); oscs.push({ o, mult }); return gg; };
    const V = { out, lp, oscs, rich, last: -1 };
    if (rich){
      add('sawtooth', 1, -7, 0.42); add('sawtooth', 1, 8, 0.42); add('square', 0.5, 0, 0.4);
      V.h2 = add('sawtooth', 2, 4, 0); V.h3 = add('square', 3, -5, 0);
      // pulsation des cylindres
      const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 20; lg.gain.value = 0.25; lfo.connect(lg); lg.connect(am.gain); lfo.start(); V.lfo = lfo;
      // grondement d'admission
      const rn = loopSrc(brownBuf), rb = filt('bandpass', 90, 1.3), rg = ctx.createGain(); rg.gain.value = 0; rn.connect(rb); rb.connect(rg); rg.connect(out); V.rb = rb; V.rg = rg;
    } else { add('sawtooth', 1, -5, 0.45); add('square', 1, 9, 0.25); }
    return V;
  }
  function engine(id, p){
    if (!ctx || id < 0 || id > 3 || !p) return;
    const V = voices[id] || (voices[id] = mkEngine(id === 0));
    const r = clamp(p.rpm01 || 0, 0, 1), th = clamp(p.throttle || 0, 0, 1), g = clamp(p.gain == null ? 1 : p.gain, 0, 1.5);
    const f = 44 + r * 255 + id * 4;
    for (const o of V.oscs) set(o.o.frequency, f * o.mult, 0.025);
    if (V.rich){
      set(V.lp.frequency, 260 + r * 2100 + th * 1700, 0.05);
      set(V.h2.gain, 0.08 + r * 0.32 * (0.5 + th * 0.5), 0.05); set(V.h3.gain, r * r * 0.22 * th, 0.05);
      set(V.lfo.frequency, f * 0.5, 0.03); set(V.rb.frequency, 70 + f * 0.9, 0.05); set(V.rg.gain, th * 0.9 * (1 - r * 0.4), 0.06);
      set(V.out.gain, g * (0.16 + th * 0.12 + r * 0.08), 0.05);
      // pétarades au lever de pied à haut régime
      if (prevThr > 0.6 && th < 0.15 && r > 0.55 && !pops) { pops = 2 + (Math.random() * 3 | 0); popT = 0.05; }
      prevThr = th;
    } else {
      set(V.lp.frequency, 300 + r * 1300 + th * 700, 0.06);
      set(V.out.gain, g * (0.05 + th * 0.05 + r * 0.03), 0.08);
    }
    V.last = now();
  }
  function tires(k){ if (!ctx) return; k = clamp(k || 0, 0, 1); set(tiresV.g.gain, k * k * 0.32, 0.05); set(tiresV.bp.frequency, 1900 + k * 900 + Math.random() * 200, 0.08); }
  function wind(k){ if (!ctx) return; k = clamp(k || 0, 0, 1); set(windV.g.gain, k * k * 0.22, 0.2); set(windV.f.frequency, 350 + k * 900, 0.2); }
  const GAP = { scrape: 0.14, impact: 0.3, gear: 0.15, backfire: 0.05, ui: 0.04, nitro: 0.4 };
  function one(name){
    if (!ctx || !sfxOn) return;
    const t = now(); if (lastOne[name] && t - lastOne[name] < (GAP[name] || 0.1)) return; lastOne[name] = t;
    try {
      switch (name){
        case 'countdown': tone('square', 640, 640, 0.22, 0.16, sfx, t); tone('sine', 1280, 1280, 0.18, 0.1, sfx, t); break;
        case 'go': tone('square', 1280, 1280, 0.6, 0.16, sfx, t); tone('sawtooth', 640, 640, 0.6, 0.08, sfx, t); noise(0.7, 0.12, 'highpass', 2000, 6000, 0.7, sfx, t, 0.05); break;
        case 'nitro': noise(1.0, 0.45, 'bandpass', 350, 3200, 1.4, sfx, t, 0.03); tone('sine', 95, 38, 0.6, 0.55, sfx, t); tone('sawtooth', 180, 720, 0.45, 0.06, sfx, t, 0.04); break;
        case 'impact': tone('sine', 85, 32, 0.4, 0.9, sfx, t); noise(0.3, 0.6, 'lowpass', 2200, 260, 0.8, sfx, t); noise(0.22, 0.18, 'bandpass', 3200, 2400, 9, sfx, t); break;
        case 'scrape': noise(0.24, 0.3, 'bandpass', 2600 + Math.random() * 800, 1700, 3, sfx, t, 0.01); tone('sawtooth', 150 + Math.random() * 60, 120, 0.2, 0.05, sfx, t); break;
        case 'lap': tone('sine', 880, 880, 0.2, 0.22, sfx, t); tone('sine', 1320, 1320, 0.35, 0.22, sfx, t + 0.12); break;
        case 'finish': [523, 659, 784, 1046].forEach((f, i) => { tone('square', f, f, 0.3, 0.1, sfx, t + i * 0.11); tone('sine', f, f, 0.5, 0.16, sfx, t + i * 0.11); }); [523, 659, 784].forEach(f => tone('sawtooth', f, f, 1.4, 0.05, sfx, t + 0.45, 0.02)); break;
        case 'gear': noise(0.2, 0.14, 'highpass', 2800, 5200, 0.8, sfx, t + 0.02, 0.01); tone('square', 130, 70, 0.05, 0.12, sfx, t); break;
        case 'backfire': noise(0.1, 0.55, 'lowpass', 1500, 180, 1, sfx, t, 0.002, brownBuf); tone('sine', 110, 40, 0.11, 0.5, sfx, t, 0.002); break;
        case 'ui': tone('triangle', 1500, 1900, 0.06, 0.12, sfx, t); break;
      }
    } catch (e) { warn(e); }
  }
  /* --- Musique : séquenceur électro-rock, Ré mineur (Dm, Bb, F, C) --- */
  const BPM = 132, SD = 60 / BPM / 4, PROG = [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]], ROOT = [38, 34, 41, 36];
  function mStepAt(s, t){
    const I = musI, bar = (s >> 4) % 4, st = s % 16, ch = PROG[bar], root = ROOT[bar];
    if (st === 0) ch.forEach(m => [-6, 6].forEach(d => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = d; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(I < 0.4 ? 0.05 : 0.03, t + 0.4); g.gain.setValueAtTime(I < 0.4 ? 0.05 : 0.03, t + SD * 14); g.gain.linearRampToValueAtTime(0.0001, t + SD * 16); o.connect(g); g.connect(padBus); o.start(t); o.stop(t + SD * 16 + 0.05); }));
    // batterie
    const four = I >= 0.4;
    if (four ? st % 4 === 0 : st === 0 || st === 10){ tone('sine', 150, 42, 0.32, four ? 0.9 : 0.5, mus, t, 0.002); }
    if (four && (st === 4 || st === 12)){ noise(0.18, 0.45, 'bandpass', 1900, 1500, 0.8, mus, t); tone('triangle', 200, 160, 0.1, 0.25, mus, t); }
    if (I >= 0.9 && bar === 3 && st >= 13) noise(0.12, 0.3, 'bandpass', 2100, 1600, 0.8, mus, t);
    if (I >= 0.2 && (st % 2 === 0 || I >= 0.6)) noise(st % 4 === 2 && I >= 0.9 ? 0.16 : 0.04, st % 4 === 2 ? 0.14 : 0.07, 'highpass', 7500, 7500, 0.7, mus, t);
    // basse
    if (I >= 0.4 ? st % 2 === 0 : st % 8 === 0){
      const m = root + (I >= 0.4 && st % 8 === 6 ? 12 : 0), d = I >= 0.4 ? SD * 1.7 : SD * 7;
      const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sawtooth'; o2.type = 'square'; o.frequency.value = mtof(m); o2.frequency.value = mtof(m - 12);
      env(g, t, 0.005, 0.32, d); o.connect(g); o2.connect(g); g.connect(bassBus); o.start(t); o2.start(t); o.stop(t + d + 0.05); o2.stop(t + d + 0.05);
    }
    // accords saturés (guitare synthétique)
    if (I >= 0.55 && (st === 0 || st === 3 || st === 6 || st === 10)){
      const d = st === 10 ? SD * 5 : SD * 2.6;
      [root + 12, root + 19, root + 24].forEach(m => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = (Math.random() - 0.5) * 12; env(g, t, 0.004, 0.22, d); o.connect(g); g.connect(gtrIn); o.start(t); o.stop(t + d + 0.05); });
    }
    // arpège lead au dernier tour
    if (I >= 0.9){ const seq = [0, 1, 2, 1, 2, 0, 2, 1], m = ch[seq[st % 8]] + 12 + (st >= 8 ? 12 : 0); tone('square', mtof(m), mtof(m), SD * 0.9, 0.07, leadBus, t, 0.003); }
  }
  function update(dt){
    if (!ctx) return;
    const t = now();
    for (const V of voices) if (V && V.last >= 0 && t - V.last > 0.3){ set(V.out.gain, 0, 0.08); V.last = -1; }
    if (pops){ popT -= dt; if (popT <= 0){ lastOne.backfire = 0; one('backfire'); pops--; popT = 0.06 + Math.random() * 0.13; } }
    if (musOn && musI > 0.01){
      if (mNext < t - 0.25) mNext = t + 0.06;
      while (mNext < t + 0.18){ try { mStepAt(mStep, mNext); } catch (e) { warn(e); } mNext += SD; mStep = (mStep + 1) % 64; }
    }
  }
  function stopAll(){
    if (!ctx) return;
    for (const V of voices) if (V){ set(V.out.gain, 0, 0.02); V.last = -1; }
    set(tiresV.g.gain, 0, 0.02); set(windV.g.gain, 0, 0.05); musI = 0; pops = 0;
  }
  return {
    init(){ try { if (!ctx){ const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ctx = new AC(); build(); } if (ctx.state === 'suspended') ctx.resume(); } catch (e) { ctx = null; } },
    setSfx(on){ sfxOn = !!on; if (ctx) set(sfx.gain, sfxOn ? 1 : 0, 0.05); },
    setMusic(on){ musOn = !!on; if (ctx) set(mus.gain, musOn ? 0.3 : 0, 0.1); },
    engine, tires, wind, one, update, stopAll,
    music(i){ musI = clamp(+i || 0, 0, 1); },
    get ctx(){ return ctx; },
  };
}

/* ================== HUD ================== */
function createHUD(){
  const el = id => document.getElementById(id);
  const hud = el('hud'), ePos = el('h-pos'), eTime = el('h-time'), eStand = el('h-stand'), eLap = el('h-lap'), eBest = el('h-best');
  const eDrift = el('h-drift'), eCenter = el('center'), eRadio = el('radio-wrap'), mm = el('minimap'), sp = el('speedo');
  const mg = mm && mm.getContext('2d'), sg = sp && sp.getContext('2d');
  const FONT = 'Rajdhani, "Arial Narrow", system-ui, sans-serif', FONT2 = '"Barlow Condensed", "Arial Narrow", system-ui, sans-serif';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmtT = t => { if (!(t > 0) || !isFinite(t)) return t === 0 ? '0:00.00' : '--:--.--'; const cs = Math.floor(t * 100), m = Math.floor(cs / 6000), s = Math.floor(cs / 100) % 60, c = cs % 100; return m + ':' + (s < 10 ? '0' : '') + s + '.' + (c < 10 ? '0' : '') + c; };
  const C = {}; // dernières valeurs écrites dans le DOM
  const put = (key, node, val, html) => { if (!node || C[key] === val) return; C[key] = val; if (html) node.innerHTML = val; else node.textContent = val; };

  /* --- Compteur --- */
  const SW = 500, CX = 250, CY = 250, A0 = Math.PI * 0.75, SWEEP = Math.PI * 1.5, VMAX = 320, RT = 214;
  const [stc, stg] = cnv(SW, SW); let staticOk = false;
  function drawStatic(){
    const g = stg; g.clearRect(0, 0, SW, SW);
    const bg = g.createRadialGradient(CX, CY, 40, CX, CY, 242);
    bg.addColorStop(0, 'rgba(8,10,14,0.78)'); bg.addColorStop(0.75, 'rgba(8,10,14,0.55)'); bg.addColorStop(1, 'rgba(8,10,14,0.0)');
    g.fillStyle = bg; g.beginPath(); g.arc(CX, CY, 242, 0, Math.PI * 2); g.fill();
    g.lineCap = 'butt';
    // piste du tachymètre + zone rouge
    g.lineWidth = 18; g.strokeStyle = 'rgba(255,255,255,0.08)'; g.beginPath(); g.arc(CX, CY, RT, A0, A0 + SWEEP); g.stroke();
    g.strokeStyle = 'rgba(255,59,78,0.4)'; g.beginPath(); g.arc(CX, CY, RT, A0 + SWEEP * 0.86, A0 + SWEEP); g.stroke();
    // graduations km/h
    for (let v = 0; v <= VMAX; v += 10){
      const a = A0 + SWEEP * v / VMAX, maj = v % 20 === 0, r0 = maj ? 176 : 184, r1 = 196, c = Math.cos(a), s = Math.sin(a);
      g.strokeStyle = v >= 280 ? 'rgba(255,90,90,0.9)' : maj ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)'; g.lineWidth = maj ? 4 : 2;
      g.beginPath(); g.moveTo(CX + c * r0, CY + s * r0); g.lineTo(CX + c * r1, CY + s * r1); g.stroke();
      if (v % 40 === 0){ g.font = `700 27px ${FONT}`; g.fillStyle = v >= 280 ? '#ff6b6b' : 'rgba(255,255,255,0.78)'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(v), CX + c * 152, CY + s * 152); }
    }
    g.font = `700 22px ${FONT2}`; g.fillStyle = 'rgba(255,255,255,0.5)'; g.textAlign = 'center'; g.fillText('KM/H', CX, CY + 52);
    g.font = `700 17px ${FONT2}`; g.fillStyle = 'rgba(53,214,255,0.75)'; g.fillText('NITRO', CX, CY + 182);
    // piste de la nitro (dans l'ouverture du bas)
    g.lineWidth = 12; g.strokeStyle = 'rgba(53,214,255,0.14)'; g.beginPath(); g.arc(CX, CY, RT, Math.PI * 0.69, Math.PI * 0.31, true); g.stroke();
    staticOk = true;
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { staticOk = false; C.sp = null; }).catch(() => {});
  function drawSpeedo(st){
    const speed = Math.max(0, st.speedKmh || 0), rpm = clamp(st.rpm01 || 0, 0, 1), nit = clamp(st.nitro01 || 0, 0, 1), on = !!st.nitroOn;
    const gear = st.gear == null ? 0 : st.gear, pulse = on ? Math.round(performance.now() / 33) : 0;
    const key = Math.round(speed * 2) + '|' + Math.round(rpm * 300) + '|' + Math.round(nit * 200) + '|' + on + '|' + gear + '|' + pulse + '|' + staticOk;
    if (C.sp === key || !sg) return; C.sp = key;
    if (!staticOk) drawStatic();
    const g = sg; g.clearRect(0, 0, SW, SW); g.drawImage(stc, 0, 0);
    // tachymètre lumineux segmenté
    const ar = A0 + SWEEP * rpm, red = A0 + SWEEP * 0.86;
    g.lineCap = 'butt'; g.lineWidth = 18; g.save(); g.shadowBlur = 18;
    g.shadowColor = 'rgba(255,150,40,0.9)'; g.strokeStyle = '#ffb347'; g.beginPath(); g.arc(CX, CY, RT, A0, Math.min(ar, red)); g.stroke();
    if (ar > red){ g.shadowColor = 'rgba(255,40,60,1)'; g.strokeStyle = '#ff3b4e'; g.beginPath(); g.arc(CX, CY, RT, red, ar); g.stroke(); }
    g.restore();
    g.save(); g.globalCompositeOperation = 'destination-out'; g.lineWidth = 3;
    for (let i = 1; i < 48; i++){ const a = A0 + SWEEP * i / 48, c = Math.cos(a), s = Math.sin(a); g.beginPath(); g.moveTo(CX + c * 202, CY + s * 202); g.lineTo(CX + c * 226, CY + s * 226); g.stroke(); }
    g.restore();
    // aiguille
    const na = A0 + SWEEP * Math.min(speed, VMAX + 8) / VMAX, nc = Math.cos(na), ns = Math.sin(na), px = -ns, py = nc;
    g.save(); g.shadowBlur = 16; g.shadowColor = 'rgba(255,80,30,0.95)'; g.fillStyle = '#ff5a24';
    g.beginPath(); g.moveTo(CX + nc * 112 + px * 5, CY + ns * 112 + py * 5); g.lineTo(CX + nc * 204 + px * 1.5, CY + ns * 204 + py * 1.5);
    g.lineTo(CX + nc * 204 - px * 1.5, CY + ns * 204 - py * 1.5); g.lineTo(CX + nc * 112 - px * 5, CY + ns * 112 - py * 5); g.closePath(); g.fill();
    g.restore();
    g.strokeStyle = 'rgba(255,240,220,0.9)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(CX + nc * 130, CY + ns * 130); g.lineTo(CX + nc * 200, CY + ns * 200); g.stroke();
    // vitesse numérique (zéros de tête atténués)
    const sv = String(Math.min(999, Math.round(speed))), pad = '000'.slice(sv.length);
    g.font = `italic 700 104px ${FONT}`; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    const wP = g.measureText(pad).width, wS = g.measureText(sv).width, x0 = CX - (wP + wS) / 2 - 4;
    g.fillStyle = 'rgba(255,255,255,0.16)'; g.fillText(pad, x0, CY + 30);
    g.save(); g.shadowBlur = 10; g.shadowColor = 'rgba(0,0,0,0.6)'; g.fillStyle = '#ffffff'; g.fillText(sv, x0 + wP, CY + 30); g.restore();
    // rapport engagé (rouge au rupteur)
    const gs = gear < 0 ? 'R' : gear === 0 ? 'N' : String(gear), shift = rpm > 0.9;
    g.lineWidth = 3; g.strokeStyle = shift ? '#ff3b4e' : 'rgba(255,255,255,0.35)'; g.fillStyle = shift ? 'rgba(255,59,78,0.28)' : 'rgba(255,255,255,0.06)';
    g.beginPath(); if (g.roundRect) g.roundRect(CX - 32, CY + 74, 64, 60, 8); else g.rect(CX - 32, CY + 74, 64, 60); g.fill(); g.stroke();
    g.font = `italic 700 50px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = shift ? '#ff6b78' : '#ffffff'; g.fillText(gs, CX + 1, CY + 106);
    // jauge de nitro
    if (nit > 0.002){
      const a0 = Math.PI * 0.69, a1 = a0 - (Math.PI * 0.38) * nit;
      g.save(); g.lineCap = 'round'; g.lineWidth = 12; g.shadowColor = '#35d6ff'; g.shadowBlur = on ? 22 + 10 * Math.sin(performance.now() / 60) : 8;
      g.strokeStyle = on ? '#bff3ff' : '#35d6ff'; g.beginPath(); g.arc(CX, CY, RT, a0, a1, true); g.stroke();
      if (on){ g.lineWidth = 4; g.strokeStyle = '#ffffff'; g.beginPath(); g.arc(CX, CY, RT, a0, a1, true); g.stroke(); }
      g.restore();
    }
  }

  /* --- Mini-carte --- */
  let track = null, trackPath = null, viewR = 260, startPt = null, streetPath = null;
  // Rues (polylignes ouvertes) dessinées sous le circuit ; null pour les effacer
  function setStreets(lines, r){
    streetPath = null; C.mm = null;
    if (r) viewR = r;
    if (!lines || !lines.length) return;
    streetPath = new Path2D();
    for (const l of lines){ if (!l || l.length < 2) continue; streetPath.moveTo(l[0][0], l[0][1]); for (let i = 1; i < l.length; i++) streetPath.lineTo(l[i][0], l[i][1]); }
  }
  function setTrack(poly){
    track = (poly || []).filter(p => p && isFinite(p[0]) && isFinite(p[1]));
    if (track.length < 2){ track = null; trackPath = null; startPt = null; C.mm = null; return; }
    trackPath = new Path2D(); trackPath.moveTo(track[0][0], track[0][1]);
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const [x, z] of track){ trackPath.lineTo(x, z); x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    trackPath.closePath();
    viewR = clamp(Math.max(x1 - x0, z1 - z0) * 0.3, 160, 460);
    const a = track[0], b = track[1], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; startPt = [a[0], a[1], (b[0] - a[0]) / l, (b[1] - a[1]) / l];
    C.mm = null;
  }
  function drawMap(st){
    if (!mg) return;
    const h = st.heading || 0, px = st.px || 0, pz = st.pz || 0;
    const key = Math.round(px * 4) + '|' + Math.round(pz * 4) + '|' + Math.round(h * 300) + '|' + (st.cars ? st.cars.map(c => Math.round(c.x) + ',' + Math.round(c.z)).join(';') : '');
    if (C.mm === key) return; C.mm = key;
    const W = 380, cx = 190, cy = 190, R = 184, s = R / viewR, ch = Math.cos(h), sh = Math.sin(h);
    const g = mg; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, W);
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
    const bg = g.createRadialGradient(cx, cy, 10, cx, cy, R); bg.addColorStop(0, 'rgba(14,16,22,0.72)'); bg.addColorStop(1, 'rgba(14,16,22,0.5)');
    g.fillStyle = bg; g.fillRect(0, 0, W, W);
    g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R * 0.5, 0, Math.PI * 2); g.stroke();
    // monde -> écran : l'avant du joueur pointe vers le haut
    const a = -s * ch, c = s * sh, b = -s * sh, d = -s * ch;
    if (streetPath){
      g.save(); g.setTransform(a, b, c, d, cx - a * px - c * pz, cy - b * px - d * pz);
      g.lineJoin = 'round'; g.lineCap = 'round';
      g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 16 / s; g.stroke(streetPath);
      g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 7 / s; g.stroke(streetPath);
      g.restore();
    }
    if (trackPath){
      g.save(); g.setTransform(a, b, c, d, cx - a * px - c * pz, cy - b * px - d * pz);
      g.lineJoin = 'round'; g.lineCap = 'round';
      g.strokeStyle = 'rgba(0,0,0,0.55)'; g.lineWidth = 24 / s; g.stroke(trackPath);
      g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 10 / s; g.stroke(trackPath);
      if (startPt){ g.strokeStyle = '#ffc53d'; g.lineWidth = 6 / s; g.beginPath(); g.moveTo(startPt[0] - startPt[3] * 16 / s, startPt[1] + startPt[2] * 16 / s); g.lineTo(startPt[0] + startPt[3] * 16 / s, startPt[1] - startPt[2] * 16 / s); g.stroke(); }
      g.restore();
    }
    // adversaires (ramenés sur le bord s'ils sont hors champ)
    if (st.cars) for (const car of st.cars){
      if (car.me) continue;
      const dx = car.x - px, dz = car.z - pz; let sx = a * dx + c * dz, sy = b * dx + d * dz; const L = Math.hypot(sx, sy), lim = R - 14;
      let rr = 10; if (L > lim){ sx *= lim / L; sy *= lim / L; rr = 7; }
      g.beginPath(); g.arc(cx + sx, cy + sy, rr, 0, Math.PI * 2); g.fillStyle = car.color || '#ff3b4e'; g.fill(); g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,0.75)'; g.stroke();
    }
    g.restore();
    // bord de verre + nord
    g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.28)'; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
    const nx = cx + sh * (R - 20), ny = cy - ch * (R - 20);
    g.fillStyle = 'rgba(10,12,16,0.8)'; g.beginPath(); g.arc(nx, ny, 15, 0, Math.PI * 2); g.fill();
    g.font = `700 20px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffc53d'; g.fillText('N', nx, ny + 1);
    // flèche du joueur
    g.save(); g.translate(cx, cy); g.shadowBlur = 14; g.shadowColor = '#35d6ff'; g.fillStyle = '#35d6ff';
    g.beginPath(); g.moveTo(0, -20); g.lineTo(14, 15); g.lineTo(0, 7); g.lineTo(-14, 15); g.closePath(); g.fill();
    g.shadowBlur = 0; g.lineWidth = 2.5; g.strokeStyle = '#ffffff'; g.stroke(); g.restore();
  }

  let radioTimer = 0, radioNode = null;
  return {
    show(on){ if (hud) hud.hidden = !on; if (!on){ if (eCenter) eCenter.innerHTML = ''; if (eRadio) eRadio.innerHTML = ''; this.drift(null); } },
    setTrack, setStreets,
    update(st){
      if (!st) return;
      const pos = st.pos | 0, tot = st.total | 0;
      put('pos', ePos, `${pos}<sup>${pos === 1 ? 'er' : 'e'}</sup><small>/${tot}</small>`, true);
      put('time', eTime, fmtT(st.time || 0));
      put('lap', eLap, `${st.lap | 0}/${st.laps | 0}`);
      put('best', eBest, st.best > 0 && isFinite(st.best) ? fmtT(st.best) : '--:--.--');
      if (st.standings) put('stand', eStand, st.standings.map((c, i) => `<li${c.me ? ' class="me"' : ''}><em>${i + 1}</em>${esc(c.name)}</li>`).join(''), true);
      drawSpeedo(st); drawMap(st);
    },
    countdown(n){ if (!eCenter) return; eCenter.innerHTML = ''; const d = document.createElement('div'); d.className = n > 0 ? 'count' : 'count go'; d.textContent = n > 0 ? String(n) : 'GO'; eCenter.appendChild(d); },
    banner(big, small){ if (!eCenter) return; eCenter.innerHTML = `<div class="banner">${esc(big)}${small ? `<small>${esc(small)}</small>` : ''}</div>`; },
    radio(who, text, ms = 4000){
      if (!eRadio) return; clearTimeout(radioTimer); eRadio.innerHTML = '';
      const d = document.createElement('div'); d.className = 'radio'; d.innerHTML = `<b>${esc(who)} :</b> ${esc(text)}`; eRadio.appendChild(d); radioNode = d;
      radioTimer = setTimeout(() => { d.style.transition = 'opacity .4s'; d.style.opacity = '0'; setTimeout(() => { if (radioNode === d) d.remove(); }, 450); }, ms);
    },
    drift(text){ if (!eDrift) return; const v = text == null ? '' : String(text); if (C.drift === v) return; C.drift = v; if (v) eDrift.textContent = v; eDrift.style.opacity = v ? '1' : '0'; },
    fmt: fmtT,
  };
}
