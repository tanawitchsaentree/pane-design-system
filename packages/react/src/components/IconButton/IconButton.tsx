import { forwardRef, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Spinner } from '../Spinner';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'glass' | 'ghost' | 'loud';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Required, because an icon has no text and this is the button's whole accessible name. */
  'aria-label': string;
  /** `glass` = a small round slab of smoked glass. `ghost` = the glyph alone, for dense rows and toolbars. `loud` = a white bead, the one main action in a toolbar or dock. */
  variant?: IconButtonVariant;
  /** `md` = 36px disc; `sm` = 32px for action rows. Both keep a 44px press area. */
  size?: 'sm' | 'md';
  /** Shows a spinner in place of the content while an action runs. The button keeps its width and focus, says it is busy, and ignores presses until it is done. */
  loading?: boolean;
  /** Makes it a toggle that stays on, such as Favourite or Mute. When on it takes the chosen glass and a ring, and aria-pressed says so. Keep the aria-label the same in both states. */
  pressed?: boolean;
  /** With pressed, the glyph shown while it is on, such as a filled star for an outline one. */
  pressedIcon?: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { loading, onClick, pressed, pressedIcon, variant = 'glass', size = 'md', type = 'button', className, onPointerMove, children, ...rest },
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
    <button ref={ref} type={type} data-component="IconButton" data-glow={variant === 'loud' ? 'strong' : undefined} className={cx(styles.root, styles[variant], styles[size], loading && styles.loading, pressed != null && styles.toggle, className)} onPointerMove={glint}
      aria-pressed={pressed} aria-busy={loading || undefined} aria-disabled={loading || rest['aria-disabled'] || undefined} onClick={(e) => { if (loading) { e.preventDefault(); return; } onClick?.(e); }} {...rest}>
      <span className={styles.content}>{pressed && pressedIcon != null ? pressedIcon : children}</span>
      {loading && <span className={styles.spinner}><Spinner size="sm" aria-hidden="true" /></span>}
      <span data-hit className={styles.hit} aria-hidden="true" />
    </button>
  );
});
