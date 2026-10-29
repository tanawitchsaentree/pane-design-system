// @example A plan still to come
import { Card, Timeline } from 'pane-react';

export default function TimelinePlan() {
  return <Card as="div" className="demo-card"><Timeline label="Exhibition plan" items={[{ time: 'April', title: 'Choose the prints', state: 'current' }, { time: 'May', title: 'Frame and hang', state: 'upcoming' }, { time: 'June', title: 'Opening night', state: 'upcoming' }]} /></Card>;
}
