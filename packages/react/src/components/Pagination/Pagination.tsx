import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { cx } from '../../cx';
import styles from './Pagination.module.css';
import { useMessages } from '../../i18n/context';

export interface PaginationProps {
  /** The current page, from 1. */
  page: number;
  /** How many pages there are. */
  total: number;
  /** Called with the page the reader chose. */
  onPageChange: (page: number) => void;
  /** Pages shown either side of the current one before an ellipsis. Defaults to 1. */
  siblings?: number;
  /** The landmark's name. Defaults to Pagination. */
  label?: string;
  /** Extra class on the root. */
  className?: string;
}

const range = (page: number, total: number, sib: number): Array<number | 'gap'> => {
  const set = new Set([1, total]); for (let p = page - sib; p <= page + sib; p++) if (p >= 1 && p <= total) set.add(p);
  const pages = [...set].sort((a, b) => a - b); const out: Array<number | 'gap'> = [];
  pages.forEach((p, i) => { if (i && p - pages[i - 1] > 1) out.push('gap'); out.push(p); });
  return out;
};

/** Moving through a long list one page at a time: Previous and Next at the ends, the first, last and nearby
 *  pages between, the current one chosen glass and announced as the current page. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination({ page, total, onPageChange, siblings = 1, label: labelIn, className }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.pagination;
  // compact when the whole bar does not fit the space it is given: the numbered pages give way to the words
  const own = useRef<HTMLElement | null>(null);
  const [compact, setCompact] = useState(false);
  useLayoutEffect(() => {
    const el = own.current; const host = el?.parentElement; if (!el || !host) return;
    let full = 0;
    const fit = () => {
      if (!el.hasAttribute('data-compact')) full = el.scrollWidth;
      setCompact(full > host.clientWidth + 1);
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(host);
    return () => ro.disconnect();
  }, [page, total, siblings]);
  const go = (p: number) => { if (p >= 1 && p <= total && p !== page) onPageChange(p); };
  return (
    <nav ref={(n) => { own.current = n; if (typeof ref === 'function') ref(n); else if (ref) ref.current = n; }} aria-label={label} data-component="Pagination" data-compact={compact || undefined} className={cx(styles.root, className)}>
      <button type="button" className={cx(styles.step, styles.edge)} onClick={() => go(page - 1)} disabled={page <= 1}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg><span>{t.previous}</span>
      </button>
      <ul className={styles.pages}>
        {range(page, total, siblings).map((p, i) => p === 'gap'
          ? <li key={`g${i}`} className={styles.gap} aria-hidden="true">…</li>
          : <li key={p}><button type="button" className={styles.step} aria-current={p === page ? 'page' : undefined} aria-label={t.page(p)} onClick={() => go(p)}>{p}</button></li>)}
      </ul>
      {/* on a narrow pane the page list gives way to where the reader is, in words */}
      <span className={styles.compact}>{t.of(page, total)}</span>
      <button type="button" className={cx(styles.step, styles.edge)} onClick={() => go(page + 1)} disabled={page >= total}>
        <span>{t.next}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
      </button>
    </nav>
  );
});
