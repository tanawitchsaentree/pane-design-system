import type { Meta, StoryObj } from '@storybook/react';
import { CONTROL_SIZE_TOKENS } from '../../types';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  argTypes: {
    size: { control: 'select', options: CONTROL_SIZE_TOKENS },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { 'aria-label': 'Name', placeholder: 'Jane Doe' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {CONTROL_SIZE_TOKENS.map((size) => (
        <Input key={size} aria-label={`Input ${size}`} size={size} placeholder={size} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
      <Input aria-label="Default" placeholder="Default" />
      <Input aria-label="Invalid" placeholder="Invalid" invalid />
      <Input aria-label="Disabled" placeholder="Disabled" disabled />
      <Input aria-label="Read-only" defaultValue="Read-only value" readOnly />
    </div>
  ),
};

export const WithAdornments: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
      <Input aria-label="Price" leftElement={<span>$</span>} placeholder="0.00" />
      <Input aria-label="Weight" rightElement={<span>kg</span>} placeholder="0" />
    </div>
  ),
};

export const Playground: Story = {
  args: { 'aria-label': 'Playground', placeholder: 'Type here', size: 'md', invalid: false, disabled: false, readOnly: false },
};
