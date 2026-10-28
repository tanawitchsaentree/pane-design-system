// @example Two sizes
import { Card, Select } from 'pane-react';

const OPTIONS = [{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }];

export default function SelectSizes() {
  return (
    <Card as="div" className="demo-card">
      <Select label="View (md, 44px)" defaultValue="week" options={OPTIONS} />
      <Select label="View (sm, 32px)" size="sm" defaultValue="week" options={OPTIONS} />
    </Card>
  );
}
