# AspectRatio

## Usage
AspectRatio constrains its children to a fixed width/height ratio, extending Box (D-012). Use it for media placeholders (images, video embeds, thumbnails) where you need consistent proportions regardless of content or container width — either via named presets bound to `ratio.*` tokens, or an arbitrary numeric ratio as an escape hatch.

## Do
- Use one of the named presets (`square`, `video`, `photo`, `portrait`, `golden`) whenever the design calls for a standard ratio — these map to `ratio.*` tokens (square=1, video=16/9, photo=4/3, portrait=3/4, golden=1.618).
- Use a numeric ratio only as an escape hatch for a ratio the token scale doesn't cover — treat it like the `style` prop, a deliberate one-off, not a new token.
- Give the AspectRatio a `maxWidth` (via `style`) when you want the ratio-locked box to not stretch full container width.

## Don't
- Don't hardcode `aspect-ratio` in child/consumer CSS — let AspectRatio's `data-ratio` attribute (for presets) or inline `style.aspectRatio` (for numeric) drive it.
- Don't treat a numeric ratio as equivalent to a token — it bypasses the token system and should be used sparingly.
- Don't assume the preset `data-ratio` attribute is set for numeric ratios — it's only set for the named presets; numeric ratios apply via inline style instead.

## Accessibility
- **Keyboard:** N/A — non-interactive layout primitive.
- **Screen reader:** No inherent role; ratio is exposed via `data-ratio` (presets) or inline style (numeric) for styling only, not conveyed to assistive tech. Verified axe-clean in tests.
- **Focus:** Not focusable itself; forwards ref to the underlying DOM node.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `ratio` | `'square' \| 'video' \| 'photo' \| 'portrait' \| 'golden' \| number` | — (required) | Preset name bound to `ratio.*` tokens (square=1, video=16/9, photo=4/3, portrait=3/4, golden=1.618), or an arbitrary number (width/height) as an escape hatch for ratios the token scale doesn't cover. |
| ...BoxProps | — | — | Inherits all Box props, including `asChild` and standard DOM props. |

## Related
- Box (base primitive), Center (often used to center content within an AspectRatio box), Image (typical child content wrapped by AspectRatio).
