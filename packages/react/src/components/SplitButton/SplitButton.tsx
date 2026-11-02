import { useLayoutEffect, useRef, useState } from 'react';
import { type ReactNode } from 'react';
import { Button, type ButtonSize, type ButtonVariant } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Menu, type MenuEntry } from '../Menu';
import styles from './SplitButton.module.css';

export interface SplitButtonProps {
  /** The main action's label, such as Save. */
  children: ReactNode;
  /** Runs the main action. */
  onClick: () => void;
  /** Names the menu and its button for screen readers, such as More ways to save. */
  menuLabel: string;
  /** The other ways to do it, such as Save as and Save a copy, in the Menu's shape. */
  items: MenuEntry[];
  /** The variant both halves share; `light` by default. */
  variant?: ButtonVariant;
  /** The size both halves share; `md` by default. */
  size?: ButtonSize;
  /** Turns both halves off. */
  disabled?: boolean;
  /** Shows the main half busy while its action runs; the menu half stays usable. */
  loading?: boolean;
}

/** One main action with its alternatives a press away: the action and a chevron joined into one piece,
 *  two focus stops, the chevron opening a Menu. Use it when one choice is usual and the others are rare. */
export function SplitButton({ children, onClick, menuLabel, items, variant = 'light', size = 'md', disabled, loading }: SplitButtonProps) {
  // the menu opens under the whole button, its start edge on the action's start, not hanging off the chevron
  const group = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  useLayoutEffect(() => { const g = group.current; const last = g?.lastElementChild as HTMLElement | null; if (!g || !last) return; const G = g.getBoundingClientRect(), L = last.getBoundingClientRect(); setOffset(getComputedStyle(g).direction === 'rtl' ? (L.right - G.right) : (G.left - L.left)); }, [children, size]);
  return (
    <ButtonGroup ref={group} label={menuLabel} className={styles.split} data-component="SplitButton">
      <Button variant={variant} size={size} disabled={disabled} loading={loading} onClick={onClick}>{children}</Button>
      <Menu label={menuLabel} align="start" alignOffset={offset} items={items}
        trigger={<Button variant={variant} size={size} disabled={disabled} chevron aria-label={menuLabel} className={styles.more} />} />
    </ButtonGroup>
  );
}
