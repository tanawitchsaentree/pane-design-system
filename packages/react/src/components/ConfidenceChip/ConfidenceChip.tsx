import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import { useMessages } from '../../i18n/context';
import styles from './ConfidenceChip.module.css';

export interface ConfidenceChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** How sure, from 1 (lowest) to `steps`. */
  level: number;
  /** How many steps the scale has; 5 by default. */
  steps?: number;
  /** One word per step, lowest first, such as ['Rumour', 'Reported', 'Likely', 'Confirmed', 'Proven']. The word for the level is shown and read. Without it, five steps say Very low to Very high from the catalog, and other counts say n of N. */
  words?: string[];
  /** What is being rated, read before the level, such as Evidence. */
  label?: string;
}

/** How sure a claim is, as an ordered level: a row of dots filled up to the level in one hue that deepens
 *  step by step (the sequential data ramp), with the level's word beside them. Confidence is a magnitude,
 *  so it never takes a categorical hue, and it reads by the count of dots and the word, not by colour (D-032). */
export const ConfidenceChip = forwardRef<HTMLSpanElement, ConfidenceChipProps>(function ConfidenceChip({ level, steps = 5, words, label, className, style, ...rest }, ref) {
  const t = useMessages();
  const v = Math.max(1, Math.min(steps, Math.round(level)));
  const word = words?.[v - 1] ?? (steps === 5 ? t.confidence[v - 1] : t.of(v, steps));
  return (
    <span ref={ref} data-component="ConfidenceChip" role="img" aria-label={`${label ? `${label}: ` : ''}${word}, ${t.of(v, steps)}`}
      className={cx(styles.root, className)} style={{ ...style, ['--pane-step' as string]: `var(--ds-data-seq-${Math.min(5, Math.ceil((v / steps) * 5))})` }} {...rest}>
      <span className={styles.dots} aria-hidden="true">{Array.from({ length: steps }, (_, i) => <span key={i} className={cx(styles.dot, i < v && styles.on)} />)}</span>
      <span className={styles.word} aria-hidden="true">{word}</span>
    </span>
  );
});
