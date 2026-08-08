import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';
import { Box } from '../Box/Box';

const block = (label: string) => (
  <Box
    key={label}
    style={{ background: 'var(--ds-color-action-neutral-default)', padding: 8, borderRadius: 8 }}
  >
    {label}
  </Box>
);

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  argTypes: {
    direction: { control: 'radio', options: ['vertical', 'horizontal'] },
    gap: { control: 'select', options: ['100', '200', '300', '400', '600'] },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  args: { direction: 'vertical', gap: '300' },
  render: (args) => <Stack {...args}>{['One', 'Two', 'Three'].map(block)}</Stack>,
};

export const Horizontal: Story = {
  args: { direction: 'horizontal', gap: '200' },
  render: (args) => <Stack {...args}>{['One', 'Two', 'Three'].map(block)}</Stack>,
};

export const DefaultGap: Story = {
  name: 'Default gap (space.300)',
  render: () => <Stack>{['One', 'Two'].map(block)}</Stack>,
};

export const Playground: Story = {
  args: { direction: 'vertical', gap: '300' },
  render: (args) => <Stack {...args}>{['One', 'Two', 'Three'].map(block)}</Stack>,
};
