# IconButton

## Usage
IconButton is a Button variant with only an icon and no visible text label, extending Button's variant/intent/size/loading/asChild API 1:1. It renders a true square hit target (width equals height, matching `size.control.*`) instead of Button's rectangular padding, for toolbar actions, close buttons, and other icon-only controls.

## Do
- Always provide a clear, specific `aria-label` describing the action (e.g. `"Add to favorites"`), since it's the only accessible name the control has.
- Use it for compact, icon-only actions like toolbar buttons, dismiss/close controls, and similar UI where a visible label isn't appropriate.
- Use the same `variant`/`intent`/`size` conventions as Button (e.g. reserve `intent='primary'` for the one primary action).

## Don't
- Don't omit `aria-label` — TypeScript enforces it as a required prop precisely because there's no visible text fallback.
- Don't use IconButton where a text label would actually help users — prefer Button with `leftIcon`/`rightIcon` when a label fits.

## Accessibility
- **Keyboard:** Same as Button — native `<button>` semantics, `Tab` to focus, `Enter`/`Space` to activate; disabled (including while `loading`) is removed from the tab order.
- **Screen reader:** `aria-label` is a required prop (not optional) — it becomes the button's sole accessible name since there is no visible text label for assistive tech to read.
- **Focus:** Inherits Button's `:focus-visible` treatment — dedicated focus-ring token, never a shadow ring.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `'aria-label'` | `string` | — (required) | Accessible name — required because an icon-only button has no visible text label for assistive tech. |
| `children` | `ReactNode` | — | The icon content (an `Icon` or raw SVG). |
| ...rest | `Omit<ButtonProps, 'leftIcon' \| 'rightIcon' \| 'children'>` | inherited from Button | `variant`, `intent`, `size`, `loading`, `disabled`, `asChild`, and native button attributes all pass through from Button. |

## Related
- Button — the base component IconButton extends; use Button when a visible text label is present.
- Icon — commonly rendered as IconButton's children.
