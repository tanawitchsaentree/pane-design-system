import { forwardRef, useId, type ReactNode } from 'react';
import * as RS from '@radix-ui/react-switch';
import { cx } from '../../cx';
import { useField } from '../FormField';
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
  /** Marks the answer as wrong with a critical ring and aria-invalid. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Turns the control off, so it cannot be focused or changed. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
  /** Name for form submission. */
  name?: string;
  /** Extra class on the outer element. */
  className?: string;
}

/** A setting that takes effect the moment it changes. The track is a recess when off and lights from within when on, and the bead rolls across. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch({ label, description, className, invalid, ...rest }, ref) {
  const id = useId();
  return (
    <div data-component="Switch" className={cx(styles.root, className)}>
      <span className={styles.text}>
        <label htmlFor={id} className={styles.label}>{label}</label>
        {description != null && <span id={`${id}-d`} className={styles.description}>{description}</span>}
      </span>
      <RS.Root ref={ref} id={id} className={styles.track} data-glow="soft" aria-describedby={description != null ? `${id}-d` : undefined} aria-invalid={(invalid ?? useField()?.invalid) || undefined} {...rest}>
        <span className={styles.tick} aria-hidden="true" />
        <RS.Thumb className={styles.knob} />
      </RS.Root>
    </div>
  );
});
