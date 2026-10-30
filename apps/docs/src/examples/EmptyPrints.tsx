// @example No prints yet
import { Button, Card, EmptyState } from 'pane-react';
import { IconImage } from '../icons';
export default function EmptyPrints() {
  return <Card as="div" className="demo-card"><EmptyState title="No prints yet" description="Add a photo and a price to put your first print in the shop." icon={<IconImage />} actions={<Button variant="light">Add a print</Button>} /></Card>;
}
