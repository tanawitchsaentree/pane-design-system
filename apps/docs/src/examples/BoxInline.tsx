// @example Inline padding only
import { Box, Card } from 'pane-react';

export default function BoxInline() {
  return (
    <Card as="div" className="demo-card">
      <Box paddingInline="xl" paddingBlock="xs" className="demo-box"><p className="flush">Wider at the sides than above and below.</p></Box>
    </Card>
  );
}
