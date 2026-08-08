import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Spacer } from './Spacer';

describe('Spacer', () => {
  it('renders with no size attribute by default (flex:1 grow behavior)', () => {
    render(<Spacer data-testid="spacer" />);
    expect(screen.getByTestId('spacer')).not.toHaveAttribute('data-size');
  });

  it('applies the size prop as a data attribute', () => {
    render(<Spacer data-testid="spacer" size="400" />);
    expect(screen.getByTestId('spacer')).toHaveAttribute('data-size', '400');
  });

  it('is hidden from the accessibility tree', () => {
    render(<Spacer data-testid="spacer" />);
    expect(screen.getByTestId('spacer')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Spacer ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Spacer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
