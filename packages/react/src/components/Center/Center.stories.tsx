import type { Meta, StoryObj } from '@storybook/react';
import { Center } from './Center';
import { Box } from '../Box/Box';

const meta: Meta<typeof Center> = {
  title: 'Layout/Center',
  component: Center,
};

export default meta;
type Story = StoryObj<typeof Center>;

export const Default: Story = {
  render: (args) => (
    <Center {...args} style={{ height: 160, background: 'var(--ds-color-surface-inset)' }}>
      <Box style={{ background: 'var(--ds-color-action-neutral-default)', padding: 16, borderRadius: 8 }}>
        Centered content
      </Box>
    </Center>
  ),
};

export const RowOfItems: Story = {
  name: 'Center with row direction + gap',
  render: (args) => (
    <Center
      {...args}
      direction="row"
      gap="200"
      style={{ height: 120, background: 'var(--ds-color-surface-inset)' }}
    >
      <Box style={{ background: 'var(--ds-color-action-neutral-default)', padding: 12 }}>A</Box>
      <Box style={{ background: 'var(--ds-color-action-neutral-default)', padding: 12 }}>B</Box>
    </Center>
  ),
};

export const Playground: Story = {
  render: (args) => (
    <Center {...args} style={{ height: 160, background: 'var(--ds-color-surface-inset)' }}>
      <Box style={{ background: 'var(--ds-color-action-neutral-default)', padding: 16 }}>
        Playground
      </Box>
    </Center>
  ),
};
