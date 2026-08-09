'use client';

import { forwardRef, useState } from 'react';
import type { ElementRef, KeyboardEvent, MouseEvent } from 'react';
import styles from './Rating.module.css';

export interface RatingProps {
  /** Controlled value — a whole star count from `0` (none selected) to `max`. Pair with
   * `onChange`. Omit and use `defaultValue` for uncontrolled usage. */
  value?: number;
  /** Initial value for uncontrolled usage. Default `0` (no star selected). */
  defaultValue?: number;
  /** Fires with the newly selected star count whenever the user picks a star. Never fires while
   * `readOnly` or `disabled`. */
  onChange?: (value: number) => void;
  /** Number of stars rendered. D-023: this is a discrete 1-`max` integer rating built on native
   * `<input type="radio">` — it has no half-star/continuous mode (see Rating.tsx doc comment
   * below for why that is a deliberate, flagged limitation rather than an oversight). Default
   * `5`. */
  max?: number;
  /** Groups the underlying native radios (required — every Rating instance on a page needs its
   * own group name, exactly like a native radio group). */
  name: string;
  /** Removes every star from the tab order and blocks all interaction, via native `disabled` on
   * each radio. Default `false`. */
  disabled?: boolean;
  /** Displays the current value without allowing it to change — e.g. showing an average rating
   * left by other people. Unlike `disabled`, the control stays focusable (native `readonly` has
   * no effect on `<input type="radio">` per the HTML spec, so this is implemented by cancelling
   * the browser's default select-on-click/arrow-key action instead — see the component doc
   * comment for the honest limits of that approach). Default `false`. */
  readOnly?: boolean;
  /** Accessible name for the group (e.g. "Rate this product"). Required. Each individual star
   * additionally carries its own `"{n} star(s) of {max}"` accessible name (see doc comment), so
   * the "out of {max}" context reaches screen reader users regardless of what this string says. */
  'aria-label': string;
  className?: string;
}

const STAR_PATH =
  'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

const ARROW_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End']);

/**
 * Rating — a row of `max` native `<input type="radio">` elements sharing one `name`, visually
 * replaced by star icons (D-023: "เลือก 1 จาก N" is exactly what a native radio group already
 * models correctly — browsers give Tab-to-first-checked-or-first, Space-to-select, and
 * arrow-key roving/selection between same-`name` radios for free, so no Radix/React Aria
 * roving-tabindex code is written here, same technique as Radio/Checkbox/Switch). Standalone
 * control (D-024): public API is `value`/`defaultValue`/`onChange` where the value is a plain
 * `number` — never `selectedKeys`, which is reserved for the Collection family (Listbox/Select/
 * etc.) that has no analog here (a Rating has no set of items with identity, just one integer).
 *
 * FINDING, not a silent decision: this component only supports whole-star (integer 1-`max`)
 * ratings, per the explicit scope of this task. If a future requirement needs half-star or
 * continuous input, that is *outside* what a native radio group can express (a radio's value is
 * one of N discrete, mutually-exclusive options — there is no native way to represent "2.5") and
 * per D-023 must come back through a decision revisit (probably React Aria's slider primitive or
 * a custom continuous-input engine), not a silent swap of the underlying engine.
 *
 * Anatomy: root `div[role=radiogroup]` -> `max` `label`s, each wrapping a visually-hidden native
 * `input[type=radio]` (composes the shared VisuallyHidden clip pattern, same as Radio/Checkbox/
 * Switch — D-015/D-016) plus a decorative `span` holding two `<svg>` stars (an outline path and a
 * filled path). Exactly one of the two `<svg>`s is `display:block` at a time via the `data-state`
 * attribute — selected/unselected is a real shape swap (outline vs filled path), not a color
 * change alone, per BLUEPRINT §7 / braun-flat rule 4. This also means the cue survives
 * `forced-colors` mode: even when the OS collapses `rating.star.selected`/`unselected` to the
 * same system color, the two stars remain structurally different (different `<path>` fill/stroke
 * usage), unlike a would-be single-path implementation that only recolored one glyph.
 *
 * Hover preview (a star and every star before it highlight before commit): implemented with
 * plain `useState` + `onMouseEnter`/`onMouseLeave`, not a CSS `:hover ~` sibling selector. A
 * sibling-selector implementation is the common shortcut for this pattern, but it universally
 * relies on pairing DOM order with *visual* order (typically via `flex-direction: row-reverse` +
 * later-sibling-selects-earlier-siblings, so the rendered 1..max order still reads left-to-right)
 * — that pairing is exactly what breaks under `dir="rtl"`, where "visually left of the hovered
 * star" and "earlier in DOM order" stop being the same relationship, and the system's logical-
 * properties mandate exists precisely to avoid baking in a left/right assumption like that. The
 * JS version compares plain integer indices (`i <= (hoverValue ?? currentValue)`) and never
 * reasons about physical direction at all — the underlying `flex` row already mirrors correctly
 * under `dir="rtl"` via the browser's own bidi algorithm, so there is nothing left for this
 * component to get wrong per direction.
 *
 * A11y: the native inputs carry the real `checked`/`disabled` state and receive focus; the
 * decorative star `span` is `aria-hidden`. Each radio's own `aria-label` is `"{n} star(s) of
 * {max}"` — set by this component, not left to the caller — so the "value this radio would
 * select" and the rating's total scale are always announced, regardless of what the group-level
 * `aria-label` prop says.
 * `readOnly`: native `<input readonly>` has no effect on `type="radio"` (excluded by the HTML
 * spec's `readonly` IDL attribute list — checkbox/radio/file/range/etc. are explicitly not on it,
 * unlike `Input`'s native-`readOnly` text field). Implemented instead by calling
 * `preventDefault()` in `onClick` (cancels the browser's default select action before it ever
 * flips the radio's `checked` DOM property or fires `change`) and in `onKeyDown` for Space/arrow/
 * Home/End (cancels the browser's built-in "arrow key also re-selects" behavior within a native
 * radio group). UNVERIFIED by this file's unit tests alone: jsdom does not fully model native
 * radio-group arrow-key selection (see Radio.tsx's own note on this), so "readOnly blocks the
 * arrow-key change" is only actually proven by
 * `packages/conformance/specs/w5-rating.spec.ts` running in a real browser — that is where the
 * regression-catching assertion for this behavior lives, not here.
 */
