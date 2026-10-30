// @example Read-only on a published print
import { Card, RichTextEditor } from 'pane-react';

export default function RichTextEditorReadOnly() {
  return <Card as="div" className="demo-card"><RichTextEditor aria-label="Description" readOnly defaultValue="<p>Printed on <b>cotton rag</b> and shipped flat.</p>" /></Card>;
}
