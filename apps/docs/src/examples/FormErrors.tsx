// @example An error summary after submit
import { useState } from 'react';
import { Button, Card, Form, FormField, Input } from 'pane-react';
import type { FormError } from 'pane-react';

export default function FormErrors() {
  const [errors, setErrors] = useState<FormError[]>([]);
  return (
    <Card as="div" className="demo-card">
      <Form errors={errors} onSubmit={(fd) => setErrors([!fd.get('email') && { field: 'fe-email', message: 'Enter an email address' }, !fd.get('postcode') && { field: 'fe-postcode', message: 'Enter a postcode, such as 8390' }].filter(Boolean) as FormError[])} actions={<Button type="submit">Continue</Button>}>
        <FormField id="fe-email" label="Email" error={errors.find((e) => e.field === 'fe-email')?.message}><Input name="email" type="email" /></FormField>
        <FormField id="fe-postcode" label="Postcode" error={errors.find((e) => e.field === 'fe-postcode')?.message}><Input name="postcode" inputMode="numeric" /></FormField>
      </Form>
    </Card>
  );
}
