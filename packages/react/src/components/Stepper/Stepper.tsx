import { forwardRef } from 'react';
import { cx } from '../../cx';
import styles from './Stepper.module.css';
import { useMessages } from '../../i18n/context';

export interface StepperStep { label: string; description?: string }

export interface StepperProps {
  /** The steps, in order. */
  steps: StepperStep[];
  /** The index of the current step, from 0. Steps before it are complete. */
  current: number;
  /** `horizontal` (default) or `vertical` for long labels and phones. */
  orientation?: 'horizontal' | 'vertical';
  /** The list's name. Defaults to Progress. */
  label?: string;
  /** Extra class on the root. */
  className?: string;
}

/** Where the reader is in a task of a few steps: done steps carry a check, the current one is the loud
 *  solid with its number, upcoming ones an outline; a groove joins them, lit up to the current step. */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper({ steps, current, orientation = 'horizontal', label: labelIn, className }, ref) {
  const t = useMessages();
  const label = labelIn ?? t.progress;
  return (
    <ol ref={ref} aria-label={label} data-component="Stepper" className={cx(styles.root, styles[orientation], className)}>
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming';
        return (
          <li key={s.label} className={cx(styles.step, styles[state])} aria-current={state === 'current' ? 'step' : undefined}>
            <span className={styles.mark} aria-hidden="true" data-glow={state === 'current' ? 'mark' : undefined}>{state === 'done' ? <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg> : i + 1}</span>
            <span className={styles.text}>
              <span className={styles.label}>{s.label}<span className={styles.sr}>{state === 'done' ? t.stepDone : state === 'upcoming' ? t.stepNotStarted : ''}</span></span>
              {s.description && <span className={styles.description}>{s.description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
});
