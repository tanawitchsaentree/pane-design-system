import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { ToastProvider, ToastAction } from '../Toast/Toast';
import { useSnackbar } from './Snackbar';

const meta: Meta = {
  title: 'Overlays/Snackbar',
};

export default meta;
type Story = StoryObj;

function BasicDemo() {
  const { show } = useSnackbar();
  return <Button onClick={() => show({ message: 'Link copied to clipboard' })}>Copy link</Button>;
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <BasicDemo />
    </ToastProvider>
  ),
};

function SingleInstanceDemo() {
  const { show } = useSnackbar();
  let count = 0;
  return (
    <Button
      onClick={() => {
        count += 1;
        show({ message: `Message #${count} — replaces the previous snackbar, no stacking` });
      }}
    >
      Fire repeatedly (single-instance)
    </Button>
  );
}

export const SingleInstanceOnly: Story = {
  name: 'Single-instance (unlike Toast, does not stack)',
  render: () => (
    <ToastProvider>
      <SingleInstanceDemo />
    </ToastProvider>
  ),
};

function WithActionDemo() {
  const { show } = useSnackbar();
  return (
    <Button
      onClick={() =>
        show({
          message: 'Item removed',
          action: (
            <ToastAction altText="Undo removing the item" onClick={() => window.alert('Restored!')}>
              Undo
            </ToastAction>
          ),
        })
      }
    >
      Remove item
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

function HideDemo() {
  const { show, hide } = useSnackbar();
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button onClick={() => show({ message: 'Uploading...', duration: Infinity })}>Show</Button>
      <Button variant="ghost" onClick={hide}>
        Hide now
      </Button>
    </div>
  );
}

export const ProgrammaticHide: Story = {
  render: () => (
    <ToastProvider>
      <HideDemo />
    </ToastProvider>
  ),
};

export const Playground: Story = {
  render: () => (
    <ToastProvider placement="bottom-left">
      <BasicDemo />
    </ToastProvider>
  ),
};
