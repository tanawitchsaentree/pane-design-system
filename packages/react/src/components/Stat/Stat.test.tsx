import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Stat } from './Stat';

describe('Stat', () => {
  it('renders label and value', () => {
    render(<Stat label="Total revenue" value="$12,450" />);
    expect(screen.getByText('Total revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,450')).toBeInTheDocument();
  });

  it('renders no trend row when trend is omitted', () => {
    render(<Stat label="Signups" value="1,092" data-testid="stat" />);
    expect(screen.queryByText(/trending/i)).not.toBeInTheDocument();
  });

  it('renders the trend value text and an accessible direction label when trend is provided', () => {
    render(<Stat label="Total revenue" value="$12,450" trend={{ direction: 'up', value: '+12% this month' }} />);
    expect(screen.getByText('+12% this month')).toBeInTheDocument();
    // Icon renders role="img" + aria-label per direction (non-color cue — see Stat.tsx doc comment).
    expect(screen.getByRole('img', { name: 'Trending up' })).toBeInTheDocument();
  });

  it('gives each trend direction a distinct accessible label (down)', () => {
    render(<Stat label="Active users" value="8,204" trend={{ direction: 'down', value: '-3% this week' }} />);
    expect(screen.getByRole('img', { name: 'Trending down' })).toBeInTheDocument();
  });

  it('gives each trend direction a distinct accessible label (neutral)', () => {
    render(<Stat label="Support tickets" value="42" trend={{ direction: 'neutral', value: 'No change' }} />);
    expect(screen.getByRole('img', { name: 'No change' })).toBeInTheDocument();
  });

  it('sets data-direction on the trend row so CSS can key off it without relying on color alone', () => {
    render(<Stat label="Total revenue" value="$12,450" trend={{ direction: 'up', value: '+12%' }} data-testid="stat" />);
    const trendRow = screen.getByRole('img', { name: 'Trending up' }).closest('[data-direction]');
    expect(trendRow).toHaveAttribute('data-direction', 'up');
  });

  it('renders description text when provided', () => {
    render(<Stat label="Active users" value="8,204" description="Compared to last month" />);
    expect(screen.getByText('Compared to last month')).toBeInTheDocument();
  });

  it('renders no description when omitted', () => {
    render(<Stat label="Active users" value="8,204" />);
    expect(screen.queryByText(/compared to/i)).not.toBeInTheDocument();
  });

  it('accepts a ReactNode value, not just a string', () => {
    render(<Stat label="Average session" value={<span data-testid="rich-value">4m 32s</span>} />);
    expect(screen.getByTestId('rich-value')).toBeInTheDocument();
  });

  it('is not focusable and exposes no interactive role (T1: display-only, no onClick/onChange)', () => {
    render(<Stat label="Total revenue" value="$12,450" data-testid="stat" />);
    const el = screen.getByTestId('stat');
    expect(el).not.toHaveAttribute('tabindex');
    expect(el.getAttribute('role')).toBeNull();
  });

  it('forwards ref to the underlying DOM node', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stat ref={ref} label="Total revenue" value="$12,450" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations with a trend and description present', async () => {
    const { container } = render(
      <Stat
        label="Total revenue"
        value="$12,450"
        trend={{ direction: 'up', value: '+12% this month' }}
        description="Compared to last month"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations with no trend/description (minimal case)', async () => {
    const { container } = render(<Stat label="Signups" value="1,092" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
