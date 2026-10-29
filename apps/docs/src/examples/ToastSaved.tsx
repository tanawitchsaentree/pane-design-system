// @example A toast after an action
import { useState } from 'react';
import { Button, Toast } from 'pane-react';

export default function ToastSaved() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="glass" onClick={() => setOpen(true)}>Order print</Button>
      <Toast open={open} onOpenChange={setOpen} tone="positive" title="Print ordered" description="It ships within a week." />
    </>
  );
}
