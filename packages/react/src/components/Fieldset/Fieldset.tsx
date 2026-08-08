import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from 'react';
import { Text } from '../Text/Text';
import styles from './Fieldset.module.css';

export interface FieldsetProps extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'disabled'> {
  /** Rendered inside the native `<legend>` (required — a fieldset without a legend has no
   * accessible group name). */
  legend: string;
  /** Disables every form control nested inside, via the native `<fieldset disabled>` cascade —
   * no per-child wiring needed (BLUEPRINT §7/D-015: "disable ทุก input ลูกพร้อมกันผ่าน native
   * fieldset disabled behavior"). Default `false`. */
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * Fieldset — native `<fieldset>` + `<legend>` wrapper for a related group of controls (e.g. a
 * Radio group). Reuse Check (D-015): legend copy renders through `Text` instead of re-declaring
 * font styling.
 * Anatomy: root `fieldset` -> `legend` (via `Text asChild`) -> grouped children.
 * A11y: the native `disabled` attribute on `<fieldset>` already disables every nested form
 * control and removes them from the tab order — no extra prop-drilling required; `<legend>` is
 * the group's accessible name, read by screen readers before each control's own label.
 */
export const Fieldset = forwardRef<ElementRef<'fieldset'>, FieldsetProps>(function Fieldset(
  { legend, disabled = false, className, children, ...rest },
  ref,
) {
  const classes = className ? `${styles.fieldset} ${className}` : styles.fieldset;

  return (
    <fieldset ref={ref} className={classes} disabled={disabled} {...rest}>
      <Text asChild size="sm" weight="semibold" color="default">
        <legend className={styles.legend}>{legend}</legend>
      </Text>
      <div className={styles.content}>{children}</div>
    </fieldset>
  );
});

Fieldset.displayName = 'Fieldset';
