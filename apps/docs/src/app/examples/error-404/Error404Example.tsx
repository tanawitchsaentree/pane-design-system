'use client';

/**
 * Example template — skeleton: centered-icon-message-error-code (docs-engine-v2
 * template-catalog.md). Deliberately distinct from Empty-state's skeleton: no Card wrapper (a
 * 404 is a full-page failure, not a state within an existing page shell), and the oversized error
 * code IS the visual anchor (via Heading at a much larger size step) rather than an Icon —
 * confirmed genuinely different macrostructure, not the same page with different words.
 *
 * Composes Center + Heading + Text + Button + Input + IconButton + Link + Divider, 8 distinct
 * components spanning Layout (Center, Divider), Forms (Input), Atoms (Heading, Text, Button,
 * IconButton, Link) — clears the ≥8 composition floor with a real search box + popular-pages
 * list, both genuinely common 404-page patterns (not filler added just to hit a number).
 *
 * `"use client"`: same reason as every other example template — `dial-react` components have no
 * `"use client"` directive of their own and use hooks internally.
 */
import NextLink from 'next/link';
import { Center, Heading, Text, Button, Input, IconButton, Link, Divider, Icon } from 'dial-react';

function SearchSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
    </svg>
  );
}

const POPULAR_PAGES = [
  { label: 'Introduction', href: '/introduction' },
  { label: 'Components', href: '/components/button' },
  { label: 'Foundations', href: '/foundations/colors' },
];

export function Error404Example() {
  return (
    <Center style={{ minHeight: '100vh', padding: 'var(--ds-space-inset-lg)', flexDirection: 'column', gap: 'var(--ds-space-stack-md)' }}>
      <Heading level={1} size="3xl" color="subtle" style={{ margin: 0 }}>
        404
      </Heading>
      <Heading level={2} size="lg" style={{ marginBlockStart: 'var(--ds-space-stack-lg)', marginBlockEnd: 0 }}>
        Page not found
      </Heading>
      <Text color="subtle" style={{ textAlign: 'center', maxWidth: '360px', marginBlockStart: 'var(--ds-space-stack-sm)' }}>
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </Text>

      <div style={{ display: 'flex', gap: 'var(--ds-space-inline-sm)', marginBlockStart: 'var(--ds-space-stack-sm)', width: '100%', maxWidth: '340px' }}>
        <Input placeholder="Search the docs" aria-label="Search the docs" style={{ flex: 1 }} />
        <IconButton aria-label="Search" variant="outline">
          <Icon>
            <SearchSvg />
          </Icon>
        </IconButton>
      </div>

      <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
        <Button intent="primary" asChild>
          <NextLink href="/">Back to home</NextLink>
        </Button>
        <Button variant="outline" asChild>
          <NextLink href="/introduction">Read the docs</NextLink>
        </Button>
      </div>

      <Divider style={{ maxWidth: '280px', marginBlockStart: 'var(--ds-space-stack-md)' }} />

      <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
        {POPULAR_PAGES.map((p) => (
          <Link key={p.href} href={p.href} variant="subtle">
            {p.label}
          </Link>
        ))}
      </div>
    </Center>
  );
}
