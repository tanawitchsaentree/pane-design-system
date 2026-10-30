// @example The two icon sizes
import { Card, Flex, Icon, Text } from 'pane-react';
import { IconCalendar } from '../icons';

export default function IconSizes() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="lg"><Flex gap="xs"><Icon size="sm"><IconCalendar /></Icon><Text size="label">sm, 16px</Text></Flex><Flex gap="xs"><Icon><IconCalendar /></Icon><Text>md, 18px</Text></Flex></Flex>
    </Card>
  );
}
