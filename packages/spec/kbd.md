# Kbd

## Usage
Kbd renders a native `<kbd>` element to visually represent a keyboard key or shortcut (e.g. `Esc`, `Ctrl`, `K`). It uses the system's mono font stack and a hairline border instead of a decorative shadow. It has a single size and no variants — a key cap is a fixed-identity UI element in this system, not something that needs a t-shirt scale.

## Do
- Combine multiple `Kbd` elements with a plain `+` separator to represent chorded shortcuts (e.g. `Ctrl` + `K`).
- Use Kbd inline within Text or tooltips to document keyboard shortcuts.

## Don't
- Don't use Kbd for general inline code or monospace text that isn't a literal keyboard key — that's a different semantic (this system has no dedicated `Code` atom in this wave, so reach for Text with a mono treatment if needed rather than repurposing Kbd's semantics).
- Don't make Kbd interactive — it's a static visual label, not a control.

## Accessibility
- **Keyboard:** N/A — Kbd is non-interactive and never receives focus.
- **Screen reader:** Renders a real native `<kbd>` element with its text content as-is; no additional ARIA is applied or needed since `<kbd>` already carries correct native semantics.
- **Focus:** Not focusable; no focus-visible styling is defined.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| ...rest | `ComponentPropsWithoutRef<'kbd'>` | — | All native `<kbd>` attributes pass through (including `children` for the key label and `className`, which merges with the component's own base class). |

## Related
- Text — the general-purpose inline text atom; Kbd is reserved specifically for keyboard key representation.
- Badge — another small, fixed-identity inline label, though for status/category rather than keyboard keys.
