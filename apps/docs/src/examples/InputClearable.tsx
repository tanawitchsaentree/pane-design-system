// @example A clear button once there is text
import { Card, FormField, Input } from 'pane-react';

export default function InputClearable() {
  return <Card as="div" className="demo-card"><FormField label="Filter prints"><Input clearable defaultValue="Lofoten" /></FormField></Card>;
}
