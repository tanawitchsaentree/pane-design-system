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
  parameters: { docs: { description: { story: 'Lays out three items horizontally with direction="row" and gap="300".' } } },
  args: { direction: 'row', gap: '300' },
  render: (args) => <Flex {...args}>{['A', 'B', 'C'].map(swatch)}</Flex>,
};

export const Column: Story = {
  parameters: { docs: { description: { story: 'Lays out three items vertically with direction="column" and gap="200".' } } },
  args: { direction: 'column', gap: '200' },
  render: (args) => <Flex {...args}>{['A', 'B', 'C'].map(swatch)}</Flex>,
};

export const AlignAndJustify: Story = {
  parameters: { docs: { description: { story: 'Centers items vertically and spaces them apart horizontally using align="center" + justify="between".' } } },
  args: { direction: 'row', gap: '300', align: 'center', justify: 'between' },
  render: (args) => (
    <Flex {...args} style={{ height: 120, background: 'var(--ds-color-surface-inset)' }}>
      {['A', 'B', 'C'].map(swatch)}
    </Flex>
  ),
};

export const Wrapping: Story = {
  parameters: { docs: { description: { story: 'Shows items wrapping onto new lines when they overflow a constrained 200px width, via wrap="wrap".' } } },
  args: { direction: 'row', gap: '200', wrap: 'wrap' },
  render: (args) => (
    <Flex {...args} style={{ width: 200 }}>
      {['1', '2', '3', '4', '5', '6'].map(swatch)}
    </Flex>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { direction: 'row', gap: '300', align: 'center', justify: 'start', wrap: 'nowrap' },
  render: (args) => <Flex {...args}>{['A', 'B', 'C'].map(swatch)}</Flex>,
};
