// @example A primary and a secondary way out
import { Button, Card, EmptyState } from 'pane-react';
import { IconHome } from '../icons';
export default function EmptyTwoActions() {
  return <Card as="div" className="demo-card"><EmptyState title="Your shop is empty" description="Add your first print, or bring in prints from your old shop." icon={<IconHome />} actions={<><Button variant="light">Add a print</Button><Button variant="glass">Import prints</Button></>} /></Card>;
}
