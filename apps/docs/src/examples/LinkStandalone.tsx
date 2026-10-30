// @example A standalone link under a card
import { Card, Link, Text } from 'pane-react';

export default function LinkStandalone() {
  return (
    <Card as="div" className="demo-card">
      <Text tone="secondary">12 trips planned this year.</Text>
      <Link variant="standalone" href="#trips">See all trips</Link>
    </Card>
  );
}
