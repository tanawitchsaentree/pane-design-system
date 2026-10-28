import { forwardRef, type HTMLAttributes } from 'react';
import type * as React from 'react';
import { cx } from '../../cx';
import styles from './Tag.module.css';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** The label, written in normal case. CSS uppercases it, so screen readers still read words. */
  children?: React.ReactNode;
}

/** Outlined small-caps label — for categorising content (asset 05, trending), not for status. */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag({ className, ...rest }, ref) {
  return <span ref={ref} data-component="Tag" className={cx(styles.root, className)} {...rest} />;
});
