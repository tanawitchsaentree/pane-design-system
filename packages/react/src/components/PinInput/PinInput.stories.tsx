import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CONTROL_SIZE_TOKENS } from '../../types';
import { PinInput } from './PinInput';

const meta: Meta<typeof PinInput> = {
  title: 'Forms/PinInput',
  component: PinInput,
  argTypes: {
    size: { control: 'select', options: CONTROL_SIZE_TOKENS },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    mask: { control: 'boolean' },
    numericOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PinInput>;

export const Default: Story = {
  args: { length: 6, 'aria-label': '6-digit verification code' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {CONTROL_SIZE_TOKENS.map((size) => (
        <PinInput key={size} length={4} size={size} aria-label={`Code ${size}`} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <PinInput length={4} aria-label="Default" />
      <PinInput length={4} invalid aria-label="Invalid" defaultValue="12" />
      <PinInput length={4} disabled aria-label="Disabled" defaultValue="12" />
    </div>
  ),
};

export const Masked: Story = {
  args: { length: 6, mask: true, 'aria-label': 'Masked code' },
};

export const Controlled: Story = {
  render: () => {
    function ControlledDemo() {
      const [value, setValue] = useState('');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PinInput length={6} value={value} onChange={setValue} aria-label="Controlled code" />
          <span>Value: {value || '(empty)'}</span>
        </div>
      );
    }
    return <ControlledDemo />;
  },
};

export const Playground: Story = {
  args: { length: 6, 'aria-label': 'Playground code', disabled: false, invalid: false, mask: false, numericOnly: true },
};
