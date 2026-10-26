'use client';

import { FormField, Input, Textarea, Listbox } from 'dial-react';

export function BasicFormField() {
  return (
    <FormField label="Email" helperText="We'll never share your email with anyone else.">
      <Input type="email" placeholder="you@example.com" />
    </FormField>
  );
}

export function RequiredFormField() {
  return (
    <FormField label="Full name" required helperText="As it appears on your ID.">
      <Input placeholder="Jane Doe" />
    </FormField>
  );
}

export function InvalidFormField() {
  return (
    <FormField label="Bio" invalid helperText="Bio must be at least 20 characters.">
      <Textarea defaultValue="Too short" />
    </FormField>
  );
}

export function RequiredInvalidFormField() {
  return (
    <FormField
      label="Password"
      required
      invalid
      helperText="Password must be at least 8 characters."
    >
      <Input type="password" defaultValue="abc" />
    </FormField>
  );
}

export function FormFieldWithListbox() {
  return (
    <FormField label="Country" helperText="Used to set your default currency.">
      <Listbox>
        <Listbox.Item key="th">Thailand</Listbox.Item>
        <Listbox.Item key="jp">Japan</Listbox.Item>
        <Listbox.Item key="us">United States</Listbox.Item>
      </Listbox>
    </FormField>
  );
}
