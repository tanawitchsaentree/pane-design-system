'use client';

import { useState } from 'react';
import { Listbox } from 'dial-react';
import type { Key } from 'dial-react';

export function BasicListbox() {
  return (
    <Listbox aria-label="Favorite fruit" defaultSelectedKeys={new Set(['apple'])}>
      <Listbox.Item key="apple">Apple</Listbox.Item>
      <Listbox.Item key="banana">Banana</Listbox.Item>
      <Listbox.Item key="cherry">Cherry</Listbox.Item>
    </Listbox>
  );
}

export function ListboxMultiple() {
  const [selectedKeys, setSelectedKeys] = useState<ReadonlySet<Key>>(new Set(['red']));
  return (
    <Listbox
      aria-label="Colors"
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      disabledKeys={['green']}
    >
      <Listbox.Item key="red">Red</Listbox.Item>
      <Listbox.Item key="green">Green (disabled)</Listbox.Item>
      <Listbox.Item key="blue">Blue</Listbox.Item>
    </Listbox>
  );
}

export function ListboxMultiSelectSummary() {
  const [selectedKeys, setSelectedKeys] = useState<ReadonlySet<Key>>(new Set(['th', 'jp']));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <Listbox
        aria-label="Countries to visit"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <Listbox.Item key="th">Thailand</Listbox.Item>
        <Listbox.Item key="jp">Japan</Listbox.Item>
        <Listbox.Item key="us">United States</Listbox.Item>
        <Listbox.Item key="de">Germany</Listbox.Item>
      </Listbox>
      <div>{selectedKeys.size} selected</div>
    </div>
  );
}

export function ListboxWithSections() {
  return (
    <Listbox aria-label="Countries">
      <Listbox.Section title="Recent">
        <Listbox.Item key="th">Thailand</Listbox.Item>
        <Listbox.Item key="jp">Japan</Listbox.Item>
      </Listbox.Section>
      <Listbox.Section title="All countries">
        <Listbox.Item key="us">United States</Listbox.Item>
        <Listbox.Item key="de">Germany</Listbox.Item>
      </Listbox.Section>
    </Listbox>
  );
}
