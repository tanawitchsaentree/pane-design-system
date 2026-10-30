import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Stat.module.css';
import { useMessages } from '../../i18n/context';

export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** What the number counts, such as Prints sold; it sits above the number. */
  label: string;
  /** The number itself, already formatted, such as 1,284 or 42 kg. */
  value: ReactNode;
  /** The change against the last period, already formatted, such as 12% or 3 prints. */
  change?: string;
  /** Which way the change went; the arrow shows it and screen readers hear up or down. */
  direction?: 'up' | 'down' | 'flat';
  /** Whether the change is good news; it picks the positive or critical mark, so a fall in costs can read as good. */
  sentiment?: 'positive' | 'negative' | 'neutral';
  /** A short line under the number that says what the change is measured against, such as since last week. */
  caption?: string;
}

/** One number that matters, said large, with its label above and its change below. The change carries an
 *  arrow and a word as well as a status mark, so up and down read without colour (P1, P6). */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat({ label, value, change, direction = 'flat', sentiment = 'neutral', caption, className, ...rest }, ref) {
  const t = useMessages();
  const said = direction === 'up' ? t.up : direction === 'down' ? t.down : t.noChange;
  return (
    <div ref={ref} data-component="Stat" className={cx(styles.root, className)} {...rest}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {(change || caption) && (
        <span className={styles.foot}>
          {change && (
            <span className={cx(styles.change, styles[sentiment])}>
              <svg viewBox="0 0 16 16" aria-hidden="true" className={cx(styles.arrow, styles[direction])}>{direction === 'flat' ? <path d="M3 8h10" /> : <path d="M8 13V3M4 7l4-4 4 4" />}</svg>
              <VisuallyHidden>{said} </VisuallyHidden>{change}
            </span>
          )}
          {caption && <span className={styles.caption}>{caption}</span>}
        </span>
      )}
    </div>
  );
});
