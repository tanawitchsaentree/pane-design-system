import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Button.module.css';

export type ButtonVariant = 'light' | 'accent' | 'glass';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `light` = solid white pill, the one main action on a card. `accent` = blue. `glass` = quiet fill. */
  variant?: ButtonVariant;
  /** `md` = 44px tall (default, touch-friendly); `sm` = 32px for dense rows and toolbars. */
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'light', size = 'md', type = 'button', className, ...rest },
  ref,
) {
  return <button ref={ref} type={type} data-component="Button" className={cx(styles.root, styles[variant], styles[size], className)} {...rest} />;
});
