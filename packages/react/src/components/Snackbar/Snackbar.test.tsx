import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ToastProvider, ToastAction } from '../Toast/Toast';
import { useSnackbar } from './Snackbar';

function ShowButton() {
  const { show } = useSnackbar();
  return (
    <button type="button" onClick={() => show({ message: 'Saved changes' })}>
      Show
    </button>
  );
}

describe('useSnackbar', () => {
  it('throws when used outside a ToastProvider (reuses Toast context)', () => {
    function Broken() {
      useSnackbar();
      return null;
    }
    expect(() => render(<Broken />)).toThrow(/ToastProvider/);
  });

  it('shows a single-line message with no title', async () => {
    render(
      <ToastProvider>
        <ShowButton />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Show'));
    expect(await screen.findByText('Saved changes')).toBeInTheDocument();
  });

  it('replaces the previous snackbar instead of stacking a second one', async () => {
    function MultiShow() {
      const { show } = useSnackbar();
      return (
        <button
          type="button"
          onClick={() => {
            show({ message: 'First message' });
            show({ message: 'Second message' });
          }}
        >
          Fire twice
        </button>
      );
    }
    render(
      <ToastProvider>
        <MultiShow />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Fire twice'));
    expect(await screen.findByText('Second message')).toBeInTheDocument();
    expect(screen.queryByText('First message')).not.toBeInTheDocument();
  });

  it('supports a single action element', async () => {
    function ShowWithAction() {
      const { show } = useSnackbar();
      return (
        <button
          type="button"
          onClick={() =>
            show({
              message: 'Item deleted',
              action: <ToastAction altText="Undo deleting the item">Undo</ToastAction>,
            })
          }
        >
          Show
        </button>
      );
    }
    render(
      <ToastProvider>
        <ShowWithAction />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Show'));
    expect(await screen.findByText('Undo')).toBeInTheDocument();
  });

  it('hide() dismisses the current snackbar programmatically', async () => {
    function ShowAndHide() {
      const { show, hide } = useSnackbar();
      return (
        <>
          <button type="button" onClick={() => show({ message: 'Persistent', duration: Infinity })}>
            Show
          </button>
          <button type="button" onClick={hide}>
            Hide
          </button>
        </>
      );
    }
    render(
      <ToastProvider>
        <ShowAndHide />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Show'));
    expect(await screen.findByText('Persistent')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Hide'));
    await waitFor(() => expect(screen.queryByText('Persistent')).not.toBeInTheDocument());
  });

  it('has no axe violations when a snackbar is visible', async () => {
    const { container } = render(
      <ToastProvider>
        <ShowButton />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('Show'));
    await screen.findByText('Saved changes');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
