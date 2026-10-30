// @example An empty state in the middle of a card
import { Button, Card, Center, Stack } from 'pane-react';

export default function CenterEmpty() {
  return (
    <Card as="div" className="demo-card">
      <Center className="demo-center">
        <Stack gap="sm" align="center"><h3 className="flush">No trips yet</h3><p className="flush">Saved trips show up here.</p><Button variant="glass" size="sm">Plan a trip</Button></Stack>
      </Center>
    </Card>
  );
}
