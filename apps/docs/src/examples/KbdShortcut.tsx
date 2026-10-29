// @example A shortcut in a sentence
import { Card, Kbd, Text } from 'pane-react';

export default function KbdShortcut() {
  return (
    <Card as="div" className="demo-card">
      <Text>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search.</Text>
    </Card>
  );
}
