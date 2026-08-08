import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import styles from './Kbd.module.css';

export type KbdProps = ComponentPropsWithoutRef<'kbd'>;

/**
 * Kbd — visual representation of a keyboard key, rendered as a native `<kbd>` (D-005 mono font
 * stack, D-008 hairline border instead of decorative shadow). Single size, no variant — a key cap
 * is a fixed-identity UI element in this system, not something that needs a t-shirt scale.
 * Anatomy: single root `<kbd>` element.
 */
export const Kbd = forwardRef<ElementRef<'kbd'>, KbdProps>(function Kbd({ className, ...rest }, ref) {
  const classes = className ? `${styles.kbd} ${className}` : styles.kbd;

  return <kbd ref={ref} className={classes} {...rest} />;
});

Kbd.displayName = 'Kbd';
