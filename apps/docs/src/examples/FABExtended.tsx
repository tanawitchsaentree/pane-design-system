// @example Extended with its label
import { Card, FAB, Text } from 'pane-react';
import { IconPencil } from '../icons';

export default function FABExtended() {
  return <Card as="div" className="demo-card demo-phone"><Text>Drafts</Text><FAB position="contained" extended icon={<IconPencil />} label="New post" /></Card>;
}
