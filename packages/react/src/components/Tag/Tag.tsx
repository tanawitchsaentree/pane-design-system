import { forwardRef, type HTMLAttributes } from 'react';
import type * as React from 'react';
import { cx } from '../../cx';
import styles from './Tag.module.css';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** The label, written in normal case. CSS uppercases it, so screen readers still read words. */
  children?: React.ReactNode;
  /** D-038: a thin tint of a tone in the etch, for colour-coded categories. The word still names the category. */
  tone?: 'neutral' | 'info' | 'positive' | 'warning' | 'critical' | 'accent';
}

/** An uppercase label etched into the glass, for categorising content (a place, a format, New), not for status. */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag({ className, tone, ...rest }, ref) {
  return <span ref={ref} data-component="Tag" className={cx(styles.root, tone && styles.toned, tone && styles[tone], className)} {...rest} />;
});
