// @example Off until the form is saved
import { Card, FileUpload } from 'pane-react';

export default function UploadDisabled() {
  return <Card as="div" className="demo-card"><FileUpload label="Attachments" disabled hint="Save the order first, then attach files." /></Card>;
}
