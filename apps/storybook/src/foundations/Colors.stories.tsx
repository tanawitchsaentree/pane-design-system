import type { Meta, StoryObj } from '@storybook/react';
import { FoundationSection, Swatch } from './_shared';

const meta: Meta = {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'D-006/D-014: warm-neutral ramp from a cream base, with a single scarce accent (brand) ' +
          'reserved for the one thing a user should act on (D-001 accent scarcity). Every swatch ' +
          'below reads its hex value live from the actual built CSS variable — switch the theme ' +
          'toolbar above to see light/dark/contrast-more values update in place.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const NEUTRAL_STEPS = ['0', '25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', '975'];
const BRAND_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const ROLE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

export const Primitives: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The raw neutral + brand + role (success/warning/danger/info) ramps every semantic ' +
          'color token aliases from — never referenced directly by components (D-006).',
      },
    },
  },
  render: () => (
    <div>
      <FoundationSection title="Neutral">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {NEUTRAL_STEPS.map((step) => (
            <Swatch key={step} name={`--ds-color-neutral-${step}`} label={`neutral.${step}`} />
          ))}
        </div>
      </FoundationSection>
      <FoundationSection title="Brand (accent — reserved for the one interactive thing per view, D-001)">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {BRAND_STEPS.map((step) => (
            <Swatch key={step} name={`--ds-color-brand-${step}`} label={`brand.${step}`} />
          ))}
        </div>
      </FoundationSection>
      {(['success', 'warning', 'danger', 'info'] as const).map((role) => (
        <FoundationSection key={role} title={role}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {ROLE_STEPS.map((step) => (
              <Swatch key={step} name={`--ds-color-${role}-${step}`} label={`${role}.${step}`} />
            ))}
          </div>
        </FoundationSection>
      ))}
    </div>
  ),
};

export const Semantic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The tier every component actually consumes (never a primitive step directly): surface, ' +
          'text, border, and action tokens, each aliasing a specific primitive step for a reason ' +
          'documented in packages/tokens/src/semantic/light.json.',
      },
    },
  },
  render: () => (
    <div>
      <FoundationSection title="Surface">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['canvas', 'inset', 'raised', 'overlay'].map((name) => (
            <Swatch key={name} name={`--ds-color-surface-${name}`} label={`surface.${name}`} />
          ))}
        </div>
      </FoundationSection>
      <FoundationSection title="Text">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['default', 'subtle', 'disabled', 'inverse', 'on-primary', 'on-danger'].map((name) => (
            <Swatch key={name} name={`--ds-color-text-${name}`} label={`text.${name}`} />
          ))}
        </div>
      </FoundationSection>
      <FoundationSection title="Border">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['hairline', 'hairline-strong', 'interactive', 'subtle', 'focus', 'danger'].map((name) => (
            <Swatch key={name} name={`--ds-color-border-${name}`} label={`border.${name}`} />
          ))}
        </div>
      </FoundationSection>
      <FoundationSection title="Action — primary (the scarce accent)">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['default', 'hover', 'active', 'disabled'].map((name) => (
            <Swatch key={name} name={`--ds-color-action-primary-${name}`} label={`action.primary.${name}`} />
          ))}
        </div>
      </FoundationSection>
    </div>
  ),
};
