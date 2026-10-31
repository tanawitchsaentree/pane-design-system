// @example Steps the assistant took, one that failed
import { Card, ChatMessage, ChatToolCall } from 'pane-react';

export default function ChatToolSteps() {
  return (
    <Card as="div" className="demo-card demo-wide">
      <ChatMessage sender="assistant" author="Lumen" steps={<><ChatToolCall title="Checked your prescriptions">3 active</ChatToolCall><ChatToolCall title="Looked up the pharmacy's stock" state="failed">The pharmacy did not answer.</ChatToolCall></>}>
        I could not check whether the pharmacy has it today. Your three prescriptions are all active.
      </ChatMessage>
    </Card>
  );
}
