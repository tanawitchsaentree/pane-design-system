// @example The main action of a feed
import { Card, FAB, Text } from 'pane-react';
import { IconPencil } from '../icons';

export default function FABCompose() {
  return (
    <Card as="div" className="demo-card demo-phone"><Text>Feed</Text><FAB position="contained" icon={<IconPencil />} label="New post" /></Card>
  );
}
