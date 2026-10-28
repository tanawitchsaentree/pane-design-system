// @example A price with its currency
import { Card, FormField, Input, InputGroup } from 'pane-react';

export default function InputGroupBasic() {
  return (
    <Card as="div" className="demo-card">
      <FormField label="Print price">
        <InputGroup end="NOK"><Input inputMode="decimal" defaultValue="950" /></InputGroup>
      </FormField>
    </Card>
  );
}
