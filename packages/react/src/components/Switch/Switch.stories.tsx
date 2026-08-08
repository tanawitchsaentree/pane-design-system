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
  args: { 'aria-label': 'Notifications' },
};

export const States: Story = {
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
  args: { 'aria-label': 'Playground switch', disabled: false },
};
