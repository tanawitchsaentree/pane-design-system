import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
  it('defaults to size lg (D-002 anchor)', () => {
    render(<Container data-testid="container">content</Container>);
    expect(screen.getByTestId('container')).toHaveAttribute('data-size', 'lg');
  });

  it('applies the size prop', () => {
    render(
      <Container data-testid="container" size="sm">
        content
      </Container>,
    );
    expect(screen.getByTestId('container')).toHaveAttribute('data-size', 'sm');
  });

  it('supports the full size (no max-width cap)', () => {
    render(
      <Container data-testid="container" size="full">
        content
      </Container>,
    );
    expect(screen.getByTestId('container')).toHaveAttribute('data-size', 'full');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Container ref={ref}>content</Container>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Container>accessible content</Container>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
