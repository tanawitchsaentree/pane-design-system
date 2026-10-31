// @example A warning for a value that is allowed but worth a second look
import { Card, FormField, Input } from 'pane-react';

export default function FormFieldWarning() {
  return <Card as="div" className="demo-card"><FormField label="Send to" warning="This will notify 2,000 people."><Input defaultValue="Everyone" /></FormField></Card>;
}
