// @example An icon beside its label
import { Card, Flex, Icon, Text } from 'pane-react';
import { IconPin } from '../icons';

export default function IconBeside() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="sm"><Icon><IconPin /></Icon><Text>Bergen, Norway</Text></Flex>
    </Card>
  );
}
