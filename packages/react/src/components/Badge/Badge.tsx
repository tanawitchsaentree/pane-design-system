import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import type { ColorRoleToken } from '../../types';
import styles from './Badge.module.css';

export type BadgeVariant = 'solid' | 'subtle' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  /** Fill treatment. Default `'subtle'` (the quietest option — matches accent-scarcity default). */
  variant?: BadgeVariant;
  /** Color role (D-006). Default `'neutral'`. `'brand'` is informational tint, not an interactive
   * accent — using it still isn't subject to the D-001 accent-scarcity interactive-element rule,
   * but stays a deliberate, occasional choice by convention (see qa-a11y notes). */
  color?: ColorRoleToken;
  /** Default `'md'`. */
  size?: BadgeSize;
  children?: ReactNode;
}

/**
 * Badge — small non-interactive label (D-006 color roles). Never focusable, no hover/active
 * state — it is content, not a control.
 * Anatomy: single root `span` element, `role="status"` is intentionally NOT applied by default
 * (most badges are static labels, not live-updating status; consumers that need a live region
 * should wrap the value themselves, per BLUEPRINT §7 "don't guess a11y role beyond what's certain").
 */
export const Badge = forwardRef<ElementRef<'span'>, BadgeProps>(function Badge(
  { variant = 'subtle', color = 'neutral', size = 'md', className, ...rest },
  ref,
) {
  const classes = className ? `${styles.badge} ${className}` : styles.badge;

  return (
    <span
      ref={ref}
      className={classes}
      data-variant={variant}
      data-color={color}
      data-size={size}
      {...rest}
    />
  );
});

Badge.displayName = 'Badge';
