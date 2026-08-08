# Divider

## Usage
Divider is a hairline rule extending Box (D-012), styled per D-008 (hairline border tokens define the divider — no decorative shadow). Use it to separate sections of content visually and structurally, either horizontally between stacked blocks or vertically between inline items.

## Do
- Use Divider between logically distinct sections within a Stack or other layout to give assistive tech a structural separator, not just a visual line.
- Set `orientation="vertical"` when separating inline items (e.g. within a horizontal toolbar), and ensure the parent gives it a defined height/cross-axis size to render visibly.
- Use `variant="hairline-strong"` when a slightly more prominent rule is needed, while still following D-008 border tokens.

## Don't
- Don't use Divider purely for decorative visual spacing — if there's no real section boundary, use Spacer or a `gap` instead so screen readers aren't told there's a separator.
- Don't override `role` or `aria-orientation` — they're set internally to convey correct separator semantics and are tied to the `orientation` prop.
- Don't nest children inside Divider — its `BoxProps` are taken `Omit<..., 'children'>`, so it's not meant to carry content.

## Accessibility
- **Keyboard:** N/A — non-interactive; exposes `role="separator"` semantics rather than any interactive/keyboard-navigable role.
- **Screen reader:** Announced as a structural separator via `role="separator"` and `aria-orientation` (mirrors the `orientation` prop), so assistive tech treats it as a real divider rather than decorative content.
- **Focus:** Not focusable; purely structural.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider direction; also drives `aria-orientation`. |
| `variant` | `'hairline' \| 'hairline-strong'` | `'hairline'` | Border weight, both bound to D-008 border tokens. |
| ...BoxProps (minus `children`) | — | — | Inherits Box props except `children`, which is excluded. |

## Related
- Stack (Divider is commonly placed between Stack children), Box (base primitive), Center/Flex (used to lay out a vertical Divider between inline items).
