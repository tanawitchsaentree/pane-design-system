// @example Wrong, with the reason in words
import { Card, Dropzone, FormField } from 'pane-react';

export default function DropzoneInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Photo" error="Add a photo to print"><Dropzone label="Drop a photo here" hint="JPG up to 20 MB" invalid /></FormField></Card>;
}
