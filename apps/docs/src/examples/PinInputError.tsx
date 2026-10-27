// @example A wrong code
import { Card, FormField, PinInput } from 'pane-react';

export default function PinInputError() {
  return (
    <Card as="div" className="demo-card">
      <FormField label="Verification code" error="That code is not right. Check the latest text message.">
        <PinInput length={4} defaultValue="1234" />
      </FormField>
    </Card>
  );
}
