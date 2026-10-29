// @example Every event done
import { Card, Timeline } from 'pane-react';

export default function TimelineDone() {
  return <Card as="div" className="demo-card"><Timeline label="Return" items={[{ time: '1 March', title: 'Return requested' }, { time: '2 March', title: 'Parcel received' }, { time: '3 March', title: 'Refund sent' }]} /></Card>;
}
