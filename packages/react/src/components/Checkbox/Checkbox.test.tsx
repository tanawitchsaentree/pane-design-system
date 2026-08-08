import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders a native checkbox input', () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('works as an uncontrolled checkbox via defaultChecked', () => {
    render(<Checkbox aria-label="Subscribe" defaultChecked />);
    const el = screen.getByRole('checkbox') as HTMLInputElement;
    expect(el.checked).toBe(true);
  });

  it('works as a controlled checkbox via checked+onChange', async () => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return <Checkbox aria-label="Controlled" checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
    }
    render(<Controlled />);
    const el = screen.getByRole('checkbox') as HTMLInputElement;
    expect(el.checked).toBe(false);
    await userEvent.click(el);
    expect(el.checked).toBe(true);
  });

  it('toggles via keyboard (Tab to focus, Space to toggle) using native input behavior', async () => {
    const onChange = vi.fn();
    render(
      <>
        <button type="button">before</button>
        <Checkbox aria-label="Keyboard" onChange={onChange} />
      </>,
    );
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('checkbox')).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('sets the DOM indeterminate property and aria-checked=mixed when indeterminate', () => {
    render(<Checkbox aria-label="Select all" indeterminate readOnly checked={false} />);
    const el = screen.getByRole('checkbox') as HTMLInputElement;
    expect(el.indeterminate).toBe(true);
    expect(el).toHaveAttribute('aria-checked', 'mixed');
  });

  it('disables the input', () => {
    render(<Checkbox aria-label="Disabled" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox aria-label="Ref checkbox" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Checkbox aria-label="Accessible checkbox" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations when indeterminate', async () => {
    const { container } = render(<Checkbox aria-label="Accessible indeterminate" indeterminate readOnly checked={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
