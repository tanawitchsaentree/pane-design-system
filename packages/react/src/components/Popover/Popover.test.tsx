import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Popover } from './Popover';

function BasicPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Content>Popover content</Popover.Content>
    </Popover.Root>
  );
}

describe('Popover', () => {
  it('is closed by default and opens on trigger click', async () => {
    render(<BasicPopover />);
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Open'));
    expect(await screen.findByText('Popover content')).toBeInTheDocument();
  });

  it('supports defaultOpen (uncontrolled)', () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Already open</Popover.Content>
      </Popover.Root>,
    );
    expect(screen.getByText('Already open')).toBeInTheDocument();
  });

  it('supports controlled open via open+onOpenChange', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger>Toggle</Popover.Trigger>
          <Popover.Content>Controlled content</Popover.Content>
        </Popover.Root>
      );
    }
    render(<Controlled />);
    expect(screen.queryByText('Controlled content')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Toggle'));
    expect(await screen.findByText('Controlled content')).toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    render(<BasicPopover />);
    await userEvent.click(screen.getByText('Open'));
    expect(await screen.findByText('Popover content')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Popover content')).not.toBeInTheDocument());
  });

  it('closes when clicking outside', async () => {
    render(
      <div>
        <BasicPopover />
        <button type="button">outside</button>
      </div>,
    );
    await userEvent.click(screen.getByText('Open'));
    expect(await screen.findByText('Popover content')).toBeInTheDocument();
    await userEvent.click(screen.getByText('outside'));
    await waitFor(() => expect(screen.queryByText('Popover content')).not.toBeInTheDocument());
  });

  it('has no axe violations when open', async () => {
    const { container } = render(<BasicPopover />);
    await userEvent.click(screen.getByText('Open'));
    await screen.findByText('Popover content');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
