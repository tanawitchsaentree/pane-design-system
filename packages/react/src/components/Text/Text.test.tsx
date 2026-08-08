import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('renders a span by default with children', () => {
    render(<Text>hello</Text>);
    const el = screen.getByText('hello');
    expect(el.tagName).toBe('SPAN');
  });

  it('applies size/weight/color as data attributes mapped to tokens', () => {
    render(<Text data-testid="text" size="lg" weight="bold" color="subtle">styled</Text>);
    const el = screen.getByTestId('text');
    expect(el).toHaveAttribute('data-size', 'lg');
    expect(el).toHaveAttribute('data-weight', 'bold');
    expect(el).toHaveAttribute('data-color', 'subtle');
  });

  it('defaults to size=md weight=regular color=default', () => {
    render(<Text data-testid="text">default</Text>);
    const el = screen.getByTestId('text');
    expect(el).toHaveAttribute('data-size', 'md');
    expect(el).toHaveAttribute('data-weight', 'regular');
    expect(el).toHaveAttribute('data-color', 'default');
  });

  it('sets data-truncate when truncate is true', () => {
    render(<Text data-testid="text" truncate>long content</Text>);
    expect(screen.getByTestId('text')).toHaveAttribute('data-truncate', '');
  });

  it('omits data-truncate when truncate is false', () => {
    render(<Text data-testid="text">short</Text>);
    expect(screen.getByTestId('text')).not.toHaveAttribute('data-truncate');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Text ref={ref}>content</Text>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('renders as the asChild element for semantic tag override', () => {
    render(
      <Text asChild data-size="md">
        <p>paragraph text</p>
      </Text>,
    );
    const el = screen.getByText('paragraph text');
    expect(el.tagName).toBe('P');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Text>accessible text</Text>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
