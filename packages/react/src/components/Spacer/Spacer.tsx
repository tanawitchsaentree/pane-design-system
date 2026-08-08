import { forwardRef } from 'react';
import type { ElementRef } from 'react';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';
import type { SpaceToken } from '../../types';
import styles from './Spacer.module.css';

export interface SpacerProps extends Omit<BoxProps, 'children'> {
  /** Fixed size referencing a `space.*` token. Omit to grow and fill available space (`flex: 1`). */
  size?: SpaceToken;
}

/**
 * Spacer — utility primitive extending Box (D-012). Purely presentational spacing, never
 * carries content — marked `aria-hidden` so screen readers skip it like they would empty
 * whitespace.
 * Anatomy: single root element (the underlying Box), no children.
 */
export const Spacer = forwardRef<ElementRef<'div'>, SpacerProps>(function Spacer(
  { size, className, ...rest },
  ref,
) {
  const classes = className ? `${styles.spacer} ${className}` : styles.spacer;

  return <Box ref={ref} className={classes} data-size={size} aria-hidden="true" {...rest} />;
});

Spacer.displayName = 'Spacer';
