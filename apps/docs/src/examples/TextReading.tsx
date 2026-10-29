// @example A paragraph at the reading size
import { Card, Text } from 'pane-react';

export default function TextReading() {
  return (
    <Card as="div" className="demo-card">
      <Text size="reading">The ferry leaves Bodø at three and reaches Moskenes just after six. Bring a layer for the deck; the wind off the Vestfjord is cold even in June.</Text>
    </Card>
  );
}
