// @example Wide keys
import { Card, Kbd, Text } from 'pane-react';

export default function KbdWide() {
  return (
    <Card as="div" className="demo-card">
      <Text>Hold <Kbd>Shift</Kbd> and press <Kbd>Enter</Kbd> for a new line.</Text>
    </Card>
  );
}
