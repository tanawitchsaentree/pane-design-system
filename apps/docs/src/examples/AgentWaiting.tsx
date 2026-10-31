// @example Waiting for the reader to answer
import { AgentStatus, Button, Card } from 'pane-react';

export default function AgentWaiting() {
  return <Card as="div" className="demo-card demo-wide"><AgentStatus state="waiting" title="Which clinic should get the referral?" action={<Button size="sm">Answer</Button>} /></Card>;
}
