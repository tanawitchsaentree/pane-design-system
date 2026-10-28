// @example Cross-axis alignment
import { Badge, Card, Stack } from 'pane-react';

export default function StackAlign() {
  return (
    <Card as="div" className="demo-card">
      {(['start', 'center', 'end'] as const).map((a) => (
        <Stack key={a} gap="xs" align={a} className="align-row"><Badge>{a}</Badge></Stack>
      ))}
    </Card>
  );
}
