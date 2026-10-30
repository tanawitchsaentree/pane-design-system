import { forwardRef, useRef, useState, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { cx } from '../../cx';
import { useField } from '../FormField';
import { IconButton } from '../IconButton';
import { InputGroup } from '../InputGroup';
import { useMessages } from '../../i18n/context';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** `md` is 44px tall for touch (default); `sm` is 32px for dense toolbars, below the 44px touch size. */
  size?: 'sm' | 'md';
  /** Marks the value as wrong. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Adds a clear button at the end once there is text. It empties the field through its own change event, so a controlled value clears too, and puts focus back. */
  clearable?: boolean;
  /** With maxLength, shows how many characters are used under the field, such as 12 of 40, and says it when the limit is near. */
  showCount?: boolean;
}

/** Empties a field the way typing would, so React's onChange fires for controlled and uncontrolled fields alike. */
export function clearField(el: HTMLInputElement | HTMLTextAreaElement | null) {
  if (!el) return;
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(el, '');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.focus();
}

/**
 * A single-line text field, a groove cut into the glass (D-020, D-022). On an opaque reading page it
 * keeps the same groove, measured against the page. Put it in a FormField for its label, help and error.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ size = 'md', invalid, clearable, showCount, className, id, disabled, required, onChange, ...rest }, ref) {
  const field = useField();
  const t = useMessages();
  const own = useRef<HTMLInputElement | null>(null);
  const [typed, setTyped] = useState(String(rest.defaultValue ?? '').length);
  const len = rest.value != null ? String(rest.value).length : typed;
  const bad = invalid ?? field?.invalid ?? false;
  const max = rest.maxLength;
  const input = (
    <input
      ref={(n) => { own.current = n; if (typeof ref === 'function') ref(n); else if (ref) ref.current = n; }}
      data-component="Input"
      // sm is the one control below the 44px press area, a declared exception (system/EXCEPTIONS.md E-002)
      data-touch-exempt={size === 'sm' ? '' : undefined}
      className={cx(styles.root, styles[size], className)}
      id={id ?? field?.id}
      aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
      aria-invalid={bad || undefined}
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      onChange={(e: ChangeEvent<HTMLInputElement>) => { setTyped(e.target.value.length); onChange?.(e); }}
      {...rest}
    />
  );
  if (!clearable && !(showCount && max != null)) return input;
  const off = disabled ?? field?.disabled;
  const empty = len === 0 || off || rest.readOnly;
  return (
    <span className={styles.wrap}>
      {clearable ? (
        <InputGroup end={
          // kept in place while empty (hidden, out of the tab order) so the field never grows when typing starts
          <IconButton variant="ghost" size="sm" aria-label={t.clear} onClick={() => clearField(own.current)} className={empty ? styles.idle : undefined} tabIndex={empty ? -1 : undefined} aria-hidden={empty || undefined}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}><path d="M7 7l10 10M17 7 7 17" /></svg>
          </IconButton>
        }>{input}</InputGroup>
      ) : input}
      {showCount && max != null && (
        <span className={cx(styles.count, len >= max && styles.full)}>
          <span aria-hidden="true">{t.of(len, max)}</span>
          {/* said only near the limit, so a screen reader is not told the count at every key */}
          <span className={styles.sr} aria-live="polite">{max - len <= 10 ? t.charCount(len, max) : ''}</span>
        </span>
      )}
    </span>
  );
});
