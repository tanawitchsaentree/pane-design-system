// @example The reader's turn, on chosen glass at the end edge
import { Card, ChatMessage } from 'pane-react';

export default function ChatUserOnly() {
  return <Card as="div" className="demo-card demo-wide"><ChatMessage sender="user" author="You" time="10:02">Can I move it to the afternoon?</ChatMessage></Card>;
}
