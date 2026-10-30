import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
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
  /** Makes it a toggle that stays on, such as Bold or Mute. When on it takes the chosen glass and a ring, and aria-pressed says so. Leave it undefined for an ordinary button. */
  pressed?: boolean;
  /** Draws a chevron at the end that turns while a menu it opens is open, for a Menu trigger (a menu button). */
  chevron?: boolean;
  /** Renders it as a link that looks like this button, for an action that goes somewhere, such as Get started. */
  href?: string;
  /** With href, where the link opens. */
  target?: string;
  /** With href, the link's relation; noopener is added for target="_blank". */
  rel?: string;
}

const CHEVRON = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" /></svg>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { loading, onClick, icon, iconEnd, fullWidth, pressed, chevron, href, target, rel, variant = 'light', size = 'md', type = 'button', className, onPointerMove, children, ...rest },
  ref,
) {
  // the glint sits under the pointer (the visionOS hover effect); nothing moves without the reader
  const glint = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--pane-gx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--pane-gy', `${e.clientY - r.top}px`);
    onPointerMove?.(e);
  };
  const cls = cx(styles.root, styles[variant], styles[size], loading && styles.loading, fullWidth && styles.full, pressed != null && styles.toggle, className);
  const inner = (
    <>
      <span className={styles.content}>{icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}{children}{iconEnd && <span className={styles.icon} aria-hidden="true">{iconEnd}</span>}{chevron && <span className={cx(styles.icon, styles.chevron)} aria-hidden="true">{CHEVRON}</span>}</span>
      {loading && <span className={styles.spinner}><Spinner size="sm" aria-hidden="true" /></span>}
      <span data-hit className={styles.hit} aria-hidden="true" />
    </>
  );
  if (href != null) {
    // a link that looks like a button: disabled or loading drops the href, so it cannot be followed
    const off = rest.disabled || loading;
    return (
      <a ref={ref as never} href={off ? undefined : href} target={target} rel={target === '_blank' ? cx('noopener', rel) : rel} data-component="Button" data-glow={variant === 'accent' ? 'strong' : undefined} className={cls}
        aria-busy={loading || undefined} aria-disabled={off || undefined} onClick={(e) => { if (off) { e.preventDefault(); return; } onClick?.(e as unknown as MouseEvent<HTMLButtonElement>); }}
        onPointerMove={glint as never} id={rest.id} title={rest.title} aria-label={rest['aria-label']} aria-describedby={rest['aria-describedby']} aria-current={rest['aria-current']}>
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref} type={type} data-component="Button" data-glow={variant === 'accent' ? 'strong' : undefined} className={cls} onPointerMove={glint}
      aria-pressed={pressed} aria-busy={loading || undefined} aria-disabled={loading || rest['aria-disabled'] || undefined} onClick={(e) => { if (loading) { e.preventDefault(); return; } onClick?.(e); }} {...rest}>
      {inner}
    </button>
  );
});
