// @example Label, control, help and error
import { Card, FormField, Input } from 'pane-react';

export default function FormFieldBasic() {
  return (
    <Card as="div" className="demo-card">
      <FormField label="Website" help="Shown under your name.">
        <Input type="url" defaultValue="https://maralind.no" />
      </FormField>
    </Card>
  );
}
