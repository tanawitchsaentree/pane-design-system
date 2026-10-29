// @example The type steps
import { Card, Stack, Text } from 'pane-react';

export default function TextSizes() {
  return (
    <Card as="div" className="demo-card">
      <Stack gap="sm">
        <Text size="reading">Reading, 16px, for paragraphs people read through.</Text>
        <Text>Body, 15px, the default for interface text.</Text>
        <Text size="label">Label, 14px, beside controls.</Text>
        <Text size="caption" tone="secondary">Caption, 13px, under media.</Text>
        <Text size="micro" tone="secondary">MICRO, 11px, for counts</Text>
      </Stack>
    </Card>
  );
}
