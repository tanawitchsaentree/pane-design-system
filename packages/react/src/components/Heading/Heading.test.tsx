import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders h2 by default', () => {
    render(<Heading>Title</Heading>);
    const el = screen.getByRole('heading', { level: 2 });
    expect(el.tagName).toBe('H2');
  });

  it('renders the tag matching the level prop', () => {
    render(<Heading level={1}>Main title</Heading>);
    expect(screen.getByRole('heading', { level: 1 }).tagName).toBe('H1');
  });

  it('renders h6 for level 6', () => {
    render(<Heading level={6}>Smallest heading</Heading>);
    expect(screen.getByRole('heading', { level: 6 }).tagName).toBe('H6');
  });

  it('decouples visual size from level', () => {
    render(<Heading level={1} size="sm" data-testid="h">Small-looking h1</Heading>);
    const el = screen.getByTestId('h');
    expect(el.tagName).toBe('H1');
    expect(el).toHaveAttribute('data-size', 'sm');
  });

  it('defaults size based on level when size is omitted', () => {
    render(<Heading level={3} data-testid="h">Default size</Heading>);
    expect(screen.getByTestId('h')).toHaveAttribute('data-size', 'xl');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<Heading ref={ref}>content</Heading>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it('renders as the asChild element when set', () => {
    render(
      <Heading asChild level={2}>
        <div data-testid="not-a-heading">styled div</div>
      </Heading>,
    );
    expect(screen.getByTestId('not-a-heading').tagName).toBe('DIV');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Heading level={1}>accessible heading</Heading>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
