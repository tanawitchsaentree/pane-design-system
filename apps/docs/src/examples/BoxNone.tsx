// @example No padding, for a frame that only clips
import { Box, Card, Mesh } from 'pane-react';

export default function BoxNone() {
  return (
    <Card as="div" className="demo-card">
      <Box padding="none" radius="inner" className="demo-box-media"><Mesh preset="dusk" className="demo-fill" /></Box>
    </Card>
  );
}
