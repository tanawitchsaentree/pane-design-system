import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Drawer } from './Drawer';

function BasicDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>Open</Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Title>My drawer</Drawer.Title>
        <Drawer.Description>Description text</Drawer.Description>
      </Drawer.Content>
    </Drawer.Root>
  );
}

describe('Drawer', () => {
  it('is closed by default and opens on trigger click', async () => {
    render(<BasicDrawer />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Open'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('supports defaultOpen (uncontrolled)', () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Already open</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    render(<BasicDrawer />);
    await userEvent.click(screen.getByText('Open'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes via the built-in close button', async () => {
    render(<BasicDrawer />);
    await userEvent.click(screen.getByText('Open'));
    await screen.findByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: 'Close drawer' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('renders each placement with the correct data attribute', () => {
    (['left', 'right', 'bottom'] as const).forEach((placement) => {
      const { unmount } = render(
        <Drawer.Root defaultOpen>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content placement={placement}>
            <Drawer.Title>{placement}</Drawer.Title>
          </Drawer.Content>
        </Drawer.Root>,
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('data-placement', placement);
      unmount();
    });
  });

  it('forwards ref to the underlying content element', async () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content ref={ref}>
          <Drawer.Title>Ref test</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    await waitFor(() => expect(ref.current).toBeInstanceOf(HTMLDivElement));
  });

  it('has no axe violations when open', async () => {
    const { container } = render(<BasicDrawer />);
    await userEvent.click(screen.getByText('Open'));
    await screen.findByRole('dialog');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
