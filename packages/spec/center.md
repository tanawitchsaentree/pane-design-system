# Center

## Usage
Center centers its children on both axes by wrapping Flex with `align="center"` and `justify="center"` fixed internally (D-012). Use it for the common "center this single block/element" case — modals' inner content, empty states, spinners — without having to remember Flex's align/justify prop names.

## Do
- Use Center whenever content needs to be centered on both axes inside a fixed-height or fixed-size container.
- Still use `direction`/`gap` from the underlying Flex when centering a row or column of multiple items together.
- Give the parent an explicit height (inline style or CSS) since Center only controls alignment, not the box's own size.

## Don't
- Don't try to pass `align`/`justify` props — they're omitted from `CenterProps` and fixed to `'center'` internally; they cannot be overridden.
- Don't use Center when you only need one-axis alignment — use Flex directly with just `align` or `justify` set.
- Don't rely on Center for spacing between multiple children beyond what `gap` provides.

## Accessibility
- **Keyboard:** N/A — non-interactive layout primitive.
- **Screen reader:** No inherent role; renders as a Flex/Box `div` with `data-align="center"`/`data-justify="center"` for styling only. Verified axe-clean in tests.
- **Focus:** Not focusable itself; forwards ref to the underlying DOM node.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `'row' \| 'column'` | `'row'` (inherited from Flex) | Flex-direction for arranging multiple centered children. |
| `gap` | `SpaceToken` | `undefined` | Gap between centered children. |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse'` | `'nowrap'` | flex-wrap, inherited from Flex. |
| ...BoxProps (via Flex, minus `align`/`justify`) | — | — | Inherits all other Box/Flex props except `align` and `justify`, which are fixed to `'center'` and not exposed. |

## Related
- Flex (what Center wraps and fixes align/justify on), Box (base primitive), AspectRatio (often paired with Center to center content within a ratio-locked box).
