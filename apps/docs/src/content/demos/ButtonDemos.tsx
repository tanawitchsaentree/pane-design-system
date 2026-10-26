'use client';

/**
 * All of a page's live dial-react renders live in one client-boundary file like this one, per
 * component. Necessary because dial-react's own components have no "use client" directive in
 * their source (correct for a plain component library — not something to add there) and use
 * hooks internally, so importing them into a Server Component (which page.mdx is, by default)
 * fails at build time. The page.mdx file itself never imports dial-react directly — it only
 * imports the named exports below and passes them to <Demo>.
 */
import { Button } from 'dial-react';
import type { ControlSpec } from '@/components/mdx/Playground';

// dial-react's src/types.ts DOES define real runtime array constants for these
// (ACTION_INTENTS/CONTROL_SIZE_TOKENS, src/types.ts:40,52) — but packages/react/src/index.ts only
// re-exports the TYPES from './types' (`export type { ..., ActionIntent } from './types'`), never
// the runtime consts alongside them, so they aren't reachable through the public `dial-react`
// import at all. Logged to BACKLOG rather than edited (touching packages/react's own barrel is
// outside this order's forward-only scope) — these three arrays are transcribed by hand from the
// real type unions/exported consts' own literal values instead, not invented.
const BUTTON_VARIANTS = ['solid', 'outline', 'ghost', 'link'] as const; // ButtonVariant type, Button.tsx:8
const ACTION_INTENTS = ['primary', 'neutral', 'danger'] as const; // ActionIntent, types.ts:52 (same array, re-declared — see note above)
const CONTROL_SIZE_TOKENS = ['sm', 'md', 'lg', 'xl'] as const; // ControlSizeToken, types.ts:40 (same array, re-declared — see note above)

export const buttonPlaygroundControls: ControlSpec[] = [
  { type: 'enum', label: 'Variant', prop: 'variant', options: BUTTON_VARIANTS, default: 'solid' },
  { type: 'enum', label: 'Intent', prop: 'intent', options: ACTION_INTENTS, default: 'neutral' },
  { type: 'enum', label: 'Size', prop: 'size', options: CONTROL_SIZE_TOKENS, default: 'md' },
  { type: 'boolean', label: 'Loading', prop: 'loading', default: false },
  { type: 'boolean', label: 'Disabled', prop: 'disabled', default: false },
];

export { Button as ButtonPlaygroundComponent };

export function BasicButton() {
  return <Button intent="primary">Save changes</Button>;
}

export function ButtonVariants() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}

export function ButtonIntents() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Button intent="primary">Primary</Button>
      <Button intent="neutral">Neutral</Button>
      <Button intent="danger">Danger</Button>
    </div>
  );
}

export function ButtonLoading() {
  return <Button loading>Saving</Button>;
}

export function ButtonSizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-md)' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </div>
  );
}

export function ButtonDisabled() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Button disabled>Save changes</Button>
      <Button variant="outline" disabled>
        Cancel
      </Button>
    </div>
  );
}

function CheckSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ButtonWithIcon() {
  return (
    <Button intent="primary" leftIcon={<CheckSvg />}>
      Confirm
    </Button>
  );
}
