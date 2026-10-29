import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './Timeline.module.css';

export interface TimelineItem {
  /** When it happened, already formatted, such as 09:40 or 3 March. Shown above the title. */
  time: string;
  /** What happened, in a few words. */
  title: string;
  /** More about it, a sentence or a small piece of content. */
  description?: ReactNode;
  /** `done` (default) is past, `current` is happening now and is marked as such, `upcoming` is still to come. */
  state?: 'done' | 'current' | 'upcoming';
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  /** The events in the order they are read, usually oldest first; an activity feed may put the newest first. */
  items: TimelineItem[];
  /** Names the list for screen readers, such as Order history. */
  label: string;
}

/** Events in order along a hairline rail, each a dot with its time, title and story. Past dots are the
 *  loud solid, the current one is ringed and in dark gives off a faint light (glow.mark), future dots are
 *  hollow, so where you are reads by shape before colour (P6). */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline({ items, label, className, ...rest }, ref) {
  return (
    <ol ref={ref} data-component="Timeline" aria-label={label} className={cx(styles.root, className)} {...rest}>
      {items.map((it, i) => {
        const state = it.state ?? 'done';
        return (
          <li key={i} className={cx(styles.item, styles[state])} aria-current={state === 'current' ? 'step' : undefined}>
            <span className={styles.dot} aria-hidden="true" data-glow={state === 'current' ? 'mark' : undefined} />
            <div className={styles.body}>
              <span className={styles.time}>{it.time}</span>
              <span className={styles.title}>{it.title}</span>
              {it.description && <div className={styles.description}>{it.description}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
});
