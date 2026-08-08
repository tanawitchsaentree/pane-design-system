import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import styles from './Radio.module.css';

export type RadioProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'>;

/**
 * Radio — native `<input type="radio">` visually hidden underneath a custom dot, same technique
 * as Checkbox (D-015: native input keeps correct Tab/Arrow-key group behavior for free — the
 * browser already roves focus between same-`name` radios, so no Radix/React Aria roving-tabindex
 * code is needed). Arrow-key roving focus between same-`name` radios is native browser behavior,
 * not something this component implements — jsdom (used by our Vitest suite) does not fully
 * implement native radio-group arrow-key roving focus, so Radio.test.tsx can only ever verify
 * Tab-based focus movement (an honest limit of jsdom, not something to work around there).
 * Arrow-key roving focus itself IS verified, but by a real Chromium/WebKit/Firefox instance, not
 * Vitest: see `packages/conformance/specs/w3-forms.spec.ts` ("Radio: arrow key ย้าย focus จริง"),
 * which drives `forms-radio--default` with real keyboard events across all 5 Playwright projects
 * (chromium/webkit/firefox/forced-colors/reduced-motion) and asserts focus actually lands on the
 * second radio after ArrowDown — that test fails if this ever regresses.
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
