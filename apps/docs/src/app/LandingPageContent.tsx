'use client';

import NextLink from 'next/link';
import { Link, Button } from 'dial-react';
import type { NavCategory } from '@/lib/nav';
import type { TemplateEntry } from '@/lib/templates';

/**
 * Real landing page content — split into its own `"use client"` file so `page.tsx` can stay a
 * Server Component and pass real, build-time-computed data as props (`dial-react`'s own
 * components have no `"use client"` directive and use hooks internally, so importing them into a
 * Server Component fails at build time — same rule as every other page in this app that renders
 * a real dial-react component).
 *
 * SECOND PASS (first pass called out directly: "เหมือน anthropic/claude เลย ไม่เหมือน Braun เลย").
 * The first version applied Dial's real tokens onto a generic SaaS card-grid skeleton (floating
 * boxes, gaps, border-radius, per-card shadow-free-but-still-separated) — the exact "unstyled
 * template attractor" this system's own kiln process is built to avoid. Braun's actual radio
 * reference (system/DECISIONS.md D-001: cream body, single scarce accent only where a finger
 * touches, hierarchy from POSITION/BLOCK-SIZE not font-size, no decorative shadow) is a hardware
 * FRONT PANEL — one continuous plate with controls set INTO it, divided by hairlines, not a
 * pile of separate floating cards. Reinterpreted:
 * - One bordered plate (`.docs-panel`) holds every "control" section — stats, categories,
 *   examples — as hairline-divided rows, the same surface, not separate boxes with their own
 *   radius/shadow/gap between them.
 * - Stat numbers no longer use a jumped-up font-size against their labels (D-001 says hierarchy
 *   comes from position/block-size, not typography scale) — number and label share the same
 *   weight/size; position (number-then-label, tight together) carries the hierarchy instead.
 * - The scarce accent color appears on exactly ONE control on the whole page: the primary
 *   "Get started" button — nothing else on this page uses `intent="primary"` or the brand hue.
 */
