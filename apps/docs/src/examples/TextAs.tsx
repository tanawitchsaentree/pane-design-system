// @example Rendered as a span inside a sentence
import { Card, Text } from 'pane-react';

export default function TextAs() {
  return (
    <Card as="div" className="demo-card">
      <Text>Leaves at <Text as="span" weight="semibold">07:40</Text> from platform 3.</Text>
    </Card>
  );
}
