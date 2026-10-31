// @example No padding, for a frame that only clips
import { Box, Card } from 'pane-react';

export default function BoxNone() {
  return (
    <Card as="div" className="demo-card">
      <Box padding="none" radius="inner" className="demo-box-media"><img src="/scenes/night-sm.jpg" alt="" className="demo-fill" /></Box>
    </Card>
  );
}
