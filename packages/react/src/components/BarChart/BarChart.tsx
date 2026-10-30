import { forwardRef, useState, type KeyboardEvent } from 'react';
import { ChartFrame, Tip, compact, seriesVar, ticks, useWidth, type ChartSeries } from '../../chart/core';
import c from '../../chart/Chart.module.css';
import styles from './BarChart.module.css';
import { useMessages } from '../../i18n/context';

export interface BarChartProps {
  /** The chart's title; it names the figure and the plot. */
  label: string;
  /** A line under the title that says what is measured and over what, such as Prints sold per month, 2026. */
  description?: string;
  /** The category names along the axis, one per value in each series. */
  categories: string[];
  /** One or more series; with two or more a legend appears. Up to eight keep their own colours; fold the rest into Other. */
  series: ChartSeries[];
  /** `column` (default) grows up from the baseline; `bar` grows sideways, for many or long category names. */
  layout?: 'column' | 'bar';
  /** Stacks the series in one bar per category, for part-to-whole; otherwise they sit side by side. */
  stacked?: boolean;
  /** Formats values in labels, the tooltip and the table, such as a currency. */
  format?: (value: number) => string;
  /** The plot's height in pixels for `column`; 240 by default. A `bar` chart grows with its categories. */
  blockSize?: number;
  /** Extra class on the figure. */
  className?: string;
}

const BAR_MAX = 24, GAP = 2, RADIUS = 4, AXIS = 36, PAD = 8, ROW = 32;

