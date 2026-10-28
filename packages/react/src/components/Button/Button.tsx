import { forwardRef, type ButtonHTMLAttributes, type PointerEvent } from 'react';
import { cx } from '../../cx';
import styles from './Button.module.css';

export type ButtonVariant = 'light' | 'accent' | 'glass';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `light` = the loud solid (white in dark, ink in light), the one main action on a pane. `accent` = the blue sheet for a promoted action. `glass` = the quiet glass fill. */
  variant?: ButtonVariant;
  /** `md` = 44px tall (default, touch-friendly); `sm` = 32px for dense rows and toolbars. */
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'light', size = 'md', type = 'button', className, onPointerMove, children, ...rest },
  ref,
) {
  // the glint sits under the pointer (the visionOS hover effect); nothing moves without the reader
  const glint = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--pane-gx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--pane-gy', `${e.clientY - r.top}px`);
    onPointerMove?.(e);
  };
  return (
    <button ref={ref} type={type} data-component="Button" className={cx(styles.root, styles[variant], styles[size], className)} onPointerMove={glint} {...rest}>
      {children}
      <span data-hit className={styles.hit} aria-hidden="true" />
    </button>
  );
});
