import { forwardRef, useLayoutEffect, useRef, useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../cx';
import { useField } from '../FormField';
import { useMessages } from '../../i18n/context';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Marks the value as wrong. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Grows with the text, from `rows` lines up to maxRows, then scrolls; for a comment or a message box. */
  autoResize?: boolean;
  /** With autoResize, the most lines it grows to before it scrolls; 8 by default. */
  maxRows?: number;
  /** With maxLength, shows how many characters are used under the field, such as 120 of 500, and says it when the limit is near. */
  showCount?: boolean;
}

/** A multi-line text field, the same well as Input with nested corners because it grows (D-020). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ invalid, rows = 3, autoResize, maxRows = 8, showCount, className, id, disabled, required, onChange, ...rest }, ref) {
  const field = useField();
  const t = useMessages();
  const own = useRef<HTMLTextAreaElement | null>(null);
  const [typed, setTyped] = useState(String(rest.defaultValue ?? '').length);
  const len = rest.value != null ? String(rest.value).length : typed;
  const bad = invalid ?? field?.invalid ?? false;
  const max = rest.maxLength;
  // grow to fit the text between rows and maxRows, measured from the field's own line height and padding
  const fit = () => {
    const el = own.current; if (!el || !autoResize) return;
    const cs = getComputedStyle(el);
    const line = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.42;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    el.style.blockSize = 'auto';
    el.style.blockSize = `${Math.min(Math.max(el.scrollHeight, line * rows + pad), line * maxRows + pad)}px`;
  };
  useLayoutEffect(fit, [rest.value, autoResize, rows, maxRows]);
  const area = (
    <textarea
      ref={(n) => { own.current = n; if (typeof ref === 'function') ref(n); else if (ref) ref.current = n; }}
      data-component="Textarea"
      rows={rows}
      className={cx(styles.root, autoResize && styles.auto, className)}
      id={id ?? field?.id}
      aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
      aria-invalid={bad || undefined}
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { setTyped(e.target.value.length); fit(); onChange?.(e); }}
      {...rest}
    />
  );
  if (!(showCount && max != null)) return area;
  return (
    <span className={styles.wrap}>
      {area}
      <span className={cx(styles.count, len >= max && styles.full)}>
        <span aria-hidden="true">{t.of(len, max)}</span>
        <span className={styles.sr} aria-live="polite">{max - len <= 10 ? t.charCount(len, max) : ''}</span>
      </span>
    </span>
  );
});
