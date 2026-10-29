// @example Padding from the scale
import { Box, Card } from 'pane-react';

export default function BoxPadding() {
  return (
    <Card as="div" className="demo-card">
      <Box padding="lg" radius="inner" className="demo-box">
        <p className="flush">Box gives this note 12px on every side and the inner corner, and draws nothing else.</p>
      </Box>
    </Card>
  );
}
