import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import type { ControlSizeToken } from '../../types';
import styles from './Input.module.css';

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  /** `size.control.*` t-shirt scale (D-004, md=48). Default `'md'`. */
  size?: ControlSizeToken;
  /** Marks the field as failing validation — sets `aria-invalid` and switches the border to
   * `color.action.danger.default` (D-014-fixed AA step, self-checked in input.json). Default
   * `false`. */
  invalid?: boolean;
  /** Element rendered before the text (e.g. an icon or short prefix). Purely decorative slot —
   * give it its own accessible name if it needs one; Input does not label it. */
  leftElement?: ReactNode;
  /** Element rendered after the text (e.g. a unit label or a clear button). */
  rightElement?: ReactNode;
}

/**
 * Input — native `<input>`-based text field (BLUEPRINT §7: a plain text input needs no
 * React Aria/Radix wrapper — the browser already provides correct semantics/keyboard behavior).
 * Controlled (`value`+`onChange`) and uncontrolled (`defaultValue`) both work unmodified because
 * this component never intercepts or owns the value itself — it forwards straight to the native
 * `<input>` (BLUEPRINT §7 controlled/uncontrolled duality). No internal state/effect, so no
 * `"use client"` directive is needed.
 * Anatomy: root `span` (the bordered/background box) -> optional `leftElement` slot -> native
 * `input` -> optional `rightElement` slot.
 * A11y: `readOnly` uses the native attribute (stays focusable/selectable, unlike `disabled` which
 * removes it from the tab order) — states are exposed via `aria-invalid`/`aria-disabled` is
 * intentionally NOT set for `disabled` since the native `disabled` attribute already communicates
 * that to assistive tech; `invalid` sets `aria-invalid="true"`.
 */
export const Input = forwardRef<ElementRef<'input'>, InputProps>(function Input(
  { size = 'md', invalid = false, disabled = false, readOnly = false, leftElement, rightElement, className, ...rest },
  ref,
) {
  const classes = className ? `${styles.wrapper} ${className}` : styles.wrapper;

  return (
    <span
      className={classes}
      data-size={size}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
    >
      {leftElement && (
        <span className={styles.adornment} aria-hidden="true">
          {leftElement}
        </span>
      )}
      <input
        ref={ref}
        className={styles.input}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={invalid ? 'true' : undefined}
        {...rest}
      />
      {rightElement && (
        <span className={styles.adornment} aria-hidden="true">
          {rightElement}
        </span>
      )}
    </span>
  );
});

Input.displayName = 'Input';
