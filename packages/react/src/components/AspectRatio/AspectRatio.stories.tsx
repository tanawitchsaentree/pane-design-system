import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './AspectRatio';

const meta: Meta<typeof AspectRatio> = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  argTypes: {
    ratio: {
      control: 'select',
      options: ['square', 'video', 'photo', 'portrait', 'golden'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

const filler = (
  <div style={{ background: 'var(--ds-color-action-neutral-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    content
  </div>
);

export const Square: Story = {
  parameters: { docs: { description: { story: 'Locks content to a 1:1 square box using the "square" ratio preset.' } } },
  args: { ratio: 'square' },
  render: (args) => <AspectRatio {...args} style={{ maxWidth: 240 }}>{filler}</AspectRatio>,
};
export const Video: Story = {
  parameters: { docs: { description: { story: 'Locks content to a 16:9 widescreen box using the "video" ratio preset.' } } },
  args: { ratio: 'video' },
  render: (args) => <AspectRatio {...args} style={{ maxWidth: 320 }}>{filler}</AspectRatio>,
};
export const Photo: Story = {
  parameters: { docs: { description: { story: 'Locks content to a 4:3 box using the "photo" ratio preset.' } } },
  args: { ratio: 'photo' },
  render: (args) => <AspectRatio {...args} style={{ maxWidth: 320 }}>{filler}</AspectRatio>,
};
export const Portrait: Story = {
  parameters: { docs: { description: { story: 'Locks content to a tall 3:4 box using the "portrait" ratio preset.' } } },
  args: { ratio: 'portrait' },
  render: (args) => <AspectRatio {...args} style={{ maxWidth: 200 }}>{filler}</AspectRatio>,
};
export const Golden: Story = {
  parameters: { docs: { description: { story: 'Locks content to the golden ratio (~1.618:1) box using the "golden" ratio preset.' } } },
  args: { ratio: 'golden' },
  render: (args) => <AspectRatio {...args} style={{ maxWidth: 320 }}>{filler}</AspectRatio>,
};
export const NumericEscape: Story = {
  name: 'Numeric ratio (escape hatch, not a preset token)',
  parameters: { docs: { description: { story: 'Passes a raw numeric ratio (2.5) as an escape hatch for non-preset aspect ratios.' } } },
  args: { ratio: 2.5 },
  render: (args) => <AspectRatio {...args} style={{ maxWidth: 320 }}>{filler}</AspectRatio>,
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { ratio: 'video' },
  render: (args) => <AspectRatio {...args} style={{ maxWidth: 320 }}>{filler}</AspectRatio>,
};
