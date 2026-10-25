// Graphiques du tableau de bord et du cockpit, dessinés en SVG d'après la maquette « RevenuePulse » à partir des
// chiffres calculés par le serveur. Animations d'entrée en CSS (globals.css), coupées si l'utilisateur réduit les
// animations. La vague de particules et l'anneau de verre, animés en continu, sont des composants client à part.

const PURPLE = '#5c55f0';
const BLUE = '#4c7dff';
const TEAL = '#3fe0b5';

function scale(values: number[]) {
  const max = Math.max(...values, 0);
  return (v: number) => (max ? v / max : 0);
}

function smooth(points: [number, number][]) {
  if (points.length < 2) return '';
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx.toFixed(1)} ${y0.toFixed(1)} ${cx.toFixed(1)} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}

// Regroupe une série en n cases (somme), pour garder le même dessin quelle que soit la période.
export function buckets(values: number[], n: number) {
  if (!values.length) return Array.from({ length: n }, () => 0);
  // Moins de valeurs que de cases : on les garde telles quelles plutôt que d'en dupliquer.
  if (values.length <= n) return values;
  return Array.from({ length: n }, (_, i) => {
    const from = Math.floor((i * values.length) / n);
    const to = Math.max(from + 1, Math.floor(((i + 1) * values.length) / n));
    return values.slice(from, to).reduce((a, b) => a + b, 0);
  });
}

