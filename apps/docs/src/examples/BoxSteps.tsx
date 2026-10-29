// @example The padding steps side by side
import { Box, Card, Flex } from 'pane-react';

export default function BoxSteps() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="md" wrap align="end">{(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => <Flex key={s} direction="column" gap="xs"><Box padding={s} radius="inner" className="demo-box"><span className="demo-swatch" /></Box><span className="demo-label">{s}</span></Flex>)}</Flex>
    </Card>
  );
}
