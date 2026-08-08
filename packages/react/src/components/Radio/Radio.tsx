import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import styles from './Radio.module.css';

export type RadioProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'>;

/**
 * Radio — native `<input type="radio">` visually hidden underneath a custom dot, same technique
 * as Checkbox (D-015: native input keeps correct Tab/Arrow-key group behavior for free — the
 * browser already roves focus between same-`name` radios, so no Radix/React Aria roving-tabindex
 * code is needed). Arrow-key roving focus between same-`name` radios is native browser behavior,
 * not something this component implements or can unit-test: jsdom (used by our Vitest suite)
 * does not fully implement native radio-group arrow-key roving focus, so Radio.test.tsx only
 * verifies Tab-based focus movement.
 * Manual QA note: verify ArrowUp/ArrowDown/ArrowLeft/ArrowRight navigation between grouped
 * radios in a real browser session before relying on it — it is not covered by the unit suite.
 * Controlled/uncontrolled duality: a group of Radios is controlled by giving
 * each the same `name` and using `checked`+`onChange` (controlled) or `defaultChecked`
 * (uncontrolled) per input, exactly like plain HTML radio groups — no group-level wrapper state
 * is required by this component itself (compose with `Fieldset` for the group's `<fieldset>`/
 * `<legend>` semantics).
 * Anatomy: root `label` -> visually-hidden native `input[type=radio]` -> custom `span` ring with
 * an inner dot that appears only when checked (shape cue, not color alone, per BLUEPRINT §7).
 * A11y: the native input carries the real `checked`/`disabled` state and receives focus; the
 * custom ring is `aria-hidden` and purely decorative.
 */
export const Radio = forwardRef<ElementRef<'input'>, RadioProps>(function Radio(
  { disabled = false, className, ...rest },
  ref,
) {
  const classes = className ? `${styles.wrapper} ${className}` : styles.wrapper;

  return (
    <label className={classes} data-disabled={disabled ? '' : undefined}>
      <input ref={ref} type="radio" className={styles.input} disabled={disabled} {...rest} />
      <span className={styles.ring} aria-hidden="true">
        <span className={styles.dot} />
      </span>
    </label>
  );
});

Radio.displayName = 'Radio';
