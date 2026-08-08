import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import type { ControlSizeToken } from '../../types';
import styles from './Textarea.module.css';

export type TextareaResize = 'none' | 'vertical' | 'both';

export interface TextareaProps extends Omit<ComponentPropsWithoutRef<'textarea'>, 'size'> {
  /** `size.control.*` t-shirt scale (D-004) — sets the field's minimum block-size, since a
   * textarea's height also grows with `rows`/content. Default `'md'`. */
  size?: ControlSizeToken;
  /** Marks the field as failing validation (same token/contrast as Input — input.json,
   * self-checked D-015). Default `false`. */
  invalid?: boolean;
  /** Visible text rows. Default `3`. */
  rows?: number;
  /** CSS `resize` behavior. Default `'vertical'` (matches native textarea default intent —
   * horizontal resize alone rarely makes sense for prose). */
  resize?: TextareaResize;
}

/**
 * Textarea — native `<textarea>`-based multi-line field (same rationale as Input, BLUEPRINT §7:
 * no React Aria/Radix wrapper needed for a plain native form element). Controlled/uncontrolled
 * duality is free: this component forwards `value`/`defaultValue`/`onChange` straight through.
 * Anatomy: single root `textarea` (no adornment slots — multi-line content doesn't compose with
 * inline prefix/suffix the way Input's single-line value does).
 * A11y: `readOnly` uses the native attribute (stays focusable/selectable); `invalid` sets
 * `aria-invalid="true"`.
 */
export const Textarea = forwardRef<ElementRef<'textarea'>, TextareaProps>(function Textarea(
  { size = 'md', invalid = false, disabled = false, readOnly = false, rows = 3, resize = 'vertical', className, ...rest },
  ref,
) {
  const classes = className ? `${styles.textarea} ${className}` : styles.textarea;

  return (
    <textarea
      ref={ref}
      className={classes}
      data-size={size}
      data-invalid={invalid ? '' : undefined}
      data-resize={resize}
      disabled={disabled}
      readOnly={readOnly}
      rows={rows}
      aria-invalid={invalid ? 'true' : undefined}
      {...rest}
    />
  );
});

Textarea.displayName = 'Textarea';
