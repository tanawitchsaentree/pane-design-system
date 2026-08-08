import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native button by default with type=button', () => {
    render(<Button>Click me</Button>);
    const el = screen.getByRole('button', { name: 'Click me' });
    expect(el.tagName).toBe('BUTTON');
    expect(el).toHaveAttribute('type', 'button');
  });

  it('defaults to variant=solid intent=neutral size=md', () => {
    render(<Button data-testid="btn">Default</Button>);
    const el = screen.getByTestId('btn');
    expect(el).toHaveAttribute('data-variant', 'solid');
    expect(el).toHaveAttribute('data-intent', 'neutral');
    expect(el).toHaveAttribute('data-size', 'md');
  });

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is disabled and aria-busy while loading, and does not fire onClick', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} loading>
        Saving
      </Button>,
    );
    const el = screen.getByRole('button', { name: /Saving/ });
    expect(el).toBeDisabled();
    expect(el).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(el);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows a status-role spinner while loading', () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders leftIcon and rightIcon', () => {
    render(
      <Button leftIcon={<span data-testid="left" />} rightIcon={<span data-testid="right" />}>
        Label
      </Button>,
    );
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('hides rightIcon while loading (spinner takes the leading slot)', () => {
    render(
      <Button loading rightIcon={<span data-testid="right" />}>
        Label
      </Button>,
    );
    expect(screen.queryByTestId('right')).not.toBeInTheDocument();
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders as the asChild element (e.g. an anchor) when set', () => {
    render(
      <Button asChild>
        <a href="#anchor">Anchor button</a>
      </Button>,
    );
    const el = screen.getByRole('link', { name: 'Anchor button' });
    expect(el.tagName).toBe('A');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Button>Accessible button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations while loading', async () => {
    const { container } = render(<Button loading>Accessible loading button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
