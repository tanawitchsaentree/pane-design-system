import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Spinner.module.css';
import { useMessages } from '../../i18n/context';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** `sm` 16px, `md` 24px (default). */
  size?: 'sm' | 'md';
  /** What is loading, read by screen readers. Defaults to "Loading". */
  label?: string;
}

/** A short lit arc turning in a groove: something is happening and the reader should wait. Under reduced
 *  motion the arc stands still and the label still says loading. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner({ size = 'md', label: labelIn, className, ...rest }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.loading;
  return <span ref={ref} data-component="Spinner" role="status" aria-label={label} className={cx(styles.root, styles[size], className)} {...rest}><span className={styles.arc} aria-hidden="true" /></span>;
});
