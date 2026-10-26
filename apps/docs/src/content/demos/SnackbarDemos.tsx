'use client';

/**
 * Snackbar's useSnackbar() reuses Toast's underlying ToastProvider/context (per Snackbar.tsx's own
 * doc comment: "Still requires a ToastProvider ancestor ... there is no separate
 * SnackbarProvider") — so every demo here mounts ToastProvider (imported from dial-react, the same
 * provider Toast uses) around the inner trigger, exactly like ToastDemos.tsx.
 */
import { ToastProvider, useSnackbar, ToastAction } from 'dial-react';
import { Button } from 'dial-react';

function BasicSnackbarTrigger() {
  const { show } = useSnackbar();
  return <Button onClick={() => show({ message: 'Link copied to clipboard' })}>Show snackbar</Button>;
}

export function BasicSnackbar() {
  return (
    <ToastProvider>
      <BasicSnackbarTrigger />
    </ToastProvider>
  );
}

function ActionSnackbarTrigger() {
  const { show, hide } = useSnackbar();
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Button
        onClick={() =>
          show({
            message: 'Item removed',
            action: <ToastAction altText="Undo removing the item">Undo</ToastAction>,
          })
        }
      >
        Show snackbar with action
      </Button>
      <Button variant="outline" onClick={hide}>
        Hide
      </Button>
    </div>
  );
}

export function ActionSnackbar() {
  return (
    <ToastProvider>
      <ActionSnackbarTrigger />
    </ToastProvider>
  );
}

function PersistentSnackbarTrigger() {
  const { show, hide } = useSnackbar();
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-inline-md)' }}>
      <Button
        onClick={() =>
          show({
            message: 'Uploading your file — this may take a while',
            duration: Infinity,
          })
        }
      >
        Show persistent snackbar
      </Button>
      <Button variant="outline" onClick={hide}>
        Hide
      </Button>
    </div>
  );
}

export function PersistentSnackbar() {
  return (
    <ToastProvider>
      <PersistentSnackbarTrigger />
    </ToastProvider>
  );
}
