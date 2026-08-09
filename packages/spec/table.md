# Table

## Scope — read this first
**Table is a basic, non-virtualized, non-sortable, non-filterable wrapper around the native
`<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` elements.** It is the Wave 7 (Data Display)
component. It deliberately does **not** do any of the following:

- **Sorting** — no clickable header, no sort icon, no `aria-sort`.
- **Column resize** — no drag handles, fixed column widths come from normal CSS/content flow.
- **Filtering** — no search box, no per-column filter UI.
- **Virtualization** — every row is a real DOM node; there is no windowing.

If your table needs any of the above, it needs a different component: **`DataGrid`** (Wave 9,
built on TanStack Table + TanStack Virtual — an "X-class" component with its own ARIA `grid`
pattern, keyboard map, and virtualized rendering). Table and DataGrid are intentionally two
different components at two different Rigor Tiers, not one component with an escalating prop
list: adding sort/keyboard interaction to this file would push it from T2 to T3 (per
`ds-conventions/SKILL.md`'s Rigor Tiers table), which is exactly the tier boundary DataGrid exists
on the other side of. Do not ask this component to grow into that — reach for DataGrid instead.

## Usage
Compose `Table.Root` (`<table>`) → `Table.Header` (`<thead>`) → `Table.Row` (`<tr>`) →
`Table.HeaderCell` (`<th>`), and `Table.Body` (`<tbody>`) → `Table.Row` (`<tr>`) → `Table.Cell`
(`<td>`), the same way you'd write plain semantic HTML — because that is exactly what this
component is. No behavior library (React Aria/Radix) is involved: the browser already gives
`<table>` correct row/column/header screen-reader semantics for free, so there is nothing to
borrow behavior from.

```tsx
<Table.Root aria-label="Fruit inventory">
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Stock</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Apple</Table.Cell>
      <Table.Cell>12</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## Do
- Give `Table.Root` an accessible name (`aria-label` or `aria-labelledby`, e.g. a preceding
  `Heading`) whenever the table isn't obviously described by surrounding page content.
- Use `Table.HeaderCell` (`<th>`) for every column/row label — never a styled `Table.Cell`
  standing in for a header. `scope` defaults to `'col'`; pass `scope="row"` for a row-header
  column.
- For row selection, put a plain `Checkbox` (the existing component, reused as-is — see Reuse
  Check below) inside the row's leading `Table.Cell`/`Table.HeaderCell`, and pass `selected` to
  the corresponding `Table.Row` so the row gets its background/border treatment in sync with the
  checkbox's own checked state. `Table.Row`'s `selected` is presentational only — wire the
  checkbox's `checked`/`onChange` to your own selection state and derive `selected` from the same
  source (see `Table.stories.tsx`'s `SelectableRows` story).
- Use `striped` for readability on tables with many rows of similar-looking data. Use `density`
  to switch between `'comfortable'` (default, D-010 baseline) and `'compact'` cell padding.

## Don't
- Don't add a click handler / sort icon to `Table.HeaderCell` to fake sorting — use `DataGrid`
  (W9) instead.
- Don't reach for this component if you expect more than roughly a few hundred rows rendered at
  once — there is no virtualization here, by design (same ceiling reasoning `Listbox` documents
  for its own unvirtualized option list). Large datasets belong in `DataGrid`.
- Don't implement a new checkbox for row selection — reuse the existing `Checkbox` component.
- Don't rely on `Table.Row`'s `selected` background tint alone to communicate selection — it
  already pairs with a left border accent (two independent non-color cues); don't strip one out
  via a custom `className` override.

## Accessibility
- **Semantics:** 100% native — `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th scope>`, `<td>`. No
  custom `role`/ARIA is added anywhere; screen readers get correct row/column/header association
  from the browser's own table model. This is why Table has no keyboard map of its own to
  document: there is no custom focus/keyboard behavior in this component, unlike `Listbox`
  (roving tabindex) or `RadioCards` (native radio-group behavior) elsewhere in this system.
- **Header cells:** `Table.HeaderCell` always renders a real `<th>` with `scope` set (`'col'` by
  default, `'row'` available) — never a `<td>` styled to look like a header.
- **Row selection:** a selected `Table.Row` (`data-selected`) is a real state change, so it always
  carries two independent non-color cues (background tint + a left border accent), never color
  alone — verified in `Table.test.tsx`. `striped`, by contrast, is a pure readability aid that
  does not communicate a state on its own, so it needs (and has) only one cue.
- **Focus:** Table itself introduces no focusable elements — any focusable content (a row-select
  `Checkbox`, an action button in a cell) keeps its own native focus behavior unmodified.
- This is a T2 Rigor Tier component (interactive only via ordinary content inside cells, no
  keyboard/focus/overlay complexity of its own) — no `packages/conformance` (Playwright) spec or
  Gate Proof is required for it, per `ds-conventions/SKILL.md`'s Rigor Tiers table. Everything
  asserted about this component (role wiring, `scope`, `striped`/`density`/`selected`
  data-attributes, checkbox-in-cell interaction, axe) is provable in `Table.test.tsx` under jsdom
  — there is no real-browser-only behavior left unverified, because this component has no custom
  behavior for a real browser to reveal.

## Performance ceiling (no virtualization)
Table renders every `Table.Row`/`Table.Cell` child as a real DOM node — there is no
windowing/virtualization render-prop, the same accepted ceiling `Listbox` documents for its own
unvirtualized option list. Treat a few hundred rows as the comfortable upper bound for this
component; past that, reach for `DataGrid` (W9, TanStack Virtual-backed) instead of adding
windowing here.

## Props

### Table.Root
| Prop | Type | Default | Description |
|---|---|---|---|
| `striped` | `boolean` | `false` | Alternates row background for readability. Pure visual aid, not a state. |
| `density` | `'compact' \| 'comfortable'` | `'comfortable'` | T-shirt density (D-010 baseline) controlling cell padding. |
| ...rest | `ComponentPropsWithoutRef<'table'>` | — | Spread onto the native `<table>` (e.g. `aria-label`). |

### Table.Row
| Prop | Type | Default | Description |
|---|---|---|---|
| `selected` | `boolean` | `false` | Marks the row selected — renders with a background tint + left border accent (two non-color cues). |
| ...rest | `ComponentPropsWithoutRef<'tr'>` | — | Spread onto the native `<tr>`. |

### Table.HeaderCell
| Prop | Type | Default | Description |
|---|---|---|---|
| `scope` | `'col' \| 'row' \| 'colgroup' \| 'rowgroup'` | `'col'` | Mirrors native `<th scope>`. |
| ...rest | `ComponentPropsWithoutRef<'th'>` | — | Spread onto the native `<th>`. |

### Table.Header / Table.Body / Table.Cell
Thin wrappers over `<thead>`/`<tbody>`/`<td>` — accept and forward all native props for that
element, no extra props of their own.

## Related
- `Checkbox` — reused as-is for row-selection checkboxes; Table adds no new checkbox
  implementation.
- `DataGrid` (Wave 9, not yet built) — the sortable/filterable/virtualized/column-resizable
  sibling this component explicitly does not try to be. See "Scope" above.
- `Listbox` — another non-virtualized collection component in this system with the same
  documented "few hundred items" performance ceiling reasoning.
