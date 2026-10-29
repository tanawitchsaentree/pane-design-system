// @example A link in a sentence
import { Card, Link, Text } from 'pane-react';

export default function LinkInline() {
  return (
    <Card as="div" className="demo-card">
      <Text>Read the <Link href="#shipping">shipping guide</Link> before you order a print.</Text>
    </Card>
  );
}