export function LandingPageContent({
  totalComponents,
  a11yVerified,
  categories,
  templates,
  thumbnailManifest,
  repoUrl,
}: {
  totalComponents: number;
  a11yVerified: number;
  categories: NavCategory[];
  templates: TemplateEntry[];
  thumbnailManifest: Record<string, { filename: string }>;
  repoUrl?: string;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ds-color-surface-canvas)' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: 'var(--ds-space-inset-lg)' }}>
        {/* Hero — sits directly on the canvas, no card around it (the dial/tuning-window of the
            panel is the one element that isn't boxed in) — positioning line reused verbatim from
            /introduction (D-001's own lineage rationale), never a second invented version. */}
        <div style={{ paddingBlock: 'var(--ds-space-stack-lg)', maxWidth: '640px' }}>
          <h1 style={{ fontSize: 'var(--ds-font-size-3xl)', fontWeight: 'var(--ds-font-weight-semibold)', lineHeight: 'var(--ds-line-height-heading)', margin: 0 }}>
            Dial
          </h1>
          <p style={{ fontSize: 'var(--ds-font-size-lg)', color: 'var(--ds-color-text-subtle)', marginBlockStart: 'var(--ds-space-stack-sm)' }}>
            A Braun-derived design system — calm, restrained, and accent-scarce. One scarce accent
            color reserved for the single most important interactive element in a given view,
            never used to decorate or emphasize plain text.
          </p>
          <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)', alignItems: 'center', marginBlockStart: 'var(--ds-space-stack-md)' }}>
            <Button intent="primary" asChild>
              <NextLink href="/installation">Get started</NextLink>
            </Button>
            {/* A readout window, not a card — inset, mono, the way a radio's frequency display
                sits recessed into the panel rather than floating above it. */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: 'var(--ds-space-inset-sm) var(--ds-space-inset-md)',
                border: 'var(--ds-border-width-hairline) solid var(--ds-color-border-hairline)',
                backgroundColor: 'var(--ds-color-surface-raised)',
                fontFamily: 'var(--ds-font-family-mono)',
                fontSize: 'var(--ds-font-size-sm)',
                color: 'var(--ds-color-text-subtle)',
              }}
            >
              npm install dial-react dial-tokens
            </span>
          </div>
          {repoUrl && (
            <a href={repoUrl} style={{ display: 'inline-block', marginBlockStart: 'var(--ds-space-stack-sm)', color: 'var(--ds-color-text-subtle)', fontSize: 'var(--ds-font-size-sm)' }}>
              View source →
            </a>
          )}
        </div>

        {/* One continuous panel from here down — every section is a hairline-divided row on the
            SAME plate, matching a hardware front panel's controls set into one surface rather
            than a pile of separate floating cards each with their own border/radius/gap. */}
        <div className="docs-panel">
          {/* Stats readout — three cells divided by a vertical hairline, number and label sharing
              the same size/weight (D-001: hierarchy from position, not font-size jump); the
              number sits directly above its label, tight together, so POSITION reads as "this
              pair belongs together and the top one is the value" without any type-scale trick. */}
          <div className="docs-panel-row docs-panel-stats">
            <div className="docs-panel-stat">
              <div className="docs-panel-stat-value">{totalComponents}</div>
              <div className="docs-panel-stat-label">Components shipped</div>
            </div>
            <div className="docs-panel-stat">
              <div className="docs-panel-stat-value">{a11yVerified}</div>
              <div className="docs-panel-stat-label">Conformance-verified</div>
            </div>
            <div className="docs-panel-stat">
              <div className="docs-panel-stat-value">{templates.length}</div>
              <div className="docs-panel-stat-label">Full-page examples</div>
            </div>
          </div>

          {/* Component categories — each a flat control set into the panel (hairline-divided,
              fill-change on hover, no separate border/radius/shadow of its own), not a floating
              card grid. */}
          <div className="docs-panel-row docs-panel-section-label">Components</div>
          <div className="docs-panel-controls">
            {categories.map((cat) => (
              <NextLink key={cat.title} href={`/components/${cat.components[0].slug}`} className="docs-panel-control">
                <span className="docs-panel-control-title">{cat.title}</span>
                <span className="docs-panel-control-meta">
                  {cat.components.length} component{cat.components.length === 1 ? '' : 's'}
                </span>
              </NextLink>
            ))}
          </div>

          {/* Examples — same flat-control language, thumbnail standing in for a label since a
              template's shape is its own best preview. */}
          <div className="docs-panel-row docs-panel-section-label">
            <span>Examples</span>
            <Link asChild href="/examples" style={{ fontSize: 'var(--ds-font-size-sm)', fontWeight: 'var(--ds-font-weight-regular)' }}>
              <NextLink href="/examples">View all →</NextLink>
            </Link>
          </div>
          <div className="docs-panel-controls docs-panel-controls-thumbnails">
            {templates.slice(0, 3).map((template) => {
              const thumb = thumbnailManifest[template.slug];
              return (
                <NextLink
                  key={template.slug}
                  href={`/examples/${template.slug}`}
                  className="docs-panel-control docs-panel-control-thumbnail"
                  data-bleed="thumbnail image fills its frame edge-to-edge by design (spacing-engine L7)"
                >
                  <div className="docs-panel-thumbnail-frame">
                    {thumb && (
                      // eslint-disable-next-line @next/next/no-img-element -- static export, build-time-generated PNG
                      <img
                        src={`/template-thumbnails/${thumb.filename}`}
                        alt={`${template.title} template preview`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                      />
                    )}
                  </div>
                  <span className="docs-panel-control-title">{template.title}</span>
                </NextLink>
              );
            })}
          </div>
        </div>

        <div style={{ paddingBlock: 'var(--ds-space-stack-md)', display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
          <Link asChild href="/introduction">
            <NextLink href="/introduction">Read the introduction →</NextLink>
          </Link>
        </div>
      </div>
    </div>
  );
}
