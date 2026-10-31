// @example A step that is still running
import { Card, ChatToolCall } from 'pane-react';

export default function ChatToolRunning() {
  return <Card as="div" className="demo-card"><ChatToolCall title="Searching your records" state="running" /></Card>;
}
