import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Meter.module.css';
import { useMessages } from '../../i18n/context';

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Names what is measured, such as Storage; it is shown above the bar and read as the meter's name. */
  label: string;
  /** The measured amount, between `min` and `max`. */
  value: number;
  /** The bottom of the range; 0 by default. */
  min?: number;
  /** The top of the range; 100 by default. */
  max?: number;
  /** From this amount up the reading is high, with a warning mark and the word Almost full join the value. */
  high?: number;
  /** From this amount up the reading is critical, with the critical mark and the word Full. */
  critical?: number;
  /** The amount in words, such as 41 of 50 GB, shown at the end of the label row and read aloud. */
  valueText?: string;
}

/** A reading inside a known range, such as storage used or battery left: Progress's channel holding a
 *  level instead of a task. When the reading is high its status mark appears beside the value, a glyph
 *  and a word, so the warning never rests on a hue alone (P1, P6). */
export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter({ label, value, min = 0, max = 100, high, critical, valueText, className, ...rest }, ref) {
  const t = useMessages();
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const level = critical !== undefined && value >= critical ? 'critical' : high !== undefined && value >= high ? 'warning' : 'normal';
  const text = valueText ?? `${Math.round(pct)}%`;
  const word = level === 'critical' ? t.full : level === 'warning' ? t.almostFull : undefined;
  return (
    <div ref={ref} data-component="Meter" data-level={level} className={cx(styles.root, className)} {...rest}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value} aria-hidden="true">
          {word && <span className={cx(styles.status, styles[level])}><svg viewBox="0 0 16 16" className={styles.glyph}>{level === 'critical' ? <path d="M8 1.5 14.5 8 8 14.5 1.5 8Z" /> : <path d="M8 2 15 14H1Z" />}</svg>{word}</span>}
          {text}
        </span>
      </div>
      <div role="meter" aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={word ? `${text}, ${word.toLowerCase()}` : text} className={styles.track}>
        <span className={styles.fill} style={{ inlineSize: `${pct}%` }} />
      </div>
    </div>
  );
});
