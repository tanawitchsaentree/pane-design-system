import { forwardRef, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import * as RC from '@radix-ui/react-checkbox';
import cb from '../Checkbox/Checkbox.module.css';
import type { TableColumn, TableSort } from '../Table';
import t from '../Table/Table.module.css';
import styles from './DataGrid.module.css';
import { useMessages } from '../../i18n/context';

export interface DataGridProps<Row extends { id: string | number }> {
  /** Says what the grid holds; it names the grid and its scrolling region. */
  caption: string;
  /** The columns, in order; `sortable` columns sort from their header. */
  columns: TableColumn<Row>[];
  /** The rows; each needs a unique `id`. */
  rows: Row[];
  /** Adds a checkbox to each row and a select-all in the header. */
  selectable?: boolean;
  /** The chosen row ids, when you keep them yourself. */
  selected?: (string | number)[];
  /** Called with the chosen row ids after each change. */
  onSelectedChange?: (ids: (string | number)[]) => void;
  /** The sort the grid starts with. */
  defaultSort?: TableSort;
  /** Keeps the first column in view while the grid scrolls sideways, for a name column. */
  stickyFirst?: boolean;
  /** Keeps the header in view while the body scrolls inside a region of this height, such as 24rem. */
  maxHeight?: string;
  /** Shown over the body while new rows load; the rows stay so the reader keeps their place. */
  loading?: boolean;
  /** What the body says when there are no rows, such as No prints match these filters; Nothing to show yet by default. */
  empty?: ReactNode;
  /** Extra class on the wrapper. */
  className?: string;
}

// Checkbox's own well and marks, without its visible label: in a grid the row is the label
function Check(p: { label: string; checked: boolean | 'indeterminate'; onChange: () => void; tabIndex: number }) {
  return (
    <RC.Root className={cb.box} aria-label={p.label} checked={p.checked} onCheckedChange={p.onChange} tabIndex={p.tabIndex}>
      <RC.Indicator className={cb.indicator}>
        <svg viewBox="0 0 16 16" aria-hidden="true" className={cb.check}><path d="M3.5 8.5l3 3 6-7" /></svg>
        <svg viewBox="0 0 16 16" aria-hidden="true" className={cb.dash}><path d="M4 8h8" /></svg>
      </RC.Indicator>
    </RC.Root>
  );
}

const cmp = (a: unknown, b: unknown) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true }));

/** Table's pane and rows as an interactive grid: one tab stop, arrow keys move between cells, Home and End
 *  go to a row's ends, Ctrl with them to the grid's corners, Space toggles a row's checkbox. A chosen row
 *  takes chosen glass and a check, so selection reads by shape (P6). Use Table when nothing is chosen. */
