import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Divider.module.css';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** `horizontal` (default) runs across a column; `vertical` stands between items in a row. */
  orientation?: 'horizontal' | 'vertical';
  /** Insets the line from both ends by the content inset, so it aligns with text instead of the pane's edge. */
  inset?: boolean;
  /** Hides the line from assistive technology when it only decorates (the default is a separator). */
  decorative?: boolean;
}

/** A line etched into the glass between groups: shade on one side and light on the other, the same
 *  language as every recess in Pane (D-024), so it reads as part of the pane rather than a drawn rule. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider({ orientation = 'horizontal', inset, decorative, className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-component="Divider"
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative || orientation === 'horizontal' ? undefined : 'vertical'}
      className={cx(styles.root, styles[orientation], inset && styles.inset, className)}
      {...rest}
    />
  );
});
