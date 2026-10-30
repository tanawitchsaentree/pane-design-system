import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Box.module.css';

export type BoxSpace = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Padding on every side, from the gap scale. Defaults to none. */
  padding?: BoxSpace;
  /** Padding on the inline sides only; overrides `padding` there. */
  paddingInline?: BoxSpace;
  /** Padding on the block sides only; overrides `padding` there. */
  paddingBlock?: BoxSpace;
  /** The corner, taken from the shape scale. Use `inner` for a surface inside a pane, `media` for an image and `round` for a pill. */
  radius?: 'none' | 'inner' | 'media' | 'round';
  /** The element to render. Defaults to div. */
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'span';
}

/** The smallest layout primitive: a box with padding and a corner from the scales and nothing else. It has
 *  no look of its own, so glass, colour and shadow stay with Card. */
export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box({ padding = 'none', paddingInline, paddingBlock, radius = 'none', as: Tag = 'div', className, ...rest }, ref) {
  return (
    <Tag
      ref={ref as never}
      data-component="Box"
      className={cx(styles.root, styles[`p-${padding}`], paddingInline && styles[`pi-${paddingInline}`], paddingBlock && styles[`pb-${paddingBlock}`], styles[`r-${radius}`], className)}
      {...rest}
    />
  );
});
