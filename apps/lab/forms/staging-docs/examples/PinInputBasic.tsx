// @example A six-digit code
import { Card, FormField, PinInput } from 'pane-react';

export default function PinInputBasic() {
  return (
    <Card as="section" aria-label="Verify" className="demo-card">
      <FormField label="Verification code" help="We sent it to +47 ••• •• 214.">
        <PinInput length={6} />
      </FormField>
    </Card>
  );
}
