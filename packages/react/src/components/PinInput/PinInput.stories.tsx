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
  parameters: { docs: { description: { story: 'Default 6-cell code input at the md size, empty, with typing auto-advancing focus to the next cell.' } } },
  args: { length: 6, 'aria-label': '6-digit verification code' },
};

export const AllSizes: Story = {
  parameters: { docs: { description: { story: 'Renders a 4-cell PinInput at every size.control.* t-shirt size stacked for visual comparison.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {CONTROL_SIZE_TOKENS.map((size) => (
        <PinInput key={size} length={4} size={size} aria-label={`Code ${size}`} />
      ))}
    </div>
  ),
};

export const States: Story = {
  parameters: { docs: { description: { story: 'Default, invalid, and disabled 4-cell codes side by side, the latter two pre-filled to show partial-value rendering.' } } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <PinInput length={4} aria-label="Default" />
      <PinInput length={4} invalid aria-label="Invalid" defaultValue="12" />
      <PinInput length={4} disabled aria-label="Disabled" defaultValue="12" />
    </div>
  ),
};

export const Masked: Story = {
  parameters: { docs: { description: { story: 'Sets mask to render each cell as type="password", hiding digits like an OTP-over-shoulder privacy field.' } } },
  args: { length: 6, mask: true, 'aria-label': 'Masked code' },
};

export const Controlled: Story = {
  parameters: { docs: { description: { story: 'Drives PinInput with external value/onChange state and echoes the current joined value below the cells.' } } },
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
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { length: 6, 'aria-label': 'Playground code', disabled: false, invalid: false, mask: false, numericOnly: true },
};
