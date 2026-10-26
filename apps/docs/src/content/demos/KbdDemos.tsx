'use client';

import { Kbd } from 'dial-react';

export function BasicKbd() {
  return <Kbd>Esc</Kbd>;
}

export function ChordedKbd() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>K</Kbd>
    </div>
  );
}

export function MultiKeyShortcut() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      <Kbd>Cmd</Kbd>
      <span>+</span>
      <Kbd>Shift</Kbd>
      <span>+</span>
      <Kbd>K</Kbd>
    </div>
  );
}
