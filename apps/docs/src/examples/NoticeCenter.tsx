// @example Notices from today and earlier
import { Card, NotificationCenter } from 'pane-react';

export default function NoticeCenter() {
  return <Card as="div" className="demo-card demo-wide"><NotificationCenter preview notices={[{ id: '1', title: 'Mara commented on Lofoten, March', body: 'The blue in the water is perfect.', time: '2 min ago', group: 'Today', unread: true }, { id: '2', title: 'Order 104 233 shipped', time: '1 hour ago', group: 'Today', unread: true }, { id: '3', title: 'Jon saved Senja at night', time: 'Yesterday', group: 'Earlier' }]} onMarkAllRead={() => {}} /></Card>;
}
