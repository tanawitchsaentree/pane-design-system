'use client';

import { cloneElement, forwardRef, isValidElement, useId } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactElement, ReactNode } from 'react';
import { Label } from '../Label/Label';
import { HelperText } from '../HelperText/HelperText';
import styles from './FormField.module.css';

export interface FormFieldProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'id'> {
  /** Rendered inside `Label`. */
  label: string;
  /** Marks the field required — forwarded to `Label`'s indicator and sets `required` on the
   * control. Default `false`. */
  required?: boolean;
  /** Marks the field invalid — sets `aria-invalid` on the control and switches `HelperText` to
   * tone `'error'` automatically. Default `false`. */
  invalid?: boolean;
  /** Supporting copy rendered as `HelperText` underneath the control (tone follows `invalid`). */
  helperText?: ReactNode;
  /**
   * The single form control (`Input`, `Textarea`, `Checkbox`, a raw `<select>`, etc). FormField
   * clones it to inject `id`/`aria-describedby`/`aria-invalid`/`required` — this is the "most
   * a11y-critical piece of the wave" (D-015): callers never have to hand-wire ids themselves,
   * which is exactly the class of mistake that produces a label/control/helper-text that all
   * exist but aren't actually linked for assistive tech.
   */
  children: ReactElement;
  /** Optional id base — omit to let `useId()` generate a stable one (SSR-safe, BLUEPRINT §7). */
  id?: string;
}

/**
 * FormField — compound composition of `Label` + a form control + `HelperText` (D-015: "จุดที่
 * a11y เยอะสุดของ wave"). Marked `"use client"` because `useId()` needs to run per-render on the
 * client to stay stable across re-renders when no explicit `id` is supplied (BLUEPRINT §7: only
 * mark `"use client"` where real state/hooks are involved — `useId` qualifies).
 * Anatomy: root `div` -> `Label` -> the cloned control -> optional `HelperText`.
 * A11y (the part this component exists to get right automatically):
 * - control gets `id={fieldId}` so `Label htmlFor` resolves without the caller wiring it by hand
 *   — this alone is sufficient for native labelable elements (`<input>`, `<textarea>`, a real
 *   `<select>`, `<button>`) per the HTML labelable-elements list.
 * - control ALSO gets `aria-labelledby` pointing at `Label`'s own `id` (`${fieldId}-label`) —
 *   added for W5 Collection-family controls (`Listbox` and its siblings render `<ul role=
 *   listbox>`, which is NOT a labelable element, so `htmlFor`/`id` pairing alone gives it no
 *   accessible name at all). This does not double-announce anything for the native controls that
 *   already worked via `htmlFor`: `aria-labelledby` takes precedence in accessible-name
 *   computation and points at the exact same text `Label` renders, so the announced name is
 *   identical either way — verified in `packages/conformance/specs/w5-listbox.spec.ts`'s
 *   `FormField integration` test (asserts the accessible name is computed exactly once, not
 *   twice, when both wirings are present on a `Listbox` child).
 * - control gets `aria-describedby={helperId}` whenever `helperText` is provided, so assistive
 *   tech announces the helper/error copy right after the field's name/value — the single most
 *   commonly-missed a11y wire-up in hand-built forms.
 * - control gets `aria-invalid="true"` and `required` mirrored from the matching props, instead
 *   of requiring the caller to set them redundantly on both `FormField` and the inner control.
 */
export const FormField = forwardRef<ElementRef<'div'>, FormFieldProps>(function FormField(
  { label, required = false, invalid = false, helperText, children, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const classes = className ? `${styles.field} ${className}` : styles.field;

  const control = isValidElement(children)
    ? cloneElement(children, {
        id: fieldId,
        required,
        invalid,
        'aria-invalid': invalid ? 'true' : undefined,
        'aria-describedby': helperId,
        'aria-labelledby': labelId,
      } as Record<string, unknown>)
    : children;

  return (
    <div ref={ref} className={classes} {...rest}>
      <Label id={labelId} htmlFor={fieldId} required={required}>
        {label}
      </Label>
      {control}
      {helperText && (
        <HelperText id={helperId} tone={invalid ? 'error' : 'default'}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';