export const DataGrid = forwardRef(function DataGrid<Row extends { id: string | number }>({ caption, columns, rows, selectable, selected, onSelectedChange, defaultSort, stickyFirst, maxHeight, loading, empty: emptyIn, className }: DataGridProps<Row>, ref: React.Ref<HTMLDivElement>) {
  const m = useMessages();
  const empty = emptyIn ?? m.nothingToShow;
  const [sort, setSort] = useState<TableSort | undefined>(defaultSort);
  const [inner, setInner] = useState<(string | number)[]>([]);
  const chosen = selected ?? inner;
  const setChosen = (ids: (string | number)[]) => { if (selected === undefined) setInner(ids); onSelectedChange?.(ids); };
  const shown = useMemo(() => (!sort ? rows : [...rows].sort((a, b) => cmp((a as Record<string, unknown>)[sort.key], (b as Record<string, unknown>)[sort.key]) * (sort.direction === 'ascending' ? 1 : -1))), [rows, sort]);
  const cols = (selectable ? 1 : 0) + columns.length;
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const grid = useRef<HTMLTableElement>(null);
  const cell = (r: number, c: number) => grid.current?.querySelector<HTMLElement>(`[data-cell="${r}-${c}"]`);
  const focusCell = (r: number, c: number) => { const rr = Math.max(0, Math.min(shown.length, r)); const cc = Math.max(0, Math.min(cols - 1, c)); setPos([rr, cc]); const el = cell(rr, cc); const inner = el?.querySelector<HTMLElement>('button, input'); (inner ?? el)?.focus(); };
  const all = shown.length > 0 && shown.every((r) => chosen.includes(r.id));
  const some = !all && shown.some((r) => chosen.includes(r.id));
  const toggle = (id: string | number) => setChosen(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]);
  const key = (e: KeyboardEvent) => {
    const [r, c] = pos; const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const L = rtl ? 'ArrowRight' : 'ArrowLeft', R = rtl ? 'ArrowLeft' : 'ArrowRight';
    const m: Record<string, () => void> = {
      ArrowDown: () => focusCell(r + 1, c), ArrowUp: () => focusCell(r - 1, c), [L]: () => focusCell(r, c - 1), [R]: () => focusCell(r, c + 1),
      Home: () => focusCell(e.ctrlKey ? 0 : r, 0), End: () => focusCell(e.ctrlKey ? shown.length : r, cols - 1),
      PageDown: () => focusCell(r + 10, c), PageUp: () => focusCell(r - 10, c),
    };
    if (m[e.key]) { e.preventDefault(); m[e.key](); }
  };
  const tab = (r: number, c: number) => (pos[0] === r && pos[1] === c ? 0 : -1);
  const head = (c: TableColumn<Row>, i: number): ReactNode => {
    const on = sort?.key === c.key;
    return (
      <th key={c.key} scope="col" role="columnheader" data-cell={`0-${i}`} tabIndex={c.sortable ? undefined : tab(0, i)} aria-sort={c.sortable ? (on ? sort!.direction : 'none') : undefined}
        className={cx(t.th, c.align === 'end' && t.end, stickyFirst && i === (selectable ? 1 : 0) && styles.stick)} onFocus={() => setPos([0, i])}>
        {c.sortable ? (
          <button type="button" tabIndex={tab(0, i)} className={t.sort} onClick={() => setSort({ key: c.key, direction: on && sort!.direction === 'ascending' ? 'descending' : 'ascending' })}>
            {c.header}<svg viewBox="0 0 16 16" aria-hidden="true" className={cx(t.glyph, on && t.on, on && sort!.direction === 'descending' && t.desc)}><path d="M8 12.5V3.5M4.5 7 8 3.5 11.5 7" /></svg>
          </button>
        ) : c.header}
      </th>
    );
  };
  return (
    <div ref={ref} data-component="DataGrid" className={cx(t.root, t.comfortable, styles.root, className)} style={maxHeight ? { maxBlockSize: maxHeight } : undefined} aria-busy={loading || undefined}>
      <table ref={grid} role="grid" aria-label={caption} aria-rowcount={shown.length + 1} aria-multiselectable={selectable || undefined} className={t.table} onKeyDown={key}>
        <thead>
          <tr role="row" aria-rowindex={1}>
            {selectable && <th scope="col" role="columnheader" data-cell="0-0" className={cx(t.th, styles.check)} onFocus={() => setPos([0, 0])}><Check label={all ? m.clearAllRows : m.chooseAllRows} tabIndex={tab(0, 0)} checked={all ? true : some ? 'indeterminate' : false} onChange={() => setChosen(all ? [] : shown.map((r) => r.id))} /></th>}
            {columns.map((c, i) => head(c, i + (selectable ? 1 : 0)))}
          </tr>
        </thead>
        <tbody>
          {shown.length === 0 && <tr role="row"><td role="gridcell" colSpan={cols} className={t.empty}>{empty}</td></tr>}
          {shown.map((row, ri) => {
            const r = ri + 1; const on = chosen.includes(row.id);
            return (
              <tr key={row.id} role="row" aria-rowindex={r + 1} aria-selected={selectable ? on : undefined} className={cx(t.tr, on && styles.chosen)}>
                {selectable && <td role="gridcell" data-cell={`${r}-0`} className={cx(t.td, styles.check)} onFocus={() => setPos([r, 0])}><Check label={m.chooseItem(String((row as Record<string, unknown>)[columns[0].key] ?? m.row(r)))} tabIndex={tab(r, 0)} checked={on} onChange={() => toggle(row.id)} /></td>}
                {columns.map((c, ci) => {
                  const i = ci + (selectable ? 1 : 0);
                  return <td key={c.key} role="gridcell" data-cell={`${r}-${i}`} tabIndex={tab(r, i)} onFocus={() => setPos([r, i])} onKeyDown={(e) => { if (e.key === ' ' && selectable) { e.preventDefault(); toggle(row.id); } }}
                    className={cx(t.td, c.align === 'end' && t.end, styles.cell, stickyFirst && ci === 0 && styles.stick)}>{c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key] as ReactNode)}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {loading && <div className={styles.loading} role="status">{m.loadingRows}</div>}
    </div>
  );
}) as <Row extends { id: string | number }>(p: DataGridProps<Row> & {
  /** The grid’s pane, for scrolling it into view or measuring it. */
  ref?: React.Ref<HTMLDivElement>;
}) => React.ReactElement;
