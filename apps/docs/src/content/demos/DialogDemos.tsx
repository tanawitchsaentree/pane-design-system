'use client';

import { Dialog, Button } from 'dial-react';

export function BasicDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button intent="primary">Edit profile</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>Update your name and email address.</Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function ConfirmationDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button intent="danger" variant="outline">
          Delete account
        </Button>
      </Dialog.Trigger>
      <Dialog.Content size="sm" hideCloseButton>
        <Dialog.Title>Delete account?</Dialog.Title>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)', justifyContent: 'flex-end' }}>
          <Dialog.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button intent="danger">Delete</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function SizesDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline">Full-size dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content size="full">
        <Dialog.Title>Full-screen dialog</Dialog.Title>
        <Dialog.Description>The `size=&quot;full&quot;` preset fills the viewport.</Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}
