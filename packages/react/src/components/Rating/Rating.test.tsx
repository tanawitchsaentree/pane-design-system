import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Rating } from './Rating';

describe('Rating', () => {
  it('renders a radiogroup with `max` native radio inputs', () => {
    render(<Rating aria-label="Rate this" name="group" max={5} />);
    expect(screen.getByRole('radiogroup', { name: 'Rate this' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('gives every star its own "{n} star(s) of {max}" accessible name', () => {
    render(<Rating aria-label="Rate this" name="group-names" max={3} />);
    expect(screen.getByRole('radio', { name: '1 star of 3' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '2 stars of 3' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '3 stars of 3' })).toBeInTheDocument();
  });

  it('works as an uncontrolled rating via defaultValue', () => {
    render(<Rating aria-label="Rate this" name="uncontrolled" defaultValue={3} />);
    expect(screen.getByRole('radio', { name: '3 stars of 5' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '4 stars of 5' })).not.toBeChecked();
  });

  it('works as a controlled rating via value+onChange, only one star selected at a time', async () => {
    function Controlled() {
      const [value, setValue] = useState(2);
      return <Rating aria-label="Rate this" name="controlled" value={value} onChange={setValue} />;
    }
    render(<Controlled />);
    expect(screen.getByRole('radio', { name: '2 stars of 5' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: '4 stars of 5' }));
    expect(screen.getByRole('radio', { name: '4 stars of 5' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '2 stars of 5' })).not.toBeChecked();
  });

  it('fires onChange with the picked star count when uncontrolled', async () => {
    let lastValue: number | undefined;
    render(<Rating aria-label="Rate this" name="uncontrolled-onchange" onChange={(v) => (lastValue = v)} />);
    await userEvent.click(screen.getByRole('radio', { name: '4 stars of 5' }));
    expect(lastValue).toBe(4);
    expect(screen.getByRole('radio', { name: '4 stars of 5' })).toBeChecked();
  });

  it('moves focus between stars via Tab using native radio-group behavior', async () => {
    render(<Rating aria-label="Rate this" name="keyboard" defaultValue={1} />);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: '1 star of 5' })).toHaveFocus();
  });

  it('disables every star', () => {
    render(<Rating aria-label="Rate this" name="disabled-group" disabled />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled();
    }
  });

  it('readOnly blocks click-driven selection change (native click activation is cancelled)', async () => {
    let onChangeCalled = false;
    render(
      <Rating
        aria-label="Average rating"
        name="readonly-group"
        defaultValue={3}
        readOnly
        onChange={() => (onChangeCalled = true)}
      />,
    );
    await userEvent.click(screen.getByRole('radio', { name: '5 stars of 5' }));
    expect(screen.getByRole('radio', { name: '3 stars of 5' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '5 stars of 5' })).not.toBeChecked();
    expect(onChangeCalled).toBe(false);
  });

  it('exposes aria-readonly="true" on the group when readOnly', () => {
    render(<Rating aria-label="Average rating" name="readonly-aria" readOnly defaultValue={4} />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
  });

  it('respects a custom max', () => {
    render(<Rating aria-label="Rate out of 10" name="max-ten" max={10} />);
    expect(screen.getAllByRole('radio')).toHaveLength(10);
  });

  it('forwards ref to the underlying radiogroup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Rating aria-label="Rate this" name="ref-group" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('role', 'radiogroup');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Rating aria-label="Accessible rating" name="a11y" defaultValue={3} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations when disabled', async () => {
    const { container } = render(<Rating aria-label="Accessible disabled rating" name="a11y-disabled" disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
