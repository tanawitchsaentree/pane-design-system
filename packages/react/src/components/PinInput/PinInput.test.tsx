import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { PinInput } from './PinInput';

function getCells() {
  return screen.getAllByRole('textbox') as HTMLInputElement[];
}

describe('PinInput', () => {
  it('renders `length` cells', () => {
    render(<PinInput length={6} aria-label="Verification code" />);
    expect(getCells()).toHaveLength(6);
  });

  it('works as an uncontrolled field via defaultValue', () => {
    render(<PinInput length={4} defaultValue="12" aria-label="Code" />);
    const cells = getCells();
    expect(cells[0].value).toBe('1');
    expect(cells[1].value).toBe('2');
    expect(cells[2].value).toBe('');
  });

  it('works as a controlled field via value+onChange', async () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return <PinInput length={4} value={value} onChange={setValue} aria-label="Code" />;
    }
    render(<Controlled />);
    const cells = getCells();
    await userEvent.type(cells[0], '9');
    expect(cells[0].value).toBe('9');
  });

  it('auto-focuses the next cell after typing one character', async () => {
    render(<PinInput length={4} aria-label="Code" />);
    const cells = getCells();
    cells[0].focus();
    await userEvent.keyboard('5');
    expect(cells[1]).toHaveFocus();
  });

  it('calls onComplete once all cells are filled', async () => {
    const onComplete = vi.fn();
    render(<PinInput length={3} onComplete={onComplete} aria-label="Code" />);
    const cells = getCells();
    cells[0].focus();
    await userEvent.keyboard('123');
    expect(onComplete).toHaveBeenCalledWith('123');
  });

  it('moves focus to the previous cell and clears it on Backspace from an empty cell', async () => {
    render(<PinInput length={4} defaultValue="1" aria-label="Code" />);
    const cells = getCells();
    cells[1].focus();
    await userEvent.keyboard('{Backspace}');
    expect(cells[0]).toHaveFocus();
    expect(cells[0].value).toBe('');
  });

  it('clears the current cell on Backspace when it has a value (no focus move)', async () => {
    render(<PinInput length={4} defaultValue="12" aria-label="Code" />);
    const cells = getCells();
    cells[1].focus();
    await userEvent.keyboard('{Backspace}');
    expect(cells[1].value).toBe('');
    expect(cells[1]).toHaveFocus();
  });

  it('moves focus with ArrowLeft/ArrowRight without changing value', async () => {
    render(<PinInput length={4} defaultValue="12" aria-label="Code" />);
    const cells = getCells();
    cells[1].focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(cells[0]).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(cells[1]).toHaveFocus();
    expect(cells[0].value).toBe('1');
    expect(cells[1].value).toBe('2');
  });

  it('distributes a pasted multi-character string across cells starting at the focused one', async () => {
    render(<PinInput length={6} aria-label="Code" />);
    const cells = getCells();
    cells[0].focus();
    await userEvent.paste('123456');
    expect(cells.map((c) => c.value)).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('ignores non-digit paste content by default (numericOnly)', async () => {
    render(<PinInput length={4} aria-label="Code" />);
    const cells = getCells();
    cells[0].focus();
    await userEvent.paste('1a2b');
    expect(cells.map((c) => c.value)).toEqual(['1', '2', '', '']);
  });

  it('disables every cell when disabled', () => {
    render(<PinInput length={4} disabled aria-label="Code" />);
    getCells().forEach((cell) => expect(cell).toBeDisabled());
  });

  it('marks every cell aria-invalid when invalid', () => {
    render(<PinInput length={4} invalid aria-label="Code" />);
    getCells().forEach((cell) => expect(cell).toHaveAttribute('aria-invalid', 'true'));
  });

  it('exposes an accessible group name and per-cell position labels', () => {
    render(<PinInput length={3} aria-label="Verification code" />);
    expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument();
    expect(screen.getByLabelText('Digit 1 of 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Digit 3 of 3')).toBeInTheDocument();
  });

  it('forwards ref to the group container', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PinInput length={4} ref={ref} aria-label="Code" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<PinInput length={6} aria-label="Accessible verification code" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
