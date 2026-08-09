import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from './Kbd';

const meta: Meta<typeof Kbd> = {
  title: 'Atoms/Kbd',
  component: Kbd,
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Renders a single key label ("Esc") styled as a keyboard key.' } } },
  args: { children: 'Esc' },
};

export const Shortcut: Story = {
  name: 'Combined shortcut',
  parameters: { docs: { description: { story: 'Combines two Kbd elements with a "+" between them to show a multi-key shortcut ("Ctrl + K").' } } },
  render: () => (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>K</Kbd>
    </span>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { children: 'Enter' },
};
