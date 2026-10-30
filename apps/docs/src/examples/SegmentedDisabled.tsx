// @example One segment that is not available yet
import { Card, SegmentedControl } from 'pane-react';

export default function SegmentedDisabled() {
  return <Card as="div" className="demo-card"><SegmentedControl label="Print size" defaultValue="a4" options={[{ value: 'a4', label: 'A4' }, { value: 'a3', label: 'A3' }, { value: 'a2', label: 'A2', disabled: true }]} /></Card>;
}
