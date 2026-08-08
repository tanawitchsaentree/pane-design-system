# HelperText

## Usage
HelperText is the supporting copy shown under a form control — hint text, validation errors, character limits. It renders through `Text` for typography consistency and exposes a `tone` prop to switch between neutral guidance and error messaging. It is purely presentational; the actual `aria-describedby` wiring to its control is the caller's job, or automatic when composed through `FormField`.

## Do
- Use `tone="error"` for validation failures — it switches to `color.action.danger.default`, self-checked for AA contrast (6.91:1/6.50:1 light, 5.78:1/6.07:1 dark).
- Compose HelperText inside `FormField` whenever possible so `aria-describedby` is wired for you.
- Keep the message short — one line of guidance or one error, not a paragraph.

## Don't
- Don't expect HelperText to announce itself automatically — if used outside `FormField`, you must set `aria-describedby` on the control yourself pointing at HelperText's `id`.
- Don't use `tone="error"` for non-error guidance — it's a dedicated danger-colored state, not a general emphasis tool.
- Don't re-declare font size/color with custom CSS — HelperText already renders through `Text` (`size="sm" color="subtle"`).

## Accessibility
- **Keyboard:** None — HelperText is static text, not an interactive element.
- **Screen reader:** Purely presentational on its own; announced to assistive tech only when a control references it via `aria-describedby` (wired automatically by `FormField`, or manually by the caller otherwise). The `data-tone` attribute is a styling hook, not an ARIA signal — tone changes rely on the caller/`FormField` also switching to `aria-invalid` where relevant.
- **Focus:** Not focusable.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `'default' \| 'error'` | `'default'` | Visual tone. `'error'` uses the danger color token. |
| `children` | `ReactNode` | — | Helper/error message content. |

## Related
- `FormField` composes `HelperText` under the control and wires `aria-describedby` (and switches `tone` to `'error'` when `invalid`) automatically.
- `Label` — the other text-bearing atom composed by `FormField`, following the same "render through `Text`" pattern.
- `Input` / `Textarea` — typical controls whose validation state HelperText communicates.
