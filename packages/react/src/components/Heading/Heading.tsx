import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { FontWeightToken } from '../../types';
import styles from './Heading.module.css';

/** Semantic heading level — picks the actual `h1`-`h6` tag rendered. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** Visual size step (D-005 heading scale) — deliberately independent of `level` so content
 * hierarchy (what tag a screen reader announces) can differ from visual hierarchy (how big it
 * looks), per BLUEPRINT §7 / D-001 (hierarchy from layout, not font, still applies at the size-pick
 * level: a `sm` h1 is a legitimate combination in this system). */
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const LEVEL_TAG = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
/** Default visual size per level when `size` is omitted — a reasonable content-hierarchy default,
 * not a locked decision; callers needing a different pairing pass `size` explicitly. */
const DEFAULT_SIZE_BY_LEVEL: Record<HeadingLevel, HeadingSize> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'md',
  6: 'sm',
};

export interface HeadingProps extends ComponentPropsWithoutRef<'h1'> {
  /** Semantic level 1-6 — determines the rendered tag (`h1`-`h6`). Default `2`. */
  level?: HeadingLevel;
  /** Visual size step (D-005), independent of `level`. Defaults to a sensible size for the level. */
  size?: HeadingSize;
  /** Font weight (D-005). Default `'semibold'`. */
  weight?: FontWeightToken;
  /**
   * Render as the single child element instead of the level's semantic tag (Radix-style
   * polymorphism) — rare for Heading (level already picks the tag) but kept for API consistency
   * with the rest of the library and for cases like rendering a heading-styled `div` in a card title
   * slot that must not add an extra heading to the document outline.
   */
  asChild?: boolean;
  children?: ReactNode;
}

/**
 * Heading — semantic h1-h6 with visual size decoupled from level (D-005/BLUEPRINT §7).
 * Anatomy: single root element (`h{level}` by default, or the `asChild` child).
 * A11y: always renders a real heading tag (unless `asChild` overrides it) so the document
 * outline stays correct even when the visual size is chosen independently.
 */
export const Heading = forwardRef<ElementRef<'h1'>, HeadingProps>(function Heading(
  { level = 2, size, weight = 'semibold', asChild = false, className, ...rest },
  ref,
) {
  const resolvedSize = size ?? DEFAULT_SIZE_BY_LEVEL[level];
  const Comp = asChild ? Slot : LEVEL_TAG[level - 1];
  const classes = className ? `${styles.heading} ${className}` : styles.heading;

  return (
    <Comp
      ref={ref}
      className={classes}
      data-size={resolvedSize}
      data-weight={weight}
      {...rest}
    />
  );
});

Heading.displayName = 'Heading';
