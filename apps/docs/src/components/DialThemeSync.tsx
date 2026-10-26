'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * Fumadocs' own theme toggle (rendered inside DocsLayout's sidebar footer, per the Docs Final Pass
 * order's standing decision 1 — chrome, including the toggle itself, is Fumadocs' job) drives
 * next-themes, which sets a `.dark` class on <html>. Dial's own dark CSS (dial-tokens/css/dark)
 * is scoped under `[data-theme="dark"]`, not `.dark` — this component is the one bridge that keeps
 * Dial's attribute in step with next-themes' class so both vocabularies' dark-mode CSS activate
 * together, without a second hand-built toggle.
 */
export function DialThemeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [resolvedTheme]);

  return null;
}
