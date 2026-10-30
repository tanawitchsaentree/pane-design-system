// @example Free space in a column keeps the footer at the bottom
import { Button, Card, Flex, Spacer } from 'pane-react';

export default function SpacerColumn() {
  return (
    <Card as="div" className="demo-card">
      <Flex direction="column" align="stretch" gap="sm" className="demo-tall">
        <h3 className="flush">Upload</h3><p className="flush">Drop photos here.</p><Spacer /><Button>Done</Button>
      </Flex>
    </Card>
  );
}
