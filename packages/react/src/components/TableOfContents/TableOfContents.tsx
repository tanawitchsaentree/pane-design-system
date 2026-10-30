import { forwardRef, useEffect, useState } from 'react';
import { cx } from '../../cx';
import styles from './TableOfContents.module.css';
import { useMessages } from '../../i18n/context';

export interface TocItem { id: string; label: string; level?: 2 | 3 }

export interface TableOfContentsProps {
  /** The sections of the page, by the id of their heading. */
  items: TocItem[];
  /** The list's name. Defaults to On this page. */
  label?: string;
  /** Marks the section in view as the reader scrolls. Defaults to true. */
  track?: boolean;
  /** Extra class on the root. */
  className?: string;
}

/** The sections of a long page as links ("On this page"), the one in view marked by a lit line beside it
 *  and semibold text, so the reader always sees where they are. Links move focus to the heading. */
export const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(function TableOfContents({ items, label: labelIn, track = true, className }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.onThisPage;
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    if (!track || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => { const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setActive(v.target.id); }, { rootMargin: '0px 0px -70% 0px' });
    for (const it of items) { const el = document.getElementById(it.id); if (el) io.observe(el); }
    return () => io.disconnect();
  }, [items, track]);
  return (
    <nav ref={ref} aria-label={label} data-component="TableOfContents" className={cx(styles.root, className)}>
      <p className={styles.title} aria-hidden="true">{label}</p>
      <ul className={styles.list}>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} aria-current={it.id === active ? 'location' : undefined} className={cx(styles.link, it.level === 3 && styles.sub)}
              onClick={() => { const h = document.getElementById(it.id); if (h) { h.setAttribute('tabindex', '-1'); setTimeout(() => h.focus({ preventScroll: true }), 0); } setActive(it.id); }}>{it.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
});
