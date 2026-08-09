import type { Meta, StoryObj } from '@storybook/react';
import { useCssVar, FoundationSection } from './_shared';

const meta: Meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'D-005: a flat 1.2 (Minor Third) type scale, one font family for both heading and body ' +
          '— hierarchy in this system comes from position/weight, not a tall size scale (D-001 ' +
          'Braun-derived: hardware controls establish hierarchy by placement, not typographic ' +
          'scale). Every sample below renders with the real `--ds-text-*` shorthand token, not a ' +
          'hardcoded font-size.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Sample({ token, sizeLabel }: { token: string; sizeLabel: string }) {
  const rawSize = useCssVar(`--ds-font-size-${sizeLabel}`);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
      <div
        style={{
          width: 90,
          fontFamily: 'var(--ds-font-family-mono)',
          fontSize: 12,
          color: 'var(--ds-color-text-subtle)',
        }}
      >
        {token} ({rawSize || '…'})
      </div>
      <div style={{ font: `var(${token})`, color: 'var(--ds-color-text-default)' }}>
        The quick brown fox jumps
      </div>
    </div>
  );
}

export const TypeScale: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Body and heading scales side by side — note both use the same family; only ' +
          'weight/line-height differ (heading: semibold/bold + tighter 1.15 line-height vs body: ' +
          'regular + 1.5).',
      },
    },
  },
  render: () => (
    <div>
      <FoundationSection title="Body">
        <Sample token="--ds-text-body-xs" sizeLabel="xs" />
        <Sample token="--ds-text-body-sm" sizeLabel="sm" />
        <Sample token="--ds-text-body-md" sizeLabel="md" />
        <Sample token="--ds-text-body-lg" sizeLabel="lg" />
      </FoundationSection>
      <FoundationSection title="Heading">
        <Sample token="--ds-text-heading-sm" sizeLabel="lg" />
        <Sample token="--ds-text-heading-md" sizeLabel="xl" />
        <Sample token="--ds-text-heading-lg" sizeLabel="2xl" />
        <Sample token="--ds-text-heading-xl" sizeLabel="3xl" />
        <Sample token="--ds-text-heading-2xl" sizeLabel="4xl" />
        <Sample token="--ds-text-heading-3xl" sizeLabel="5xl" />
      </FoundationSection>
      <FoundationSection title="Code">
        <Sample token="--ds-text-code-sm" sizeLabel="sm" />
        <Sample token="--ds-text-code-md" sizeLabel="md" />
      </FoundationSection>
    </div>
  ),
};

export const Weights: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The four font-weight steps the scale above composes from — regular/medium/semibold/bold.',
      },
    },
  },
  render: () => (
    <FoundationSection title="Weight">
      {(['regular', 'medium', 'semibold', 'bold'] as const).map((w) => (
        <div
          key={w}
          style={{
            fontSize: 19,
            fontWeight: `var(--ds-font-weight-${w})` as unknown as number,
            color: 'var(--ds-color-text-default)',
            marginBottom: 8,
          }}
        >
          {w} — The quick brown fox
        </div>
      ))}
    </FoundationSection>
  ),
};
