import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Image } from './Image';

describe('Image', () => {
  it('renders a native img with src/alt', () => {
    render(<Image src="/photo.jpg" alt="A scenic mountain" />);
    const img = screen.getByRole('img', { name: 'A scenic mountain' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/photo.jpg');
  });

  it('defaults to loading=lazy and fit=cover', () => {
    render(<Image src="/photo.jpg" alt="A scenic mountain" />);
    const img = screen.getByRole('img', { name: 'A scenic mountain' });
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('data-fit', 'cover');
  });

  it('renders without an AspectRatio wrapper when ratio is omitted', () => {
    render(<Image src="/photo.jpg" alt="A scenic mountain" data-testid="img" />);
    const img = screen.getByTestId('img');
    expect(img.parentElement).not.toHaveAttribute('data-ratio');
  });

  it('wraps in AspectRatio when ratio is provided', () => {
    render(<Image src="/photo.jpg" alt="A scenic mountain" ratio="video" data-testid="img" />);
    const img = screen.getByTestId('img');
    expect(img.parentElement).toHaveAttribute('data-ratio', 'video');
  });

  it('applies the radius data attribute', () => {
    render(<Image src="/photo.jpg" alt="A scenic mountain" radius="lg" />);
    expect(screen.getByRole('img')).toHaveAttribute('data-radius', 'lg');
  });

  it('forwards ref to the underlying img element', () => {
    const ref = createRef<HTMLImageElement>();
    render(<Image src="/photo.jpg" alt="A scenic mountain" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Image src="/photo.jpg" alt="A scenic mountain" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations with ratio', async () => {
    const { container } = render(<Image src="/photo.jpg" alt="A scenic mountain" ratio="square" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
