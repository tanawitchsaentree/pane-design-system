import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider';
import { FumadocsTokenAdapter } from '@/lib/fumadocsTokenAdapter';
import { DialThemeSync } from '@/components/DialThemeSync';
import { DialSearchDialog } from '@/components/DialSearchDialog';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dial',
  description: 'Component library and design system documentation for Dial.',
};

/**
 * Site-wide providers only — token adapter, search, theme sync. DocsLayout (sidebar chrome) moved
 * to `(docs)/layout.tsx` (a route group, invisible in the URL) so it wraps only content/reference
 * pages, not `/examples/*` or the root landing page — both need to render full-bleed, without a
 * docs sidebar around them, to actually look like a real page a reader could ship (this is what
 * "full-page example template" means; framed inside the docs chrome, it's just another demo).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <FumadocsTokenAdapter />
        <RootProvider search={{ SearchDialog: DialSearchDialog }}>
          <DialThemeSync />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
