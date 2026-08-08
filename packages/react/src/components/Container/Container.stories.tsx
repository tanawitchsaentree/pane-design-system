import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { Box } from '../Box/Box';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'] },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

const content = (
  <Box style={{ background: 'var(--ds-color-surface-inset)', padding: 16 }}>
    Container content — resize the viewport to see the max-width cap change per breakpoint.
  </Box>
);

export const Small: Story = { args: { size: 'sm' }, render: (args) => <Container {...args}>{content}</Container> };
export const Medium: Story = { args: { size: 'md' }, render: (args) => <Container {...args}>{content}</Container> };
export const Large: Story = {
  name: 'Large (default — D-002 anchor)',
  args: { size: 'lg' },
  render: (args) => <Container {...args}>{content}</Container>,
};
export const ExtraLarge: Story = { args: { size: 'xl' }, render: (args) => <Container {...args}>{content}</Container> };
export const TwoXLarge: Story = { args: { size: '2xl' }, render: (args) => <Container {...args}>{content}</Container> };
export const Full: Story = { args: { size: 'full' }, render: (args) => <Container {...args}>{content}</Container> };

export const Playground: Story = {
  args: { size: 'lg' },
  render: (args) => <Container {...args}>{content}</Container>,
};
