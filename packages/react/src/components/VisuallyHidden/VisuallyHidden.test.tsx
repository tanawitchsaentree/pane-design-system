import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders its children so they remain in the accessibility tree', () => {
    render(<VisuallyHidden>Close dialog</VisuallyHidden>);
    expect(screen.getByText('Close dialog')).toBeInTheDocument();
  });

  it('does not use display:none (would remove it from the a11y tree)', () => {
    render(<VisuallyHidden>hidden text</VisuallyHidden>);
    const el = screen.getByText('hidden text');
    expect(getComputedStyle(el).display).not.toBe('none');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<VisuallyHidden ref={ref}>content</VisuallyHidden>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<VisuallyHidden>accessible content</VisuallyHidden>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
