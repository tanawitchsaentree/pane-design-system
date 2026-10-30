// @example An empty comment
import { Card, FormField, RichTextEditor } from 'pane-react';

export default function RichEmpty() {
  return <Card as="div" className="demo-card"><FormField label="Comment" help="Bold, italic, lists and links."><RichTextEditor placeholder="Write a comment" rows={3} /></FormField></Card>;
}
