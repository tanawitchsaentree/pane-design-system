// @example Over a scrolling list
import { Card, FAB, Stack, Text } from 'pane-react';
import { IconPin } from '../icons';

export default function FABOverList() {
  return <Card as="div" className="demo-card demo-phone"><Stack gap="sm">{['Lofoten', 'Senja', 'Vík'].map((t) => <Text key={t}>{t}</Text>)}</Stack><FAB position="contained" icon={<IconPin />} label="Add place" /></Card>;
}
