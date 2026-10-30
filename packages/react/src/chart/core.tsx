import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../cx';
import styles from './Chart.module.css';
import { useMessages } from '../i18n/context';

/** One series: its name, shown in the legend and the tooltip, and one value per category or point. */
export interface ChartSeries {
  name: string;
  values: number[];
}

/** The pixel width of an element, kept up to date, so marks keep their fixed sizes at any width. */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** Clean axis ticks from 0 (or below, for negatives) to a round top. */
export function ticks(lo: number, hi: number, n = 4) {
  const span = Math.max(1e-9, hi - Math.min(0, lo));
  const raw = span / n; const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const start = Math.floor(Math.min(0, lo) / step) * step; const end = Math.ceil(hi / step) * step;
  const out: number[] = []; for (let v = start; v <= end + step / 2; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

/** Compact numbers from 1,000 up: 950, 1.2K, 3.4M. */
export const compact = (v: number) => new Intl.NumberFormat(undefined, { notation: Math.abs(v) >= 1000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(v);

export const SLOTS = 8;
export const seriesVar = (i: number) => `var(--ds-viz-series-${(i % SLOTS) + 1})`;

interface FrameProps {
  label: string;
  description?: string;
  series: { name: string; kind: 'bar' | 'line' }[];
  table: { head: string[]; rows: (string | number)[][] };
  children: ReactNode;
  className?: string;
  component: string;
}

/** The frame every chart shares: title, a legend for two or more series (the mark beside the name, text
 *  in text tones), the plot, and a table view one press away, so no value is reachable only by sight. */
export function ChartFrame({ label, description, series, table, children, className, component }: FrameProps) {
  const t = useMessages();
  const [asTable, setAsTable] = useState(false);
  return (
    <figure data-component={component} className={cx(styles.frame, className)}>
      <figcaption className={styles.head}>
        <span className={styles.titles}>
          <span className={styles.title}>{label}</span>
          {description && <span className={styles.description}>{description}</span>}
        </span>
        <button type="button" className={styles.toggle} aria-pressed={asTable} onClick={() => setAsTable((t) => !t)}>{asTable ? t.showChart : t.showTable}</button>
      </figcaption>
      {series.length > 1 && !asTable && (
        <ul className={styles.legend} aria-label={t.legend}>
          {series.map((s, i) => <li key={s.name} className={styles.key}><span className={cx(styles.swatch, s.kind === 'line' && styles.lineKey)} style={{ ['--pane-series' as string]: seriesVar(i) }} aria-hidden="true" />{s.name}</li>)}
        </ul>
      )}
      {asTable ? (
        <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={t.tableOf(label)}>
          <table className={styles.table}>
            <thead><tr>{table.head.map((h, i) => <th key={i} scope="col" className={cx(i > 0 && styles.num)}>{h}</th>)}</tr></thead>
            <tbody>{table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j} className={styles.num}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : children}
    </figure>
  );
}

/** The tooltip: values lead in the primary tone, series names follow in the secondary, each keyed by a short stroke. */
export function Tip({ x, y, title, rows, span }: { x: number; y: number; title: string; rows: { name: string; value: string; i: number }[]; span: number }) {
  const left = x > span * 0.6;
  return (
    <div className={styles.tip} style={{ insetInlineStart: left ? undefined : x + 12, insetInlineEnd: left ? span - x + 12 : undefined, insetBlockStart: y }} aria-hidden="true">
      <span className={styles.tipTitle}>{title}</span>
      {rows.map((r) => <span key={r.name} className={styles.tipRow}><span className={styles.tipKey} style={{ ['--pane-series' as string]: seriesVar(r.i) }} /><strong className={styles.tipValue}>{r.value}</strong><span className={styles.tipName}>{r.name}</span></span>)}
    </div>
  );
}
