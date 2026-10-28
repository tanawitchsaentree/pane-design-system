// @example A disabled field
import { Card, FormField, Input } from 'pane-react';

export default function FormFieldDisabled() {
  return (
    <Card as="section" aria-label="Account" className="demo-card">
      <FormField label="Username" help="Usernames can be changed once a year." disabled>
        <Input defaultValue="maralind" />
      </FormField>
    </Card>
  );
}
