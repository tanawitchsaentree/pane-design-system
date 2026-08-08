import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Forms/Radio',
  component: Radio,
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Radio aria-label="Option A" name="default-story" value="a" defaultChecked />
      <Radio aria-label="Option B" name="default-story" value="b" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Radio aria-label="Unchecked" name="states" value="unchecked" />
      <Radio aria-label="Checked" name="states-2" value="checked" defaultChecked />
      <Radio aria-label="Disabled" name="states-3" value="disabled" disabled />
      <Radio aria-label="Disabled checked" name="states-4" value="disabled-checked" disabled defaultChecked />
    </div>
  ),
};

export const Playground: Story = {
  args: { 'aria-label': 'Playground radio', name: 'playground', disabled: false },
};
