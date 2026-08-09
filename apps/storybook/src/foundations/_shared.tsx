import { useEffect, useState } from 'react';

/**
 * Reads a `--ds-*` CSS variable's live computed value from `document.documentElement` — never a
 * hardcoded hex/px string. This is the whole point of these Foundations pages (ORDERS A3): if a
 * token changes in `packages/tokens/build/css/*.css`, the page reflects it on next render, not on
 * next manual edit. Re-reads on the theme toolbar's `data-theme`/`data-contrast` attribute change
 * via a `MutationObserver`, since Storybook's theme switcher (see `preview.ts`) mutates those
 * attributes directly rather than remounting stories.
 */
export function useCssVar(name: string): string {
  const [value, setValue] = useState('');

  useEffect(() => {
    const read = () => {
      setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [name]);

  return value;
}

export function Swatch({ name, label }: { name: string; label?: string }) {
  const value = useCssVar(name);
  return (
    <div style={{ width: 96, fontSize: 12, fontFamily: 'var(--ds-font-family-sans)' }}>
      <div
        style={{
          height: 64,
          borderRadius: 'var(--ds-radius-md)',
          border: '1px solid var(--ds-color-border-hairline)',
          background: `var(${name})`,
          marginBottom: 6,
        }}
      />
      <div style={{ color: 'var(--ds-color-text-default)', fontWeight: 600 }}>
        {label ?? name.replace('--ds-color-', '')}
      </div>
      <div style={{ color: 'var(--ds-color-text-subtle)', fontFamily: 'var(--ds-font-family-mono)' }}>
        {value || '…'}
      </div>
    </div>
  );
}

export function FoundationSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          font: 'var(--ds-text-heading-sm)',
          color: 'var(--ds-color-text-default)',
          marginBottom: 16,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
