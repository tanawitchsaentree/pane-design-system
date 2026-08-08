import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders an input with role=switch', () => {
    render(<Switch aria-label="Notifications" />);
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('works as an uncontrolled switch via defaultChecked', () => {
    render(<Switch aria-label="Dark mode" defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('works as a controlled switch via checked+onChange', async () => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return <Switch aria-label="Controlled" checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
    }
    render(<Controlled />);
    const el = screen.getByRole('switch');
    expect(el).not.toBeChecked();
    await userEvent.click(el);
    expect(el).toBeChecked();
  });

  it('toggles via keyboard (Tab then Space) using native checkbox behavior', async () => {
    render(<Switch aria-label="Keyboard" />);
    await userEvent.tab();
    expect(screen.getByRole('switch')).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('disables the input', () => {
    render(<Switch aria-label="Disabled" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch aria-label="Ref switch" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Switch aria-label="Accessible switch" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
