import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';
import type { AlertVariant } from './Alert';

const VARIANTS: AlertVariant[] = ['default', 'success', 'warning', 'danger', 'info'];

const meta: Meta<typeof Alert> = {
  title: 'Data Display/Alert',
  component: Alert,
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Renders an Alert with the default (neutral) variant, a title, and a description.' } },
  },
  args: {
    variant: 'default',
    title: 'Heads up',
    children: 'This is a general, no-particular-feedback notice.',
  },
};

export const AllVariants: Story = {
  parameters: {
    docs: { description: { story: 'Every semantic variant — default/success/warning/danger/info — each with a genuinely distinct default icon glyph (not just a re-tinted copy), so they stay distinguishable even without color.' } },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {VARIANTS.map((variant) => (
        <Alert key={variant} variant={variant} title={`${variant} alert`}>
          This is a {variant} message describing what happened.
        </Alert>
      ))}
    </div>
  ),
};

export const DescriptionOnly: Story = {
  parameters: {
    docs: { description: { story: 'An Alert with no title — a short one-line message is valid without a heading.' } },
  },
  args: {
    variant: 'info',
    children: 'Your session will expire in 5 minutes.',
  },
};

export const Dismissible: Story = {
  parameters: {
    docs: { description: { story: 'Renders a close button (a plain native `<button>` via IconButton, no overlay/portal machinery) that calls onDismiss when activated. The caller owns visibility — Alert has no internal open/closed state.' } },
  },
  render: function DismissibleStory() {
    const [visible, setVisible] = useState(true);
    if (!visible) {
      return <button type="button" onClick={() => setVisible(true)}>Show alert again</button>;
    }
    return (
      <Alert variant="warning" title="Unsaved changes" dismissible onDismiss={() => setVisible(false)}>
        You have unsaved changes that will be lost.
      </Alert>
    );
  },
};

export const CustomIcon: Story = {
  parameters: {
    docs: { description: { story: 'Overrides the default variant icon with a custom node via the `icon` prop.' } },
  },
  args: {
    variant: 'success',
    title: 'Custom icon',
    icon: <span style={{ fontSize: 16 }}>★</span>,
    children: 'The icon prop accepts any ReactNode, not just SVGs.',
  },
};

export const NoIcon: Story = {
  parameters: {
    docs: { description: { story: 'Pass icon={null} to omit the icon slot entirely.' } },
  },
  args: {
    variant: 'default',
    title: 'No icon',
    icon: null,
    children: 'This alert renders without an icon slot at all.',
  },
};

export const Playground: Story = {
  parameters: {
    docs: { description: { story: 'Interactive playground — adjust props via the Controls panel below.' } },
  },
  args: {
    variant: 'default',
    title: 'Alert title',
    children: 'Alert description text goes here.',
  },
};
