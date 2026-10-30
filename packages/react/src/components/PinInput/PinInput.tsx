import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { cx } from '../../cx';
import { useField } from '../FormField';
import styles from './PinInput.module.css';
import { useMessages } from '../../i18n/context';

export interface PinInputProps {
  /** Number of cells, usually 4 or 6. */
  length?: number;
  /** Controlled value, as a string of up to `length` characters. */
  value?: string;
  /** Starting value when uncontrolled. */
  defaultValue?: string;
  /** Called with the whole code on every change. */
  onValueChange?: (value: string) => void;
  /** Called once every cell is filled. */
  onComplete?: (value: string) => void;
  /** `numeric` (default) shows the number keyboard on phones and accepts digits only. */
  type?: 'numeric' | 'alphanumeric';
  /** Names the group when it is not inside a FormField, such as "Verification code". */
  'aria-label'?: string;
  /** Marks the code as wrong. Inside a FormField, its `error` sets this for you. */
  invalid?: boolean;
  /** Turns the control off, so it cannot be focused or changed. Inside a FormField, its `disabled` sets this for you. */
  disabled?: boolean;
  /** Shows the code without letting it change; the cells can still be focused and read. */
  readOnly?: boolean;
  /** Name for form submission; the code is submitted as one value. */
  name?: string;
  /** Extra class on the outer element. */
  className?: string;
}

/** A short code in separate cells, each a small well. Typing moves on, Backspace moves back, paste fills every cell. */
export function PinInput({ length = 6, value, defaultValue = '', onValueChange, onComplete, type = 'numeric', invalid, disabled, readOnly, name, className, ...rest }: PinInputProps) {
  const t = useMessages();
  const field = useField();
  const [inner, setInner] = useState(defaultValue.slice(0, length));
  const code = (value ?? inner).slice(0, length);
  const cells = useRef<Array<HTMLInputElement | null>>([]);
  const ok = (ch: string) => (type === 'numeric' ? /^\d$/.test(ch) : /^[\p{L}\p{N}]$/u.test(ch));
  const set = (next: string) => {
    if (readOnly) return;
    if (value === undefined) setInner(next);
    onValueChange?.(next);
    if (next.length === length && !next.includes(' ')) onComplete?.(next);
  };
  const put = (i: number, ch: string) => {
    const chars = code.padEnd(length, ' ').split('');
    chars[i] = ch;
    set(chars.join('').trimEnd());
  };
  const onKey = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i]?.trim() && i > 0) { put(i - 1, ' '); cells.current[i - 1]?.focus(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' && i > 0) { cells.current[i - 1]?.focus(); e.preventDefault(); }
    else if (e.key === 'ArrowRight' && i < length - 1) { cells.current[i + 1]?.focus(); e.preventDefault(); }
  };
  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const got = [...e.clipboardData.getData('text')].filter(ok).slice(0, length).join('');
    if (!got) return;
    e.preventDefault();
    set(got);
    cells.current[Math.min(got.length, length - 1)]?.focus();
  };
  const bad = invalid ?? field?.invalid ?? false;
  return (
    // a code is a number read left to right in every language, so the cells keep that order in RTL layouts
    <div data-component="PinInput" dir="ltr" role="group" aria-label={rest['aria-label']} aria-labelledby={rest['aria-label'] || !field ? undefined : `${field.id}-label`} aria-describedby={field?.describedBy} className={cx(styles.root, className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { cells.current[i] = el; }}
          id={i === 0 ? field?.id : undefined}
          className={styles.cell}
          value={code[i]?.trim() ?? ''}
          inputMode={type === 'numeric' ? 'numeric' : 'text'}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={t.pinCharacter(i + 1, length)}
          aria-invalid={bad || undefined}
          disabled={disabled ?? field?.disabled} readOnly={readOnly} required={field?.required}
          onChange={(e) => {
            const ch = e.target.value.slice(-1);
            if (ch && !ok(ch)) return;
            put(i, ch || ' ');
            if (ch && i < length - 1) cells.current[i + 1]?.focus();
          }}
          onKeyDown={onKey(i)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
      {name && <input type="hidden" name={name} value={code.replace(/ /g, '')} />}
    </div>
  );
}
