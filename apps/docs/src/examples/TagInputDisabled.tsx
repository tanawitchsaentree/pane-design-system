// @example Off while the print is reviewed
import { Card, TagInput } from 'pane-react';

export default function TagInputDisabled() {
  return <Card as="div" className="demo-card"><TagInput label="Tags" disabled defaultValue={['fjord']} /></Card>;
}