// Moyenne de chaque tranche quand une série est découpée en n tranches.
function averages(values: number[], n: number) {
  return Array.from({ length: n }, (_, i) => {
    const slice = values.slice(Math.floor((i * values.length) / n), Math.max(Math.floor((i * values.length) / n) + 1, Math.floor(((i + 1) * values.length) / n)));
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

// Grille de points sur 7 lignes (13 colonnes pour 91 tranches) : point plus vif quand il y a eu de l'activité.
export function DotMatrix({ values, label }: { values: number[]; label: string }) {
  const cells = values.slice(0, 91);
  const s = scale(cells);
  const cols = Math.max(1, Math.ceil(cells.length / 7));
  return (
    <svg viewBox={`0 0 ${cols * 12} 70`} role="img" aria-label={label} className="h-[74px] w-full" preserveAspectRatio="xMidYMid meet">
      {cells.map((v, i) => {
        const col = Math.floor(i / 7);
        const row = i % 7;
        const o = v ? 0.55 + 0.45 * s(v) : 0.22;
        return (
          <circle
            key={i}
            cx={col * 12 + 6}
            cy={row * 10 + 5}
            r="1.7"
            fill={v && s(v) >= 0.75 ? '#8f88ff' : '#e9ecf4'}
            className={v ? 'bs-fade bs-twinkle' : 'bs-fade'}
            style={{ opacity: o, ['--o' as string]: o, animationDelay: v ? `${col * 60}ms, ${(i % 9) * 400}ms` : `${col * 60}ms` }}
          />
        );
      })}
    </svg>
  );
}

// Aire lissée, en pleine largeur de la carte comme sur la maquette (MRR, scores).
export function AreaWave({ values: raw, label }: { values: number[]; label: string }) {
  const W = 200;
  const H = 70;
  // Au-delà de dix points, moyenne par tranche : des collines douces comme sur la maquette, pas des pics.
  const values = raw.length > 10 ? averages(raw, 10) : raw;
  const s = scale(values);
  const pts = values.length >= 2 ? values.map((v, i) => [(i / (values.length - 1)) * W, H - 4 - s(v) * (H - 14)] as [number, number]) : [];
  const line = pts.length ? smooth(pts) : `M0 ${H - 2} L${W} ${H - 2}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-[74px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="pulse-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#45d6a6" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#2a8f75" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1d212c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="bs-grow-y">
        <path d={`${line} L${W} ${H} L0 ${H} Z`} fill="url(#pulse-area)" />
        <path d={line} fill="none" stroke="#6ff2c6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

// Ligne pointillée : un point blanc par repère, reliés par des tirets.
export function DottedLine({ values, label }: { values: number[]; label: string }) {
  const W = 150;
  const H = 62;
  const pts8 = buckets(values, 8);
  const s = scale(pts8);
  const pts = pts8.map((v, i) => [(i / 7) * (W - 12) + 6, H - 8 - s(v) * (H - 20)] as [number, number]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-[70px] w-full">
      <path d={smooth(pts)} fill="none" stroke="#c9ccff" strokeOpacity="0.8" strokeWidth="1.3" strokeDasharray="2 4" strokeLinecap="round" className="bs-fade" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.3" fill="#eef0f5" className="bs-pop" style={{ animationDelay: `${i * 90}ms` }} />
      ))}
    </svg>
  );
}

// Sept barres verticales turquoise (la période découpée en sept tranches).
export function Bars({ values, label }: { values: number[]; label: string }) {
  const seven = values.length === 7 ? values : buckets(values, 7);
  const s = scale(seven);
  const W = 150;
  const H = 70;
  const step = W / 7;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-[74px] w-full">
      {seven.map((v, i) => {
        const h = v ? 14 + s(v) * (H - 16) : 5;
        return (
          <rect
            key={i}
            x={i * step + step / 2 - 2.6}
            y={H - h}
            width="5.2"
            height={h}
            rx="2.6"
            fill={v ? 'url(#pulse-bar)' : '#2f3542'}
            className="bs-grow-y"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        );
      })}
      <defs>
        <linearGradient id="pulse-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ff7dc" />
          <stop offset="1" stopColor="#2fbf98" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Jauge en demi-cercle : zones grise (< 50), turquoise (50-75) et violette (≥ 75), aiguille sur la valeur.
export function Gauge({ value, label }: { value: number | null; label: string }) {
  const r = 36;
  const cx = 50;
  const cy = 48;
  const arc = (from: number, to: number) => {
    const a0 = Math.PI * (1 - from / 100);
    const a1 = Math.PI * (1 - to / 100);
    return `M${(cx + Math.cos(a0) * r).toFixed(2)} ${(cy - Math.sin(a0) * r).toFixed(2)} A${r} ${r} 0 0 1 ${(cx + Math.cos(a1) * r).toFixed(2)} ${(cy - Math.sin(a1) * r).toFixed(2)}`;
  };
  const deg = ((value ?? 0) / 100) * 180 - 90;
  return (
    <svg viewBox="0 0 100 56" role="img" aria-label={label} className="mx-auto h-[66px] w-auto">
      <path d={arc(0, 49)} fill="none" stroke="#5a5c66" strokeWidth="12" />
      <path d={arc(51, 74)} fill="none" stroke="#5ff0c6" strokeWidth="12" />
      <path d={arc(76, 100)} fill="none" stroke="#5c55f0" strokeWidth="12" />
      {value !== null && (
        <g className="bs-needle" style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${deg}deg)` }}>
          <path d={`M${cx - 2.4} ${cy} L${cx} ${cy - r + 4} L${cx + 2.4} ${cy} Z`} fill="#c7cbd6" />
        </g>
      )}
      <circle cx={cx} cy={cy} r="3.6" fill="#c7cbd6" />
    </svg>
  );
}

export const SERIES_COLORS = ['#5c55f0', '#7d76ff', '#5aa9ff', '#4fe3b5', '#a78bfa', '#f5a524', '#f06b8f', '#5ad1f0', '#8f96a8'] as const;
export const PLAN_COLORS = { standard: SERIES_COLORS[2], advanced: SERIES_COLORS[0], premium: SERIES_COLORS[4] } as const;

