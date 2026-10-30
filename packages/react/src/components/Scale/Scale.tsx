import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Scale.module.css';
import { useMessages } from '../../i18n/context';

export interface ScaleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** What is rated, such as Speed. It is shown at the start of the row and starts the spoken text. */
  label: string;
  /** Where it sits, from 1 to `steps`; a fraction such as 3.4 sits between two steps. */
  value: number;
  /** How many steps the scale has; 5 by default. */
  steps?: number;
  /** One word per step, lowest first, such as ['Slow', 'Steady', 'Medium', 'Fast', 'Very fast']. The word for the value is shown at the end of the row. */
  words?: string[];
  /** A second position to compare with, such as the average of the format; it is drawn as a hollow ring. */
  compare?: number;
  /** Names the comparison for screen readers, such as the format average. */
  compareLabel?: string;
  /** Whether a higher value is good news; it picks the mark colour of the band between the ring and the dot. */
  higherIsBetter?: boolean;
  /** Hides the label and the word when the row around it already says them; both are still read. */
  bare?: boolean;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** A position on a short ordered scale, as a channel cut into steps with a bead at the value: speed, risk,
 *  how long a game runs. Steps up to the value are lit; a hollow ring marks a value to compare with, and the
 *  band between them takes the positive or critical mark and an arrow, so better or worse reads by shape and
 *  words as well as colour (P6). It shows a value and takes no input; for choosing one, use Slider or Rating. */
export const Scale = forwardRef<HTMLDivElement, ScaleProps>(function Scale({ label, value, steps = 5, words, compare, compareLabel: compareLabelIn, higherIsBetter = true, bare, className, ...rest }, ref) {
  const t = useMessages();
  const compareLabel = compareLabelIn ?? t.compareDefault;
  const v = clamp(value, 1, steps);
  const at = (x: number) => ((clamp(x, 1, steps) - 1) / Math.max(1, steps - 1)) * 100;
  const word = words?.[Math.round(v) - 1];
  const hasCmp = typeof compare === 'number';
  const up = hasCmp && v > compare!; const down = hasCmp && v < compare!;
  const good = hasCmp && (up === higherIsBetter) && v !== compare;
  const said = `${label}: ${word ? `${word}, ` : ''}${t.of(Math.round(v * 10) / 10, steps)}` + (hasCmp ? `, ${up ? t.above : down ? t.below : t.levelWith} ${compareLabel}` : '');
  return (
    <div ref={ref} data-component="Scale" role="img" aria-label={said} className={cx(styles.root, bare && styles.bare, className)} {...rest}>
      {!bare && <span className={styles.label} aria-hidden="true">{label}</span>}
      <span className={styles.track} aria-hidden="true">
        {Array.from({ length: steps }, (_, i) => <span key={i} className={cx(styles.step, i + 1 <= Math.round(v) && styles.on)} />)}
        {hasCmp && (up || down) && <span className={cx(styles.band, good ? styles.good : styles.bad)} style={{ ['--pane-from' as string]: `${Math.min(at(compare!), at(v))}%`, ['--pane-to' as string]: `${Math.max(at(compare!), at(v))}%` }} />}
        {hasCmp && <span className={styles.ring} style={{ ['--pane-at' as string]: `${at(compare!)}%` }} />}
        <span className={styles.dot} data-part="value" style={{ ['--pane-at' as string]: `${at(v)}%` }} />
      </span>
      {!bare && (
        <span className={styles.word} aria-hidden="true">
          {hasCmp && (up || down) && <svg viewBox="0 0 16 16" className={cx(styles.arrow, down && styles.down)}><path d="M8 13V3M4 7l4-4 4 4" /></svg>}
          {word ?? `${Math.round(v * 10) / 10} / ${steps}`}
        </span>
      )}
    </div>
  );
});
