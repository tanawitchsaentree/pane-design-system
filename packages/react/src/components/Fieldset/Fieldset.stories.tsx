import type { Meta, StoryObj } from '@storybook/react';
import { Fieldset } from './Fieldset';
import { Radio } from '../Radio/Radio';

const meta: Meta<typeof Fieldset> = {
  title: 'Forms/Fieldset',
  component: Fieldset,
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Fieldset>;

export const Default: Story = {
  render: () => (
    <Fieldset legend="Shipping method">
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Radio name="shipping-default" value="standard" defaultChecked /> Standard
      </label>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Radio name="shipping-default" value="express" /> Express
      </label>
    </Fieldset>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Fieldset legend="Shipping method" disabled>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Radio name="shipping-disabled-story" value="standard" defaultChecked /> Standard
      </label>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Radio name="shipping-disabled-story" value="express" /> Express
      </label>
    </Fieldset>
  ),
};

export const Playground: Story = {
  args: { legend: 'Playground legend', disabled: false },
  render: (args) => (
    <Fieldset {...args}>
      <Radio aria-label="Option A" name="playground-fieldset" value="a" />
    </Fieldset>
  ),
};
