// @example An error for the whole group
import { Checkbox, Fieldset } from 'pane-react';

export default function FieldsetError() {
  return <Fieldset legend="Paper" error="Choose at least one paper."><Checkbox label="Matte" /><Checkbox label="Gloss" /></Fieldset>;
}
