// @example A single cover image
import { Card, Dropzone } from 'pane-react';

export default function DropOne() {
  return <Card as="div" className="demo-card"><Dropzone label="Drop a cover image" hint="One image, at least 2000 px wide" accept="image/*" /></Card>;
}
