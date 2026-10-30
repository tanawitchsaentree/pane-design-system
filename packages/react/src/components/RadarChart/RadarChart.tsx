import { forwardRef, useState, type KeyboardEvent } from 'react';
import { ChartFrame, seriesVar, useWidth } from '../../chart/core';
import c from '../../chart/Chart.module.css';
import styles from './RadarChart.module.css';
import { useMessages } from '../../i18n/context';

export interface RadarChartProps {
  /** The chart's title; it names the figure and the plot. */
  label: string;
  /** A line under the title that says what the axes measure. */
  description?: string;
  /** The axis names, clockwise from the top, such as Speed, Interaction, Late game, Consistency. Three to eight read well. */
  axes: string[];
  /** One shape per series, a value per axis. Up to three keep apart; more belong in small multiples. */
  series: { name: string; values: number[] }[];
  /** The value at the outer ring; the largest value by default. */
  max?: number;
  /** How many rings the grid has; 4 by default. */
  rings?: number;
  /** Formats values in the tooltip and the table. */
  format?: (value: number) => string;
  /** The plot's side in pixels; it shrinks to the width it is given. 240 by default. */
  blockSize?: number;
  /** Extra class on the figure. */
  className?: string;
}

/** A profile over a few axes as one shape per series: a 2px outline and a faint wash of its colour on a
 *  recessive grid of rings and spokes. Arrow keys walk the axes and say every series' value there; the table
 *  view gives every number. Use it for a profile at a glance, never to compare exact values. */
export const RadarChart = forwardRef<HTMLElement, RadarChartProps>(function RadarChart({ label, description, axes, series, max, rings = 4, format = (v) => String(Math.round(v * 10) / 10), blockSize: side = 240, className }, _ref) {
  const t = useMessages();
  const [box, width] = useWidth<HTMLDivElement>();
  const [at, setAt] = useState<number | null>(null);
  const S = Math.max(120, Math.min(side, width || side));
  const top = max ?? Math.max(1, ...series.flatMap((s) => s.values));
  const pad = 40; const r = S / 2 - pad; const cx = S / 2, cy = S / 2;
  const pt = (i: number, v: number) => { const a = -Math.PI / 2 + (i / axes.length) * Math.PI * 2; const k = (Math.max(0, v) / top) * r; return [cx + Math.cos(a) * k, cy + Math.sin(a) * k] as const; };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).join(',')).join(' ');
  const key = (e: KeyboardEvent) => {
    const n = axes.length; const m: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (m[e.key]) { e.preventDefault(); setAt((a) => ((a ?? -1) + m[e.key] + n) % n); }
    if (e.key === 'Escape') setAt(null);
  };
  return (
    <ChartFrame component="RadarChart" label={label} description={description} className={className} series={series.map((s) => ({ name: s.name, kind: 'line' }))}
      table={{ head: ['', ...series.map((s) => s.name)], rows: axes.map((a, i) => [a, ...series.map((s) => format(s.values[i] ?? 0))]) }}>
      <div ref={box} className={c.plot} tabIndex={0} role="group" aria-roledescription={t.chart} aria-label={t.radarSummary(label, axes)}
        onKeyDown={key} onBlur={() => setAt(null)}>
        <svg className={c.svg} width={S} height={S} aria-hidden="true">
          {Array.from({ length: rings }, (_, k) => <polygon key={k} className={styles.ring} points={poly(axes.map(() => (top * (k + 1)) / rings))} />)}
          {axes.map((a, i) => { const [x, y] = pt(i, top); return <line key={a} className={styles.spoke} x1={cx} y1={cy} x2={x} y2={y} />; })}
          {series.map((s, k) => <polygon key={s.name} className={styles.shape} style={{ fill: seriesVar(k), stroke: seriesVar(k) }} points={poly(s.values)} />)}
          {at !== null && series.map((s, k) => { const [x, y] = pt(at, s.values[at] ?? 0); return <circle key={s.name} className={styles.dot} style={{ fill: seriesVar(k) }} cx={x} cy={y} r={4} />; })}
          {axes.map((a, i) => { const [x, y] = pt(i, top * 1.18); return <text key={a} className={at === i ? c.label : c.tick} x={x} y={y} dy="0.32em" textAnchor={Math.abs(x - cx) < 4 ? 'middle' : x > cx ? 'start' : 'end'}>{a}</text>; })}
        </svg>
      </div>
      <span className={styles.live} aria-live="polite">{at === null ? '' : `${axes[at]}: ${series.map((s) => `${s.name} ${format(s.values[at] ?? 0)}`).join(', ')}`}</span>
    </ChartFrame>
  );
});
