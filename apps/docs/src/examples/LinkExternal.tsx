// @example A link that opens a new tab
import { Card, Link, Text } from 'pane-react';

export default function LinkExternal() {
  return (
    <Card as="div" className="demo-card">
      <Text>Photos licensed from <Link href="https://unsplash.com" external>Unsplash</Link>.</Text>
    </Card>
  );
}
