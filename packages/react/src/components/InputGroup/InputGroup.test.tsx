import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { InputGroup } from './InputGroup';

describe('InputGroup', () => {
  it('renders children (the control) inside the group', () => {
    render(
      <InputGroup>
        <input aria-label="Amount" />
      </InputGroup>,
    );
    expect(screen.getByRole('textbox', { name: 'Amount' })).toBeInTheDocument();
  });

  it('renders a prefix adornment before the control', () => {
    render(
      <InputGroup prefix="$">
        <input aria-label="Price" />
      </InputGroup>,
    );
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders a suffix adornment after the control', () => {
    render(
      <InputGroup suffix="USD">
        <input aria-label="Price" />
      </InputGroup>,
    );
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('hides adornments from assistive tech', () => {
    render(
      <InputGroup prefix="$" suffix="USD">
        <input aria-label="Price" />
      </InputGroup>,
    );
    expect(screen.getByText('$')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('USD')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <InputGroup prefix="$" suffix="USD">
        <input aria-label="Accessible price" />
      </InputGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
