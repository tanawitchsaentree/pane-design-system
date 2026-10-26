import { resolveTokens } from '@/lib/tokens';

/**
 * Foundations-page equivalent of apps/storybook/src/foundations/_shared.tsx's `Swatch` —
 * same idea (show a token's real resolved value, never a hardcoded hex), but read at build time
 * via resolveTokens() since this app is statically exported with no client-side token read.
 */
export function FoundationSwatch({ name, label }: { name: string; label?: string }) {
  const [{ light, dark }] = resolveTokens([name]);
  return (
    <div style={{ inlineSize: 96, fontSize: 'var(--ds-font-size-xs)' }}>
      <div
        style={{
          blockSize: 64,
          borderRadius: 'var(--ds-radius-md)',
          border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
          background: `var(--ds-${name})`,
          marginBlockEnd: 'var(--ds-space-inset-sm)',
        }}
      />
      <div style={{ color: 'var(--ds-color-text-default)', fontWeight: 'var(--ds-font-weight-semibold)' }}>
        {label ?? name.replace('color-', '')}
      </div>
      {/* Swatch background follows the live data-theme attribute via CSS var(); these two hex
       * values are resolved once at build time from light.css/dark.css so the correct one stays
       * legible no matter which theme is active, instead of only ever showing the light-mode hex. */}
      <div style={{ color: 'var(--ds-color-text-subtle)', fontFamily: 'var(--ds-font-family-mono)' }}>
        <span data-docs-theme-value="light">{light}</span>
        <span data-docs-theme-value="dark">{dark}</span>
      </div>
    </div>
  );
}
