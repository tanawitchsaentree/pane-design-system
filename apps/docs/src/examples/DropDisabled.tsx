// @example Full until a photo is removed
import { Card, Dropzone } from 'pane-react';

export default function DropDisabled() {
  return <Card as="div" className="demo-card"><Dropzone label="Album is full" hint="Remove a photo to add another" disabled /></Card>;
}
