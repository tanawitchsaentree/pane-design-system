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

export const Square: Story = { args: { ratio: 'square' }, render: (args) => <AspectRatio {...args} style={{ maxWidth: 240 }}>{filler}</AspectRatio> };
export const Video: Story = { args: { ratio: 'video' }, render: (args) => <AspectRatio {...args} style={{ maxWidth: 320 }}>{filler}</AspectRatio> };
export const Photo: Story = { args: { ratio: 'photo' }, render: (args) => <AspectRatio {...args} style={{ maxWidth: 320 }}>{filler}</AspectRatio> };
export const Portrait: Story = { args: { ratio: 'portrait' }, render: (args) => <AspectRatio {...args} style={{ maxWidth: 200 }}>{filler}</AspectRatio> };
export const Golden: Story = { args: { ratio: 'golden' }, render: (args) => <AspectRatio {...args} style={{ maxWidth: 320 }}>{filler}</AspectRatio> };
export const NumericEscape: Story = {
  name: 'Numeric ratio (escape hatch, not a preset token)',
  args: { ratio: 2.5 },
  render: (args) => <AspectRatio {...args} style={{ maxWidth: 320 }}>{filler}</AspectRatio>,
};

export const Playground: Story = {
  args: { ratio: 'video' },
  render: (args) => <AspectRatio {...args} style={{ maxWidth: 320 }}>{filler}</AspectRatio>,
};
