// @example One line with an ellipsis
import { Card, Text } from 'pane-react';

export default function TextTruncate() {
  return (
    <Card as="div" className="demo-card demo-narrow">
      <Text truncate title="Lauterbrunnen valley, Bernese Oberland, Switzerland">Lauterbrunnen valley, Bernese Oberland, Switzerland</Text>
    </Card>
  );
}
