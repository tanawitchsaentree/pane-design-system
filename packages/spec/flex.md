# Flex

## Usage
Flex is the flexbox layout primitive extending Box (D-012). Use it whenever you need to arrange children in a row or column with control over gap, alignment, justification, and wrapping. It's the general-purpose flexbox building block that more specific primitives (Stack, Center) wrap for common cases.

## Do
- Use the `gap` prop with a `space.*` token step instead of manual margins between children.
- Reach for Flex when you need row/column layout with alignment or wrapping control that Stack's simpler API doesn't expose.
- Combine with `Spacer` (no explicit size) to push flex children apart along the main axis.

## Don't
- Don't pass raw pixel/rem gap values — `gap` only accepts `SpaceToken` steps that map to `var(--ds-space-*)`.
- Don't use Flex purely for centering both axes — use `Center` instead, which fixes align/justify for you.
- Don't forget `wrap="wrap"` when laying out an unbounded number of children in a constrained-width row; default is `nowrap`.

## Accessibility
- **Keyboard:** N/A — non-interactive layout primitive.
- **Screen reader:** No inherent role; direction/align/justify/gap are exposed only as `data-*` attributes for styling hooks, not conveyed to assistive tech. Verified axe-clean in tests.
- **Focus:** Not focusable itself; forwards ref to the underlying DOM node. `asChild` (inherited from Box) changes the rendered element but not the focus model beyond what that element natively provides.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `'row' \| 'column'` | `'row'` | Flex-direction. |
| `gap` | `SpaceToken` | `undefined` | Gap between flex children — must reference a `space.*` token step, never a raw value. |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `undefined` | align-items. |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `undefined` | justify-content. |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse'` | `'nowrap'` | flex-wrap. |
| ...BoxProps | — | — | Inherits all Box props, including `asChild` and standard DOM props. |

## Related
- Box (base primitive), Stack (thin wrapper fixing direction naming + default gap), Center (wrapper fixing align/justify to center), Spacer (used inside Flex to push content apart).
