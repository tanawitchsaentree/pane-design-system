// @example The last mark of a tour
import { Button, Card, CoachMark } from 'pane-react';

export default function CoachLast() {
  return <Card as="div" className="demo-card"><CoachMark preview open title="Share an album" description="Anyone with the link can see it." step={3} total={3} onNext={() => {}} onSkip={() => {}}><Button variant="glass">Share</Button></CoachMark></Card>;
}
