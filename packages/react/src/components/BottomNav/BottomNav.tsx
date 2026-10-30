import { forwardRef, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './BottomNav.module.css';
import { useMessages } from '../../i18n/context';

export interface BottomNavItem {
  /** Where it goes. */
  href: string;
  /** One word: Feed, Trips, Inbox. */
  label: string;
  /** The icon above the label. */
  icon: ReactNode;
  /** A count shown as a small mark, such as unread messages. */
  badge?: number;
}

export interface BottomNavProps {
  /** Three to five destinations. */
  items: BottomNavItem[];
  /** The href of the current destination; it is marked and announced as the current page. */
  current: string;
  /** The landmark's name. Defaults to Main. */
  label?: string;
  /** `fixed` (default) floats at the bottom of the viewport; `contained` sits in its parent. */
  position?: 'fixed' | 'contained';
  /** Called with the href when a destination is chosen, for client-side routing. */
  onNavigate?: (href: string, event: React.MouseEvent) => void;
  /** Extra class on the root. */
  className?: string;
}

/** A phone's main navigation: three to five destinations in a floating pill at the bottom, the current one
 *  chosen glass with its label in semibold, so it is marked by shape and weight, not only by colour. */
export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(function BottomNav({ items, current, label: labelIn, position = 'fixed', onNavigate, className }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.main;
  return (
    <nav ref={ref} aria-label={label} data-component="BottomNav" className={cx(styles.dock, styles[position], className)}>
      {items.map((it) => (
        <a key={it.href} href={it.href} aria-current={it.href === current ? 'page' : undefined} className={styles.item} onClick={(e) => onNavigate?.(it.href, e)}>
          <span className={styles.icon} aria-hidden="true">{it.icon}{it.badge ? <span className={styles.badge}>{it.badge > 99 ? '99+' : it.badge}</span> : null}</span>
          <span className={styles.label}>{it.label}{it.badge ? <span className={styles.sr}>{t.newCount(it.badge)}</span> : null}</span>
        </a>
      ))}
    </nav>
  );
});
