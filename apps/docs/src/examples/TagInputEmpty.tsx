// @example Starting empty
import { Card, TagInput } from 'pane-react';

export default function TagInputEmpty() {
  return <Card as="div" className="demo-card"><TagInput label="Guests" placeholder="Type a name" /></Card>;
}
