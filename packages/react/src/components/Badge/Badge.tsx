import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'info' | 'positive' | 'warning' | 'critical' | 'accent';
export type BadgeAppearance = 'crystal' | 'muted' | 'solid' | 'plain';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** `neutral` is a word alone. `info`, `positive`, `warning` and `critical` add their own glyph shape (circle, check, triangle, octagon) in the tone colour, so colour is never the only cue. */
  tone?: BadgeTone;
  /** `crystal` (default) is a small piece of tinted glass lit from above; `muted` one thin tint; `solid` an opaque fill, which a crystal also becomes on solid material; `plain` the word and glyph alone, for a status inside a sentence. */
  appearance?: BadgeAppearance;
  /** Neutral only. A leading dot in the secondary text colour, for a status with no tone such as Draft. */
  dot?: boolean;
  /** The status in words, such as "Live", "3 new" or "Failed". */
  children?: ReactNode;
}

// The same glyph shapes Banner uses (D-018), at word size.
const GLYPHS: Record<Exclude<BadgeTone, 'neutral'>, ReactNode> = {
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8v.01" /></>,
  positive: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12.3l2.4 2.4 4.6-5" /></>,
  warning: <><path d="M12 4.2l8.6 15H3.4z" /><path d="M12 10v4M12 16.8v.01" /></>,
  critical: <><path d="M8.6 3.8h6.8l4.8 4.8v6.8l-4.8 4.8H8.6l-4.8-4.8V8.6z" /><path d="M12 8v5M12 16v.01" /></>,
  // a four-point spark: new, featured; a shape none of the status tones use
  accent: <path d="M12 3.5c.6 4.4 2.1 5.9 6.5 6.5-4.4.6-5.9 2.1-6.5 6.5-.6-4.4-2.1-5.9-6.5-6.5 4.4-.6 5.9-2.1 6.5-6.5z" />,
};

/** A short status as a small crystal: a glyph shape per tone and the status in words, on a tint of the tone. Not interactive. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ tone = 'neutral', appearance = 'crystal', dot = false, className, children, ...rest }, ref) {
  return (
    <span ref={ref} data-component="Badge" className={cx(styles.root, styles[tone], appearance !== 'plain' && styles[appearance], className)} data-appearance={appearance} {...rest}>
      {tone !== 'neutral' && <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true">{GLYPHS[tone]}</svg>}
      {tone === 'neutral' && dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
});
