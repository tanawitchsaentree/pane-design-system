import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a span and defaults to variant=text', () => {
    render(<Skeleton data-testid="skeleton" />);
    const el = screen.getByTestId('skeleton');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveAttribute('data-variant', 'text');
  });

  it('is aria-hidden (no content of its own to announce)', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the variant data attribute', () => {
    render(<Skeleton data-testid="skeleton" variant="circle" />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-variant', 'circle');
  });

  it('applies width/height as CSS custom properties consumed by the module CSS', () => {
    render(<Skeleton data-testid="skeleton" width={120} height="2rem" />);
    const el = screen.getByTestId('skeleton');
    expect(el.style.getPropertyValue('--ds-skeleton-inline-size')).toBe('120px');
    expect(el.style.getPropertyValue('--ds-skeleton-block-size')).toBe('2rem');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Skeleton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
