// @example Baseline alignment for a number and its unit
import { Card, Flex } from 'pane-react';

export default function FlexBaseline() {
  return (
    <Card as="div" className="demo-card">
      <Flex align="baseline" gap="xs"><span className="demo-big">30</span><span>minutes left</span></Flex>
    </Card>
  );
}
