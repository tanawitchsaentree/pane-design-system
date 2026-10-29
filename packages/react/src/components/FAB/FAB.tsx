import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './FAB.module.css';

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon. */
  icon: ReactNode;
  /** The action's name. Shown beside the icon when `extended`; otherwise it is the accessible name. */
  label: string;
  /** Shows the label beside the icon, for the first visit or a wide screen. */
  extended?: boolean;
  /** `fixed` (default) floats over the viewport at the bottom end; `contained` floats in its nearest positioned parent. */
  position?: 'fixed' | 'contained';
}

/** The one primary action of a phone screen, floating above the content at the bottom end where the thumb
 *  is: the loud white bead, glowing in dark (glow.strong), a step bigger than an IconButton. */
export const FAB = forwardRef<HTMLButtonElement, FABProps>(function FAB({ icon, label, extended, position = 'fixed', className, type = 'button', ...rest }, ref) {
  return (
    <button ref={ref} type={type} data-component="FAB" data-glow="strong" aria-label={extended ? undefined : label} className={cx(styles.root, styles[position], extended && styles.extended, className)} {...rest}>
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      {extended && <span className={styles.label}>{label}</span>}
    </button>
  );
});
