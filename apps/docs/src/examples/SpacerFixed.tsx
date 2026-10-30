// @example A fixed step between two groups
import { Button, Card, Flex, Spacer } from 'pane-react';

export default function SpacerFixed() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm"><Button variant="glass" size="sm">Bold</Button><Button variant="glass" size="sm">Italic</Button><Spacer size="xl" /><Button variant="glass" size="sm">Link</Button></Flex>
    </Card>
  );
}
