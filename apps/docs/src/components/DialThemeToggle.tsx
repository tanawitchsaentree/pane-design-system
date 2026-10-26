'use client';

import { useLayoutEffect, useState } from 'react';
import { useTheme } from 'next-themes';

/**
 * Replaces fumadocs-ui@14.7.7's built-in `ThemeToggle` (`mode: 'light-dark'`, its default) via
 * `DocsLayout`'s own documented `disableThemeSwitch` + `sidebar.footer` extension point — per the
 * Docs Final Pass order's rule to extend a framework through its own API, not fork its layout.
 * Confirmed upstream gap (logged in BACKLOG.md): the built-in toggle in `light-dark` mode renders
 * a bare `<button data-theme-toggle>` with only an SVG icon child and no `aria-label`/
 * `aria-labelledby` — grepped `node_modules/fumadocs-ui/dist/components/layout/theme-toggle.js`
 * directly to confirm (its `light-dark` branch has no `aria-label`; only its separate
 * three-way `system` mode branch does, via a per-button `key`). This component is a straight
 * behavioral copy of that same `light-dark` branch, with a real `aria-label` added.
 */
export function DialThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const value = mounted ? resolvedTheme : null;

  return (
    <button
      type="button"
      className="p-0 md:order-first"
      data-theme-toggle=""
      aria-label={value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(value === 'light' ? 'dark' : 'light')}
    >
      {value === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
