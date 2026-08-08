import { forwardRef } from 'react';
import type { CSSProperties, ElementRef } from 'react';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';
import type { SpaceToken } from '../../types';
import styles from './Grid.module.css';

export interface GridResponsiveColumns {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface GridProps extends BoxProps {
  /** Number of grid columns. Default `12` (D-007 12-column grid). */
  columns?: number;
  /** Gap between grid cells — must reference a `space.*` token step. */
  gap?: SpaceToken;
  /**
   * Optional per-breakpoint column override (`sm`/`md`/`lg`/`xl`). Breakpoints follow D-007
   * (sm 640 / md 768 / lg 1024 anchor / xl 1280). Unset breakpoints inherit the previous one.
   */
  responsive?: GridResponsiveColumns;
}

/**
 * Grid — CSS Grid layout primitive extending Box (D-012).
 * Anatomy: single root element (the underlying Box).
 */
export const Grid = forwardRef<ElementRef<'div'>, GridProps>(function Grid(
  { columns = 12, gap, responsive, className, style, ...rest },
  ref,
) {
  const classes = className ? `${styles.grid} ${className}` : styles.grid;

  const gridVars: Record<string, string | number> = {
    '--ds-grid-cols': columns,
  };
  if (responsive?.sm !== undefined) gridVars['--ds-grid-cols-sm'] = responsive.sm;
  if (responsive?.md !== undefined) gridVars['--ds-grid-cols-md'] = responsive.md;
  if (responsive?.lg !== undefined) gridVars['--ds-grid-cols-lg'] = responsive.lg;
  if (responsive?.xl !== undefined) gridVars['--ds-grid-cols-xl'] = responsive.xl;

  return (
    <Box
      ref={ref}
      className={classes}
      data-gap={gap}
      style={{ ...gridVars, ...style } as CSSProperties}
      {...rest}
    />
  );
});

Grid.displayName = 'Grid';
