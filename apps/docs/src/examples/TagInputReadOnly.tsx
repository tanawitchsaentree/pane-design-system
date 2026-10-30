// @example Read-only on a published print
import { Card, TagInput } from 'pane-react';

export default function TagInputReadOnly() {
  return <Card as="div" className="demo-card"><TagInput label="Tags" readOnly defaultValue={['fjord', 'night']} /></Card>;
}
