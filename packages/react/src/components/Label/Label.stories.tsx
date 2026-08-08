import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Forms/Label',
  component: Label,
  argTypes: {
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { htmlFor: 'story-default', children: 'Label text' },
};

export const Required: Story = {
  args: { htmlFor: 'story-required', children: 'Email', required: true },
};

export const WithInput: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Label htmlFor="story-with-input" required>
        Full name
      </Label>
      <input id="story-with-input" />
    </div>
  ),
};

export const Playground: Story = {
  args: { htmlFor: 'story-playground', children: 'Playground label', required: false },
};
