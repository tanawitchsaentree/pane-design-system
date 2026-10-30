import { createContext, forwardRef, useContext, useId, useRef, type ReactNode } from 'react';
import * as RR from '@radix-ui/react-radio-group';
import { cx } from '../../cx';
import { useField } from '../FormField';
import styles from './Radio.module.css';

// Behaviour (role radiogroup, one tab stop, arrow keys move and select) is Radix's, per the stack rule.

export interface RadioGroupProps {
  /** The question the group answers, shown above the options and used as the group's name. */
  label: ReactNode;
  /** Optional help under the label. */
  help?: ReactNode;
  /** Controlled value. */
  value?: string;
  /** Starting value when uncontrolled. */
  defaultValue?: string;
  /** Called with the chosen value. */
  onValueChange?: (value: string) => void;
  /** Name for form submission. */
  name?: string;
  /** Marks the answer as wrong with a critical ring and aria-invalid. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Turns the control off, so it cannot be focused or changed. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
  /** Marks the answer as required for form submission and for assistive tech. */
  required?: boolean;
  /** The Radio options. */
  children: ReactNode;
  /** Extra class on the outer element. */
  className?: string;
}

// Radix checks an option when focus reaches it while an arrow key is still held. A key that is pressed
// and released at once (a scripted press, some switch devices and screen readers) moved focus without
// choosing, so the group remembers the last arrow press and chooses whatever option it focuses next.
const ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const GroupContext = createContext<{ arrowAt: { current: number }; choose: (v: string) => void } | null>(null);

/** One answer from a short list, every option visible at once. */
export function RadioGroup({ label, help, className, children, invalid, ...rest }: RadioGroupProps) {
  const bad = invalid ?? useField()?.invalid ?? false;
  const id = useId();
  const arrowAt = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  // choosing goes through Radix's own click path, so controlled and uncontrolled groups both update
  const choose = (v: string) => root.current?.querySelector<HTMLButtonElement>(`[role="radio"][value="${CSS.escape(v)}"][aria-checked="false"]`)?.click();
  return (
    <div data-component="RadioGroup" className={cx(styles.group, className)}>
      <span id={`${id}-l`} className={styles.legend}>{label}</span>
      {help != null && <span id={`${id}-h`} className={styles.help}>{help}</span>}
      <GroupContext.Provider value={{ arrowAt, choose }}>
        <RR.Root ref={root} onKeyDown={(e) => { if (ARROWS.includes(e.key)) arrowAt.current = Date.now(); }} aria-labelledby={`${id}-l`} aria-describedby={help != null ? `${id}-h` : undefined} className={styles.options} aria-invalid={bad || undefined} {...rest}>{children}</RR.Root>
      </GroupContext.Provider>
    </div>
  );
}

export interface RadioProps {
  /** The value this option reports. */
  value: string;
  /** The option in words, also its accessible name. */
  label: ReactNode;
  /** Optional secondary line. */
  description?: ReactNode;
  /** Turns this one option off; the rest of the group stays usable. */
  disabled?: boolean;
}

/** One option inside a RadioGroup: a round well that holds a dot when chosen. */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio({ value, label, description, disabled }, ref) {
  const id = useId();
  const group = useContext(GroupContext);
  if (!group) throw new Error('Radio must be inside a RadioGroup');
  return (
    <div data-component="Radio" className={styles.root}>
      <RR.Item ref={ref} id={id} value={value} disabled={disabled} onFocus={() => { if (Date.now() - group.arrowAt.current < 500) group.choose(value); }} className={styles.circle} aria-describedby={description != null ? `${id}-d` : undefined}>
        <RR.Indicator className={styles.dot} />
      </RR.Item>
      <span className={styles.text}>
        <label htmlFor={id} className={styles.label}>{label}</label>
        {description != null && <span id={`${id}-d`} className={styles.description}>{description}</span>}
      </span>
    </div>
  );
});
