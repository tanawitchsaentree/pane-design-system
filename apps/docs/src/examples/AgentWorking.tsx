// @example Working through steps
import { AgentStatus, Button, Card } from 'pane-react';

export default function AgentWorking() {
  return <Card as="div" className="demo-card demo-wide"><AgentStatus state="working" title="Preparing your referral" elapsed="12 s" action={<Button variant="ghost" size="sm">Stop</Button>} steps={[{ label: 'Read your notes', state: 'done' }, { label: 'Fill in the form', state: 'current' }, { label: 'Send to the clinic', state: 'upcoming' }]} /></Card>;
}
