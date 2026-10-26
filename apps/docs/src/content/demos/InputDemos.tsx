'use client';

import { Input } from 'dial-react';

export function BasicInput() {
  return <Input defaultValue="" placeholder="Enter your name" />;
}

export function InputSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-inline-sm)' }}>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
      <Input size="xl" placeholder="Extra large" />
    </div>
  );
}

export function InvalidInput() {
  return <Input invalid defaultValue="not-an-email" aria-label="Email" />;
}

export function InputWithElements() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-inline-sm)' }}>
      <Input leftElement="$" placeholder="0.00" />
      <Input rightElement="kg" placeholder="Weight" />
    </div>
  );
}

export function ReadOnlyInput() {
  return <Input readOnly defaultValue="ORD-48213" aria-label="Order number" />;
}
