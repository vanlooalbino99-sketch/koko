// Graphiques du cockpit (thème sombre), dessinés en SVG à partir des chiffres calculés par le serveur.

const PURPLE = '#7b6cff';
const BLUE = '#4c7dff';
const TEAL = '#3fe0b5';

function scale(values: number[]) {
  const max = Math.max(...values, 0);
  return (v: number) => (max ? v / max : 0);
}

// Nuage de points en vague : une colonne de points par jour, hauteur selon la valeur du jour.
export function DotWave({ values, label }: { values: number[]; label: string }) {
  const W = 150;
  const H = 58;
  const s = scale(values);
  const step = W / Math.max(values.length, 1);
  const dots: { x: number; y: number; o: number; c: string }[] = [];
  values.forEach((v, i) => {
    const h = Math.max(1, Math.round(s(v) * 9));
    for (let k = 0; k < h; k++) {
      const x = i * step + step / 2;
      const y = H - 3 - k * 5.6;
      dots.push({ x, y, o: 0.35 + 0.65 * (k / 9), c: i / values.length < 0.5 ? PURPLE : BLUE });
    }
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-14 w-full" preserveAspectRatio="none">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.35" fill={d.c} opacity={d.o} />
      ))}
    </svg>
  );
}

// Grille de points : un point par jour, plus vif quand il y a eu des appels.
export function DotGrid({ values, label }: { values: number[]; label: string }) {
  const rows = values.length <= 7 ? 1 : values.length <= 30 ? 3 : 6;
  const cols = Math.ceil(values.length / rows);
  const s = scale(values);
  return (
    <svg viewBox={`0 0 ${cols * 9} ${rows * 9}`} role="img" aria-label={label} className="h-14 w-full" preserveAspectRatio="xMinYMid meet">
      {values.map((v, i) => (
        <circle key={i} cx={Math.floor(i / rows) * 9 + 4.5} cy={(i % rows) * 9 + 4.5} r="2" fill="#e8ebf4" opacity={v ? 0.45 + 0.55 * s(v) : 0.14} />
      ))}
    </svg>
  );
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

// Aire lissée (MRR des abonnés actuels selon leur date de souscription).
export function AreaWave({ values, label }: { values: number[]; label: string }) {
  const W = 150;
  const H = 58;
  const s = scale(values);
  const pts = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * W, H - 4 - s(v) * (H - 12)] as [number, number]);
  const line = smooth(pts);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-14 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cockpit-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TEAL} stopOpacity="0.55" />
          <stop offset="1" stopColor={TEAL} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {line && <path d={`${line} L${W} ${H} L0 ${H} Z`} fill="url(#cockpit-area)" />}
      {line && <path d={line} fill="none" stroke={TEAL} strokeWidth="1.6" />}
    </svg>
  );
}

// Ligne pointillée de points (nouveaux espaces par jour).
export function DottedLine({ values, label }: { values: number[]; label: string }) {
  const W = 150;
  const H = 58;
  const s = scale(values);
  const pts = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * (W - 8) + 4, H - 6 - s(v) * (H - 16)] as [number, number]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-14 w-full" preserveAspectRatio="none">
      <path d={smooth(pts)} fill="none" stroke="#c9ccff" strokeWidth="1.2" strokeDasharray="1.5 3.5" strokeLinecap="round" />
      {pts
        .filter((_, i) => i % Math.max(1, Math.round(values.length / 10)) === 0 || i === pts.length - 1)
        .map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.8" fill="#e8ebf4" />
        ))}
    </svg>
  );
}

// Une barre par abonnement : turquoise s'il est actif, rose s'il a été résilié sur la période.
export function SubscriptionBars({ active, canceled, label }: { active: number; canceled: number; label: string }) {
  const total = Math.min(active + canceled, 14);
  const shownCanceled = Math.min(canceled, total);
  const bars = Array.from({ length: total }, (_, i) => (i < total - shownCanceled ? 'active' : 'canceled'));
  const W = 150;
  const H = 58;
  const bw = 4;
  const gap = total > 1 ? Math.min(12, (W - total * bw) / (total - 1)) : 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-14 w-full">
      {bars.length === 0 && <line x1="0" x2={W} y1={H - 1} y2={H - 1} stroke="#2a2c36" strokeDasharray="3 4" />}
      {bars.map((kind, i) => (
        <rect key={i} x={i * (bw + gap)} y={kind === 'active' ? 4 : 22} width={bw} height={kind === 'active' ? H - 4 : H - 22} rx="2" fill={kind === 'active' ? TEAL : '#f06b8f'} opacity={0.9} />
      ))}
    </svg>
  );
}

