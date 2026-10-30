// @example Locked once the print is listed
import { Card, FormField, RichTextEditor } from 'pane-react';

export default function RichDisabled() {
  return <Card as="div" className="demo-card"><FormField label="Description"><RichTextEditor disabled defaultValue="<p>An edition of 25, signed and numbered.</p>" /></FormField></Card>;
}
