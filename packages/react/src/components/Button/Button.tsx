import { forwardRef, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Spinner } from '../Spinner';
import styles from './Button.module.css';

export type ButtonVariant = 'light' | 'accent' | 'glass' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `light` = the loud solid (white in dark, ink in light), the one main action on a pane. `accent` = the same solid glowing with its own light, for a promoted action. `ghost` = the label alone, for a third action or a toolbar. `danger` = quiet glass with the label in the critical mark, for an action that destroys something; confirm it in a dialog. `glass` = quiet glass lit from above. */
  variant?: ButtonVariant;
  /** `md` = 44px tall (default, touch-friendly); `sm` = 32px for dense rows and toolbars; `lg` = 56px for the one action of a screen, such as Check out. */
  size?: ButtonSize;
  /** Shows a spinner in place of the content while an action runs. The button keeps its width and focus, says it is busy, and ignores presses until it is done. */
  loading?: boolean;
  /** A glyph before the label, such as a plus; it is not read, so the label must say the action. */
  icon?: ReactNode;
  /** A glyph after the label, such as an arrow for an action that moves on. */
  iconEnd?: ReactNode;
  /** Fills the width of its container, for the one action at the foot of a form or a sheet. */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { loading, onClick, icon, iconEnd, fullWidth, variant = 'light', size = 'md', type = 'button', className, onPointerMove, children, ...rest },
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
    <button ref={ref} type={type} data-component="Button" data-glow={variant === 'accent' ? 'strong' : undefined} className={cx(styles.root, styles[variant], styles[size], loading && styles.loading, fullWidth && styles.full, className)} onPointerMove={glint}
      aria-busy={loading || undefined} aria-disabled={loading || rest['aria-disabled'] || undefined} onClick={(e) => { if (loading) { e.preventDefault(); return; } onClick?.(e); }} {...rest}>
      <span className={styles.content}>{icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}{children}{iconEnd && <span className={styles.icon} aria-hidden="true">{iconEnd}</span>}</span>
      {loading && <span className={styles.spinner}><Spinner size="sm" aria-hidden="true" /></span>}
      <span data-hit className={styles.hit} aria-hidden="true" />
    </button>
  );
});
