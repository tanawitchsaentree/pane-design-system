import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Table } from './Table';
import { Checkbox } from '../Checkbox/Checkbox';

// Honesty Rule (component-engineer.md): this is a plain native <table> — no behavior library,
// no roving focus, no keyboard map beyond what the browser gives <table>/<th>/<td> for free.
// Everything asserted below (role wiring via native table semantics, scope attribute, striped/
// density/selected data-attributes, forwardRef, checkbox-in-cell interaction, axe) is fully
// provable in jsdom. There is no real-browser-only behavior to flag as UNVERIFIED here (unlike
// Listbox/RadioCards) because this component intentionally has no custom focus/keyboard behavior
// at all — see Table.tsx module doc for why (sorting/virtualization/filtering are explicitly out
// of scope, owned by W9's DataGrid instead).

function BasicTable(props: Partial<React.ComponentProps<typeof Table.Root>> = {}) {
  return (
    <Table.Root aria-label="Fruit inventory" {...props}>
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
        <Table.Row>
          <Table.Cell>Banana</Table.Cell>
          <Table.Cell>7</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

describe('Table', () => {
  it('renders a native table with correct role hierarchy (table -> rowgroup -> row -> columnheader/cell)', () => {
    render(<BasicTable />);
    const table = screen.getByRole('table', { name: 'Fruit inventory' });
    const columnHeaders = within(table).getAllByRole('columnheader');
    expect(columnHeaders.map((h) => h.textContent)).toEqual(['Name', 'Stock']);
    const rows = within(table).getAllByRole('row');
    // 1 header row + 2 body rows
    expect(rows).toHaveLength(3);
    const cells = within(rows[1]).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual(['Apple', '12']);
  });

  it('defaults Table.HeaderCell scope to "col"', () => {
    render(<BasicTable />);
    const headerCell = screen.getAllByRole('columnheader')[0];
    expect(headerCell).toHaveAttribute('scope', 'col');
  });

  it('accepts scope="row" for a row-header column', () => {
    render(
      <Table.Root aria-label="Row headers">
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell scope="row">Apple</Table.HeaderCell>
            <Table.Cell>12</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByRole('rowheader')).toHaveAttribute('scope', 'row');
  });

  it('striped defaults to false (no data-striped attribute)', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table')).not.toHaveAttribute('data-striped');
  });

  it('striped=true sets data-striped on the root', () => {
    render(<BasicTable striped />);
    expect(screen.getByRole('table')).toHaveAttribute('data-striped', '');
  });

  it('density defaults to "comfortable"', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table')).toHaveAttribute('data-density', 'comfortable');
  });

  it('density="compact" sets data-density="compact" on the root', () => {
    render(<BasicTable density="compact" />);
    expect(screen.getByRole('table')).toHaveAttribute('data-density', 'compact');
  });

  it('Table.Row selected defaults to false (no data-selected attribute)', () => {
    render(<BasicTable />);
    const rows = screen.getAllByRole('row');
    expect(rows[1]).not.toHaveAttribute('data-selected');
  });

  it('Table.Row selected=true sets data-selected on the row', () => {
    render(
      <Table.Root aria-label="Selectable">
        <Table.Body>
          <Table.Row selected>
            <Table.Cell>Selected row</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Other row</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    const rows = screen.getAllByRole('row');
    expect(rows[0]).toHaveAttribute('data-selected', '');
    expect(rows[1]).not.toHaveAttribute('data-selected');
  });

  it('supports a row-selection checkbox by reusing the existing Checkbox component (no new checkbox implementation)', async () => {
    render(
      <Table.Root aria-label="Selectable with checkbox">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Checkbox aria-label="Select all rows" />
            </Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Checkbox aria-label="Select Apple" />
            </Table.Cell>
            <Table.Cell>Apple</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    const rowCheckbox = screen.getByRole('checkbox', { name: 'Select Apple' });
    expect(rowCheckbox).not.toBeChecked();
    await userEvent.click(rowCheckbox);
    expect(rowCheckbox).toBeChecked();
  });

  it('forwards ref to the underlying table element', () => {
    const ref = createRef<HTMLTableElement>();
    render(<Table.Root aria-label="Ref table" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it('forwards refs on Header/Body/Row/HeaderCell/Cell to their underlying DOM elements', () => {
    const theadRef = createRef<HTMLTableSectionElement>();
    const tbodyRef = createRef<HTMLTableSectionElement>();
    const trRef = createRef<HTMLTableRowElement>();
    const thRef = createRef<HTMLTableCellElement>();
    const tdRef = createRef<HTMLTableCellElement>();
    render(
      <Table.Root aria-label="Ref check">
        <Table.Header ref={theadRef}>
          <Table.Row ref={trRef}>
            <Table.HeaderCell ref={thRef}>Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body ref={tbodyRef}>
          <Table.Row>
            <Table.Cell ref={tdRef}>Apple</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(theadRef.current).toBeInstanceOf(HTMLTableSectionElement);
    expect(tbodyRef.current).toBeInstanceOf(HTMLTableSectionElement);
    expect(trRef.current).toBeInstanceOf(HTMLTableRowElement);
    expect(thRef.current).toBeInstanceOf(HTMLTableCellElement);
    expect(tdRef.current).toBeInstanceOf(HTMLTableCellElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<BasicTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations with striped, compact density, and a selected row with a checkbox', async () => {
    const { container } = render(
      <Table.Root aria-label="Full-feature table" striped density="compact">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Checkbox aria-label="Select all rows" />
            </Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Stock</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row selected>
            <Table.Cell>
              <Checkbox aria-label="Select Apple" defaultChecked />
            </Table.Cell>
            <Table.Cell>Apple</Table.Cell>
            <Table.Cell>12</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Checkbox aria-label="Select Banana" />
            </Table.Cell>
            <Table.Cell>Banana</Table.Cell>
            <Table.Cell>7</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
