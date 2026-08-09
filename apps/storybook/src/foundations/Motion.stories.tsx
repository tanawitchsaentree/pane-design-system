import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useCssVar, FoundationSection } from './_shared';

const meta: Meta = {
  title: 'Foundations/Motion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'D-009: default blueprint motion — no evidence in any reference image justified bending ' +
          'timing/easing from the standard scale, so this system keeps it as-is. `transition-*` ' +
          'shorthands compose a `duration.*` with a `cubic-bezier.*` easing curve; components pick ' +
          'the shorthand that matches their situation (enter/exit vs a plain hover/press state ' +
          'change) rather than assembling duration+easing by hand each time.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const DURATIONS = ['instant', 'fast', 'base', 'slow', 'slower'];
const TRANSITIONS = ['fast', 'base', 'slow', 'enter', 'exit'];

function DurationRow({ name }: { name: string }) {
  const [on, setOn] = useState(false);
  const value = useCssVar(`--ds-duration-${name}`);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <div style={{ width: 70, fontFamily: 'var(--ds-font-family-mono)', fontSize: 12, color: 'var(--ds-color-text-subtle)' }}>
        {name} ({value || '…'})
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        style={{
          border: '1px solid var(--ds-color-border-hairline)',
          borderRadius: 'var(--ds-radius-sm)',
          background: 'var(--ds-color-surface-raised)',
          color: 'var(--ds-color-text-default)',
          padding: '4px 10px',
          cursor: 'var(--ds-cursor-pointer)',
          fontSize: 12,
        }}
      >
        Toggle
      </button>
      <div
        style={{
          inlineSize: 32,
          blockSize: 32,
          borderRadius: 'var(--ds-radius-full)',
          background: 'var(--ds-color-brand-500)',
          transform: on ? 'translateX(120px)' : 'translateX(0)',
          transitionProperty: 'transform',
          transitionDuration: `var(--ds-duration-${name})`,
          transitionTimingFunction: 'var(--ds-cubic-bezier-standard)',
        }}
      />
    </div>
  );
}

function TransitionRow({ name }: { name: string }) {
  const [on, setOn] = useState(false);
  const value = useCssVar(`--ds-transition-${name}`);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <div style={{ width: 90, fontFamily: 'var(--ds-font-family-mono)', fontSize: 12, color: 'var(--ds-color-text-subtle)' }}>
        {name} ({value || '…'})
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        style={{
          border: '1px solid var(--ds-color-border-hairline)',
          borderRadius: 'var(--ds-radius-sm)',
          background: 'var(--ds-color-surface-raised)',
          color: 'var(--ds-color-text-default)',
          padding: '4px 10px',
          cursor: 'var(--ds-cursor-pointer)',
          fontSize: 12,
        }}
      >
        Toggle
      </button>
      <div
        style={{
          inlineSize: 32,
          blockSize: 32,
          borderRadius: 'var(--ds-radius-full)',
          background: 'var(--ds-color-brand-500)',
          opacity: on ? 1 : 0.15,
          transform: on ? 'scale(1)' : 'scale(0.6)',
          // transition.* is a full shorthand (duration + easing + delay) so it goes on the
          // `transition` property directly, not `transitionDuration` — unlike DurationRow above,
          // which composes duration.* with a plain easing curve by hand.
          transition: `transform var(--ds-transition-${name}), opacity var(--ds-transition-${name})`,
        }}
      />
    </div>
  );
}

export const Durations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Click Toggle on any row to see how instant/fast/base/slow/slower actually feel, side by side.',
      },
    },
  },
  render: () => (
    <FoundationSection title="duration.*">
      {DURATIONS.map((d) => (
        <DurationRow key={d} name={d} />
      ))}
    </FoundationSection>
  ),
};

export const Transitions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The composed shorthands components actually use — enter/exit have asymmetric easing ' +
          '(decelerate in, accelerate out) rather than reusing the same curve both ways.',
      },
    },
  },
  render: () => (
    <FoundationSection title="transition.*">
      {TRANSITIONS.map((t) => (
        <TransitionRow key={t} name={t} />
      ))}
    </FoundationSection>
  ),
};
