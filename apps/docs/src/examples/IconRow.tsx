// @example Icons in a details row
import { Card, Flex, Icon, Text } from 'pane-react';
import { IconCalendar, IconLink, IconPin } from '../icons';

export default function IconRow() {
  return (
    <Card as="div" className="demo-card">
      <Flex gap="lg" wrap><Flex gap="xs"><Icon size="sm"><IconPin /></Icon><Text size="label">Bergen</Text></Flex><Flex gap="xs"><Icon size="sm"><IconLink /></Icon><Text size="label">maralind.no</Text></Flex><Flex gap="xs"><Icon size="sm"><IconCalendar /></Icon><Text size="label">Since 2019</Text></Flex></Flex>
    </Card>
  );
}
