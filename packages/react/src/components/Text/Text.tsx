import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { FontSizeToken, FontWeightToken, TextColorToken } from '../../types';
import styles from './Text.module.css';

export interface TextProps extends ComponentPropsWithoutRef<'span'> {
  /** Type scale step (D-005). Default `'md'`. */
  size?: FontSizeToken;
  /** Font weight (D-005). Default `'regular'`. */
  weight?: FontWeightToken;
  /** Semantic text color role (D-006). Default `'default'`. */
  color?: TextColorToken;
  /** Truncate to a single line with an ellipsis when content overflows. Default `false`. */
  truncate?: boolean;
  /**
   * Render as the single child element instead of a `span` (Radix-style polymorphism) — use to
   * swap the semantic tag (e.g. `<p>`, `<label>`) while keeping Text's visual treatment.
   */
  asChild?: boolean;
  children?: ReactNode;
}

/**
 * Text — inline/span text element for body copy (D-005 type scale, D-006 color roles).
 * Anatomy: single root element (`span` by default, or the `asChild` child).
 * A11y: purely presentational — no implicit role change; `asChild` lets callers pick the correct
 * semantic tag (e.g. `p`, `label`) for their context.
 */
export const Text = forwardRef<ElementRef<'span'>, TextProps>(function Text(
  { size = 'md', weight = 'regular', color = 'default', truncate = false, asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'span';
  const classes = className ? `${styles.text} ${className}` : styles.text;

  return (
    <Comp
      ref={ref}
      className={classes}
      data-size={size}
      data-weight={weight}
      data-color={color}
      data-truncate={truncate ? '' : undefined}
      {...rest}
    />
  );
});

Text.displayName = 'Text';
