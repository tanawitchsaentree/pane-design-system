import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './AspectRatio.module.css';

export type AspectRatioValue = 'square' | 'photo' | 'video' | 'portrait' | 'wide';

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** `square` 1:1, `photo` 4:3, `video` 16:9 (default), `portrait` 3:4, `wide` 21:9. */
  ratio?: AspectRatioValue;
}

/** Holds a box to a named shape at any width, so media and placeholders keep their proportions and the
 *  page does not jump when an image arrives. Its one child fills it. */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio({ ratio = 'video', className, ...rest }, ref) {
  return <div ref={ref} data-component="AspectRatio" data-ratio={ratio} className={cx(styles.root, styles[ratio], className)} {...rest} />;
});
