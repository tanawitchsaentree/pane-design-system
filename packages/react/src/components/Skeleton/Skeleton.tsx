import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, ElementRef } from 'react';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends ComponentPropsWithoutRef<'span'> {
  /** Shape. Default `'text'`. */
  variant?: SkeletonVariant;
  /** Inline-size — any valid CSS `width` value (e.g. `'100%'`, `'240px'`). Consumer-supplied
   * layout escape hatch, same treatment as the `style` prop elsewhere in this system — not a
   * token, since the placeholder must match the real content's arbitrary dimensions. */
  width?: string | number;
  /** Block-size — same escape-hatch treatment as `width`. */
  height?: string | number;
}

// CSS custom properties (unlike known style keys such as `width`) never get React's automatic
// `px` suffix for a bare number, so a numeric prop needs the unit added explicitly here.
const toCssLength = (value: string | number): string => (typeof value === 'number' ? `${value}px` : value);

/**
 * Skeleton — loading placeholder shape. Pure CSS shimmer animation (D-009 motion tokens), no
 * client state, safe to render on the server.
 * Anatomy: single root `span`.
 * A11y: `aria-hidden="true"` (a skeleton has no content of its own to announce — the loading
 * state itself should be announced by a nearby `Spinner`/status region if one exists) +
 * `prefers-reduced-motion` swaps the shimmer sweep for a static low-contrast fill (D-008: no
 * decorative shadow used to imply depth here either).
 */
export const Skeleton = forwardRef<ElementRef<'span'>, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, className, style, ...rest },
  ref,
) {
  const classes = className ? `${styles.skeleton} ${className}` : styles.skeleton;

  // Consumer-supplied arbitrary dimensions travel as CSS custom properties (same escape-hatch
  // pattern as Grid's `--ds-grid-cols*`) rather than direct `inlineSize`/`blockSize` style keys,
  // so the CSS Module owns the actual `inline-size`/`block-size` declarations.
  const sizeVars: CSSProperties = {};
  if (width !== undefined) (sizeVars as Record<string, string>)['--ds-skeleton-inline-size'] = toCssLength(width);
  if (height !== undefined) (sizeVars as Record<string, string>)['--ds-skeleton-block-size'] = toCssLength(height);

  return (
    <span
      ref={ref}
      className={classes}
      data-variant={variant}
      aria-hidden="true"
      style={{ ...sizeVars, ...style }}
      {...rest}
    />
  );
});

Skeleton.displayName = 'Skeleton';
