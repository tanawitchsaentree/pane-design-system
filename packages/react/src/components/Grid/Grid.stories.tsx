import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';
import { Box } from '../Box/Box';

const cell = (label: string) => (
  <Box
    key={label}
    style={{ background: 'var(--ds-color-action-neutral-default)', padding: 8, borderRadius: 8, textAlign: 'center' }}
  >
    {label}
  </Box>
);

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  argTypes: {
    columns: { control: { type: 'number', min: 1, max: 12 } },
    gap: { control: 'select', options: ['100', '200', '300', '400'] },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const TwelveColumn: Story = {
  parameters: { docs: { description: { story: 'Lays out 12 cells across a fixed 12-column grid with gap="200".' } } },
  args: { columns: 12, gap: '200' },
  render: (args) => <Grid {...args}>{Array.from({ length: 12 }, (_, i) => cell(String(i + 1)))}</Grid>,
};

export const FourColumn: Story = {
  parameters: { docs: { description: { story: 'Lays out 8 cells across a fixed 4-column grid with gap="300", wrapping into two rows.' } } },
  args: { columns: 4, gap: '300' },
  render: (args) => <Grid {...args}>{Array.from({ length: 8 }, (_, i) => cell(String(i + 1)))}</Grid>,
};

export const ResponsiveColumns: Story = {
  name: 'Responsive columns (sm/md/lg/xl per D-007)',
  parameters: { docs: { description: { story: 'Starts at 1 column and increases the column count at sm/md/lg/xl breakpoints (2/3/4/6) via the responsive prop.' } } },
  args: { columns: 1, gap: '300', responsive: { sm: 2, md: 3, lg: 4, xl: 6 } },
  render: (args) => <Grid {...args}>{Array.from({ length: 6 }, (_, i) => cell(String(i + 1)))}</Grid>,
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { columns: 12, gap: '300' },
  render: (args) => <Grid {...args}>{Array.from({ length: 12 }, (_, i) => cell(String(i + 1)))}</Grid>,
};
