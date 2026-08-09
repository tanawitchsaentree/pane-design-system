import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioCards } from './RadioCards';
import { FormField } from '../FormField/FormField';

const meta: Meta<typeof RadioCards> = {
  title: 'Selection/RadioCards',
  component: RadioCards,
};

export default meta;
type Story = StoryObj<typeof RadioCards>;

export const Default: Story = {
  args: { name: 'plan-default', 'aria-label': 'Plan', defaultValue: 'pro' },
  render: (args) => (
    <RadioCards {...args}>
      <RadioCards.Item value="basic">Basic — $9/mo</RadioCards.Item>
      <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
      <RadioCards.Item value="enterprise">Enterprise — $99/mo</RadioCards.Item>
    </RadioCards>
  ),
};

/**
 * Controlled — verifies `value`/`onChange` (D-024 Standalone Control vocabulary) drives the UI
 * the same way `defaultValue` does uncontrolled.
 */
export const Controlled: Story = {
  render: () => {
    function ControlledRadioCards() {
      const [value, setValue] = useState('pro');
      return (
        <RadioCards name="plan-controlled" aria-label="Plan (controlled)" value={value} onChange={setValue}>
          <RadioCards.Item value="basic">Basic — $9/mo</RadioCards.Item>
          <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
          <RadioCards.Item value="enterprise">Enterprise — $99/mo</RadioCards.Item>
        </RadioCards>
      );
    }
    return <ControlledRadioCards />;
  },
};

export const Vertical: Story = {
  args: { name: 'plan-vertical', 'aria-label': 'Plan', orientation: 'vertical', defaultValue: 'basic' },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <RadioCards {...args}>
        <RadioCards.Item value="basic">Basic — $9/mo</RadioCards.Item>
        <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
        <RadioCards.Item value="enterprise">Enterprise — $99/mo</RadioCards.Item>
      </RadioCards>
    </div>
  ),
};

export const DisabledGroup: Story = {
  args: { name: 'plan-disabled-group', 'aria-label': 'Plan', disabled: true, defaultValue: 'pro' },
  render: (args) => (
    <RadioCards {...args}>
      <RadioCards.Item value="basic">Basic — $9/mo</RadioCards.Item>
      <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
      <RadioCards.Item value="enterprise">Enterprise — $99/mo</RadioCards.Item>
    </RadioCards>
  ),
};

export const DisabledItem: Story = {
  args: { name: 'plan-disabled-item', 'aria-label': 'Plan', defaultValue: 'basic' },
  render: (args) => (
    <RadioCards {...args}>
      <RadioCards.Item value="basic">Basic — $9/mo</RadioCards.Item>
      <RadioCards.Item value="pro" disabled>
        Pro — $29/mo (waitlist)
      </RadioCards.Item>
      <RadioCards.Item value="enterprise">Enterprise — $99/mo</RadioCards.Item>
    </RadioCards>
  ),
};

/**
 * InFormField — RadioCards nested inside `FormField`: same wiring Listbox/Input/Checkbox get
 * (`aria-labelledby` pointing at `FormField`'s generated label id), so no `aria-label` is needed
 * here either.
 */
export const InFormField: Story = {
  render: () => (
    <FormField label="Choose a plan">
      <RadioCards name="plan-in-form-field">
        <RadioCards.Item value="basic">Basic — $9/mo</RadioCards.Item>
        <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
        <RadioCards.Item value="enterprise">Enterprise — $99/mo</RadioCards.Item>
      </RadioCards>
    </FormField>
  ),
};

export const Playground: Story = {
  args: { name: 'plan-playground', 'aria-label': 'Plan', orientation: 'horizontal', disabled: false },
  render: (args) => (
    <RadioCards {...args}>
      <RadioCards.Item value="basic">Basic — $9/mo</RadioCards.Item>
      <RadioCards.Item value="pro">Pro — $29/mo</RadioCards.Item>
      <RadioCards.Item value="enterprise">Enterprise — $99/mo</RadioCards.Item>
    </RadioCards>
  ),
};
