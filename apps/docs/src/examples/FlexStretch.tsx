// @example Items stretched to the same height
import { Card, Flex, Text } from 'pane-react';

export default function FlexStretch() {
  return (
    <Card as="div" className="demo-card">
      <Flex align="stretch" gap="sm"><div className="demo-box demo-pad"><Text>Short</Text></div><div className="demo-box demo-pad"><Text>A longer note that wraps onto a second line</Text></div></Flex>
    </Card>
  );
}
