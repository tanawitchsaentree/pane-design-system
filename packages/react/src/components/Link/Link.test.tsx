import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('renders a native anchor with href', () => {
    render(<Link href="/about">About</Link>);
    const el = screen.getByRole('link', { name: 'About' });
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '/about');
  });

  it('defaults to variant=subtle', () => {
    render(<Link href="/about" data-testid="link">About</Link>);
    expect(screen.getByTestId('link')).toHaveAttribute('data-variant', 'subtle');
  });

  it('does not add target/rel for a same-origin relative href', () => {
    render(<Link href="/internal">Internal</Link>);
    const el = screen.getByRole('link', { name: 'Internal' });
    expect(el).not.toHaveAttribute('target');
    expect(el).not.toHaveAttribute('rel');
  });

  it('auto-adds target=_blank and rel=noopener noreferrer for a cross-origin absolute href', () => {
    render(<Link href="https://external.example.com/page">External</Link>);
    const el = screen.getByRole('link', { name: 'External' });
    expect(el).toHaveAttribute('target', '_blank');
    expect(el).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not override explicit target/rel props', () => {
    render(
      <Link href="https://external.example.com/page" target="_self" rel="nofollow">
        External
      </Link>,
    );
    const el = screen.getByRole('link', { name: 'External' });
    expect(el).toHaveAttribute('target', '_self');
    expect(el).toHaveAttribute('rel', 'nofollow');
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<Link href="/about" ref={ref}>About</Link>);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('renders as the asChild element when set', () => {
    render(
      <Link href="/about" asChild>
        <a href="/about" data-testid="custom-anchor">Custom anchor</a>
      </Link>,
    );
    expect(screen.getByTestId('custom-anchor')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Link href="/about">Accessible link</Link>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
