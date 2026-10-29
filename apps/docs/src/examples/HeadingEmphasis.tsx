// @example The emphasis size for a list heading
import { Card, Heading, Text } from 'pane-react';

export default function HeadingEmphasis() {
  return (
    <Card as="div" className="demo-card">
      <Heading level={3} size="emphasis">Packing list</Heading>
      <Text>Wool layers, a shell and boots.</Text>
    </Card>
  );
}
