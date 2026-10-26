'use client';

import { Switch } from 'dial-react';

export function BasicSwitch() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      <Switch defaultChecked aria-label="Dark mode" />
      Dark mode
    </label>
  );
}

export function OffSwitch() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      <Switch aria-label="Notifications" />
      Notifications
    </label>
  );
}

export function DisabledSwitch() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      <Switch disabled aria-label="Disabled setting" />
      Disabled setting
    </label>
  );
}
