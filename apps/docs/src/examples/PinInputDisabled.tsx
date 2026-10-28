// @example Locked while it is checked
import { Card, FormField, PinInput } from 'pane-react';

export default function PinInputDisabled() {
  return (
    <Card as="section" aria-label="Verify" className="demo-card">
      <FormField label="Sign-in code" help="Checking the code." disabled>
        <PinInput length={6} defaultValue="381904" />
      </FormField>
    </Card>
  );
}
