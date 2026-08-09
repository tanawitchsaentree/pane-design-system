import type { Meta, StoryObj } from '@storybook/react';
import { AVATAR_SIZE_TOKENS } from '../../types';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: 'select', options: AVATAR_SIZE_TOKENS },
    shape: { control: 'select', options: ['circle', 'square'] },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithFallback: Story = {
  parameters: { docs: { description: { story: 'Renders initials ("JD") as a fallback when no image src is provided.' } } },
  args: { fallback: 'JD', alt: 'Jane Doe' },
};

export const BrokenImageFallsBack: Story = {
  name: 'Broken src falls back to initials',
  parameters: { docs: { description: { story: 'Passes an invalid image src and shows the Avatar falling back to the "JD" initials on load error.' } } },
  args: { src: 'https://broken.invalid/does-not-exist.jpg', alt: 'Jane Doe', fallback: 'JD' },
};

export const AllSizes: Story = {
  parameters: { docs: { description: { story: 'Renders one Avatar per size token in AVATAR_SIZE_TOKENS side by side.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {AVATAR_SIZE_TOKENS.map((size) => (
        <Avatar key={size} size={size} fallback="JD" alt="Jane Doe" />
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  parameters: { docs: { description: { story: 'Compares the "circle" and "square" shape options side by side.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar shape="circle" fallback="JD" alt="Jane Doe" />
      <Avatar shape="square" fallback="JD" alt="Jane Doe" />
    </div>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { size: 'md', shape: 'circle', fallback: 'JD', alt: 'Jane Doe' },
};
