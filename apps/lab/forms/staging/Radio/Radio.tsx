import { createContext, forwardRef, useContext, useId, type ReactNode } from 'react';
import * as RR from '@radix-ui/react-radio-group';
import { cx } from '../../cx';
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
  disabled?: boolean;
  required?: boolean;
  /** The Radio options. */
  children: ReactNode;
  className?: string;
}

const GroupContext = createContext(false);

/** One answer from a short list, every option visible at once. */
export function RadioGroup({ label, help, className, children, ...rest }: RadioGroupProps) {
  const id = useId();
  return (
    <div data-component="RadioGroup" className={cx(styles.group, className)}>
      <span id={`${id}-l`} className={styles.legend}>{label}</span>
      {help != null && <span id={`${id}-h`} className={styles.help}>{help}</span>}
      <GroupContext.Provider value={true}>
        <RR.Root aria-labelledby={`${id}-l`} aria-describedby={help != null ? `${id}-h` : undefined} className={styles.options} {...rest}>{children}</RR.Root>
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
  disabled?: boolean;
}

/** One option inside a RadioGroup: a round well that holds a dot when chosen. */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio({ value, label, description, disabled }, ref) {
  const id = useId();
  if (!useContext(GroupContext)) throw new Error('Radio must be inside a RadioGroup');
  return (
    <div data-component="Radio" className={styles.root}>
      <RR.Item ref={ref} id={id} value={value} disabled={disabled} className={styles.circle} aria-describedby={description != null ? `${id}-d` : undefined}>
        <RR.Indicator className={styles.dot} />
      </RR.Item>
      <span className={styles.text}>
        <label htmlFor={id} className={styles.label}>{label}</label>
        {description != null && <span id={`${id}-d`} className={styles.description}>{description}</span>}
      </span>
    </div>
  );
});
