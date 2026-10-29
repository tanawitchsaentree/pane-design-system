// @example Switch the view of one list
import { Card, SegmentedControl } from 'pane-react';

export default function SegmentedView() {
  return <Card as="div" className="demo-card"><SegmentedControl label="View" defaultValue="grid" options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }, { value: 'map', label: 'Map' }]} /></Card>;
}
