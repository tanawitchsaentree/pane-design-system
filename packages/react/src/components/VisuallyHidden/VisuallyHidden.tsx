import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  /** Shows the content again while it, or something in it, has keyboard focus (for skip links). */
  focusable?: boolean;
}

/** Text that a screen reader reads and a sighted reader does not see, such as a label for an icon-only
 *  row or the word that a colour alone would otherwise carry. */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(function VisuallyHidden({ focusable, className, ...rest }, ref) {
  return <span ref={ref} data-component="VisuallyHidden" className={cx(styles.root, focusable && styles.focusable, className)} {...rest} />;
});
