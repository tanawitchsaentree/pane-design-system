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
  parameters: { docs: { description: { story: 'Label + helper text composed around an Input, with id/aria-describedby/htmlFor wiring handled automatically.' } } },
  render: () => (
    <FormField label="Email" helperText="We'll never share your email.">
      <Input placeholder="jane@example.com" />
    </FormField>
  ),
};

export const Required: Story = {
  parameters: { docs: { description: { story: "Marks the field required — shows Label's asterisk indicator and mirrors required onto the cloned Input." } } },
  render: () => (
    <FormField label="Full name" required>
      <Input placeholder="Jane Doe" />
    </FormField>
  ),
};

export const Invalid: Story = {
  parameters: { docs: { description: { story: 'Marks the field invalid — switches HelperText to the error tone and sets aria-invalid on the cloned control.' } } },
  render: () => (
    <FormField label="Email" invalid helperText="Enter a valid email address.">
      <Input placeholder="jane@example.com" />
    </FormField>
  ),
};

export const WithTextarea: Story = {
  parameters: { docs: { description: { story: 'Composes FormField around a Textarea instead of Input, showing the same label/helper-text cloning works with any single form-control child.' } } },
  render: () => (
    <FormField label="Bio" helperText="Max 280 characters.">
      <Textarea placeholder="Tell us about yourself" />
    </FormField>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { label: 'Playground field', required: false, invalid: false, helperText: 'Helper text' },
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="Type here" />
    </FormField>
  ),
};
