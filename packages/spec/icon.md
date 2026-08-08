# Icon

## Usage
Icon sizes and colors an arbitrary SVG child via CSS custom properties — it ships no icon set of its own, only the sizing/coloring wrapper (D-004 icon size scale). Use it any time you render an SVG in the UI so it picks up the system's icon size steps and semantic color tokens consistently, and gets the correct accessibility treatment for decorative vs. meaningful icons.

## Do
- Omit `label` when the icon sits next to visible text that already conveys its meaning (the default, decorative case).
- Set `label` when the icon is the only carrier of meaning — e.g. a standalone icon-only control's visual content.
- Leave `color` at the default `'currentColor'` when the icon should match surrounding text color automatically.

## Don't
- Don't add a redundant `label` when adjacent visible text already states the same meaning — that creates duplicate announcements for screen reader users.
- Don't use Icon as an interactive element itself — wrap it in IconButton (or Button) when it needs to be clickable.

## Accessibility
- **Keyboard:** N/A — Icon itself is non-interactive and never receives focus.
- **Screen reader:** When `label` is provided, the wrapper gets `role="img"` + `aria-label` (icon is meaningful on its own). When `label` is omitted (default), the wrapper gets `aria-hidden="true"` (icon is decorative, relies on adjacent text for meaning).
- **Focus:** Not focusable; no focus-visible styling is defined.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `IconSizeToken` | `'md'` (20) | `size.icon.*` t-shirt scale — 16/20/24/32 (D-004). |
| `color` | `'currentColor' \| 'default' \| 'subtle' \| 'disabled' \| 'inverse'` | `'currentColor'` | Semantic text color token, or inherit from surrounding text. |
| `label` | `string` | `undefined` | Accessible name; provide when the icon carries meaning on its own. Omitting hides it via `aria-hidden`. |
| `children` | `ReactNode` | — | The SVG icon element (required). |

## Related
- IconButton — the interactive, clickable wrapper around an icon.
- Button — often composes Icon via `leftIcon`/`rightIcon` slots.
- Spinner — a separate loading-specific graphic, not built on top of Icon.
