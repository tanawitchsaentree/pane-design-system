// @example Help for the whole group, under the legend
import { Checkbox, Fieldset } from 'pane-react';

export default function FieldsetHelp() {
  return <Fieldset legend="Notify me" help="Choose how you hear about new orders."><Checkbox label="By email" defaultChecked /><Checkbox label="On my phone" /></Fieldset>;
}
