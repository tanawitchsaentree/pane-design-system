import { forwardRef } from 'react';
import type { ElementRef } from 'react';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';
import styles from './Container.module.css';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface ContainerProps extends BoxProps {
  /** Max-width breakpoint (D-007). `'full'` removes the max-width cap. Default `'lg'` (D-002 anchor). */
  size?: ContainerSize;
}

/**
 * Container — centers content and caps width per breakpoint, extending Box (D-012).
 * Anatomy: single root element (the underlying Box).
 */
export const Container = forwardRef<ElementRef<'div'>, ContainerProps>(function Container(
  { size = 'lg', className, ...rest },
  ref,
) {
  const classes = className ? `${styles.container} ${className}` : styles.container;

  return <Box ref={ref} className={classes} data-size={size} {...rest} />;
});

Container.displayName = 'Container';
