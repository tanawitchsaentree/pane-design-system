import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { AspectRatio } from './AspectRatio';

describe('AspectRatio', () => {
  it('applies a preset ratio as a data attribute', () => {
    render(<AspectRatio data-testid="ar" ratio="video">content</AspectRatio>);
    expect(screen.getByTestId('ar')).toHaveAttribute('data-ratio', 'video');
  });

  it('applies all documented presets', () => {
    const presets = ['square', 'video', 'photo', 'portrait', 'golden'] as const;
    for (const preset of presets) {
      const { unmount } = render(
        <AspectRatio data-testid={`ar-${preset}`} ratio={preset}>
          content
        </AspectRatio>,
      );
      expect(screen.getByTestId(`ar-${preset}`)).toHaveAttribute('data-ratio', preset);
      unmount();
    }
  });

  it('supports a numeric ratio as an escape hatch via inline style', () => {
    render(
      <AspectRatio data-testid="ar" ratio={2.5}>
        content
      </AspectRatio>,
    );
    const el = screen.getByTestId('ar');
    expect(el).not.toHaveAttribute('data-ratio');
    expect(el.style.aspectRatio).toBe('2.5');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<AspectRatio ref={ref} ratio="square">content</AspectRatio>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<AspectRatio ratio="video">accessible content</AspectRatio>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
