# Textarea

## Usage
Textarea is a native `<textarea>`-based multi-line field, following the same no-wrapper rationale as Input — a plain native element already gets correct semantics and keyboard behavior for free. Use it for prose-length input (bio, comments, descriptions) where Input's single-line adornment slots wouldn't make sense.

## Do
- Use `rows` to set the visible line count (default `3`) rather than fighting the block-size with CSS.
- Use `resize="vertical"` (the default) for prose fields; use `"none"` when the surrounding layout can't tolerate resizing, or `"both"` for free-form text areas.
- Let it work uncontrolled (`defaultValue`) or controlled (`value` + `onChange`) — same duality as Input, no internal state involved.

## Don't
- Don't use Textarea for single-line values — use `Input`, which supports adornment slots Textarea intentionally omits.
- Don't forget `invalid` needs to be paired with visible messaging (e.g. `HelperText` via `FormField`) — it only sets `aria-invalid` and a border color change, not an error message.
- Don't rely on `size` to control height precisely — it sets the field's minimum block-size, but actual height also grows with `rows`/content.

## Accessibility
- **Keyboard:** Native `<textarea>` keyboard behavior — no custom key handling.
- **Screen reader:** `invalid` sets `aria-invalid="true"`; `disabled`/`readOnly` use their native attributes (disabled removes from tab order, readOnly keeps it focusable). Label/helper-text association is the caller's job unless composed via `FormField`.
- **Focus:** Focus lands directly on the native `<textarea>` element (no wrapper span, unlike Input).

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | `size.control.*` t-shirt scale — sets minimum block-size. |
| `invalid` | `boolean` | `false` | Marks the field as failing validation; sets `aria-invalid` (same token/contrast as Input). |
| `rows` | `number` | `3` | Visible text rows. |
| `resize` | `'none' \| 'vertical' \| 'both'` | `'vertical'` | CSS `resize` behavior. |
| ...rest | `ComponentPropsWithoutRef<'textarea'>` (minus `size`) | — | All native textarea props pass straight through. |

## Related
- `FormField` composes Textarea with `Label` and `HelperText`, wiring accessibility attributes automatically.
- `Input` — the single-line counterpart with adornment slots, sharing the same size/invalid token pattern.