/** Bars from one baseline, at most 24px thick with a 4px rounded data end, a 2px gap between touching
 *  bars, recessive hairline grid and a value at the tip of a single series. One tab stop: arrow keys
 *  walk the categories and the tooltip lists every series at the one in focus. */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart({ label, description, categories, series, layout = 'column', stacked, format = compact, blockSize: plot = 240, className }, _ref) {
  const t = useMessages();
  const [box, width] = useWidth<HTMLDivElement>();
  const [at, setAt] = useState<number | null>(null);
  const sums = categories.map((_, i) => series.reduce((s, x) => s + Math.max(0, x.values[i] ?? 0), 0));
  const hi = stacked ? Math.max(...sums, 0) : Math.max(...series.flatMap((s) => s.values), 0);
  const lo = Math.min(0, ...series.flatMap((s) => s.values));
  const tk = ticks(lo, hi); const top = tk[tk.length - 1]; const bottom = tk[0];
  const col = layout === 'column';
  const H = col ? plot : categories.length * ROW + PAD * 2;
  const along = col ? Math.max(0, width - AXIS) : Math.max(0, width - AXIS * 2.5);
  const band = categories.length ? along / categories.length : 0;
  const per = stacked ? 1 : series.length;
  const thick = Math.max(2, Math.min(BAR_MAX, (band * 0.7 - GAP * (per - 1)) / per));
  const span = col ? H - PAD * 2 : along;
  const v2p = (v: number) => ((v - bottom) / (top - bottom || 1)) * (col ? span : along);
  const base = v2p(0);
  const key = (e: KeyboardEvent) => {
    const n = categories.length; if (!n) return;
    const m: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (m[e.key]) { e.preventDefault(); setAt((a) => Math.max(0, Math.min(n - 1, (a ?? -1) + m[e.key]))); }
    if (e.key === 'Home') { e.preventDefault(); setAt(0); } if (e.key === 'End') { e.preventDefault(); setAt(n - 1); } if (e.key === 'Escape') setAt(null);
  };
  // a bar path with the data end rounded and the baseline end square
  const bar = (x: number, y: number, w: number, h: number, up: boolean) => {
    const r = Math.min(RADIUS, w / 2, Math.abs(h));
    if (col) return up ? `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z` : `M${x},${y}V${y + h - r}Q${x},${y + h} ${x + r},${y + h}H${x + w - r}Q${x + w},${y + h} ${x + w},${y + h - r}V${y}Z`;
    return up ? `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z` : `M${x + w},${y}H${x + r}Q${x},${y} ${x},${y + r}V${y + h - r}Q${x},${y + h} ${x + r},${y + h}H${x + w}Z`;
  };
  const marks = categories.flatMap((cat, i) => {
    let acc = 0;
    return series.map((s, k) => {
      const v = s.values[i] ?? 0;
      const from = stacked ? acc : 0; const to = stacked ? acc + Math.max(0, v) : v; if (stacked) acc = to;
      const p0 = v2p(from), p1 = v2p(to);
      const lead = (band - (stacked ? thick : per * thick + (per - 1) * GAP)) / 2 + (stacked ? 0 : k * (thick + GAP));
      const last = !stacked || k === series.length - 1 || series.slice(k + 1).every((x) => (x.values[i] ?? 0) <= 0);
      const gapCut = stacked && k > 0 ? GAP : 0;
      if (col) { const x = AXIS + i * band + lead; const yTop = H - PAD - Math.max(p0, p1); const h = Math.abs(p1 - p0) - gapCut; return { d: bar(x, yTop, thick, Math.max(0, h), v >= 0 && last), k, i, cat }; }
      const y = PAD + i * ROW + (ROW - (stacked ? thick : per * thick + (per - 1) * GAP)) / 2 + (stacked ? 0 : k * (thick + GAP));
      const x0 = AXIS * 2.5 + Math.min(p0, p1) + gapCut; return { d: bar(x0, y, Math.max(0, Math.abs(p1 - p0) - gapCut), thick, v >= 0 && last), k, i, cat };
    });
  });
  const tipRows = at === null ? [] : series.map((s, k) => ({ name: s.name, value: format(s.values[at] ?? 0), i: k }));
  const tipX = at === null ? 0 : col ? AXIS + (at + 0.5) * band : AXIS * 2.5 + v2p(stacked ? sums[at] : Math.max(...series.map((s) => s.values[at] ?? 0)));
  const tipY = at === null ? 0 : col ? H / 3 : PAD + (at + 0.5) * ROW;
  return (
    <ChartFrame component="BarChart" label={label} description={description} className={className} series={series.map((s) => ({ name: s.name, kind: 'bar' }))}
      table={{ head: ['', ...series.map((s) => s.name)], rows: categories.map((cat, i) => [cat, ...series.map((s) => format(s.values[i] ?? 0))]) }}>
      <div ref={box} className={c.plot} tabIndex={0} role="group" aria-roledescription={t.chart} aria-label={t.barSummary(label, categories.length)}
        onKeyDown={key} onBlur={() => setAt(null)} onPointerLeave={() => setAt(null)}>
        {width > 0 && (
          <svg className={c.svg} width={width} height={col ? H + 20 : H} aria-hidden="true">
            {tk.map((t) => { const p = v2p(t); return col
              ? <g key={t}><line className={t === 0 ? c.base : c.grid} x1={AXIS} x2={width} y1={H - PAD - p} y2={H - PAD - p} /><text className={c.tick} x={AXIS - 6} y={H - PAD - p} dy="0.32em" textAnchor="end">{compact(t)}</text></g>
              : <g key={t}><line className={t === 0 ? c.base : c.grid} y1={PAD} y2={H - PAD} x1={AXIS * 2.5 + p} x2={AXIS * 2.5 + p} /></g>; })}
            {marks.map((m) => <path key={`${m.i}-${m.k}`} d={m.d} className={styles.bar} data-dim={at !== null && at !== m.i ? '' : undefined} style={{ fill: seriesVar(m.k) }} />)}
            {categories.map((cat, i) => col
              ? <text key={cat} className={c.tick} x={AXIS + (i + 0.5) * band} y={H + 14} textAnchor="middle">{cat}</text>
              : <text key={cat} className={c.tick} x={AXIS * 2.5 - 8} y={PAD + (i + 0.5) * ROW} dy="0.32em" textAnchor="end">{cat}</text>)}
            {series.length === 1 && categories.map((cat, i) => { const v = series[0].values[i] ?? 0; const p = v2p(v); return col
              ? <text key={`v${cat}`} className={c.label} x={AXIS + (i + 0.5) * band} y={H - PAD - Math.max(p, base) - 6} textAnchor="middle">{format(v)}</text>
              : <text key={`v${cat}`} className={c.label} x={AXIS * 2.5 + Math.max(p, base) + 6} y={PAD + (i + 0.5) * ROW} dy="0.32em">{format(v)}</text>; })}
            {categories.map((cat, i) => col
              ? <rect key={`h${cat}`} x={AXIS + i * band} y={0} width={band} height={H} fill="transparent" onPointerEnter={() => setAt(i)} />
              : <rect key={`h${cat}`} x={0} y={PAD + i * ROW} width={width} height={ROW} fill="transparent" onPointerEnter={() => setAt(i)} />)}
          </svg>
        )}
        {at !== null && <Tip x={tipX} y={tipY} title={categories[at]} rows={tipRows} span={width} />}
      </div>
      <span className={styles.live} aria-live="polite">{at === null ? '' : `${categories[at]}: ${tipRows.map((r) => `${r.name} ${r.value}`).join(', ')}`}</span>
    </ChartFrame>
  );
});
