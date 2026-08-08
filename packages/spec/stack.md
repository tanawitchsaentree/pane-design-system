# Stack

## Usage
Stack is a thin wrapper over Flex (D-012) for the common case of stacking a list of blocks with consistent spacing. It defaults to vertical stacking with a sensible default gap (`space.300`), and its `direction` prop uses plain-language `'vertical'`/`'horizontal'` values instead of Flex's CSS `'row'`/`'column'` terminology.

## Do
- Use Stack as the default choice for a simple vertical or horizontal list of items with even spacing.
- Rely on the default gap (`'300'`) unless a design calls for tighter or looser spacing — override with any `SpaceToken`.
- Reach for the underlying Flex directly when you need `align`/`justify`/`wrap` control beyond what Stack's simplified API implies.

## Don't
- Don't pass `direction="row"`/`"column"` — Stack's `direction` prop only accepts `'vertical'`/`'horizontal'`, which it maps internally to Flex's `column`/`row`.
- Don't use Stack when you need alignment/justification/wrap control on the cross axis — it inherits those from FlexProps but Stack's purpose is the simple "list of blocks" case; consider Flex directly.
- Don't set raw gap values — `gap` must be a `SpaceToken`.

## Accessibility
- **Keyboard:** N/A — non-interactive layout primitive.
- **Screen reader:** No inherent role; renders as a Flex/Box `div` with `data-direction`/`data-gap` attributes for styling only. Verified axe-clean in tests.
- **Focus:** Not focusable itself; forwards ref to the underlying DOM node.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | `'vertical'` maps to Flex `column`, `'horizontal'` maps to Flex `row`. |
| `gap` | `SpaceToken` | `'300'` | Gap between stacked children. |
| ...FlexProps (minus `direction`) | — | — | Inherits all other Flex props (`align`, `justify`, `wrap`) plus BoxProps (`asChild`, standard DOM props). |

## Related
- Flex (what Stack wraps), Box (base primitive), Center (sibling Flex wrapper), Divider (commonly placed between Stack children to separate sections).
