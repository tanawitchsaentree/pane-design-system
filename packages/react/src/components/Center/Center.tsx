import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Center.module.css';

export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  /** Centres inline content (an icon beside text) without taking a full row. */
  inline?: boolean;
}

/** Puts its content in the middle of the space it is given, both ways: an empty state, an icon in a tile,
 *  a spinner over a card. */
export const Center = forwardRef<HTMLDivElement, CenterProps>(function Center({ inline, className, ...rest }, ref) {
  return <div ref={ref} data-component="Center" className={cx(styles.root, inline && styles.inline, className)} {...rest} />;
});
