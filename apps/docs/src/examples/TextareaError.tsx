// @example Too long, with the count in the message
import { Card, FormField, Textarea } from 'pane-react';

export default function TextareaError() {
  return (
    <Card as="div" className="demo-card">
      <FormField label="Bio" error="Keep it under 160 characters. It is 174 now.">
        <Textarea defaultValue="Landscape photographer in Bergen, shooting fjords at blue hour and printing on cotton rag. Prints on request, shipping across Norway and the rest of Europe, usually within a week." />
      </FormField>
    </Card>
  );
}
