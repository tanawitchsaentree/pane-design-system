/**
 * The one real list of shipped example templates — read by the templates index page (for real
 * thumbnails/links) and by `scripts/template-audit.mjs` (for G-T1/G-T3/G-T4/G-T5). Never a second
 * hand-typed list duplicated elsewhere; add a template here once and every consumer picks it up.
 *
 * `requiredComponents` is the catalog-decision's own required-component list for this template
 * (PLAN.md's inventory scan) — G-T3 (inventory honesty) cross-checks this against the template's
 * actual import list, so this field must stay the real decision, not be padded or trimmed to make
 * the gate pass artificially.
 *
 * `sourcePath` points at the file that actually contains the composed page content — for a
 * template needing a client boundary (an event handler, `useState`, etc.), that's a separate
 * `{Name}Example.tsx` file, NOT `page.tsx` itself (Next.js App Router forbids a `"use client"`
 * file from exporting `metadata`, so `page.tsx` stays a thin Server Component wrapper in that
 * case). This path must always point at the file a reader actually wants to see/copy — the real
 * composed content, never the wrapper.
 */
export interface TemplateEntry {
  slug: string;
  title: string;
  description: string;
  skeleton: string;
  requiredComponents: string[];
  sourcePath: string;
}

export const TEMPLATES: TemplateEntry[] = [
  {
    slug: 'sign-in',
    title: 'Sign in',
    description: 'A focused, centered authentication form — email/password with a remember-me checkbox.',
    skeleton: 'centered-card',
    requiredComponents: ['FormField', 'Input', 'Checkbox', 'Button', 'Link', 'Card', 'Heading', 'Text'],
    sourcePath: 'examples/sign-in/SignInExample.tsx',
  },
  {
    slug: 'pricing',
    title: 'Pricing',
    description: 'A three-tier plan comparison using RadioCards as the plan selector.',
    skeleton: 'three-column-comparison',
    requiredComponents: ['RadioCards', 'Card', 'Badge', 'Button', 'Text', 'Heading', 'Divider', 'Container'],
    sourcePath: 'examples/pricing/PricingExample.tsx',
  },
  {
    slug: 'blog-article',
    title: 'Blog article',
    description: 'A single measured-prose article page with an author byline and related-posts list.',
    skeleton: 'measured-prose-single-column',
    requiredComponents: ['Heading', 'Text', 'Divider', 'Badge', 'Avatar', 'Link', 'Container', 'Card'],
    sourcePath: 'examples/blog-article/BlogArticleExample.tsx',
  },
  {
    slug: 'empty-state',
    title: 'Empty state',
    description: 'A centered icon-and-message pattern for a list/table with no data yet.',
    skeleton: 'centered-icon-message',
    requiredComponents: ['Icon', 'Heading', 'Text', 'Button', 'Center', 'Stack', 'Card', 'Link'],
    sourcePath: 'examples/empty-state/EmptyStateExample.tsx',
  },
  {
    slug: 'error-404',
    title: '404 error',
    description: 'A not-found page with an oversized error code, a search box, and popular-page links.',
    skeleton: 'centered-icon-message-error-code',
    requiredComponents: ['Heading', 'Text', 'Button', 'Center', 'Input', 'IconButton', 'Link', 'Divider'],
    sourcePath: 'examples/error-404/Error404Example.tsx',
  },
  {
    slug: 'dashboard',
    title: 'Dashboard',
    description: 'A persistent-shell admin dashboard — sidebar nav, stat cards, and a recent-activity table, composed entirely from layout primitives (no dedicated AppShell component exists yet — see BACKLOG.md).',
    skeleton: 'persistent-shell',
    requiredComponents: ['Stat', 'Card', 'Table', 'Badge', 'Button', 'IconButton', 'Divider', 'Flex', 'Stack', 'Box'],
    sourcePath: 'examples/dashboard/DashboardExample.tsx',
  },
];
