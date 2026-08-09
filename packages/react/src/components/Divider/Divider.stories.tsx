import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';
import { Stack } from '../Stack/Stack';

const meta: Meta<typeof Divider> = {
  title: 'Layout/Divider',
  component: Divider,
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    variant: { control: 'radio', options: ['hairline', 'hairline-strong'] },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  parameters: { docs: { description: { story: 'Renders a horizontal hairline divider between two stacked sections.' } } },
  args: { orientation: 'horizontal', variant: 'hairline' },
  render: (args) => (
    <Stack gap="200" style={{ width: 240 }}>
      <span>Section A</span>
      <Divider {...args} />
      <span>Section B</span>
    </Stack>
  ),
};

export const HorizontalStrong: Story = {
  parameters: { docs: { description: { story: 'Renders a horizontal divider using the higher-contrast "hairline-strong" variant.' } } },
  args: { orientation: 'horizontal', variant: 'hairline-strong' },
  render: (args) => (
    <Stack gap="200" style={{ width: 240 }}>
      <span>Section A</span>
      <Divider {...args} />
      <span>Section B</span>
    </Stack>
  ),
};

export const Vertical: Story = {
  parameters: { docs: { description: { story: 'Renders a vertical hairline divider between two inline items in a flex row.' } } },
  args: { orientation: 'vertical', variant: 'hairline' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', height: 48, gap: 12 }}>
      <span>Left</span>
      <Divider {...args} />
      <span>Right</span>
    </div>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { orientation: 'horizontal', variant: 'hairline' },
  render: (args) => (
    <Stack gap="200" style={{ width: 240 }}>
      <span>Above</span>
      <Divider {...args} />
      <span>Below</span>
    </Stack>
  ),
};
