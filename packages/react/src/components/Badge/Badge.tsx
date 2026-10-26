import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ tone = 'neutral', className, ...rest }, ref) {
  return <span ref={ref} className={cx(styles.root, styles[tone], className)} {...rest} />;
});
