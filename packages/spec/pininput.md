# PinInput

## Usage
PinInput is a row of single-character cells for OTP/verification codes. It's the most complex component in this wave — real client state plus effects (`"use client"`), and bespoke focus-routing logic written by hand rather than borrowed from a behavior library, since no existing Radix/React Aria primitive models "N linked single-character cells." Use it for verification-code entry flows (SMS OTP, email confirmation codes).

## Do
- Set `length` to match the expected code length, and use `aria-label` to give the whole group a meaningful accessible name (e.g. "6-digit verification code").
- Use `mask` for privacy-sensitive codes displayed over someone's shoulder, and `numericOnly` (default `true`) to restrict input/paste to digits.
- Support paste-to-fill naturally — pasting a full code into any cell distributes characters across the remaining cells starting at the focused one; no extra wiring is needed from the caller.

## Don't
- Don't expect `onChange` to fire only on completion — it fires on every value change (typing, paste, backspace); use `onComplete` specifically for the "all cells filled" callback.
- Don't build a controlled PinInput without handling the full joined string — `value`/`onChange` operate on the whole code as one string, not per-cell.
- Don't assume the first cell's `autoComplete` behavior is arbitrary — only cell index 0 gets `autoComplete="one-time-code"` (the others are `"off"`), matching how browsers/OS-level OTP autofill targets the first field of a code group.

## Accessibility
- **Keyboard:** Typing a character auto-advances focus to the next cell. Backspace on a cell with a value clears just that cell (no focus move); Backspace on an already-empty cell clears and moves focus to the previous cell. ArrowLeft/ArrowRight move focus between cells without altering any value. All of this is covered by dedicated tests in `PinInput.test.tsx`, including the auto-advance-on-type, backspace-clears-vs-backspace-moves distinction, and arrow-key focus movement (unlike Radio's arrow-key behavior, this logic is component-implemented, not native, so it is directly unit-testable in jsdom).
- **Screen reader:** The root has `role="group"` with the caller-supplied `aria-label` as its accessible name; each cell additionally exposes `aria-label="Digit N of length"` so a screen reader announces cell position, and `invalid` sets `aria-invalid="true"` on every cell. `inputMode="numeric"` plus a `pattern` hint the on-screen keyboard without blocking other assistive input methods.
- **Focus:** Each cell is a real, independently focusable native `<input maxLength=1>`; there is no hidden/decorative layer as in Checkbox/Radio/Switch — the visible cell IS the focus target, sized per the `size.control.*` scale via `data-size`.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `length` | `number` | — (required) | Number of digit cells. |
| `value` | `string` | — | Controlled value (string of up to `length` characters). Pair with `onChange`. |
| `defaultValue` | `string` | `''` | Initial value for uncontrolled usage. |
| `onChange` | `(value: string) => void` | — | Fires on every value change (typing, paste, backspace) with the full joined string. |
| `onComplete` | `(value: string) => void` | — | Fires once the value reaches `length` characters. |
| `numericOnly` | `boolean` | `true` | Restricts input to digits only. |
| `mask` | `boolean` | `false` | Masks each cell's value visually (like `type=password`). |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | `size.control.*` t-shirt scale applied to each cell. |
| `disabled` | `boolean` | `false` | Disables every cell. |
| `invalid` | `boolean` | `false` | Marks every cell `aria-invalid`. |
| `aria-label` | `string` | — | Accessible group name rendered on the wrapping `role="group"`. |
| `id` | `string` | — | Id applied to the root group element. |

## Related
- `Input` — shares the `size.control.*` scale and `invalid` convention, though PinInput's cell layout and focus-routing are entirely bespoke.
- `FormField` — can wrap a PinInput for a labeled/helper-text field, though `FormField`'s `cloneElement` wiring targets a single control's `id`/`aria-describedby`, so pairing needs the same care as with any multi-part control.
