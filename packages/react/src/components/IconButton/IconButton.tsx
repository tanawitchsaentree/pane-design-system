import { forwardRef, type ButtonHTMLAttributes, type PointerEvent } from 'react';
import { cx } from '../../cx';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'glass' | 'ghost';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Required, because an icon has no text and this is the button's whole accessible name. */
  'aria-label': string;
  /** `glass` = a small round pane with gloss and rim. `ghost` = the glyph alone, for dense rows (actions, overflow). */
  variant?: IconButtonVariant;
  /** `md` = 36px disc; `sm` = 32px for action rows. Both keep a 44px press area. */
  size?: 'sm' | 'md';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'glass', size = 'md', type = 'button', className, onPointerMove, children, ...rest },
  ref,
) {
  // the glint sits under the pointer; nothing moves without the reader
  const glint = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--pane-gx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--pane-gy', `${e.clientY - r.top}px`);
    onPointerMove?.(e);
  };
  return (
    <button ref={ref} type={type} data-component="IconButton" className={cx(styles.root, styles[variant], styles[size], className)} onPointerMove={glint} {...rest}>
      {children}
      <span data-hit className={styles.hit} aria-hidden="true" />
    </button>
  );
});
