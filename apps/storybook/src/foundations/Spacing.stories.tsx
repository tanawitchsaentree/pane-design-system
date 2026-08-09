import type { Meta, StoryObj } from '@storybook/react';
import { useCssVar, FoundationSection } from './_shared';

const meta: Meta = {
  title: 'Foundations/Spacing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'D-003: an 8px base unit. Every `space.*` step below is a multiple of 8px, read live ' +
          'from the built CSS variable — this is the same scale `Box`/`Flex`/`Stack`/`Grid`\'s ' +
          '`gap`/`padding` props draw from (D-002 web-first: `size.control.*` below is separately ' +
          'the minimum interactive hit-area floor, D-016).',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const SPACE_STEPS = ['0', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100'];
const CONTROL_SIZES = ['sm', 'md', 'lg', 'xl'];
const SEMANTIC_GROUPS: Array<['inset' | 'stack' | 'inline', string[]]> = [
  ['inset', ['sm', 'md', 'lg']],
  ['stack', ['sm', 'md', 'lg']],
  ['inline', ['sm', 'md', 'lg']],
];

function SpaceBar({ step }: { step: string }) {
  const value = useCssVar(`--ds-space-${step}`);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <div style={{ width: 70, fontFamily: 'var(--ds-font-family-mono)', fontSize: 12, color: 'var(--ds-color-text-subtle)' }}>
        space.{step}
      </div>
      <div style={{ height: 16, background: 'var(--ds-color-brand-500)', width: `var(--ds-space-${step})`, borderRadius: 2 }} />
      <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 12, color: 'var(--ds-color-text-subtle)' }}>
        {value || '…'}
      </div>
    </div>
  );
}

function ControlSizeBar({ size }: { size: string }) {
  const value = useCssVar(`--ds-size-control-${size}`);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <div style={{ width: 70, fontFamily: 'var(--ds-font-family-mono)', fontSize: 12, color: 'var(--ds-color-text-subtle)' }}>
        control.{size}
      </div>
      <div
        style={{
          inlineSize: `var(--ds-size-control-${size})`,
          blockSize: `var(--ds-size-control-${size})`,
          background: 'var(--ds-color-surface-inset)',
          border: '1px solid var(--ds-color-border-hairline)',
          borderRadius: 'var(--ds-radius-sm)',
        }}
      />
      <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 12, color: 'var(--ds-color-text-subtle)' }}>
        {value || '…'}
      </div>
    </div>
  );
}

export const Scale: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The full space.* scale — every step is a clean multiple of the 8px base unit (D-003).',
      },
    },
  },
  render: () => (
    <FoundationSection title="space.*">
      {SPACE_STEPS.map((step) => (
        <SpaceBar key={step} step={step} />
      ))}
    </FoundationSection>
  ),
};

export const ControlSizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'size.control.* — the height every interactive control (Button, Input, Checkbox\'s hit ' +
          'area, etc.) is built against. sm=40px is the D-002 web-first minimum hit-area floor.',
      },
    },
  },
  render: () => (
    <FoundationSection title="size.control.*">
      {CONTROL_SIZES.map((size) => (
        <ControlSizeBar key={size} size={size} />
      ))}
    </FoundationSection>
  ),
};

export const SemanticSpacing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Purpose-named aliases (inset/stack/inline) that components reach for instead of a raw ' +
          'space.* step, so the intent (padding vs vertical rhythm vs horizontal rhythm) survives ' +
          'a future scale change.',
      },
    },
  },
  render: () => (
    <div>
      {SEMANTIC_GROUPS.map(([group, sizes]) => (
        <FoundationSection key={group} title={`space.${group}.*`}>
          {sizes.map((size) => (
            <SpaceSemanticBar key={size} group={group} size={size} />
          ))}
        </FoundationSection>
      ))}
    </div>
  ),
};

function SpaceSemanticBar({ group, size }: { group: string; size: string }) {
  const value = useCssVar(`--ds-space-${group}-${size}`);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <div style={{ width: 90, fontFamily: 'var(--ds-font-family-mono)', fontSize: 12, color: 'var(--ds-color-text-subtle)' }}>
        {group}.{size}
      </div>
      <div style={{ height: 16, background: 'var(--ds-color-brand-500)', width: `var(--ds-space-${group}-${size})`, borderRadius: 2 }} />
      <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 12, color: 'var(--ds-color-text-subtle)' }}>
        {value || '…'}
      </div>
    </div>
  );
}
