import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Spacer.module.css';

export interface SpacerProps extends HTMLAttributes<HTMLSpanElement> {
  /** A fixed space from the gap scale. Leave it out to take all the free space in a row or column. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/** Space with no content: either a fixed step from the gap scale, or the free space in a flex row that
 *  pushes what follows to the far end. Hidden from assistive technology. */
export const Spacer = forwardRef<HTMLSpanElement, SpacerProps>(function Spacer({ size, className, ...rest }, ref) {
  return <span ref={ref} data-component="Spacer" aria-hidden="true" className={cx(styles.root, size ? styles[`s-${size}`] : styles.grow, className)} {...rest} />;
});
