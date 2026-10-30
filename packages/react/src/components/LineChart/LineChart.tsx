import { forwardRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ChartFrame, Tip, compact, seriesVar, ticks, useWidth, type ChartSeries } from '../../chart/core';
import c from '../../chart/Chart.module.css';
import styles from './LineChart.module.css';
import { useMessages } from '../../i18n/context';

export interface LineChartProps {
  /** The chart's title; it names the figure and the plot. */
  label: string;
  /** A line under the title that says what is measured, such as Visitors per day. */
  description?: string;
  /** The points along the x axis, in order, such as dates; one per value in each series. */
  points: string[];
  /** One or more series; with two or more a legend appears, and up to four are also labelled at their ends. */
  series: ChartSeries[];
  /** Fills under a single series with a faint wash of its colour, for a total over time. */
  area?: boolean;
  /** Formats values in the tooltip, the end labels and the table. */
  format?: (value: number) => string;
  /** Shows every nth point's name on the axis so names do not collide; chosen from the width by default. */
  labelEvery?: number;
  /** The plot's height in pixels; 240 by default. */
  blockSize?: number;
  /** Extra class on the figure. */
  className?: string;
}

const AXIS = 36, PAD = 12, END = 72;

/** Lines 2px wide with round joins on a recessive hairline grid, an end dot with a surface ring and a
 *  direct label at the end of each line (up to four). A crosshair finds the nearest point under the
 *  pointer, arrow keys walk the points, and the tooltip lists every series there. */
export const LineChart = forwardRef<HTMLElement, LineChartProps>(function LineChart({ label, description, points, series, area, format = compact, labelEvery, blockSize: plot = 240, className }, _ref) {
  const t = useMessages();
  const [box, width] = useWidth<HTMLDivElement>();
  const [at, setAt] = useState<number | null>(null);
  const all = series.flatMap((s) => s.values);
  const tk = ticks(Math.min(0, ...all), Math.max(0, ...all)); const top = tk[tk.length - 1]; const bottom = tk[0];
  const ends = series.length <= 4;
  const plotW = Math.max(0, width - AXIS - (ends ? END : PAD));
  const x = (i: number) => AXIS + (points.length > 1 ? (i / (points.length - 1)) * plotW : plotW / 2);
  const y = (v: number) => PAD + (1 - (v - bottom) / (top - bottom || 1)) * (plot - PAD * 2);
  const every = labelEvery ?? Math.max(1, Math.ceil(points.length / Math.max(1, Math.floor(plotW / 64))));
  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('');
  const near = (e: PointerEvent) => { const r = e.currentTarget.getBoundingClientRect(); const px = e.clientX - r.left; const i = Math.round(((px - AXIS) / (plotW || 1)) * (points.length - 1)); setAt(Math.max(0, Math.min(points.length - 1, i))); };
  const key = (e: KeyboardEvent) => {
    const n = points.length; const m: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (m[e.key]) { e.preventDefault(); setAt((a) => Math.max(0, Math.min(n - 1, (a ?? (m[e.key] > 0 ? -1 : n)) + m[e.key]))); }
    if (e.key === 'Home') { e.preventDefault(); setAt(0); } if (e.key === 'End') { e.preventDefault(); setAt(n - 1); } if (e.key === 'Escape') setAt(null);
  };
  // end labels: spaced so they never overlap; with converging lines they keep a leader to their line's end
  const order = series.map((s, k) => ({ k, y: y(s.values[s.values.length - 1] ?? 0) })).sort((a, b) => a.y - b.y);
  const placed: Record<number, number> = {}; let last = -Infinity;
  for (const o of order) { const yy = Math.max(o.y, last + 16); placed[o.k] = yy; last = yy; }
  const rows = at === null ? [] : series.map((s, k) => ({ name: s.name, value: format(s.values[at] ?? 0), i: k }));
  return (
    <ChartFrame component="LineChart" label={label} description={description} className={className} series={series.map((s) => ({ name: s.name, kind: 'line' }))}
      table={{ head: ['', ...series.map((s) => s.name)], rows: points.map((p, i) => [p, ...series.map((s) => format(s.values[i] ?? 0))]) }}>
      <div ref={box} className={c.plot} tabIndex={0} role="group" aria-roledescription={t.chart} aria-label={t.lineSummary(label, points.length, points[0], points[points.length - 1])}
        onKeyDown={key} onBlur={() => setAt(null)} onPointerMove={near} onPointerLeave={() => setAt(null)}>
        {width > 0 && (
          <svg className={c.svg} width={width} height={plot + 20} aria-hidden="true">
            {tk.map((t) => <g key={t}><line className={t === 0 ? c.base : c.grid} x1={AXIS} x2={AXIS + plotW} y1={y(t)} y2={y(t)} /><text className={c.tick} x={AXIS - 6} y={y(t)} dy="0.32em" textAnchor="end">{compact(t)}</text></g>)}
            {points.map((p, i) => (i % every === 0 || i === points.length - 1) && <text key={p + i} className={c.tick} x={x(i)} y={plot + 14} textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}>{p}</text>)}
            {area && series.length === 1 && <path className={styles.area} style={{ fill: seriesVar(0) }} d={`${path(series[0].values)}L${x(series[0].values.length - 1)},${y(Math.max(0, bottom))}L${x(0)},${y(Math.max(0, bottom))}Z`} />}
            {at !== null && <line className={c.cross} x1={x(at)} x2={x(at)} y1={PAD} y2={plot - PAD} />}
            {series.map((s, k) => <path key={s.name} className={styles.line} style={{ stroke: seriesVar(k) }} d={path(s.values)} />)}
            {series.map((s, k) => { const i = at ?? s.values.length - 1; return <circle key={`d${s.name}`} className={styles.dot} style={{ fill: seriesVar(k) }} cx={x(i)} cy={y(s.values[i] ?? 0)} r={4} />; })}
            {ends && series.map((s, k) => { const ly = placed[k]; const ey = y(s.values[s.values.length - 1] ?? 0); const ex = x(s.values.length - 1); return (
              <g key={`e${s.name}`}>
                {Math.abs(ly - ey) > 4 && <line className={c.cross} x1={ex + 6} y1={ey} x2={ex + 14} y2={ly} />}
                <text className={c.label} x={ex + 16} y={ly} dy="0.32em">{series.length > 1 ? s.name : format(s.values[s.values.length - 1] ?? 0)}</text>
              </g>); })}
          </svg>
        )}
        {at !== null && <Tip x={x(at)} y={plot / 3} title={points[at]} rows={rows} span={width} />}
      </div>
      <span className={styles.live} aria-live="polite">{at === null ? '' : `${points[at]}: ${rows.map((r) => `${r.name} ${r.value}`).join(', ')}`}</span>
    </ChartFrame>
  );
});
