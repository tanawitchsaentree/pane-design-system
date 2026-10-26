import { resolveTokens } from '@/lib/tokens';

/**
 * Foundations/Typography sample rows — build-time equivalent of
 * apps/storybook/src/foundations/Typography.stories.tsx's `Sample`/weight rows. No client
 * interactivity needed (just a resolved value read), so this stays a plain server component,
 * unlike the dial-react component demo wrappers elsewhere in src/content/demos/.
 */
export function TypeSample({ token, sizeToken }: { token: string; sizeToken: string }) {
  const [{ light }] = resolveTokens([sizeToken]);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--ds-space-inline-lg)', marginBlockEnd: 'var(--ds-space-stack-sm)' }}>
      <div style={{ inlineSize: 140, fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-subtle)' }}>
        {token} ({light})
      </div>
      <div style={{ font: `var(${token})`, color: 'var(--ds-color-text-default)' }}>The quick brown fox jumps</div>
    </div>
  );
}

export function WeightSample({ weight }: { weight: 'regular' | 'medium' | 'semibold' | 'bold' }) {
  return (
    <div
      style={{
        fontSize: 'var(--ds-font-size-lg)',
        fontWeight: `var(--ds-font-weight-${weight})`,
        color: 'var(--ds-color-text-default)',
        marginBlockEnd: 'var(--ds-space-stack-sm)',
      }}
    >
      {weight} — The quick brown fox
    </div>
  );
}
