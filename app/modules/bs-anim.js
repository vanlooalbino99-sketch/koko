
/* Blackstart CRM : graphiques animés et mode présentation.
 *
 * - Apparition animée : les barres poussent depuis l'axe, les courbes se dessinent, les anneaux se remplissent,
 *   les chiffres défilent jusqu'à leur valeur, les cartes arrivent en cascade. Les éléments situés plus bas
 *   s'animent quand on fait défiler la page jusqu'à eux.
 *   L'apparition est courte ; ensuite les graphiques restent immobiles (albino, 2026-10-03 : « apparition
 *   seule »). Le mouvement permanent (comètes, vagues, reflets) existe encore dans ce fichier mais est coupé
 *   par MOUVEMENT = false.
 * - Mode présentation (bouton « Présenter » ou touche P sur une page avec des graphiques) : la page devient un
 *   diaporama plein écran, une diapositive par graphique, avec les chiffres clés calculés automatiquement
 *   (total, meilleur mois, évolution). La présentation est muette : ni voix ni son.
 * Animations en Web Animations API : elles ne modifient pas le DOM géré par l'interface.
 * « Réduire les animations » (Réglages › Apparence) ou le réglage système les désactive.
 */
(function () {
  'use strict';
  if (window.bsAnim) return;

  var MOUVEMENT = false; // mouvement permanent après l'apparition : coupé à la demande d'albino
  var EASE = 'cubic-bezier(.16,1,.3,1)';
  var EASE_IO = 'cubic-bezier(.65,0,.35,1)';
  function reduced() {
    return document.documentElement.getAttribute('data-motion') === 'reduced' ||
      (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function anim(el, frames, o) {
    if (!el || !el.animate) return null;
    try { return el.animate(frames, Object.assign({ fill: 'backwards', easing: EASE }, o)); } catch (e) { return null; }
  }
  function parseJson(s) { try { return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }

  var CSS = [
    '.chart svg path{transform-box:fill-box;transform-origin:50% 100%}',
    '.chart svg circle{transform-box:fill-box;transform-origin:50% 50%}',
    '.chart svg g.bs-col{transform-box:fill-box;transform-origin:50% 100%}',
    '.hbar-track path{transform-box:fill-box;transform-origin:0 50%}',
    '.funnel-bar span,.meter span,.hbar-fill{transform-origin:0 50%}',
    '.chart svg g.chart-peak,.chart svg g.bs-badge,.chart svg text.bs-val{transform-box:fill-box;transform-origin:50% 100%}',
    'html[data-motion="reduced"] .chart svg circle{animation:none!important}',
    '@media (prefers-reduced-motion:reduce){.chart svg circle{animation:none!important}}',
    // Bouton « Présenter »
    '.bs-pres-btn{display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 14px;border-radius:99px;border:1px solid rgb(var(--accent-rgb)/.45);background:linear-gradient(135deg,rgb(var(--accent-rgb)/.22),rgb(var(--accent-rgb)/.08));color:var(--text);font:inherit;font-weight:650;font-size:.92em;cursor:pointer;position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s}',
    '.bs-pres-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px -10px rgb(var(--accent-rgb)/.8)}',
    '.bs-pres-btn kbd{font:inherit;font-size:.78em;padding:1px 6px;border-radius:6px;background:rgb(var(--text-rgb)/.1);color:var(--text-2)}',
    // Présentation plein écran
    '#bs-pres{position:fixed;inset:0;z-index:450;color:#fff;font-family:var(--font,system-ui);overflow:hidden;background:#05070d;opacity:0;transition:opacity .45s ease;--pa:var(--accent,#387cd5);--pa-rgb:var(--accent-rgb,56 124 213)}',
    '#bs-pres.on{opacity:1}',
    '#bs-pres .p-bg{position:absolute;inset:-6%;background-size:cover;background-position:center;filter:blur(18px) saturate(1.1);transform:scale(1.05);opacity:.55}',
    '#bs-pres .p-aurora{position:absolute;inset:-20%;background:radial-gradient(40% 35% at 20% 30%,rgb(var(--pa-rgb)/.55),transparent 70%),radial-gradient(35% 30% at 80% 20%,rgb(139 92 246/.45),transparent 70%),radial-gradient(45% 40% at 60% 85%,rgb(16 185 129/.35),transparent 70%);filter:blur(30px)}',
    '#bs-pres .p-shade{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 40%,rgb(5 7 13/.35),rgb(5 7 13/.85))}',
    '#bs-pres .p-top{position:absolute;left:0;right:0;top:0;padding:18px 28px 0;display:flex;flex-direction:column;gap:12px;z-index:3}',
    '#bs-pres .p-prog{display:flex;gap:6px}',
    '#bs-pres .p-seg{flex:1;height:3px;border-radius:3px;background:rgb(255 255 255/.22);overflow:hidden}',
    '#bs-pres .p-seg i{display:block;height:100%;width:0;background:#fff;border-radius:3px}',
    '#bs-pres .p-seg.done i{width:100%!important}',
    '#bs-pres .p-head{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;letter-spacing:.14em;font-weight:750;opacity:.85;text-transform:uppercase}',
    '#bs-pres .p-stage{position:absolute;inset:78px 5vw 92px;perspective:1600px;z-index:2}',
    '#bs-pres .p-slide{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}',
    '#bs-pres .p-bottom{position:absolute;left:0;right:0;bottom:0;padding:0 28px 22px;display:flex;justify-content:space-between;align-items:center;gap:12px;z-index:3;transition:opacity .5s}',
    '#bs-pres.idle .p-bottom,#bs-pres.idle .p-head{opacity:0}',
    '#bs-pres.idle{cursor:none}',
    '#bs-pres .p-ctrl{display:flex;gap:8px;align-items:center}',
    '#bs-pres button{font:inherit;color:#fff;cursor:pointer}',
    '#bs-pres .p-ic{height:40px;min-width:40px;padding:0 12px;border-radius:99px;border:1px solid rgb(255 255 255/.22);background:rgb(255 255 255/.08);display:inline-flex;align-items:center;justify-content:center;gap:7px;font-size:13px;font-weight:600;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}',
    '#bs-pres .p-ic:hover{background:rgb(255 255 255/.18)}',
    '#bs-pres .p-ic.on{background:#fff;color:#0b1220!important;border-color:#fff}',
    '#bs-pres .p-count{font-size:13px;opacity:.75;font-variant-numeric:tabular-nums}',
    // Diapositive titre
    '#bs-pres .s-title{text-align:center;max-width:1000px}',
    '#bs-pres .s-eyebrow{font-size:13px;letter-spacing:.3em;text-transform:uppercase;opacity:.75;font-weight:700}',
    '#bs-pres .s-h{font-size:clamp(44px,7vw,104px);font-weight:800;letter-spacing:-.035em;line-height:1.02;margin:18px 0 14px}',
    '#bs-pres .s-h span{display:inline-block;white-space:pre}',
    '#bs-pres .s-date{font-size:clamp(17px,1.8vw,24px);opacity:.85;text-transform:capitalize}',
    '#bs-pres .s-hint{margin-top:34px;font-size:13.5px;opacity:.65}',
    '#bs-pres .s-line{width:120px;height:3px;border-radius:3px;margin:26px auto 0;background:linear-gradient(90deg,transparent,var(--pa),transparent)}',
    // Diapositive chiffres clés
    '#bs-pres .s-kpis{width:min(1240px,100%)}',
    '#bs-pres .s-kh{font-size:clamp(26px,3vw,40px);font-weight:800;letter-spacing:-.02em;margin-bottom:22px}',
    '#bs-pres .s-kgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}',
    '#bs-pres .s-kgrid .kpi{font-size:1.28em;background:rgb(255 255 255/.09)!important;border:1px solid rgb(255 255 255/.16);color:#fff;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 20px 50px -30px rgb(0 0 0/.8)}',
    '#bs-pres .s-kgrid .kpi *{color:inherit}',
    '#bs-pres .s-kgrid .kpi-label,#bs-pres .s-kgrid .kpi-foot{opacity:.8}',
    // Diapositive graphique
    '#bs-pres .s-chart{width:min(1320px,100%);display:grid;grid-template-columns:minmax(0,1.75fr) minmax(260px,1fr);gap:22px;align-items:stretch;max-height:100%}',
    '@media (max-width:900px){#bs-pres .s-chart{grid-template-columns:1fr}}',
    '#bs-pres .s-chart.wide{grid-template-columns:1fr;gap:16px}',
    '#bs-pres .s-chart.wide .s-ins{flex-direction:row;flex-wrap:wrap}',
    '#bs-pres .s-chart.wide .s-card{flex:1 1 220px}',
    '#bs-pres .s-ch{font-size:clamp(24px,2.6vw,36px);font-weight:800;letter-spacing:-.02em}',
    '#bs-pres .s-cs{opacity:.75;margin-top:2px;font-size:clamp(14px,1.2vw,17px)}',
    '#bs-pres .s-panel{border-radius:22px;background:rgb(255 255 255/.92);color:#0b1220;padding:22px 24px;box-shadow:0 40px 90px -40px rgb(0 0 0/.9);min-width:0;overflow:hidden;display:flex;flex-direction:column;gap:14px}',
    '#bs-pres[data-scheme="dark"] .s-panel{background:rgb(12 18 32/.82);color:#e8eefb;border:1px solid rgb(255 255 255/.12);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}',
    '#bs-pres .s-viz{min-height:0;font-size:1.15em}',
    '#bs-pres .s-viz .chart{height:auto!important}',
    '#bs-pres .s-viz .chart svg{width:100%;height:auto;max-height:52vh}',
    '#bs-pres .s-viz .ring{margin:0 auto}',
    '#bs-pres .s-ins{display:flex;flex-direction:column;gap:12px;justify-content:center}',
    '#bs-pres .s-card{border-radius:18px;padding:16px 18px;background:rgb(255 255 255/.1);border:1px solid rgb(255 255 255/.16);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}',
    '#bs-pres .s-card .k{font-size:12.5px;text-transform:uppercase;letter-spacing:.08em;opacity:.75;font-weight:700}',
    '#bs-pres .s-card .v{font-size:clamp(22px,2.4vw,34px);font-weight:800;letter-spacing:-.02em;margin-top:4px;font-variant-numeric:tabular-nums}',
    '#bs-pres .s-card.big .v{font-size:clamp(34px,3.8vw,56px)}',
    '#bs-pres .s-card .v.up{color:#4ade80}#bs-pres .s-card .v.down{color:#fb7185}',
    // Fin
    '#bs-pres .s-end{width:min(1240px,100%);max-height:100%;overflow:auto;padding:4px}',
    '#bs-pres .s-end ul{list-style:none;padding:0;margin:18px 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:10px}',
    '#bs-pres .s-end li{padding:11px 15px;border-radius:14px;background:rgb(255 255 255/.08);border:1px solid rgb(255 255 255/.14);font-size:clamp(13.5px,1.1vw,16px)}',
    '#bs-pres .s-end li b{display:block;font-size:.8em;text-transform:uppercase;letter-spacing:.08em;opacity:.7;margin-bottom:2px}',
    '#bs-pres .s-actions{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap}',
    '#bs-pres .s-btn{border:0;border-radius:99px;padding:11px 18px;font-weight:700;background:#fff;color:#0b1220!important}',
    '#bs-pres .s-btn.ghost{background:transparent;border:1px solid rgb(255 255 255/.35);color:#fff!important}',
  ].join('\n');

  // Mouvement permanent (CSS) : vague sur les barres, reflets qui glissent, anneaux qui respirent.
  // Seulement si les animations ne sont pas réduites ; décalage par rang pour que la vague voyage.
  function liveCss() {
    if (!MOUVEMENT) return '';
    var on = 'html:not([data-motion="reduced"]) ', r = [], i;
    r.push(
      on + '.chart svg>g>path{animation:bsBarLive 6.5s ease-in-out infinite}',
      on + '.chart svg>path[opacity]{animation:bsAreaLive 5s ease-in-out infinite}',
      on + '.chart svg>path[data-bs-area]{animation:bsAreaLive2 5s ease-in-out infinite}',
      on + '.ring-arc{animation:bsRingLive 3.8s ease-in-out infinite}',
      on + '.bs-tick.on{animation:bsTickLive 3.8s ease-in-out infinite}',
      on + '.kpi::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(105deg,transparent 36%,rgb(var(--accent-rgb)/.12) 45%,rgb(255 255 255/.2) 50%,rgb(var(--accent-rgb)/.12) 55%,transparent 64%);transform:translateX(-105%);animation:bsKpiSheen 9s ease-in-out infinite}',
      on + '.heat{animation:bsHeatLive 7s ease-in-out infinite}',
      '@keyframes bsBarLive{0%,40%,100%{transform:scaleY(1);filter:brightness(1) var(--bs-sh,drop-shadow(0 0 0 transparent))}13%{transform:scaleY(1.045);filter:brightness(1.3) var(--bs-sh,drop-shadow(0 0 0 transparent))}}',
      '@keyframes bsAreaLive{0%,100%{opacity:.08}50%{opacity:.2}}',
      '@keyframes bsAreaLive2{0%,100%{opacity:.72}50%{opacity:1}}',
      '@keyframes bsRingLive{0%,100%{filter:drop-shadow(0 0 3px color-mix(in srgb,var(--bs-c,rgb(var(--accent-rgb))) 45%,transparent))}50%{filter:drop-shadow(0 0 13px color-mix(in srgb,var(--bs-c,rgb(var(--accent-rgb))) 95%,transparent))}}',
      '@keyframes bsTickLive{0%,100%{opacity:.55}50%{opacity:1}}',
      '@keyframes bsKpiSheen{0%{transform:translateX(-105%)}20%,100%{transform:translateX(105%)}}',
      '@keyframes bsHeatLive{0%,28%,100%{transform:none;filter:brightness(1)}9%{transform:scale(1.2);filter:brightness(1.45)}}'
    );
    for (i = 1; i <= 80; i++) r.push(on + '.chart svg>g:nth-child(' + i + ')>path{animation-delay:' + (i * 0.12).toFixed(2) + 's}');
    for (i = 1; i <= 12; i++) r.push(on + '.kpi:nth-child(' + i + ')::before{animation-delay:' + (1 + i * 0.4).toFixed(2) + 's}');
    for (i = 1; i <= 100; i++) r.push(on + '.heat:nth-child(' + i + '){animation-delay:' + (i * 0.035).toFixed(3) + 's}');
    // Hors de l'écran, ou derrière la présentation : en pause.
    r.push('[data-bs-idle],[data-bs-idle] *,[data-bs-idle]::before,[data-bs-idle] *::after,html[data-bs-pres] #main *,html[data-bs-pres] #main *::before,html[data-bs-pres] #main *::after{animation-play-state:paused!important}');
    return '@media (prefers-reduced-motion:no-preference){' + r.join('\n') + '}\n.bs-live{position:absolute;pointer-events:none;overflow:visible}';
  }

  function ensureCss() {
    if (document.getElementById('bs-anim-css')) return;
    var st = document.createElement('style'); st.id = 'bs-anim-css'; st.textContent = CSS + '\n' + liveCss();
    (document.head || document.documentElement).appendChild(st);
  }

  // ---------------------------------------------------------------- chiffres qui défilent
  var NUM_RE = /-?\d{1,3}(?:[   ]\d{3})+(?:,\d+)?|-?\d+(?:,\d+)?/;
  function countUp(el, delay, dur) {
    if (!el) return;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), node;
    while ((node = walker.nextNode())) if (/\d/.test(node.data)) break;
    if (!node || node.__bsCount) return;
    var orig = node.data, m = NUM_RE.exec(orig);
    if (!m) return;
    var raw = m[0], sep = (raw.match(/[   ]/) || [' '])[0];
    var target = parseFloat(raw.replace(/[   ]/g, '').replace(',', '.'));
    if (!isFinite(target) || target === 0) return;
    var dec = (raw.split(',')[1] || '').length, grouped = /[   ]/.test(raw) || Math.abs(target) >= 10000;
    var pre = orig.slice(0, m.index), post = orig.slice(m.index + raw.length);
    function fmt(v) {
      var s = Math.abs(v).toFixed(dec).split('.'), int = s[0];
      if (grouped) int = int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
      return (v < 0 ? '-' : '') + int + (dec ? ',' + s[1] : '');
    }
    node.__bsCount = 1;
    var last = pre + fmt(0) + post; node.data = last;
    var t0 = 0;
    function frame(ts) {
      if (node.data !== last) { node.__bsCount = 0; return; } // l'interface a changé la valeur entre-temps
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
      last = k === 1 ? orig : pre + fmt(target * e) + post;
      node.data = last;
      if (k < 1) requestAnimationFrame(frame); else node.__bsCount = 0;
    }
    setTimeout(function () { requestAnimationFrame(frame); }, delay || 0);
  }

  // ---------------------------------------------------------------- animations d'apparition
  function animChart(c, o) {
    o = o || {};
    var svg = c.querySelector('svg');
    if (!svg || svg.__bsA) return;
    svg.__bsA = 1;
    var b = o.delay || 0, sl = o.slow ? 1.35 : 1;
    var grid = svg.querySelectorAll('line.chart-grid,line.chart-base');
    for (var i = 0; i < grid.length; i++) anim(grid[i], [{ opacity: 0 }, { opacity: 1 }], { duration: 500 * sl, delay: b + i * 45 });
    var axis = svg.querySelectorAll('text.chart-axis');
    for (var j = 0; j < axis.length; j++) anim(axis[j], [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: b + 120 + j * 16 });
    var gh = svg.querySelector('.bs-ghosts');
    if (gh) anim(gh, [{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: b + 100 });
    var extras = svg.querySelectorAll('.chart-peak, .bs-val, .bs-badge');
    for (var x = 0; x < extras.length; x++) anim(extras[x], [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: b + (extras[x].classList.contains('bs-badge') ? 1700 * sl : 900 * sl) + x * 40 });
    var data = parseJson(c.getAttribute('data-bsc'));
    var line = svg.querySelector('path[stroke]:not([stroke="none"])');
    var type = data ? data.t : line ? 'line' : 'bar';
    var cols = svg.querySelectorAll('g.bs-col');
    if (type === 'bar' && cols.length) {
      // Colonnes 3D : chaque prisme monte depuis son socle, sans rebond.
      var per = cols.length / Math.max(1, svg.querySelectorAll('g.bs-cat').length);
      for (var q = 0; q < cols.length; q++)
        anim(cols[q], [{ transform: 'scaleY(0)', opacity: 0.3 }, { transform: 'scaleY(1)', opacity: 1 }], { duration: 750 * sl, delay: b + 160 + Math.floor(q / per) * 55 + (q % per) * 40 });
      anim(svg.querySelector('.bs-floor'), [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: b });
      // Courbe de tendance : tracée de gauche à droite une fois les colonnes montées.
      var tEnd = b + 160 + svg.querySelectorAll('g.bs-cat').length * 55 + 450 * sl;
      Array.prototype.forEach.call(svg.querySelectorAll('.bs-trend path:not(.bs-trend-band)'), function (p) {
        var tl = 0; try { tl = p.getTotalLength(); } catch (e) {}
        if (tl) anim(p, [{ strokeDasharray: tl + ' ' + tl, strokeDashoffset: tl }, { strokeDasharray: tl + ' ' + tl, strokeDashoffset: 0 }], { duration: 700 * sl, delay: tEnd, easing: EASE_IO });
      });
      Array.prototype.forEach.call(svg.querySelectorAll('.bs-trend-dot, .bs-trend-key, .bs-trend-band'), function (d) { anim(d, [{ opacity: 0 }, { opacity: 1 }], { duration: 450, delay: tEnd + 600 * sl }); });
    } else if (type === 'bar') {
      var groups = Array.prototype.filter.call(svg.children, function (g) { return g.tagName.toLowerCase() === 'g' && g.querySelector('path') && !g.classList.contains('bs-trends'); });
      groups.forEach(function (g, gi) {
        var ps = g.querySelectorAll('path');
        for (var k = 0; k < ps.length; k++)
          anim(ps[k], [{ transform: 'scaleY(0)', opacity: 0.4 }, { transform: 'scaleY(1.07)', opacity: 1, offset: 0.72 }, { transform: 'scaleY(1)', opacity: 1 }], { duration: 950 * sl, delay: b + 220 + gi * 75 + k * 45 });
      });
      // Courbe de tendance : tracée de gauche à droite une fois les barres montées.
      var tAt = b + 220 + groups.length * 75 + 500 * sl;
      Array.prototype.forEach.call(svg.querySelectorAll('.bs-trend-halo, .bs-trend-line'), function (p) {
        var tl = 0; try { tl = p.getTotalLength(); } catch (e) {}
        if (tl) anim(p, [{ strokeDasharray: tl + ' ' + tl, strokeDashoffset: tl }, { strokeDasharray: tl + ' ' + tl, strokeDashoffset: 0 }], { duration: 750 * sl, delay: tAt, easing: EASE_IO });
      });
      Array.prototype.forEach.call(svg.querySelectorAll('.bs-trend-dot, .bs-trend-band, .bs-trend-key'), function (d) { anim(d, [{ opacity: 0 }, { opacity: 1 }], { duration: 450, delay: tAt + 650 * sl }); });
      Array.prototype.forEach.call(svg.querySelectorAll('.bs-trend-ext'), function (d) { anim(d, [{ opacity: 0 }, { opacity: 0.85 }], { duration: 450, delay: tAt + 650 * sl }); });
    } else if (line) {
      var area = svg.querySelector('[data-bs-area]') || Array.prototype.filter.call(svg.querySelectorAll('path'), function (p) { return p !== line; })[0];
      var len = 0; try { len = line.getTotalLength(); } catch (e) {}
      var D = 1150 * sl;
      var tube = svg.querySelectorAll('.bs-tube-shadow, .bs-tube-body, .bs-line, .bs-tube-hl');
      if (!tube.length) tube = [line];
      if (len) for (var u = 0; u < tube.length; u++) anim(tube[u], [{ strokeDasharray: len + ' ' + len, strokeDashoffset: len }, { strokeDasharray: len + ' ' + len, strokeDashoffset: 0 }], { duration: D, delay: b + 220, easing: EASE_IO });
      if (area) anim(area, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: D, delay: b + 220, easing: EASE_IO });
      var dots = svg.querySelectorAll('circle:not(.bs-aura)');
      Array.prototype.forEach.call(svg.querySelectorAll('.bs-aura'), function (a) { anim(a, [{ opacity: 0 }, { opacity: 0.16 }], { duration: 500, delay: b + 220 + D }); });
      for (var d = 0; d < dots.length; d++)
        anim(dots[d], [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.8)', opacity: 1, offset: 0.6 }, { transform: 'scale(1)', opacity: 1 }], { duration: 650, delay: b + 220 + D - 120 });
      attachLive(c, b + 220 + D + 500);
    }
  }
  function animHbars(el, o) {
    var b = (o && o.delay) || 0, rows = el.querySelectorAll('.hbar');
    for (var i = 0; i < rows.length; i++) {
      anim(rows[i], [{ opacity: 0, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: b + i * 70 });
      var hf = rows[i].querySelector('.hbar-fill');
      if (hf) anim(hf, [{ clipPath: 'inset(-10px 100% -10px -10px round 99px)' }, { clipPath: 'inset(-10px -10px -10px -10px round 99px)' }], { duration: 800, delay: b + 120 + i * 60 });
      else anim(rows[i].querySelector('.hbar-track path'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 1000, delay: b + 120 + i * 70 });
      countUp(rows[i].querySelector('.hbar-value'), b + 120 + i * 70, 1000);
    }
  }
  function animFunnel(el, o) {
    var b = (o && o.delay) || 0, rows = el.querySelectorAll('.funnel-row');
    for (var i = 0; i < rows.length; i++) {
      anim(rows[i], [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: b + i * 110 });
      anim(rows[i].querySelector('.funnel-bar span'), [{ clipPath: 'inset(-6px 50% -16px 50%)' }, { clipPath: 'inset(-6px -6px -16px -6px)' }], { duration: 800, delay: b + 80 + i * 100 });
      countUp(rows[i].querySelector('.funnel-value'), b + 80 + i * 110, 1000);
      anim(rows[i].querySelector('.funnel-rate'), [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: b + 700 + i * 110 });
    }
  }
  function animRing(el, o) {
    var b = (o && o.delay) || 0, arc = el.querySelector('.ring-arc');
    if (arc) {
      var da = (arc.getAttribute('stroke-dasharray') || '').split(/[ ,]+/).map(Number);
      if (da.length === 2 && isFinite(da[0]) && isFinite(da[1]))
        anim(arc, [{ strokeDasharray: '0 ' + da[1] }, { strokeDasharray: da[0] + ' ' + da[1] }], { duration: 1100, delay: b + 150 });
    }
    countUp(el.querySelector('.ring-value'), b + 150, 1100);
    var on = el.querySelectorAll('.bs-tick.on'), all = el.querySelectorAll('.bs-tick').length || 1;
    for (var t = 0; t < on.length; t++) anim(on[t], [{ opacity: 0.12 }, { opacity: 1, offset: 0.4 }, { opacity: 0.9 }], { duration: 500, delay: b + 150 + 1100 * Math.pow(t / all, 0.6) });
    anim(el.querySelector('.bs-knob'), [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1.6)', offset: 0.6 }, { opacity: 1, transform: 'scale(1)' }], { duration: 500, delay: b + 1100 });
    attachLive(el, b + 1600);
  }
  function animMeter(el, o) { anim(el.querySelector('span'), [{ clipPath: 'inset(-8px 100% -8px -8px)' }, { clipPath: 'inset(-8px -8px -8px -8px)' }], { duration: 850, delay: ((o && o.delay) || 0) + 200 }); }
  function animKpi(el, o) {
    var b = (o && o.delay) || 0;
    anim(el, [{ opacity: 0, transform: 'translateY(16px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 650, delay: b });
    countUp(el.querySelector('.kpi-value'), b + 120, 1100);
  }
  function animHeat(el, o) {
    var b = (o && o.delay) || 0, cells = el.querySelectorAll('.heat');
    for (var i = 0; i < cells.length; i++)
      anim(cells[i], [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: b + ((i % 7) + Math.floor(i / 7)) * 14 });
  }
  var KINDS = [
    ['.chart', animChart], ['.hbars', animHbars], ['.funnel', animFunnel], ['.ring', animRing],
    ['.meter', animMeter], ['.kpi', animKpi], ['.heatmap', animHeat],
  ];
  function animate(el, o) {
    for (var i = 0; i < KINDS.length; i++) if (el.matches(KINDS[i][0])) { KINDS[i][1](el, o); return; }
  }

  // Déclenchement : à l'arrivée dans l'écran, en cascade.
  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;
  var queue = [], flushTimer = null;
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); queue.push(en.target); } });
    if (queue.length && !flushTimer) flushTimer = setTimeout(flush, 30);
  }, { threshold: 0.12 }) : null;
  function flush() {
    flushTimer = null;
    var items = queue.splice(0);
    items.sort(function (a, b) {
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return (ra.top - rb.top) || (ra.left - rb.left);
    });
    items.forEach(function (el, i) { animate(el, { delay: Math.min(i, 10) * 90 }); });
  }
  function register(el) {
    if (!el || (seen && seen.has(el))) return;
    if (el.matches('.chart') && !el.querySelector('svg')) return; // le graphique n'est pas encore dessiné
    if (el.closest('#bs-pres')) return;
    if (seen) seen.add(el);
    watchLive(el);
    if (reduced()) return;
    if (io) io.observe(el); else animate(el, {});
  }
  var SEL = KINDS.map(function (k) { return k[0]; }).join(',');
  function scan(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.matches(SEL)) register(root);
    if (root.tagName.toLowerCase() === 'svg' && root.parentNode && root.parentNode.matches && root.parentNode.matches('.chart')) register(root.parentNode);
    var list = root.querySelectorAll(SEL);
    for (var i = 0; i < list.length; i++) register(list[i]);
  }

  // Cascade des cartes à chaque changement de page.
  var lastPage = null;
  function cascade() {
    var main = document.getElementById('main');
    if (!main || reduced()) return;
    var first = main.firstElementChild;
    if (!first || first === lastPage) return;
    lastPage = first;
    var cards = main.querySelectorAll('.card');
    var vh = window.innerHeight, n = 0;
    for (var i = 0; i < cards.length && n < 14; i++) {
      var r = cards[i].getBoundingClientRect();
      if (r.top > vh) continue;
      anim(cards[i], [{ opacity: 0, transform: 'translateY(22px) scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 60 + n * 70 });
      n++;
    }
  }

  // ---------------------------------------------------------------- mouvement permanent (comètes)
  // Une copie lumineuse de la courbe (ou de l'anneau) est posée par-dessus, dans un calque à part :
  // le graphique d'origine n'est pas modifié. Le calque suit les changements de données et de taille.
  var SVGNS = 'http://www.w3.org/2000/svg';
  var lives = [], watched = [], tick = null;
  function svgEl(tag, attrs) { var el = document.createElementNS(SVGNS, tag); for (var k in attrs) el.setAttribute(k, attrs[k]); return el; }
  function liveSrc(L) {
    var svg = L.host.querySelector('svg:not(.bs-live)');
    return svg && { svg: svg, el: L.kind === 'ring' ? svg.querySelector('.ring-arc') : svg.querySelector('path[stroke]:not([stroke="none"])') };
  }
  function liveKey(L, src) {
    var r = src.svg.getBoundingClientRect();
    return [src.el.getAttribute('d') || src.el.getAttribute('stroke-dasharray'), src.el.getAttribute('stroke'), Math.round(r.width), Math.round(r.height)].join('|');
  }
  // Comète : une traînée longue et pâle + une tête courte et blanche, qui partagent le même front.
  function comet(ov, geo, len, travel, o) {
    var layers = [
      { w: o.width * 3.4, color: o.color, op: 0.45, a: Math.min(len * 0.5, o.seg * 2.2), blur: 3.5 },
      { w: o.width * 1.7, color: o.color, op: 0.85, a: o.seg },
      { w: o.width, color: '#fff', op: 1, a: Math.max(12, o.seg * 0.45), glow: o.color },
    ];
    var amax = layers[0].a, anims = [];
    layers.forEach(function (ly) {
      var el = geo.cloneNode(false);
      ['class', 'opacity', 'filter', 'fill'].forEach(function (k) { el.removeAttribute(k); });
      el.setAttribute('fill', 'none'); el.setAttribute('stroke', ly.color); el.setAttribute('stroke-width', ly.w);
      el.setAttribute('stroke-linecap', 'round'); el.setAttribute('stroke-linejoin', 'round');
      el.setAttribute('stroke-dasharray', ly.a + ' ' + (len * 3 + amax));
      el.style.opacity = '0';
      el.style.filter = ly.blur ? 'blur(' + ly.blur + 'px)' : ly.glow ? 'drop-shadow(0 0 6px ' + ly.glow + ')' : 'none';
      ov.appendChild(el);
      var end = travel + (o.overrun ? amax : 0);
      var a = el.animate([
        { strokeDashoffset: ly.a, opacity: 0, offset: 0 },
        { strokeDashoffset: ly.a - end * 0.06, opacity: ly.op, offset: 0.04 },
        { strokeDashoffset: ly.a - end * 0.94, opacity: ly.op, offset: o.share - 0.04 },
        { strokeDashoffset: ly.a - end, opacity: 0, offset: o.share },
        { strokeDashoffset: ly.a - end, opacity: 0, offset: 1 },
      ], { duration: o.period, delay: o.delay, iterations: Infinity, easing: 'linear' });
      anims.push(a);
    });
    return anims;
  }
  function buildLive(L) {
    L.anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
    L.anims = [];
    if (L.ov) { L.ov.remove(); L.ov = null; }
    var src = liveSrc(L);
    if (!src || !src.el) { L.key = ''; return; }
    L.key = liveKey(L, src);
    var hr = L.host.getBoundingClientRect(), sr = src.svg.getBoundingClientRect();
    var k = L.host.offsetWidth ? hr.width / L.host.offsetWidth : 1;
    if (!sr.width || !sr.height || !k) return;
    var w = src.svg.getAttribute('width'), h = src.svg.getAttribute('height');
    var vb = src.svg.getAttribute('viewBox') || (w && h ? '0 0 ' + w + ' ' + h : null);
    var ov = svgEl('svg', { 'class': 'bs-live', 'aria-hidden': 'true', focusable: 'false' });
    if (vb) ov.setAttribute('viewBox', vb);
    ov.style.left = (sr.left - hr.left) / k + 'px'; ov.style.top = (sr.top - hr.top) / k + 'px';
    ov.style.width = sr.width / k + 'px'; ov.style.height = sr.height / k + 'px';
    var delay = Math.max(0, L.start - performance.now());
    if (L.kind === 'line') {
      var len = 0; try { len = src.el.getTotalLength(); } catch (e) {}
      if (len < 30) return;
      var color = src.el.getAttribute('data-color') || src.el.getAttribute('stroke') || 'currentColor';
      L.anims = comet(ov, src.el, len, len, { color: color, width: 3, seg: Math.max(34, Math.min(120, len * 0.12)), period: Math.max(4200, Math.min(7000, len * 7)), share: 0.62, delay: delay, overrun: true });
      // Onde qui part du dernier point (la valeur du jour).
      var end = null; try { end = src.el.getPointAtLength(len); } catch (e) {}
      if (end) {
        for (var i = 0; i < 2; i++) {
          var ring = svgEl('circle', { cx: end.x.toFixed(1), cy: end.y.toFixed(1), r: '4.6', fill: 'none', stroke: color, 'stroke-width': '2', 'vector-effect': 'non-scaling-stroke' });
          ring.style.transformBox = 'fill-box'; ring.style.transformOrigin = '50% 50%'; ring.style.opacity = '0';
          ov.appendChild(ring);
          L.anims.push(ring.animate([{ transform: 'scale(1)', opacity: 0.85 }, { transform: 'scale(4.2)', opacity: 0 }],
            { duration: 2600, delay: delay + 400 + i * 1300, iterations: Infinity, easing: 'cubic-bezier(.2,.6,.3,1)' }));
        }
      }
    } else {
      var da = (src.el.getAttribute('stroke-dasharray') || '').split(/[ ,]+/).map(Number);
      if (da.length < 2 || !(da[0] > 40)) return; // arc trop court : la lueur de l'anneau suffit
      L.anims = comet(ov, src.el, da[1], da[0], { color: '#fff', width: Number(src.el.getAttribute('stroke-width')) * 0.5 || 5, seg: Math.min(da[0] * 0.35, da[1] * 0.12), period: 4600, share: 0.55, delay: delay, overrun: false });
    }
    L.host.appendChild(ov);
    L.ov = ov;
    if (L.host.hasAttribute('data-bs-idle')) L.anims.forEach(function (a) { a.pause(); });
  }
  function attachLive(host, delay) {
    if (!MOUVEMENT || !host || host.__bsLive || reduced() || !document.body.animate) return;
    var kind = host.matches('.ring') ? 'ring' : host.matches('.chart') ? 'line' : null;
    if (!kind) return;
    var L = { host: host, kind: kind, ov: null, key: '', anims: [], start: performance.now() + (delay || 0) };
    host.__bsLive = L;
    lives.push(L);
    buildLive(L);
    startTick();
  }
  // Mise en pause hors écran (barres, jauges, comètes…).
  var liveIo = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var el = en.target, L = el.__bsLive;
      if (en.isIntersecting) el.removeAttribute('data-bs-idle'); else el.setAttribute('data-bs-idle', '');
      if (L) L.anims.forEach(function (a) { try { if (en.isIntersecting) a.play(); else a.pause(); } catch (e) {} });
    });
  }, { rootMargin: '80px' }) : null;
  function watchLive(el) {
    if (!MOUVEMENT || !liveIo || el.__bsWatch) return;
    el.__bsWatch = 1; watched.push(el); liveIo.observe(el);
    startTick();
  }
  function startTick() {
    if (tick) return;
    tick = setInterval(function () {
      var red = reduced();
      lives = lives.filter(function (L) {
        if (!L.host.isConnected || red) {
          L.anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
          if (L.ov) L.ov.remove();
          L.host.__bsLive = null;
          return false;
        }
        var src = liveSrc(L);
        if (!src || !src.el) { if (L.ov) buildLive(L); }
        else if (liveKey(L, src) !== L.key) buildLive(L);
        return true;
      });
      watched = watched.filter(function (el) { if (el.isConnected) return true; liveIo.unobserve(el); el.__bsWatch = 0; return false; });
      if (!lives.length && !watched.length) { clearInterval(tick); tick = null; }
    }, 1500);
  }

  // ---------------------------------------------------------------- bouton « Présenter »
  var PLAY = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  function presentable() {
    var main = document.getElementById('main');
    return !!(main && main.querySelector('.chart svg, .hbars, .funnel'));
  }
  function decorate() {
    var main = document.getElementById('main');
    if (!main) return;
    var head = main.querySelector('.page-head');
    if (!head || head.querySelector('.bs-pres-btn') || !presentable()) return;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'bs-pres-btn'; b.title = 'Mode présentation : diaporama plein écran (touche P)';
    b.innerHTML = PLAY + '<span>Présenter</span><kbd>P</kbd>';
    b.addEventListener('click', function () { present(); });
    (head.querySelector('.page-actions') || head).appendChild(b);
  }

  // ---------------------------------------------------------------- mode présentation
  var P = null; // état de la présentation en cours
  var ICON = {
    prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>',
    next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>',
    pause: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    play: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z"/></svg>',
    full: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  };

  function moneyLike(samples) { return samples.some(function (s) { return /€/.test(s || ''); }); }
  function fmtNum(v, money) {
    try {
      return money ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
        : new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(v);
    } catch (e) { return String(Math.round(v)); }
  }
  function pct(v) { return (v > 0 ? '+' : '') + new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(v) + ' %'; }

  // Chiffres clés d'un graphique (données exposées par l'interface dans data-bsc).
  function chartInsights(card) {
    var out = [];
    var c = card.querySelector('.chart[data-bsc]');
    var d = c && parseJson(c.getAttribute('data-bsc'));
    if (d && d.d && d.d.length) {
      var pts = d.d, vals = pts.map(function (p) { return Number(p.v && p.v[0]) || 0; }), n = vals.length;
      var money = moneyLike(pts.map(function (p) { return p.f && p.f[0]; }));
      var label = d.s && d.s.length > 1 ? ' · ' + d.s[0] : '';
      var labels = pts.map(function (p) { return String(p.l || ''); }).join(' ');
      // Série dans le temps (jours, semaines, mois) ou catégories (heures, sources…) ; valeurs en % ou non.
      var per = /lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche/i.test(labels) ? ['jour', 'Meilleur jour', 'Dernier jour vs veille', 'par jour']
        : /\bsem/i.test(labels) ? ['semaine', 'Meilleure semaine', 'Dernière semaine vs précédente', 'par semaine']
        : /janv|f[ée]vr|mars|avr|mai|juin|juil|ao[ûu]t|sept|oct|nov|d[ée]c/i.test(labels) ? ['mois', 'Meilleur mois', 'Dernier mois vs précédent', 'par mois']
        : null;
      var isPct = pts.some(function (p) { return /%/.test((p.f && p.f[0]) || ''); });
      var shown = function (i) { return pts[i].f ? pts[i].f[0] : fmtNum(vals[i], money); };
      if (d.t === 'bar') {
        var total = vals.reduce(function (a, b) { return a + b; }, 0), best = vals.indexOf(Math.max.apply(null, vals));
        var bestK = per ? per[1] : 'En tête';
        if (isPct) {
          var nums = pts.map(function (p) { return parseFloat(String((p.f && p.f[0]) || '').replace(/[ \u00a0\u202f]/g, '').replace(',', '.')) || 0; });
          var nz = nums.filter(function (v) { return v > 0; });
          var avg = nz.length ? nz.reduce(function (a, b) { return a + b; }, 0) / nz.length : 0;
          if (vals[best] > 0) out.push({ k: bestK, v: pts[best].l + ' · ' + shown(best), big: true });
          if (nz.length > 1) {
            var lo = nums.indexOf(Math.min.apply(null, nz));
            out.push({ k: 'Moyenne', v: new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(avg) + ' %' });
            out.push({ k: 'Le plus faible', v: pts[lo].l + ' · ' + shown(lo) });
          }
        } else {
          out.push({ k: 'Total' + (per ? ' sur la période' : '') + label, v: fmtNum(total, money), big: true });
          if (vals[best] > 0) out.push({ k: bestK, v: pts[best].l + ' · ' + shown(best) });
          // Une dernière période à zéro est souvent en cours (mois commencé) : on montre alors la moyenne.
          if (per && n > 1 && vals[n - 2] > 0 && vals[n - 1] > 0) {
            var evo = (vals[n - 1] - vals[n - 2]) / vals[n - 2] * 100;
            out.push({ k: per[2], v: pct(evo), tone: evo >= 0 ? 'up' : 'down' });
          } else if (n > 1) {
            var used = per ? n : vals.filter(function (v) { return v > 0; }).length || 1;
            out.push({ k: 'Moyenne ' + (per ? per[3] : ''), v: fmtNum(total / used, money) });
          }
          // Courbe de tendance du graphique : sa pente remplace la comparaison avec la période précédente.
          var tr = card.querySelector('.bs-trend-t');
          if (tr) out.splice(2, 1, { k: 'Tendance', v: tr.textContent.replace(/^Tendances?\s*/, ''), tone: /\u2197/.test(tr.textContent) ? 'up' : /\u2198/.test(tr.textContent) ? 'down' : undefined });
        }
      } else {
        var lastF = pts[n - 1].f ? pts[n - 1].f[0] : fmtNum(vals[n - 1], money);
        out.push({ k: 'Aujourd’hui', v: lastF, big: true });
        var firstIdx = vals.findIndex(function (v) { return v > 0; });
        if (firstIdx >= 0 && firstIdx < n - 1) {
          var ev = (vals[n - 1] - vals[firstIdx]) / vals[firstIdx] * 100;
          out.push({ k: 'Depuis ' + pts[firstIdx].l, v: pct(ev), tone: ev >= 0 ? 'up' : 'down' });
        }
        var mx = vals.indexOf(Math.max.apply(null, vals));
        if (vals[n - 1] < vals[mx] && vals[mx] > 0) out.push({ k: 'Plus haut', v: pts[mx].l + ' · ' + (pts[mx].f ? pts[mx].f[0] : '') });
        else if (n > 1) out.push({ k: 'Record', v: 'Niveau le plus haut atteint', tone: 'up' });
      }
      return out;
    }
    var hb = card.querySelectorAll('.hbar');
    if (hb.length) {
      var top = hb[0];
      out.push({ k: 'En tête', v: txt(top.querySelector('.hbar-label')), big: true });
      out.push({ k: 'Valeur', v: txt(top.querySelector('.hbar-value')) });
      if (hb.length > 1) out.push({ k: 'En 2e position', v: txt(hb[1].querySelector('.hbar-label')) + ' · ' + txt(hb[1].querySelector('.hbar-value')) });
      return out;
    }
    var fr = card.querySelectorAll('.funnel-row');
    if (fr.length > 1) {
      var num = function (r) { return Number(txt(r.querySelector('.funnel-value')).replace(/[^\d]/g, '')) || 0; };
      var a = num(fr[0]), z = num(fr[fr.length - 1]);
      var la = txt(fr[0].querySelector('.funnel-label')), lz = txt(fr[fr.length - 1].querySelector('.funnel-label'));
      out.push({ k: la + ' → ' + lz, v: a ? pct(z / a * 100).replace('+', '') : '—', big: true });
      out.push({ k: la, v: txt(fr[0].querySelector('.funnel-value')) });
      out.push({ k: lz, v: txt(fr[fr.length - 1].querySelector('.funnel-value')) });
      return out;
    }
    var rv = card.querySelector('.ring-value');
    if (rv) out.push({ k: txt(card.querySelector('.ring-sub')) || 'Progression', v: txt(rv), big: true });
    return out;
  }

  function buildSlides() {
    var main = document.getElementById('main');
    var title = txt(main.querySelector('.page-title')) || 'Tableau de bord';
    var sub = txt(main.querySelector('.page-sub'));
    var slides = [{ type: 'title', title: title, sub: sub }];
    var kpis = Array.prototype.slice.call(main.querySelectorAll('.kpi'));
    if (kpis.length) slides.push({ type: 'kpis', kpis: kpis });
    Array.prototype.forEach.call(main.querySelectorAll('.card'), function (card) {
      if (!card.querySelector('.chart svg, .hbars .hbar, .funnel .funnel-row, .ring')) return;
      slides.push({ type: 'chart', card: card, title: txt(card.querySelector('.card-title')), sub: txt(card.querySelector('.card-sub')), ins: chartInsights(card) });
    });
    slides.push({ type: 'end', title: title });
    return slides;
  }
  function companyName() {
    var s = window.__bs && window.__bs.R ? window.__bs.R : window.__bsStore;
    try { var st = s && s.get && s.get(); return (st && st.companyInfo && st.companyInfo.nom) || 'Blackstart AI'; } catch (e) { return 'Blackstart AI'; }
  }

  function present() {
    if (P || !presentable()) return;
    ensureCss();
    var slides = buildSlides();
    var root = document.createElement('div');
    root.id = 'bs-pres'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Mode présentation');
    root.setAttribute('data-scheme', document.documentElement.getAttribute('data-scheme') || 'dark');
    var img = getComputedStyle(document.documentElement).getPropertyValue('--bs-amb-img').trim();
    root.innerHTML =
      (img && img !== 'none' ? '<div class="p-bg"></div>' : '<div class="p-aurora"></div>') +
      '<div class="p-shade"></div>' +
      '<div class="p-top"><div class="p-prog">' + slides.map(function () { return '<div class="p-seg"><i></i></div>'; }).join('') + '</div>' +
      '<div class="p-head"><span>' + esc(companyName()) + '</span><span class="p-count"></span></div></div>' +
      '<div class="p-stage"></div>' +
      '<div class="p-bottom"><div class="p-ctrl">' +
      '<button class="p-ic" data-p="prev" title="Précédente (←)">' + ICON.prev + '</button>' +
      '<button class="p-ic" data-p="play" title="Pause (Espace)">' + ICON.pause + '</button>' +
      '<button class="p-ic" data-p="next" title="Suivante (→)">' + ICON.next + '</button></div>' +
      '<div class="p-ctrl">' +
      '<button class="p-ic" data-p="full" title="Plein écran (F)">' + ICON.full + '</button>' +
      '<button class="p-ic" data-p="close" title="Quitter (Échap)">' + ICON.close + '</button></div></div>';
    if (img && img !== 'none') root.querySelector('.p-bg').style.backgroundImage = img;
    document.body.appendChild(root);
    document.documentElement.setAttribute('data-bs-pres', '');
    P = { root: root, slides: slides, i: -1, playing: true, timer: null, idle: null, cur: null, prog: null };
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-p]');
      if (!b) { if (!e.target.closest('.p-slide button, .s-actions')) go(P.i + 1); return; }
      var a = b.getAttribute('data-p');
      if (a === 'prev') go(P.i - 1);
      else if (a === 'next') go(P.i + 1);
      else if (a === 'play') togglePlay();
      else if (a === 'full') toggleFull();
      else if (a === 'close') stop();
      else if (a === 'copy') copySummary(b);
      else if (a === 'restart') go(0);
    });
    root.addEventListener('mousemove', wake);
    requestAnimationFrame(function () { root.classList.add('on'); });
    if (root.requestFullscreen) root.requestFullscreen().catch(function () {});
    wake();
    go(0);
  }

  function wake() {
    if (!P) return;
    P.root.classList.remove('idle'); clearTimeout(P.idle);
    P.idle = setTimeout(function () { P && P.root.classList.add('idle'); }, 3000);
  }
  function unidle(el) {
    el.removeAttribute('data-bs-idle');
    Array.prototype.forEach.call(el.querySelectorAll('[data-bs-idle]'), function (x) { x.removeAttribute('data-bs-idle'); });
  }
  function renderSlide(s, idx) {
    var el = document.createElement('div'); el.className = 'p-slide';
    if (s.type === 'title') {
      var d = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      el.innerHTML = '<div class="s-title"><div class="s-eyebrow">' + esc(companyName()) + ' · Présentation</div>' +
        '<div class="s-h">' + Array.prototype.map.call(s.title, function (ch) { return '<span>' + esc(ch) + '</span>'; }).join('') + '</div>' +
        '<div class="s-date">' + esc(d) + '</div><div class="s-line"></div>' +
        '<div class="s-hint">→ diapositive suivante · Espace pause · Échap quitter</div></div>';
    } else if (s.type === 'kpis') {
      el.innerHTML = '<div class="s-kpis"><div class="s-kh">Les chiffres clés</div><div class="s-kgrid"></div></div>';
      var grid = el.querySelector('.s-kgrid');
      s.kpis.forEach(function (k) { var c = k.cloneNode(true); unidle(c); grid.appendChild(c); });
    } else if (s.type === 'chart') {
      el.innerHTML = '<div class="s-chart"><div class="s-panel"><div><div class="s-ch">' + esc(s.title) + '</div>' + (s.sub ? '<div class="s-cs">' + esc(s.sub) + '</div>' : '') + '</div><div class="s-viz"></div></div>' +
        '<div class="s-ins">' + s.ins.map(function (x) {
          return '<div class="s-card' + (x.big && String(x.v).length <= 14 ? ' big' : '') + '"><div class="k">' + esc(x.k) + '</div><div class="v' + (x.tone ? ' ' + x.tone : '') + '">' + esc(x.v) + '</div></div>';
        }).join('') + '</div></div>';
      var viz = el.querySelector('.s-viz');
      Array.prototype.forEach.call(s.card.children, function (ch) {
        if (ch.classList.contains('card-head')) return;
        var cl = ch.cloneNode(true);
        Array.prototype.forEach.call(cl.querySelectorAll('.chart-tip, .bs-live'), function (t) { t.remove(); });
        unidle(cl);
        Array.prototype.forEach.call(cl.querySelectorAll('.chart svg'), function (svg) {
          var w = Number(svg.getAttribute('width')), h = Number(svg.getAttribute('height'));
          if (w && h) {
            svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h); svg.removeAttribute('width'); svg.removeAttribute('height');
            if (w / h > 2.6) el.querySelector('.s-chart').classList.add('wide'); // graphique très large : pleine largeur
          }
        });
        viz.appendChild(cl);
      });
      if (!s.ins.length) el.querySelector('.s-chart').style.gridTemplateColumns = '1fr';
    } else {
      var all = [];
      P.slides.forEach(function (sl) { if (sl.type === 'chart' && sl.ins[0]) all.push({ t: sl.title, v: sl.ins.slice(0, 2).map(function (x) { return x.k + ' : ' + x.v; }).join(' · ') }); });
      el.innerHTML = '<div class="s-end"><div class="s-kh">En résumé</div><ul>' + all.map(function (a) { return '<li><b>' + esc(a.t) + '</b>' + esc(a.v) + '</li>'; }).join('') + '</ul>' +
        '<div class="s-actions"><button class="s-btn" data-p="copy">Copier le résumé</button><button class="s-btn ghost" data-p="restart">Revoir la présentation</button><button class="s-btn ghost" data-p="close">Terminer</button></div></div>';
      P.summary = s.title + ' — ' + new Date().toLocaleDateString('fr-FR') + '\n' + all.map(function (a) { return '• ' + a.t + ' : ' + a.v; }).join('\n');
    }
    return el;
  }
  function enter(el, s, dir) {
    var stage = P.root.querySelector('.p-stage');
    stage.appendChild(el);
    anim(el, [{ opacity: 0, transform: 'translateX(' + (dir * 70) + 'px) rotateY(' + (-dir * 9) + 'deg) scale(.95)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 850 });
    if (s.type === 'title') {
      var chars = el.querySelectorAll('.s-h span');
      for (var i = 0; i < chars.length; i++) anim(chars[i], [{ opacity: 0, transform: 'translateY(40px) rotate(6deg)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 800, delay: 250 + i * 38 });
      anim(el.querySelector('.s-date'), [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 500 + chars.length * 38 });
      anim(el.querySelector('.s-line'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 900, delay: 650 + chars.length * 38 });
    } else if (s.type === 'kpis') {
      Array.prototype.forEach.call(el.querySelectorAll('.kpi'), function (k, i) { animKpi(k, { delay: 300 + i * 110 }); });
    } else if (s.type === 'chart') {
      var viz = el.querySelector('.s-viz');
      Array.prototype.forEach.call(viz.querySelectorAll(SEL), function (v) {
        if (v.matches('.chart')) animChart(v, { delay: 350, slow: true }); else animate(v, { delay: 350 });
      });
      Array.prototype.forEach.call(el.querySelectorAll('.s-card'), function (c, i) {
        anim(c, [{ opacity: 0, transform: 'translateX(30px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 900 + i * 260 });
        countUp(c.querySelector('.v'), 900 + i * 260, 1200);
      });
    } else {
      Array.prototype.forEach.call(el.querySelectorAll('li'), function (li, i) { anim(li, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 250 + i * 120 }); });
    }
  }
  function go(n) {
    if (!P) return;
    if (n >= P.slides.length) { if (P.i === P.slides.length - 1) return; n = P.slides.length - 1; }
    if (n < 0 || n === P.i) return;
    var dir = n > P.i ? 1 : -1;
    clearTimeout(P.timer);
    if (P.cur) {
      var old = P.cur;
      var a = anim(old, [{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'translateX(' + (-dir * 60) + 'px) scale(.97)', filter: 'blur(8px)' }], { duration: 450, fill: 'forwards', easing: 'ease-in' });
      if (a) a.onfinish = function () { old.remove(); }; else old.remove();
    }
    P.i = n;
    var s = P.slides[n], el = renderSlide(s, n);
    P.cur = el;
    enter(el, s, dir);
    // Progression
    var segs = P.root.querySelectorAll('.p-seg');
    for (var i = 0; i < segs.length; i++) {
      segs[i].classList.toggle('done', i < n);
      var bar = segs[i].querySelector('i');
      bar.getAnimations && bar.getAnimations().forEach(function (x) { x.cancel(); });
      if (i > n) bar.style.width = '';
    }
    P.root.querySelector('.p-count').textContent = (n + 1) + ' / ' + P.slides.length;
    schedule();
  }
  function schedule() {
    if (!P) return;
    clearTimeout(P.timer);
    var n = P.i, s = P.slides[n], last = n === P.slides.length - 1;
    var bar = P.root.querySelectorAll('.p-seg')[n].querySelector('i');
    if (!P.playing) return;
    // Durée d'affichage : le temps de lire les chiffres clés (plus long pour un graphique et pour le résumé).
    var est = s.type === 'title' ? 5500 : s.type === 'end' ? 9000 : s.type === 'kpis' ? 7000 : 8500;
    P.prog = anim(bar, [{ width: '0%' }, { width: '100%' }], { duration: est, fill: 'forwards', easing: 'linear' });
    P.timer = setTimeout(function () { if (P && P.i === n && P.playing && !last) go(n + 1); }, est);
  }
  function togglePlay() {
    P.playing = !P.playing;
    var b = P.root.querySelector('[data-p="play"]');
    b.innerHTML = P.playing ? ICON.pause : ICON.play; b.title = P.playing ? 'Pause (Espace)' : 'Lecture (Espace)';
    if (!P.playing) { clearTimeout(P.timer); if (P.prog) try { P.prog.pause(); } catch (e) {} }
    else schedule();
  }
  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    else if (P && P.root.requestFullscreen) P.root.requestFullscreen().catch(function () {});
  }
  function copySummary(btn) {
    var t = P && P.summary; if (!t) return;
    var ok = function () { btn.textContent = 'Résumé copié ✓'; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, function () { fallback(); });
    else fallback();
    function fallback() { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) {} ta.remove(); }
  }
  function stop() {
    if (!P) return;
    clearTimeout(P.timer); clearTimeout(P.idle);
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    var r = P.root; P = null;
    document.documentElement.removeAttribute('data-bs-pres');
    r.classList.remove('on'); setTimeout(function () { r.remove(); }, 450);
  }

  document.addEventListener('keydown', function (e) {
    if (P) {
      var k = e.key;
      if (k === 'Escape') { e.preventDefault(); stop(); }
      else if (k === 'ArrowRight' || k === 'PageDown' || k === 'Enter') { e.preventDefault(); go(P.i + 1); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(P.i - 1); }
      else if (k === ' ') { e.preventDefault(); togglePlay(); }
      else if (k === 'f' || k === 'F') { e.preventDefault(); toggleFull(); }
      else if (k === 'Home') { e.preventDefault(); go(0); }
      e.stopPropagation();
      wake();
      return;
    }
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable) || e.ctrlKey || e.metaKey || e.altKey) return;
    if ((e.key === 'p' || e.key === 'P') && presentable() && !document.getElementById('bs-amb-zen') && !document.querySelector('[role="dialog"]:not(#bs-pres), .modal, .overlay')) {
      e.preventDefault(); e.stopPropagation(); present();
    }
  }, true);
  // Si l'utilisateur quitte le plein écran avec Échap, la présentation reste ouverte (Échap une 2e fois pour quitter).

  // ---------------------------------------------------------------- démarrage
  function start() {
    ensureCss();
    var root = document.getElementById('root');
    if (!root) { setTimeout(start, 200); return; }
    var pending = [], timer = null;
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) for (var j = 0; j < muts[i].addedNodes.length; j++) pending.push(muts[i].addedNodes[j]);
      if (!timer) timer = requestAnimationFrame(function () {
        timer = null;
        var nodes = pending.splice(0);
        cascade();
        nodes.forEach(scan);
        decorate();
      });
    });
    mo.observe(root, { childList: true, subtree: true });
    scan(root); cascade(); decorate();
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);

  window.bsAnim = { present: present, animate: animate, countUp: countUp, _insights: chartInsights };
})();

