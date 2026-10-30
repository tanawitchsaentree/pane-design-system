import { forwardRef, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Navbar.module.css';
import { useMessages } from '../../i18n/context';

export interface NavbarLink { href: string; label: string }

export interface NavbarProps {
  /** The product's name or mark at the start, usually a link home. */
  brand: ReactNode;
  /** The main destinations, shown in the bar on wide screens. */
  links?: NavbarLink[];
  /** The href of the current page among `links`. */
  current?: string;
  /** Actions at the end, such as search, an avatar or a Sign in button. */
  actions?: ReactNode;
  /** Sticks to the top while the page scrolls. Defaults to true. */
  sticky?: boolean;
  /** The landmark's name. Defaults to Main. */
  label?: string;
  /** Extra class on the root. */
  className?: string;
}

/** The bar across the top of a page: the brand at the start, the main destinations, and actions at the end,
 *  on a strip of glass that keeps the page readable under it when it sticks. */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar({ brand, links = [], current, actions, sticky = true, label: labelIn, className }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.main;
  return (
    <header ref={ref} data-component="Navbar" className={cx(styles.bar, sticky && styles.sticky, className)}>
      <div className={styles.brand}>{brand}</div>
      {links.length > 0 && (
        <nav aria-label={label} className={styles.nav}>
          {links.map((l) => <a key={l.href} href={l.href} aria-current={l.href === current ? 'page' : undefined} className={styles.link}>{l.label}</a>)}
        </nav>
      )}
      {actions != null && <div className={styles.actions}>{actions}</div>}
    </header>
  );
});
