'use client';

import NextLink from 'next/link';
import { Link } from 'dial-react';
import type { TemplateEntry } from '@/lib/templates';

/**
 * Templates index content — split into its own `"use client"` file so `page.tsx` stays a Server
 * Component (`dial-react`'s `Link` has no `"use client"` directive of its own and importing it
 * into a Server Component fails at build time, same rule as every template in this app).
 */
export function ExamplesIndexContent({
  templates,
  thumbnailManifest,
}: {
  templates: TemplateEntry[];
  thumbnailManifest: Record<string, { filename: string; hash: string }>;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ds-color-surface-canvas)', padding: 'var(--ds-space-inset-lg)' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <Link asChild href="/" style={{ fontSize: 'var(--ds-font-size-sm)' }}>
          <NextLink href="/">← Dial</NextLink>
        </Link>
        <h1 style={{ fontSize: 'var(--ds-font-size-3xl)', fontWeight: 'var(--ds-font-weight-semibold)', marginBlock: 'var(--ds-space-stack-md)' }}>
          Examples
        </h1>
        <p style={{ color: 'var(--ds-color-text-subtle)', maxWidth: '60ch', marginBlockEnd: 'var(--ds-space-stack-lg)' }}>
          Full-page templates composed entirely from Dial&apos;s own public components — real
          layouts you could ship, not isolated demos. Each page has its full source available to
          copy or download.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--ds-space-inline-lg)' }}>
          {templates.map((template) => {
            const thumb = thumbnailManifest[template.slug];
            return (
              <NextLink
                key={template.slug}
                href={`/examples/${template.slug}`}
                className="docs-template-card"
                data-bleed="thumbnail image fills its frame edge-to-edge by design (spacing-engine L7)"
              >
                <div style={{ aspectRatio: '16 / 10', overflow: 'hidden', borderBlockEnd: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)' }}>
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element -- static export, thumbnails are build-time-generated PNGs outside Next's image pipeline
                    <img
                      src={`/template-thumbnails/${thumb.filename}`}
                      alt={`${template.title} template preview`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ds-color-text-subtle)', fontSize: 'var(--ds-font-size-sm)' }}>
                      No thumbnail generated yet
                    </div>
                  )}
                </div>
                <div style={{ padding: 'var(--ds-space-inset-md)' }}>
                  <div style={{ fontWeight: 'var(--ds-font-weight-semibold)' }}>{template.title}</div>
                  <div style={{ fontSize: 'var(--ds-font-size-sm)', color: 'var(--ds-color-text-subtle)', marginBlockStart: 'var(--ds-space-stack-sm)' }}>
                    {template.description}
                  </div>
                </div>
              </NextLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
