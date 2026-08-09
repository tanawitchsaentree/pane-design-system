import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Default off switch — a checkbox input with role="switch" so assistive tech announces it as a toggle, not a checkbox.' } } },
  args: { 'aria-label': 'Notifications' },
};

export const States: Story = {
  parameters: { docs: { description: { story: 'Off, on, disabled-off, and disabled-on side by side — the thumb physically moves inset-inline-start as a non-color state cue.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Switch aria-label="Off" />
      <Switch aria-label="On" defaultChecked />
      <Switch aria-label="Disabled off" disabled />
      <Switch aria-label="Disabled on" disabled defaultChecked />
    </div>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { 'aria-label': 'Playground switch', disabled: false },
};
