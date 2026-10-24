// Radar des compétences notées sur 100. Au moins trois axes, sinon le graphique ne veut rien dire.
export function SkillRadar({ skills, title }: { skills: { label: string; score: number }[]; title: string }) {
  if (skills.length < 3) return null;
  // Plus large que haut : les libellés des axes gauche et droit ont besoin de place.
  const width = 460;
  const height = 320;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 104;
  const angle = (i: number) => (Math.PI * 2 * i) / skills.length - Math.PI / 2;
  const point = (i: number, value: number) => {
    const r = (radius * value) / 100;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))] as const;
  };
  const polygon = (value: (i: number) => number) =>
    skills.map((_, i) => point(i, value(i)).map((n) => n.toFixed(1)).join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-[30rem] overflow-visible" role="img" aria-label={title}>
      {[25, 50, 75, 100].map((ring) => (
        <polygon key={ring} points={polygon(() => ring)} fill="none" stroke="var(--border)" strokeWidth="1" />
      ))}
      {skills.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />;
      })}
      <polygon points={polygon((i) => skills[i].score)} fill="var(--primary)" fillOpacity="0.25" stroke="var(--primary)" strokeWidth="2" />
      {skills.map((s, i) => {
        const [x, y] = point(i, s.score);
        return <circle key={i} cx={x} cy={y} r="3.5" fill="var(--teal)" />;
      })}
      {skills.map((s, i) => {
        const [x, y] = point(i, 118);
        const cos = Math.cos(angle(i));
        const anchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end';
        return (
          <text key={i} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize="11" fill="var(--muted-foreground)">
            {s.label} · {s.score}
          </text>
        );
      })}
    </svg>
  );
}
