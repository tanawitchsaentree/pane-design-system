// @example A caption edited in place
import { Card, Editable } from 'pane-react';

export default function EditBody() {
  return <Card as="div" className="demo-card"><Editable label="Caption" defaultValue="Reine at first light, from the bridge." /></Card>;
}
