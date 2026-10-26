'use client';

/**
 * Example template — skeleton: measured-prose-single-column (docs-engine-v2 template-catalog.md).
 * Composes Container + Heading + Text + Divider + Badge + Avatar + Link + Card, 8 distinct
 * components spanning Layout (Container, Divider), Atoms (Heading, Text, Badge, Avatar, Link),
 * and Data Display (Card) — passes the composition floor.
 *
 * `"use client"`: `dial-react`'s own components have no `"use client"` directive in their source
 * (correct for a plain component library, not something to add there) and several use hooks
 * internally — importing them into a Server Component fails at build time (`createContext`/
 * `useReducer`/`flushSync` errors), same rule already established for every component demo in
 * this docs site (see any `src/content/demos/*.tsx` file's own header comment). Split into its
 * own file so `page.tsx` can stay a Server Component and export real `metadata`.
 */
import { Container, Heading, Text, Divider, Badge, Avatar, Link, Card } from 'dial-react';

const RELATED = [
  { title: 'Why we chose a flat type scale', slug: '#flat-type-scale' },
  { title: 'Designing an accent-scarce color system', slug: '#accent-scarce-color' },
];

export function BlogArticleExample() {
  return (
    <Container size="md" style={{ paddingBlock: 'var(--ds-space-inset-lg)', maxWidth: '72ch' }}>
      <Badge variant="subtle" color="brand" size="sm">
        Engineering
      </Badge>
      <Heading level={1} size="2xl" style={{ marginBlockStart: 'var(--ds-space-stack-lg)' }}>
        Building a token pipeline that survives three themes
      </Heading>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-space-inline-sm)',
          marginBlockStart: 'var(--ds-space-stack-sm)',
          marginBlockEnd: 'var(--ds-space-stack-lg)',
        }}
      >
        <Avatar size="sm" fallback="RK" alt="Rin Kobayashi" />
        <div>
          <Text size="sm" weight="medium">
            Rin Kobayashi
          </Text>
          <Text size="xs" color="subtle">
            Published March 14 · 6 min read
          </Text>
        </div>
      </div>

      <Divider style={{ marginBlockEnd: 'var(--ds-space-stack-lg)' }} />

      <Text style={{ marginBlockEnd: 'var(--ds-space-stack-md)' }}>
        Every design token in this system resolves through exactly three tiers — primitive,
        semantic, and component — and that discipline is the only reason three themes (light,
        dark, and a high-contrast variant) can share one component codebase without a single
        conditional branch for &quot;which theme is active.&quot;
      </Text>
      <Text style={{ marginBlockEnd: 'var(--ds-space-stack-md)' }}>
        The rule is simple to state and easy to violate under deadline pressure: component code
        never references a primitive token directly, and never hardcodes a raw hex or pixel value.
        A linter enforces this on every commit, because the alternative — catching a violation in
        review — doesn&apos;t scale past a handful of components.
      </Text>
      <Heading level={2} size="lg" style={{ marginBlockStart: 'var(--ds-space-stack-lg)' }}>
        What actually breaks without this discipline
      </Heading>
      <Text style={{ marginBlockEnd: 'var(--ds-space-stack-md)' }}>
        The first casualty is always dark mode. A component that reaches past its semantic token
        straight to a primitive color step looks fine in the theme it was built against, and
        silently wrong in every other theme — because the primitive step it grabbed was never
        meant to carry meaning on its own, only to be aliased by something that does.
      </Text>

      <Divider style={{ marginBlock: 'var(--ds-space-stack-lg)' }} />

      <Heading level={2} size="md">
        Related
      </Heading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)', marginBlockStart: 'var(--ds-space-stack-sm)' }}>
        {RELATED.map((post) => (
          <Card.Root key={post.slug}>
            <Card.Body>
              <Link href={post.slug}>{post.title}</Link>
            </Card.Body>
          </Card.Root>
        ))}
      </div>
    </Container>
  );
}
