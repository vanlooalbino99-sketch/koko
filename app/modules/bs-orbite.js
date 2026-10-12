/* Blackstart CRM : fond animé « Orbites », repris de l'accueil du site (anneaux lumineux et poussière d'étoiles
 * autour du logo en verre), sans le logo.
 *
 * - Un seul shader WebGL plein écran (sans Three.js) : nébuleuse aux couleurs de l'accent, anneaux en orbite avec
 *   une lumière qui les parcourt, poussière d'étoiles scintillante en trois plans, étoile filante de temps en temps,
 *   léger relief qui suit la souris.
 * - Léger : rendu à résolution réduite, 30 images/s au plus, en pause quand l'onglet est caché ; si l'appareil peine,
 *   la résolution baisse puis l'image se fige. « Réduire les animations » : une image fixe.
 * - Thème clair : mêmes orbites, encre colorée sur fond clair.
 * - Passe devant les images d'ambiance en fond de l'application (elles restent sur la bannière, à l'ouverture et à
 *   la connexion). Réglages › Ambiance › « Fond animé Orbites » le désactive sur cet appareil.
 */
(function () {
  'use strict';
  if (window.bsOrbite) return;

  var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FS = [
    'precision highp float;',
    'uniform vec2 uR;uniform float uT;uniform vec2 uM;uniform float uLight;',
    'uniform vec3 uC1;uniform vec3 uC2;uniform vec3 uC3;',
    'mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}',
    'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
    '  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n2(p);p=rot(.6)*p*2.03+3.1;a*=.5;}return v;}',
    'float line(float d,float w){return 1.-smoothstep(w,w+1.6/uR.y,abs(d));}',
    // Poussière d'étoiles : une étoile au plus par case, scintillante, décalée par la souris (parallaxe).
    'vec3 stars(vec2 uv,float sc,float dens,float par,float t){',
    '  vec2 g=uv*sc+uM*par+vec2(t*.004*sc,0.);vec2 id=floor(g),f=fract(g)-.5;',
    '  float r=h21(id);if(r>dens)return vec3(0.);',
    '  vec2 o=(vec2(h21(id+7.1),h21(id+3.7))-.5)*.6;float d=length(f-o);',
    '  float tw=.55+.45*sin(t*(1.2+r*3.)+r*40.);',
    '  float s=smoothstep(.09,0.,d)*.9+smoothstep(.32,0.,d)*.12;',
    '  vec3 c=mix(vec3(.80,.88,1.),mix(uC2,vec3(1.),.45),step(.55,h21(id+1.3)));',
    '  return c*s*tw*(.5+r/dens);}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-.5*uR)/uR.y;float t=uT;',
    '  vec3 col=vec3(.004,.006,.014);',
    // Nébuleuse : deux nappes lentes aux couleurs de l'accent.
    '  vec2 q=uv*1.4+vec2(t*.008,-t*.005);float n=fbm(q+fbm(q*.8+t*.01));',
    '  col+=uC1*pow(n,2.6)*.20+uC2*pow(fbm(q*1.3-4.),3.)*.16;',
    // Centre des orbites : à droite, comme le logo sur le site, avec une légère dérive.
    '  vec2 c=vec2(.34+.03*sin(t*.05),.06+.02*cos(t*.04));',
    '  vec2 p=rot(-.26)*(uv-c)+uM*.02;',
    '  float halo=exp(-dot(p,p)*5.);col+=mix(uC1,uC2,.4)*halo*.16;',
    '  col+=uC3*exp(-dot(uv+vec2(.55,.42),uv+vec2(.55,.42))*2.2)*.05;',
    // Anneaux : contour légèrement ondulé, corps lumineux et fil poli, lumière qui parcourt chaque orbite.
    '  for(int i=0;i<5;i++){float k=float(i);',
    '    vec2 o=p*vec2(.92,1.26);float a=atan(o.y,o.x),rr=length(o);',
    '    float R=.30+k*.165+.045*sin(a*2.+t*.07+k*.9)+.015*cos(a*3.-t*.11+k);',
    '    float d=rr-R;',
    '    float arc=smoothstep(-.7,.75,sin(a+k*.7+t*.045*(1.+k*.25)));',
    '    vec3 tint=mix(mix(uC1,uC2,k*.3),uC3,smoothstep(2.5,4.,k));',
    '    float body=exp(-pow(d*24.,2.)),sh=exp(-pow((d+.02)*12.,2.));',
    '    col+=tint*(body*.11+sh*.03)*(.35+arc*.9);',
    '    col+=mix(tint,vec3(.78,.86,1.),.35)*line(d,.0009)*(.10+arc*.30);',
    '    float ca=t*(.10-k*.012)+k*1.9;float da=abs(mod(a-ca+3.14159,6.28318)-3.14159);',
    '    float tail=exp(-da*da*18.)*exp(-pow(d*60.,2.));',
    '    float head=exp(-pow(da*R*40.,2.)-pow(d*90.,2.));',
    '    col+=mix(tint,vec3(1.),.5)*(tail*.35+head*1.1);',
    '  }',
    // Étoiles en trois plans.
    '  col+=stars(uv,22.,.16,.6,t)*.75;col+=stars(uv,48.,.12,1.2,t)*.55;col+=stars(uv*rot(.4),95.,.10,2.,t)*.4;',
    // Étoile filante, environ toutes les 11 s.
    '  float sl=floor(t/11.),sf=t-sl*11.;',
    '  if(sf<1.2){vec2 s0=vec2(h21(vec2(sl,1.))*1.6-.4,.35+h21(vec2(sl,2.))*.2);vec2 dir=normalize(vec2(-.9,-.45));',
    '    vec2 hp=s0+dir*sf*.9;vec2 rel=uv-hp;float along=dot(rel,-dir),across=dot(rel,vec2(-dir.y,dir.x));',
    '    float tr=smoothstep(.28,0.,along)*step(0.,along)*exp(-pow(across*500.,2.))+exp(-dot(rel,rel)*9000.);',
    '    col+=vec3(.85,.9,1.)*tr*sin(sf/1.2*3.14159)*.9;}',
    // Vignette et voile doux en haut (barre de recherche) pour garder les textes lisibles.
    '  col*=mix(.35,1.,1.-smoothstep(.45,1.25,length(uv*vec2(.75,1.))));',
    '  col*=1.-.35*smoothstep(.25,.5,uv.y);',
    '  col=1.-exp(-col*1.25);',
    '  if(uLight>.5){float l=clamp(dot(col,vec3(.3,.55,.15))*1.9,0.,.75);',
    '    vec3 ink=col/max(max(col.r,col.g),max(col.b,.001));',
    '    col=mix(vec3(.955,.962,.985),ink*.62,l);}',
    '  gl_FragColor=vec4(col,1.);',
    '}',
  ].join('\n');

  var CSS = [
    '#bs-orbite-fond{position:fixed;inset:0;width:100vw;height:100vh;z-index:0;pointer-events:none;opacity:0;transition:opacity 1.2s ease;display:block}',
    'html.bs-orbite #bs-orbite-fond{opacity:1}',
    'html.bs-orbite body{background:transparent}',
    'html.bs-orbite #bs-amb{display:none!important}',
    'html.bs-orbite body::before,html.bs-orbite #root::after{display:none}',
    'html.bs-orbite #root::before{opacity:.35}',
    // Le menu et la barre du haut laissent passer les orbites, en verre dépoli.
    '@media (min-width:1024px){html.bs-orbite .sidebar{background:linear-gradient(180deg,rgb(var(--bg-rgb)/.55),rgb(var(--bg-rgb)/.72))!important;-webkit-backdrop-filter:blur(20px) saturate(1.4);backdrop-filter:blur(20px) saturate(1.4)}}',
    'html.bs-orbite .topbar{background:linear-gradient(180deg,rgb(var(--bg-rgb)/.62),rgb(var(--bg-rgb)/.38))}',
  ].join('\n');

  var cv, gl, prog, loc = {}, raf = 0, t0 = performance.now(), last = 0, scale = 0.72, lent = 0, fige = false;
  var mouse = [0, 0], mouseCible = [0, 0], couleurs = null;
  var reduit = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var H = document.documentElement;

  function clair() { return H.getAttribute('data-scheme') === 'light'; }
  function mouvementReduit() { return reduit.matches || H.getAttribute('data-motion') === 'reduced'; }
  var PREF = 'bs-orbite';
  function voulu() { try { return localStorage.getItem(PREF) !== 'off'; } catch (e) { return true; } }

  // Couleurs de l'accent (Réglages) : la variable CSS est résolue par le navigateur sur un élément témoin.
  function lireCouleurs() {
    var e = document.createElement('i'); e.style.display = 'none'; document.body.appendChild(e);
    var out = ['--aur-1', '--aur-3', '--aur-2'].map(function (v, i) {
      e.style.color = ''; e.style.color = 'var(' + v + ',' + ['#387cd5', '#22d3ee', '#8b5cf6'][i] + ')';
      return parse(getComputedStyle(e).color);
    });
    e.remove();
    // Ordre du shader : uC1 = accent, uC2 = violet, uC3 = cyan (comme la palette du site).
    return [out[0], out[2], out[1]];
  }
  function parse(s) {
    var m = String(s).match(/[\d.]+/g) || [56, 124, 213];
    var n = m.slice(0, 3).map(Number);
    if (/^color\(/.test(s)) return n; // color(srgb r g b) : déjà entre 0 et 1
    return n.map(function (x) { return x / 255; });
  }

  function compiler(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function init() {
    cv = document.createElement('canvas'); cv.id = 'bs-orbite-fond'; cv.setAttribute('aria-hidden', 'true');
    gl = cv.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
    if (!gl) return false;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compiler(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, compiler(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) { console.warn('Fond Orbites indisponible :', e.message); return false; }
    gl.useProgram(prog);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var a = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    ['uR', 'uT', 'uM', 'uLight', 'uC1', 'uC2', 'uC3'].forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); arreter(); });
    cv.addEventListener('webglcontextrestored', function () { if (init()) maj(); });
    var st = document.createElement('style'); st.id = 'bs-orbite-css'; st.textContent = CSS; document.head.appendChild(st);
    document.body.insertBefore(cv, document.body.firstChild);
    return true;
  }
  function taille() {
    var r = Math.min(window.devicePixelRatio || 1, 1.5) * scale;
    var w = Math.max(1, Math.round(window.innerWidth * r)), h = Math.max(1, Math.round(window.innerHeight * r));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
  }
  function dessiner(now) {
    taille();
    if (!couleurs) couleurs = lireCouleurs();
    mouse[0] += (mouseCible[0] - mouse[0]) * 0.05; mouse[1] += (mouseCible[1] - mouse[1]) * 0.05;
    gl.uniform2f(loc.uR, cv.width, cv.height);
    gl.uniform1f(loc.uT, mouvementReduit() ? 40 : (now - t0) / 1000 + 40);
    gl.uniform2f(loc.uM, mouse[0], mouse[1]);
    gl.uniform1f(loc.uLight, clair() ? 1 : 0);
    gl.uniform3fv(loc.uC1, couleurs[0]); gl.uniform3fv(loc.uC2, couleurs[1]); gl.uniform3fv(loc.uC3, couleurs[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function boucle(now) {
    raf = requestAnimationFrame(boucle);
    if (now - last < 32) return; // 30 images/s au plus
    var dt = last ? now - last : 33; last = now;
    dessiner(now);
    if (dt < 500) surveiller(dt);
  }
  // Appareil qui peine : on baisse la résolution, puis on fige l'image.
  function surveiller(dt) {
    lent = dt > 52 ? lent + 1 : Math.max(0, lent - 1);
    if (lent < 30) return;
    lent = 0;
    if (scale > 0.45) { scale = Math.max(0.45, scale - 0.14); return; }
    fige = true; arreter(); dessiner(performance.now());
  }
  function arreter() { cancelAnimationFrame(raf); raf = 0; }
  function maj() {
    if (!gl) return;
    var on = voulu();
    H.classList.toggle('bs-orbite', on);
    if (!on || document.hidden) { arreter(); return; }
    if (mouvementReduit() || fige) { arreter(); dessiner(performance.now()); return; }
    if (!raf) { last = 0; raf = requestAnimationFrame(boucle); }
  }

  function demarrer() {
    if (!init()) return;
    window.addEventListener('resize', function () { if (!raf) maj(); });
    document.addEventListener('visibilitychange', maj);
    if (reduit.addEventListener) reduit.addEventListener('change', maj);
    window.addEventListener('pointermove', function (e) {
      mouseCible[0] = (e.clientX / window.innerWidth - 0.5) * 2; mouseCible[1] = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    // Thème, accent, mouvement réduit ou image d'ambiance changés dans Réglages.
    new MutationObserver(function () { couleurs = null; maj(); }).observe(H, { attributes: true, attributeFilter: ['class', 'data-scheme', 'data-motion', 'style', 'data-accent'] });
    maj();
  }
  window.bsOrbite = {
    etat: function () { return { actif: H.classList.contains('bs-orbite'), anime: !!raf, echelle: scale, fige: fige }; },
    voulu: voulu,
    // Choix enregistré sur cet appareil (Réglages › Ambiance).
    regler: function (on) {
      try { if (on) localStorage.removeItem(PREF); else localStorage.setItem(PREF, 'off'); } catch (e) { /* stockage bloqué */ }
      if (on) fige = false;
      maj();
      window.dispatchEvent(new Event('bs:orbite'));
    },
  };
  if (document.body) demarrer(); else document.addEventListener('DOMContentLoaded', demarrer);
})();
