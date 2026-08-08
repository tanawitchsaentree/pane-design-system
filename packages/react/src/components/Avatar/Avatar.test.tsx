import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders an img with the provided alt when src is given', () => {
    render(<Avatar src="/photo.jpg" alt="Jane Doe" />);
    const img = screen.getByRole('img', { name: 'Jane Doe' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/photo.jpg');
  });

  it('renders the fallback initials when no src is provided', () => {
    render(<Avatar fallback="JD" alt="Jane Doe" />);
    expect(screen.queryByRole('img', { name: 'Jane Doe' })).not.toBeNull();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('swaps to the fallback when the image fails to load (onError)', () => {
    render(<Avatar src="/broken.jpg" alt="Jane Doe" fallback="JD" />);
    const img = screen.getByRole('img', { name: 'Jane Doe' });
    fireEvent.error(img);
    expect(screen.queryByRole('img', { name: 'Jane Doe' })?.tagName).not.toBe('IMG');
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies size and shape data attributes', () => {
    render(<Avatar data-testid="avatar" fallback="JD" size="lg" shape="square" />);
    const el = screen.getByTestId('avatar');
    expect(el).toHaveAttribute('data-size', 'lg');
    expect(el).toHaveAttribute('data-shape', 'square');
  });

  it('defaults to size=md shape=circle', () => {
    render(<Avatar data-testid="avatar" fallback="JD" />);
    const el = screen.getByTestId('avatar');
    expect(el).toHaveAttribute('data-size', 'md');
    expect(el).toHaveAttribute('data-shape', 'circle');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} fallback="JD" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has no axe violations with an image', async () => {
    const { container } = render(<Avatar src="/photo.jpg" alt="Jane Doe" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations with a fallback', async () => {
    const { container } = render(<Avatar fallback="JD" alt="Jane Doe" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
