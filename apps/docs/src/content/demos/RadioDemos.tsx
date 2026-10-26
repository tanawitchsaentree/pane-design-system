'use client';

import { Fieldset, Radio } from 'dial-react';

export function BasicRadioGroup() {
  return (
    <Fieldset legend="Shipping speed">
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Radio name="shipping-demo" value="standard" defaultChecked />
        Standard (5-7 days)
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Radio name="shipping-demo" value="express" />
        Express (1-2 days)
      </label>
    </Fieldset>
  );
}

export function DisabledRadio() {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      <Radio name="disabled-demo" disabled />
      Disabled option
    </label>
  );
}

export function PaymentRadioGroup() {
  return (
    <Fieldset legend="Payment method">
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Radio name="payment" value="card" defaultChecked />
        Credit card
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Radio name="payment" value="paypal" />
        PayPal
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <Radio name="payment" value="crypto" disabled />
        Cryptocurrency (unavailable in your region)
      </label>
    </Fieldset>
  );
}
