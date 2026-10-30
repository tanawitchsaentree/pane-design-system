// @example A list of care notes
import { Card, FormField, RichTextEditor } from 'pane-react';

export default function RichList() {
  return <Card as="div" className="demo-card"><FormField label="Care notes"><RichTextEditor defaultValue="<ul><li>Keep out of direct sun</li><li>Frame behind UV glass</li></ul>" /></FormField></Card>;
}
