import { forwardRef, useState, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './VirtualList.module.css';

export interface VirtualListProps<T> {
  /** Names the list for screen readers, such as All prints. */
  label: string;
  /** Every item; only the ones in view, plus a few either side, are in the page at a time. */
  items: T[];
  /** Draws one row. Rows must all be `rowHeight` tall. */
  renderItem: (item: T, index: number) => ReactNode;
  /** The height of every row in pixels; 44 by default, the touch size. */
  rowHeight?: number;
  /** The block size of the scrolling pane, such as 24rem. */
  blockSize: string;
  /** Rows drawn beyond each edge so a fast scroll does not show blanks; 6 by default. */
  overscan?: number;
  /** A key for each item, so rows keep their state as they scroll; the index by default. */
  getKey?: (item: T, index: number) => string | number;
  /** Extra class on the pane. */
  className?: string;
}

/** A long list in a pane that only draws the rows in view, for thousands of items. Each row says where it
 *  sits in the whole list (aria-setsize and aria-posinset), so a screen reader hears 120 of 5,000 even
 *  though most rows are not in the page. Use List until a list is long enough to be slow. */
export const VirtualList = forwardRef(function VirtualList<T>({ label, items, renderItem, rowHeight = 44, blockSize, overscan = 6, getKey, className }: VirtualListProps<T>, ref: React.Ref<HTMLDivElement>) {
  const [top, setTop] = useState(0);
  const [view, setView] = useState(0);
  const first = Math.max(0, Math.floor(top / rowHeight) - overscan);
  const last = Math.min(items.length, Math.ceil((top + (view || rowHeight * 20)) / rowHeight) + overscan);
  return (
    <div ref={(el) => { if (el && !view) setView(el.clientHeight); if (typeof ref === 'function') ref(el); else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el; }}
      data-component="VirtualList" className={cx(styles.root, className)} style={{ blockSize }} tabIndex={0} aria-label={label}
      onScroll={(e) => { setTop(e.currentTarget.scrollTop); setView(e.currentTarget.clientHeight); }}>
      <ul role="list" aria-label={label} className={styles.list} style={{ blockSize: items.length * rowHeight }}>
        {items.slice(first, last).map((it, k) => {
          const i = first + k;
          return <li key={getKey ? getKey(it, i) : i} aria-setsize={items.length} aria-posinset={i + 1} className={styles.row} style={{ insetBlockStart: i * rowHeight, blockSize: rowHeight }}>{renderItem(it, i)}</li>;
        })}
      </ul>
    </div>
  );
}) as <T>(p: VirtualListProps<T> & {
  /** The scrolling pane, for scrolling it to a row or measuring it. */
  ref?: React.Ref<HTMLDivElement>;
}) => React.ReactElement;
