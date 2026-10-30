// @example The bell in a bar
import { Card, Flex, NotificationCenter, Text } from 'pane-react';

export default function NoticeBell() {
  return <Card as="div" className="demo-card"><Flex justify="between" align="center"><Text weight="semibold">North Light</Text><NotificationCenter notices={[{ id: '1', title: 'Mara commented on Lofoten, March', body: 'The blue in the water is perfect.', time: '2 min ago', group: 'Today', unread: true }, { id: '2', title: 'Order 104 233 shipped', time: '1 hour ago', group: 'Today', unread: true }, { id: '3', title: 'Jon saved Senja at night', time: 'Yesterday', group: 'Earlier' }]} onMarkAllRead={() => {}} /></Flex></Card>;
}
