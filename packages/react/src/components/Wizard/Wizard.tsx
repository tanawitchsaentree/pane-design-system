import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../cx';
import { Stepper } from '../Stepper';
import { Button } from '../Button';
import styles from './Wizard.module.css';
import { useMessages } from '../../i18n/context';

export interface WizardStep {
  /** The step's name, shown in the Stepper and as the heading of its panel. */
  label: string;
  /** A short line under the name in the Stepper. */
  description?: string;
  /** The step's fields. */
  content: ReactNode;
  /** Runs before moving on; return `false` (or resolve it) to stay, after showing the errors yourself. */
  validate?: () => boolean | Promise<boolean>;
}

export interface WizardProps {
  /** Names the whole task, such as Order a print. */
  label: string;
  /** The steps, in order. */
  steps: WizardStep[];
  /** Called after the last step validates. */
  onFinish: () => void;
  /** The words on the last button; Finish by default. */
  finishLabel?: string;
  /** Called when the reader leaves without finishing; shows a Cancel button. */
  onCancel?: () => void;
  /** Extra class on the wrapper. */
  className?: string;
}

/** A task in steps: Stepper on top, one step's panel at a time under a heading that takes focus as it
 *  changes, and Back and Next at the end with the loud one always last. A step can check itself before
 *  the reader moves on; going back never loses what was typed. */
export const Wizard = forwardRef<HTMLDivElement, WizardProps>(function Wizard({ label, steps, onFinish, finishLabel: finishLabelIn, onCancel, className }, ref) {
  const t = useMessages();
  const finishLabel = finishLabelIn ?? t.finish;
  const [at, setAt] = useState(0);
  const [busy, setBusy] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } head.current?.focus(); }, [at]);
  const last = at === steps.length - 1;
  const next = async () => {
    const v = steps[at].validate; setBusy(true);
    const ok = v ? await v() : true; setBusy(false);
    if (!ok) return;
    if (last) onFinish(); else setAt(at + 1);
  };
  return (
    <section ref={ref} data-component="Wizard" aria-label={label} className={cx(styles.root, className)}>
      <Stepper steps={steps.map(({ label: l, description }) => ({ label: l, description }))} current={at} label={t.steps(label)} />
      {/* every panel stays in the page so what was typed in it survives going back */}
      {steps.map((s, i) => (
        <div key={s.label} className={styles.panel} hidden={i !== at}>
          <h2 ref={i === at ? head : undefined} tabIndex={-1} className={styles.title}>{s.label}<span className={styles.count}>{t.stepOf(i + 1, steps.length)}</span></h2>
          {s.content}
        </div>
      ))}
      <div className={styles.actions}>
        {onCancel && <Button variant="glass" onClick={onCancel} className={styles.cancel}>{t.cancel}</Button>}
        {at > 0 && <Button variant="glass" onClick={() => setAt(at - 1)}>{t.back}</Button>}
        <Button variant="light" onClick={next} disabled={busy}>{last ? finishLabel : t.next}</Button>
      </div>
    </section>
  );
});
