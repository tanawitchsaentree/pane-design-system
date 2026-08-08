import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';

const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
  </svg>
);

describe('IconButton', () => {
  it('renders a native button using aria-label as its accessible name', () => {
    render(
      <IconButton aria-label="Add to favorites">
        <Star />
      </IconButton>,
    );
    const el = screen.getByRole('button', { name: 'Add to favorites' });
    expect(el.tagName).toBe('BUTTON');
  });

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Add to favorites" onClick={onClick}>
        <Star />
      </IconButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled while loading and does not fire onClick', async () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Add to favorites" onClick={onClick} loading>
        <Star />
      </IconButton>,
    );
    const el = screen.getByRole('button', { name: 'Add to favorites' });
    expect(el).toBeDisabled();
    await userEvent.click(el);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton aria-label="Add to favorites" ref={ref}>
        <Star />
      </IconButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <IconButton aria-label="Add to favorites">
        <Star />
      </IconButton>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
