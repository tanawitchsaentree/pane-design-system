// @example Disabled, with the reason beside it
import { Card, Select } from 'pane-react';

export default function SelectDisabled() {
  return (
    <Card as="div" className="demo-card">
      <Select label="Album" disabled defaultValue="trips" options={[{ value: 'trips', label: 'Trips' }]} />
      <p className="flush muted small">Albums are locked while an upload runs.</p>
    </Card>
  );
}
