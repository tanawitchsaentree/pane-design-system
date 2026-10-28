import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../../cx';
import { useField } from '../FormField';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** `md` is 44px tall for touch (default); `sm` is 32px for dense toolbars, below the 44px touch size. */
  size?: 'sm' | 'md';
  /** Marks the value as wrong. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
}

/**
 * A single-line text field, a groove cut into the glass (D-020, D-022). On an opaque reading page it
 * keeps the same groove, measured against the page. Put it in a FormField for its label, help and error.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ size = 'md', invalid, className, id, disabled, required, ...rest }, ref) {
  const field = useField();
  const bad = invalid ?? field?.invalid ?? false;
  return (
    <input
      ref={ref}
      data-component="Input"
      // sm is the one control below the 44px press area, a declared exception (system/EXCEPTIONS.md E-002)
      data-touch-exempt={size === 'sm' ? '' : undefined}
      className={cx(styles.root, styles[size], className)}
      id={id ?? field?.id}
      aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
      aria-invalid={bad || undefined}
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      {...rest}
    />
  );
});
