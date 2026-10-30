// @example Wrong, with the reason in words
import { Card, FormField, RichTextEditor } from 'pane-react';

export default function RichTextEditorInvalid() {
  return <Card as="div" className="demo-card"><FormField label="Description" error="Describe the print in a sentence or two"><RichTextEditor placeholder="What makes this print" /></FormField></Card>;
}
