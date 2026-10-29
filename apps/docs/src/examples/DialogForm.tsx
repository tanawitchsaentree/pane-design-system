// @example A wide dialog with a short form
import { Button, Dialog, FormField, Input } from 'pane-react';

export default function DialogForm() {
  return (
    <Dialog size="lg" trigger={<Button variant="glass">Rename trip</Button>} title="Rename trip" actions={<><Dialog.Close asChild><Button variant="glass">Cancel</Button></Dialog.Close><Dialog.Close asChild><Button>Save</Button></Dialog.Close></>}>
      <FormField label="Trip name"><Input defaultValue="Lauterbrunnen" /></FormField>
    </Dialog>
  );
}
