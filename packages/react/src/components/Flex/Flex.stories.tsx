import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from './Flex';
import { Box } from '../Box/Box';

const swatch = (label: string) => (
  <Box
    key={label}
    style={{ background: 'var(--ds-color-action-neutral-default)', padding: 8, borderRadius: 8 }}
  >
    {label}
  </Box>
);

const meta: Meta<typeof Flex> = {
  title: 'Layout/Flex',
  component: Flex,
  argTypes: {
    direction: { control: 'radio', options: ['row', 'column'] },
    gap: { control: 'select', options: ['0', '100', '200', '300', '400', '500', '600'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    wrap: { control: 'radio', options: ['nowrap', 'wrap', 'wrap-reverse'] },
  },
};

export default meta;
type Story = StoryObj<typeof Flex>;

export const Row: Story = {
  args: { direction: 'row', gap: '300' },
  render: (args) => <Flex {...args}>{['A', 'B', 'C'].map(swatch)}</Flex>,
};

export const Column: Story = {
  args: { direction: 'column', gap: '200' },
  render: (args) => <Flex {...args}>{['A', 'B', 'C'].map(swatch)}</Flex>,
};

export const AlignAndJustify: Story = {
  args: { direction: 'row', gap: '300', align: 'center', justify: 'between' },
  render: (args) => (
    <Flex {...args} style={{ height: 120, background: 'var(--ds-color-surface-inset)' }}>
      {['A', 'B', 'C'].map(swatch)}
    </Flex>
  ),
};

export const Wrapping: Story = {
  args: { direction: 'row', gap: '200', wrap: 'wrap' },
  render: (args) => (
    <Flex {...args} style={{ width: 200 }}>
      {['1', '2', '3', '4', '5', '6'].map(swatch)}
    </Flex>
  ),
};

export const Playground: Story = {
  args: { direction: 'row', gap: '300', align: 'center', justify: 'start', wrap: 'nowrap' },
  render: (args) => <Flex {...args}>{['A', 'B', 'C'].map(swatch)}</Flex>,
};
