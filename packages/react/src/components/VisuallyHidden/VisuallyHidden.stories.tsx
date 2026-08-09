import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from './VisuallyHidden';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'Layout/VisuallyHidden',
  component: VisuallyHidden,
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Renders text that is hidden visually but still announced to screen readers.' } } },
  args: { children: 'Announced to screen readers only' },
};

export const IconButtonLabel: Story = {
  name: 'Typical use: label an icon-only button',
  parameters: { docs: { description: { story: 'Uses VisuallyHidden to give an icon-only button an accessible name without showing visible text.' } } },
  render: () => (
    <button type="button" aria-label={undefined}>
      <span aria-hidden="true">×</span>
      <VisuallyHidden>Close dialog</VisuallyHidden>
    </button>
  ),
};

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } } },
  args: { children: 'Playground hidden text' },
};
