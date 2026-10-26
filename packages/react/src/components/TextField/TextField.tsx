import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import styles from './TextField.module.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label — required; a placeholder is not a label. */
  label: ReactNode;
  helperText?: ReactNode;
  /** When set, the field is invalid: the message is shown as text (not only a red edge) and announced. */
  errorText?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, helperText, errorText, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const describedBy = [errorText != null && errorId, helperText != null && helperId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cx(styles.root, className)}>
      <label className={styles.label} htmlFor={inputId}>{label}</label>
      <input
        ref={ref}
        id={inputId}
        className={styles.input}
        aria-invalid={errorText != null || undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {errorText != null && <p id={errorId} className={styles.error}>{errorText}</p>}
      {helperText != null && <p id={helperId} className={styles.helper}>{helperText}</p>}
    </div>
  );
});
