import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'glass';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` = opaque Dessau red, for the one main action. `glass` = pane on a mullion frame. */
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', type = 'button', className, ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={cx(styles.root, styles[variant], styles[size], className)} {...rest} />;
});
