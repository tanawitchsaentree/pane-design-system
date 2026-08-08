import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ToastProvider, useToast, ToastAction } from './Toast';

function TriggerButton({ duration }: { duration?: number }) {
  const { toast } = useToast();
  return (
    <button
      type="button"
      onClick={() => toast({ title: 'Saved', description: 'Your changes were saved.', duration })}
    >
      Trigger
    </button>
  );
}

describe('Toast / useToast', () => {
  it('throws a descriptive error when used outside a ToastProvider', () => {
    function Broken() {
      useToast();
      return null;
    }
    expect(() => render(<Broken />)).toThrow(/ToastProvider/);
  });

  it('renders no toast until triggered', () => {
    render(
      <ToastProvider>
        <TriggerButton />
      </ToastProvider>,
    );
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('shows a toast after calling toast()', async () => {
    render(
      <ToastProvider>
        <TriggerButton />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Trigger'));
    expect(await screen.findByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes were saved.')).toBeInTheDocument();
  });

  it('stacks multiple toasts in trigger order', async () => {
    function MultiTrigger() {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() => {
            toast({ title: 'First' });
            toast({ title: 'Second' });
          }}
        >
          Fire
        </button>
      );
    }
    render(
      <ToastProvider>
        <MultiTrigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Fire'));
    expect(await screen.findByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('dismisses via the close button', async () => {
    render(
      <ToastProvider>
        <TriggerButton />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Trigger'));
    await screen.findByText('Saved');
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument());
  });

  it('auto-dismisses after its duration elapses', async () => {
    render(
      <ToastProvider>
        <TriggerButton duration={200} />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Trigger'));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument(), { timeout: 3000 });
  }, 8000);

  it('renders an action element (e.g. Undo) alongside the toast', async () => {
    function TriggerWithAction() {
      const { toast } = useToast();
      return (
        <button
          type="button"
          onClick={() =>
            toast({
              title: 'Archived',
              action: <ToastAction altText="Undo archiving">Undo</ToastAction>,
            })
          }
        >
          Trigger
        </button>
      );
    }
    render(
      <ToastProvider>
        <TriggerWithAction />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Trigger'));
    expect(await screen.findByText('Undo')).toBeInTheDocument();
  });

  it('has no axe violations when a toast is visible', async () => {
    const { container } = render(
      <ToastProvider>
        <TriggerButton />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Trigger'));
    await screen.findByText('Saved');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
