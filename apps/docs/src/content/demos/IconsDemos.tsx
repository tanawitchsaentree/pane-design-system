import { resolveTokens } from '@/lib/tokens';

/** Foundations/Icons size-scale swatch — shows a real square at the resolved size.icon.* value. */
export function IconSizeSwatch({ size }: { size: 'sm' | 'md' | 'lg' | 'xl' }) {
  const [{ light }] = resolveTokens([`size-icon-${size}`]);
  return (
    <div style={{ inlineSize: 96, fontSize: 'var(--ds-font-size-xs)', textAlign: 'center' }}>
      <div
        style={{
          inlineSize: `var(--ds-size-icon-${size})`,
          blockSize: `var(--ds-size-icon-${size})`,
          background: 'var(--ds-color-brand-500)',
          borderRadius: 'var(--ds-radius-sm)',
          marginInline: 'auto',
          marginBlockEnd: 'var(--ds-space-inset-sm)',
        }}
      />
      <div style={{ color: 'var(--ds-color-text-default)', fontWeight: 'var(--ds-font-weight-semibold)' }}>icon.{size}</div>
      <div style={{ color: 'var(--ds-color-text-subtle)', fontFamily: 'var(--ds-font-family-mono)' }}>{light}</div>
    </div>
  );
}
