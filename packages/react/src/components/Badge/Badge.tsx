import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'info' | 'positive' | 'warning' | 'critical';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** `neutral` is a glass ring. `info`, `positive`, `warning` and `critical` are solid status fills, each at least 4.5:1 with its text. */
  tone?: BadgeTone;
  /** Show a leading dot, a shape cue on top of the colour. */
  dot?: boolean;
  /** The status in words, e.g. "Live", "3 new", "Failed". */
  children?: ReactNode;
}

/** A short status label: a count, a state, a version. Not interactive. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ tone = 'neutral', dot = false, className, children, ...rest }, ref) {
  return (
    <span ref={ref} data-component="Badge" className={cx(styles.root, styles[tone], className)} {...rest}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
});
