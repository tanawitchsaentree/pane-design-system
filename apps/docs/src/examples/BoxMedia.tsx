// @example A box holding media with the media corner
import { Box, Card } from 'pane-react';

export default function BoxMedia() {
  return (
    <Card as="div" className="demo-card">
      <Box radius="media" className="demo-box-media"><img src="/scenes/forest-sm.jpg" alt="Cover art" className="demo-fill" /></Box>
      <p className="flush">Low tide at Ramberg</p>
    </Card>
  );
}
