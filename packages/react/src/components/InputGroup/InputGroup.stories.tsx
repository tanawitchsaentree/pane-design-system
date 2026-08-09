import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup } from './InputGroup';

const meta: Meta<typeof InputGroup> = {
  title: 'Forms/InputGroup',
  component: InputGroup,
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const WithPrefix: Story = {
  parameters: { docs: { description: { story: 'Renders a "$" prefix as its own bordered segment next to the input, distinct from Input\'s own leftElement glyph slot.' } } },
  render: () => (
    <InputGroup prefix="$">
      <input aria-label="Price" placeholder="0.00" style={{ border: 'none', outline: 'none', background: 'transparent', padding: 8, width: '100%' }} />
    </InputGroup>
  ),
};

export const WithSuffix: Story = {
  parameters: { docs: { description: { story: 'Renders a "kg" suffix as its own bordered segment after the input.' } } },
  render: () => (
    <InputGroup suffix="kg">
      <input aria-label="Weight" placeholder="0" style={{ border: 'none', outline: 'none', background: 'transparent', padding: 8, width: '100%' }} />
    </InputGroup>
  ),
};

export const WithBoth: Story = {
  parameters: { docs: { description: { story: 'Combines a "$" prefix and a "USD" suffix around the same input, e.g. for a currency amount field.' } } },
  render: () => (
    <InputGroup prefix="$" suffix="USD">
      <input aria-label="Amount" placeholder="0.00" style={{ border: 'none', outline: 'none', background: 'transparent', padding: 8, width: '100%' }} />
    </InputGroup>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { prefix: '$', suffix: 'USD' },
  render: (args) => (
    <InputGroup {...args}>
      <input aria-label="Playground" style={{ border: 'none', outline: 'none', background: 'transparent', padding: 8, width: '100%' }} />
    </InputGroup>
  ),
};