// Jauge en demi-cercle (score moyen sur 100).
export function HalfGauge({ value, label }: { value: number | null; label: string }) {
  const r = 34;
  const c = Math.PI * r;
  const v = value ?? 0;
  const angle = Math.PI * (1 - v / 100);
  const nx = 50 + Math.cos(angle) * (r - 9);
  const ny = 46 - Math.sin(angle) * (r - 9);
  return (
    <svg viewBox="0 0 100 54" role="img" aria-label={label} className="h-14 w-auto">
      <defs>
        <linearGradient id="cockpit-gauge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PURPLE} />
          <stop offset="1" stopColor={TEAL} />
        </linearGradient>
      </defs>
      <path d={`M${50 - r} 46 A${r} ${r} 0 0 1 ${50 + r} 46`} fill="none" stroke="#2a2c36" strokeWidth="9" />
      {value !== null && (
        <path d={`M${50 - r} 46 A${r} ${r} 0 0 1 ${50 + r} 46`} fill="none" stroke="url(#cockpit-gauge)" strokeWidth="9" strokeDasharray={`${(v / 100) * c} ${c}`} />
      )}
      {value !== null && <line x1="50" y1="46" x2={nx} y2={ny} stroke="#e8ebf4" strokeWidth="2.2" strokeLinecap="round" />}
      <circle cx="50" cy="46" r="3" fill="#e8ebf4" />
    </svg>
  );
}

export const PLAN_COLORS = { pro: PURPLE, team: BLUE } as const;

