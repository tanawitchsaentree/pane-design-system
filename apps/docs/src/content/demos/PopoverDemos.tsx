'use client';

/**
 * All of a page's live dial-react renders live in one client-boundary file like this one, per
 * component. Necessary because dial-react's own components have no "use client" directive in
 * their source (correct for a plain component library — not something to add there) and use
 * hooks internally, so importing them into a Server Component (which page.mdx is, by default)
 * fails at build time. The page.mdx file itself never imports dial-react directly — it only
 * imports the named exports below and passes them to <Demo>.
 */
import { Popover, Button, FormField, Input } from 'dial-react';

export function BasicPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline">Filters</Button>
      </Popover.Trigger>
      <Popover.Content>
        <p style={{ margin: 0 }}>Filter options go here.</p>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  );
}

export function ModalPopover() {
  return (
    <Popover.Root modal>
      <Popover.Trigger asChild>
        <Button variant="outline">Modal popover</Button>
      </Popover.Trigger>
      <Popover.Content side="right">
        <p style={{ margin: 0 }}>This popover traps focus like a mini-modal.</p>
        <Popover.Close asChild>
          <Button variant="ghost" size="sm">
            Close
          </Button>
        </Popover.Close>
      </Popover.Content>
    </Popover.Root>
  );
}

export function FormPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline">Add contact</Button>
      </Popover.Trigger>
      <Popover.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-stack-sm)' }}>
          <FormField label="Name">
            <Input placeholder="Jane Doe" />
          </FormField>
          <FormField label="Email">
            <Input type="email" placeholder="jane@example.com" />
          </FormField>
          <Popover.Close asChild>
            <Button size="sm">Save</Button>
          </Popover.Close>
        </div>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  );
}
