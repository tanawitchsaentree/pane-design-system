import { forwardRef } from 'react';
import { cx } from '../../cx';
import styles from './Breadcrumb.module.css';
import { useMessages } from '../../i18n/context';

export interface BreadcrumbItem { href: string; label: string }

export interface BreadcrumbProps {
  /** The path from the top, the current page last. */
  items: BreadcrumbItem[];
  /** The landmark's name. Defaults to Breadcrumb. */
  label?: string;
  /** Extra class on the root. */
  className?: string;
}

/** Where the page sits in the hierarchy: links to each level above, the current page last and not a link,
 *  separated by a quiet chevron. On a narrow screen the trail wraps onto a second line. */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb({ items, label: labelIn, className }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.breadcrumb;
  const last = items.length - 1;
  return (
    <nav ref={ref} aria-label={label} data-component="Breadcrumb" className={cx(styles.root, className)}>
      <ol className={styles.list}>
        {items.map((it, i) => (
          <li key={it.href} className={styles.crumb}>
            {i > 0 && <svg className={styles.sep} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>}
            {i === last ? <span aria-current="page" className={styles.current}>{it.label}</span> : <a href={it.href} className={styles.link}>{it.label}</a>}
          </li>
        ))}
      </ol>
    </nav>
  );
});
