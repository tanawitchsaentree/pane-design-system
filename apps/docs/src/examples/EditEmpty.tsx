// @example An empty value with a prompt
import { Card, Editable } from 'pane-react';

export default function EditEmpty() {
  return <Card as="div" className="demo-card"><Editable label="Album description" placeholder="Add a description" /></Card>;
}
