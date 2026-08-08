import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
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

  return (
    <span
      ref={ref}
      className={classes}
      data-variant={variant}
      aria-hidden="true"
      style={{ inlineSize: width, blockSize: height, ...style }}
      {...rest}
    />
  );
});

Skeleton.displayName = 'Skeleton';
