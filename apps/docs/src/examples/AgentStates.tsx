// @example Every state, each with its own glyph and word
import { AgentStatus, Card } from 'pane-react';

export default function AgentStates() {
  return (
    <Card as="div" className="demo-card demo-wide demo-stack">
      <AgentStatus state="thinking" title="Reading your question" />
      <AgentStatus state="done" title="Referral sent to Haukeland" />
      <AgentStatus state="failed" title="The clinic's system did not answer" />
    </Card>
  );
}
