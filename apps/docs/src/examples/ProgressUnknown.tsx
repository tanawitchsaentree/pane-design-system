// @example A task of unknown length
import { Card, Progress } from 'pane-react';

export default function ProgressUnknown() {
  return <Card as="div" className="demo-card"><Progress label="Preparing your download" /></Card>;
}
