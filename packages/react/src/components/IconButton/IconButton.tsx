import { forwardRef } from 'react';
import type { ElementRef, ReactNode } from 'react';
import { Button } from '../Button/Button';
import type { ButtonProps } from '../Button/Button';
import styles from './IconButton.module.css';

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  /**
   * Accessible name — REQUIRED (not optional) because an icon-only button has no visible text
   * label for assistive tech to read; there is no safe default to fall back to.
   */
  'aria-label': string;
  /** The icon content (an `Icon` or raw SVG). */
  children: ReactNode;
}

/**
 * IconButton — a `Button` variant with only an icon, no text label (extends Button's variant/
 * intent/size/loading/asChild API 1:1 per BLUEPRINT §7 API consistency). Square footprint: width
 * equals height equals the `size.control.*` value (D-004), so the icon sits in a true square hit
 * target instead of Button's rectangular padding.
 * Anatomy: single root (the underlying Button) containing only the icon slot.
 * A11y: `aria-label` is a required prop (not optional) — TypeScript enforces it at the call site.
 */
export const IconButton = forwardRef<ElementRef<'button'>, IconButtonProps>(function IconButton(
  { className, children, ...rest },
  ref,
) {
  const classes = className ? `${styles.iconButton} ${className}` : styles.iconButton;

  return (
    <Button ref={ref} className={classes} {...rest}>
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';
