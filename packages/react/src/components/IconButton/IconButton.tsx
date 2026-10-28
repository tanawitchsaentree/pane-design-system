import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'glass' | 'ghost';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Required, because an icon has no text and this is the button's whole accessible name. */
  'aria-label': string;
  /** `glass` = round frosted disc. `ghost` = icon only, for dense rows (actions, overflow). */
  variant?: IconButtonVariant;
  /** `md` = 36px disc; `sm` = 32px for action rows. */
  size?: 'sm' | 'md';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'glass', size = 'md', type = 'button', className, ...rest },
  ref,
) {
  return <button ref={ref} type={type} data-component="IconButton" className={cx(styles.root, styles[variant], styles[size], className)} {...rest} />;
});
