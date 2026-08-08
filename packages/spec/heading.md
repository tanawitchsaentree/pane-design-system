# Heading

## Usage
Heading renders a real `h1`-`h6` element for document-outline structure, with visual size deliberately decoupled from semantic level — so a small-looking `h1` or a large-looking `h4` are both legitimate combinations. Use it anywhere content needs a heading in the accessibility tree; pick `level` for correct document structure and `size` (or let it default) for visual weight.

## Do
- Choose `level` based on correct document outline/heading hierarchy, not on how large you want the text to look.
- Let `size` default from `level` unless the design explicitly calls for a mismatched visual weight.
- Use `asChild` for the rare case where you need Heading's visual style on a non-heading tag (e.g. inside a card-title slot) without adding an extra heading to the outline.

## Don't
- Don't skip heading levels (e.g. `h1` straight to `h3`) just to get a certain visual size — use the `size` prop instead.
- Don't use Heading for non-heading emphasis text — use Text with a larger `size`/`weight` instead.

## Accessibility
- **Keyboard:** N/A — Heading is non-interactive and never receives focus.
- **Screen reader:** Always renders a real heading tag (`h1`-`h6`) matching `level`, so screen readers announce correct heading level/document outline regardless of the visual `size` chosen — unless `asChild` overrides the tag entirely.
- **Focus:** Not focusable; no focus-visible styling is defined.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | Semantic level — determines the rendered tag (`h1`-`h6`). |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | derived from `level` | Visual size step (D-005), independent of `level`. |
| `weight` | `FontWeightToken` | `'semibold'` | Font weight (D-005). |
| `asChild` | `boolean` | `false` | Renders as the single child element instead of the level's semantic tag. |
| `children` | `ReactNode` | — | Heading content. |

## Related
- Text — the non-heading counterpart for body copy and inline content.
- Icon — often paired next to a Heading for section titles with a leading icon.
