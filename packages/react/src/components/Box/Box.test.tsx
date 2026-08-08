import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Box } from './Box';

describe('Box', () => {
  it('renders a div by default with children', () => {
    render(<Box>hello</Box>);
    const el = screen.getByText('hello');
    expect(el.tagName).toBe('DIV');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Box ref={ref}>content</Box>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('spreads arbitrary dom props (data-*, aria-*)', () => {
    render(<Box data-testid="box-el" aria-label="box label" />);
    const el = screen.getByTestId('box-el');
    expect(el).toHaveAttribute('aria-label', 'box label');
  });

  it('merges consumer className with its own base class', () => {
    render(<Box data-testid="box-el" className="consumer-class" />);
    const el = screen.getByTestId('box-el');
    expect(el.className).toContain('consumer-class');
  });

  it('renders as the child element when asChild is set (polymorphism)', () => {
    render(
      <Box asChild>
        <a href="#target">link</a>
      </Box>,
    );
    const el = screen.getByRole('link', { name: 'link' });
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '#target');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Box>accessible content</Box>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
