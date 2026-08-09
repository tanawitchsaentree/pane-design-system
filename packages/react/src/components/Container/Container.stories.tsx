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

export const Small: Story = {
  parameters: { docs: { description: { story: 'Caps content width at the "sm" breakpoint max-width.' } } },
  args: { size: 'sm' },
  render: (args) => <Container {...args}>{content}</Container>,
};
export const Medium: Story = {
  parameters: { docs: { description: { story: 'Caps content width at the "md" breakpoint max-width.' } } },
  args: { size: 'md' },
  render: (args) => <Container {...args}>{content}</Container>,
};
export const Large: Story = {
  name: 'Large (default — D-002 anchor)',
  parameters: { docs: { description: { story: 'Caps content width at the "lg" breakpoint max-width, the default Container size (D-002).' } } },
  args: { size: 'lg' },
  render: (args) => <Container {...args}>{content}</Container>,
};
export const ExtraLarge: Story = {
  parameters: { docs: { description: { story: 'Caps content width at the "xl" breakpoint max-width.' } } },
  args: { size: 'xl' },
  render: (args) => <Container {...args}>{content}</Container>,
};
export const TwoXLarge: Story = {
  parameters: { docs: { description: { story: 'Caps content width at the "2xl" breakpoint max-width.' } } },
  args: { size: '2xl' },
  render: (args) => <Container {...args}>{content}</Container>,
};
export const Full: Story = {
  parameters: { docs: { description: { story: 'Removes the max-width cap so content spans the full available width.' } } },
  args: { size: 'full' },
  render: (args) => <Container {...args}>{content}</Container>,
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { size: 'lg' },
  render: (args) => <Container {...args}>{content}</Container>,
};
