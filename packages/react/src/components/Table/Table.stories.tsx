import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import { Checkbox } from '../Checkbox/Checkbox';

const meta: Meta<typeof Table.Root> = {
  title: 'Data Display/Table',
  component: Table.Root,
};

export default meta;
type Story = StoryObj<typeof Table.Root>;

const FRUITS = [
  { name: 'Apple', stock: 12, price: '$1.20' },
  { name: 'Banana', stock: 7, price: '$0.50' },
  { name: 'Cherry', stock: 34, price: '$4.80' },
  { name: 'Date', stock: 0, price: '$6.10' },
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic table — native <table>/<thead>/<tbody>/<tr>/<th>/<td>, no sorting/filtering/virtualization (see packages/spec/table.md for the scope split against W9 DataGrid).',
      },
    },
  },
  render: () => (
    <Table.Root aria-label="Fruit inventory">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Stock</Table.HeaderCell>
          <Table.HeaderCell>Price</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {FRUITS.map((fruit) => (
          <Table.Row key={fruit.name}>
            <Table.Cell>{fruit.name}</Table.Cell>
            <Table.Cell>{fruit.stock}</Table.Cell>
            <Table.Cell>{fruit.price}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};

export const Striped: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'striped alternates row background for readability — a pure visual aid, not a state, so it needs no non-color cue of its own (see Table.tsx module doc).',
      },
    },
  },
  render: () => (
    <Table.Root aria-label="Fruit inventory (striped)" striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Stock</Table.HeaderCell>
          <Table.HeaderCell>Price</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {FRUITS.map((fruit) => (
          <Table.Row key={fruit.name}>
            <Table.Cell>{fruit.name}</Table.Cell>
            <Table.Cell>{fruit.stock}</Table.Cell>
            <Table.Cell>{fruit.price}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};

export const CompactDensity: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'density="compact" tightens cell block padding (D-010\'s reserved compact step — first real consumer in the system). Default is "comfortable".',
      },
    },
  },
  render: () => (
    <Table.Root aria-label="Fruit inventory (compact)" density="compact">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Stock</Table.HeaderCell>
          <Table.HeaderCell>Price</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {FRUITS.map((fruit) => (
          <Table.Row key={fruit.name}>
            <Table.Cell>{fruit.name}</Table.Cell>
            <Table.Cell>{fruit.stock}</Table.Cell>
            <Table.Cell>{fruit.price}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};

/**
 * SelectableRows — row-selection checkbox reuses the existing `Checkbox` component as-is (Reuse
 * Check, Table.tsx module doc) rather than a new implementation. `Table.Row`'s `selected` prop
 * drives two independent non-color cues (background tint + left border accent).
 */
export const SelectableRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Row-selection checkbox reuses the existing Checkbox component. Table.Row selected renders two independent non-color cues (background tint + left border accent), never color alone.',
      },
    },
  },
  render: () => {
    function SelectableTable() {
      const [selected, setSelected] = useState<Set<string>>(new Set(['Banana']));

      const toggle = (name: string) => {
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(name)) next.delete(name);
          else next.add(name);
          return next;
        });
      };

      return (
        <Table.Root aria-label="Fruit inventory (selectable)">
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
            {FRUITS.map((fruit) => (
              <Table.Row key={fruit.name} selected={selected.has(fruit.name)}>
                <Table.Cell>
                  <Checkbox
                    aria-label={`Select ${fruit.name}`}
                    checked={selected.has(fruit.name)}
                    onChange={() => toggle(fruit.name)}
                  />
                </Table.Cell>
                <Table.Cell>{fruit.name}</Table.Cell>
                <Table.Cell>{fruit.stock}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      );
    }
    return <SelectableTable />;
  },
};

export const RowHeaderScope: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Table.HeaderCell accepts scope="row" for a row-header column (default is scope="col" for the common top header-row case).',
      },
    },
  },
  render: () => (
    <Table.Root aria-label="Fruit inventory (row headers)">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Stock</Table.HeaderCell>
          <Table.HeaderCell>Price</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {FRUITS.map((fruit) => (
          <Table.Row key={fruit.name}>
            <Table.HeaderCell scope="row">{fruit.name}</Table.HeaderCell>
            <Table.Cell>{fruit.stock}</Table.Cell>
            <Table.Cell>{fruit.price}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};

export const Playground: Story = {
  parameters: {
    docs: {
      description: { story: 'Interactive playground — adjust props via the Controls panel below.' },
    },
  },
  args: { striped: false, density: 'comfortable' },
  render: (args) => (
    <Table.Root aria-label="Playground table" {...args}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Stock</Table.HeaderCell>
          <Table.HeaderCell>Price</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {FRUITS.map((fruit) => (
          <Table.Row key={fruit.name}>
            <Table.Cell>{fruit.name}</Table.Cell>
            <Table.Cell>{fruit.stock}</Table.Cell>
            <Table.Cell>{fruit.price}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};
