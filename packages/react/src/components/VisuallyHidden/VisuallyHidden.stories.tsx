import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from './VisuallyHidden';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'Layout/VisuallyHidden',
  component: VisuallyHidden,
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

export const Default: Story = {
  args: { children: 'Announced to screen readers only' },
};

export const IconButtonLabel: Story = {
  name: 'Typical use: label an icon-only button',
  render: () => (
    <button type="button" aria-label={undefined}>
      <span aria-hidden="true">×</span>
      <VisuallyHidden>Close dialog</VisuallyHidden>
    </button>
  ),
};

export const Playground: Story = {
  args: { children: 'Playground hidden text' },
};
