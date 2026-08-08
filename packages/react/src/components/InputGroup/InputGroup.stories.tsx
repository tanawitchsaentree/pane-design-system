import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup } from './InputGroup';

const meta: Meta<typeof InputGroup> = {
  title: 'Forms/InputGroup',
  component: InputGroup,
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const WithPrefix: Story = {
  render: () => (
    <InputGroup prefix="$">
      <input aria-label="Price" placeholder="0.00" style={{ border: 'none', outline: 'none', background: 'transparent', padding: 8, width: '100%' }} />
    </InputGroup>
  ),
};

export const WithSuffix: Story = {
  render: () => (
    <InputGroup suffix="kg">
      <input aria-label="Weight" placeholder="0" style={{ border: 'none', outline: 'none', background: 'transparent', padding: 8, width: '100%' }} />
    </InputGroup>
  ),
};

export const WithBoth: Story = {
  render: () => (
    <InputGroup prefix="$" suffix="USD">
      <input aria-label="Amount" placeholder="0.00" style={{ border: 'none', outline: 'none', background: 'transparent', padding: 8, width: '100%' }} />
    </InputGroup>
  ),
};

export const Playground: Story = {
  args: { prefix: '$', suffix: 'USD' },
  render: (args) => (
    <InputGroup {...args}>
      <input aria-label="Playground" style={{ border: 'none', outline: 'none', background: 'transparent', padding: 8, width: '100%' }} />
    </InputGroup>
  ),
};
