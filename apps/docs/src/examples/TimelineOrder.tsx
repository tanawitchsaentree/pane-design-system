// @example Where an order is
import { Card, Timeline } from 'pane-react';

export default function TimelineOrder() {
  return <Card as="div" className="demo-card"><Timeline label="Order history" items={[{ time: '3 March, 09:40', title: 'Ordered', description: 'Two prints, paid by card.' }, { time: '3 March, 14:12', title: 'Printed and packed' }, { time: '4 March', title: 'Out for delivery', state: 'current' }, { time: 'Expected 5 March', title: 'Delivered', state: 'upcoming' }]} /></Card>;
}
