import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
  it('defaults to 12 columns (D-007)', () => {
    render(<Grid data-testid="grid">content</Grid>);
    const el = screen.getByTestId('grid');
    expect(el.style.getPropertyValue('--ds-grid-cols')).toBe('12');
  });

  it('applies a custom column count', () => {
    render(
      <Grid data-testid="grid" columns={4}>
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid').style.getPropertyValue('--ds-grid-cols')).toBe('4');
  });

  it('applies gap as a data attribute', () => {
    render(
      <Grid data-testid="grid" gap="300">
        content
      </Grid>,
    );
    expect(screen.getByTestId('grid')).toHaveAttribute('data-gap', '300');
  });

  it('sets responsive column vars per breakpoint', () => {
    render(
      <Grid data-testid="grid" columns={1} responsive={{ sm: 2, md: 3, lg: 4, xl: 6 }}>
        content
      </Grid>,
    );
    const el = screen.getByTestId('grid');
    expect(el.style.getPropertyValue('--ds-grid-cols-sm')).toBe('2');
    expect(el.style.getPropertyValue('--ds-grid-cols-md')).toBe('3');
    expect(el.style.getPropertyValue('--ds-grid-cols-lg')).toBe('4');
    expect(el.style.getPropertyValue('--ds-grid-cols-xl')).toBe('6');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Grid ref={ref}>content</Grid>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Grid>accessible content</Grid>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
