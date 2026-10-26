import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  /** Visible label; also the switch's accessible name. */
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Native <button role="switch"> — Space and Enter toggle it through the browser's own button
 * activation, so there is no hand-rolled key handling to get wrong. The state is carried by the
 * thumb's position and aria-checked, never by colour alone.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, checked, defaultChecked = false, onCheckedChange, onClick, className, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      className={cx(styles.root, className)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (checked === undefined) setInner(!on);
        onCheckedChange?.(!on);
      }}
      {...rest}
    >
      <span className={styles.track} data-on={on || undefined} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
});
