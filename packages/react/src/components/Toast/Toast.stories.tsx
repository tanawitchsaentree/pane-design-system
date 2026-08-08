import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { ToastProvider, useToast, ToastAction } from './Toast';
import type { ToastVariant } from './Toast';

const meta: Meta = {
  title: 'Overlays/Toast',
};

export default meta;
type Story = StoryObj;

function TriggerButtons() {
  const { toast } = useToast();
  const variants: ToastVariant[] = ['default', 'success', 'warning', 'danger'];

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {variants.map((variant) => (
        <Button
          key={variant}
          variant="outline"
          onClick={() =>
            toast({
              title: `${variant} toast`,
              description: `This is a ${variant} notification.`,
              variant,
            })
          }
        >
          {variant}
        </Button>
      ))}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <TriggerButtons />
    </ToastProvider>
  ),
};

function StackingDemo() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() => {
        toast({ title: 'First', description: 'Toast #1' });
        toast({ title: 'Second', description: 'Toast #2' });
        toast({ title: 'Third', description: 'Toast #3' });
      }}
    >
      Fire 3 toasts (stacking)
    </Button>
  );
}

export const Stacking: Story = {
  render: () => (
    <ToastProvider>
      <StackingDemo />
    </ToastProvider>
  ),
};

function WithActionDemo() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: 'Message archived',
          action: (
            <ToastAction altText="Undo archiving the message" onClick={() => window.alert('Undone!')}>
              Undo
            </ToastAction>
          ),
        })
      }
    >
      Trigger with action
    </Button>
  );
}

export const WithAction: Story = {
  render: () => (
    <ToastProvider>
      <WithActionDemo />
    </ToastProvider>
  ),
};

function PersistentDemo() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ title: 'Stays until dismissed', duration: Infinity })}>
      Trigger persistent toast
    </Button>
  );
}

export const PersistentUntilDismissed: Story = {
  render: () => (
    <ToastProvider>
      <PersistentDemo />
    </ToastProvider>
  ),
};

export const Placements: Story = {
  render: function PlacementsStory() {
    return (
      <ToastProvider placement="top-left">
        <TriggerButtons />
      </ToastProvider>
    );
  },
};

export const Playground: Story = {
  render: () => (
    <ToastProvider duration={5000} placement="bottom-right">
      <TriggerButtons />
    </ToastProvider>
  ),
};
