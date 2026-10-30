// @example A confirmation dialog
import { Button, Dialog } from 'pane-react';

export default function DialogConfirm() {
  return (
    <Dialog trigger={<Button variant="glass">Discard draft</Button>} title="Discard this draft?" description="Your changes to Lauterbrunnen trip will be lost."
      actions={<><Dialog.Close asChild><Button variant="glass">Keep editing</Button></Dialog.Close><Dialog.Close asChild><Button>Discard</Button></Dialog.Close></>} />
  );
}
