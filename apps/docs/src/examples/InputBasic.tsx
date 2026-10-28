// @example A text field in a FormField
import { Card, FormField, Input } from 'pane-react';

export default function InputBasic() {
  return (
    <Card as="section" aria-label="Profile" className="demo-card">
      <FormField label="Display name" help="Shown on your profile and posts.">
        <Input defaultValue="Mara Lind" autoComplete="name" />
      </FormField>
    </Card>
  );
}
