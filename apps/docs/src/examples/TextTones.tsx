// @example Primary and secondary tone
import { Card, Text } from 'pane-react';

export default function TextTones() {
  return (
    <Card as="div" className="demo-card">
      <Text weight="semibold">Lofoten in March</Text>
      <Text tone="secondary">Six nights · 4 people · from 1 March</Text>
    </Card>
  );
}
