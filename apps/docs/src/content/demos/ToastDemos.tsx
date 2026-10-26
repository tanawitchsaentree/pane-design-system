'use client';

/**
 * Toast is provider+hook based, not a plain rendered component — ToastProvider must be an
 * ancestor of anything calling useToast(). Each exported demo below is a single component that
 * mounts its own ToastProvider around an inner trigger button, so <Demo> can render it directly
 * like any other component without the MDX page needing to know about the provider.
 */
import { ToastProvider, useToast, ToastAction } from 'dial-react';
import { Button } from 'dial-react';

function BasicToastTrigger() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: 'Saved',
          description: 'Your changes have been saved.',
        })
      }
    >
      Show toast
    </Button>
  );
}

export function BasicToast() {
  return (
    <ToastProvider>
      <BasicToastTrigger />
    </ToastProvider>
  );
}

function VariantToastTrigger() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Button
        intent="danger"
        variant="outline"
        onClick={() =>
          toast({
            title: 'Upload failed',
            description: 'Check your connection and try again.',
            variant: 'danger',
          })
        }
      >
        Danger toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Storage almost full',
            description: 'You have used 90% of your quota.',
            variant: 'warning',
          })
        }
      >
        Warning toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Deploy complete',
            description: 'Your site is live.',
            variant: 'success',
          })
        }
      >
        Success toast
      </Button>
    </div>
  );
}

export function VariantToast() {
  return (
    <ToastProvider>
      <VariantToastTrigger />
    </ToastProvider>
  );
}

function ActionToastTrigger() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: 'Message deleted',
          action: <ToastAction altText="Undo deleting the message">Undo</ToastAction>,
        })
      }
    >
      Show toast with action
    </Button>
  );
}

export function ActionToast() {
  return (
    <ToastProvider>
      <ActionToastTrigger />
    </ToastProvider>
  );
}

function PlacementToastTrigger() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: 'Synced',
          description: 'Your changes have been synced.',
        })
      }
    >
      Show toast (top-left)
    </Button>
  );
}

export function PlacementToast() {
  return (
    <ToastProvider placement="top-left">
      <PlacementToastTrigger />
    </ToastProvider>
  );
}
