import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Layout/Box',
  component: Box,
  argTypes: {
    asChild: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Renders a plain Box as a <div> wrapping its children.' } } },
  args: {
    children: 'Box content',
  },
};

export const WithStyleProp: Story = {
  name: 'With user-supplied style (escape hatch)',
  parameters: { docs: { description: { story: 'Passes a consumer-supplied inline style object through to the underlying element as an escape hatch.' } } },
  args: {
    children: 'Box with inline style from consumer',
    style: { border: '1px dashed currentColor', padding: 16 },
  },
};

export const AsChildAnchor: Story = {
  name: 'asChild renders <a> instead of <div>',
  parameters: { docs: { description: { story: 'Uses asChild to merge Box behavior onto a child <a> element instead of rendering its own <div>.' } } },
  render: (args) => (
    <Box {...args} asChild>
      <a href="#anatomy">I am an anchor, not a div</a>
    </Box>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: {
    asChild: false,
    children: 'Playground box — use controls to toggle asChild',
  },
};
