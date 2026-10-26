'use client';

import { useState } from 'react';
import { Checkbox } from 'dial-react';

export function BasicCheckbox() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      <Checkbox defaultChecked aria-label="Accept terms" />
      Accept terms and conditions
    </label>
  );
}

export function IndeterminateCheckbox() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      <Checkbox indeterminate aria-label="Select all" />
      Select all (partially checked)
    </label>
  );
}

export function DisabledCheckbox() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      <Checkbox disabled aria-label="Disabled option" />
      Disabled option
    </label>
  );
}

export function CheckboxGroup() {
  const [children, setChildren] = useState({ apple: true, banana: false, cherry: false });
  const allChecked = children.apple && children.banana && children.cherry;
  const someChecked = children.apple || children.banana || children.cherry;

  const toggleAll = () => {
    const next = !allChecked;
    setChildren({ apple: next, banana: next, cherry: next });
  };
  const toggleApple = () => setChildren((prev) => ({ ...prev, apple: !prev.apple }));
  const toggleBanana = () => setChildren((prev) => ({ ...prev, banana: !prev.banana }));
  const toggleCherry = () => setChildren((prev) => ({ ...prev, cherry: !prev.cherry }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={toggleAll}
          aria-label="Select all fruits"
        />
        Select all
      </label>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-space-stack-sm)',
          paddingInlineStart: 'var(--ds-space-inset-lg)',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
          <Checkbox checked={children.apple} onChange={toggleApple} aria-label="apple" />
          Apple
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
          <Checkbox checked={children.banana} onChange={toggleBanana} aria-label="banana" />
          Banana
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
          <Checkbox checked={children.cherry} onChange={toggleCherry} aria-label="cherry" />
          Cherry
        </label>
      </div>
    </div>
  );
}
