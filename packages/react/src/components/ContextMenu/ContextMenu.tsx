import { type ReactNode } from 'react';
import * as RC from '@radix-ui/react-context-menu';
import { cx } from '../../cx';
import styles from '../Menu/Menu.module.css';
import type { MenuEntry } from '../Menu';

export interface ContextMenuProps {
  /** The area that opens the menu on a right click or a long press. */
  children: ReactNode;
  /** The menu's name for screen readers. */
  label: string;
  /** The rows, in order, with 'separator' between groups; every row's action must also be reachable elsewhere. */
  items: MenuEntry[];
}

/** The same menu sheet as Menu, opened with a right click, a long press or the context-menu key on the
 *  thing it acts on. It is a shortcut: every action in it must also be reachable another way. */
export function ContextMenu({ children, label, items }: ContextMenuProps) {
  return (
    <RC.Root>
      {/* the menu key and Shift+F10 open it at the target, the keyboard's right click (WAI-ARIA menu pattern) */}
      <RC.Trigger asChild onKeyDown={(e) => {
        if (e.key !== 'ContextMenu' && !(e.shiftKey && e.key === 'F10')) return;
        e.preventDefault();
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }));
      }}>{children}</RC.Trigger>
      <RC.Portal>
        <RC.Content aria-label={label} collisionPadding={12} className={styles.sheet} data-component="ContextMenu">
          {items.map((it, i) => it === 'separator'
            ? <RC.Separator key={`s${i}`} className={styles.separator} />
            : (
              <RC.Item key={it.label} disabled={it.disabled} onSelect={it.onSelect} className={cx(styles.item, it.tone === 'critical' && styles.critical)}>
                {it.icon != null && <span className={styles.icon} aria-hidden="true">{it.icon}</span>}
                <span className={styles.label}>{it.label}</span>
                {it.shortcut && <kbd className={styles.shortcut}>{it.shortcut}</kbd>}
              </RC.Item>
            ))}
        </RC.Content>
      </RC.Portal>
    </RC.Root>
  );
}
