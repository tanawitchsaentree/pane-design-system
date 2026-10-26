'use client';

/**
 * All of a page's live dial-react renders live in one client-boundary file like this one, per
 * component. Necessary because dial-react's own components have no "use client" directive in
 * their source (correct for a plain component library — not something to add there) and use
 * hooks internally, so importing them into a Server Component (which page.mdx is, by default)
 * fails at build time. The page.mdx file itself never imports dial-react directly — it only
 * imports the named exports below and passes them to <Demo>.
 */
import { Label, Textarea } from 'dial-react';

export function BasicLabel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-inline-sm)' }}>
      <Label htmlFor="label-demo-email">Email address</Label>
      <input id="label-demo-email" type="email" placeholder="you@example.com" />
    </div>
  );
}

export function RequiredLabel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-inline-sm)' }}>
      <Label htmlFor="label-demo-name" required>
        Full name
      </Label>
      <input id="label-demo-name" type="text" placeholder="Jane Doe" />
    </div>
  );
}

export function LabelWithTextarea() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-inline-sm)' }}>
      <Label htmlFor="label-demo-bio">Bio</Label>
      <Textarea id="label-demo-bio" placeholder="Tell us about yourself" />
    </div>
  );
}

export function AsChildLabel() {
  return (
    <Label asChild>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-inline-sm)' }}>
        <input type="checkbox" defaultChecked />
        Send me product updates
      </span>
    </Label>
  );
}
