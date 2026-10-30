import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import { useMessages } from '../../i18n/context';
import styles from './SequenceDiagram.module.css';

export interface SequenceActor { id: string; label: string }
export interface SequenceStep {
  /** Who acts; an actor id. */
  from: string;
  /** Who receives; an actor id. The same as `from` for a note or a self-call. */
  to: string;
  /** What passes between them, such as Transfers 40,000 THB. */
  label: string;
  /** `message` (default) is a solid arrow, `reply` a dashed one back, `note` a note on the lane of `from`. */
  kind?: 'message' | 'reply' | 'note';
  /** When it happened, already formatted; shown at the start of the row. */
  time?: string;
}

export interface SequenceDiagramProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Names the sequence, such as Money trail, case 2026-118. */
  label: string;
  /** The actors, in the order of their lanes. */
  actors: SequenceActor[];
  /** The steps, in the order they happened. */
  steps: SequenceStep[];
}

/** An ordered exchange between actors: a lane per actor with a hairline running down it, and one row per
 *  step with an arrow from lane to lane (solid for a message, dashed for a reply, a note on its lane). For
 *  a screen reader it is an ordered list that says who did what to whom, in order; the drawing is the
 *  same list laid out in lanes. It scrolls sideways inside its region when there are many actors. */
export const SequenceDiagram = forwardRef<HTMLElement, SequenceDiagramProps>(function SequenceDiagram({ label, actors, steps, className, ...rest }, ref) {
  const t = useMessages();
  const col = new Map(actors.map((a, i) => [a.id, i]));
  const name = (id: string) => actors.find((a) => a.id === id)?.label ?? id;
  return (
    <figure ref={ref} data-component="SequenceDiagram" className={cx(styles.root, className)} {...rest}>
      <figcaption className={styles.caption}>{label}</figcaption>
      <div className={styles.scroll} role="region" aria-label={label} tabIndex={0}>
        <div className={styles.grid} style={{ ['--pane-lanes' as string]: actors.length }}>
          <div className={styles.lanes} aria-hidden="true">
            {actors.map((a) => <div key={a.id} className={styles.lane}><span className={styles.actor} data-actor="">{a.label}</span></div>)}
          </div>
          <ol className={styles.steps}>
            {steps.map((s, i) => {
              const a = col.get(s.from) ?? 0, b = col.get(s.to) ?? a; const lo = Math.min(a, b), hi = Math.max(a, b);
              const kind = s.kind ?? 'message'; const self = a === b || kind === 'note';
              const said = kind === 'note' ? t.seqNote(name(s.from), s.label) : t.seqStep(name(s.from), name(s.to), s.label, kind === 'reply');
              return (
                <li key={i} className={cx(styles.step, styles[kind])} aria-label={`${s.time ? `${s.time}, ` : ''}${said}`}
                  style={{ ['--pane-from' as string]: lo, ['--pane-to' as string]: self ? lo : hi, ['--pane-dir' as string]: b >= a ? 1 : -1 }}>
                  {s.time && <span className={styles.time} aria-hidden="true">{s.time}</span>}
                  <span className={cx(styles.arrow, self && styles.self, b < a && styles.back)} aria-hidden="true"><span className={styles.text}>{s.label}</span></span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </figure>
  );
});
