// @example A count under the field when there is a limit
import { FormField, Input } from 'pane-react';

export default function InputCount() {
  return <FormField label="Print title"><Input maxLength={40} showCount defaultValue="Lofoten, March" /></FormField>;
}
