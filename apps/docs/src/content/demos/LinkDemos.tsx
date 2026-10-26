'use client';

import { Link, Text } from 'dial-react';

export function BasicLink() {
  return <Link href="/components/button">Read the Button docs</Link>;
}

export function LinkVariants() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Link href="#" variant="subtle">
        Subtle link
      </Link>
      <Link href="#" variant="default">
        Default (accent) link
      </Link>
    </div>
  );
}

export function LinkInSentence() {
  return (
    <Text>
      Every component in this system extends <Link href="/components/box">Box</Link> or one of
      its layout siblings — see the <Link href="/components/container">Container</Link> docs for
      how max-width capping composes with it.
    </Text>
  );
}

export function ExternalLink() {
  return (
    <Text>
      Read more on the{' '}
      <Link href="https://www.w3.org/WAI/WCAG21/quickref/" variant="default">
        WCAG 2.1 quick reference
      </Link>{' '}
      — cross-origin links like this one automatically open in a new tab with the correct
      security attributes.
    </Text>
  );
}
