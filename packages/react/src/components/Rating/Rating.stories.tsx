import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Selection/Rating',
  component: Rating,
  argTypes: {
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    max: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: { 'aria-label': 'Rate this product', name: 'default-story' },
};

export const WithDefaultValue: Story = {
  args: { 'aria-label': 'Rate this product', name: 'default-value-story', defaultValue: 3 },
};

export const MaxTen: Story = {
  args: { 'aria-label': 'Rate out of 10', name: 'max-ten-story', max: 10, defaultValue: 6 },
};

export const ReadOnlyAverage: Story = {
  args: {
    'aria-label': 'Average rating from other people',
    name: 'readonly-story',
    defaultValue: 4,
    readOnly: true,
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Rating aria-label="Empty" name="states-empty" />
      <Rating aria-label="Partially selected" name="states-partial" defaultValue={3} />
      <Rating aria-label="Disabled empty" name="states-disabled-empty" disabled />
      <Rating aria-label="Disabled selected" name="states-disabled-selected" disabled defaultValue={4} />
      <Rating aria-label="Read-only average" name="states-readonly" readOnly defaultValue={4} />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    function ControlledRating() {
      const [value, setValue] = useState(2);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Rating aria-label="Controlled rating" name="controlled-story" value={value} onChange={setValue} />
          <span>Selected: {value}</span>
        </div>
      );
    }
    return <ControlledRating />;
  },
};

export const Playground: Story = {
  args: { 'aria-label': 'Playground rating', name: 'playground', max: 5, disabled: false, readOnly: false },
};
