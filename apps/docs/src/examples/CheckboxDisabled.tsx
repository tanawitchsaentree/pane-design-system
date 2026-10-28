// @example Disabled, with the reason
import { Card, Checkbox } from 'pane-react';

export default function CheckboxDisabled() {
  return (
    <Card as="section" aria-label="Privacy" className="demo-card">
      <Checkbox label="Show my phone number" description="Add a phone number in Account first." disabled />
    </Card>
  );
}
