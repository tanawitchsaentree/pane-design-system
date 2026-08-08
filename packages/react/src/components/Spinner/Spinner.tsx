import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import type { IconSizeToken } from '../../types';
import styles from './Spinner.module.css';

export interface SpinnerProps extends ComponentPropsWithoutRef<'span'> {
  /** `size.icon.*` t-shirt scale (D-004). Default `'md'` (20). */
  size?: IconSizeToken;
  /** Accessible label announced to assistive tech. Default `'Loading'`. */
  label?: string;
}

/**
 * Spinner — indeterminate loading indicator (D-009 motion tokens). Purely a CSS animation, no
 * client state — safe to render on the server.
 * Anatomy: single root `span[role="status"]` containing an animated ring + visually-hidden label
 * text (so the accessible name is real text content, not just an attribute, per BLUEPRINT §7).
 * A11y: `role="status"` + `aria-live="polite"` (implicit via role=status) announces the label
 * once; respects `prefers-reduced-motion` by swapping the spin animation for a pulse.
 */
export const Spinner = forwardRef<ElementRef<'span'>, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', className, ...rest },
  ref,
) {
  const classes = className ? `${styles.spinner} ${className}` : styles.spinner;

  return (
    <span ref={ref} className={classes} data-size={size} role="status" {...rest}>
      <span className={styles.visuallyHiddenLabel}>{label}</span>
    </span>
  );
});

Spinner.displayName = 'Spinner';
