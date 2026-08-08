import { forwardRef } from 'react';
import type { ElementRef } from 'react';
import { Flex } from '../Flex/Flex';
import type { FlexProps } from '../Flex/Flex';
import styles from './Center.module.css';

// D-012: Center extends Flex with no additional props — align/justify are fixed to 'center'
// internally, so they are omitted from the public prop surface (cannot be overridden).
export type CenterProps = Omit<FlexProps, 'align' | 'justify'>;

/**
 * Center — centers its children both axes via Flex (D-012).
 * Anatomy: single root element (the underlying Flex/Box).
 */
export const Center = forwardRef<ElementRef<'div'>, CenterProps>(function Center(
  { className, ...rest },
  ref,
) {
  const classes = className ? `${styles.center} ${className}` : styles.center;

  return <Flex ref={ref} className={classes} align="center" justify="center" {...rest} />;
});

Center.displayName = 'Center';
