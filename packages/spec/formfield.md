# FormField

## Usage
FormField is the compound composition of `Label` + a single form control + `HelperText`, and is the highest-value accessibility component in this wave: it clones its child control to inject `id`, `aria-describedby`, `aria-invalid`, and `required` automatically, so a caller never has to hand-wire ids between a label, control, and helper text. Use it whenever building a real labeled field rather than composing `Label`/`Input`/`HelperText` manually.

## Do
- Pass exactly one form-control element as `children` (e.g. `Input`, `Textarea`) — FormField clones it via `cloneElement` to inject accessibility wiring.
- Use `helperText` for hint/error copy — its `tone` automatically follows `invalid` (switches to `'error'` tone) with no extra prop needed on the `HelperText` itself.
- Supply your own `id` only when you need a stable, predictable id (e.g. for external references); otherwise let `useId()` generate one — it's SSR-safe.

## Don't
- Don't pass more than one child, or a non-element child — FormField expects a single `ReactElement` to clone; anything else (multiple children, plain text) skips the automatic wiring.
- Don't set `id`, `aria-describedby`, `aria-invalid`, or `required` directly on the inner control — FormField overwrites/injects these itself based on its own props.
- Don't assume FormField is a plain function component you can call without a ref — it's a `forwardRef<ElementRef<'div'>>`, matching the ref-forwarding pattern used across the rest of the system (this was previously the one component out of pattern, fixed in a later QA pass).

## Accessibility
- **Keyboard:** No independent keyboard behavior — delegates entirely to its composed control.
- **Screen reader:** This is the component's core job. The cloned control receives `id={fieldId}` so `Label`'s `htmlFor` resolves without manual wiring; it receives `aria-describedby={helperId}` whenever `helperText` is supplied, so assistive tech announces the helper/error copy right after the field's name/value (the single most commonly-missed a11y wire-up in hand-built forms); it receives `aria-invalid="true"` and `required` mirrored from FormField's own props instead of needing to be set redundantly on both.
- **Focus:** Focus behavior belongs to the composed control; FormField's root `div` is not itself a focus target. The root exposes a ref via `forwardRef<ElementRef<'div'>>` for callers that need to measure/scroll to the field.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — (required) | Rendered inside `Label`. |
| `required` | `boolean` | `false` | Marks the field required — forwarded to `Label`'s indicator and set on the control. |
| `invalid` | `boolean` | `false` | Marks the field invalid — sets `aria-invalid` on the control and switches `HelperText` to tone `'error'`. |
| `helperText` | `ReactNode` | — | Supporting copy rendered as `HelperText` underneath the control; tone follows `invalid`. |
| `children` | `ReactElement` | — (required) | The single form control (`Input`, `Textarea`, `Checkbox`, a raw `<select>`, etc.) to be cloned with injected a11y attributes. |
| `id` | `string` | — | Optional id base — omit to let `useId()` generate a stable one. |

## Related
- `Label` and `HelperText` — the two atoms FormField composes automatically.
- `Input` / `Textarea` — the most common controls passed as FormField's child.
- `Checkbox` / `Radio` / `Switch` — can also be passed as FormField's child, though inline labeling via their own wrapping `label` is more common for single controls.
