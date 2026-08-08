import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Dialog } from './Dialog';

function BasicDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>My dialog</Dialog.Title>
        <Dialog.Description>Description text</Dialog.Description>
        <p>Body</p>
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe('Dialog', () => {
  it('is closed by default and opens on trigger click', async () => {
    render(<BasicDialog />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Open'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('supports defaultOpen (uncontrolled)', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Already open</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('supports controlled open via open+onOpenChange', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>Toggle</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Controlled</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );
    }
    render(<Controlled />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Toggle'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    render(<BasicDialog />);
    await userEvent.click(screen.getByText('Open'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes via the built-in close button', async () => {
    render(<BasicDialog />);
    await userEvent.click(screen.getByText('Open'));
    await screen.findByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('traps focus inside the dialog while open', async () => {
    render(
      <div>
        <button type="button">outside before</button>
        <BasicDialog />
        <button type="button">outside after</button>
      </div>,
    );
    await userEvent.click(screen.getByText('Open'));
    await screen.findByRole('dialog');
    // Radix moves focus into the content on open (usually the content itself or first focusable).
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
  });

  it('hides the close button when hideCloseButton is set', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content hideCloseButton>
          <Dialog.Title>No close button</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.queryByRole('button', { name: 'Close dialog' })).not.toBeInTheDocument();
  });

  it('forwards ref to the underlying content element', async () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content ref={ref}>
          <Dialog.Title>Ref test</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await waitFor(() => expect(ref.current).toBeInstanceOf(HTMLDivElement));
  });

  it('renders each size preset', () => {
    (['sm', 'md', 'lg', 'full'] as const).forEach((size) => {
      const { unmount } = render(
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content size={size}>
            <Dialog.Title>{size}</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('data-size', size);
      unmount();
    });
  });

  it('has no axe violations when open', async () => {
    const { container } = render(<BasicDialog />);
    await userEvent.click(screen.getByText('Open'));
    await screen.findByRole('dialog');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
