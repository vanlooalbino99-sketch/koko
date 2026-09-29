// Graphiques SVG légers et interactifs (survol + infobulle), sans bibliothèque.
// Règles : traits fins, extrémités arrondies 4px, grille discrète, un seul axe,
// légende dès 2 séries, texte toujours dans les couleurs de texte.
import { useEffect, useRef, useState } from 'preact/hooks';
import { compact } from '../lib/util.js';

function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setW(el.clientWidth);
    set();
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(set);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);
  return [ref, w];
}

export function niceScale(max, ticks = 4) {
  if (!max || max <= 0) return { max: ticks, step: 1 };
  const raw = max / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
  return { max: Math.ceil(max / step) * step, step };
}

/* Colonne à extrémité arrondie (4px) et base carrée. */
function colPath(x, y, w, h, r = 4) {
  if (h <= 0) return '';
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
}
function barPath(x, y, w, h, r = 4) {
  if (w <= 0) return '';
  const rr = Math.min(r, h / 2, w);
  return `M${x},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h - rr}Q${x + w},${y + h} ${x + w - rr},${y + h}H${x}Z`;
}

function Tip({ tip }) {
  if (!tip) return null;
  return (
    <div class="chart-tip" style={{ left: tip.x, top: tip.y }}>
      <div class="chart-tip-title">{tip.title}</div>
      {tip.rows.map((r) => (
        <div class="chart-tip-row">
          <span class="chart-tip-key" style={{ background: r.color }} />
          <strong>{r.value}</strong>
          {r.label && <span class="chart-tip-label">{r.label}</span>}
        </div>
      ))}
    </div>
  );
}

