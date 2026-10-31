// @example An error for the whole group
import { Card, Checkbox, Fieldset } from 'pane-react';

export default function FieldsetError() {
  return <Card as="div" className="demo-card"><Fieldset legend="Paper" error="Choose at least one paper."><Checkbox label="Matte" /><Checkbox label="Gloss" /></Fieldset></Card>;
}
