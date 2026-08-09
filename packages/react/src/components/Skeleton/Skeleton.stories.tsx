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

export const Default: Story = {
  parameters: { docs: { description: { story: 'Renders a Skeleton with default props (no variant specified).' } } },
};

export const AllVariants: Story = {
  parameters: { docs: { description: { story: 'Stacks the "text", "circle", and "rect" variant shapes vertically for comparison.' } } },
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
  parameters: { docs: { description: { story: 'Composes a circle avatar skeleton with two text-line skeletons of different widths to mimic a loading card.' } } },
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
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { variant: 'text' },
};
