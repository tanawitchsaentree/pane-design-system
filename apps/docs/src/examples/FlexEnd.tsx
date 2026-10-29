// @example Actions aligned to the end
import { Button, Card, Flex, Text } from 'pane-react';

export default function FlexEnd() {
  return (
    <Card as="div" className="demo-card">
      <Text>Discard this draft?</Text>
      <Flex justify="end" gap="sm"><Button variant="glass" size="sm">Keep</Button><Button size="sm">Discard</Button></Flex>
    </Card>
  );
}