export function Legend({ series }) {
  return (
    <div class="legend">
      {series.map((s) => (
        <span class="legend-item">
          <span class={s.line ? 'legend-line' : 'legend-swatch'} style={{ background: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}

/* Colonnes — une ou plusieurs séries (groupées). */
export function Columns({ data, series, height = 200, format = compact, target, targetLabel }) {
  const [ref, w] = useWidth();
  const [hover, setHover] = useState(null);
  const padL = 36;
  const padB = 24;
  const padT = 10;
  const H = height;
  const innerH = H - padB - padT;
  const maxV = Math.max(target || 0, ...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0)));
  const sc = niceScale(maxV);
  const innerW = Math.max(0, w - padL - 4);
  const band = data.length ? innerW / data.length : 0;
  const groupW = Math.min(band * 0.62, series.length * 24 + (series.length - 1) * 2);
  const colW = series.length ? (groupW - (series.length - 1) * 2) / series.length : 0;
  const y = (v) => padT + innerH - (v / sc.max) * innerH;
  const ticks = [];
  for (let v = 0; v <= sc.max + 1e-9; v += sc.step) ticks.push(v);
  const labelEvery = band < 26 ? Math.ceil(26 / Math.max(band, 1)) : 1;

  return (
    <div class="chart" ref={ref} style={{ height: H }} onMouseLeave={() => setHover(null)}>
      {w > 0 && (
        <svg width={w} height={H} role="img">
          {ticks.map((t) => (
            <g>
              <line x1={padL} x2={w} y1={y(t)} y2={y(t)} class={t === 0 ? 'chart-base' : 'chart-grid'} />
              <text x={padL - 8} y={y(t) + 4} class="chart-axis" text-anchor="end">
                {format(t)}
              </text>
            </g>
          ))}
          {target > 0 && (
            <g>
              <line x1={padL} x2={w} y1={y(target)} y2={y(target)} class="chart-target" />
              <text x={w - 4} y={y(target) - 5} class="chart-axis" text-anchor="end">
                {targetLabel || 'Objectif'} {format(target)}
              </text>
            </g>
          )}
          {data.map((d, i) => {
            const gx = padL + band * i + (band - groupW) / 2;
            return (
              <g>
                {series.map((s, j) => {
                  const v = Number(d[s.key]) || 0;
                  const top = y(v);
                  return <path d={colPath(gx + j * (colW + 2), top, colW, padT + innerH - top)} fill={s.color} opacity={hover == null || hover === i ? 1 : 0.55} />;
                })}
                {i % labelEvery === 0 && (
                  <text x={padL + band * i + band / 2} y={H - 6} class="chart-axis" text-anchor="middle">
                    {d.label}
                  </text>
                )}
                <rect
                  x={padL + band * i}
                  y={padT}
                  width={band}
                  height={innerH}
                  fill="transparent"
                  tabIndex={0}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  onTouchStart={() => setHover(i)}
                />
              </g>
            );
          })}
        </svg>
      )}
      {hover != null && data[hover] && (
        <Tip
          tip={{
            x: Math.min(Math.max(padL + band * hover + band / 2, 70), w - 70),
            y: Math.max(8, y(Math.max(...series.map((s) => Number(data[hover][s.key]) || 0))) - 12),
            title: data[hover].tipLabel || data[hover].label,
            rows: series.map((s) => ({ color: s.color, value: s.fmt ? s.fmt(data[hover][s.key]) : format(data[hover][s.key]), label: series.length > 1 ? s.label : s.unit || '' })),
          }}
        />
      )}
    </div>
  );
}

/* Courbe + aire légère avec réticule. */
export function Area({ data, height = 200, format = compact, color = 'var(--series-1)', label }) {
  const [ref, w] = useWidth();
  const [hover, setHover] = useState(null);
  const padL = 40;
  const padB = 24;
  const padT = 14;
  const padR = 14;
  const H = height;
  const innerH = H - padB - padT;
  const maxV = Math.max(...data.map((d) => d.value || 0));
  const sc = niceScale(maxV);
  const innerW = Math.max(0, w - padL - padR);
  const x = (i) => padL + (data.length > 1 ? (innerW * i) / (data.length - 1) : innerW / 2);
  const y = (v) => padT + innerH - ((v || 0) / sc.max) * innerH;
  const pts = data.map((d, i) => [x(i), y(d.value)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('');
  const area = pts.length ? `${line}L${pts[pts.length - 1][0]},${padT + innerH}L${pts[0][0]},${padT + innerH}Z` : '';
  const ticks = [];
  for (let v = 0; v <= sc.max + 1e-9; v += sc.step) ticks.push(v);
  const last = pts[pts.length - 1];
  function move(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const i = Math.round(((px - padL) / (innerW || 1)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  }
  return (
    <div class="chart" ref={ref} style={{ height: H }} onMouseLeave={() => setHover(null)}>
      {w > 0 && (
        <svg width={w} height={H} onMouseMove={move} onTouchStart={move} onTouchMove={move} role="img" aria-label={label}>
          {ticks.map((t) => (
            <g>
              <line x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} class={t === 0 ? 'chart-base' : 'chart-grid'} />
              <text x={padL - 8} y={y(t) + 4} class="chart-axis" text-anchor="end">
                {format(t)}
              </text>
            </g>
          ))}
          <path d={area} fill={color} opacity="0.1" />
          <path d={line} fill="none" stroke={color} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
          {data.map((d, i) => (
            <text x={x(i)} y={H - 6} class="chart-axis" text-anchor="middle">
              {d.label}
            </text>
          ))}
          {hover != null && <line x1={pts[hover][0]} x2={pts[hover][0]} y1={padT} y2={padT + innerH} class="chart-cross" />}
          {last && hover == null && <circle cx={last[0]} cy={last[1]} r="4.5" fill={color} stroke="var(--surface)" stroke-width="2" />}
          {hover != null && <circle cx={pts[hover][0]} cy={pts[hover][1]} r="5" fill={color} stroke="var(--surface)" stroke-width="2" />}
        </svg>
      )}
      {hover != null && data[hover] && (
        <Tip tip={{ x: Math.min(Math.max(pts[hover][0], 70), w - 70), y: Math.max(8, pts[hover][1] - 14), title: data[hover].tipLabel || data[hover].label, rows: [{ color, value: format(data[hover].value), label: label || '' }] }} />
      )}
    </div>
  );
}

/* Barres horizontales (classements, répartitions). */
export function HBars({ data, format = compact, color = 'var(--accent)', max, onClick, emptyText = 'Aucune donnée' }) {
  const m = max || Math.max(1, ...data.map((d) => d.value));
  if (!data.length) return <div class="chart-empty">{emptyText}</div>;
  return (
    <div class="hbars">
      {data.map((d) => (
        <div class={'hbar' + (onClick ? ' hbar-click' : '')} onClick={onClick && (() => onClick(d))} title={`${d.label} : ${format(d.value)}`}>
          <div class="hbar-top">
            <span class="hbar-label">{d.label}</span>
            <span class="hbar-value">
              {format(d.value)}
              {d.sub && <span class="hbar-sub"> {d.sub}</span>}
            </span>
          </div>
          <div class="hbar-track">
            <svg width="100%" height="8" preserveAspectRatio="none" viewBox="0 0 100 8">
              <path d={barPath(0, 0, Math.max(d.value > 0 ? 1.2 : 0, (d.value / m) * 100), 8, 1.2)} fill={d.color || color} />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Entonnoir : barres décroissantes + taux de passage entre étapes. */
export function Funnel({ steps, color = 'var(--accent)' }) {
  const m = Math.max(1, steps[0] ? steps[0].value : 1);
  return (
    <div class="funnel">
      {steps.map((s, i) => {
        const prev = i ? steps[i - 1].value : null;
        const rate = prev ? Math.round((s.value / prev) * 1000) / 10 : null;
        return (
          <div class="funnel-row">
            <div class="funnel-label">{s.label}</div>
            <div class="funnel-bar">
              <span style={{ width: Math.max(s.value ? 2 : 0, (s.value / m) * 100) + '%', background: color, opacity: 1 - i * 0.13 }} />
            </div>
            <div class="funnel-value">{s.value.toLocaleString('fr-FR')}</div>
            <div class="funnel-rate">{rate != null ? (prev ? `${rate.toLocaleString('fr-FR')} %` : '—') : ''}</div>
          </div>
        );
      })}
    </div>
  );
}

/* Anneau de progression (objectif) — la couleur porte l'état. */
export function Ring({ value, max, size = 132, stroke = 12, label, sub }) {
  const p = max ? Math.min(1, value / max) : 0;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const tone = p >= 1 ? 'var(--good)' : p >= 0.6 ? 'var(--accent)' : 'var(--warn)';
  return (
    <div class="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" stroke-width={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          stroke-width={stroke}
          stroke-linecap="round"
          stroke-dasharray={`${c * p} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          class="ring-arc"
        />
      </svg>
      <div class="ring-center">
        <div class="ring-value">{label}</div>
        {sub && <div class="ring-sub">{sub}</div>}
      </div>
    </div>
  );
}

export function Sparkline({ values, width = 96, height = 28, color = 'var(--accent)' }) {
  if (!values || values.length < 2) return null;
  const m = Math.max(1, ...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * (width - 4) + 2, height - 3 - (v / m) * (height - 6)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('');
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} class="spark" aria-hidden="true">
      <path d={`${d}L${last[0]},${height}L2,${height}Z`} fill={color} opacity="0.1" />
      <path d={d} fill="none" stroke={color} stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}

/* Carte de chaleur d'activité (jours × semaines), une seule teinte. */
export function Heatmap({ days, format = (v) => v }) {
  const m = Math.max(1, ...days.map((d) => d.value));
  return (
    <div class="heatmap">
      {days.map((d) => (
        <span class="heat" title={`${d.title} : ${format(d.value)}`} style={{ background: d.value ? `rgb(var(--accent-rgb) / ${0.18 + (d.value / m) * 0.82})` : 'var(--surface-3)' }} />
      ))}
    </div>
  );
}
