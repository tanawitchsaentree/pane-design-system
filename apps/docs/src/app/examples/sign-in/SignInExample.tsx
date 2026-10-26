'use client';

/**
 * Example template — skeleton: centered-card (docs-engine-v2 template-catalog.md). Composes
 * FormField + Input + Checkbox + Button + Link + Card + Heading + Text, 8 distinct components
 * spanning Forms (FormField, Input, Checkbox), Atoms (Button, Link, Text, Heading), and Layout
 * (Card) — passes the composition floor (≥8 components, ≥3 categories).
 *
 * `"use client"` because the form's `onSubmit` handler is a function prop — Next.js Server
 * Components cannot pass functions as props, so any page with a real (even a no-op preventDefault)
 * event handler needs this boundary, same rule as every other interactive demo in this docs site.
 * Split into its own file (rather than living directly in page.tsx) so page.tsx itself can stay a
 * Server Component and export a real `metadata` object — Next.js App Router forbids exporting
 * `metadata` from a `"use client"` file.
 */
import { Card, Heading, Text, FormField, Input, Checkbox, Button, Link } from 'dial-react';

export function SignInExample() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--ds-space-inset-lg)',
        backgroundColor: 'var(--ds-color-surface-canvas)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Root>
          <Card.Body>
            <div style={{ marginBlockEnd: 'var(--ds-space-stack-lg)' }}>
              <Heading level={1} size="xl">
                Sign in to Acme
              </Heading>
              <Text color="subtle" size="sm">
                Welcome back — enter your details to continue.
              </Text>
            </div>
            <form
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-md)' }}
              onSubmit={(e) => e.preventDefault()}
            >
              <FormField label="Email" required>
                <Input type="email" placeholder="jane@acme.com" />
              </FormField>
              <FormField label="Password" required>
                <Input type="password" placeholder="••••••••" />
              </FormField>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
                <Checkbox />
                <Text size="sm">Remember me for 30 days</Text>
              </label>
              <Button type="submit" intent="primary" size="lg">
                Sign in
              </Button>
            </form>
            <Text size="sm" color="subtle" style={{ marginBlockStart: 'var(--ds-space-stack-md)', textAlign: 'center' }}>
              Don&apos;t have an account? <Link href="#">Sign up</Link>
            </Text>
          </Card.Body>
        </Card.Root>
      </div>
    </div>
  );
}
