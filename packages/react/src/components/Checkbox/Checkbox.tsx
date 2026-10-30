import { forwardRef, useId, type ReactNode } from 'react';
import * as RC from '@radix-ui/react-checkbox';
import { cx } from '../../cx';
import { useField } from '../FormField';
import styles from './Checkbox.module.css';

// Behaviour (role checkbox, Space toggles, indeterminate, form value) is Radix's, per the stack rule.
// This file adds the well, the check and the 44px hit area that includes the label (D-020).

export interface CheckboxProps {
  /** The choice in words. Clicking it toggles the box, and it is the box's accessible name. */
  label: ReactNode;
  /** Optional secondary line under the label. */
  description?: ReactNode;
  /** Controlled state. `'indeterminate'` shows a dash for a parent of mixed children. */
  checked?: boolean | 'indeterminate';
  /** Starting state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state. */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  /** Turns the control off, so it cannot be focused or changed. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
  /** Marks the answer as wrong with a critical ring and aria-invalid. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Marks the answer as required for form submission and for assistive tech. */
  required?: boolean;
  /** Name for form submission. */
  name?: string;
  /** Value submitted when checked. Defaults to "on". */
  value?: string;
  /** Extra class on the outer element. */
  className?: string;
}

/** A choice that is on or off, shown as a small well that holds a check when on. */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox({ label, description, className, invalid, ...rest }, ref) {
  const id = useId();
  const field = useField();
  const bad = invalid ?? field?.invalid ?? false;
  return (
    <div data-component="Checkbox" className={cx(styles.root, className)}>
      <RC.Root ref={ref} id={id} className={styles.box} aria-describedby={description != null ? `${id}-d` : undefined} aria-invalid={bad || undefined} {...rest}>
        <RC.Indicator className={styles.indicator}>
          <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.check}><path d="M3.5 8.5l3 3 6-7" /></svg>
          <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.dash}><path d="M4 8h8" /></svg>
        </RC.Indicator>
      </RC.Root>
      <span className={styles.text}>
        <label htmlFor={id} className={styles.label}>{label}</label>
        {description != null && <span id={`${id}-d`} className={styles.description}>{description}</span>}
      </span>
    </div>
  );
});
