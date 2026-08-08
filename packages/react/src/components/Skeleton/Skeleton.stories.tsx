import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: { control: 'select', options: ['text', 'circle', 'rect'] },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 240 }}>
      <Skeleton variant="text" />
      <Skeleton variant="circle" />
      <Skeleton variant="rect" />
    </div>
  ),
};

export const CardPlaceholder: Story = {
  name: 'Composed card placeholder',
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 320 }}>
      <Skeleton variant="circle" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="90%" />
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: { variant: 'text' },
};
