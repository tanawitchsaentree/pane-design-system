import { type ReactNode } from 'react';
import * as RM from '@radix-ui/react-dropdown-menu';
import { cx } from '../../cx';
import styles from './Menu.module.css';

export type MenuEntry =
  | { label: string; onSelect: () => void; icon?: ReactNode; shortcut?: string; tone?: 'default' | 'critical'; disabled?: boolean }
  | 'separator';

export interface MenuProps {
  /** The control that opens it, usually a Button or a "More" IconButton. */
  trigger: ReactNode;
  /** The menu's name for screen readers. */
  label: string;
  /** Actions in order; 'separator' draws a groove between groups. A critical action goes last. */
  items: MenuEntry[];
  /** Which edge of the trigger the sheet lines up with; start keeps it under the trigger's leading edge. */
  align?: 'start' | 'center' | 'end';
}

/** A list of actions that opens from a button: the menu sheet with rows that nest its corner (R-008).
 *  Arrow keys move, Enter chooses, typing a letter jumps, Esc closes and returns focus. */
export function Menu({ trigger, label, items, align = 'start' }: MenuProps) {
  return (
    <RM.Root>
      <RM.Trigger asChild>{trigger}</RM.Trigger>
      <RM.Portal>
        <RM.Content aria-label={label} align={align} sideOffset={6} collisionPadding={12} className={styles.sheet} data-component="Menu">
          {items.map((it, i) => it === 'separator'
            ? <RM.Separator key={`s${i}`} className={styles.separator} />
            : (
              <RM.Item key={it.label} disabled={it.disabled} onSelect={it.onSelect} className={cx(styles.item, it.tone === 'critical' && styles.critical)}>
                {it.icon != null && <span className={styles.icon} aria-hidden="true">{it.icon}</span>}
                <span className={styles.label}>{it.label}</span>
                {it.shortcut && <kbd className={styles.shortcut}>{it.shortcut}</kbd>}
              </RM.Item>
            ))}
        </RM.Content>
      </RM.Portal>
    </RM.Root>
  );
}
