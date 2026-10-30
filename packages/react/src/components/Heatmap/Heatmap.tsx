import { forwardRef, useState, type KeyboardEvent } from 'react';
import { ChartFrame, Tip, compact, useWidth } from '../../chart/core';
import c from '../../chart/Chart.module.css';
import styles from './Heatmap.module.css';
import { useMessages } from '../../i18n/context';

export interface HeatmapProps {
  /** The chart's title. */
  label: string;
  /** A line under the title that says what the shade measures, such as Orders per hour. */
  description?: string;
  /** The row names, top to bottom, such as weekdays. */
  rows: string[];
  /** The column names, start to end, such as hours. */
  columns: string[];
  /** One array per row, one value per column. */
  values: number[][];
  /** Formats values in the tooltip and the table. */
  format?: (value: number) => string;
  /** Shows every nth column name so names do not collide; 1 by default. */
  labelEvery?: number;
  /** Extra class on the figure. */
  className?: string;
}

const LEFT = 48, CELL_GAP = 2;

/** A grid of cells shaded in one hue from faint to full by value (sequential: more is stronger), with a
 *  2px surface gap between cells and a scale from the lowest to the highest value. Arrow keys walk the
 *  cells and the tooltip says the row, the column and the value. */
export const Heatmap = forwardRef<HTMLElement, HeatmapProps>(function Heatmap({ label, description, rows, columns, values, format = compact, labelEvery = 1, className }, _ref) {
  const msg = useMessages();
  const [box, width] = useWidth<HTMLDivElement>();
  const [at, setAt] = useState<[number, number] | null>(null);
  const flat = values.flat(); const lo = Math.min(...flat), hi = Math.max(...flat);
  const cw = Math.max(8, (width - LEFT) / Math.max(1, columns.length)); const ch = Math.min(32, Math.max(16, cw));
  const H = rows.length * ch + 20;
  const t = (v: number) => (v - lo) / (hi - lo || 1);
  const key = (e: KeyboardEvent) => {
    const [r, col] = at ?? [0, -1];
    const m: Record<string, [number, number]> = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] };
    if (m[e.key]) { e.preventDefault(); setAt([Math.max(0, Math.min(rows.length - 1, r + m[e.key][0])), Math.max(0, Math.min(columns.length - 1, col + m[e.key][1]))]); }
    if (e.key === 'Escape') setAt(null);
  };
  return (
    <ChartFrame component="Heatmap" label={label} description={description} className={className} series={[]}
      table={{ head: ['', ...columns], rows: rows.map((r, i) => [r, ...values[i].map((v) => format(v))]) }}>
      <div ref={box} className={c.plot} tabIndex={0} role="group" aria-roledescription={msg.chart} aria-label={msg.heatmapSummary(label, rows.length, columns.length, format(lo), format(hi))}
        onKeyDown={key} onBlur={() => setAt(null)} onPointerLeave={() => setAt(null)}>
        {width > 0 && (
          <svg className={c.svg} width={width} height={H} aria-hidden="true">
            {rows.map((r, i) => <text key={r} className={c.tick} x={LEFT - 8} y={i * ch + ch / 2} dy="0.32em" textAnchor="end">{r}</text>)}
            {columns.map((col, j) => j % labelEvery === 0 && <text key={col} className={c.tick} x={LEFT + j * cw + cw / 2} y={rows.length * ch + 14} textAnchor="middle">{col}</text>)}
            {values.map((row, i) => row.map((v, j) => (
              <rect key={`${i}-${j}`} x={LEFT + j * cw + CELL_GAP / 2} y={i * ch + CELL_GAP / 2} width={cw - CELL_GAP} height={ch - CELL_GAP} rx={2}
                className={styles.cell} data-on={at && at[0] === i && at[1] === j ? '' : undefined} style={{ opacity: 0.12 + t(v) * 0.88 }} onPointerEnter={() => setAt([i, j])} />
            )))}
          </svg>
        )}
        {at && <Tip x={LEFT + at[1] * cw + cw / 2} y={at[0] * ch + ch / 2} title={`${rows[at[0]]}, ${columns[at[1]]}`} rows={[{ name: description ?? label, value: format(values[at[0]][at[1]]), i: 0 }]} span={width} />}
      </div>
      <div className={styles.scale} aria-hidden="true"><span>{format(lo)}</span><span className={styles.ramp} /><span>{format(hi)}</span></div>
      <span className={styles.live} aria-live="polite">{at ? `${rows[at[0]]}, ${columns[at[1]]}: ${format(values[at[0]][at[1]])}` : ''}</span>
    </ChartFrame>
  );
});
