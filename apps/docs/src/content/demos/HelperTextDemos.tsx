'use client';

import { useId } from 'react';
import { HelperText, Label, Input, FormField, Stack } from 'dial-react';

export function BasicHelperText() {
  return <HelperText>We'll never share your email with anyone else.</HelperText>;
}

export function ErrorHelperText() {
  return <HelperText tone="error">Please enter a valid email address.</HelperText>;
}

export function HelperTextWithManualInput() {
  const fieldId = useId();
  const helperId = `${fieldId}-helper`;
  return (
    <Stack gap="100">
      <Label htmlFor={fieldId}>Email</Label>
      <Input id={fieldId} type="email" aria-describedby={helperId} placeholder="you@example.com" />
      <HelperText id={helperId}>We'll never share your email with anyone else.</HelperText>
    </Stack>
  );
}

export function HelperTextInFormField() {
  return (
    <FormField
      label="Password"
      invalid
      helperText="Password must be at least 8 characters."
    >
      <Input type="password" defaultValue="abc" />
    </FormField>
  );
}
