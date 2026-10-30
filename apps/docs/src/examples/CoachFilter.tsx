// @example Pointing out a filter
import { Button, Card, CoachMark } from 'pane-react';

export default function CoachFilter() {
  return <Card as="div" className="demo-card"><CoachMark preview open title="Filter by place" description="Show only the prints from one place." step={1} total={3} onNext={() => {}} onSkip={() => {}}><Button variant="glass">Places</Button></CoachMark></Card>;
}
