import { forwardRef } from 'react';
import type { ElementRef } from 'react';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';
import type { SpaceToken } from '../../types';
import styles from './Flex.module.css';

export type FlexDirection = 'row' | 'column';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export interface FlexProps extends BoxProps {
  /** Flex-direction. Default `'row'`. */
  direction?: FlexDirection;
  /** Gap between flex children — must reference a `space.*` token step, never a raw value. */
  gap?: SpaceToken;
  /** align-items. */
  align?: FlexAlign;
  /** justify-content. */
  justify?: FlexJustify;
  /** flex-wrap. Default `'nowrap'`. */
  wrap?: FlexWrap;
}

/**
 * Flex — flexbox layout primitive extending Box (D-012).
 * Anatomy: single root element (the underlying Box).
 */
export const Flex = forwardRef<ElementRef<'div'>, FlexProps>(function Flex(
  { direction = 'row', gap, align, justify, wrap = 'nowrap', className, ...rest },
  ref,
) {
  const classes = className ? `${styles.flex} ${className}` : styles.flex;

  return (
    <Box
      ref={ref}
      className={classes}
      data-direction={direction}
      data-wrap={wrap}
      data-align={align}
      data-justify={justify}
      data-gap={gap}
      {...rest}
    />
  );
});

Flex.displayName = 'Flex';
