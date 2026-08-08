import { forwardRef } from 'react';
import type { ElementRef } from 'react';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';
import styles from './Divider.module.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'hairline' | 'hairline-strong';

export interface DividerProps extends Omit<BoxProps, 'children'> {
  /** Default `'horizontal'`. */
  orientation?: DividerOrientation;
  /** Border weight, both bound to D-008 border tokens. Default `'hairline'`. */
  variant?: DividerVariant;
}

/**
 * Divider — a hairline rule extending Box (D-012), styled per D-008 (no decorative shadow —
 * hairline border tokens are the definition mechanism in this system).
 * Anatomy: single root element (the underlying Box), `role="separator"`.
 * A11y: exposes `role="separator"` and `aria-orientation` so assistive tech announces it as a
 * structural divider, not decorative content.
 */
export const Divider = forwardRef<ElementRef<'div'>, DividerProps>(function Divider(
  { orientation = 'horizontal', variant = 'hairline', className, ...rest },
  ref,
) {
  const classes = className ? `${styles.divider} ${className}` : styles.divider;

  return (
    <Box
      ref={ref}
      className={classes}
      role="separator"
      aria-orientation={orientation}
      data-orientation={orientation}
      data-variant={variant}
      {...rest}
    />
  );
});

Divider.displayName = 'Divider';
