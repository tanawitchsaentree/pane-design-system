'use client';

import { Fieldset, Radio, Checkbox } from 'dial-react';

export function BasicFieldset() {
  return (
    <Fieldset legend="Notification method">
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Radio name="notify-demo" value="email" defaultChecked />
        Email
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Radio name="notify-demo" value="sms" />
        SMS
      </label>
    </Fieldset>
  );
}

export function DisabledFieldset() {
  return (
    <Fieldset legend="Notification method (disabled)" disabled>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Radio name="notify-demo-disabled" value="email" defaultChecked />
        Email
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Radio name="notify-demo-disabled" value="sms" />
        SMS
      </label>
    </Fieldset>
  );
}

export function CheckboxGroupFieldset() {
  return (
    <Fieldset legend="Interests">
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Checkbox defaultChecked aria-label="Design" />
        Design
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Checkbox aria-label="Engineering" />
        Engineering
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Checkbox aria-label="Product" />
        Product
      </label>
    </Fieldset>
  );
}

export function MultipleFieldsetsForm() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-lg)' }}>
      <Fieldset legend="Contact preference">
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
          <Radio name="contact-pref" value="email" defaultChecked />
          Email
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
          <Radio name="contact-pref" value="phone" />
          Phone
        </label>
      </Fieldset>
      <Fieldset legend="Topics">
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
          <Checkbox defaultChecked aria-label="Billing" />
          Billing
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
          <Checkbox aria-label="Security" />
          Security
        </label>
      </Fieldset>
    </div>
  );
}
