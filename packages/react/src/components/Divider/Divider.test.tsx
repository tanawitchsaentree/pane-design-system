import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('defaults to horizontal orientation and hairline variant', () => {
    render(<Divider data-testid="divider" />);
    const el = screen.getByTestId('divider');
    expect(el).toHaveAttribute('data-orientation', 'horizontal');
    expect(el).toHaveAttribute('data-variant', 'hairline');
  });

  it('exposes role=separator with aria-orientation for a11y', () => {
    render(<Divider orientation="vertical" />);
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies the hairline-strong variant', () => {
    render(<Divider data-testid="divider" variant="hairline-strong" />);
    expect(screen.getByTestId('divider')).toHaveAttribute('data-variant', 'hairline-strong');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Divider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Divider />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
