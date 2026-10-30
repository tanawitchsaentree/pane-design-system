import { forwardRef } from 'react';
import { cx } from '../../cx';
import { useWidth } from '../../chart/core';
import styles from './Sparkline.module.css';

export interface SparklineProps {
  /** Says what the line shows in words, such as Sales over the last 12 weeks, rising; it is the line's name. */
  label: string;
  /** The values, oldest first; about twelve read best. */
  values: number[];
  /** The line's height in pixels; 32 by default, the height of a Stat's change row. */
  blockSize?: number;
  /** Marks the last point with a dot in the accent, for the current period. */
  showLast?: boolean;
  /** Extra class on the wrapper. */
  className?: string;
}

/** A small line with no axes for a Stat or a table cell: the trend in the secondary tone and the last
 *  point in the data accent. It is an image with its trend said in words, so it is never read as numbers. */
export const Sparkline = forwardRef<HTMLSpanElement, SparklineProps>(function Sparkline({ label, values, blockSize: tall = 32, showLast = true, className }, _ref) {
  const [box, width] = useWidth<HTMLSpanElement>();
  const lo = Math.min(...values), hi = Math.max(...values); const pad = 4;
  const x = (i: number) => pad + (values.length > 1 ? (i / (values.length - 1)) * (width - pad * 2) : 0);
  const y = (v: number) => pad + (1 - (v - lo) / (hi - lo || 1)) * (tall - pad * 2);
  return (
    <span ref={box} data-component="Sparkline" role="img" aria-label={label} className={cx(styles.root, className)} style={{ blockSize: tall }}>
      {width > 0 && values.length > 0 && (
        <svg width={width} height={tall} aria-hidden="true" className={styles.svg}>
          <path className={styles.line} d={values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('')} />
          {showLast && <circle className={styles.last} cx={x(values.length - 1)} cy={y(values[values.length - 1])} r={3} />}
        </svg>
      )}
    </span>
  );
});
