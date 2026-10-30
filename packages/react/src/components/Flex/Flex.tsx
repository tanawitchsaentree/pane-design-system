import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Flex.module.css';

export type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  /** `row` (default) or `column`. */
  direction?: 'row' | 'column';
  /** Space between children, from the gap scale. Defaults to md. */
  gap?: FlexGap;
  /** How items spread along the main axis, one of `start` (default), `center`, `end` or `between`. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** How items line up across the axis, one of `stretch`, `start`, `center` (default), `end` or `baseline`. */
  align?: 'stretch' | 'start' | 'center' | 'end' | 'baseline';
  /** Lets children wrap to a new line when they do not fit. */
  wrap?: boolean;
}

/** A flex row or column with the gap from the scale and the two alignments named. Stack covers a plain
 *  list of items; Flex is for a row whose ends matter, such as a title on one side and actions on the other. */
export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex({ direction = 'row', gap = 'md', justify = 'start', align = 'center', wrap, className, ...rest }, ref) {
  return <div ref={ref} data-component="Flex" className={cx(styles.root, styles[direction], styles[`g-${gap}`], styles[`j-${justify}`], styles[`a-${align}`], wrap && styles.wrap, className)} {...rest} />;
});
