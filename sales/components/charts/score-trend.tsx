// Courbe du score (0 à 100) dessinée à partir des vraies simulations notées ; rien n'est affiché sans données.
export function ScoreTrend({ points, label }: { points: { date: string; score: number }[]; label: string }) {
  const W = 560;
  const H = 180;
  const pad = { l: 28, r: 12, t: 12, b: 24 };
  const x = (i: number) => pad.l + (i / Math.max(points.length - 1, 1)) * (W - pad.l - pad.r);
  const y = (s: number) => pad.t + (1 - s / 100) * (H - pad.t - pad.b);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.score).toFixed(1)}`).join(' ');
  const area = `${line} L${x(points.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;
  const last = points.at(-1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      <defs>
        <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((tick) => (
        <g key={tick}>
          <line x1={pad.l} x2={W - pad.r} y1={y(tick)} y2={y(tick)} stroke="var(--border)" />
          <text x={pad.l - 6} y={y(tick) + 4} textAnchor="end" fontSize="10" fill="var(--muted-foreground)">
            {tick}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#trend-fill)" />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.score)} r="3" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" />
      ))}
      {points.map((p, i) => {
        const left = i === 0 ? pad.l : (x(i - 1) + x(i)) / 2;
        const right = i === points.length - 1 ? W - pad.r : (x(i) + x(i + 1)) / 2;
        return <rect key={`t${i}`} x={left} y={pad.t} width={Math.max(0, right - left)} height={H - pad.t - pad.b} className="bs-tip-col" data-tip={`${p.date}\n${p.score} / 100`} />;
      })}
      {last && (
        <text x={x(points.length - 1)} y={y(last.score) - 10} textAnchor="end" fontSize="12" fontWeight="600" fill="var(--foreground)">
          {last.score}
        </text>
      )}
    </svg>
  );
}

// Anneau de score : la part remplie est le score sur 100.
export function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 56 56" width={size} height={size} aria-hidden="true">
      <circle cx="28" cy="28" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="6" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke="var(--teal)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`}
        transform="rotate(-90 28 28)"
      />
    </svg>
  );
}
