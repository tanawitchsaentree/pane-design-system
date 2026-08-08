import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders a native textarea', () => {
    render(<Textarea aria-label="Bio" />);
    expect(screen.getByRole('textbox', { name: 'Bio' }).tagName).toBe('TEXTAREA');
  });

  it('defaults to size=md, rows=3, resize=vertical', () => {
    render(<Textarea aria-label="Bio" />);
    const el = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(el).toHaveAttribute('data-size', 'md');
    expect(el).toHaveAttribute('rows', '3');
    expect(el).toHaveAttribute('data-resize', 'vertical');
  });

  it('works as an uncontrolled field via defaultValue', async () => {
    render(<Textarea aria-label="Bio" defaultValue="initial" />);
    const el = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(el.value).toBe('initial');
    await userEvent.type(el, ' more');
    expect(el.value).toBe('initial more');
  });

  it('works as a controlled field via value+onChange', async () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return <Textarea aria-label="Controlled" value={value} onChange={(e) => setValue(e.target.value)} />;
    }
    render(<Controlled />);
    const el = screen.getByRole('textbox') as HTMLTextAreaElement;
    await userEvent.type(el, 'hi');
    expect(el.value).toBe('hi');
  });

  it('sets aria-invalid when invalid', () => {
    render(<Textarea aria-label="Bio" invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables the field', () => {
    render(<Textarea aria-label="Bio" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('accepts a custom rows count', () => {
    render(<Textarea aria-label="Bio" rows={6} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
  });

  it('forwards ref to the underlying textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Bio" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Textarea aria-label="Accessible textarea" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
