import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from './Kbd';

const meta: Meta<typeof Kbd> = {
  title: 'Atoms/Kbd',
  component: Kbd,
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  args: { children: 'Esc' },
};

export const Shortcut: Story = {
  name: 'Combined shortcut',
  render: () => (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>K</Kbd>
    </span>
  ),
};

export const Playground: Story = {
  args: { children: 'Enter' },
};
