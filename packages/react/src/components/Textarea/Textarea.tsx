import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../cx';
import { useField } from '../FormField';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Marks the value as wrong. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
}

/** A multi-line text field, the same well as Input with nested corners because it grows (D-020). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ invalid, rows = 3, className, id, disabled, required, ...rest }, ref) {
  const field = useField();
  const bad = invalid ?? field?.invalid ?? false;
  return (
    <textarea
      ref={ref}
      data-component="Textarea"
      rows={rows}
      className={cx(styles.root, className)}
      id={id ?? field?.id}
      aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
      aria-invalid={bad || undefined}
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      {...rest}
    />
  );
});
