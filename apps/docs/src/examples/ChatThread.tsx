// @example A short thread: the reader's turn and an answer with its steps
import { Card, ChatMessage, ChatToolCall, IconButton } from 'pane-react';

export default function ChatThread() {
  return (
    <Card as="section" aria-label="Chat with Lumen" className="demo-card demo-wide demo-stack">
      <ChatMessage sender="user" author="You" time="09:41">When is my next blood test?</ChatMessage>
      <ChatMessage sender="assistant" author="Lumen" time="09:41"
        steps={<ChatToolCall title="Searched your appointments">2 found, 1 upcoming</ChatToolCall>}
        actions={<IconButton variant="ghost" size="sm" aria-label="Copy answer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M5 15V6a1 1 0 0 1 1-1h9" /></svg></IconButton>}>
        Your next blood test is on Thursday 6 November at 08:30, at the clinic on Bryggen. Come before breakfast.
      </ChatMessage>
    </Card>
  );
}
