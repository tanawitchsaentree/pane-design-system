# Input

## Usage
Input is a native `<input>`-based single-line text field. Per the system's behavior rule, a plain text input needs no React Aria/Radix wrapper — the browser already provides correct semantics and keyboard behavior. Use it for any short free-text or typed value (email, name, price) and pair it with `leftElement`/`rightElement` for small inline adornments like a currency symbol or unit.

## Do
- Use `invalid` to mark failing validation — it sets `aria-invalid="true"` and switches the border to the danger token.
- Use `leftElement`/`rightElement` for small in-box glyphs (icon, single symbol); use `InputGroup` instead when the adornment is a multi-character block that should read as its own segment.
- Let Input work uncontrolled (`defaultValue`) or controlled (`value` + `onChange`) — it never intercepts the value itself, so both patterns work unmodified.

## Don't
- Don't set `aria-disabled` expecting it to behave like `disabled` — Input intentionally does not set it, since the native `disabled` attribute already communicates that state to assistive tech (and removes the control from the tab order, unlike `readOnly`).
- Don't give `leftElement`/`rightElement` their own meaning without an accessible name — Input marks these adornments `aria-hidden` and does not label them.
- Don't reach for this for multi-line content — use `Textarea`.

## Accessibility
- **Keyboard:** Native `<input>` keyboard behavior (Tab to focus, standard text-editing keys) — no custom key handling.
- **Screen reader:** `invalid` sets `aria-invalid="true"` on the actual `<input>`; `disabled` uses the native attribute (removes from tab order) rather than `aria-disabled`; `readOnly` uses the native attribute too (stays focusable/selectable). Label association and `aria-describedby` to helper text are the caller's responsibility unless composed via `FormField`.
- **Focus:** Focus lands on the native `<input>` itself, not the wrapper `span`; adornments are `aria-hidden` and never receive focus.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | `size.control.*` t-shirt scale (md = 48px). |
| `invalid` | `boolean` | `false` | Marks the field as failing validation; sets `aria-invalid` and switches border color. |
| `leftElement` | `ReactNode` | — | Element rendered before the text (icon/short prefix). Decorative, `aria-hidden`. |
| `rightElement` | `ReactNode` | — | Element rendered after the text (unit label/clear button). Decorative, `aria-hidden`. |
| ...rest | `ComponentPropsWithoutRef<'input'>` (minus `size`) | — | All native input props (`value`, `defaultValue`, `onChange`, `disabled`, `readOnly`, `placeholder`, etc.) pass straight through. |

## Related
- `FormField` composes Input with `Label` and `HelperText`, wiring `id`/`aria-describedby`/`aria-invalid`/`required` automatically.
- `InputGroup` — use instead of `leftElement`/`rightElement` for a multi-character prefix/suffix segment (e.g. "$" + amount + "USD").
- `Textarea` — the multi-line counterpart, same size/invalid token pattern.
