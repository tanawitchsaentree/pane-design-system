import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  argTypes: {
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Default unchecked checkbox with an accessible label, no other state applied.' } } },
  args: { 'aria-label': 'Accept terms' },
};

export const States: Story = {
  parameters: { docs: { description: { story: 'Unchecked, checked, indeterminate, disabled, and disabled-checked side by side — indeterminate is synced imperatively onto the native input since it is a DOM-only property, not a real HTML attribute.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Checkbox aria-label="Unchecked" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Indeterminate" indeterminate readOnly checked={false} />
      <Checkbox aria-label="Disabled" disabled />
      <Checkbox aria-label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { 'aria-label': 'Playground checkbox', disabled: false, indeterminate: false },
};
