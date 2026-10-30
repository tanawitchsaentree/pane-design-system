import { forwardRef, useId, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './AppShell.module.css';
import { useMessages } from '../../i18n/context';

export interface AppShellProps {
  /** The top bar, usually a Navbar; it stays at the top. */
  header?: ReactNode;
  /** The side navigation, usually a Sidebar; it shows beside the content on a wide screen. */
  sidebar?: ReactNode;
  /** The bottom bar for a narrow screen, usually a BottomNav; it replaces the sidebar there. */
  bottomNav?: ReactNode;
  /** A panel at the end of the content, such as details of the chosen item; it drops under the content when narrow. */
  aside?: ReactNode;
  /** The page itself; it is the main landmark. */
  children: ReactNode;
  /** Names the main landmark when the page has more than one heading level one, such as Library. */
  label?: string;
  /** Extra class on the shell. */
  className?: string;
}

/** The frame of an app: header on top, a sidebar beside the content on a wide screen and a bottom bar
 *  instead on a narrow one, and an optional aside. It measures its own width (container queries), so it
 *  works inside a docs stage as well as a whole window, and it adds a skip link to the main content. */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell({ header, sidebar, bottomNav, aside, children, label, className }, ref) {
  const id = useId();
  const t = useMessages();
  return (
    <div ref={ref} data-component="AppShell" className={cx(styles.root, className)}>
      <div className={cx(styles.grid, !!sidebar && styles.hasSide, !!aside && styles.hasAside, !!bottomNav && styles.hasBottom)}>
        <a href={`#${id}`} className={styles.skip}>{t.skipToContent}</a>
        {header && <div className={styles.header}>{header}</div>}
        {sidebar && <div className={styles.side}>{sidebar}</div>}
        <main id={id} tabIndex={-1} aria-label={label} className={styles.main}>{children}</main>
        {aside && <aside className={styles.aside}>{aside}</aside>}
        {bottomNav && <div className={styles.bottom}>{bottomNav}</div>}
      </div>
    </div>
  );
});
