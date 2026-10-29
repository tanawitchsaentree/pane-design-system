import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** `text` (default) is a line of text, `block` a rectangle such as a cover, `circle` an avatar. */
  shape?: 'text' | 'block' | 'circle';
  /** For `text`, how many lines; the last one is shorter. */
  lines?: number;
}

/** The shape of content that is on its way, pressed into the glass where it will appear, so the layout
 *  does not move when it arrives. It breathes slowly; under reduced motion it is still. */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton({ shape = 'text', lines = 1, className, ...rest }, ref) {
  if (shape === 'text') {
    return (
      <span ref={ref} data-component="Skeleton" aria-hidden="true" className={cx(styles.stack, className)} {...rest}>
        {Array.from({ length: Math.max(1, lines) }, (_, i) => <span key={i} className={cx(styles.root, styles.text, i === lines - 1 && lines > 1 && styles.last)} />)}
      </span>
    );
  }
  return <span ref={ref} data-component="Skeleton" aria-hidden="true" className={cx(styles.root, styles[shape], className)} {...rest} />;
});
