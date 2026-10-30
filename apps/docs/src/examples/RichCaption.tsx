// @example A caption with a link
import { Card, FormField, RichTextEditor } from 'pane-react';

export default function RichCaption() {
  return <Card as="div" className="demo-card"><FormField label="Caption"><RichTextEditor defaultValue="<p>Reine at first light, from the <strong>bridge</strong>.</p>" placeholder="Say something about the print" /></FormField></Card>;
}
