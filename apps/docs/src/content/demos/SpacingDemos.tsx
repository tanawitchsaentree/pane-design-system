import { resolveTokens } from '@/lib/tokens';

/** Build-time equivalent of apps/storybook/src/foundations/Spacing.stories.tsx's bar rows. */
export function SpaceBar({ step }: { step: string }) {
  const [{ light }] = resolveTokens([`space-${step}`]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)', marginBlockEnd: 'var(--ds-space-stack-sm)' }}>
      <div style={{ inlineSize: 90, fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-subtle)' }}>
        space.{step}
      </div>
      <div style={{ blockSize: 16, background: 'var(--ds-color-brand-500)', inlineSize: `var(--ds-space-${step})`, borderRadius: 'var(--ds-radius-sm)' }} />
      <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-subtle)' }}>{light}</div>
    </div>
  );
}

export function SpaceSemanticBar({ group, size }: { group: string; size: string }) {
  const [{ light }] = resolveTokens([`space-${group}-${size}`]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)', marginBlockEnd: 'var(--ds-space-stack-sm)' }}>
      <div style={{ inlineSize: 110, fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-subtle)' }}>
        {group}.{size}
      </div>
      <div style={{ blockSize: 16, background: 'var(--ds-color-brand-500)', inlineSize: `var(--ds-space-${group}-${size})`, borderRadius: 'var(--ds-radius-sm)' }} />
      <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-subtle)' }}>{light}</div>
    </div>
  );
}

export function ControlSizeBar({ size }: { size: string }) {
  const [{ light }] = resolveTokens([`size-control-${size}`]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)', marginBlockEnd: 'var(--ds-space-stack-sm)' }}>
      <div style={{ inlineSize: 90, fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-subtle)' }}>
        control.{size}
      </div>
      <div
        style={{
          inlineSize: `var(--ds-size-control-${size})`,
          blockSize: `var(--ds-size-control-${size})`,
          background: 'var(--ds-color-surface-inset)',
          border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
          borderRadius: 'var(--ds-radius-sm)',
        }}
      />
      <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-subtle)' }}>{light}</div>
    </div>
  );
}
