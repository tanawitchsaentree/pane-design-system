// @example An error under its field
import { Card, FormField, Input } from 'pane-react';

export default function HelperTextError() {
  return (
    <Card as="section" aria-label="Profile" className="demo-card">
      <FormField label="Website" error="Start the address with https://, such as https://maralind.no.">
        <Input defaultValue="maralind.no" />
      </FormField>
    </Card>
  );
}
