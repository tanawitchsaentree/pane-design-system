import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import styles from './Box.module.css';

export interface BoxProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Render as the single child element instead of a `div` (Radix-style polymorphism).
   * The child must forward `ref` and accept the props Box spreads onto it.
   */
  asChild?: boolean;
  children?: ReactNode;
}

/**
 * Box — the base of every layout primitive in the system (D-012).
 * Deliberately has no variant/size prop: it is a plain, styleable box-model reset.
 * Anatomy: single root element (`div` by default, or the `asChild` child).
 */
export const Box = forwardRef<ElementRef<'div'>, BoxProps>(function Box(
  { asChild = false, className, children, ...domProps },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  const classes = className ? `${styles.box} ${className}` : styles.box;

  return (
    <Comp ref={ref} className={classes} {...domProps}>
      {children}
    </Comp>
  );
});

Box.displayName = 'Box';
