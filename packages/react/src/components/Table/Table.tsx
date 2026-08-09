import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import styles from './Table.module.css';

/**
 * Table — a basic, non-virtualized, non-sortable wrapper around the native `<table>`/`<thead>`/
 * `<tbody>`/`<tr>`/`<th>`/`<td>` elements (W7 Data Display). Deliberately NOT an ARIA `grid`
 * pattern: native table semantics already give screen readers correct row/column/header
 * relationships for free (`<th scope>`, `<td>` cell association) — no role/keyboard-map is
 * hand-written here, matching component-engineer.md's "ห้ามเขียน ... roving tabindex เอง" spirit
 * even though the underlying primitive this time is the browser's own table model, not React
 * Aria/Radix. See `packages/spec/table.md` for the explicit scope boundary against W9's DataGrid
 * (TanStack Table + TanStack Virtual) — sorting, column resize, filtering, and virtualized rows
 * are all OUT of scope for this component by design, not an oversight; adding any of those here
 * would also raise this component's Rigor Tier from T2 to T3 (keyboard interaction complexity),
 * which is exactly the boundary DataGrid exists on the other side of.
 *
 * Reuse Check (component-engineer.md step 0): grepped `packages/react/src/components/` — no
 * existing table/grid component. `Checkbox` exists and IS reused as-is for row-selection
 * checkboxes (a caller places a plain `<Checkbox>` inside a `Table.Cell`/`Table.HeaderCell`; this
 * file adds no new checkbox implementation).
 *
 * Anatomy: `Table.Root` (`<table>`, D-008 hairline border, no decorative shadow) -> `Table.Header`
 * (`<thead>`) -> `Table.Row` (`<tr>`) -> `Table.HeaderCell` (`<th>`) | `Table.Body` (`<tbody>`) ->
 * `Table.Row` (`<tr>`) -> `Table.Cell` (`<td>`).
 * A11y: native `<table>` semantics (row/column header association) come from the browser for
 * free — `Table.HeaderCell` defaults `scope="col"` (the overwhelmingly common case: a header row
 * labelling columns) but accepts `scope="row"` for a row-header column. No custom role/ARIA is
 * added anywhere in this file.
 * Non-color cue: `striped` (zebra-stripe) is a pure readability aid, not a state that communicates
 * meaning on its own (unlike, say, a selected/checked state) — BLUEPRINT §7's non-color-cue rule
 * targets state changes a user must be able to perceive without color (error, selected, disabled,
 * etc.); alternating row background does not encode any such state, so it needs no additional
 * non-color cue of its own. `Table.Row`'s `selected` prop DOES change a real state, so it carries
 * two independent cues: a background tint AND a colored left border accent (`data-selected`,
 * see Table.module.css) — never color alone.
 */

export interface TableRootProps extends ComponentPropsWithoutRef<'table'> {
  /** Alternates row background color for readability. Pure visual aid — not a state, so it needs
   * no non-color cue of its own (see module doc). Default `false`. */
  striped?: boolean;
  /** T-shirt density (D-010 baseline = comfortable) controlling cell padding. Default
   * `'comfortable'`. */
  density?: 'compact' | 'comfortable';
}

/** Table.Root — the native `<table>` element. Carries `striped`/`density` as data-attributes so
 * `Table.Row`/`Table.Cell`/`Table.HeaderCell` descendants can read them purely via CSS — no
 * context provider needed for two attribute flags that only ever affect descendant styling. */
export const Root = forwardRef<ElementRef<'table'>, TableRootProps>(function Root(
  { striped = false, density = 'comfortable', className, ...rest },
  ref,
) {
  const classes = className ? `${styles.root} ${className}` : styles.root;
  return (
    <table
      ref={ref}
      className={classes}
      data-striped={striped ? '' : undefined}
      data-density={density}
      {...rest}
    />
  );
});
Root.displayName = 'Table.Root';

export type TableHeaderProps = ComponentPropsWithoutRef<'thead'>;

/** Table.Header — the native `<thead>` element. */
export const Header = forwardRef<ElementRef<'thead'>, TableHeaderProps>(function Header(
  { className, ...rest },
  ref,
) {
  const classes = className ? `${styles.header} ${className}` : styles.header;
  return <thead ref={ref} className={classes} {...rest} />;
});
Header.displayName = 'Table.Header';

export type TableBodyProps = ComponentPropsWithoutRef<'tbody'>;

/** Table.Body — the native `<tbody>` element. */
export const Body = forwardRef<ElementRef<'tbody'>, TableBodyProps>(function Body(
  { className, ...rest },
  ref,
) {
  const classes = className ? `${styles.body} ${className}` : styles.body;
  return <tbody ref={ref} className={classes} {...rest} />;
});
Body.displayName = 'Table.Body';

export interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
  /** Marks this row as selected — a real state, so it renders with two independent non-color
   * cues (background tint + left border accent, see Table.module.css `[data-selected]`), never
   * color alone. Common pairing: a `Checkbox` inside the row's first `Table.Cell`/`Table.HeaderCell`
   * (reused as-is, not reimplemented — see module doc's Reuse Check). Default `false`. */
  selected?: boolean;
}

/** Table.Row — the native `<tr>` element. */
export const Row = forwardRef<ElementRef<'tr'>, TableRowProps>(function Row(
  { selected = false, className, ...rest },
  ref,
) {
  const classes = className ? `${styles.row} ${className}` : styles.row;
  return (
    <tr ref={ref} className={classes} data-selected={selected ? '' : undefined} {...rest} />
  );
});
Row.displayName = 'Table.Row';

export interface TableHeaderCellProps extends ComponentPropsWithoutRef<'th'> {
  /** Mirrors the native `<th scope>` attribute. Default `'col'` — a header row labelling columns
   * is the overwhelmingly common case; pass `'row'` for a row-header column instead. */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
}

/** Table.HeaderCell — the native `<th>` element. No sort affordance, no click handler: this is a
 * plain column/row label (see module doc — sorting is explicitly out of scope, W9 DataGrid owns
 * that). */
export const HeaderCell = forwardRef<ElementRef<'th'>, TableHeaderCellProps>(function HeaderCell(
  { scope = 'col', className, ...rest },
  ref,
) {
  const classes = className ? `${styles.headerCell} ${className}` : styles.headerCell;
  return <th ref={ref} scope={scope} className={classes} {...rest} />;
});
HeaderCell.displayName = 'Table.HeaderCell';

export type TableCellProps = ComponentPropsWithoutRef<'td'>;

/** Table.Cell — the native `<td>` element. */
export const Cell = forwardRef<ElementRef<'td'>, TableCellProps>(function Cell(
  { className, ...rest },
  ref,
) {
  const classes = className ? `${styles.cell} ${className}` : styles.cell;
  return <td ref={ref} className={classes} {...rest} />;
});
Cell.displayName = 'Table.Cell';

/** Table — compound component (`Table.Root`/`Header`/`Body`/`Row`/`HeaderCell`/`Cell`) wrapping
 * native `<table>` semantic HTML. No behavior library involved (browser gives correct screen
 * reader semantics for free) — see module doc for the full scope contract and
 * `packages/spec/table.md` for the user-facing usage guide. */
export const Table = { Root, Header, Body, Row, HeaderCell, Cell };
