import { forwardRef, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Sidebar.module.css';
import { useMessages } from '../../i18n/context';

export interface SidebarItem { href: string; label: string; icon?: ReactNode; badge?: string }
export interface SidebarSection { title?: string; items: SidebarItem[] }

export interface SidebarProps {
  /** Groups of destinations, each with an optional heading. */
  sections: SidebarSection[];
  /** The href of the current page. */
  current: string;
  /** Something at the top, such as the product's name or a workspace switcher. */
  header?: ReactNode;
  /** Something at the foot, such as the signed-in person. */
  footer?: ReactNode;
  /** The landmark's name. Defaults to Main. */
  label?: string;
  /** Extra class on the root. */
  className?: string;
}

/** Navigation that stays beside the content on a wide screen: sections of destinations on a pane, the
 *  current one chosen glass with its label in semibold. On a phone, put the same sections in a Drawer. */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar({ sections, current, header, footer, label: labelIn, className }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.main;
  return (
    <nav ref={ref} aria-label={label} data-component="Sidebar" className={cx(styles.pane, className)}>
      {header != null && <div className={styles.header}>{header}</div>}
      {sections.map((s, i) => (
        <div key={s.title ?? i} className={styles.section}>
          {s.title && <p className={styles.title} id={`sb-${i}`}>{s.title}</p>}
          <ul className={styles.list} aria-labelledby={s.title ? `sb-${i}` : undefined}>
            {s.items.map((it) => (
              <li key={it.href}>
                <a href={it.href} aria-current={it.href === current ? 'page' : undefined} className={styles.item}>
                  {it.icon != null && <span className={styles.icon} aria-hidden="true">{it.icon}</span>}
                  <span className={styles.label}>{it.label}</span>
                  {it.badge && <span className={styles.badge}>{it.badge}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {footer != null && <div className={styles.footer}>{footer}</div>}
    </nav>
  );
});
