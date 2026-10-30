// @example A link in a caption
import { Card, Link, Text } from 'pane-react';

export default function LinkInCaption() {
  return (
    <Card as="div" className="demo-card">
      <Text size="caption" tone="secondary">Map data from <Link href="#osm">OpenStreetMap</Link> contributors.</Text>
    </Card>
  );
}
