'use client';

import { useState } from 'react';
import { Button, FormField, RadioCards } from 'dial-react';

export function BasicRadioCards() {
  const [value, setValue] = useState('starter');
  return (
    <RadioCards name="plan" aria-label="Choose a plan" value={value} onChange={setValue}>
      <RadioCards.Item value="starter">Starter — $9/mo</RadioCards.Item>
      <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
      <RadioCards.Item value="enterprise">Enterprise — Contact us</RadioCards.Item>
    </RadioCards>
  );
}

export function RadioCardsVertical() {
  return (
    <RadioCards name="tier-vertical" aria-label="Choose a tier" orientation="vertical" defaultValue="pro">
      <RadioCards.Item value="starter">Starter</RadioCards.Item>
      <RadioCards.Item value="pro">Pro</RadioCards.Item>
      <RadioCards.Item value="enterprise" disabled>
        Enterprise (disabled)
      </RadioCards.Item>
    </RadioCards>
  );
}

export function DisabledRadioCards() {
  return (
    <RadioCards name="plan-disabled" aria-label="Choose a plan" disabled defaultValue="starter">
      <RadioCards.Item value="starter">Starter — $9/mo</RadioCards.Item>
      <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
      <RadioCards.Item value="enterprise">Enterprise — Contact us</RadioCards.Item>
    </RadioCards>
  );
}

export function RequiredRadioCards() {
  return (
    <RadioCards name="plan-required" aria-label="Choose a plan" required>
      <RadioCards.Item value="starter">Starter — $9/mo</RadioCards.Item>
      <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
      <RadioCards.Item value="enterprise">Enterprise — Contact us</RadioCards.Item>
    </RadioCards>
  );
}

export function InvalidRadioCards() {
  return (
    <RadioCards name="plan-invalid" aria-label="Choose a plan" invalid>
      <RadioCards.Item value="starter">Starter — $9/mo</RadioCards.Item>
      <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
      <RadioCards.Item value="enterprise">Enterprise — Contact us</RadioCards.Item>
    </RadioCards>
  );
}

export function RadioCardsInFormField() {
  return (
    <FormField label="Choose a plan" required helperText="You can change this later in billing settings.">
      <RadioCards name="plan-form-field">
        <RadioCards.Item value="starter">Starter — $9/mo</RadioCards.Item>
        <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
        <RadioCards.Item value="enterprise">Enterprise — Contact us</RadioCards.Item>
      </RadioCards>
    </FormField>
  );
}

export function RadioCardsCheckoutForm() {
  const [plan, setPlan] = useState('pro');
  const [billing, setBilling] = useState('monthly');
  return (
    <form
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-md)' }}
      onSubmit={(e) => e.preventDefault()}
    >
      <FormField label="Plan">
        <RadioCards name="checkout-plan" value={plan} onChange={setPlan}>
          <RadioCards.Item value="starter">Starter — $9/mo</RadioCards.Item>
          <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
          <RadioCards.Item value="enterprise">Enterprise — Contact us</RadioCards.Item>
        </RadioCards>
      </FormField>
      <FormField label="Billing cycle">
        <RadioCards name="checkout-billing" orientation="vertical" value={billing} onChange={setBilling}>
          <RadioCards.Item value="monthly">Monthly</RadioCards.Item>
          <RadioCards.Item value="annual">Annual — 2 months free</RadioCards.Item>
        </RadioCards>
      </FormField>
      <Button type="submit">Continue</Button>
    </form>
  );
}
