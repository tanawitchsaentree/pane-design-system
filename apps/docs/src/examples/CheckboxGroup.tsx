// @example Several choices in a Fieldset
import { Card, Checkbox, Fieldset } from 'pane-react';

export default function CheckboxGroup() {
  return (
    <Card as="div" className="demo-card">
      <Fieldset legend="Email me about">
        <Checkbox label="New followers" defaultChecked />
        <Checkbox label="Replies to my posts" defaultChecked />
        <Checkbox label="Print orders" />
      </Fieldset>
    </Card>
  );
}
