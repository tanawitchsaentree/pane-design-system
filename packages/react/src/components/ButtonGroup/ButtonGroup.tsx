import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './ButtonGroup.module.css';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Names the group for screen readers, such as Text style or Pages. */
  label: string;
  /** Joins the buttons into one piece, with squared inner corners and a hairline of the scene between them. Off, they sit apart at the small gap. */
  attached?: boolean;
  /** `horizontal` (default) puts them in a row; `vertical` stacks them, for a side toolbar. */
  orientation?: 'horizontal' | 'vertical';
}

/** Buttons that belong together, such as a pager or Bold, Italic and Underline: a group with a name,
 *  apart at the small gap or joined into one piece. Each button keeps its own focus stop. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup({ label, attached = false, orientation = 'horizontal', className, children, ...rest }, ref) {
  return (
    <div ref={ref} role="group" aria-label={label} data-component="ButtonGroup" data-orientation={orientation}
      className={cx(styles.root, attached && styles.attached, orientation === 'vertical' && styles.vertical, className)} {...rest}>
      {children}
    </div>
  );
});
