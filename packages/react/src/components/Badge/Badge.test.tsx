import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders a span with children', () => {
    render(<Badge>New</Badge>);
    const el = screen.getByText('New');
    expect(el.tagName).toBe('SPAN');
  });

  it('defaults to variant=subtle color=neutral size=md', () => {
    render(<Badge data-testid="badge">default</Badge>);
    const el = screen.getByTestId('badge');
    expect(el).toHaveAttribute('data-variant', 'subtle');
    expect(el).toHaveAttribute('data-color', 'neutral');
    expect(el).toHaveAttribute('data-size', 'md');
  });

  it('applies variant/color/size data attributes', () => {
    render(<Badge data-testid="badge" variant="solid" color="danger" size="sm">alert</Badge>);
    const el = screen.getByTestId('badge');
    expect(el).toHaveAttribute('data-variant', 'solid');
    expect(el).toHaveAttribute('data-color', 'danger');
    expect(el).toHaveAttribute('data-size', 'sm');
  });

  it('is not focusable (no tabindex, no interactive role)', () => {
    render(<Badge data-testid="badge">static</Badge>);
    const el = screen.getByTestId('badge');
    expect(el).not.toHaveAttribute('tabindex');
    expect(el.getAttribute('role')).toBeNull();
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>content</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Badge>accessible badge</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
