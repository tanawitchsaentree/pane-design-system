import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  it('renders a native label associated with htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    const input = screen.getByLabelText('Email', { exact: false });
    expect(input).toBeInstanceOf(HTMLInputElement);
  });

  it('shows a visible required indicator plus a screen-reader equivalent', () => {
    render(<Label htmlFor="name" required>Name</Label>);
    expect(screen.getByText('*', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('(required)', { exact: false })).toBeInTheDocument();
  });

  it('does not render a required indicator by default', () => {
    render(<Label htmlFor="name">Name</Label>);
    expect(screen.queryByText('(required)', { exact: false })).not.toBeInTheDocument();
  });

  it('renders as the asChild element when set', () => {
    render(
      <Label asChild>
        <a href="#anchor" data-testid="anchor">
          Anchor label
        </a>
      </Label>,
    );
    const el = screen.getByTestId('anchor');
    expect(el.tagName).toBe('A');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="a11y-input">Accessible label</Label>
        <input id="a11y-input" />
      </>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
