# Grid

## Usage
Grid is the CSS Grid layout primitive extending Box (D-012), defaulting to a 12-column grid per D-007. Use it for two-dimensional layouts — column-based page sections, card grids, or any arrangement that needs explicit column counts and responsive breakpoint overrides (`sm`/`md`/`lg`/`xl`).

## Do
- Use the default 12-column grid for standard page-section layouts, overriding `columns` for simpler grids (e.g. 4-column card layouts).
- Use the `responsive` prop to change column count at `sm`/`md`/`lg`/`xl` breakpoints (D-007: 640/768/1024/1280) rather than writing custom media queries.
- Use a `SpaceToken` for `gap` to keep grid gutters aligned with the spacing scale.

## Don't
- Don't set unset breakpoints expecting them to reset to the base `columns` — unset breakpoints inherit the previous breakpoint's value, not the base.
- Don't hardcode column widths in child styles — let Grid's `--ds-grid-cols*` CSS custom properties drive layout.
- Don't use Grid for simple one-dimensional lists — use Flex or Stack instead.

## Accessibility
- **Keyboard:** N/A — non-interactive layout primitive.
- **Screen reader:** No inherent role; grid column counts are exposed via inline CSS custom properties (`--ds-grid-cols`, `--ds-grid-cols-sm/md/lg/xl`) and `gap` via a `data-gap` attribute — none of this is conveyed to assistive tech. Verified axe-clean in tests.
- **Focus:** Not focusable itself; forwards ref to the underlying DOM node.

## Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `number` | `12` | Number of grid columns (D-007 12-column grid). |
| `gap` | `SpaceToken` | `undefined` | Gap between grid cells — must reference a `space.*` token step. |
| `responsive` | `{ sm?: number; md?: number; lg?: number; xl?: number }` | `undefined` | Optional per-breakpoint column override. Breakpoints follow D-007 (sm 640 / md 768 / lg 1024 / xl 1280). Unset breakpoints inherit the previous one. |
| ...BoxProps | — | — | Inherits all Box props, including `asChild` and standard DOM props. |

## Related
- Box (base primitive), Container (typically wraps a Grid to cap its max-width), Flex/Stack (one-dimensional alternatives).
