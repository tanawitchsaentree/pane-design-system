// @example An activity log, newest first
import { Card, Timeline } from 'pane-react';

export default function TimelineActivity() {
  return <Card as="div" className="demo-card"><Timeline label="Activity" items={[{ time: 'Today, 10:02', title: 'Mara bought Lofoten, March', description: 'A 40 × 50 cm print.' }, { time: 'Yesterday', title: 'You added three prints' }, { time: '2 March', title: 'Jon left a review', description: 'Five stars: “The paper is lovely.”' }]} /></Card>;
}
