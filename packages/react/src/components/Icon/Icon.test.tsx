import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

const Star = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
  </svg>
);

describe('Icon', () => {
  it('renders the SVG child inside a span wrapper', () => {
    render(<Icon data-testid="icon"><Star /></Icon>);
    const el = screen.getByTestId('icon');
    expect(el.tagName).toBe('SPAN');
    expect(el.querySelector('svg')).not.toBeNull();
  });

  it('is aria-hidden by default (decorative)', () => {
    render(<Icon data-testid="icon"><Star /></Icon>);
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes role=img and aria-label when label is provided (meaningful icon)', () => {
    render(<Icon label="Star rating"><Star /></Icon>);
    const el = screen.getByRole('img', { name: 'Star rating' });
    expect(el).not.toHaveAttribute('aria-hidden');
  });

  it('applies the size data attribute', () => {
    render(<Icon data-testid="icon" size="lg"><Star /></Icon>);
    expect(screen.getByTestId('icon')).toHaveAttribute('data-size', 'lg');
  });

  it('defaults to currentColor (no data-color attribute)', () => {
    render(<Icon data-testid="icon"><Star /></Icon>);
    expect(screen.getByTestId('icon')).not.toHaveAttribute('data-color');
  });

  it('sets data-color when an explicit semantic color is requested', () => {
    render(<Icon data-testid="icon" color="subtle"><Star /></Icon>);
    expect(screen.getByTestId('icon')).toHaveAttribute('data-color', 'subtle');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Icon ref={ref}><Star /></Icon>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has no axe violations when decorative', async () => {
    const { container } = render(<Icon><Star /></Icon>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations when labeled', async () => {
    const { container } = render(<Icon label="Star rating"><Star /></Icon>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
