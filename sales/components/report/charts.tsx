// Graphiques du rapport de session (thème clair), dessinés en SVG à partir des vraies données de l'appel.

const PURPLE = '#6a47e6';

// Anneau du score global, sur la carte violette.
export function ScoreDial({ score, size = 92 }: { score: number; size?: number }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(255 255 255 / 0.22)" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#fff"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`}
        transform="rotate(-90 50 50)"
      />
    </svg>
  );
}

// Courbe des derniers scores du vendeur (au moins deux), en blanc sur la carte violette.
export function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const W = 110;
  const H = 46;
  const x = (i: number) => 2 + (i / (values.length - 1)) * (W - 4);
  // Échelle resserrée sur les scores affichés, pour que la tendance se lise.
  const lo = Math.max(0, Math.min(...values) - 5);
  const hi = Math.min(100, Math.max(...values) + 5);
  const y = (v: number) => H - 4 - ((v - lo) / Math.max(hi - lo, 1)) * (H - 8);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="h-auto w-full max-w-[120px] overflow-visible">
      <path d={d} fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
      <circle cx={x(values.length - 1)} cy={y(values.at(-1)!)} r="3" fill="#fff" />
    </svg>
  );
}

// Petit motif de courbe montante (icône de la carte du centile).
export function TrendGlyph() {
  return (
    <svg viewBox="0 0 48 32" width="48" height="32" aria-hidden="true">
      <defs>
        <linearGradient id="trend-glyph" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PURPLE} stopOpacity="0.35" />
          <stop offset="1" stopColor={PURPLE} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M2 28 L12 20 L20 23 L30 12 L38 14 L46 4 L46 32 L2 32 Z" fill="url(#trend-glyph)" />
      <path d="M2 28 L12 20 L20 23 L30 12 L38 14 L46 4" fill="none" stroke={PURPLE} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// Radar des compétences : votre score, et la moyenne des autres appels du scénario en pointillés.
export function SkillRadarLight({
  axes,
  label,
}: {
  axes: { label: string; score: number; average?: number }[];
  label: string;
}) {
  const W = 460;
  const H = 340;
  const cx = W / 2;
  const cy = H / 2 + 4;
  const R = 112;
  const n = axes.length;
  const angle = (i: number) => -Math.PI / 2 + (i / n) * 2 * Math.PI;
  const point = (i: number, v: number) => [cx + Math.cos(angle(i)) * R * (v / 100), cy + Math.sin(angle(i)) * R * (v / 100)] as const;
  const polygon = (values: number[]) => values.map((v, i) => point(i, v).map((p) => p.toFixed(1)).join(',')).join(' ');
  const showAverage = n > 0 && axes.every((a) => typeof a.average === 'number');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      {[20, 40, 60, 80, 100].map((lvl) => (
        <polygon key={lvl} points={polygon(axes.map(() => lvl))} fill={lvl === 100 ? '#fbfaff' : 'none'} stroke="#e7e4f0" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#ece9f4" />;
      })}
      {[20, 40, 60, 80, 100].map((lvl) => (
        <text key={lvl} x={cx + 3} y={cy - (R * lvl) / 100 + 3} fontSize="8.5" fill="#8a8ca0">
          {lvl}
        </text>
      ))}
      {showAverage && (
        <polygon points={polygon(axes.map((a) => a.average!))} fill="none" stroke="#9a9cb0" strokeWidth="1.5" strokeDasharray="4 3" />
      )}
      <polygon points={polygon(axes.map((a) => a.score))} fill={PURPLE} fillOpacity="0.16" stroke={PURPLE} strokeWidth="2" strokeLinejoin="round" />
      {axes.map((a, i) => {
        const [x, y] = point(i, a.score);
        return <circle key={i} cx={x} cy={y} r="3.6" fill={PURPLE} />;
      })}
      {axes.map((a, i) => {
        const cos = Math.cos(angle(i));
        const sin = Math.sin(angle(i));
        const x = cx + cos * (R + 16);
        const y = cy + sin * (R + 16) + (sin > 0.3 ? 8 : sin < -0.3 ? -2 : 3);
        return (
          <text key={a.label} x={x} y={y} fontSize="10.5" fill="#33354a" textAnchor={cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle'}>
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}

// Score des dernières sessions notées, la session affichée mise en avant.
export function ScoreOverTime({ points, label }: { points: { label: string; score: number; current: boolean }[]; label: string }) {
  const W = 380;
  const H = 200;
  const pad = { l: 30, r: 26, t: 26, b: 26 };
  const x = (i: number) => pad.l + (i / Math.max(points.length - 1, 1)) * (W - pad.l - pad.r);
  const y = (s: number) => pad.t + (1 - s / 100) * (H - pad.t - pad.b);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.score).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;
  const current = points.findIndex((p) => p.current);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      <defs>
        <linearGradient id="sot-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PURPLE} stopOpacity="0.22" />
          <stop offset="1" stopColor={PURPLE} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((tick) => (
        <g key={tick}>
          <line x1={pad.l} x2={W - pad.r} y1={y(tick)} y2={y(tick)} stroke="#efedf5" />
          <text x={pad.l - 8} y={y(tick) + 3} textAnchor="end" fontSize="9.5" fill="#6b6e82">
            {tick}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#sot-fill)" />
      <path d={line} fill="none" stroke={PURPLE} strokeWidth="2" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.score)} r={p.current ? 4.5 : 2.6} fill={p.current ? PURPLE : '#fff'} stroke={PURPLE} strokeWidth="1.6" />
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="9.5" fill="#33354a">
            {p.label}
          </text>
        </g>
      ))}
      {current >= 0 && (
        <g>
          <rect x={x(current) - 15} y={y(points[current].score) - 27} width="30" height="19" rx="5" fill={PURPLE} />
          <text x={x(current)} y={y(points[current].score) - 14} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#fff">
            {points[current].score}
          </text>
        </g>
      )}
    </svg>
  );
}

export const TIER_COLORS = { excellent: '#3f5bd8', good: '#22a884', average: '#f5c591', poor: '#ef6f87' } as const;

// Anneau de répartition des compétences par palier.
export function TierDonut({ segments, total, caption }: { segments: { key: keyof typeof TIER_COLORS; count: number }[]; total: number; caption: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 140 140" className="h-auto w-full max-w-[150px]" aria-hidden="true">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f1eff6" strokeWidth="22" />
      {segments
        .filter((s) => s.count > 0)
        .map((s) => {
          const len = (s.count / total) * c;
          const el = (
            <circle
              key={s.key}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={TIER_COLORS[s.key]}
              strokeWidth="22"
              strokeDasharray={`${Math.max(0, len - 1.5)} ${c}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
            />
          );
          offset += len;
          return el;
        })}
      <circle cx="70" cy="70" r="38" fill="#fff" />
      <text x="70" y="72" textAnchor="middle" fontSize="24" fontWeight="600" fill="#1d1b2c">
        {total}
      </text>
      <text x="70" y="88" textAnchor="middle" fontSize="9" fill="#5d6074">
        {caption}
      </text>
    </svg>
  );
}

