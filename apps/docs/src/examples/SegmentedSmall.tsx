// @example The small size in a toolbar
import { Card, Flex, SegmentedControl, Text } from 'pane-react';

export default function SegmentedSmall() {
  return <Card as="div" className="demo-card"><Flex gap="md" align="center" justify="between"><Text weight="semibold">Prints</Text><SegmentedControl size="sm" label="Sort" defaultValue="new" options={[{ value: 'new', label: 'Newest' }, { value: 'top', label: 'Most liked' }]} /></Flex></Card>;
}
