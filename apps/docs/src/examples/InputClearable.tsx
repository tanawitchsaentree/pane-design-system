// @example A clear button once there is text
import { FormField, Input } from 'pane-react';

export default function InputClearable() {
  return <FormField label="Filter prints"><Input clearable defaultValue="Lofoten" /></FormField>;
}