// Illustration du bandeau de synthèse : coupe sur un podium, quelques éclats.
export function Trophy() {
  return (
    <svg viewBox="0 0 220 120" className="h-auto w-[200px]" aria-hidden="true">
      <defs>
        <linearGradient id="trophy-cup" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b7cff" />
          <stop offset="1" stopColor="#5a35d6" />
        </linearGradient>
        <linearGradient id="trophy-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9bcff" />
          <stop offset="1" stopColor="#8f74f0" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="110" rx="92" ry="8" fill="#e6e0fb" />
      <rect x="62" y="88" width="96" height="20" rx="4" fill="url(#trophy-base)" />
      <rect x="80" y="76" width="60" height="14" rx="3" fill="#7a5cf0" />
      <rect x="102" y="58" width="16" height="20" fill="#6a47e6" />
      <path d="M80 10 h60 v16 a30 30 0 0 1 -60 0 z" fill="url(#trophy-cup)" />
      <path d="M80 16 h-12 a12 12 0 0 0 12 18" fill="none" stroke="#7a5cf0" strokeWidth="5" />
      <path d="M140 16 h12 a12 12 0 0 1 -12 18" fill="none" stroke="#7a5cf0" strokeWidth="5" />
      <path d="M92 16 q4 16 14 22" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
      {[
        [40, 30, '#f7a8c4'],
        [178, 26, '#f7a8c4'],
        [30, 70, '#b9a8ff'],
        [192, 64, '#b9a8ff'],
        [58, 14, '#cfc4ff'],
        [166, 50, '#f7c6a1'],
      ].map(([x, y, color], i) => (
        <path key={i} d={`M${x} ${Number(y) - 5} l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6z`} fill={String(color)} />
      ))}
    </svg>
  );
}
