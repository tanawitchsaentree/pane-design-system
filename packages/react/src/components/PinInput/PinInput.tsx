'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ClipboardEvent, ElementRef, KeyboardEvent } from 'react';
import type { ControlSizeToken } from '../../types';
import styles from './PinInput.module.css';

export interface PinInputProps {
  /** Number of digit cells. */
  length: number;
  /** Controlled value (a string of up to `length` characters). Pair with `onChange`. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Fires on every value change (typing, paste, backspace) with the full joined string. */
  onChange?: (value: string) => void;
  /** Fires once the value reaches `length` characters. */
  onComplete?: (value: string) => void;
  /** Restricts input to digits only. Default `true`. */
  numericOnly?: boolean;
  /** Masks each cell's value visually (e.g. for OTP-over-shoulder privacy), like `type=password`.
   * Default `false`. */
  mask?: boolean;
  /** `size.control.*` t-shirt scale (D-004) applied to each cell. Default `'md'`. */
  size?: ControlSizeToken;
  disabled?: boolean;
  invalid?: boolean;
  /** Accessible group name (rendered on the wrapping `role="group"`), e.g. "6-digit verification
   * code". */
  'aria-label'?: string;
  id?: string;
}

/**
 * PinInput -- a row of single-character cells for OTP/verification codes (D-015: the most
 * complex component in the wave -- real client state + effects, so `"use client"` is required).
 * Each cell is a native `<input maxLength=1>` (BLUEPRINT §7: still no reason to reach for a
 * behavior library -- this is bespoke focus-routing logic layered on plain inputs, which is
 * exactly what ds-conventions rule 3 asks us to write ourselves rather than borrow, since no
 * existing Radix/React Aria primitive models "N linked single-char cells").
 * Anatomy: root `div[role=group]` -> `length` native `input` cells, refs kept in an array for
 * imperative `.focus()` calls between cells.
 * A11y: the group has an accessible name (`aria-label`); each cell exposes
 * `aria-label="Digit N of length"` so a screen reader announces position, and `inputMode=numeric`
 * + `pattern` hint the on-screen keyboard without blocking assistive input methods.
 * Keyboard: typing a character auto-advances focus to the next cell; Backspace on an empty cell
 * moves focus to and clears the previous cell; ArrowLeft/ArrowRight move focus without altering
 * value. Paste: pasting a string longer than one character distributes each character across the
 * remaining cells starting at the focused one.
 */
export const PinInput = forwardRef<ElementRef<'div'>, PinInputProps>(function PinInput(
  {
    length,
    value: controlledValue,
    defaultValue = '',
    onChange,
    onComplete,
    numericOnly = true,
    mask = false,
    size = 'md',
    disabled = false,
    invalid = false,
    'aria-label': ariaLabel,
    id,
  },
  ref,
) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : uncontrolledValue;
  const cells = Array.from({ length }, (_, i) => value[i] ?? '');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const previousCompleteRef = useRef(false);

  useEffect(() => {
    const isComplete = value.length === length;
    if (isComplete && !previousCompleteRef.current) {
      onComplete?.(value);
    }
    previousCompleteRef.current = isComplete;
  }, [value, length, onComplete]);

  function commit(next: string) {
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
  }

  function focusCell(index: number) {
    inputRefs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  }

  function setCellAt(index: number, char: string) {
    const chars = value.split('');
    chars[index] = char;
    // Array.prototype.join renders a sparse hole (e.g. setting index 3 while value was only 1
    // char long) as an empty string, so this always commits a clean same-length-or-shorter digit
    // string with no literal "undefined" text.
    commit(chars.slice(0, length).join(''));
  }

  function handleCellChange(index: number, raw: string) {
    const filtered = numericOnly ? raw.replace(/[^0-9]/g, '') : raw;
    const char = filtered.slice(-1);
    if (!char) {
      // deletion via the change event (e.g. select-all + delete)
      setCellAt(index, '');
      return;
    }
    setCellAt(index, char);
    if (index < length - 1) focusCell(index + 1);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace') {
      if (cells[index]) {
        setCellAt(index, '');
        return;
      }
      event.preventDefault();
      if (index > 0) {
        setCellAt(index - 1, '');
        focusCell(index - 1);
      }
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusCell(index - 1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusCell(index + 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text');
    const filtered = numericOnly ? pasted.replace(/[^0-9]/g, '') : pasted;
    if (!filtered) return;

    const chars = value.split('');
    let cursor = index;
    for (const char of filtered) {
      if (cursor >= length) break;
      chars[cursor] = char;
      cursor += 1;
    }
    const next = chars.slice(0, length).join('');
    commit(next);
    focusCell(Math.min(cursor, length - 1));
  }

  return (
    <div
      ref={ref}
      id={id}
      role="group"
      aria-label={ariaLabel}
      className={styles.group}
      data-disabled={disabled ? '' : undefined}
    >
      {cells.map((char, index) => (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node;
          }}
          type={mask ? 'password' : 'text'}
          inputMode={numericOnly ? 'numeric' : 'text'}
          pattern={numericOnly ? '[0-9]*' : undefined}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          className={styles.cell}
          data-size={size}
          data-invalid={invalid ? '' : undefined}
          value={char}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={invalid ? 'true' : undefined}
          onChange={(event) => handleCellChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
        />
      ))}
    </div>
  );
});

PinInput.displayName = 'PinInput';
