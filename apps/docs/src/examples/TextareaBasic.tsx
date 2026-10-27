// @example A bio that can grow
import { Card, FormField, Textarea } from 'pane-react';

export default function TextareaBasic() {
  return (
    <Card as="section" aria-label="Profile" className="demo-card">
      <FormField label="Bio" help="Up to 160 characters.">
        <Textarea defaultValue="Landscape photographer in Bergen. Prints on request." />
      </FormField>
    </Card>
  );
}
