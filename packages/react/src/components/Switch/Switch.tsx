import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import styles from './Switch.module.css';

export type SwitchProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size' | 'role'>;

/**
 * Switch — native `<input type="checkbox">` with `role="switch"` (the standard ARIA pattern for
 * a toggle backed by a checkbox — same visually-hidden-input + custom-visual technique as
 * Checkbox/Radio, D-015), so it keeps native Tab/Space keyboard behavior for free while
 * announcing as a switch (on/off) instead of a checkbox to assistive tech.
 * Anatomy: root `label` -> visually-hidden native `input[type=checkbox][role=switch]` -> custom
 * track (`span`) containing a thumb (`span`) whose `inset-inline-start` position physically moves
 * between off/on — a real non-color state cue per BLUEPRINT §7, not just a color swap.
 * A11y: the native input carries the real `checked`/`disabled` state and receives focus; `role`
 * is hard-set to `"switch"` (cannot be overridden via props) since that is this component's
 * entire reason to exist over a plain Checkbox.
 */
export const Switch = forwardRef<ElementRef<'input'>, SwitchProps>(function Switch(
  { disabled = false, className, ...rest },
  ref,
) {
  const classes = className ? `${styles.wrapper} ${className}` : styles.wrapper;

  return (
    <label className={classes} data-disabled={disabled ? '' : undefined}>
      <input ref={ref} type="checkbox" role="switch" className={styles.input} disabled={disabled} {...rest} />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </label>
  );
});

Switch.displayName = 'Switch';
