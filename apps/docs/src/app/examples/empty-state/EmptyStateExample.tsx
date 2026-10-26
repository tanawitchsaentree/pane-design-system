'use client';

/**
 * Example template — skeleton: centered-icon-message (docs-engine-v2 template-catalog.md). Distinct
 * from the 404 template's skeleton (centered-icon-message-error-code) per the template-contract's
 * "no two templates share the same page skeleton" test: this one has no oversized error code and
 * no navigation history context — it's a same-page state (a list/table with nothing in it yet),
 * not a different-route failure.
 *
 * Composes Center + Stack + Icon + Heading + Text + Button + Card + Link (a real "learn more"
 * secondary action, the common empty-state pairing with a primary CTA), 8 distinct components
 * spanning Layout (Center, Stack, Card), Atoms (Icon, Heading, Text, Button, Link) — clears the
 * ≥8 composition floor.
 *
 * `"use client"`: same reason as every other example template — `dial-react` components have no
 * `"use client"` directive of their own and use hooks internally, so importing them into a Server
 * Component fails at build time. Split into its own file so `page.tsx` stays a Server Component.
 */
import { Center, Stack, Icon, Heading, Text, Button, Card, Link } from 'dial-react';

function InboxSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4h16l-2 9H6L4 4z" strokeLinejoin="round" />
      <path d="M4 4l2 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l2-14" strokeLinejoin="round" />
      <path d="M9 13a3 3 0 0 0 6 0" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyStateExample() {
  return (
    <Center style={{ minHeight: '100vh', padding: 'var(--ds-space-inset-lg)' }}>
      <Card.Root style={{ maxWidth: '420px' }}>
        <Card.Body>
          <Stack gap="400" align="center" style={{ textAlign: 'center', padding: 'var(--ds-space-inset-lg)' }}>
            <Icon size="xl" color="subtle" label="Empty inbox">
              <InboxSvg />
            </Icon>
            <Stack gap="100" align="center">
              <Heading level={2} size="lg">
                No messages yet
              </Heading>
              <Text color="subtle" size="sm">
                When someone sends you a message, it&apos;ll show up here.
              </Text>
            </Stack>
            <Button intent="primary">Invite a teammate</Button>
            <Link href="#" variant="subtle">
              Learn how messages work
            </Link>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Center>
  );
}
