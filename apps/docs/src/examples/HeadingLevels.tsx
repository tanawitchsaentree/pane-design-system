// @example Levels from the outline, sizes from the scale
import { Card, Heading, Stack } from 'pane-react';

export default function HeadingLevels() {
  return (
    <Card as="div" className="demo-card">
      <Stack gap="sm"><Heading level={2} size="headline">Trips</Heading><Heading level={3}>Lofoten</Heading><Heading level={4}>Day one</Heading></Stack>
    </Card>
  );
}
