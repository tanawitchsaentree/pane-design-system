// @example A snackbar with Undo
import { useState } from 'react';
import { Button, Snackbar } from 'pane-react';

export default function SnackbarUndo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="glass" onClick={() => setOpen(true)}>Archive</Button>
      <Snackbar open={open} onOpenChange={setOpen} message="Message archived" action={{ label: 'Undo', altText: 'Undo from the Archive folder', onClick: () => setOpen(false) }} />
    </>
  );
}
