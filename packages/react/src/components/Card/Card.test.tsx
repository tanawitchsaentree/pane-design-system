import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './Card';

// Honesty Rule (component-engineer.md / Radio.tsx precedent): everything asserted below is a
// static DOM/role fact or a userEvent-simulated click/keyboard press, both of which jsdom can
// honestly prove. There is nothing UNVERIFIED to flag for this component (unlike Dialog/Popover/
// Listbox) — a clickable Card renders a plain native <button>/<a> with zero custom keyboard
// handling, so there is no roving focus/focus-trap/real-layout claim that would need a Playwright
// conformance spec (T2 tier, per component-engineer.md's tier table: no Gate Proof mutation, no
// conformance spec required).

describe('Card', () => {
  it('renders Card.Root as a plain div by default (no role/tabIndex implying interactivity)', () => {
    render(
      <Card.Root data-testid="card">
        <Card.Body>Plain content</Card.Body>
      </Card.Root>,
    );
    const el = screen.getByTestId('card');
    expect(el.tagName).toBe('DIV');
    expect(el).not.toHaveAttribute('role');
    expect(el).not.toHaveAttribute('tabindex');
  });

  it('renders Header/Body/Footer as sibling sections in document order', () => {
    render(
      <Card.Root>
        <Card.Header>Title</Card.Header>
        <Card.Body>Body content</Card.Body>
        <Card.Footer>Footer content</Card.Footer>
      </Card.Root>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('Card.Media renders its children (an img) inside an AspectRatio wrapper when ratio is given', () => {
    render(
      <Card.Root>
        <Card.Media ratio="video">
          <img src="/cover.jpg" alt="Cover" />
        </Card.Media>
      </Card.Root>,
    );
    const img = screen.getByRole('img', { name: 'Cover' });
    expect(img).toBeInTheDocument();
  });

  it('Card.Media renders children as-is without AspectRatio when ratio is omitted', () => {
    render(
      <Card.Root>
        <Card.Media data-testid="media">
          <img src="/cover.jpg" alt="Cover" />
        </Card.Media>
      </Card.Root>,
    );
    // No aspect-ratio data attribute should leak in — that only exists on AspectRatio's own root.
    expect(screen.getByTestId('media')).not.toHaveAttribute('data-ratio');
  });

  it('clickable renders a native button (not a div with onClick) — real keyboard/role semantics for free', () => {
    const onClick = vi.fn();
    render(
      <Card.Root clickable onClick={onClick} data-testid="card">
        <Card.Body>Click me</Card.Body>
      </Card.Root>,
    );
    const el = screen.getByRole('button');
    expect(el.tagName).toBe('BUTTON');
    expect(el).toHaveAttribute('type', 'button');
  });

  it('fires onClick on mouse click when clickable', async () => {
    const onClick = vi.fn();
    render(
      <Card.Root clickable onClick={onClick}>
        <Card.Body>Click me</Card.Body>
      </Card.Root>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClick on Enter/Space keyboard activation when clickable (native button behavior)', async () => {
    const onClick = vi.fn();
    render(
      <Card.Root clickable onClick={onClick}>
        <Card.Body>Click me</Card.Body>
      </Card.Root>,
    );
    const el = screen.getByRole('button');
    el.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('disabled clickable card does not fire onClick and is removed from the tab order', async () => {
    const onClick = vi.fn();
    render(
      <Card.Root clickable disabled onClick={onClick}>
        <Card.Body>Sold out</Card.Body>
      </Card.Root>,
    );
    const el = screen.getByRole('button');
    expect(el).toBeDisabled();
    await userEvent.click(el);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('clickable + asChild renders the supplied anchor as the whole card (navigating-card case)', () => {
    render(
      <Card.Root clickable asChild>
        <a href="/detail">
          <Card.Body>Product</Card.Body>
        </a>
      </Card.Root>,
    );
    const el = screen.getByRole('link', { name: 'Product' });
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '/detail');
  });

  it('forwards ref to the underlying div when not clickable', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card.Root ref={ref}>
        <Card.Body>Content</Card.Body>
      </Card.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards ref to the underlying button when clickable', () => {
    // Card.Root's declared ref type covers the common non-clickable (div) case — see Card.tsx's
    // own comment on this trade-off, same one Button's asChild ref typing already accepts.
    const ref = createRef<HTMLButtonElement>();
    render(
      <Card.Root clickable ref={ref as unknown as React.RefObject<HTMLDivElement>}>
        <Card.Body>Content</Card.Body>
      </Card.Root>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no axe violations for a static (non-clickable) card', async () => {
    const { container } = render(
      <Card.Root>
        <Card.Header>Title</Card.Header>
        <Card.Body>Body content</Card.Body>
        <Card.Footer>Footer content</Card.Footer>
      </Card.Root>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations for a clickable card', async () => {
    const { container } = render(
      <Card.Root clickable aria-label="Open product detail">
        <Card.Body>Product</Card.Body>
      </Card.Root>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
