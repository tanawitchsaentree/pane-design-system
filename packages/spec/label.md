# Label

## Usage
Label is the `<label>` wrapper for any form control — text, checkbox, radio, textarea, select. It renders its copy through `Text` (no bespoke font styling) and can add a required indicator. Use it standalone when wiring a control by hand with `htmlFor`, or let `FormField` wire it automatically when composing a full field.

## Do
- Pass `htmlFor` matching the control's `id` when using Label outside of `FormField`.
- Use `required` to mark mandatory fields — it renders both a visible `*` and a screen-reader-only "(required)" cue.
- Use `asChild` when the label needs to wrap something other than a plain `<label>` element (Radix-style polymorphism).

## Don't
- Don't rely on the `*` glyph alone to communicate "required" — it isn't reliably announced by screen readers, which is why the component always pairs it with visually-hidden text.
- Don't re-implement label typography with raw CSS — Label already renders through `Text` (`size="sm" weight="medium"`).
- Don't omit `htmlFor` when not using `asChild` or `FormField` — an unassociated label breaks the click-to-focus and screen-reader announcement behavior.

## Accessibility
- **Keyboard:** No independent keyboard behavior — clicking/tapping the label moves focus to or activates its associated control via native `<label for>` behavior.
- **Screen reader:** Native `<label for>` association exposes the control's accessible name. When `required`, a visually-hidden "(required)" string is announced in addition to the visible `*` (which is `aria-hidden`), satisfying the non-color/non-glyph-only cue rule.
- **Focus:** Label itself is not focusable; it delegates focus to the associated control when clicked.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `htmlFor` | `string` | — | Id of the form control this label describes. Omit only when composing inside `FormField`, which wires it automatically. |
| `required` | `boolean` | `false` | Shows a required indicator (`*` plus visually-hidden "(required)" text). |
| `asChild` | `boolean` | `false` | Renders as the single child element instead of a `label`. |
| `children` | `ReactNode` | — | Label copy. |

## Related
- `FormField` composes `Label` + a control + `HelperText` and wires `htmlFor`/`aria-describedby` automatically.
- `Text` — Label renders its copy through `Text` rather than duplicating typography.
- `VisuallyHidden` — used internally for the screen-reader-only "(required)" cue.
