// @example A four-digit code
import { Card, FormField, PinInput } from 'pane-react';

export default function PinInputShort() {
  return (
    <Card as="section" aria-label="Unlock" className="demo-card">
      <FormField label="Passcode" help="The four digits you set for this device.">
        <PinInput length={4} />
      </FormField>
    </Card>
  );
}
