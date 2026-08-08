import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders a native radio input', () => {
    render(<Radio aria-label="Option A" name="group" />);
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument();
  });

  it('works as an uncontrolled group via defaultChecked', () => {
    render(
      <>
        <Radio aria-label="A" name="uncontrolled" value="a" defaultChecked />
        <Radio aria-label="B" name="uncontrolled" value="b" />
      </>,
    );
    expect(screen.getByRole('radio', { name: 'A' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'B' })).not.toBeChecked();
  });

  it('works as a controlled group via checked+onChange, only one selected at a time', async () => {
    function Controlled() {
      const [value, setValue] = useState('a');
      return (
        <>
          <Radio aria-label="A" name="controlled" value="a" checked={value === 'a'} onChange={() => setValue('a')} />
          <Radio aria-label="B" name="controlled" value="b" checked={value === 'b'} onChange={() => setValue('b')} />
        </>
      );
    }
    render(<Controlled />);
    const a = screen.getByRole('radio', { name: 'A' });
    const b = screen.getByRole('radio', { name: 'B' });
    expect(a).toBeChecked();
    await userEvent.click(b);
    expect(b).toBeChecked();
    expect(a).not.toBeChecked();
  });

  it('moves focus between same-name radios via Tab using native browser behavior', async () => {
    render(
      <>
        <Radio aria-label="A" name="keyboard" value="a" defaultChecked />
        <Radio aria-label="B" name="keyboard" value="b" />
      </>,
    );
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'A' })).toHaveFocus();
  });

  it('disables the input', () => {
    render(<Radio aria-label="Disabled" name="group" disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('forwards ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Radio aria-label="Ref radio" name="group" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Radio aria-label="Accessible A" name="a11y" value="a" defaultChecked />
        <Radio aria-label="Accessible B" name="a11y" value="b" />
      </>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
