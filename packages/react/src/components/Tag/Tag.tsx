import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Tag.module.css';

export type TagProps = HTMLAttributes<HTMLSpanElement>;

/** Outlined small-caps label — for categorising content (asset 05, trending), not for status. */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag({ className, ...rest }, ref) {
  return <span ref={ref} className={cx(styles.root, className)} {...rest} />;
});