export const Rating = forwardRef<ElementRef<'div'>, RatingProps>(function Rating(
  {
    value: controlledValue,
    defaultValue = 0,
    onChange,
    max = 5,
    name,
    disabled = false,
    readOnly = false,
    'aria-label': ariaLabel,
    className,
  },
  ref,
) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : uncontrolledValue;
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const previewValue = hoverValue ?? currentValue;
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  function commit(next: number) {
    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
  }

  function guardClick(event: MouseEvent<HTMLInputElement>) {
    if (readOnly) event.preventDefault();
  }

  function guardKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (readOnly && (event.key === ' ' || ARROW_KEYS.has(event.key))) {
      event.preventDefault();
    }
  }

  const classes = className ? `${styles.group} ${className}` : styles.group;

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-readonly={readOnly ? 'true' : undefined}
      className={classes}
      data-disabled={disabled ? '' : undefined}
      onMouseLeave={() => setHoverValue(null)}
    >
      {stars.map((starValue) => {
        const selected = starValue <= previewValue;
        return (
          <label
            key={starValue}
            className={styles.star}
            data-disabled={disabled ? '' : undefined}
            onMouseEnter={() => {
              if (!disabled && !readOnly) setHoverValue(starValue);
            }}
          >
            <input
              type="radio"
              name={name}
              value={starValue}
              checked={currentValue === starValue}
              disabled={disabled}
              className={styles.input}
              aria-label={`${starValue} star${starValue === 1 ? '' : 's'} of ${max}`}
              onChange={() => {
                if (!readOnly) commit(starValue);
              }}
              onClick={guardClick}
              onKeyDown={guardKeyDown}
            />
            <span className={styles.visual} aria-hidden="true" data-state={selected ? 'selected' : 'unselected'}>
              <svg className={styles.outline} viewBox="0 0 24 24" fill="none">
                <path d={STAR_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <svg className={styles.filled} viewBox="0 0 24 24" fill="currentColor">
                <path d={STAR_PATH} />
              </svg>
            </span>
          </label>
        );
      })}
    </div>
  );
});

Rating.displayName = 'Rating';
