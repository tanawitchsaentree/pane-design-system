import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Center } from './Center';

describe('Center', () => {
  it('fixes align and justify to center', () => {
    render(<Center data-testid="center">content</Center>);
    const el = screen.getByTestId('center');
    expect(el).toHaveAttribute('data-align', 'center');
    expect(el).toHaveAttribute('data-justify', 'center');
  });

  it('still accepts direction/gap from Flex', () => {
    render(
      <Center data-testid="center" direction="row" gap="200">
        content
      </Center>,
    );
    const el = screen.getByTestId('center');
    expect(el).toHaveAttribute('data-direction', 'row');
    expect(el).toHaveAttribute('data-gap', '200');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Center ref={ref}>content</Center>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Center>accessible content</Center>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
