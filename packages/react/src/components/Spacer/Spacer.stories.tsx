import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from './Spacer';
import { Flex } from '../Flex/Flex';
import { Box } from '../Box/Box';

const chip = (label: string) => (
  <Box key={label} style={{ background: 'var(--ds-color-action-neutral-default)', padding: 8 }}>
    {label}
  </Box>
);

const meta: Meta<typeof Spacer> = {
  title: 'Layout/Spacer',
  component: Spacer,
  argTypes: {
    size: { control: 'select', options: [undefined, '100', '200', '300', '400', '600'] },
  },
};

export default meta;
type Story = StoryObj<typeof Spacer>;

export const GrowToFill: Story = {
  name: 'No size — grows to fill (flex: 1)',
  parameters: { docs: { description: { story: 'With no size prop, the Spacer grows (flex: 1) to push "Left" and "Right" apart to the edges of the row.' } } },
  render: () => (
    <Flex direction="row" style={{ width: 320, background: 'var(--ds-color-surface-inset)' }}>
      {chip('Left')}
      <Spacer />
      {chip('Right')}
    </Flex>
  ),
};

export const FixedSize: Story = {
  name: 'Fixed size (space.400)',
  parameters: { docs: { description: { story: 'With size="400", the Spacer inserts a fixed-width gap between "A" and "B" instead of growing.' } } },
  args: { size: '400' },
  render: (args) => (
    <Flex direction="row" style={{ background: 'var(--ds-color-surface-inset)' }}>
      {chip('A')}
      <Spacer {...args} />
      {chip('B')}
    </Flex>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { size: undefined },
  render: (args) => (
    <Flex direction="row" style={{ width: 320, background: 'var(--ds-color-surface-inset)' }}>
      {chip('Left')}
      <Spacer {...args} />
      {chip('Right')}
    </Flex>
  ),
};
