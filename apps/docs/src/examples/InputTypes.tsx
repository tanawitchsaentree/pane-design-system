// @example The right keyboard for each field
import { Card, FormField, Input, Stack } from 'pane-react';

export default function InputTypes() {
  return (
    <Card as="section" aria-label="Contact" className="demo-card">
      <Stack gap="md">
        <FormField label="Email"><Input type="email" autoComplete="email" defaultValue="mara@example.com" /></FormField>
        <FormField label="Phone"><Input type="tel" inputMode="tel" autoComplete="tel" defaultValue="+47 912 34 567" /></FormField>
      </Stack>
    </Card>
  );
}
