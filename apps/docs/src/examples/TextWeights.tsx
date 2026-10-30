// @example Three weights
import { Card, Stack, Text } from 'pane-react';

export default function TextWeights() {
  return (
    <Card as="div" className="demo-card">
      <Stack gap="xs"><Text weight="semibold">Semibold for a name</Text><Text weight="medium">Medium for a label</Text><Text>Regular for running text</Text></Stack>
    </Card>
  );
}
