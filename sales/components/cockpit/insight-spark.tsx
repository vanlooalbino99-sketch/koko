// Étincelles violettes de la carte « À retenir » (icône de la maquette « AI Insight »).
export function InsightSpark() {
  const star = (x: number, y: number, r: number) =>
    `M${x} ${y - r} C${x + r * 0.18} ${y - r * 0.18} ${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} C${x + r * 0.18} ${y + r * 0.18} ${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} C${x - r * 0.18} ${y + r * 0.18} ${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} C${x - r * 0.18} ${y - r * 0.18} ${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z`;
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className="size-6 shrink-0">
      <defs>
        <linearGradient id="pulse-spark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="0.6" stopColor="#7d76ff" />
          <stop offset="1" stopColor="#5aa9ff" />
        </linearGradient>
      </defs>
      <path d={star(11, 15, 9)} fill="url(#pulse-spark)" className="bs-twinkle" style={{ ['--o' as string]: 1 }} />
      <path d={star(21.5, 6.5, 4.5)} fill="url(#pulse-spark)" className="bs-twinkle" style={{ ['--o' as string]: 1, animationDelay: '1.2s' }} />
      <path d={star(22, 21, 3)} fill="url(#pulse-spark)" className="bs-twinkle" style={{ ['--o' as string]: 1, animationDelay: '2.1s' }} />
    </svg>
  );
}
