// @example A taller note
import { Card, FormField, Textarea } from 'pane-react';

export default function TextareaRows() {
  return (
    <Card as="section" aria-label="Note" className="demo-card">
      <FormField label="Note to the printer" help="Paper, size and anything else they should know.">
        <Textarea rows={5} />
      </FormField>
    </Card>
  );
}
