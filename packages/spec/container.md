# Container

## Usage
Container centers content horizontally and caps its width at a breakpoint size, extending Box (D-012). Use it as the outermost wrapper for page sections or content areas that should stay readable-width on large viewports rather than stretching edge-to-edge.

## Do
- Use Container to wrap page-level content sections that need a consistent max-width and horizontal centering.
- Use the default `size="lg"` (D-002 anchor) unless a section explicitly needs a narrower reading width (`sm`/`md`) or a wider one (`xl`/`2xl`).
- Use `size="full"` when you deliberately want to remove the max-width cap (e.g. full-bleed hero sections).

## Don't
- Don't nest multiple Containers inside each other — max-width capping is meant to happen once per section.
- Don't use Container as a spacing utility — it only controls max-width/centering, not padding between children (use Stack/Spacer for that).
- Don't hardcode breakpoint pixel values in consumer code — rely on the `size` prop's token-bound breakpoints (D-007).

## Accessibility
- **Keyboard:** N/A — non-interactive layout primitive.
- **Screen reader:** No inherent role; `size` is exposed only via a `data-size` attribute for styling. Verified axe-clean in tests.
- **Focus:** Not focusable itself; forwards ref to the underlying DOM node.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'lg'` | Max-width breakpoint (D-007). `'full'` removes the max-width cap. Default is the D-002 anchor. |
| ...BoxProps | — | — | Inherits all Box props, including `asChild` and standard DOM props. |

## Related
- Box (base primitive), Grid (often placed inside a Container to lay out its contents), Center (for centering content within a Container's cross axis).
