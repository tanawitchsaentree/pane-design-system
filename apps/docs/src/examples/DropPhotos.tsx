// @example Photos for a new album
import { Card, Dropzone } from 'pane-react';

export default function DropPhotos() {
  return <Card as="div" className="demo-card"><Dropzone label="Drop photos here or choose files" hint="JPG or PNG, up to 20 MB each" accept="image/*" multiple maxSize={20 * 1024 * 1024} /></Card>;
}
