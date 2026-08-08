import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Kbd } from './Kbd';

describe('Kbd', () => {
  it('renders a native kbd element', () => {
    render(<Kbd>Esc</Kbd>);
    const el = screen.getByText('Esc');
    expect(el.tagName).toBe('KBD');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLElement>();
    render(<Kbd ref={ref}>Ctrl</Kbd>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('KBD');
  });

  it('merges consumer className with its own base class', () => {
    render(<Kbd className="consumer-class">Cmd</Kbd>);
    expect(screen.getByText('Cmd').className).toContain('consumer-class');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Kbd>Esc</Kbd>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