// Anneau épais : une part par segment (séparées par un fin espace), total au centre.
export function Donut({ segments, center, caption }: { segments: { label: string; value: number; color: string }[]; center: string; caption: string }) {
  const total = segments.reduce((n, s) => n + s.value, 0);
  const r = 60;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true" className="h-auto w-full max-w-[176px]">
      <circle cx="80" cy="80" r={r} fill="none" stroke="#262a36" strokeWidth="26" />
      <g className="bs-pop">
        {total > 0 &&
          segments
            .filter((s) => s.value > 0)
            .map((s) => {
              const len = (s.value / total) * c;
              const el = (
                <circle
                  key={s.label}
                  cx="80"
                  cy="80"
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="26"
                  strokeDasharray={`${Math.max(0, len - (segments.length > 1 ? 2.5 : 0))} ${c}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 80 80)"
                />
              );
              offset += len;
              return el;
            })}
      </g>
      <text x="80" y="82" textAnchor="middle" fontSize="17" fontWeight="600" fill="#eef0f5">
        {center}
      </text>
      <text x="80" y="98" textAnchor="middle" fontSize="9" fill="#9aa1b2">
        {caption}
      </text>
    </svg>
  );
}

export function PlanDonut({ segments, center, caption }: { segments: { key: keyof typeof PLAN_COLORS; value: number }[]; center: string; caption: string }) {
  return <Donut segments={segments.map((s) => ({ label: s.key, value: s.value, color: PLAN_COLORS[s.key] }))} center={center} caption={caption} />;
}

// Entonnoir : une bande dégradée violet → turquoise dont l'épaisseur suit chaque étape, fines verticales sous chaque
// étape. Elle se déroule depuis la gauche à l'ouverture, puis ondule lentement (épaisseur qui respire de quelques
// pour cent) avec un reflet qui la parcourt ; mouvement coupé si l'utilisateur réduit les animations.
export function FunnelFlow({ values, label }: { values: number[]; label: string }) {
  const W = 400;
  const H = 130;
  const max = Math.max(...values, 1);
  const half = (v: number) => Math.max(1.5, (v / max) * (H / 2 - 9));
  const xs = values.map((_, i) => ((i + 0.5) / values.length) * W);
  const profile: [number, number][] = [[0, half(values[0] ?? 0)], ...values.map((v, i) => [xs[i], half(v)] as [number, number]), [W - 12, 1.2]];
  // Même tracé, épaisseur multipliée point par point (pour l'ondulation).
  const shapeOf = (k: (i: number) => number) => {
    const pts = profile.map(([x, h], i) => [x, h * k(i)] as [number, number]);
    const top = smooth(pts.map(([x, h]) => [x, H / 2 - h]));
    const bottom = smooth(pts.map(([x, h]) => [x, H / 2 + h] as [number, number]).reverse()).replace(/^M/, 'L');
    return `${top} ${bottom} Z`;
  };
  const shape = shapeOf(() => 1);
  const swellA = shapeOf((i) => 1 + 0.07 * (i % 2));
  const swellB = shapeOf((i) => 1 + 0.07 * ((i + 1) % 2));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-[130px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="pulse-funnel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a3fe0" />
          <stop offset="0.3" stopColor="#6c63ff" />
          <stop offset="0.62" stopColor="#7cc4f2" />
          <stop offset="0.85" stopColor="#9ff3e3" />
          <stop offset="1" stopColor="#e9fffb" />
        </linearGradient>
        <linearGradient id="pulse-funnel-sheen" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
          <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="6s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <g className="bs-unroll">
        <path d={shape} fill="url(#pulse-funnel)" />
        <g className="bs-flow">
          <path d={shape} fill="url(#pulse-funnel)">
            <animate
              attributeName="d"
              values={`${shape};${swellA};${shape};${swellB};${shape}`}
              dur="8s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"
            />
          </path>
          <rect width={W} height={H} fill="url(#pulse-funnel-sheen)" clipPath="url(#pulse-funnel-clip)" />
        </g>
        <clipPath id="pulse-funnel-clip">
          <path d={shape} />
        </clipPath>
        <line x1={W - 12} x2={W} y1={H / 2} y2={H / 2} stroke="#e9fffb" strokeOpacity="0.7" strokeWidth="1" />
      </g>
      {xs.map((x, i) => (
        <line key={i} x1={x} x2={x} y1="0" y2={H} stroke="#e9ecf4" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

export const HEX_COLORS = ['#8f7dff', '#5aa9ff', '#7fe7d9', '#57e3b0', '#6d5cff', '#a78bfa'] as const;

// Santé en nid d'abeille : un anneau hexagonal découpé en tuiles (une par facette, nom et valeur dedans), score
// global dans l'hexagone central. Les couleurs suivent l'ordre des tuiles, comme sur la maquette.
export function HexHealth({ facets, center, caption }: { facets: { label: string; value: number | null }[]; center: number | null; caption: string }) {
  const cx = 100;
  const cy = 100;
  const R = 92;
  const r = 44;
  const n = Math.max(facets.length, 1);
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  // Distance du centre au bord d'un hexagone « pointe en haut » dans la direction d'angle a (degrés).
  const reach = (rad: number, a: number) => {
    const m = ((a % 60) + 60) % 60;
    const d = Math.min(m, 60 - m) * (Math.PI / 180);
    return (rad * Math.cos(Math.PI / 6)) / Math.cos(d);
  };
  const at = (rad: number, a: number) => [cx + Math.cos(toRad(a)) * reach(rad, a), cy + Math.sin(toRad(a)) * reach(rad, a)] as const;
  // Sommets de l'hexagone rencontrés entre deux angles (pour suivre ses arêtes).
  const cornersBetween = (a0: number, a1: number) => Array.from({ length: 19 }, (_, k) => -450 + 60 * k).filter((c) => c > a0 && c < a1);
  const tile = (a0: number, a1: number) => {
    const between = cornersBetween(a0, a1);
    const outer = [a0, ...between, a1].map((a) => at(R, a));
    const inner = [a1, ...[...between].reverse(), a0].map((a) => at(r, a));
    return [...outer, ...inner].map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z';
  };
  // Secteurs égaux, le premier centré en haut puis dans le sens des aiguilles d'une montre.
  const step = 360 / n;
  const inner = [-90, -30, 30, 90, 150, 210].map((a) => at(r - 3, a));
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className="h-auto w-full max-w-[190px]">
      {facets.map((f, i) => {
        const a0 = -90 + step * i - step / 2;
        const a1 = a0 + step;
        const mid = (a0 + a1) / 2;
        const [lx, ly] = at((R + r) / 2 + 2, mid);
        const name = f.label.length > 11 ? `${f.label.slice(0, 10)}…` : f.label;
        return (
          <g key={f.label} className="bs-pop" style={{ animationDelay: `${i * 90}ms` }}>
            <path d={tile(a0, a1)} fill={HEX_COLORS[i % HEX_COLORS.length]} fillOpacity={f.value === null ? 0.35 : 0.92} stroke="#1d212c" strokeWidth="3" strokeLinejoin="round" />
            <text x={lx} y={ly - 2} textAnchor="middle" fontSize="7.2" fill="#0f1218" fillOpacity="0.85">
              {name}
            </text>
            <text x={lx} y={ly + 9} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f1218">
              {f.value ?? '—'}
            </text>
          </g>
        );
      })}
      <path d={inner.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z'} fill="#0b0d12" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="24" fontWeight="700" fill="#f4f5f8">
        {center ?? '—'}
      </text>
      <text x={cx} y={cy + 17} textAnchor="middle" fontSize="7.5" fill="#c9cedb">
        {caption}
      </text>
    </svg>
  );
}

const BUBBLE_FILLS = ['#5c55f0', '#4fc79a', '#5b8ff0', '#4338ca'];

// Coupe un libellé en deux lignes au blanc le plus proche du milieu (« Workspace / Created » sur la maquette).
function twoLines(label: string) {
  if (label.length <= 11 || !label.includes(' ')) return [label.length > 15 ? `${label.slice(0, 14)}…` : label];
  const spaces = [...label].flatMap((c, i) => (c === ' ' ? [i] : []));
  const cut = spaces.reduce((best, i) => (Math.abs(i - label.length / 2) < Math.abs(best - label.length / 2) ? i : best));
  return [label.slice(0, cut), label.slice(cut + 1)].map((l) => (l.length > 14 ? `${l.slice(0, 13)}…` : l));
}

// Bulles : une par catégorie, placées comme sur la maquette (grosse à gauche, trois plus petites qui la touchent) ;
// leur taille suit la part de chacune autour de ce gabarit. Elles flottent lentement.
export function Bubbles({ items }: { items: { label: string; value: number }[] }) {
  const top = items.slice(0, 4);
  const total = top.reduce((n, i) => n + i.value, 0);
  const spots = [
    { x: 66, y: 80, r: 52, ref: 0.4 },
    { x: 154, y: 48, r: 37, ref: 0.28 },
    { x: 132, y: 134, r: 29, ref: 0.18 },
    { x: 186, y: 121, r: 25, ref: 0.14 },
  ];
  return (
    <svg viewBox="0 0 240 175" aria-hidden="true" className="h-auto w-full">
      {top.map((item, i) => {
        const share = total ? item.value / total : 0;
        const radius = spots[i].r * Math.min(1.12, Math.max(0.78, Math.sqrt(share / spots[i].ref)));
        const lines = twoLines(item.label);
        const big = i === 0;
        const y0 = spots[i].y - (lines.length - 1) * 4;
        return (
          <g key={item.label} className="bs-pop" style={{ animationDelay: `${i * 120}ms` }}>
            <g className="bs-float" style={{ animationDelay: `${i * -1.5}s` }}>
              <circle cx={spots[i].x} cy={spots[i].y} r={radius} fill={BUBBLE_FILLS[i]} />
              <text x={spots[i].x} y={y0 + (big ? 1 : 0)} textAnchor="middle" fontSize={big ? 17 : i === 1 ? 14 : 12} fontWeight="700" fill="#fff">
                {Math.round(share * 100)}%
              </text>
              {lines.map((line, k) => (
                <text key={k} x={spots[i].x} y={y0 + (big ? 15 : 12) + k * 9} textAnchor="middle" fontSize={big ? 8.5 : 7.5} fontWeight="500" fill="#fff" fillOpacity="0.92">
                  {line}
                </text>
              ))}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

// Tendance ondulée d'une ligne du tableau (moyenne glissante pour lisser les jours sans appel).
export function TrendLine({ values, tone }: { values: number[]; tone: 'up' | 'down' | 'flat' }) {
  const W = 84;
  const H = 22;
  const s = scale(values);
  const pts = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * W, H - 3 - s(v) * (H - 6)] as [number, number]);
  const stroke = tone === 'down' ? '#f0506e' : tone === 'up' ? '#2fd07a' : '#f59e0b';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="h-5 w-[84px]">
      <path d={pts.length > 1 ? smooth(pts) : `M0 ${H / 2} L${W} ${H / 2}`} fill="none" stroke={stroke} strokeWidth="1.6" className="bs-draw" style={{ ['--len' as string]: 160 }} />
    </svg>
  );
}

// Moyenne glissante sur k points (pour les tendances quotidiennes).
export function rolling(values: number[], k: number) {
  return values.map((_, i) => {
    const slice = values.slice(Math.max(0, i - k + 1), i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

// Anneau de verre en SVG : affiché le temps que l'anneau 3D se charge, ou si le navigateur n'a pas WebGL.
export function GlassRing() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="h-auto w-[112px]">
      <defs>
        <linearGradient id="pulse-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9a2ff" />
          <stop offset="0.4" stopColor="#8f5cff" />
          <stop offset="0.7" stopColor="#5f86ff" />
          <stop offset="1" stopColor="#22d8e6" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="62" rx="30" ry="44" fill="none" stroke="url(#pulse-ring)" strokeWidth="13" transform="rotate(-32 60 62)" opacity="0.9" />
    </svg>
  );
}

export { PURPLE, BLUE, TEAL };
