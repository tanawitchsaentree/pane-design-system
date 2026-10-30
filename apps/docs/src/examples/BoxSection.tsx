// @example A box rendered as a section
import { Box, Card } from 'pane-react';

export default function BoxSection() {
  return (
    <Card as="div" className="demo-card">
      <Box as="section" aria-labelledby="bs-h" padding="md" className="demo-box">
        <h3 id="bs-h" className="flush">Shipping</h3>
        <p className="flush">Prints ship within a week.</p>
      </Box>
    </Card>
  );
}
