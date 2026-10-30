import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Table.module.css';
import { useMessages } from '../../i18n/context';

export interface TableColumn<Row> {
  /** The key the column reads from each row, and its name in `sort`. */
  key: string;
  /** The header text. */
  header: string;
  /** `start` (default) for words, `end` for numbers so their digits line up. */
  align?: 'start' | 'end';
  /** Lets the reader sort by this column from its header. */
  sortable?: boolean;
  /** Draws the cell from the row; by default the cell shows `row[key]`. */
  render?: (row: Row) => ReactNode;
}

export interface TableSort {
  /** The column key the rows are sorted by. */
  key: string;
  /** `ascending` puts the smallest or first value at the top. */
  direction: 'ascending' | 'descending';
}

export interface TableProps<Row extends Record<string, unknown>> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Says what the table holds; it is the table's caption and the name of its scrolling region. */
  caption: string;
  /** Shows the caption above the table; when off it is still read by screen readers. */
  showCaption?: boolean;
  /** The columns, in order. */
  columns: TableColumn<Row>[];
  /** The rows. Each needs an `id`, or its index is used as the key. */
  rows: Row[];
  /** `comfortable` (default) gives each row a 44px height; `compact` is tighter, for dense data read with a pointer. */
  density?: 'comfortable' | 'compact';
  /** The sort the table starts with; the table then keeps its own sort. */
  defaultSort?: TableSort;
  /** The sort, when you keep it yourself; pair it with `onSortChange` and sort `rows` before you pass them. */
  sort?: TableSort;
  /** Called with the new sort when the reader presses a sortable header. */
  onSortChange?: (sort: TableSort) => void;
  /** Keeps the header row in view while the body scrolls inside a region of this height, such as 20rem. */
  maxHeight?: string;
  /** What the body says when there are no rows, such as No prints match these filters; Nothing to show yet by default. */
  empty?: ReactNode;
  /** Shown over the body while rows load; the rows stay so the reader keeps their place, and the table says it is busy. */
  loading?: boolean;
}

function compare(a: unknown, b: unknown) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true });
}

/** Rows and columns of data in a real table with a caption, set on a level-2 pane with hairlines between
 *  rows and an opaque header that stays in view. A sortable header is a button that says its order, and
 *  a table wider than its pane scrolls inside a named region that takes focus. */
export const Table = forwardRef(function Table<Row extends Record<string, unknown>>({ caption, showCaption, columns, rows, density = 'comfortable', defaultSort, sort, onSortChange, maxHeight, empty: emptyIn, loading, className, style, ...rest }: TableProps<Row>, ref: React.Ref<HTMLDivElement>) {
  const t = useMessages();
  const empty = emptyIn ?? t.nothingToShow;
  const [inner, setInner] = useState<TableSort | undefined>(defaultSort);
  const current = sort ?? inner;
  const shown = sort || !current ? rows : [...rows].sort((a, b) => compare(a[current.key], b[current.key]) * (current.direction === 'ascending' ? 1 : -1));
  const press = (key: string) => {
    const next: TableSort = { key, direction: current?.key === key && current.direction === 'ascending' ? 'descending' : 'ascending' };
    if (sort === undefined) setInner(next);
    onSortChange?.(next);
  };
  return (
    <div ref={ref} data-component="Table" role="region" aria-label={caption} aria-busy={loading || undefined} tabIndex={0} className={cx(styles.root, styles[density], maxHeight && styles.scroll, className)} style={maxHeight ? { ...style, maxBlockSize: maxHeight } : style} {...rest}>
      <table className={styles.table}>
        <caption className={showCaption ? styles.caption : styles.hidden}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => {
              const on = current?.key === c.key;
              return (
                <th key={c.key} scope="col" aria-sort={c.sortable ? (on ? current!.direction : 'none') : undefined} className={cx(styles.th, c.align === 'end' && styles.end)}>
                  {c.sortable ? (
                    <button type="button" className={styles.sort} onClick={() => press(c.key)}>
                      {c.header}
                      <svg viewBox="0 0 16 16" aria-hidden="true" className={cx(styles.glyph, on && styles.on, on && current!.direction === 'descending' && styles.desc)}><path d="M8 12.5V3.5M4.5 7 8 3.5 11.5 7" /></svg>
                    </button>
                  ) : c.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {shown.length === 0 && <tr><td colSpan={columns.length} className={styles.empty}>{empty}</td></tr>}
          {shown.map((r, i) => (
            <tr key={String(r.id ?? i)} className={styles.tr}>
              {columns.map((c) => <td key={c.key} className={cx(styles.td, c.align === 'end' && styles.end)}>{c.render ? c.render(r) : (r[c.key] as ReactNode)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div className={styles.loading} role="status">{t.loadingRows}</div>}
    </div>
  );
}) as <Row extends Record<string, unknown>>(p: TableProps<Row> & {
  /** The scrolling region around the table, for scrolling it into view or measuring it. */
  ref?: React.Ref<HTMLDivElement>;
}) => React.ReactElement;
