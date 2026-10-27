// @example A named group of fields
import { Card, Fieldset, FormField, Input } from 'pane-react';

export default function FieldsetAddress() {
  return (
    <Card as="section" aria-label="Shipping" className="demo-card">
      <Fieldset legend="Shipping address" help="Prints ship within a week.">
        <FormField label="Street"><Input defaultValue="Bryggen 12" autoComplete="street-address" /></FormField>
        <FormField label="Postcode"><Input defaultValue="5003" autoComplete="postal-code" inputMode="numeric" /></FormField>
        <FormField label="City"><Input defaultValue="Bergen" autoComplete="address-level2" /></FormField>
      </Fieldset>
    </Card>
  );
}
