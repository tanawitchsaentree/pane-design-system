// @example An answer still arriving
import { Card, ChatMessage, ChatToolCall } from 'pane-react';

export default function ChatStreaming() {
  return (
    <Card as="div" className="demo-card demo-wide">
      <ChatMessage sender="assistant" author="Lumen" streaming steps={<ChatToolCall title="Reading your last results" state="running" />}>
        Your cholesterol has come down since March, from 6.1 to
      </ChatMessage>
    </Card>
  );
}
