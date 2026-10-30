// @example An album title edited in place
import { Card, Editable } from 'pane-react';

export default function EditTitle() {
  return <Card as="div" className="demo-card"><Editable label="Album title" size="title" defaultValue="Lofoten, winter" /></Card>;
}
