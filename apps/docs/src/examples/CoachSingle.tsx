// @example One hint with no tour
import { Button, Card, CoachMark } from 'pane-react';

export default function CoachSingle() {
  return <Card as="div" className="demo-card"><CoachMark preview open side="top" title="New: print sizes" description="Every print now comes in three sizes." onNext={() => {}} onSkip={() => {}}><Button variant="glass">Sizes</Button></CoachMark></Card>;
}
