'use client';

/**
 * All of a page's live dial-react renders live in one client-boundary file like this one, per
 * component. See ButtonDemos.tsx for the full rationale.
 */
import { Box } from 'dial-react';

export function BasicBox() {
  return (
    <Box
      style={{
        padding: 'var(--ds-space-inset-md)',
        border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
        borderRadius: 'var(--ds-radius-md)',
        color: 'var(--ds-color-text-default)',
      }}
    >
      Plain Box — a styleable div with no variant/size prop of its own.
    </Box>
  );
}

export function BoxAsChildLink() {
  return (
    <Box
      asChild
      style={{
        display: 'inline-block',
        padding: 'var(--ds-space-inset-sm)',
        border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
        borderRadius: 'var(--ds-radius-md)',
        color: 'var(--ds-color-text-default)',
      }}
    >
      <a href="#">Box rendered as an anchor via asChild</a>
    </Box>
  );
}

export function BoxCardComposition() {
  return (
    <Box
      style={{
        padding: 'var(--ds-space-inset-lg)',
        border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
        borderRadius: 'var(--ds-radius-md)',
        backgroundColor: 'var(--ds-color-surface-raised)',
        maxInlineSize: 320,
      }}
    >
      <Box style={{ color: 'var(--ds-color-text-default)', fontWeight: 'var(--ds-font-weight-semibold)' }}>
        Plan renewal
      </Box>
      <Box
        style={{
          marginBlockStart: 'var(--ds-space-stack-sm)',
          color: 'var(--ds-color-text-subtle)',
        }}
      >
        Your subscription renews on the 1st of next month.
      </Box>
    </Box>
  );
}
