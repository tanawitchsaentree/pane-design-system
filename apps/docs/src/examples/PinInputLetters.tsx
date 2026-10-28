// @example A code with letters
import { Card, FormField, PinInput } from 'pane-react';

export default function PinInputLetters() {
  return (
    <Card as="section" aria-label="Invite" className="demo-card">
      <FormField label="Invite code" help="Letters and digits, as printed on the card.">
        <PinInput length={4} type="alphanumeric" />
      </FormField>
    </Card>
  );
}
