import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
  it('defaults to vertical direction (Flex column) and gap 300', () => {
    render(<Stack data-testid="stack">content</Stack>);
    const el = screen.getByTestId('stack');
    expect(el).toHaveAttribute('data-direction', 'column');
    expect(el).toHaveAttribute('data-gap', '300');
  });

  it('maps horizontal direction to Flex row', () => {
    render(
      <Stack data-testid="stack" direction="horizontal">
        content
      </Stack>,
    );
    expect(screen.getByTestId('stack')).toHaveAttribute('data-direction', 'row');
  });

  it('accepts a custom gap token', () => {
    render(
      <Stack data-testid="stack" gap="600">
        content
      </Stack>,
    );
    expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', '600');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref}>content</Stack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Stack>accessible content</Stack>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
