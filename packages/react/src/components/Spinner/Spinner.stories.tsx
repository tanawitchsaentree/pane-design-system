import type { Meta, StoryObj } from '@storybook/react';
import { ICON_SIZE_TOKENS } from '../../types';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'select', options: ICON_SIZE_TOKENS },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {ICON_SIZE_TOKENS.map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  ),
};

export const CustomLabel: Story = {
  args: { label: 'Saving changes' },
};

export const Playground: Story = {
  args: { size: 'md', label: 'Loading' },
};
