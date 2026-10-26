import { resolveTokens } from '@/lib/tokens';

/** @param names Token names without the --ds- prefix, e.g. "card-root-border". */
export function TokenList({ names }: { names: string[] }) {
  if (names.length === 0) {
    return <p className="docs-placeholder">This component defines no dedicated tokens of its own — it composes tokens from the components it reuses (see Related).</p>;
  }

  const tokens = resolveTokens(names);
  return (
    <table className="docs-token-table">
      <thead>
        <tr>
          <th>Token</th>
          <th>Light</th>
          <th>Dark</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => (
          <tr key={token.name}>
            <td>
              <code>--ds-{token.name}</code>
            </td>
            <td>
              <TokenSwatch value={token.light} />
            </td>
            <td>
              <TokenSwatch value={token.dark} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TokenSwatch({ value }: { value: string }) {
  const isColor = /^#|^rgb|^hsl|^oklch/.test(value);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
      {isColor && (
        <span
          style={{
            display: 'inline-block',
            inlineSize: 14,
            blockSize: 14,
            borderRadius: 'var(--ds-radius-sm)',
            border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
            backgroundColor: value,
          }}
        />
      )}
      <code>{value}</code>
    </span>
  );
}
