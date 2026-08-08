import { forwardRef } from 'react';
import type { ElementRef } from 'react';
import { Flex } from '../Flex/Flex';
import type { FlexProps } from '../Flex/Flex';
import type { SpaceToken } from '../../types';
import styles from './Stack.module.css';

export type StackDirection = 'vertical' | 'horizontal';

export interface StackProps extends Omit<FlexProps, 'direction'> {
  /** `'vertical'` maps to Flex `column`, `'horizontal'` maps to Flex `row`. Default `'vertical'`. */
  direction?: StackDirection;
  /** Gap between stacked children. Default `'300'` (D-012). */
  gap?: SpaceToken;
}

const DIRECTION_MAP: Record<StackDirection, FlexProps['direction']> = {
  vertical: 'column',
  horizontal: 'row',
};

/**
 * Stack — thin wrapper over Flex (D-012) for the common "stack of blocks" case.
 * Anatomy: single root element (the underlying Flex/Box).
 */
export const Stack = forwardRef<ElementRef<'div'>, StackProps>(function Stack(
  { direction = 'vertical', gap = '300', className, ...rest },
  ref,
) {
  const classes = className ? `${styles.stack} ${className}` : styles.stack;

  return <Flex ref={ref} className={classes} direction={DIRECTION_MAP[direction]} gap={gap} {...rest} />;
});

Stack.displayName = 'Stack';
