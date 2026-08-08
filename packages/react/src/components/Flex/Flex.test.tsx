import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Flex } from './Flex';

describe('Flex', () => {
  it('defaults to row direction and nowrap', () => {
    render(<Flex data-testid="flex">content</Flex>);
    const el = screen.getByTestId('flex');
    expect(el).toHaveAttribute('data-direction', 'row');
    expect(el).toHaveAttribute('data-wrap', 'nowrap');
  });

  it('applies the direction prop', () => {
    render(<Flex data-testid="flex" direction="column">content</Flex>);
    expect(screen.getByTestId('flex')).toHaveAttribute('data-direction', 'column');
  });

  it('applies gap/align/justify as data attributes mapped to token-driven CSS', () => {
    render(
      <Flex data-testid="flex" gap="300" align="center" justify="between">
        content
      </Flex>,
    );
    const el = screen.getByTestId('flex');
    expect(el).toHaveAttribute('data-gap', '300');
    expect(el).toHaveAttribute('data-align', 'center');
    expect(el).toHaveAttribute('data-justify', 'between');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Flex ref={ref}>content</Flex>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('supports asChild polymorphism inherited from Box', () => {
    render(
      <Flex asChild data-testid="flex-anchor">
        <a href="#x">link</a>
      </Flex>,
    );
    expect(screen.getByTestId('flex-anchor').tagName).toBe('A');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Flex>accessible content</Flex>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
