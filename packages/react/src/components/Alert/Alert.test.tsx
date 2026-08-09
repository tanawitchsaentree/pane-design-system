import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders title and description', () => {
    render(<Alert title="Saved">Your changes were saved.</Alert>);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes were saved.')).toBeInTheDocument();
  });

  it('renders with role="alert" for assistive tech announcement', () => {
    render(<Alert title="Heads up">Something happened.</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('defaults to variant="default"', () => {
    render(<Alert data-testid="alert" title="Note" />);
    expect(screen.getByTestId('alert')).toHaveAttribute('data-variant', 'default');
  });

  it('applies the variant data attribute for each semantic tone', () => {
    const variants = ['default', 'success', 'warning', 'danger', 'info'] as const;
    for (const variant of variants) {
      const { unmount } = render(<Alert data-testid="alert" variant={variant} title="x" />);
      expect(screen.getByTestId('alert')).toHaveAttribute('data-variant', variant);
      unmount();
    }
  });

  it('renders a default icon per variant (non-color cue) even with no icon prop passed', () => {
    render(<Alert data-testid="alert" variant="danger" title="Error" />);
    const el = screen.getByTestId('alert');
    expect(el.querySelector('svg')).not.toBeNull();
  });

  it('renders visually distinct default icon markup between variants (non-color cue is real, not just tinted)', () => {
    const { container: successContainer } = render(<Alert variant="success" title="ok" />);
    const { container: dangerContainer } = render(<Alert variant="danger" title="bad" />);
    const successPath = successContainer.querySelector('svg')?.innerHTML ?? '';
    const dangerPath = dangerContainer.querySelector('svg')?.innerHTML ?? '';
    expect(successPath).not.toEqual(dangerPath);
  });

  it('omits the icon slot entirely when icon={null} is passed', () => {
    render(<Alert data-testid="alert" icon={null} title="No icon" />);
    const el = screen.getByTestId('alert');
    expect(el.querySelector('svg')).toBeNull();
  });

  it('renders a custom icon override when provided', () => {
    render(
      <Alert title="Custom" icon={<span data-testid="custom-icon">*</span>}>
        Body
      </Alert>,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('does not render a dismiss button by default', () => {
    render(<Alert title="No dismiss" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a dismiss button when dismissible, and calls onDismiss when clicked', async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Dismiss me" dismissible onDismiss={onDismiss} />);
    const button = screen.getByRole('button', { name: 'Dismiss alert' });
    expect(button.tagName).toBe('BUTTON');
    await userEvent.click(button);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('supports a custom dismissLabel', () => {
    render(<Alert title="x" dismissible dismissLabel="Close this warning" onDismiss={() => {}} />);
    expect(screen.getByRole('button', { name: 'Close this warning' })).toBeInTheDocument();
  });

  it('renders without a title for description-only alerts', () => {
    render(<Alert>Just a message, no heading.</Alert>);
    expect(screen.getByText('Just a message, no heading.')).toBeInTheDocument();
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref} title="x" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('alert');
  });

  it('has no axe violations (default, no dismiss button)', async () => {
    const { container } = render(<Alert title="Accessible" variant="info">All good.</Alert>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations when dismissible', async () => {
    const { container } = render(
      <Alert title="Accessible dismissible" variant="warning" dismissible onDismiss={() => {}}>
        Body copy.
      </Alert>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
