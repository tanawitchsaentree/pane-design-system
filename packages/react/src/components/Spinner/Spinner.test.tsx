import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with role=status and a default accessible label', () => {
    render(<Spinner />);
    const el = screen.getByRole('status');
    expect(el).toHaveTextContent('Loading');
  });

  it('uses a custom label when provided', () => {
    render(<Spinner label="Saving changes" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saving changes');
  });

  it('applies the size data attribute', () => {
    render(<Spinner data-testid="spinner" size="lg" />);
    expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'lg');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
