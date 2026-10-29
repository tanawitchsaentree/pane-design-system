// @example Loading a pane
import { Card, Flex, Spinner, Text } from 'pane-react';

export default function SpinnerInCard() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="md"><Spinner label="Loading trips" /><Text tone="secondary">Loading trips…</Text></Flex>
    </Card>
  );
}
