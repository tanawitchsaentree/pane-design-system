import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Text.module.css';

export type TextSize = 'reading' | 'body' | 'label' | 'caption' | 'micro';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** A step of the type scale: `reading` 16 (long text), `body` 15 (default), `label` 14, `caption` 13, `micro` 11. */
  size?: TextSize;
  /** `primary` (default) or `secondary`, the lowest opacity that still passes on glass. */
  tone?: 'primary' | 'secondary';
  /** `regular` (default), `medium` or `semibold`. */
  weight?: 'regular' | 'medium' | 'semibold';
  /** The element: p (default), span, div, small or strong. */
  as?: 'p' | 'span' | 'div' | 'small' | 'strong';
  /** Cuts the text to one line with an ellipsis. Keep the full text in a title or nearby. */
  truncate?: boolean;
}

/** Text at a step of the type scale, in one of the two text tones, so no screen sets a font size by hand. */
export const Text = forwardRef<HTMLElement, TextProps>(function Text({ size = 'body', tone = 'primary', weight = 'regular', as: Tag = 'p', truncate, className, ...rest }, ref) {
  return <Tag ref={ref as never} data-component="Text" className={cx(styles.root, styles[size], styles[tone], styles[weight], truncate && styles.truncate, className)} {...rest} />;
});
