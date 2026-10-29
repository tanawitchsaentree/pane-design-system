// @example An icon that means something on its own
import { Card, Flex, Icon, Text } from 'pane-react';
import { IconVerified } from '../icons';

export default function IconLabelled() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="xs"><Text weight="semibold">Visual Flow</Text><Icon label="Verified account"><IconVerified label="" /></Icon></Flex>
    </Card>
  );
}
