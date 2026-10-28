import { forwardRef, useId, type ReactNode } from 'react';
import * as RS from '@radix-ui/react-switch';
import { cx } from '../../cx';
import styles from './Switch.module.css';

// Behaviour (role switch, Space and Enter toggle, form value) is Radix's, per the stack rule.

export interface SwitchProps {
  /** The setting in words, also the switch's accessible name. */
  label: ReactNode;
  /** Optional secondary line, such as what turning it on does. */
  description?: ReactNode;
  /** Controlled state. */
  checked?: boolean;
  /** Starting state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state. A switch applies at once, so save here. */
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Name for form submission. */
  name?: string;
  className?: string;
}

/** A setting that takes effect the moment it changes: a well track whose knob moves across and turns blue when on. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch({ label, description, className, ...rest }, ref) {
  const id = useId();
  return (
    <div data-component="Switch" className={cx(styles.root, className)}>
      <span className={styles.text}>
        <label htmlFor={id} className={styles.label}>{label}</label>
        {description != null && <span id={`${id}-d`} className={styles.description}>{description}</span>}
      </span>
      <RS.Root ref={ref} id={id} className={styles.track} aria-describedby={description != null ? `${id}-d` : undefined} {...rest}>
        <span className={styles.tick} aria-hidden="true" />
        <RS.Thumb className={styles.knob} />
      </RS.Root>
    </div>
  );
});
