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

export const Default: Story = {
  parameters: { docs: { description: { story: 'Renders a Spinner with default size and label.' } } },
};

export const AllSizes: Story = {
  parameters: { docs: { description: { story: 'Renders one Spinner per size token in ICON_SIZE_TOKENS side by side.' } } },
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {ICON_SIZE_TOKENS.map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  ),
};

export const CustomLabel: Story = {
  parameters: { docs: { description: { story: 'Sets a custom accessible label ("Saving changes") instead of the default loading label.' } } },
  args: { label: 'Saving changes' },
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { size: 'md', label: 'Loading' },
};
