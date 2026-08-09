import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { RadioCards } from './RadioCards';
import { FormField } from '../FormField/FormField';

// Honesty Rule (component-engineer.md / Radio.tsx precedent): jsdom has no real focus/layout
// model, so it cannot prove Arrow-key cycling between cards in the same group or roving tabindex
// after a keyboard move — those are native `name`-grouped-radio browser behavior, UNVERIFIED here
// on purpose, and instead proven by packages/conformance/specs/w5-radiocards.spec.ts (real
// Chromium/WebKit/Firefox via Playwright). What jsdom CAN prove and is asserted below: role wiring
// (radiogroup/radio), the accessible-name-from-wrapped-content computation (a static DOM fact),
// click-to-select via native label-wraps-input, controlled/uncontrolled selection,
// group-level and per-item disabled, forwardRef, and axe.

const PLANS = ['basic', 'pro', 'enterprise'] as const;

function BasicRadioCards(props: Partial<React.ComponentProps<typeof RadioCards>> = {}) {
  return (
    <RadioCards name="plan" aria-label="Plan" {...props}>
      <RadioCards.Item value="basic">Basic plan</RadioCards.Item>
      <RadioCards.Item value="pro">Pro plan</RadioCards.Item>
      <RadioCards.Item value="enterprise">Enterprise plan</RadioCards.Item>
    </RadioCards>
  );
}

describe('RadioCards', () => {
  it('renders role=radiogroup with the given aria-label, containing role=radio children', () => {
    render(<BasicRadioCards />);
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    const radios = PLANS.map((p) => screen.getByRole('radio', { name: `${p[0].toUpperCase()}${p.slice(1)} plan` }));
    expect(group).toBeInTheDocument();
    radios.forEach((r) => expect(r).toBeInTheDocument());
  });

  it("every card's wrapped content becomes its radio's accessible name (native label-wraps-input, no extra aria-label needed)", () => {
    render(<BasicRadioCards />);
    // getByRole with { name } throws if the accessible name doesn't resolve to exactly this text
    // — this is a static accessible-name computation jsdom can honestly prove, unlike focus/keyboard.
    expect(screen.getByRole('radio', { name: 'Pro plan' })).toBeInTheDocument();
  });

  it('every underlying input shares the given name (the entire mechanism native roving focus keys off of)', () => {
    render(<BasicRadioCards />);
    const radios = screen.getAllByRole('radio');
    expect(radios.every((r) => r.getAttribute('name') === 'plan')).toBe(true);
  });

  it('works as an uncontrolled group via defaultValue', () => {
    render(<BasicRadioCards defaultValue="pro" />);
    expect(screen.getByRole('radio', { name: 'Basic plan' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Pro plan' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Enterprise plan' })).not.toBeChecked();
  });

  it('works as a controlled group via value+onChange, clicking a card selects it and deselects the rest', async () => {
    function Controlled() {
      const [value, setValue] = useState('basic');
      return (
        <RadioCards name="plan-controlled" aria-label="Plan" value={value} onChange={setValue}>
          <RadioCards.Item value="basic">Basic plan</RadioCards.Item>
          <RadioCards.Item value="pro">Pro plan</RadioCards.Item>
          <RadioCards.Item value="enterprise">Enterprise plan</RadioCards.Item>
        </RadioCards>
      );
    }
    render(<Controlled />);
    const basic = screen.getByRole('radio', { name: 'Basic plan' });
    const pro = screen.getByRole('radio', { name: 'Pro plan' });
    expect(basic).toBeChecked();
    await userEvent.click(pro);
    expect(pro).toBeChecked();
    expect(basic).not.toBeChecked();
  });

  it('clicking anywhere in the card selects it (native label-wraps-input click forwarding, no onClick handler written by this component)', async () => {
    const onChange = vi.fn();
    render(<BasicRadioCards onChange={onChange} />);
    // Click the visible card text, not the (visually-hidden) radio role element directly — this is
    // what a real user's pointer actually lands on.
    await userEvent.click(screen.getByText('Enterprise plan'));
    expect(onChange).toHaveBeenCalledWith('enterprise');
    expect(screen.getByRole('radio', { name: 'Enterprise plan' })).toBeChecked();
  });

  it('disabled on the group disables every card', () => {
    render(<BasicRadioCards disabled defaultValue="pro" />);
    screen.getAllByRole('radio').forEach((r) => expect(r).toBeDisabled());
  });

  it("a card's own disabled disables just that card, leaving the rest of the group interactive", () => {
    render(
      <RadioCards name="plan-item-disabled" aria-label="Plan">
        <RadioCards.Item value="basic">Basic plan</RadioCards.Item>
        <RadioCards.Item value="pro" disabled>
          Pro plan
        </RadioCards.Item>
        <RadioCards.Item value="enterprise">Enterprise plan</RadioCards.Item>
      </RadioCards>,
    );
    expect(screen.getByRole('radio', { name: 'Basic plan' })).not.toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Pro plan' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Enterprise plan' })).not.toBeDisabled();
  });

  it('RadioCards.Item throws when rendered outside a RadioCards', () => {
    // Suppress the expected React error-boundary console.error noise for this one assertion.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<RadioCards.Item value="orphan">Orphan card</RadioCards.Item>)).toThrow(
      'RadioCards.Item must be rendered inside a RadioCards.',
    );
    spy.mockRestore();
  });

  it('forwards ref to the underlying div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioCards name="plan-ref" aria-label="Plan" ref={ref}>
        <RadioCards.Item value="only">Only plan</RadioCards.Item>
      </RadioCards>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('does not require aria-label when nested inside FormField (FormField supplies aria-labelledby)', () => {
    render(
      <FormField label="Choose a plan">
        <RadioCards name="plan-in-form-field">
          <RadioCards.Item value="basic">Basic plan</RadioCards.Item>
          <RadioCards.Item value="pro">Pro plan</RadioCards.Item>
        </RadioCards>
      </FormField>,
    );
    const group = screen.getByRole('radiogroup', { name: 'Choose a plan' });
    expect(group).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<BasicRadioCards defaultValue="pro" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
