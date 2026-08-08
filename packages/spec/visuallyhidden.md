# VisuallyHidden

## Usage
VisuallyHidden is an independent utility (D-012, no props beyond `children`) that renders content invisible on screen but still exposed to assistive technology, using the standard CSS "clip" pattern rather than `display: none`. Use it to give screen-reader-only text to otherwise visual-only controls — most commonly labeling icon-only buttons.

## Do
- Use VisuallyHidden to provide an accessible text label for icon-only interactive elements (e.g. a close "×" button).
- Pair it with an `aria-hidden="true"` sibling icon so the icon glyph itself isn't redundantly announced.
- Use it for any content that should exist for screen readers/assistive tech but has no visual presentation need.

## Don't
- Don't use `display: none` or `visibility: hidden` as an alternative — those remove content from the accessibility tree entirely, defeating the purpose.
- Don't nest interactive elements inside VisuallyHidden expecting normal visual interaction — its content is visually clipped, not just styled small.
- Don't use it to hide content from screen readers — it does the opposite; use `aria-hidden` on the actual element for that.

## Accessibility
- **Keyboard:** N/A — non-interactive; it does not manage focus or add any keyboard behavior itself.
- **Screen reader:** Content remains in the accessibility tree and is announced normally by screen readers — it's visually clipped via CSS, not removed via `display: none`, which is tested explicitly (`getComputedStyle(el).display` is asserted not to be `'none'`).
- **Focus:** Not inherently focusable; renders a plain `span`. If wrapping focusable content, that content's native focus behavior is unaffected.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The text/content to expose to assistive technology while hidden visually. |
| ...rest | `ComponentPropsWithoutRef<'span'>` | — | All standard `span` DOM props (e.g. `className`, `id`) are spread onto the rendered element. |

## Related
- IconButton (typical consumer — labels an icon-only button), Icon (paired with `aria-hidden` alongside VisuallyHidden text), Box (sibling base primitive, though VisuallyHidden does not extend it).
