// @example A warning for a value that is allowed but worth a second look
import { FormField, Input } from 'pane-react';

export default function FormFieldWarning() {
  return <FormField label="Send to" warning="This will notify 2,000 people."><Input defaultValue="Everyone" /></FormField>;
}
