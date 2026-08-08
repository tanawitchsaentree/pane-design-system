import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';

const meta: Meta<typeof FormField> = {
  title: 'Forms/FormField',
  component: FormField,
  argTypes: {
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: () => (
    <FormField label="Email" helperText="We'll never share your email.">
      <Input placeholder="jane@example.com" />
    </FormField>
  ),
};

export const Required: Story = {
  render: () => (
    <FormField label="Full name" required>
      <Input placeholder="Jane Doe" />
    </FormField>
  ),
};

export const Invalid: Story = {
  render: () => (
    <FormField label="Email" invalid helperText="Enter a valid email address.">
      <Input placeholder="jane@example.com" />
    </FormField>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <FormField label="Bio" helperText="Max 280 characters.">
      <Textarea placeholder="Tell us about yourself" />
    </FormField>
  ),
};

export const Playground: Story = {
  args: { label: 'Playground field', required: false, invalid: false, helperText: 'Helper text' },
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="Type here" />
    </FormField>
  ),
};
