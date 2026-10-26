'use client';

import { Table } from 'dial-react';

export function BasicTable() {
  return (
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
        <Table.Row>
          <Table.Cell>Banana</Table.Cell>
          <Table.Cell>34</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cherry</Table.Cell>
          <Table.Cell>8</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

export function StripedCompactTable() {
  return (
    <Table.Root aria-label="Fruit inventory (striped, compact)" striped density="compact">
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
          <Table.Cell>34</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cherry</Table.Cell>
          <Table.Cell>8</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

export function SelectedRowTable() {
  return (
    <Table.Root aria-label="Fruit inventory (selected row)">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Stock</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row selected>
          <Table.Cell>Apple</Table.Cell>
          <Table.Cell>12</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Banana</Table.Cell>
          <Table.Cell>34</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
