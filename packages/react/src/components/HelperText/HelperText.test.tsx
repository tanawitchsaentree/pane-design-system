import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { HelperText } from './HelperText';

describe('HelperText', () => {
  it('renders a paragraph with the message', () => {
    render(<HelperText>Must be at least 8 characters</HelperText>);
    const el = screen.getByText('Must be at least 8 characters');
    expect(el.closest('p')).toBeInTheDocument();
  });

  it('defaults to tone=default', () => {
    render(<HelperText data-testid="helper">helper</HelperText>);
    const el = screen.getByTestId('helper');
    expect(el).toHaveAttribute('data-tone', 'default');
  });

  it('applies data-tone=error for tone="error"', () => {
    render(<HelperText data-testid="helper" tone="error">This field is required</HelperText>);
    const el = screen.getByTestId('helper');
    expect(el).toHaveAttribute('data-tone', 'error');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(<HelperText ref={ref}>Ref helper</HelperText>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<HelperText tone="error">Accessible helper</HelperText>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
