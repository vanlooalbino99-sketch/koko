
/* Blackstart CRM : courbe de tendance sur les graphiques en barres (dessin plat, sans relief).
 *
 * - Une droite des moindres carrés par série (au plus 3), dès 3 périodes avec au moins deux valeurs non nulles.
 * - Prolongée en pointillés jusqu'au bord : la direction que prend la série.
 * - Une seule série : fuseau discret autour de la droite (± une erreur type) quand il aide à lire.
 * - Légende en haut du graphique avec la pente par période (« Tendance ↗ +4,6 / mois ») ; l'infobulle d'une
 *   barre ajoute la valeur de la tendance pour cette période.
 * L'interface appelle window.bsTendance.utile / trace / lignes depuis son graphique en barres ;
 * sans ce module, le graphique s'affiche sans tendance.
 */
(function () {
  'use strict';
  if (window.bsTendance) return;

  function num(v) { return Number(v) || 0; }
  function f1(v) { return Math.round(v * 10) / 10; }
  function mix(c, p, other) { return 'color-mix(in srgb, ' + c + ' ' + p + '%, ' + (other || 'transparent') + ')'; }
  function textW(s, size) { return String(s).length * size * 0.62 + 4; }

  // Droite des moindres carrés sur toutes les périodes affichées.
  function regress(ys) {
    var n = ys.length, sx = 0, sy = 0, sxx = 0, sxy = 0, i;
    for (i = 0; i < n; i++) { sx += i; sy += ys[i]; sxx += i * i; sxy += i * ys[i]; }
    var den = n * sxx - sx * sx;
    if (n < 3 || !den) return null;
    var a = (n * sxy - sx * sy) / den, b0 = (sy - a * sx) / n, mean = sy / n, ssT = 0, ssR = 0;
    for (i = 0; i < n; i++) { ssT += (ys[i] - mean) * (ys[i] - mean); ssR += (ys[i] - (b0 + a * i)) * (ys[i] - (b0 + a * i)); }
    // Marge d'incertitude de la droite (± une erreur type) : étroite au centre, plus large aux extrémités.
    var mx = sx / n, sxc = sxx - n * mx * mx, sd = n > 3 ? Math.sqrt(ssR / (n - 2)) : 0;
    return { a: a, b: b0, mean: mean, r2: ssT ? 1 - ssR / ssT : 1, at: function (x) { return b0 + a * x; },
      se: function (x) { return sd * Math.sqrt(1 / n + (x - mx) * (x - mx) / sxc); } };
  }
  var MOIS = ['janv', 'fevr', 'fev', 'mars', 'avr', 'mai', 'juin', 'juil', 'aout', 'sept', 'oct', 'nov', 'dec'];
  function periodOf(data) {
    var d0 = data[0] || {}, lab = String(d0.label || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ.]/g, '').trim();
    var tip = String(d0.tipLabel || '').toLowerCase();
    if (MOIS.indexOf(lab.split(' ')[0]) >= 0) return 'mois';
    if (/lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche/.test(tip + ' ' + lab) || /^\d{1,2}$/.test(lab)) return 'jour';
    if (/^(s|sem)\s?\d/.test(lab)) return 'semaine';
    if (/\d\s?h/.test(lab)) return 'créneau';
    return 'période';
  }
  function fv(s, fmt, raw) { return s.fmt ? s.fmt(raw) : fmt(raw); }
  // Pente lisible (« +1 250 € », « +4,6 ») ; '' quand elle s'arrondit à zéro : la série est stable.
  function slopeTxt(a, s, fmt) {
    var abs = Math.abs(a), sign = a > 0 ? '+' : '−';
    if (s.fmt ? Math.round(abs) === 0 : Math.round(abs * 10) === 0) return '';
    return sign + (s.fmt ? fv(s, fmt, Math.round(abs)) : abs.toLocaleString('fr-FR', { maximumFractionDigits: abs < 10 ? 1 : 0 }));
  }
  // Coupe le segment (x0,v0)–(x1,v1) aux valeurs [0, vmax] pour rester dans la zone du graphique.
  function clipSeg(x0, v0, x1, v1, vmax) {
    var t0 = 0, t1 = 1, dv = v1 - v0;
    [[0, 1], [vmax, -1]].forEach(function (lim) {
      var b = lim[0], dir = lim[1];
      if (!dv) { if ((v0 - b) * dir < 0) t1 = -1; return; }
      var t = (b - v0) / dv;
      if (dv * dir > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    });
    if (t1 <= t0) return null;
    return [x0 + (x1 - x0) * t0, v0 + dv * t0, x0 + (x1 - x0) * t1, v0 + dv * t1];
  }

  function trends(data, series) {
    if (!data || data.length < 3 || !series || !series.length || series.length > 3) return [];
    return series.map(function (s, k) {
      var ys = data.map(function (d) { return num(d[s.key]); });
      if (ys.filter(function (y) { return y > 0; }).length < 2) return null;
      var rg = regress(ys); if (rg) rg.k = k;
      return rg;
    }).filter(Boolean);
  }
  function couleur(series, k) { return series.length === 1 ? 'var(--bs-tr)' : mix(series[k].color, 62, '#fff'); }

  // Vrai quand le graphique aura une tendance (il réserve alors la place de la légende en haut).
  function utile(data, series) { return trends(data, series).length > 0; }

  // Calque SVG de la tendance. o : e (createElement), data, series, format, L (bord gauche), W (largeur),
  // slot (largeur d'une période), gw (largeur d'un groupe de barres), bw (largeur d'une barre), gap, Y (valeur → y), max.
  function trace(o) {
    var e = o.e, data = o.data, series = o.series, fmt = o.format, list = trends(data, series);
    if (!list.length || !(o.W > 0) || !(o.slot > 0)) return null;
    var n = data.length, one = series.length === 1, Y = o.Y, max = o.max, right = o.W - 4;
    var cx0 = function (k) { return o.L + (o.slot - o.gw) / 2 + k * (o.bw + o.gap) + o.bw / 2; };
    var tg = [], titles = [], unit = periodOf(data);
    list.forEach(function (rg) {
      var k = rg.k, col = couleur(series, k);
      var X = function (t) { return cx0(k) + o.slot * t; };
      var seg = clipSeg(0, rg.at(0), n - 1, rg.at(n - 1), max);
      if (!seg) return;
      var x0 = X(seg[0]), y0 = Y(seg[1]), x1 = X(seg[2]), y1 = Y(seg[3]);
      var dd = 'M' + f1(x0) + ',' + f1(y0) + 'L' + f1(x1) + ',' + f1(y1);
      // Prolongement en pointillés jusqu'au bord droit.
      var tEnd = n - 1 + Math.max(0, right - X(n - 1)) / o.slot;
      var ext = seg[2] >= n - 1 - 1e-6 && tEnd > n - 1 + 0.05 ? clipSeg(n - 1, rg.at(n - 1), tEnd, rg.at(tEnd), max) : null;
      var de = ext ? 'M' + f1(x1) + ',' + f1(y1) + 'L' + f1(X(ext[2])) + ',' + f1(Y(ext[3])) : '';
      // Fuseau d'incertitude (une seule série), affiché seulement quand il aide à lire.
      var band = '';
      if (one && n >= 4 && rg.se(0) > 0 && (rg.r2 >= 0.25 || Math.max(rg.se(0), rg.se(n - 1)) <= 0.22 * max)) {
        var xs = seg[0], xe = ext ? ext[2] : seg[2], up = [], lo = [], st = 18;
        for (var q = 0; q <= st; q++) {
          var t = xs + (xe - xs) * q / st, m = rg.at(t), h = rg.se(t);
          up.push(f1(X(t)) + ',' + f1(Y(Math.max(0, Math.min(max, m + h)))));
          lo.unshift(f1(X(t)) + ',' + f1(Y(Math.max(0, Math.min(max, m - h)))));
        }
        band = 'M' + up.join('L') + 'L' + lo.join('L') + 'Z';
      }
      var sl = slopeTxt(rg.a, series[k], fmt);
      titles.push((one ? 'Tendance' : 'Tendance ' + series[k].label) + ' : ' + (sl ? sl + ' par ' + unit : 'stable') +
        ' (droite des moindres carrés sur ' + n + ' ' + (unit === 'mois' ? 'mois' : unit + 's') + ', R² = ' +
        rg.r2.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) + ')' +
        (band ? '\nZone teintée : marge d’incertitude de la tendance (± une erreur type).' : ''));
      tg.push(e('g', { class: 'bs-trend', style: { '--bs-tc': col }, children: [
        band && e('path', { d: band, class: 'bs-trend-band' }),
        e('path', { d: dd, class: 'bs-trend-halo' }),
        de && e('path', { d: de, class: 'bs-trend-ext' }),
        e('path', { d: dd, class: 'bs-trend-line' }),
        seg[0] <= 1e-6 && e('circle', { cx: f1(x0), cy: f1(y0), r: 3, class: 'bs-trend-dot' }),
        seg[2] >= n - 1 - 1e-6 && e('circle', { cx: f1(x1), cy: f1(y1), r: 3.6, class: 'bs-trend-dot' }),
      ] }));
    });
    if (!tg.length) return null;
    // Légende : pente par période, en haut à gauche (l'objectif s'écrit à droite).
    var parts = list.map(function (rg) {
      var st = slopeTxt(rg.a, series[rg.k], fmt), flat = !st || Math.abs(rg.a) * (n - 1) < 0.04 * Math.max(Math.abs(rg.mean), 1e-9);
      return (one ? '' : series[rg.k].label + ' ') + (flat ? '→ stable' : (rg.a > 0 ? '↗ ' : '↘ ') + st + ' / ' + unit);
    });
    var txt = (one ? 'Tendance ' : 'Tendances ') + parts.join(' · ');
    var lw = textW(txt, 10.5) + 30, lx = Math.max(2, Math.min(o.L + 2, o.W - lw - 2));
    tg.push(e('g', { class: 'bs-trend-key', children: [
      e('title', { children: titles.join('\n') }),
      e('rect', { x: f1(lx), y: 4, width: f1(lw), height: 20, rx: 10, class: 'bs-trend-pill' }),
      e('line', { x1: f1(lx + 9), x2: f1(lx + 21), y1: 17.5, y2: 10.5, class: 'bs-trend-ico', style: { stroke: couleur(series, list[0].k) } }),
      e('text', { x: f1(lx + 26), y: 17.6, class: 'bs-trend-t', children: txt }),
    ] }));
    return e('g', { class: 'bs-trends', children: tg });
  }

  // Lignes ajoutées à l'infobulle de la période i : valeur de la tendance à cet endroit.
  function lignes(o, i) {
    if (i == null) return [];
    var series = o.series || [], fmt = o.format;
    return trends(o.data, series).map(function (rg) {
      var s = series[rg.k], tv = Math.max(0, rg.at(i));
      return { color: couleur(series, rg.k), value: s.fmt ? fv(s, fmt, Math.round(tv)) : tv.toLocaleString('fr-FR', { maximumFractionDigits: 1 }),
        label: series.length > 1 ? 'tendance ' + s.label : 'tendance' };
    });
  }

  var CSS = [
    // Droite dorée, nette et plate : un liseré de la couleur du fond la détache des barres.
    '.chart{--bs-tr:#fbbf24}',
    '[data-scheme="light"] .chart{--bs-tr:#d97706}',
    '.bs-trends{pointer-events:none}',
    '.bs-trend-band{fill:var(--bs-tc);fill-opacity:.09;stroke:none}',
    '.bs-trend-halo{fill:none;stroke:rgb(var(--surface-rgb));stroke-width:5;stroke-linecap:round;opacity:.9}',
    '.bs-trend-line{fill:none;stroke:var(--bs-tc);stroke-width:2.2;stroke-linecap:round}',
    '.bs-trend-ext{fill:none;stroke:var(--bs-tc);stroke-width:1.8;stroke-dasharray:4 5;stroke-linecap:round;opacity:.85}',
    '.bs-trend-dot{fill:var(--bs-tc);stroke:rgb(var(--surface-rgb));stroke-width:2}',
    '.bs-trend-key{pointer-events:auto;cursor:help}',
    '.bs-trend-pill{fill:rgb(var(--surface-rgb)/.92);stroke:rgb(var(--text-rgb)/.14)}',
    '.bs-trend-ico{stroke-width:2.4;stroke-linecap:round}',
    '.bs-trend-t{fill:var(--text-2);font-size:10.5px;font-weight:650;font-variant-numeric:tabular-nums}',
  ].join('\n');
  function injectCss() {
    if (document.getElementById('bs-tendance-css')) return;
    var st = document.createElement('style'); st.id = 'bs-tendance-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  injectCss();

  window.bsTendance = { utile: utile, trace: trace, lignes: lignes };
})();
