import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Progress.module.css';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Names the task, such as Uploading 3 photos; it is shown above the bar and read as the bar's name. */
  label: string;
  /** How much is done, from 0 to `max`; leave it out when the amount is not known and the bar travels instead. */
  value?: number;
  /** The amount that means finished; 100 by default. */
  max?: number;
  /** Shows the amount at the end of the label row, as a percentage unless `valueText` says otherwise. */
  showValue?: boolean;
  /** The amount in words, such as 2 of 3 photos, read by screen readers and shown when `showValue` is on. */
  valueText?: string;
  /** `md` (default) is the channel a slider uses; `sm` is a thinner line for a card or a row. */
  size?: 'sm' | 'md';
  /** Keeps the label for screen readers only, for a bar inside a row that already names its task, such as a file in an upload list. */
  hideLabel?: boolean;
}

/** How far a task has come: the slider's carved channel with the loud solid filling it, lit from above.
 *  In dark the filled part gives off a soft light (glow.soft). With no value it travels slowly; under
 *  reduced motion it stays still and the label carries the news. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress({ label, value, max = 100, showValue, valueText, size = 'md', hideLabel, className, ...rest }, ref) {
  const known = typeof value === 'number';
  const pct = known ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const text = valueText ?? (known ? `${Math.round(pct)}%` : undefined);
  return (
    <div ref={ref} data-component="Progress" className={cx(styles.root, className)} {...rest}>
      <div className={cx(styles.head, hideLabel && styles.sr)}>
        <span className={styles.label}>{label}</span>
        {showValue && text && <span className={styles.value} aria-hidden="true">{text}</span>}
      </div>
      <div role="progressbar" aria-label={label} aria-valuemin={known ? 0 : undefined} aria-valuemax={known ? max : undefined} aria-valuenow={known ? value : undefined} aria-valuetext={known ? text : undefined}
        className={cx(styles.track, styles[size], !known && styles.unknown)}>
        <span className={styles.fill} data-glow={known ? "soft" : undefined} style={known ? { inlineSize: `${pct}%` } : undefined} />
      </div>
    </div>
  );
});
