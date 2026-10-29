// @example An upload with its amount
import { Card, Progress } from 'pane-react';

export default function ProgressUpload() {
  return <Card as="div" className="demo-card"><Progress label="Uploading 3 photos" value={62} showValue /></Card>;
}
