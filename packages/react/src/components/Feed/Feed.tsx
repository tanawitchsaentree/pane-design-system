import { forwardRef, useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Spinner } from '../Spinner';
import styles from './Feed.module.css';
import { useMessages } from '../../i18n/context';

export interface FeedProps<T> {
  /** Names the feed, such as Latest from people you follow. */
  label: string;
  /** The items loaded so far, newest first. */
  items: T[];
  /** Draws one article's content. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Names each article for screen readers, such as Mara Lind, Lofoten at dusk. */
  getLabel: (item: T) => string;
  /** A key for each item. */
  getKey: (item: T) => string | number;
  /** Called when the reader nears the end and more can be loaded. */
  onLoadMore?: () => void;
  /** More is loading; the feed says so and is marked busy. */
  loading?: boolean;
  /** There is more to load; when false the feed ends with a line that says so. */
  hasMore?: boolean;
  /** Extra class on the feed. */
  className?: string;
}

/** A stream of articles that loads more as the reader nears the end (WAI-ARIA feed). Page Down and Page Up
 *  move between articles, the feed is busy while it loads, and it ends with words instead of a spinner
 *  that never stops. A Load more button stays for anyone who does not scroll. */
export const Feed = forwardRef(function Feed<T>({ label, items, renderItem, getLabel, getKey, onLoadMore, loading, hasMore = true, className }: FeedProps<T>, ref: React.Ref<HTMLDivElement>) {
  const t = useMessages();
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = end.current; if (!el || !onLoadMore || !hasMore) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !loading) onLoadMore(); }, { rootMargin: '0px 0px 400px 0px' });
    io.observe(el); return () => io.disconnect();
  }, [onLoadMore, hasMore, loading]);
  const key = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'PageDown' && e.key !== 'PageUp') return;
    const all = Array.from(e.currentTarget.parentElement?.querySelectorAll<HTMLElement>(":scope > article") ?? []);
    const i = all.indexOf(e.currentTarget); const to = all[i + (e.key === 'PageDown' ? 1 : -1)];
    if (to) { e.preventDefault(); to.focus(); }
  };
  return (
    <div ref={ref} data-component="Feed" className={cx(styles.root, className)}>
      <div role="feed" aria-label={label} aria-busy={loading || undefined} className={styles.feed}>
        {items.map((it, i) => (
          <article key={getKey(it)} tabIndex={0} aria-posinset={i + 1} aria-setsize={hasMore ? -1 : items.length} aria-label={getLabel(it)} className={styles.article} onKeyDown={key}>
            {renderItem(it, i)}
          </article>
        ))}
      </div>
      <div ref={end} className={styles.end}>
        {loading ? <span className={styles.status} role="status"><Spinner size="sm" aria-hidden="true" />{t.loadingMore}</span>
          : hasMore ? onLoadMore && <button type="button" className={styles.more} onClick={onLoadMore}>{t.loadMore}</button>
          : <span className={styles.status}>{t.allCaughtUp}</span>}
      </div>
    </div>
  );
}) as <T>(p: FeedProps<T> & {
  /** The wrapper around the feed, for scrolling it into view. */
  ref?: React.Ref<HTMLDivElement>;
}) => React.ReactElement;
