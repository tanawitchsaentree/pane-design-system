# Box

## Usage
Box is the base primitive of the whole system (D-012) — a plain, styleable box-model reset rendered as a `div` by default. It carries no variant or size prop; every other layout primitive (Flex, Stack, Center, Grid, Container, and more) is built on top of it. Reach for Box directly when you just need an unstyled wrapper element, an escape hatch for inline `style`/`className`, or a polymorphic root via `asChild`.

## Do
- Use Box as the generic wrapper when no other layout primitive (Flex/Stack/Grid/etc.) fits the need.
- Use `asChild` to render Box's styling/behavior onto a different single child element (e.g. an `<a>`) instead of introducing a wrapping `div`.
- Pass `data-*`/`aria-*` and other standard DOM props straight through — Box spreads them onto the rendered element.

## Don't
- Don't add variant/size props to Box itself — by design it stays a plain reset; put visual variants in components that extend it.
- Don't use `asChild` with a child that doesn't forward `ref` or accept spread DOM props — Slot requires that contract.
- Don't rely on Box for semantic meaning — it renders a generic `div` (or the child you supply) with no inherent role.

## Accessibility
- **Keyboard:** N/A — non-interactive layout primitive.
- **Screen reader:** No inherent role or label; announced according to whatever element it renders (`div` by default, or the `asChild` child's own semantics). Verified axe-clean in tests.
- **Focus:** Not focusable by default (no tabIndex added). If `asChild` is used with a naturally focusable element (e.g. `<a href>`), that element's native focus behavior applies unchanged.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `asChild` | `boolean` | `false` | Render as the single child element instead of a `div` (Radix-style polymorphism via `@radix-ui/react-slot`). The child must forward `ref` and accept the props Box spreads onto it. |
| `children` | `ReactNode` | — | Content to render inside the Box. |
| ...domProps | `ComponentPropsWithoutRef<'div'>` | — | All standard `div` DOM props (e.g. `className`, `style`, `data-*`, `aria-*`) are spread onto the rendered element. |

## Related
- Flex, Stack, Grid, Container, Center, Spacer, Divider, AspectRatio — all extend Box directly or transitively.
