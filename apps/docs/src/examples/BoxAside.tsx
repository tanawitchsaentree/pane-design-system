// @example An aside with block padding only
import { Box, Card, Text } from 'pane-react';

export default function BoxAside() {
  return (
    <Card as="div" className="demo-card">
      <Box as="aside" aria-label="Tip" paddingBlock="md" className="demo-box"><Text size="label">Tip: prints ship faster on weekdays.</Text></Box>
    </Card>
  );
}
