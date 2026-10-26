'use client';

import { useState } from 'react';

/**
 * Interactive motion rows — needs client state for the Toggle button, so unlike
 * TypographyDemos/SpacingDemos (plain server components, just a resolved-value read) this is a
 * 'use client' file, same reasoning as every dial-react component demo wrapper in this directory.
 * Duration/transition values themselves are resolved at build time via resolveTokens() in the
 * parent page.mdx and passed in as `resolvedValue`.
 */
export function DurationRow({ name, resolvedValue }: { name: string; resolvedValue: string }) {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)', marginBlockEnd: 'var(--ds-space-stack-sm)' }}>
      <div style={{ inlineSize: 90, fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-subtle)' }}>
        {name} ({resolvedValue})
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        style={{
          border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
          borderRadius: 'var(--ds-radius-sm)',
          background: 'var(--ds-color-surface-raised)',
          color: 'var(--ds-color-text-default)',
          padding: 'var(--ds-space-inset-sm) var(--ds-space-inline-md)',
          cursor: 'var(--ds-cursor-pointer)',
          fontSize: 'var(--ds-font-size-xs)',
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

export function TransitionRow({ name, resolvedValue }: { name: string; resolvedValue: string }) {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)', marginBlockEnd: 'var(--ds-space-stack-sm)' }}>
      <div style={{ inlineSize: 110, fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-subtle)' }}>
        {name} ({resolvedValue})
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        style={{
          border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
          borderRadius: 'var(--ds-radius-sm)',
          background: 'var(--ds-color-surface-raised)',
          color: 'var(--ds-color-text-default)',
          padding: 'var(--ds-space-inset-sm) var(--ds-space-inline-md)',
          cursor: 'var(--ds-cursor-pointer)',
          fontSize: 'var(--ds-font-size-xs)',
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
          transition: `transform var(--ds-transition-${name}), opacity var(--ds-transition-${name})`,
        }}
      />
    </div>
  );
}
