import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Chip.module.css';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** The chip's label, which is also its accessible name. */
  children: ReactNode;
  /** Controlled selection (filter chips). Selection is carried by aria-pressed and a check mark, never colour alone. */
  selected?: boolean;
  /** Initial selection when uncontrolled. */
  defaultSelected?: boolean;
  /** Called with the new selection. */
  onSelectedChange?: (selected: boolean) => void;
  /** Makes it an input chip with a remove button named "Remove {label}". */
  onRemove?: () => void;
  /** Plain-text label for the remove button's name, when children is not plain text. */
  removeLabel?: string;
}

/**
 * A filter chip (toggle, aria-pressed) or an input chip (removable). The toggle is a native button,
 * so Space and Enter work without custom key handling.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { children, selected, defaultSelected = false, onSelectedChange, onRemove, removeLabel, className, onClick, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultSelected);
  const on = selected ?? inner;
  const label = removeLabel ?? (typeof children === 'string' ? children : 'item');
  return (
    <span data-component="Chip" className={cx(styles.root, on && styles.on, onRemove && styles.removable, className)}>
      <button
        ref={ref}
        type="button"
        className={styles.toggle}
        aria-pressed={onRemove ? undefined : on}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented || onRemove) return;
          if (selected === undefined) setInner(!on);
          onSelectedChange?.(!on);
        }}
        {...rest}
      >
        {!onRemove && on && (
          <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
        {children}
      </button>
      {onRemove && (
        <button type="button" className={styles.remove} aria-label={`Remove ${label}`} onClick={onRemove}>
          <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      )}
    </span>
  );
});
