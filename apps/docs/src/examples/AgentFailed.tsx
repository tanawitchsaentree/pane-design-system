// @example Failed, with Retry
import { AgentStatus, Button, Card } from 'pane-react';

export default function AgentFailed() {
  return <Card as="div" className="demo-card demo-wide"><AgentStatus state="failed" title="Could not book the appointment" action={<Button variant="glass" size="sm">Retry</Button>} steps={[{ label: 'Found a free time', state: 'done' }, { label: 'Booked it', state: 'failed' }]} /></Card>;
}
