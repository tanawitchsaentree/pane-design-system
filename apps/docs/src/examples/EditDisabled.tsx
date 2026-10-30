// @example Fixed after the print is sold
import { Card, Editable } from 'pane-react';

export default function EditDisabled() {
  return <Card as="div" className="demo-card"><Editable label="Edition" defaultValue="12 of 25" disabled /></Card>;
}
