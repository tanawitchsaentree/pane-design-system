import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<'span'> {
  children: ReactNode;
}

/**
 * VisuallyHidden — independent utility (D-012), no extra props beyond children. Renders content
 * that is invisible on screen but still exposed to assistive technology (standard "clip" pattern
 * — never `display: none`, which would remove it from the accessibility tree as well).
 * Anatomy: single root `span` element.
 */
export const VisuallyHidden = forwardRef<ElementRef<'span'>, VisuallyHiddenProps>(
  function VisuallyHidden({ className, children, ...rest }, ref) {
    const classes = className ? `${styles.visuallyHidden} ${className}` : styles.visuallyHidden;

    return (
      <span ref={ref} className={classes} {...rest}>
        {children}
      </span>
    );
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
