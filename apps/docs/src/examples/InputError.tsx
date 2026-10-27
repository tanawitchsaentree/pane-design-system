// @example An error on the field that caused it
import { Card, FormField, Input } from 'pane-react';

export default function InputError() {
  return (
    <Card as="div" className="demo-card">
      <FormField label="Email" required error="Enter an email address with an @, such as mara@example.com.">
        <Input type="email" defaultValue="mara.example.com" />
      </FormField>
    </Card>
  );
}
