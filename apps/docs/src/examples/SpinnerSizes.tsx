// @example The two sizes
import { Card, Flex, Spinner, Text } from 'pane-react';

export default function SpinnerSizes() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="lg"><Flex gap="xs"><Spinner size="sm" /><Text size="label">sm</Text></Flex><Flex gap="xs"><Spinner /><Text size="label">md</Text></Flex></Flex>
    </Card>
  );
}
