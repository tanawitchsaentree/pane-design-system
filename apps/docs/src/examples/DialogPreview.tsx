// @example The dialog drawn in place
import { Button, Dialog } from 'pane-react';

export default function DialogPreview() {
  return (
    <Dialog preview title="Discard this draft?" description="Your changes to Lauterbrunnen trip will be lost." actions={<><Button variant="glass">Keep editing</Button><Button>Discard</Button></>} />
  );
}
