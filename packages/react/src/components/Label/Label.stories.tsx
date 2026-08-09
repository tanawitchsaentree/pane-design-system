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
  parameters: { docs: { description: { story: 'Plain label with htmlFor pointing at a control id, no required indicator.' } } },
  args: { htmlFor: 'story-default', children: 'Label text' },
};

export const Required: Story = {
  parameters: { docs: { description: { story: 'Shows the required indicator — a visible aria-hidden asterisk plus visually-hidden "(required)" text for screen readers.' } } },
  args: { htmlFor: 'story-required', children: 'Email', required: true },
};

export const WithInput: Story = {
  parameters: { docs: { description: { story: 'Pairs a required Label with a real <input> via matching htmlFor/id to show the native label association in context.' } } },
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
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { htmlFor: 'story-playground', children: 'Playground label', required: false },
};
