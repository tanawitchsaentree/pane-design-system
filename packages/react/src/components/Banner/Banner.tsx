import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Banner.module.css';

// A banner is a line written on the pane, not a box placed in it (Banner.why.json, derivation C).
// No fill, no stripe, no tinted disc: one sheet of glass stays one layer, the tone is a glyph shape,
// a glyph colour and a spoken word. Arriving and leaving open and close its own height, so the content
// below slides instead of jumping (P4).

export type BannerTone = 'info' | 'positive' | 'warning' | 'critical';

export interface BannerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The tone. Each has its own glyph shape (circle, check, triangle, octagon) and its spoken word, so colour is never the only cue. */
  tone?: BannerTone;
  /** One line saying what happened. */
  title: ReactNode;
  /** Optional detail saying what it means or what to do. Shown under the title. */
  children?: ReactNode;
  /** Optional action at the end of the line, normally a quiet Button. Use the loud solid only when acting on this message is the pane's main task. */
  action?: ReactNode;
  /** Shows a Dismiss button. Called after the line has closed, so remove the banner from state here. */
  onDismiss?: () => void;
  /**
   * Announce it when it appears. 'polite' gives role="status" and 'assertive' gives role="alert".
   * Leave it unset for banners already present on page load, since announcing those interrupts for nothing.
   */
  live?: 'polite' | 'assertive';
}

const GLYPHS: Record<BannerTone, ReactNode> = {
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8v.01" /></>,
  positive: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12.3l2.4 2.4 4.6-5" /></>,
  warning: <><path d="M12 4.2l8.6 15H3.4z" /><path d="M12 10v4M12 16.8v.01" /></>,
  critical: <><path d="M8.6 3.8h6.8l4.8 4.8v6.8l-4.8 4.8H8.6l-4.8-4.8V8.6z" /><path d="M12 8v5M12 16v.01" /></>,
};
const TONE_LABEL: Record<BannerTone, string> = { info: 'Info', positive: 'Success', warning: 'Warning', critical: 'Error' };

/** A message about the pane it sits on: a glyph, a title, optional detail and action, written as a line on the glass. */
export const Banner = forwardRef<HTMLElement, BannerProps>(function Banner(
  { tone = 'info', title, children, action, onDismiss, live, className, ...rest },
  ref,
) {
  const [leaving, setLeaving] = useState(false);
  const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : undefined;
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dismiss = () => (reduced ? onDismiss?.() : setLeaving(true));
  return (
    <section
      ref={ref}
      data-component="Banner"
      className={cx(styles.root, styles[tone], leaving && styles.leaving, className)}
      role={role}
      aria-label={role ? undefined : TONE_LABEL[tone]}
      onAnimationEnd={(e) => { if (leaving && e.target === e.currentTarget) onDismiss?.(); }}
      {...rest}
    >
      <div className={styles.line}>
        <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true">{GLYPHS[tone]}</svg>
        <div className={styles.text}>
          <p className={styles.title}><span className={styles.sr}>{TONE_LABEL[tone]}: </span>{title}</p>
          {children != null && <div className={styles.detail}>{children}</div>}
        </div>
        {(action != null || onDismiss) && (
          <div className={styles.end}>
            {action}
            {onDismiss && (
              <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={dismiss}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" /></svg>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
});
