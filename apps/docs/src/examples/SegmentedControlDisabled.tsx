// @example Off while the map loads
import { Card, SegmentedControl } from 'pane-react';

export default function SegmentedControlDisabled() {
  return <Card as="div" className="demo-card"><SegmentedControl label="View" disabled defaultValue="map" options={[{ value: 'map', label: 'Map' }, { value: 'list', label: 'List' }]} /></Card>;
}
