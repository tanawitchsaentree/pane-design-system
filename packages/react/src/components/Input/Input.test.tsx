import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders a native input', () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
  });

  it('defaults to size=md', () => {
    render(<Input aria-label="Name" data-testid="wrapper" />);
    // wrapper is the parent span
    const input = screen.getByRole('textbox');
    expect(input.parentElement).toHaveAttribute('data-size', 'md');
  });

  it('works as an uncontrolled input via defaultValue', async () => {
    render(<Input aria-label="Name" defaultValue="initial" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial');
    await userEvent.type(input, ' more');
    expect(input.value).toBe('initial more');
  });

  it('works as a controlled input via value+onChange', async () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return <Input aria-label="Controlled" value={value} onChange={(e) => setValue(e.target.value)} />;
    }
    render(<Controlled />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, 'hello');
    expect(input.value).toBe('hello');
  });

  it('sets aria-invalid and the invalid data attribute when invalid', () => {
    render(<Input aria-label="Email" invalid />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.parentElement).toHaveAttribute('data-invalid');
  });

  it('disables the input and marks the wrapper disabled', () => {
    render(<Input aria-label="Name" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input.parentElement).toHaveAttribute('data-disabled');
  });

  it('supports readOnly (still focusable, not disabled)', () => {
    render(<Input aria-label="Name" readOnly value="fixed" onChange={() => {}} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveAttribute('readonly');
    expect(input).not.toBeDisabled();
  });

  it('renders leftElement and rightElement adornments', () => {
    render(
      <Input
        aria-label="Amount"
        leftElement={<span data-testid="left">$</span>}
        rightElement={<span data-testid="right">USD</span>}
      />,
    );
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('fires onChange when typing', async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Name" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Input aria-label="Accessible input" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations when invalid', async () => {
    const { container } = render(<Input aria-label="Accessible invalid input" invalid />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
