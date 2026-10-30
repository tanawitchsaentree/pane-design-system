// @example Opened from code
import { useState } from 'react';
import { Button, Dialog } from 'pane-react';

export default function DialogControlled() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="glass" onClick={() => setOpen(true)}>Sign out</Button>
      <Dialog open={open} onOpenChange={setOpen} title="Sign out of Pane?" actions={<><Button variant="glass" onClick={() => setOpen(false)}>Stay</Button><Button onClick={() => setOpen(false)}>Sign out</Button></>} />
    </>
  );
}