// Anneau du MRR par offre, total au centre.
export function PlanDonut({ segments, center, caption }: { segments: { key: keyof typeof PLAN_COLORS; value: number }[]; center: string; caption: string }) {
  const total = segments.reduce((n, s) => n + s.value, 0);
  const r = 58;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 160 160" aria-hidden="true" className="h-auto w-full max-w-[170px]">
      <circle cx="80" cy="80" r={r} fill="none" stroke="#23252e" strokeWidth="24" />
      {total > 0 &&
        segments
          .filter((s) => s.value > 0)
          .map((s) => {
            const len = (s.value / total) * c;
            const el = (
              <circle
                key={s.key}
                cx="80"
                cy="80"
                r={r}
                fill="none"
                stroke={PLAN_COLORS[s.key]}
                strokeWidth="24"
                strokeDasharray={`${Math.max(0, len - 2)} ${c}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 80 80)"
              />
            );
            offset += len;
            return el;
          })}
      <text x="80" y="80" textAnchor="middle" fontSize="17" fontWeight="600" fill="#eceef3">
        {center}
      </text>
      <text x="80" y="97" textAnchor="middle" fontSize="9.5" fill="#9a9eac">
        {caption}
      </text>
    </svg>
  );
}

// Entonnoir : une bande dégradée dont l'épaisseur suit le nombre de personnes à chaque étape.
export function FunnelFlow({ values, label }: { values: number[]; label: string }) {
  const W = 400;
  const H = 120;
  const max = Math.max(...values, 1);
  const half = (v: number) => Math.max(3, (v / max) * (H / 2 - 6));
  const xs = values.map((_, i) => (i / Math.max(values.length - 1, 1)) * W);
  const top = smooth(values.map((v, i) => [xs[i], H / 2 - half(v)]));
  const bottom = smooth(
    values
      .map((v, i) => [xs[i], H / 2 + half(v)] as [number, number])
      .reverse(),
  ).replace(/^M/, 'L');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cockpit-funnel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PURPLE} stopOpacity="0.95" />
          <stop offset="0.55" stopColor={BLUE} stopOpacity="0.85" />
          <stop offset="1" stopColor={TEAL} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d={`${top} ${bottom} Z`} fill="url(#cockpit-funnel)" />
      {xs.slice(1, -1).map((x, i) => (
        <line key={i} x1={x} x2={x} y1="0" y2={H} stroke="#0f1015" strokeOpacity="0.55" strokeDasharray="2 3" />
      ))}
    </svg>
  );
}

// Santé : un anneau à cinq facettes autour du score global.
export function HealthRing({ facets, center, caption }: { facets: { label: string; value: number }[]; center: number; caption: string }) {
  const n = facets.length;
  const cx = 100;
  const cy = 100;
  const R = 86;
  const r = 44;
  const color = (v: number) => (v >= 85 ? TEAL : v >= 60 ? BLUE : PURPLE);
  const at = (rad: number, a: number) => [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] as const;
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className="h-auto w-full max-w-[210px]">
      {facets.map((f, i) => {
        const a0 = -Math.PI / 2 + (i / n) * 2 * Math.PI + 0.03;
        const a1 = -Math.PI / 2 + ((i + 1) / n) * 2 * Math.PI - 0.03;
        const [x0, y0] = at(R, a0);
        const [x1, y1] = at(R, a1);
        const [x2, y2] = at(r, a1);
        const [x3, y3] = at(r, a0);
        const [lx, ly] = at((R + r) / 2, (a0 + a1) / 2);
        return (
          <g key={f.label}>
            <path d={`M${x0} ${y0} L${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z`} fill={color(f.value)} fillOpacity={0.3 + (f.value / 100) * 0.55} stroke="#0f1015" strokeWidth="1.5" strokeLinejoin="round" />
            <text x={lx} y={ly + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill="#f4f5f8">
              {f.value}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={r - 6} fill="#16171d" stroke="#2a2c36" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="22" fontWeight="700" fill="#f4f5f8">
        {center}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="8.5" fill="#9a9eac">
        {caption}
      </text>
    </svg>
  );
}

// Bulles : part de chaque type d'appel, aire proportionnelle au nombre d'appels.
export function Bubbles({ items }: { items: { label: string; value: number }[] }) {
  const top = items.slice(0, 4);
  const total = top.reduce((n, i) => n + i.value, 0);
  const spots = [
    { x: 62, y: 78, max: 52 },
    { x: 148, y: 50, max: 36 },
    { x: 138, y: 120, max: 30 },
    { x: 196, y: 98, max: 24 },
  ];
  const fills = [PURPLE, TEAL, BLUE, '#a78bfa'];
  return (
    <svg viewBox="0 0 240 170" aria-hidden="true" className="h-auto w-full">
      {top.map((item, i) => {
        const share = total ? item.value / total : 0;
        const radius = Math.max(16, Math.sqrt(share) * spots[i].max * 1.15);
        return (
          <g key={item.label}>
            <circle cx={spots[i].x} cy={spots[i].y} r={radius} fill={fills[i]} fillOpacity="0.9" />
            <text x={spots[i].x} y={spots[i].y - 1} textAnchor="middle" fontSize={i === 0 ? 15 : 11} fontWeight="700" fill="#0f1015">
              {Math.round(share * 100)}%
            </text>
            <text x={spots[i].x} y={spots[i].y + (i === 0 ? 13 : 10)} textAnchor="middle" fontSize="7.5" fill="#0f1015">
              {item.label.length > 14 ? `${item.label.slice(0, 13)}…` : item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Tendance d'un compte sur six semaines.
export function TrendLine({ values, tone }: { values: number[]; tone: 'up' | 'down' | 'flat' }) {
  const W = 84;
  const H = 22;
  const s = scale(values);
  const pts = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * W, H - 3 - s(v) * (H - 6)] as [number, number]);
  const stroke = tone === 'down' ? '#f06b8f' : tone === 'up' ? TEAL : '#f5a524';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="h-5 w-[84px]">
      <path d={smooth(pts)} fill="none" stroke={stroke} strokeWidth="1.6" />
    </svg>
  );
}

// Illustration de la carte « À retenir » : un anneau de verre.
export function GlassRing() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="h-auto w-[112px]">
      <defs>
        <linearGradient id="cockpit-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="0.45" stopColor="#7b6cff" />
          <stop offset="0.75" stopColor="#3fe0b5" />
          <stop offset="1" stopColor="#4c7dff" />
        </linearGradient>
        <radialGradient id="cockpit-ring-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7b6cff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#7b6cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="64" r="56" fill="url(#cockpit-ring-glow)" />
      <ellipse cx="60" cy="60" rx="34" ry="40" transform="rotate(-28 60 60)" fill="none" stroke="url(#cockpit-ring)" strokeWidth="17" />
      <ellipse cx="60" cy="60" rx="34" ry="40" transform="rotate(-28 60 60)" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="30 220" />
    </svg>
  );
}
