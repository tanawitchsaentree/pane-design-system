import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { buildPageTree } from '@/lib/pageTree';
import { DialThemeToggle } from '@/components/DialThemeToggle';
import { REACT_PACKAGE_VERSION } from '@/lib/version';

/**
 * Docs chrome (sidebar tree, right-rail TOC, responsive collapse) — scoped to the `(docs)` route
 * group so it wraps every content/reference page (Introduction, Foundations, Components, etc.)
 * but NOT `/examples/*` or the root landing page, both of which need to render full-bleed as real
 * standalone pages a reader could ship, not framed inside the docs site's own sidebar (confirmed
 * bug, docs-engine-v2 order: example templates were rendering inside DocsLayout's sidebar before
 * this route-group split existed — a full-page example framed by a docs sidebar defeats the point
 * of the template). `RootProvider`/`FumadocsTokenAdapter`/`DialThemeSync` stay in the root layout
 * since search and theming apply site-wide, not just to docs pages.
 */
export default function DocsGroupLayout({ children }: { children: React.ReactNode }) {
  const tree = buildPageTree();

  return (
    <DocsLayout
      tree={tree}
      nav={{
        title: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
            Dial
            <code style={{ fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-subtle)' }}>
              v{REACT_PACKAGE_VERSION}
            </code>
          </span>
        ),
      }}
      disableThemeSwitch
      sidebar={{ footer: <DialThemeToggle /> }}
    >
      {children}
    </DocsLayout>
  );
}
