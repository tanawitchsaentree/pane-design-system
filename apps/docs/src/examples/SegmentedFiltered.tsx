// @example The chosen segment changes what is shown
import { useState } from 'react';
import { Card, Flex, SegmentedControl, Text } from 'pane-react';

const COUNTS: Record<string, string> = { day: '12 photos today', week: '86 photos this week', month: '340 photos this month' };

export default function SegmentedFiltered() {
  const [range, setRange] = useState('week');
  return <Card as="div" className="demo-card"><Flex direction="column" gap="md"><SegmentedControl label="Range" value={range} onValueChange={setRange} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} /><Text tone="secondary">{COUNTS[range]}</Text></Flex></Card>;
}
