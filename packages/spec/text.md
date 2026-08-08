# Text

## Usage
Text is the inline/span element for body copy — captions, labels, paragraph runs, and any place you need styled text without owning a heading's document-outline semantics. It renders a plain `span` by default and carries the type scale (size), weight, and semantic color role. Use `asChild` when the surrounding context needs a different real tag (`p`, `label`, etc.) while keeping Text's visual treatment.

## Do
- Use `asChild` to render the correct semantic tag (`<p>`, `<label>`) for the context instead of nesting a `span` inside it.
- Reach for `truncate` when the layout has a fixed/constrained width and content may overflow, rather than hand-rolling `text-overflow` CSS.
- Pick `color` from the semantic text color roles (D-006) rather than hardcoding a color.

## Don't
- Don't use Text for headings — use Heading so the document outline stays correct.
- Don't rely on Text for interactive behavior; it is purely presentational with no implicit role change.

## Accessibility
- **Keyboard:** N/A — Text is non-interactive and never receives focus.
- **Screen reader:** No implicit ARIA role is applied; content is read as plain text. `asChild` lets callers swap in the correct semantic tag (e.g. `label`) for their context so assistive tech gets accurate semantics.
- **Focus:** Not focusable; no focus-visible styling is defined.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `FontSizeToken` | `'md'` | Type scale step (D-005). |
| `weight` | `FontWeightToken` | `'regular'` | Font weight (D-005). |
| `color` | `TextColorToken` | `'default'` | Semantic text color role (D-006). |
| `truncate` | `boolean` | `false` | Truncates to a single line with an ellipsis on overflow. |
| `asChild` | `boolean` | `false` | Renders as the single child element instead of `span` (Radix-style polymorphism). |
| `children` | `ReactNode` | — | Text content. |

## Related
- Heading — use for content that belongs in the document outline; Text is for everything else.
- Link — inline anchor variant with its own color treatment, used alongside Text in body copy.
- Kbd — another inline text-like atom, for keyboard key representation specifically.
