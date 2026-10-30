// @example A limit on how many
import { Card, TagInput } from 'pane-react';

export default function TagInputMax() {
  return <Card as="div" className="demo-card"><TagInput label="Keywords" max={3} hint="Up to three keywords." defaultValue={['night', 'harbour', 'rain']} /></Card>;
}
