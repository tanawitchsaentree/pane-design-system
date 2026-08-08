'use client';

import { forwardRef, useEffect, useRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'> {
  /** Visual-only "partially checked" state (BLUEPRINT §7 state list) — does not affect the
   * underlying boolean `checked` value; callers own the logic that decides when a group of
   * children checkboxes should render their parent as indeterminate. Default `false`. */
  indeterminate?: boolean;
}

/**
 * Checkbox — native `<input type="checkbox">` visually hidden underneath a custom box (D-015:
 * "verify Tab/Space works from using native input directly" — a bare native checkbox already
 * gets correct keyboard/focus behavior for free, so no React Aria/Radix roving-focus code is
 * needed here; this is the one input in the wave explicitly called out as NOT requiring a
 * behavior library). `"use client"` because `indeterminate` is a DOM-only property (not a real
 * HTML attribute) — it has to be imperatively synced onto the input node via a ref effect.
 * Anatomy: root `label` (click target extends to the whole control) -> visually-hidden native
 * `input[type=checkbox]` -> custom `span` box (border + fill + check/indeterminate glyph, drawn
 * with real SVG paths so the state has a shape cue, not just a color cue per BLUEPRINT §7).
 * A11y: the native input carries the actual `checked`/`indeterminate`/`disabled` state and is
 * what receives focus — screen readers announce it exactly as a normal checkbox; the custom box
 * is `aria-hidden` and purely decorative on top of it.
 */
export const Checkbox = forwardRef<ElementRef<'input'>, CheckboxProps>(function Checkbox(
  { indeterminate = false, disabled = false, className, ...rest },
  forwardedRef,
) {
  const internalRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const setRefs = (node: HTMLInputElement | null) => {
    internalRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) (forwardedRef as { current: HTMLInputElement | null }).current = node;
  };

  const classes = className ? `${styles.wrapper} ${className}` : styles.wrapper;

  return (
    <label className={classes} data-disabled={disabled ? '' : undefined}>
      <input
        ref={setRefs}
        type="checkbox"
        className={styles.input}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : undefined}
        {...rest}
      />
      <span className={styles.box} aria-hidden="true">
        <svg className={styles.checkIcon} viewBox="0 0 16 16" fill="none">
          <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className={styles.indeterminateIcon} viewBox="0 0 16 16" fill="none">
          <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
