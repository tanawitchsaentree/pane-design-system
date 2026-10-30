// @example One profile photo
import { Card, FileUpload } from 'pane-react';

export default function UploadOne() {
  return <Card as="div" className="demo-card"><FileUpload label="Photo" accept="image/*" hint="A square photo works best" /></Card>;
}
