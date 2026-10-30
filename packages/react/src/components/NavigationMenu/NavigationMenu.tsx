import { forwardRef, useEffect, useRef, useState } from 'react';
import { cx } from '../../cx';
import styles from './NavigationMenu.module.css';
import { useMessages } from '../../i18n/context';

export interface NavigationLink { href: string; label: string; description?: string }
export interface NavigationGroup { label: string; href?: string; links?: NavigationLink[] }

export interface NavigationMenuProps {
  /** Top-level entries, each a plain link (href) or a group that opens a panel of links. */
  items: NavigationGroup[];
  /** The landmark's name. Defaults to Main. */
  label?: string;
  /** Extra class on the root. */
  className?: string;
}

/** A website's main navigation with panels: top-level buttons that open a level-4 panel of links with a
 *  line of description each (the disclosure pattern, not a menu, so links stay links). Esc closes the
 *  panel and returns focus; a press outside closes it. */
export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu({ items, label: labelIn, className }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.main;
  const [open, setOpen] = useState<number | null>(null);
  const root = useRef<HTMLElement | null>(null);
  const triggers = useRef<Array<HTMLButtonElement | null>>([]);
  useEffect(() => {
    if (open == null) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('pointerdown', away); return () => document.removeEventListener('pointerdown', away);
  }, [open]);
  return (
    <nav ref={(n) => { root.current = n; if (typeof ref === 'function') ref(n); else if (ref) ref.current = n; }} aria-label={label} data-component="NavigationMenu" className={cx(styles.root, className)}
      onKeyDown={(e) => { if (e.key === 'Escape' && open != null) { triggers.current[open]?.focus(); setOpen(null); } }}>
      <ul className={styles.bar}>
        {items.map((g, i) => (
          <li key={g.label} className={styles.entry}>
            {g.links ? (
              <>
                <button ref={(n) => { triggers.current[i] = n; }} type="button" aria-expanded={open === i} aria-controls={`nm-${i}`} className={styles.top} onClick={() => setOpen(open === i ? null : i)}>
                  {g.label}<svg className={styles.chevron} viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" /></svg>
                </button>
                <div id={`nm-${i}`} hidden={open !== i} className={styles.panel}>
                  <ul className={styles.links}>
                    {g.links.map((l) => <li key={l.href}><a href={l.href} className={styles.link}><span className={styles.linkLabel}>{l.label}</span>{l.description && <span className={styles.description}>{l.description}</span>}</a></li>)}
                  </ul>
                </div>
              </>
            ) : <a href={g.href} className={styles.top}>{g.label}</a>}
          </li>
        ))}
      </ul>
    </nav>
  );
});
